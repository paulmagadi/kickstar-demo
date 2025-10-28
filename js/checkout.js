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

    document.querySelectorAll(".step").forEach(s => {
        s.classList.remove("active", "completed");
        if (parseInt(s.dataset.step) === step) {
            s.classList.add("active");
        } else if (parseInt(s.dataset.step) < step) {
            s.classList.add("completed");
        }
    });

    // Update complete order button state
    if (step === 3) {
        const addresses = getAddresses();
        const hasDefaultAddress = addresses.some(a => a.isDefault);
        document.getElementById("complete-order-btn").disabled = !hasDefaultAddress;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Step navigation
    document.querySelectorAll(".next-step-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const current = parseInt(btn.closest(".checkout-section").dataset.step);
            if (validateStep(current)) {
                goToStep(current + 1);
            }
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
    renderReview();
});

// ===== Step Validation =====
function validateStep(step) {
    switch(step) {
        case 1:
            const addresses = getAddresses();
            const hasDefaultAddress = addresses.some(a => a.isDefault);
            if (!hasDefaultAddress) {
                alert("Please select a shipping address before proceeding.");
                return false;
            }
            showSuccessMessage('shipping-success');
            return true;
        case 2:
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            localStorage.setItem("paymentMethod", paymentMethod);
            showSuccessMessage('payment-success');
            return true;
        default:
            return true;
    }
}

function showSuccessMessage(id) {
    const message = document.getElementById(id);
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

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
        addressContainer.innerHTML = `<p class="no-addresses">No saved addresses yet. Please add your shipping address.</p>`;
        return;
    }

    addresses.forEach(addr => {
        const checked = addr.isDefault ? "checked" : "";
        addressContainer.innerHTML += `
            <div class="address-card">
                <label>
                    <input type="radio" name="selectedAddress" value="${addr.id}" ${checked}>
                    <div class="address-details">
                        <strong>${addr.fullname}</strong>
                        <div>${addr.address}, ${addr.city}</div>
                        <div>${addr.phone}</div>
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
            renderReview();
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
    if (confirm("Are you sure you want to delete this address?")) {
        const addresses = getAddresses();
        const addressToDelete = addresses.find(a => a.id === id);
        const updated = addresses.filter(a => a.id !== id);
        
        // If we're deleting the default address, set a new default
        if (addressToDelete.isDefault && updated.length > 0) {
            updated[0].isDefault = true;
        }
        
        saveAddresses(updated);
        renderAddresses();
        renderReview();
    }
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
    if (id) {
        addresses = addresses.map(a => a.id === id ? newAddr : a);
    } else {
        addresses.push(newAddr);
    }

    saveAddresses(addresses);
    modal.style.display = "none";
    renderAddresses();
    renderReview();
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

// ===== Review Section =====
function renderReview() {
    const reviewEl = document.getElementById("review-summary");
    const addresses = getAddresses();
    const selectedAddress = addresses.find(a => a.isDefault);
    const paymentMethod = localStorage.getItem("paymentMethod") || "Cash on Delivery";
    const cart = getCart();

    let reviewHTML = `
        <div class="review-section">
            <h4>Shipping Address</h4>
            <div class="review-details">
    `;

    if (selectedAddress) {
        reviewHTML += `
            <p><strong>${selectedAddress.fullname}</strong></p>
            <p>${selectedAddress.address}, ${selectedAddress.city}</p>
            <p>${selectedAddress.phone}</p>
        `;
    } else {
        reviewHTML += `<p>No shipping address selected</p>`;
    }

    reviewHTML += `
            </div>
        </div>
        <div class="review-section">
            <h4>Payment Method</h4>
            <div class="review-details">
                <p>${paymentMethod}</p>
            </div>
        </div>
        <div class="review-section">
            <h4>Order Items</h4>
            <div class="review-details">
    `;

    if (cart.length > 0) {
        cart.forEach(item => {
            reviewHTML += `
                <p>${item.name} - ${item.qty} x ${formatKES(item.price)}</p>
            `;
        });
    } else {
        reviewHTML += `<p>No items in cart</p>`;
    }

    reviewHTML += `
            </div>
        </div>
    `;

    reviewEl.innerHTML = reviewHTML;
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
    const addresses = getAddresses();
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
        items: cart,
        date: new Date().toISOString()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    localStorage.setItem("lastOrder", JSON.stringify(order));
    localStorage.removeItem("cart");

    // Show confirmation and redirect
    document.body.classList.add('loading');
    setTimeout(() => {
        // Redirect to thank-you page
        window.location.href = "../pages/thankyou.html";
    }, 1500);
});



