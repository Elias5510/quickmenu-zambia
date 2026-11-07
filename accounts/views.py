from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import redirect, render

from restaurants.models import Restaurant

from .forms import OwnerProfileForm, OwnerRegistrationForm


def register(request):
    if request.user.is_authenticated:
        return redirect("dashboard:home")

    form = OwnerRegistrationForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        with transaction.atomic():
            owner = form.save()
            Restaurant.objects.create(
                owner=owner,
                business_name=form.cleaned_data["business_name"].strip(),
                email=owner.email,
            )
        login(request, owner)
        return redirect("dashboard:home")

    return render(request, "accounts/register.html", {"form": form})


@login_required
def profile(request):
    form = OwnerProfileForm(request.POST or None, instance=request.user)
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Your account profile has been updated.")
        return redirect("accounts:profile")
    return render(request, "accounts/profile.html", {"form": form})
