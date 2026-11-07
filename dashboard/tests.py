from io import BytesIO
import json
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from PIL import Image
from unittest.mock import patch

from gallery.models import GalleryPhoto
from menu.models import MenuCategory, MenuItem
from orders.models import Order
from restaurants.forms import RestaurantProfileForm
from restaurants.models import Restaurant


class RestaurantProfileTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.owner = user_model.objects.create_user(
            username="profile-owner",
            password="secure-test-password",
        )
        self.restaurant = Restaurant.objects.create(
            owner=self.owner,
            business_name="Before Kitchen",
        )
        self.other_owner = user_model.objects.create_user(
            username="other-profile-owner",
            password="secure-test-password",
        )
        self.other_restaurant = Restaurant.objects.create(
            owner=self.other_owner,
            business_name="Other Kitchen",
        )
        self.client.force_login(self.owner)

    def test_dashboard_populates_profile_from_restaurant(self):
        self.restaurant.phone = "+260971234567"
        self.restaurant.opening_time = "08:30"
        self.restaurant.save()

        response = self.client.get(reverse("dashboard:home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'value="Before Kitchen"')
        self.assertContains(response, 'value="+260971234567"')
        self.assertContains(response, 'value="08:30"')

    def test_profile_post_updates_only_the_logged_in_owners_restaurant(self):
        response = self.client.post(
            reverse("dashboard:home"),
            {
                "business_name": "Updated Kitchen",
                "description": "Fresh local dishes.",
                "phone": "+260971234567",
                "whatsapp": "+260971234567",
                "email": "orders@example.com",
                "opening_time": "08:30",
                "closing_time": "22:00",
                "address": "Lusaka, Zambia",
                "instagram": "https://instagram.com/updated",
                "facebook": "https://facebook.com/updated",
                "theme_color": "#123456",
            },
        )

        self.assertRedirects(response, reverse("dashboard:home"))
        self.restaurant.refresh_from_db()
        self.other_restaurant.refresh_from_db()
        self.assertEqual(self.restaurant.business_name, "Updated Kitchen")
        self.assertEqual(self.restaurant.email, "orders@example.com")
        self.assertEqual(self.restaurant.opening_time.strftime("%H:%M"), "08:30")
        self.assertEqual(self.restaurant.theme_color, "#123456")
        self.assertEqual(self.other_restaurant.business_name, "Other Kitchen")

    def test_uploaded_logo_and_hero_are_saved_and_used_on_public_pages(self):
        image = BytesIO()
        Image.new("RGB", (1, 1), color="white").save(image, format="PNG")
        image_bytes = image.getvalue()
        with tempfile.TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                response = self.client.post(
                    reverse("dashboard:home"),
                    {
                        "business_name": "Image Kitchen",
                        "description": "Description from the database",
                        "phone": "+260971234567",
                        "whatsapp": "+260971234567",
                        "email": "images@example.com",
                        "opening_time": "07:00",
                        "closing_time": "21:00",
                        "address": "Kabulonga, Lusaka",
                        "instagram": "",
                        "facebook": "",
                        "theme_color": "#f97316",
                        "logo": SimpleUploadedFile("logo.png", image_bytes, "image/png"),
                        "hero_image": SimpleUploadedFile("hero.png", image_bytes, "image/png"),
                    },
                )

                if response.status_code != 302:
                    self.fail(f"Profile upload form errors: {response.context['profile_form'].errors}")
                self.assertRedirects(response, reverse("dashboard:home"))
                self.restaurant.refresh_from_db()
                self.assertTrue(self.restaurant.logo.name.startswith("restaurants/logos/"))
                self.assertTrue(self.restaurant.hero_image.name.startswith("restaurants/hero/"))
                self.assertTrue(self.restaurant.logo.storage.exists(self.restaurant.logo.name))
                self.assertTrue(self.restaurant.hero_image.storage.exists(self.restaurant.hero_image.name))

                public_response = self.client.get(
                    f"{reverse('core:home')}?restaurant={self.restaurant.slug}"
                )

        self.assertContains(public_response, self.restaurant.logo.url)
        self.assertContains(public_response, self.restaurant.hero_image.url)
        self.assertContains(public_response, "Description from the database")

    def test_public_restaurant_pages_use_database_profile(self):
        self.restaurant.description = "Server-provided restaurant description."
        self.restaurant.phone = "+260971234567"
        self.restaurant.save()

        for page_name in ("core:home", "core:menu", "core:gallery", "core:contact"):
            with self.subTest(page=page_name):
                url = f"{reverse(page_name)}?restaurant={self.restaurant.slug}"
                response = self.client.get(url)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.context["restaurant"], self.restaurant)
                self.assertContains(response, 'id="restaurant-data"')
                self.assertContains(response, "Server-provided restaurant description.")

    def test_profile_form_validates_phone_and_theme_color(self):
        form = RestaurantProfileForm(
            {
                "business_name": "Invalid Kitchen",
                "phone": "not-a-phone",
                "whatsapp": "",
                "email": "",
                "description": "",
                "opening_time": "",
                "closing_time": "",
                "address": "",
                "instagram": "",
                "facebook": "",
                "theme_color": "green",
            },
            instance=self.restaurant,
        )
        self.assertFalse(form.is_valid())
        self.assertIn("phone", form.errors)
        self.assertIn("theme_color", form.errors)


class OwnerDashboardCrudTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.owner = user_model.objects.create_user(
            username="crud-owner",
            password="Strong-test-pass-42",
        )
        self.other_owner = user_model.objects.create_user(
            username="crud-other-owner",
            password="Strong-test-pass-42",
        )
        self.restaurant = Restaurant.objects.create(owner=self.owner, business_name="CRUD Kitchen")
        self.other_restaurant = Restaurant.objects.create(
            owner=self.other_owner,
            business_name="Other CRUD Kitchen",
        )
        self.category = MenuCategory.objects.create(restaurant=self.restaurant, name="Lunch")
        self.other_category = MenuCategory.objects.create(
            restaurant=self.other_restaurant,
            name="Lunch",
        )
        self.item = MenuItem.objects.create(
            restaurant=self.restaurant,
            category=self.category,
            name="Nshima",
            price="25.00",
        )
        self.other_item = MenuItem.objects.create(
            restaurant=self.other_restaurant,
            category=self.other_category,
            name="Rice",
            price="30.00",
        )
        self.client.force_login(self.owner)

    def post_json(self, url, payload):
        return self.client.post(url, json.dumps(payload), content_type="application/json")

    def test_category_menu_crud_and_tenant_isolation(self):
        created = self.post_json(reverse("dashboard:category_create"), {"name": "Dinner"})
        self.assertEqual(created.status_code, 201)
        category = MenuCategory.objects.get(pk=created.json()["category"]["id"])
        self.assertEqual(category.restaurant, self.restaurant)
        self.assertEqual(
            self.post_json(reverse("dashboard:category_create"), {"name": "dinner"}).status_code,
            400,
        )
        self.assertEqual(
            self.client.post(
                reverse("dashboard:category_delete", args=[category.pk])
            ).status_code,
            200,
        )
        self.assertEqual(
            self.client.post(
                reverse("dashboard:category_delete", args=[self.category.pk])
            ).status_code,
            409,
        )
        self.assertEqual(
            self.client.post(
                reverse("dashboard:menu_save"),
                {
                    "id": self.other_item.pk,
                    "name": "Changed",
                    "category": self.category.pk,
                    "price": "10",
                },
            ).status_code,
            404,
        )
        self.assertEqual(
            self.client.post(
                reverse("dashboard:menu_save"),
                {
                    "name": "Wrong category",
                    "category": self.other_category.pk,
                    "price": "10",
                },
            ).status_code,
            400,
        )
        self.assertEqual(
            self.client.post(
                reverse("dashboard:menu_save"),
                {
                    "name": "Negative price",
                    "category": self.category.pk,
                    "price": "-1",
                },
            ).status_code,
            400,
        )
        self.assertEqual(
            self.client.post(
                reverse("dashboard:menu_delete", args=[self.other_item.pk])
            ).status_code,
            404,
        )

        image = BytesIO()
        Image.new("RGB", (2, 2), color="orange").save(image, format="PNG")
        with tempfile.TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                saved = self.client.post(
                    reverse("dashboard:menu_save"),
                    {
                        "name": "Updated Nshima",
                        "category": self.category.pk,
                        "price": "28.50",
                        "description": "Fresh local meal",
                        "available": "on",
                        "featured": "on",
                        "photo": SimpleUploadedFile("nshima.png", image.getvalue(), "image/png"),
                    },
                )
                self.assertEqual(saved.status_code, 201, saved.content)
                item = MenuItem.objects.get(name="Updated Nshima")
                self.assertEqual(item.restaurant, self.restaurant)
                self.assertEqual(item.price, 28.5)
                self.assertTrue(item.photo.storage.exists(item.photo.name))
                updated = self.client.post(
                    reverse("dashboard:menu_save"),
                    {
                        "id": item.pk,
                        "name": "Updated Nshima Deluxe",
                        "category": self.category.pk,
                        "price": "30.00",
                        "description": "Updated description",
                        "available": "on",
                    },
                )
                self.assertEqual(updated.status_code, 200, updated.content)
                item.refresh_from_db()
                self.assertEqual(item.name, "Updated Nshima Deluxe")
                self.assertEqual(item.price, 30)
                self.assertEqual(
                    self.post_json(
                        reverse("dashboard:menu_reorder"),
                        {"ids": [item.pk, self.item.pk]},
                    ).status_code,
                    200,
                )
                deleted = self.client.post(
                    reverse("dashboard:menu_delete", args=[item.pk])
                )
                self.assertEqual(deleted.status_code, 200)
                self.assertFalse(MenuItem.objects.filter(pk=item.pk).exists())

        self.assertEqual(
            self.post_json(
                reverse("dashboard:menu_reorder"),
                {"ids": [self.item.pk, self.other_item.pk]},
            ).status_code,
            400,
        )

    def test_gallery_upload_edit_delete_and_foreign_photo_is_not_accessible(self):
        image = BytesIO()
        Image.new("RGB", (2, 2), color="blue").save(image, format="PNG")
        with tempfile.TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                uploaded = self.client.post(
                    reverse("dashboard:gallery_upload"),
                    {
                        "images": [SimpleUploadedFile("room.png", image.getvalue(), "image/png")],
                        "category": GalleryPhoto.Category.AMBIANCE,
                    },
                )
                self.assertEqual(uploaded.status_code, 201, uploaded.content)
                photo = GalleryPhoto.objects.get(restaurant=self.restaurant)
                self.assertTrue(photo.image.storage.exists(photo.image.name))
                edited = self.post_json(
                    reverse("dashboard:gallery_update", args=[photo.pk]),
                    {"caption": "Dining room", "category": GalleryPhoto.Category.FOOD},
                )
                self.assertEqual(edited.status_code, 200)
                photo.refresh_from_db()
                self.assertEqual(photo.caption, "Dining room")
                second_upload = self.client.post(
                    reverse("dashboard:gallery_upload"),
                    {
                        "images": [SimpleUploadedFile("second.png", image.getvalue(), "image/png")],
                        "category": GalleryPhoto.Category.FOOD,
                    },
                )
                self.assertEqual(second_upload.status_code, 201)
                second = GalleryPhoto.objects.get(pk=second_upload.json()["photos"][0]["id"])
                self.assertEqual(
                    self.post_json(
                        reverse("dashboard:gallery_reorder"),
                        {"ids": [second.pk, photo.pk]},
                    ).status_code,
                    200,
                )

                foreign = GalleryPhoto.objects.create(
                    restaurant=self.other_restaurant,
                    image=SimpleUploadedFile("foreign.png", image.getvalue(), "image/png"),
                )
                self.assertEqual(
                    self.client.post(
                        reverse("dashboard:gallery_delete", args=[foreign.pk])
                    ).status_code,
                    404,
                )
                self.assertTrue(GalleryPhoto.objects.filter(pk=foreign.pk).exists())
                self.assertEqual(
                    self.post_json(
                        reverse("dashboard:gallery_reorder"),
                        {"ids": [photo.pk, foreign.pk]},
                    ).status_code,
                    400,
                )
                deleted = self.client.post(
                    reverse("dashboard:gallery_delete", args=[photo.pk])
                )
                self.assertEqual(deleted.status_code, 200)
                self.assertFalse(GalleryPhoto.objects.filter(pk=photo.pk).exists())

    def test_orders_analytics_and_qr_are_owner_scoped(self):
        order = Order.objects.create(
            restaurant=self.restaurant,
            customer_name="Customer",
            phone="+260971234567",
            total="25.00",
        )
        order.line_items.create(
            menu_item=self.item,
            name=self.item.name,
            quantity=1,
            unit_price=self.item.price,
        )
        foreign = Order.objects.create(
            restaurant=self.other_restaurant,
            customer_name="Other customer",
            phone="+260971234568",
            total="30.00",
        )
        response = self.post_json(
            reverse("dashboard:order_status", args=[order.pk]),
            {"status": Order.Status.PREPARING},
        )
        self.assertEqual(response.status_code, 200)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.PREPARING)
        self.assertEqual(
            self.post_json(
                reverse("dashboard:order_status", args=[foreign.pk]),
                {"status": Order.Status.READY},
            ).status_code,
            404,
        )

        data = self.client.get(reverse("dashboard:data")).json()
        self.assertEqual([entry["id"] for entry in data["orders"]], [order.pk])
        self.assertEqual(data["analytics"]["total_customers"], 1)
        completed = Order.objects.create(
            restaurant=self.restaurant,
            customer_name="Customer",
            phone="+260971234567",
            total="25.00",
            status=Order.Status.COMPLETED,
        )
        completed.line_items.create(
            menu_item=self.item,
            name=self.item.name,
            quantity=2,
            unit_price=self.item.price,
        )
        analytics = self.client.get(reverse("dashboard:data")).json()["analytics"]
        self.assertEqual(analytics["completed_orders"], 1)
        self.assertEqual(analytics["today_revenue"], "25.00")
        self.assertEqual(analytics["best_selling_item"], self.item.name)
        self.assertEqual(analytics["total_customers"], 1)
        with patch("qrcode.make") as make_qr:
            make_qr.return_value = Image.new("1", (1, 1))
            qr = self.client.get(reverse("dashboard:qr_code"))
            self.assertEqual(qr.status_code, 200)
            self.assertEqual(qr["Content-Type"], "image/png")
            make_qr.assert_called_once_with(
                f"http://testserver/r/{self.restaurant.slug}/"
            )
            make_qr.reset_mock()
            menu_qr = self.client.get(
                reverse("dashboard:qr_code"),
                {"target": "menu"},
            )
            self.assertEqual(menu_qr.status_code, 200)
            make_qr.assert_called_once_with(
                f"http://testserver/r/{self.restaurant.slug}/menu/"
            )
        self.assertEqual(
            self.client.get(reverse("dashboard:qr_code"), {"target": "other"}).status_code,
            400,
        )
