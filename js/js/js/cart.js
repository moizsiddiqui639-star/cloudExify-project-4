let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

function saveCart() {
  sessionStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function addToCart(id, name, price) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  saveCart();
  alert(`${name} added to cart!`);
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
  }
  saveCart();
}

function clearCart() {
  cart = [];
  sessionStorage.removeItem('cart');
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalElem = document.getElementById('cartTotal');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-muted">Cart is empty</p>';
    if (totalElem) totalElem.innerText = 'AED 0.00';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div><strong>${item.name}</strong><br><small>AED ${item.price} x ${item.quantity}</small></div>
        <div>
          <button class="btn btn-sm btn-secondary" onclick="updateQty(${item.id}, -1)">-</button>
          <span class="mx-1">${item.quantity}</span>
          <button class="btn btn-sm btn-secondary" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalElem) totalElem.innerText = `AED ${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', renderCart);