from django.contrib.auth import get_user_model
from django.contrib.staticfiles import finders
from django.test import TestCase
from django.urls import reverse

from restaurants.models import Restaurant


class OwnerAuthenticationTests(TestCase):
    def test_registration_creates_owner_and_restaurant(self):
        response = self.client.post(
            reverse("accounts:register"),
            {
                "username": "owner-one",
                "email": "owner@example.com",
                "first_name": "Amina",
                "last_name": "Phiri",
                "business_name": "Amina's Kitchen",
                "password1": "Strong-test-password-2026",
                "password2": "Strong-test-password-2026",
            },
        )

        self.assertRedirects(response, reverse("dashboard:home"))
        user = get_user_model().objects.get(username="owner-one")
        self.assertEqual(user.restaurant.business_name, "Amina's Kitchen")
        self.assertEqual(user.restaurant.email, "owner@example.com")
        self.assertIn("_auth_user_id", self.client.session)

    def test_dashboard_requires_login_and_owner_restaurant(self):
        response = self.client.get(reverse("dashboard:home"))
        self.assertRedirects(
            response,
            f"{reverse('accounts:login')}?next={reverse('dashboard:home')}",
        )

        user = get_user_model().objects.create_user(
            username="no-restaurant",
            password="Strong-test-password-2026",
        )
        self.client.force_login(user)
        self.assertEqual(self.client.get(reverse("dashboard:home")).status_code, 404)

    def test_owner_dashboard_and_frontend_assets_are_served_safely(self):
        user = get_user_model().objects.create_user(
            username="dashboard-owner",
            password="Strong-test-password-2026",
        )
        restaurant = Restaurant.objects.create(owner=user, business_name="Dashboard Kitchen")
        self.client.force_login(user)

        dashboard_response = self.client.get(reverse("dashboard:home"))
        self.assertEqual(dashboard_response.status_code, 200)
        self.assertEqual(dashboard_response.context["restaurant"], restaurant)
        self.assertContains(dashboard_response, "/static/style.css")
        self.assertEqual(self.client.get("/accounts/profile/").status_code, 200)

    def test_profile_requires_login_and_updates_user_fields(self):
        user = get_user_model().objects.create_user(
            username="profile-owner",
            email="old@example.com",
            password="Strong-test-password-2026",
        )
        self.client.force_login(user)
        response = self.client.post(
            reverse("accounts:profile"),
            {
                "username": user.username,
                "first_name": "Chanda",
                "last_name": "Banda",
                "email": "new@example.com",
            },
        )

        self.assertRedirects(response, reverse("accounts:profile"))
        user.refresh_from_db()
        self.assertEqual(user.email, "new@example.com")

    def test_logout_uses_post(self):
        user = get_user_model().objects.create_user(
            username="logout-owner",
            password="Strong-test-password-2026",
        )
        self.client.force_login(user)
        self.assertEqual(self.client.get(reverse("accounts:logout")).status_code, 405)
        self.assertRedirects(
            self.client.post(reverse("accounts:logout")),
            reverse("core:home"),
        )

    def test_public_pages_render_and_dashboard_template_is_not_static(self):
        for name in (
            "core:home",
            "core:menu",
            "core:gallery",
            "core:contact",
            "core:pricing",
            "core:demos",
            "core:get_started",
            "accounts:login",
            "accounts:register",
            "accounts:password_reset",
        ):
            with self.subTest(page=name):
                self.assertEqual(self.client.get(reverse(name)).status_code, 200)

        self.assertEqual(finders.find("dashboard.html", find_all=True), [])
        self.assertIsNotNone(finders.find("style.css"))
