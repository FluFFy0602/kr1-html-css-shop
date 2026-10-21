// Fills the product select on order.html from PRODUCTS and preselects
// the product passed as order.html?product=<id>.
const productSelect = document.getElementById('order-product');
const productInfo = document.getElementById('order-product-info');

const orderPriceFormatter = new Intl.NumberFormat('ru-RU');

// Group options by category; unavailable products cannot be ordered.
const categories = [...new Set(PRODUCTS.map((item) => item.category))];

categories.forEach((category) => {
  const group = document.createElement('optgroup');
  group.label = category;

  PRODUCTS.filter((item) => item.category === category).forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.name} — ${orderPriceFormatter.format(item.price)} руб.`;
    option.disabled = !item.available;
    if (!item.available) {
      option.textContent += ' (нет в наличии)';
    }
    group.append(option);
  });

  productSelect.append(group);
});

function showProductInfo() {
  const selected = PRODUCTS.find((item) => item.id === productSelect.value);
  productInfo.textContent = selected ? `${selected.category}. ${selected.description}` : '';
}

const presetId = new URLSearchParams(window.location.search).get('product');
const preset = PRODUCTS.find((item) => item.id === presetId && item.available);

if (preset) {
  productSelect.value = preset.id;
}

productSelect.addEventListener('change', showProductInfo);
document.getElementById('order-form').addEventListener('reset', () => {
  // The reset restores values after this handler, so wait one tick.
  setTimeout(showProductInfo, 0);
});
showProductInfo();
