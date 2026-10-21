// Renders product.html for the product selected by ?id=<id>.
const productId = new URLSearchParams(window.location.search).get('id');
const product = PRODUCTS.find((item) => item.id === productId);

const productRoot = document.getElementById('product');
const productNotFound = document.getElementById('product-not-found');
const breadcrumbCurrent = document.getElementById('breadcrumb-product');

const priceFormatter = new Intl.NumberFormat('ru-RU');

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

if (product) {
  document.title = `${product.name} — Учебный интернет-магазин`;
  document
    .querySelector('meta[name="description"]')
    .setAttribute('content', `${product.name}: ${product.description}`);

  breadcrumbCurrent.textContent = product.name;

  const image = document.getElementById('product-image');
  image.src = product.image;
  image.alt = product.name;

  setText('product-category', product.category);
  setText('product-title', product.name);
  setText('product-description', product.description);
  setText('product-price', `${priceFormatter.format(product.price)} руб.`);

  const badge = document.getElementById('product-badge');
  if (product.badge) {
    badge.textContent = product.badge;
    badge.hidden = false;
  }

  const status = document.getElementById('product-status');
  const orderButton = document.getElementById('product-order');

  if (product.available) {
    status.textContent = 'В наличии';
    orderButton.dataset.product = product.name;
  } else {
    status.textContent = 'Нет в наличии';
    status.classList.add('product-page__status--unavailable');
    orderButton.disabled = true;
    orderButton.textContent = 'Недоступно';
  }

  const specsBody = document.getElementById('product-specs');
  product.specs.forEach(([name, value]) => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('th');
    nameCell.scope = 'row';
    nameCell.className = 'specs-table__name';
    nameCell.textContent = name;

    const valueCell = document.createElement('td');
    valueCell.className = 'specs-table__value';
    valueCell.textContent = value;

    row.append(nameCell, valueCell);
    specsBody.append(row);
  });

  productRoot.hidden = false;
} else {
  breadcrumbCurrent.textContent = 'Товар не найден';
  document.title = 'Товар не найден — Учебный интернет-магазин';
  productNotFound.hidden = false;
}
