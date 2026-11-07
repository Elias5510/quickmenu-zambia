from django import forms
from django.utils import timezone

from core.validators import normalize_zambian_phone

from .models import CateringInquiry, CustomerReview


class CustomerReviewForm(forms.ModelForm):
    class Meta:
        model = CustomerReview
        fields = ("customer_name", "phone", "rating", "text")

    def clean_phone(self):
        return normalize_zambian_phone(self.cleaned_data["phone"])


class CateringInquiryForm(forms.ModelForm):
    class Meta:
        model = CateringInquiry
        fields = (
            "customer_name",
            "phone",
            "event_type",
            "preferred_date",
            "guest_count",
            "venue",
            "menu_request",
        )

    def clean_phone(self):
        return normalize_zambian_phone(self.cleaned_data["phone"])

    def clean_preferred_date(self):
        preferred_date = self.cleaned_data["preferred_date"]
        if preferred_date < timezone.localdate():
            raise forms.ValidationError("Choose today or a future date.")
        return preferred_date
