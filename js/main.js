// Order dialog and the elements it works with.
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

// Order form and the message shown after a successful submit.
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

// Every "Заказать" button opens the dialog for its own product.
orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // The product name comes from the data-product attribute
    // and is sent with the form through the hidden field.
    selectedProductInput.value = button.dataset.product;

    // A message left over from the previous order is no longer relevant.
    successMessage.hidden = true;

    orderDialog.showModal();
  });
});

closeDialogButton.addEventListener('click', () => {
  orderDialog.close();
});

orderForm.addEventListener('submit', (event) => {
  // There is no backend yet, so the browser must not send the form.
  event.preventDefault();

  const formElements = Array.from(orderForm.elements);

  // Clear error marks left from the previous attempt.
  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute('aria-invalid');
    }
  });

  // Built-in HTML constraints: required, minlength, pattern, type="email".
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });

    // Show the browser's own hint for the first invalid field.
    orderForm.reportValidity();
    return;
  }

  successMessage.hidden = false;
  orderForm.reset();
  orderDialog.close();
});

// Remove the error mark as soon as the user fixes the field,
// instead of keeping it red until the next submit.
orderForm.addEventListener('input', (event) => {
  const field = event.target;

  if (field.hasAttribute('aria-invalid') && field.checkValidity()) {
    field.removeAttribute('aria-invalid');
  }
});
