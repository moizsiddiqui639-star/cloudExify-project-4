async function placeOrder() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    alert('Please login to place an order.');
    window.location.href = 'login.html';
    return;
  }

  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const { data, error } = await supabase
    .from('orders')
    .insert([{ user_id: session.user.id, items: cart, total: total, status: 'Pending' }])
    .select();

  if (error) {
    alert('Could not place your order. Please try again.');
    return;
  }

  clearCart();
  alert(`Order placed successfully! Order ID: #${data[0].id}`);
  loadMyOrders();
}

async function loadMyOrders() {
  const container = document.getElementById('myOrders');
  if (!container) return;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (!orders || orders.length === 0) {
    container.innerHTML = '<p class="text-muted">No past orders.</p>';
    return;
  }

  container.innerHTML = orders.map(o => `
    <div class="card mb-2 border-0 shadow-sm p-3">
      <div class="d-flex justify-content-between">
        <strong>Order #${o.id}</strong>
        <span class="badge bg-primary">${o.status}</span>
      </div>
      <small class="text-muted">${o.items.map(i => i.name + ' (x' + i.quantity + ')').join(', ')}</small>
      <div class="fw-bold mt-1">AED ${o.total}</div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadMyOrders);