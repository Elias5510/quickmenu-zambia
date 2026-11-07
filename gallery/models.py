from django.db import models


class GalleryPhoto(models.Model):
    class Category(models.TextChoices):
        FOOD = "food", "Food"
        DRINKS = "drinks", "Drinks & Cocktails"
        AMBIANCE = "ambiance", "Ambiance"

    restaurant = models.ForeignKey(
        "restaurants.Restaurant",
        on_delete=models.CASCADE,
        related_name="gallery_photos",
    )
    image = models.ImageField(upload_to="restaurants/gallery/")
    caption = models.CharField(max_length=180, blank=True)
    category = models.CharField(
        max_length=16,
        choices=Category.choices,
        default=Category.FOOD,
    )
    display_order = models.PositiveIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("display_order", "created")
        indexes = [models.Index(fields=("restaurant", "display_order"))]

    def __str__(self):
        return self.caption or f"Gallery photo {self.pk}"
