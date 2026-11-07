from django.urls import path

from .views import PublicPageView

app_name = "core"

PUBLIC_PAGES = {
    "index.html": ("index.html", "home"),
    "menu.html": ("menu.html", "menu"),
    "gallery.html": ("gallery.html", "gallery"),
    "contact.html": ("contact.html", "contact"),
    "pricing.html": ("pricing.html", "pricing"),
    "demo-restaurants.html": ("demo-restaurants.html", "demos"),
    "get-started.html": ("get-started.html", "get-started"),
    "register.html": ("register.html", "register"),
}

urlpatterns = [
    path("", PublicPageView.as_view(page_template="index.html", page_name="home"), name="home"),
    *[
        path(
            page_path,
            PublicPageView.as_view(page_template=template, page_name=page_name),
            name=page_name.replace("-", "_"),
        )
        for page_path, (template, page_name) in PUBLIC_PAGES.items()
    ],
    path(
        "r/<slug:restaurant_slug>/",
        PublicPageView.as_view(page_template="index.html", page_name="home"),
        name="restaurant_home",
    ),
    path(
        "r/<slug:restaurant_slug>/menu/",
        PublicPageView.as_view(page_template="menu.html", page_name="menu"),
        name="restaurant_menu",
    ),
    path(
        "r/<slug:restaurant_slug>/gallery/",
        PublicPageView.as_view(page_template="gallery.html", page_name="gallery"),
        name="restaurant_gallery",
    ),
    path(
        "r/<slug:restaurant_slug>/contact/",
        PublicPageView.as_view(page_template="contact.html", page_name="contact"),
        name="restaurant_contact",
    ),
]
