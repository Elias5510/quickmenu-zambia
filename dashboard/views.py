import json
from datetime import timedelta
from decimal import Decimal

from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
from django.db.models import Avg, Sum
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.utils import timezone
from django.views.decorators.http import require_GET
from django.views.decorators.http import require_POST
from django.views.generic import TemplateView

from gallery.forms import GalleryPhotoForm
from gallery.models import GalleryPhoto
from menu.forms import MenuCategoryForm, MenuItemForm
from menu.models import MenuCategory, MenuItem
from orders.models import Order, OrderItem
from restaurants.forms import RestaurantProfileForm
from restaurants.models import Restaurant


class OwnerDashboardView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard.html"

    def get_restaurant(self):
        try:
            return self.request.user.restaurant
        except Restaurant.DoesNotExist as exc:
            raise Http404("No restaurant is associated with this owner account.") from exc

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        restaurant = self.get_restaurant()
        context["restaurant"] = restaurant
        profile_form = kwargs.get("profile_form")
        context["profile_form"] = (
            profile_form
            if profile_form is not None
            else RestaurantProfileForm(instance=restaurant)
        )
        context["categories"] = MenuCategory.objects.filter(restaurant=restaurant)
        context["dashboard_data"] = dashboard_payload(restaurant)
        context["settings_form"] = kwargs.get("settings_form", {})
        return context

    def post(self, request, *args, **kwargs):
        restaurant = self.get_restaurant()
        form = RestaurantProfileForm(request.POST, request.FILES, instance=restaurant)
        if form.is_valid():
            form.save()
            messages.success(request, "Restaurant website details have been saved.")
            return redirect("dashboard:home")
        return self.render_to_response(self.get_context_data(profile_form=form), status=400)


@login_required
@require_GET
def dashboard_data(request):
    return JsonResponse(dashboard_payload(_owner_restaurant(request)))


def _owner_restaurant(request):
    try:
        return request.user.restaurant
    except Restaurant.DoesNotExist as exc:
        raise Http404("No restaurant is associated with this owner account.") from exc


def _error(message, status=400, errors=None):
    response = {"error": message}
    if errors:
        response["errors"] = errors
    return JsonResponse(response, status=status)


def _json_body(request):
    try:
        value = json.loads(request.body or b"{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise ValueError("Request body must be valid JSON.") from None
    if not isinstance(value, dict):
        raise ValueError("Request body must be a JSON object.")
    return value


def _item_data(item):
    return {
        "id": item.pk,
        "name": item.name,
        "description": item.description,
        "category": item.category_id,
        "category_name": item.category.name,
        "price": str(item.price),
        "image": item.photo.url if item.photo else "",
        "available": item.available,
        "featured": item.featured,
        "specialOffer": item.special_offer,
        "display_order": item.display_order,
    }


def _gallery_data(photo):
    return {
        "id": photo.pk,
        "image": photo.image.url,
        "caption": photo.caption,
        "category": photo.category,
        "display_order": photo.display_order,
    }


def _order_data(order):
    return {
        "id": order.pk,
        "number": f"QM-{order.pk:06d}",
        "customer": order.customer_name,
        "phone": order.phone,
        "items": " · ".join(
            f"{item.quantity} × {item.name}" for item in order.line_items.all()
        ),
        "total": str(order.total),
        "status": order.status,
        "created": order.created.isoformat(),
    }


def dashboard_payload(restaurant):
    def money_value(value):
        return f"{value or Decimal('0.00'):.2f}"

    today = timezone.localdate()
    start_week = today - timedelta(days=6)
    start_month = today.replace(day=1)
    orders = Order.objects.filter(restaurant=restaurant).prefetch_related("line_items")
    completed = orders.filter(status=Order.Status.COMPLETED)
    completed_item_lines = OrderItem.objects.filter(
        order__restaurant=restaurant,
        order__status=Order.Status.COMPLETED,
    )
    best_seller = (
        completed_item_lines.values("name")
        .annotate(sold=Sum("quantity"))
        .order_by("-sold", "name")
        .first()
    )
    daily = []
    for offset in range(6, -1, -1):
        day = today - timedelta(days=offset)
        daily_total = completed.filter(created__date=day).aggregate(total=Sum("total"))["total"]
        daily.append({"date": day.isoformat(), "revenue": money_value(daily_total)})

    total_orders = orders.count()
    analytics = {
        "today_orders": orders.filter(created__date=today).count(),
        "today_revenue": money_value(
            completed.filter(created__date=today).aggregate(total=Sum("total"))["total"]
        ),
        "weekly_revenue": money_value(
            completed.filter(created__date__gte=start_week).aggregate(total=Sum("total"))["total"]
        ),
        "monthly_revenue": money_value(
            completed.filter(created__date__gte=start_month).aggregate(total=Sum("total"))["total"]
        ),
        "best_selling_item": best_seller["name"] if best_seller else "No sales yet",
        "total_customers": orders.values("phone").distinct().count(),
        "average_order": money_value(completed.aggregate(value=Avg("total"))["value"]),
        "pending_orders": orders.filter(status=Order.Status.PENDING).count(),
        "completed_orders": completed.count(),
        "cancelled_orders": orders.filter(status=Order.Status.CANCELLED).count(),
        "website_visitors": restaurant.analytics_events.filter(
            event_type="visitor",
        ).count(),
        "menu_views": restaurant.analytics_events.filter(event_type="menu_view").count(),
        "orders": total_orders,
        "revenue": money_value(completed.aggregate(total=Sum("total"))["total"]),
        "chart": daily,
    }
    return {
        "categories": [
            {"id": category.pk, "name": category.name}
            for category in MenuCategory.objects.filter(restaurant=restaurant)
        ],
        "menu": [
            _item_data(item)
            for item in MenuItem.objects.filter(restaurant=restaurant).select_related("category")
        ],
        "gallery": [
            _gallery_data(photo)
            for photo in GalleryPhoto.objects.filter(restaurant=restaurant)
        ],
        "orders": [_order_data(order) for order in orders[:100]],
        "analytics": analytics,
    }


@login_required
@require_POST
def category_create(request):
    restaurant = _owner_restaurant(request)
    try:
        data = _json_body(request)
    except ValueError as exc:
        return _error(str(exc))
    form = MenuCategoryForm(data, restaurant=restaurant)
    if not form.is_valid():
        return _error("Please correct the category.", errors=form.errors.get_json_data())
    category = form.save()
    return JsonResponse({"category": {"id": category.pk, "name": category.name}}, status=201)


@login_required
@require_POST
def category_delete(request, category_id):
    restaurant = _owner_restaurant(request)
    category = get_object_or_404(MenuCategory, pk=category_id, restaurant=restaurant)
    if category.items.exists():
        return _error("Move or delete this category's menu items before deleting it.", 409)
    category.delete()
    return JsonResponse({"deleted": True})


@login_required
@require_POST
def menu_item_save(request):
    restaurant = _owner_restaurant(request)
    item_id = request.POST.get("id")
    item = (
        get_object_or_404(MenuItem, pk=item_id, restaurant=restaurant)
        if item_id
        else None
    )
    form = MenuItemForm(
        request.POST,
        request.FILES,
        instance=item,
        restaurant=restaurant,
    )
    if not form.is_valid():
        return _error("Please correct the menu item.", errors=form.errors.get_json_data())
    saved = form.save()
    return JsonResponse({"item": _item_data(saved)}, status=201 if item is None else 200)


@login_required
@require_POST
def menu_item_delete(request, item_id):
    restaurant = _owner_restaurant(request)
    item = get_object_or_404(MenuItem, pk=item_id, restaurant=restaurant)
    if item.photo:
        item.photo.delete(save=False)
    item.delete()
    return JsonResponse({"deleted": True})


@login_required
@require_POST
def menu_reorder(request):
    restaurant = _owner_restaurant(request)
    try:
        data = _json_body(request)
        ids = data.get("ids")
        if not isinstance(ids, list) or not all(isinstance(pk, int) for pk in ids):
            raise ValueError("Menu order must be a list of item IDs.")
        items = list(MenuItem.objects.filter(restaurant=restaurant, pk__in=ids))
        if len(items) != len(ids) or len(set(ids)) != len(ids):
            raise ValueError("Menu order contains invalid item IDs.")
        indexed = {item.pk: item for item in items}
        for index, item_id in enumerate(ids):
            indexed[item_id].display_order = index
        with transaction.atomic():
            MenuItem.objects.bulk_update(items, ("display_order",))
        return JsonResponse({"saved": True})
    except ValueError as exc:
        return _error(str(exc))


@login_required
@require_POST
def gallery_upload(request):
    restaurant = _owner_restaurant(request)
    files = request.FILES.getlist("images")
    if not files:
        return _error("Choose at least one image to upload.")
    photos = []
    for image in files:
        form = GalleryPhotoForm(
            {"caption": image.name.rsplit(".", 1)[0], "category": request.POST.get("category", "food")},
            {"image": image},
        )
        if not form.is_valid():
            return _error("One or more images could not be uploaded.", errors=form.errors.get_json_data())
        photo = form.save(commit=False)
        photo.restaurant = restaurant
        photo.display_order = restaurant.gallery_photos.count() + len(photos)
        photos.append(photo)
    GalleryPhoto.objects.bulk_create(photos)
    return JsonResponse({"photos": [_gallery_data(photo) for photo in photos]}, status=201)


@login_required
@require_POST
def gallery_update(request, photo_id):
    restaurant = _owner_restaurant(request)
    photo = get_object_or_404(GalleryPhoto, pk=photo_id, restaurant=restaurant)
    try:
        data = _json_body(request)
    except ValueError as exc:
        return _error(str(exc))
    form = GalleryPhotoForm(data, instance=photo)
    if not form.is_valid():
        return _error("Please correct the gallery photo.", errors=form.errors.get_json_data())
    return JsonResponse({"photo": _gallery_data(form.save())})


@login_required
@require_POST
def gallery_delete(request, photo_id):
    restaurant = _owner_restaurant(request)
    photo = get_object_or_404(GalleryPhoto, pk=photo_id, restaurant=restaurant)
    if photo.image:
        photo.image.delete(save=False)
    photo.delete()
    return JsonResponse({"deleted": True})


@login_required
@require_POST
def gallery_reorder(request):
    restaurant = _owner_restaurant(request)
    try:
        data = _json_body(request)
        ids = data.get("ids")
        if not isinstance(ids, list) or not all(isinstance(pk, int) for pk in ids):
            raise ValueError("Gallery order must be a list of photo IDs.")
        photos = list(GalleryPhoto.objects.filter(restaurant=restaurant, pk__in=ids))
        if len(photos) != len(ids) or len(set(ids)) != len(ids):
            raise ValueError("Gallery order contains invalid photo IDs.")
        indexed = {photo.pk: photo for photo in photos}
        for index, photo_id in enumerate(ids):
            indexed[photo_id].display_order = index
        with transaction.atomic():
            GalleryPhoto.objects.bulk_update(photos, ("display_order",))
        return JsonResponse({"saved": True})
    except ValueError as exc:
        return _error(str(exc))


@login_required
@require_POST
def order_status_update(request, order_id):
    restaurant = _owner_restaurant(request)
    order = get_object_or_404(Order, pk=order_id, restaurant=restaurant)
    try:
        data = _json_body(request)
    except ValueError as exc:
        return _error(str(exc))
    status = data.get("status")
    if status not in Order.Status.values:
        return _error("Choose a valid order status.")
    order.status = status
    order.save(update_fields=("status",))
    return JsonResponse({"order": _order_data(order)})


@login_required
@require_POST
def settings_update(request):
    restaurant = _owner_restaurant(request)
    try:
        data = _json_body(request)
    except ValueError as exc:
        return _error(str(exc))
    language = data.get("language")
    if language not in {"English", "Bemba", "Nyanja"}:
        return _error("Choose a supported language.")
    password = data.get("password", {})
    password_form = None
    if password:
        password_form = PasswordChangeForm(
            request.user,
            {
                "old_password": password.get("old"),
                "new_password1": password.get("new"),
                "new_password2": password.get("confirm"),
            },
        )
        if not password_form.is_valid():
            return _error("Password was not changed.", errors=password_form.errors.get_json_data())
    restaurant.preferred_language = language
    restaurant.notifications_enabled = data.get("notifications") is True
    restaurant.save(update_fields=("preferred_language", "notifications_enabled", "updated"))
    if password_form:
        user = password_form.save()
        update_session_auth_hash(request, user)
    return JsonResponse(
        {
            "saved": True,
            "language": restaurant.preferred_language,
            "notifications": restaurant.notifications_enabled,
        }
    )


@login_required
def restaurant_qr(request):
    from io import BytesIO

    import qrcode
    from django.http import HttpResponse

    restaurant = _owner_restaurant(request)
    target = request.GET.get("target", "website")
    if target not in {"website", "menu"}:
        return _error("Choose either the website or menu QR destination.")
    path = f"/r/{restaurant.slug}/"
    if target == "menu":
        path += "menu/"
    base = request.build_absolute_uri(path)
    image = qrcode.make(base)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    response = HttpResponse(buffer.getvalue(), content_type="image/png")
    response["Content-Disposition"] = (
        f'attachment; filename="{restaurant.slug}-{target}-qr.png"'
    )
    return response
