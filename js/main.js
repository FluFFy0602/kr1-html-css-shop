const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('[data-product]');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');
const dialogProduct = document.getElementById('order-dialog-product');

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedProductInput.value = button.dataset.product;
    dialogProduct.textContent = `Выбранный товар: ${button.dataset.product}`;
    dialogProduct.hidden = false;
    successMessage.hidden = true;
    orderDialog.showModal();
  });
});

closeDialogButton.addEventListener('click', () => {
  orderDialog.close();
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    orderDialog.close();
  });
});

// A click on the backdrop is dispatched to the dialog itself,
// so check that the pointer is outside the dialog box.
// Clicks on children (e.g. options of the native <select> popup, which
// report coordinates outside the dialog) must not close it.
orderDialog.addEventListener('click', (event) => {
  if (event.target !== orderDialog) {
    return;
  }

  const box = orderDialog.getBoundingClientRect();
  const isOutside =
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom;

  if (isOutside) {
    orderDialog.close();
  }
});

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute('aria-invalid');
    }
  });

  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });

    orderForm.reportValidity();
    return;
  }

  successMessage.hidden = false;
  orderForm.reset();
  orderDialog.close();
});

// Phone mask: typing "7" gives "+7", then "+7 (900) 000-00-00" is built
// automatically while the user types.
const phoneInput = document.getElementById('order-phone');

// Separators are put only between digits, never at the tail: otherwise
// Backspace would run into the mask and the field could not be cleared.
// Anything that does not look like a Russian number (letters, more than
// eleven digits) is left as typed.
function formatRuPhone(raw) {
  if (/[^\d\s()+\-.]/.test(raw)) {
    return raw;
  }

  const digits = raw.replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  // A leading 7 or 8 is the country code, anything else starts with the operator code.
  const hasCountryCode = digits[0] === '7' || digits[0] === '8';
  const national = hasCountryCode ? digits.slice(1) : digits;

  if (national.length > 10) {
    return raw;
  }
  if (!national.length) {
    return '+7';
  }

  let result = `+7 (${national.slice(0, 3)}`;
  if (national.length > 3) result += `) ${national.slice(3, 6)}`;
  if (national.length > 6) result += `-${national.slice(6, 8)}`;
  if (national.length > 8) result += `-${national.slice(8, 10)}`;
  return result;
}

// Put the caret after the same digit it stood after before reformatting,
// otherwise editing the middle of the number throws the caret to the end.
function caretAfterDigits(formatted, digitsBefore) {
  if (digitsBefore <= 0) {
    return formatted.search(/\d/) + 1 || formatted.length;
  }

  let seen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) {
      seen += 1;
      if (seen === digitsBefore) {
        return i + 1;
      }
    }
  }
  return formatted.length;
}

phoneInput.addEventListener('input', () => {
  const typed = phoneInput.value;
  const caret = phoneInput.selectionStart ?? typed.length;
  const digitsBefore = typed.slice(0, caret).replace(/\D/g, '').length;
  const formatted = formatRuPhone(typed);

  if (formatted === typed) {
    return;
  }

  const caretAtEnd = caret >= typed.length;
  phoneInput.value = formatted;

  const position = caretAtEnd ? formatted.length : caretAfterDigits(formatted, digitsBefore);
  phoneInput.setSelectionRange(position, position);
});

orderForm.addEventListener('input', (event) => {
  const field = event.target;

  if (field.hasAttribute('aria-invalid') && field.checkValidity()) {
    field.removeAttribute('aria-invalid');
  }
});
