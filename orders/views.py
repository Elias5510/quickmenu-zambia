import json
import secrets
from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_http_methods, require_POST

from core.validators import normalize_zambian_phone
from dashboard.models import AnalyticsEvent
from menu.models import MenuItem
from restaurants.models import Restaurant

from .forms import CateringInquiryForm, CustomerReviewForm
from .models import CateringInquiry, CustomerReview, Order, OrderItem


DELIVERY_FEE = Decimal("10.00")
SESSION_STATE_KEY = "quickmenu_restaurant_state"


def _restaurant(slug):
    return get_object_or_404(Restaurant, slug=slug)


def _body(request):
    try:
        value = json.loads(request.body or b"{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise ValueError("Request body must be valid JSON.") from None
    if not isinstance(value, dict):
        raise ValueError("Request body must be a JSON object.")
    return value


def _state(request, restaurant):
    states = request.session.get(SESSION_STATE_KEY, {})
    return states.get(restaurant.slug, {}) if isinstance(states, dict) else {}


def _save_state(request, restaurant, state):
    states = request.session.get(SESSION_STATE_KEY, {})
    if not isinstance(states, dict):
        states = {}
    states[restaurant.slug] = state
    request.session[SESSION_STATE_KEY] = states
    request.session.modified = True


def _json_error(message, status=400, errors=None):
    payload = {"error": message}
    if errors:
        payload["errors"] = errors
    return JsonResponse(payload, status=status)


def _serialize_item(item):
    return {
        "id": item.pk,
        "name": item.name,
        "price": str(item.price),
        "qty": 0,
        "image": item.photo.url if item.photo else "",
    }


@require_http_methods(["GET", "POST"])
def restaurant_session(request, restaurant_slug):
    restaurant = _restaurant(restaurant_slug)
    if request.method == "GET":
        return JsonResponse(_state(request, restaurant))
    try:
        body = _body(request)
    except ValueError as exc:
        return _json_error(str(exc))
    state = _state(request, restaurant)
    for key in ("delivery", "cateringDraft"):
        if key in body:
            if not isinstance(body[key], dict):
                return _json_error(f"{key} must be an object.")
            state[key] = body[key]
    if "cart" in body:
        cart_data = body["cart"]
        if not isinstance(cart_data, dict):
            return _json_error("Cart must be an object.")
        clean_cart = {}
        for item_id, quantity in cart_data.items():
            try:
                item_id = int(item_id)
                quantity = int(quantity)
            except (TypeError, ValueError):
                return _json_error("Cart item IDs and quantities must be integers.")
            if quantity < 1 or quantity > 100:
                return _json_error("Item quantities must be between 1 and 100.")
            item = MenuItem.objects.filter(
                restaurant=restaurant,
                pk=item_id,
                available=True,
            ).first()
            if item is None:
                return _json_error("One or more items are no longer available.", 409)
            clean_cart[str(item.pk)] = quantity
        state["cart"] = clean_cart
    _save_state(request, restaurant, state)
    return JsonResponse(state)


@require_POST
def phone_send_code(request, restaurant_slug):
    restaurant = _restaurant(restaurant_slug)
    try:
        phone = normalize_zambian_phone(_body(request).get("phone"))
    except ValueError as exc:
        return _json_error(str(exc))
    except ValidationError as exc:
        return _json_error(exc.messages[0])
    if not settings.DEBUG:
        return _json_error(
            "Phone verification is unavailable until an SMS provider is configured.",
            503,
        )
    code = f"{secrets.randbelow(10000):04d}"
    state = _state(request, restaurant)
    state["otp"] = {
        "phone": phone,
        "code": code,
        "expires": (timezone.now() + timedelta(minutes=1)).timestamp(),
        "attempts": 0,
    }
    _save_state(request, restaurant, state)
    return JsonResponse({"sent": True, "demo_code": code, "expires_in": 60})


@require_POST
def phone_verify_code(request, restaurant_slug):
    restaurant = _restaurant(restaurant_slug)
    try:
        body = _body(request)
    except ValueError as exc:
        return _json_error(str(exc))
    state = _state(request, restaurant)
    otp = state.get("otp", {})
    if not otp or timezone.now().timestamp() > otp.get("expires", 0):
        return _json_error("Verification code expired. Request a new code.", 400)
    otp["attempts"] += 1
    if otp["attempts"] > 5 or not secrets.compare_digest(
        str(body.get("code", "")),
        otp.get("code", ""),
    ):
        state["otp"] = otp
        _save_state(request, restaurant, state)
        return _json_error("Verification code is invalid.", 400)
    state["verifiedPhone"] = otp["phone"]
    state.pop("otp", None)
    _save_state(request, restaurant, state)
    return JsonResponse({"verified": True, "phone": state["verifiedPhone"]})


@require_POST
def create_order(request, restaurant_slug):
    restaurant = _restaurant(restaurant_slug)
    try:
        data = _body(request)
        phone = normalize_zambian_phone(data.get("phone"))
    except ValueError as exc:
        return _json_error(str(exc))
    except ValidationError as exc:
        return _json_error(exc.messages[0])
    customer_name = str(data.get("customer_name", "")).strip()
    lines = data.get("items")
    if not customer_name or len(customer_name) > 160:
        return _json_error("Enter your name.")
    if not isinstance(lines, list) or not lines:
        return _json_error("Add at least one menu item.")
    quantities = {}
    for line in lines:
        if not isinstance(line, dict):
            return _json_error("Order items are invalid.")
        try:
            item_id = int(line.get("id"))
            quantity = int(line.get("quantity"))
        except (TypeError, ValueError):
            return _json_error("Order item IDs and quantities are invalid.")
        if quantity < 1 or quantity > 100:
            return _json_error("Item quantities must be between 1 and 100.")
        quantities[item_id] = quantities.get(item_id, 0) + quantity
    items = list(
        MenuItem.objects.filter(
            restaurant=restaurant,
            pk__in=quantities,
            available=True,
        )
    )
    if len(items) != len(quantities):
        return _json_error("One or more menu items are no longer available.", 409)
    subtotal = sum(
        (item.price * quantities[item.pk] for item in items),
        Decimal("0.00"),
    )
    state = _state(request, restaurant)
    delivery = data.get("delivery", {})
    if not isinstance(delivery, dict):
        return _json_error("Delivery information is invalid.")
    verified_phone = state.get("verifiedPhone")
    if verified_phone and phone != verified_phone:
        return _json_error("Use the verified phone number or verify this number first.", 403)
    with transaction.atomic():
        order = Order.objects.create(
            restaurant=restaurant,
            customer_name=customer_name,
            phone=phone,
            total=subtotal + DELIVERY_FEE,
            delivery_details=delivery,
        )
        OrderItem.objects.bulk_create(
            [
                OrderItem(
                    order=order,
                    menu_item=item,
                    name=item.name,
                    quantity=quantities[item.pk],
                    unit_price=item.price,
                )
                for item in items
            ]
        )
        AnalyticsEvent.objects.create(
            restaurant=restaurant,
            event_type=AnalyticsEvent.EventType.ORDER,
        )
    state["lastOrderId"] = order.pk
    state["cart"] = {}
    _save_state(request, restaurant, state)
    return JsonResponse(
        {
            "id": order.pk,
            "number": f"QM-{order.pk:06d}",
            "customer": order.customer_name,
            "phone": order.phone,
            "total": str(order.total),
            "status": order.status,
            "created": order.created.isoformat(),
            "items": [
                {
                    "name": item.name,
                    "quantity": item.quantity,
                    "price": str(item.unit_price),
                }
                for item in order.line_items.all()
            ],
        },
        status=201,
    )


def order_tracking(request, restaurant_slug):
    restaurant = _restaurant(restaurant_slug)
    order_id = _state(request, restaurant).get("lastOrderId")
    if not order_id:
        return _json_error("No order is available to track.", 404)
    order = get_object_or_404(
        Order.objects.prefetch_related("line_items"),
        pk=order_id,
        restaurant=restaurant,
    )
    return JsonResponse(
        {
            "id": f"QM-{order.pk:06d}",
            "createdAt": order.created.isoformat(),
            "status": order.status,
            "items": [
                {"name": line.name, "qty": line.quantity, "total": str(line.line_total)}
                for line in order.line_items.all()
            ],
            "total": str(order.total),
            "mapLink": order.delivery_details.get("mapLink", ""),
        }
    )


@require_POST
def submit_review(request, restaurant_slug):
    restaurant = _restaurant(restaurant_slug)
    data = request.POST.copy()
    try:
        tags = json.loads(request.POST.get("service_tags", "[]"))
    except json.JSONDecodeError:
        return _json_error("Review tags are invalid.")
    if not isinstance(tags, list):
        return _json_error("Review tags are invalid.")
    form = CustomerReviewForm(data)
    if not form.is_valid():
        return _json_error("Please correct the review.", errors=form.errors.get_json_data())
    review = form.save(commit=False)
    review.restaurant = restaurant
    review.service_tags = [str(tag)[:50] for tag in tags[:10]]
    session_phone = _state(request, restaurant).get("verifiedPhone")
    review.verified = bool(
        session_phone == review.phone
        and Order.objects.filter(restaurant=restaurant, phone=review.phone).exists()
    )
    review.save()
    return JsonResponse(
        {
            "review": {
                "name": review.customer_name,
                "text": review.text,
                "rating": review.rating,
                "phone": review.phone,
                "verified": review.verified,
                "serviceTags": review.service_tags,
                "createdAt": review.created.isoformat(),
            }
        },
        status=201,
    )


@require_POST
def submit_catering(request, restaurant_slug):
    restaurant = _restaurant(restaurant_slug)
    data = request.POST.copy()
    try:
        data["phone"] = normalize_zambian_phone(data.get("phone"))
    except ValidationError as exc:
        return _json_error(exc.messages[0])
    form = CateringInquiryForm(data)
    if not form.is_valid():
        return _json_error("Please correct the catering inquiry.", errors=form.errors.get_json_data())
    inquiry = form.save(commit=False)
    inquiry.restaurant = restaurant
    inquiry.save()
    return JsonResponse({"saved": True}, status=201)
