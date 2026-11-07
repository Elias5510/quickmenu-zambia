import re

from django import forms

from core.uploads import validate_image_size
from core.validators import normalize_zambian_phone

from .models import Restaurant


class RestaurantProfileForm(forms.ModelForm):
    class Meta:
        model = Restaurant
        fields = (
            "business_name",
            "description",
            "phone",
            "whatsapp",
            "email",
            "opening_time",
            "closing_time",
            "address",
            "instagram",
            "facebook",
            "theme_color",
            "logo",
            "hero_image",
        )
        widgets = {
            "business_name": forms.TextInput(attrs={"maxlength": 80}),
            "description": forms.Textarea(attrs={"maxlength": 500}),
            "phone": forms.TelInput(),
            "whatsapp": forms.TelInput(),
            "email": forms.EmailInput(),
            "opening_time": forms.TimeInput(
                format="%H:%M",
                attrs={"id": "website-opening", "type": "time"},
            ),
            "closing_time": forms.TimeInput(
                format="%H:%M",
                attrs={"id": "website-closing", "type": "time"},
            ),
            "address": forms.TextInput(attrs={"maxlength": 180}),
            "instagram": forms.URLInput(),
            "facebook": forms.URLInput(),
            "theme_color": forms.TextInput(attrs={"type": "color"}),
            "logo": forms.ClearableFileInput(attrs={"accept": "image/*"}),
            "hero_image": forms.ClearableFileInput(attrs={"accept": "image/*"}),
        }

    def clean_phone(self):
        phone = self.cleaned_data.get("phone", "").strip()
        return normalize_zambian_phone(phone) if phone else ""

    def clean_whatsapp(self):
        phone = self.cleaned_data.get("whatsapp", "").strip()
        return normalize_zambian_phone(phone) if phone else ""

    def clean_logo(self):
        logo = self.cleaned_data.get("logo")
        validate_image_size(self.files.get(self.add_prefix("logo")))
        return logo

    def clean_hero_image(self):
        image = self.cleaned_data.get("hero_image")
        validate_image_size(self.files.get(self.add_prefix("hero_image")))
        return image

    def clean_theme_color(self):
        color = self.cleaned_data["theme_color"]
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", color):
            raise forms.ValidationError("Enter a six-digit hexadecimal color.")
        return color
