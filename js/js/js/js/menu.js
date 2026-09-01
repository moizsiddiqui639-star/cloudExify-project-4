let menuItems = [];

async function loadMenu() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true);

  if (error) {
    grid.innerHTML = '<p class="text-danger">Unable to load menu.</p>';
    return;
  }

  menuItems = data;
  renderMenu(menuItems);
}

function renderMenu(items) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  grid.innerHTML = items.map(item => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="card h-100 border-0 shadow-sm">
        <img src="${item.image_url}" class="card-img-top food-img" alt="${item.name}">
        <div class="card-body d-flex flex-column">
          <span class="badge bg-secondary w-auto mb-1">${item.category}</span>
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text text-muted small flex-grow-1">${item.description}</p>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="fw-bold">AED ${item.price}</span>
            <button class="btn btn-cafe btn-sm" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCategory(category) {
  if (category === 'All') renderMenu(menuItems);
  else renderMenu(menuItems.filter(i => i.category === category));
}

function searchMenu(query) {
  renderMenu(menuItems.filter(i => i.name.toLowerCase().includes(query.toLowerCase())));
}

document.addEventListener('DOMContentLoaded', loadMenu);