(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-registration-form]");
    const success = document.querySelector("[data-registration-success]");
    const formError = document.querySelector("[data-form-error]");
    if (!form || !success || !formError) return;

    const validatedFields = [...form.querySelectorAll("[data-validate]")];

    function showFieldError(field, message) {
      const error = field.querySelector("[data-field-error]") ||
        form.querySelector(`#error-${field.dataset.validate}`);
      if (error) {
        error.textContent = message;
        error.hidden = false;
      }

      field.querySelectorAll("input, select, textarea").forEach(control => {
        control.setAttribute("aria-invalid", "true");
      });
    }

    function clearFieldError(field) {
      const error = field.querySelector("[data-field-error]") ||
        form.querySelector(`#error-${field.dataset.validate}`);
      if (error) {
        error.textContent = "";
        error.hidden = true;
      }

      field.querySelectorAll("input, select, textarea").forEach(control => {
        control.removeAttribute("aria-invalid");
      });
    }

    function validateField(field) {
      const name = field.dataset.validate;
      const controls = [...form.elements].filter(control => control.name === name);
      if (!controls.length) return true;

      const isRadioGroup = controls[0].type === "radio";
      const isCheckboxGroup = controls.length === 1 && controls[0].type === "checkbox";
      let message = "";

      if (isRadioGroup && !controls.some(control => control.checked)) {
        message = name === "plan" ? "Choose a plan to continue." : "Choose Yes or No.";
      } else if (isCheckboxGroup && !controls[0].checked) {
        message = "Please agree to the terms before continuing.";
      } else if (!isRadioGroup && !isCheckboxGroup) {
        const control = controls[0];
        if (!control.value.trim()) {
          message = "This field is required.";
        } else if (name === "email" && !control.validity.valid) {
          message = "Enter a valid email address.";
        } else if ((name === "phone" || name === "whatsapp") &&
            control.value.replace(/\D/g, "").length < 7) {
          message = "Enter a valid phone number.";
        }
      }

      if (message) {
        showFieldError(field, message);
        return false;
      }

      clearFieldError(field);
      return true;
    }

    form.addEventListener("input", event => {
      const field = event.target.closest("[data-validate]");
      if (field && field.querySelector('[aria-invalid="true"]')) clearFieldError(field);
      formError.hidden = true;
    });

    form.addEventListener("change", event => {
      const field = event.target.closest("[data-validate]");
      if (field) {
        clearFieldError(field);
        validateField(field);
      }
      formError.hidden = true;
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      const invalidFields = validatedFields.filter(field => !validateField(field));
      if (invalidFields.length) {
        formError.hidden = false;
        const firstInvalid = invalidFields[0].querySelector("input, select, textarea");
        firstInvalid?.focus();
        return;
      }

      form.hidden = true;
      form.style.display = "none";
      success.hidden = false;
      success.focus();
    });
  });
})();
