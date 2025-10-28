// ===== Utility functions =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function formatKES(amount) {
  return "KES " + amount.toFixed(2);
}

// ====== Step Navigation ======
function goToStep(step) {
  document.querySelectorAll(".checkout-section").forEach(s => s.classList.remove("open"));
  document.querySelector(`.checkout-section[data-step="${step}"]`).classList.add("open");

  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.querySelector(`.step[data-step="${step}"]`).classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  // Step navigation
  document.querySelectorAll(".next-step-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const current = parseInt(btn.closest(".checkout-section").dataset.step);
      goToStep(current + 1);
    });
  });

  document.querySelectorAll(".prev-step-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const current = parseInt(btn.closest(".checkout-section").dataset.step);
      goToStep(current - 1);
    });
  });

  renderAddresses();
  renderSummary();
});

// ===== Address Handling =====
const addressContainer = document.getElementById("saved-addresses-container");
const modal = document.getElementById("address-modal");
const modalTitle = document.getElementById("modal-title");

function getAddresses() {
  return JSON.parse(localStorage.getItem("addresses") || "[]");
}

function saveAddresses(addresses) {
  localStorage.setItem("addresses", JSON.stringify(addresses));
}

function renderAddresses() {
  const addresses = getAddresses();
  addressContainer.innerHTML = "";

  if (addresses.length === 0) {
    addressContainer.innerHTML = `<p>No saved addresses yet.</p>`;
    return;
  }

  addresses.forEach(addr => {
    const checked = addr.isDefault ? "checked" : "";
    addressContainer.innerHTML += `
      <div class="address-card">
        <label>
          <input type="radio" name="selectedAddress" value="${addr.id}" ${checked}>
          <div>
            <strong>${addr.fullname}</strong><br>
            ${addr.address}, ${addr.city}<br>
            ${addr.phone}
          </div>
        </label>
        <div class="address-actions">
          <button class="edit-address-btn" data-id="${addr.id}">Edit</button>
          <button class="delete-address-btn" data-id="${addr.id}">Delete</button>
        </div>
      </div>
    `;
  });

  document.querySelectorAll("input[name='selectedAddress']").forEach(radio => {
    radio.addEventListener("change", e => {
      const addresses = getAddresses();
      addresses.forEach(a => a.isDefault = a.id === e.target.value);
      saveAddresses(addresses);
    });
  });

  document.querySelectorAll(".edit-address-btn").forEach(btn => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.id));
  });

  document.querySelectorAll(".delete-address-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteAddress(btn.dataset.id));
  });
}

function openEditModal(id) {
  const addr = getAddresses().find(a => a.id === id);
  if (!addr) return;

  modalTitle.textContent = "Edit Address";
  document.getElementById("address-id").value = addr.id;
  document.getElementById("fullname").value = addr.fullname;
  document.getElementById("address").value = addr.address;
  document.getElementById("city").value = addr.city;
  document.getElementById("phone").value = addr.phone;
  modal.style.display = "flex";
}

function deleteAddress(id) {
  const updated = getAddresses().filter(a => a.id !== id);
  saveAddresses(updated);
  renderAddresses();
}

document.getElementById("address-form").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("address-id").value;
  const newAddr = {
    id: id || "ADDR" + Date.now(),
    fullname: document.getElementById("fullname").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    phone: document.getElementById("phone").value,
    isDefault: getAddresses().length === 0
  };

  let addresses = getAddresses();
  if (id) addresses = addresses.map(a => a.id === id ? newAddr : a);
  else addresses.push(newAddr);

  saveAddresses(addresses);
  modal.style.display = "none";
  renderAddresses();
});

document.getElementById("add-address-btn").onclick = () => {
  modalTitle.textContent = "Add New Address";
  document.getElementById("address-form").reset();
  document.getElementById("address-id").value = "";
  modal.style.display = "flex";
};

document.getElementById("close-modal").onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// ===== Summary =====
function renderSummary() {
  const cart = getCart();
  const itemsEl = document.getElementById("summary-items");
  let subtotal = 0;
  itemsEl.innerHTML = "";

  if (cart.length === 0) {
    itemsEl.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach(item => {
      const line = document.createElement("div");
      line.className = "summary-item";
      const sub = item.qty * item.price;
      subtotal += sub;
      line.innerHTML = `
        <div>${item.name} (${item.qty})</div>
        <div>${formatKES(sub)}</div>
      `;
      itemsEl.appendChild(line);
    });
  }

  const shipping = subtotal > 0 ? 300 : 0;
  document.getElementById("summary-subtotal").textContent = formatKES(subtotal);
  document.getElementById("summary-shipping").textContent = formatKES(shipping);
  document.getElementById("summary-total").textContent = formatKES(subtotal + shipping);
}


// ✅ Complete Order
document.getElementById("complete-order-btn").addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // Calculate totals directly here
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 300 : 0;
  const total = subtotal + shipping;

  // Get selected/default shipping address
  const addresses = JSON.parse(localStorage.getItem("addresses") || "[]");
  const selected = addresses.find(a => a.isDefault);
  if (!selected) {
    alert("Please select a shipping address before completing your order.");
    return;
  }

  const paymentMethod = localStorage.getItem("paymentMethod") || "Cash on Delivery";

  const order = {
    id: "ORD" + Date.now(),
    total,
    paymentMethod,
    shippingAddress: selected,
    items: cart
  };

  localStorage.setItem("lastOrder", JSON.stringify(order));
  localStorage.removeItem("cart");

  // Redirect to thank-you page
  window.location.href = "../pages/thankyou.html";
});
