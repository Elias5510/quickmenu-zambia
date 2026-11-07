import re

from django.core.exceptions import ValidationError


def normalize_zambian_phone(value):
    digits = re.sub(r"\D", "", str(value or ""))
    if digits.startswith("00"):
        digits = digits[2:]
    if len(digits) == 10 and digits.startswith("0"):
        digits = f"260{digits[1:]}"
    elif len(digits) == 9:
        digits = f"260{digits}"
    if not re.fullmatch(r"260\d{9}", digits):
        raise ValidationError("Enter a valid Zambian phone number.")
    return f"+{digits}"
