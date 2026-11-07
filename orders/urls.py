from django.urls import path

from . import views

app_name = "orders"

urlpatterns = [
    path("r/<slug:restaurant_slug>/api/session/", views.restaurant_session, name="session"),
    path("r/<slug:restaurant_slug>/api/phone/send/", views.phone_send_code, name="phone_send"),
    path("r/<slug:restaurant_slug>/api/phone/verify/", views.phone_verify_code, name="phone_verify"),
    path("r/<slug:restaurant_slug>/api/orders/", views.create_order, name="create"),
    path("r/<slug:restaurant_slug>/api/orders/current/", views.order_tracking, name="tracking"),
    path("r/<slug:restaurant_slug>/api/reviews/", views.submit_review, name="review"),
    path("r/<slug:restaurant_slug>/api/catering/", views.submit_catering, name="catering"),
]
