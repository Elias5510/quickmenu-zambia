from django.db import models


class AnalyticsEvent(models.Model):
    class EventType(models.TextChoices):
        VISITOR = "visitor", "Website visitor"
        MENU_VIEW = "menu_view", "Menu view"
        ORDER = "order", "Order"

    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="analytics_events",
    )
    event_type = models.CharField(max_length=16, choices=EventType.choices, db_index=True)
    created = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created",)
        indexes = [models.Index(fields=("restaurant", "event_type", "created"))]

    def __str__(self):
        return f"{self.get_event_type_display()} — {self.restaurant}"
