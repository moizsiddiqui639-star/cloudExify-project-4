document.addEventListener('DOMContentLoaded', async () => {
  await requireAdmin();
  loadStats();
  loadOrders();
  loadMenuAdmin();
  setInterval(loadStats, 30000); // 30s auto-refresh
});

async function loadStats() {
  const { data: orders } = await supabase.from('orders').select('*');
  const { data: menu } = await supabase.from('menu_items').select('*');

  if (orders) {
    document.getElementById('statOrders').innerText = orders.length;
    const rev = orders.reduce((sum, o) => sum + parseFloat(o.total), 0);
    document.getElementById('statRev').innerText = `AED ${rev.toFixed(2)}`;
    document.getElementById('statPending').innerText = orders.filter(o => o.status === 'Pending').length;
  }
  if (menu) document.getElementById('statMenu').innerText = menu.length;
}

async function loadOrders() {
  const table = document.getElementById('adminOrdersTable');
  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (!table || !orders) return;

  table.innerHTML = orders.map(o => `
    <tr>
      <td>#${o.id}</td>
      <td><small>${o.items.map(i => i.name).join(', ')}</small></td>
      <td>AED ${o.total}</td>
      <td>
        <select onchange="updateStatus(${o.id}, this.value)" class="form-select form-select-sm">
          <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
          <option value="Ready" ${o.status === 'Ready' ? 'selected' : ''}>Ready</option>
        </select>
      </td>
    </tr>
  `).join('');
}

async function updateStatus(id, newStatus) {
  const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
  if (error) alert('Failed to update status.');
  else loadStats();
}

async function loadMenuAdmin() {
  const table = document.getElementById('adminMenuTable');
  const { data: items } = await supabase.from('menu_items').select('*').order('id');
  if (!table || !items) return;

  table.innerHTML = items.map(i => `
    <tr>
      <td>${i.name}</td>
      <td>${i.category}</td>
      <td>AED ${i.price}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteMenu(${i.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function addMenu(e) {
  e.preventDefault();
  const name = document.getElementById('mName').value;
  const price = document.getElementById('mPrice').value;
  const category = document.getElementById('mCat').value;
  const image_url = document.getElementById('mImg').value;

  const { error } = await supabase.from('menu_items').insert([{ name, price, category, image_url, available: true }]);
  if (error) alert('Failed to add item.');
  else {
    alert('Menu item added successfully!');
    document.getElementById('menuForm').reset();
    loadMenuAdmin();
    loadStats();
  }
}

async function deleteMenu(id) {
  if (confirm('Delete item?')) {
    await supabase.from('menu_items').delete().eq('id', id);
    loadMenuAdmin();
    loadStats();
  }
}