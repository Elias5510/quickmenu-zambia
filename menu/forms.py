from django import forms
from core.uploads import validate_image_size

from .models import MenuCategory, MenuItem


class MenuCategoryForm(forms.ModelForm):
    class Meta:
        model = MenuCategory
        fields = ("name",)
        widgets = {"name": forms.TextInput(attrs={"maxlength": 100})}

    def __init__(self, *args, restaurant, **kwargs):
        self.restaurant = restaurant
        super().__init__(*args, **kwargs)

    def clean_name(self):
        name = self.cleaned_data["name"].strip()
        duplicate = MenuCategory.objects.filter(
            restaurant=self.restaurant,
            name__iexact=name,
        )
        if self.instance.pk:
            duplicate = duplicate.exclude(pk=self.instance.pk)
        if duplicate.exists():
            raise forms.ValidationError("This category already exists.")
        return name

    def save(self, commit=True):
        category = super().save(commit=False)
        category.restaurant = self.restaurant
        if commit:
            category.save()
        return category


class MenuItemForm(forms.ModelForm):
    class Meta:
        model = MenuItem
        fields = (
            "name",
            "category",
            "description",
            "price",
            "photo",
            "available",
            "featured",
            "special_offer",
        )
        widgets = {
            "name": forms.TextInput(attrs={"maxlength": 160}),
            "description": forms.Textarea(attrs={"maxlength": 2000}),
            "price": forms.NumberInput(attrs={"min": "0", "step": "0.01"}),
            "photo": forms.ClearableFileInput(attrs={"accept": "image/*"}),
        }

    def __init__(self, *args, restaurant, **kwargs):
        self.restaurant = restaurant
        super().__init__(*args, **kwargs)
        self.fields["category"].queryset = MenuCategory.objects.filter(
            restaurant=restaurant,
        )

    def clean_photo(self):
        photo = self.cleaned_data.get("photo")
        validate_image_size(self.files.get(self.add_prefix("photo")))
        return photo

    def save(self, commit=True):
        item = super().save(commit=False)
        item.restaurant = self.restaurant
        if commit:
            item.full_clean()
            item.save()
        return item
