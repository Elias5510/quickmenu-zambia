from django.urls import path

from . import views

app_name = "dashboard"

urlpatterns = [
    path("dashboard.html", views.OwnerDashboardView.as_view(), name="home"),
    path("dashboard/api/categories/", views.category_create, name="category_create"),
    path("dashboard/api/categories/<int:category_id>/delete/", views.category_delete, name="category_delete"),
    path("dashboard/api/menu/", views.menu_item_save, name="menu_save"),
    path("dashboard/api/menu/<int:item_id>/delete/", views.menu_item_delete, name="menu_delete"),
    path("dashboard/api/menu/reorder/", views.menu_reorder, name="menu_reorder"),
    path("dashboard/api/gallery/", views.gallery_upload, name="gallery_upload"),
    path("dashboard/api/gallery/<int:photo_id>/", views.gallery_update, name="gallery_update"),
    path("dashboard/api/gallery/<int:photo_id>/delete/", views.gallery_delete, name="gallery_delete"),
    path("dashboard/api/gallery/reorder/", views.gallery_reorder, name="gallery_reorder"),
    path("dashboard/api/orders/<int:order_id>/status/", views.order_status_update, name="order_status"),
    path("dashboard/api/settings/", views.settings_update, name="settings_update"),
    path("dashboard/api/data/", views.dashboard_data, name="data"),
    path("dashboard/qr-code.png", views.restaurant_qr, name="qr_code"),
]
