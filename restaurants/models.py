from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Restaurant(models.Model):
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="restaurant",
    )
    business_name = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=32, blank=True)
    whatsapp = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)
    instagram = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    theme_color = models.CharField(max_length=7, default="#f97316")
    preferred_language = models.CharField(max_length=16, default="English")
    notifications_enabled = models.BooleanField(default=True)
    logo = models.ImageField(upload_to="restaurants/logos/", blank=True)
    hero_image = models.ImageField(upload_to="restaurants/hero/", blank=True)
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    slug = models.SlugField(max_length=200, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("business_name",)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.business_name) or "restaurant"
            candidate = base_slug
            suffix = 2
            while Restaurant.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base_slug}-{suffix}"
                suffix += 1
            self.slug = candidate
        super().save(*args, **kwargs)

    def __str__(self):
        return self.business_name
