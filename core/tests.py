from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from menu.models import MenuCategory, MenuItem
from restaurants.models import Restaurant


class RestaurantPublicWebsiteTests(TestCase):
    def test_tenant_pages_render_database_restaurant_and_menu(self):
        owner = get_user_model().objects.create_user(
            username="public-owner",
            password="Strong-test-pass-42",
        )
        restaurant = Restaurant.objects.create(
            owner=owner,
            business_name="Database Kitchen",
            description="Fresh local meals",
            address="Lusaka",
            phone="0971234567",
            whatsapp="0971234567",
            email="hello@example.com",
        )
        category = MenuCategory.objects.create(restaurant=restaurant, name="Lunch")
        MenuItem.objects.create(
            restaurant=restaurant,
            category=category,
            name="Database Chicken",
            price="42.50",
            description="Menu content from the database",
            featured=True,
        )

        response = self.client.get(reverse("core:restaurant_home", args=[restaurant.slug]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["restaurant_data"]["name"], "Database Kitchen")
        self.assertEqual(response.context["restaurant_data"]["menu"][0]["name"], "Database Chicken")
        self.assertContains(response, 'id="restaurant-data"')

        menu_response = self.client.get(reverse("core:restaurant_menu", args=[restaurant.slug]))
        self.assertEqual(menu_response.status_code, 200)
        self.assertEqual(
            menu_response.context["restaurant_data"]["categories"][0]["name"],
            "Lunch",
        )
