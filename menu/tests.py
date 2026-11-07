from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from restaurants.models import Restaurant

from .models import MenuCategory, MenuItem


class MenuModelTests(TestCase):
    def test_menu_item_category_must_belong_to_its_restaurant(self):
        user_model = get_user_model()
        restaurant_one = Restaurant.objects.create(
            owner=user_model.objects.create_user(username="menu-owner-one"),
            business_name="First Kitchen",
        )
        restaurant_two = Restaurant.objects.create(
            owner=user_model.objects.create_user(username="menu-owner-two"),
            business_name="Second Kitchen",
        )
        category = MenuCategory.objects.create(restaurant=restaurant_one, name="Mains")
        item = MenuItem(
            restaurant=restaurant_two,
            category=category,
            name="Pilau",
            price="75.00",
        )

        with self.assertRaises(ValidationError):
            item.full_clean()
