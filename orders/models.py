from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError
from django.db import models


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PREPARING = "preparing", "Preparing"
        READY = "ready", "Ready"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="orders",
    )
    customer_name = models.CharField(max_length=160)
    phone = models.CharField(max_length=32)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_details = models.JSONField(default=dict, blank=True)
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )
    created = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created",)
        constraints = [
            models.CheckConstraint(
                condition=models.Q(total__gte=0),
                name="order_total_nonnegative",
            ),
        ]
        indexes = [models.Index(fields=("restaurant", "status", "created"))]

    def __str__(self):
        return f"Order {self.pk} — {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="line_items")
    menu_item = models.ForeignKey(
        "menu.MenuItem",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_items",
    )
    name = models.CharField(max_length=160)
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)],
    )
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(quantity__gte=1),
                name="order_item_quantity_positive",
            ),
            models.CheckConstraint(
                condition=models.Q(unit_price__gte=0),
                name="order_item_price_nonnegative",
            ),
        ]

    def clean(self):
        super().clean()
        if self.menu_item_id and self.order_id:
            if self.menu_item.restaurant_id != self.order.restaurant_id:
                raise ValidationError(
                    {"menu_item": "The menu item must belong to this order's restaurant."}
                )

    @property
    def line_total(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.quantity} × {self.name}"


class CustomerReview(models.Model):
    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="customer_reviews",
    )
    customer_name = models.CharField(max_length=80)
    phone = models.CharField(max_length=32)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    text = models.TextField(max_length=800)
    service_tags = models.JSONField(default=list, blank=True)
    verified = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created",)
        constraints = [
            models.CheckConstraint(
                condition=models.Q(rating__gte=1, rating__lte=5),
                name="customer_review_rating_range",
            ),
        ]

    def __str__(self):
        return f"{self.rating}/5 — {self.customer_name}"


class CateringInquiry(models.Model):
    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="catering_inquiries",
    )
    customer_name = models.CharField(max_length=80)
    phone = models.CharField(max_length=32)
    event_type = models.CharField(max_length=120)
    preferred_date = models.DateField()
    guest_count = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(20), MaxValueValidator(500)],
    )
    venue = models.CharField(max_length=180)
    menu_request = models.TextField(max_length=1200)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created",)

    def __str__(self):
        return f"{self.event_type} — {self.customer_name}"
