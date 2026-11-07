from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.functions import Lower


class MenuCategory(models.Model):
    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="categories",
    )
    name = models.CharField(max_length=100)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("display_order", "name")
        constraints = [
            models.UniqueConstraint(
                "restaurant",
                Lower("name"),
                name="unique_menu_category_case_insensitive",
            ),
        ]

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="menu_items",
    )
    category = models.ForeignKey(
        MenuCategory,
        on_delete=models.PROTECT,
        related_name="items",
    )
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    photo = models.ImageField(upload_to="restaurants/menu/", blank=True)
    available = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    special_offer = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("display_order", "name")
        constraints = [
            models.CheckConstraint(
                condition=models.Q(price__gte=0),
                name="menu_item_price_nonnegative",
            ),
        ]
        indexes = [
            models.Index(fields=("restaurant", "available")),
            models.Index(fields=("category", "name")),
        ]

    def clean(self):
        super().clean()
        if self.category_id and self.restaurant_id:
            if self.category.restaurant_id != self.restaurant_id:
                raise ValidationError({"category": "The category must belong to this restaurant."})

    def __str__(self):
        return self.name
