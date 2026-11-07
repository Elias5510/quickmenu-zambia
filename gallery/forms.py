from django import forms

from core.uploads import validate_image_size

from .models import GalleryPhoto


class GalleryPhotoForm(forms.ModelForm):
    class Meta:
        model = GalleryPhoto
        fields = ("image", "caption", "category")
        widgets = {
            "image": forms.ClearableFileInput(attrs={"accept": "image/*"}),
            "caption": forms.TextInput(attrs={"maxlength": 180}),
        }

    def clean_image(self):
        image = self.cleaned_data.get("image")
        if not image and not self.instance.pk:
            raise forms.ValidationError("Choose an image to upload.")
        validate_image_size(self.files.get(self.add_prefix("image")))
        return image

    def save(self, commit=True):
        photo = super().save(commit=False)
        if commit:
            photo.save()
        return photo
