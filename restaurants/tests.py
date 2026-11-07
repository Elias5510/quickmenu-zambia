from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase

from .models import Restaurant


class RestaurantModelTests(TestCase):
    def test_owner_has_a_single_restaurant_and_slugs_are_unique(self):
        user_model = get_user_model()
        first_owner = user_model.objects.create_user(username="first-owner")
        second_owner = user_model.objects.create_user(username="second-owner")
        first = Restaurant.objects.create(owner=first_owner, business_name="The Good Table")
        second = Restaurant.objects.create(owner=second_owner, business_name="The Good Table")

        self.assertEqual(first.slug, "the-good-table")
        self.assertEqual(second.slug, "the-good-table-2")
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Restaurant.objects.create(owner=first_owner, business_name="Another Restaurant")
