import json

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.urls import reverse

from menu.models import MenuCategory, MenuItem
from restaurants.models import Restaurant

from .models import Order, OrderItem


class CustomerOrderTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        owner = user_model.objects.create_user(
            username="order-owner",
            password="Strong-test-pass-42",
        )
        other_owner = user_model.objects.create_user(
            username="other-order-owner",
            password="Strong-test-pass-42",
        )
        self.restaurant = Restaurant.objects.create(owner=owner, business_name="Order Kitchen")
        other_restaurant = Restaurant.objects.create(
            owner=other_owner,
            business_name="Other Order Kitchen",
        )
        category = MenuCategory.objects.create(restaurant=self.restaurant, name="Mains")
        self.item = MenuItem.objects.create(
            restaurant=self.restaurant,
            category=category,
            name="Chicken",
            price="50.00",
        )
        other_category = MenuCategory.objects.create(restaurant=other_restaurant, name="Mains")
        self.other_item = MenuItem.objects.create(
            restaurant=other_restaurant,
            category=other_category,
            name="Fish",
            price="70.00",
        )

    def post_order(self, payload):
        return self.client.post(
            reverse("orders:create", args=[self.restaurant.slug]),
            data=json.dumps(payload),
            content_type="application/json",
        )

    def test_order_uses_database_price_and_tracks_session_order(self):
        response = self.post_order(
            {
                "customer_name": "Customer",
                "phone": "0971234567",
                "items": [{"id": self.item.pk, "quantity": 2, "price": 0.01}],
                "delivery": {"address": "Lusaka"},
            }
        )
        self.assertEqual(response.status_code, 201, response.content)
        order = Order.objects.get(restaurant=self.restaurant)
        self.assertEqual(order.phone, "+260971234567")
        self.assertEqual(order.total, 110)
        line = order.line_items.get()
        self.assertEqual(line.unit_price, 50)
        self.assertEqual(line.quantity, 2)

        tracking = self.client.get(reverse("orders:tracking", args=[self.restaurant.slug]))
        self.assertEqual(tracking.status_code, 200)
        self.assertEqual(tracking.json()["status"], Order.Status.PENDING)
        self.assertEqual(tracking.json()["items"][0]["name"], "Chicken")

    def test_order_rejects_foreign_and_unavailable_items(self):
        payload = {
            "customer_name": "Customer",
            "phone": "+260971234567",
            "items": [{"id": self.other_item.pk, "quantity": 1}],
        }
        response = self.post_order(payload)
        self.assertEqual(response.status_code, 409)
        self.assertFalse(Order.objects.exists())

        self.item.available = False
        self.item.save(update_fields=("available",))
        payload["items"] = [{"id": self.item.pk, "quantity": 1}]
        self.assertEqual(self.post_order(payload).status_code, 409)

    def test_order_validates_phone_and_quantity(self):
        payload = {
            "customer_name": "Customer",
            "phone": "not a phone",
            "items": [{"id": self.item.pk, "quantity": 1}],
        }
        self.assertEqual(self.post_order(payload).status_code, 400)
        payload["phone"] = "+260971234567"
        payload["items"] = [{"id": self.item.pk, "quantity": 101}]
        self.assertEqual(self.post_order(payload).status_code, 400)

    def test_order_item_rejects_cross_restaurant_menu_item(self):
        order = Order.objects.create(
            restaurant=self.restaurant,
            customer_name="Customer",
            phone="+260971234567",
            total="70.00",
        )
        line = OrderItem(
            order=order,
            menu_item=self.other_item,
            name=self.other_item.name,
            quantity=1,
            unit_price=self.other_item.price,
        )
        with self.assertRaises(ValidationError):
            line.full_clean()
