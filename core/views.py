from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView

from dashboard.models import AnalyticsEvent
from gallery.models import GalleryPhoto
from menu.models import MenuCategory, MenuItem
from orders.models import CustomerReview
from restaurants.models import Restaurant


@method_decorator(ensure_csrf_cookie, name="dispatch")
class PublicPageView(TemplateView):
    page_template = "index.html"
    page_name = "home"

    def get_template_names(self):
        return [self.page_template]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        restaurant_slug = (
            self.kwargs.get("restaurant_slug")
            or self.request.GET.get("restaurant")
        )
        context["restaurant"] = (
            get_object_or_404(Restaurant, slug=restaurant_slug)
            if restaurant_slug
            else None
        )
        if context["restaurant"]:
            restaurant = context["restaurant"]
            if self.page_name in {"home", "menu", "gallery", "contact"}:
                event_type = (
                    AnalyticsEvent.EventType.MENU_VIEW
                    if self.page_name == "menu"
                    else AnalyticsEvent.EventType.VISITOR
                )
                AnalyticsEvent.objects.create(
                    restaurant=restaurant,
                    event_type=event_type,
                )
            categories = list(
                MenuCategory.objects.filter(restaurant=restaurant).values(
                    "id",
                    "name",
                    "display_order",
                )
            )
            context["restaurant_data"] = {
                "slug": restaurant.slug,
                "name": restaurant.business_name,
                "description": restaurant.description,
                "address": restaurant.address,
                "phone": restaurant.phone,
                "whatsapp": restaurant.whatsapp,
                "email": restaurant.email,
                "logo": restaurant.logo.url if restaurant.logo else "",
                "heroImage": restaurant.hero_image.url if restaurant.hero_image else "",
                "opening": restaurant.opening_time.strftime("%H:%M") if restaurant.opening_time else "",
                "closing": restaurant.closing_time.strftime("%H:%M") if restaurant.closing_time else "",
                "instagram": restaurant.instagram,
                "facebook": restaurant.facebook,
                "themeColor": restaurant.theme_color,
                "categories": categories,
                "menu": [
                    {
                        "id": item.pk,
                        "name": item.name,
                        "category": item.category_id,
                        "group": item.category.name,
                        "price": str(item.price),
                        "description": item.description,
                        "image": item.photo.url if item.photo else "",
                        "available": item.available,
                        "featured": item.featured,
                        "specialOffer": item.special_offer,
                    }
                    for item in MenuItem.objects.filter(
                        restaurant=restaurant,
                        available=True,
                    ).select_related("category")
                ],
                "gallery": [
                    {
                        "image": photo.image.url,
                        "caption": photo.caption,
                        "category": photo.category,
                    }
                    for photo in GalleryPhoto.objects.filter(restaurant=restaurant)
                ],
                "reviews": [
                    {
                        "name": review.customer_name,
                        "text": review.text,
                        "rating": review.rating,
                        "verified": review.verified,
                        "serviceTags": review.service_tags,
                        "createdAt": review.created.isoformat(),
                    }
                    for review in CustomerReview.objects.filter(restaurant=restaurant)[:30]
                ],
                "api": {
                    "session": f"/r/{restaurant.slug}/api/session/",
                    "phone_send": f"/r/{restaurant.slug}/api/phone/send/",
                    "phone_verify": f"/r/{restaurant.slug}/api/phone/verify/",
                    "order": f"/r/{restaurant.slug}/api/orders/",
                    "tracking": f"/r/{restaurant.slug}/api/orders/current/",
                    "review": f"/r/{restaurant.slug}/api/reviews/",
                    "catering": f"/r/{restaurant.slug}/api/catering/",
                },
            }
        context["page_name"] = self.page_name
        return context
