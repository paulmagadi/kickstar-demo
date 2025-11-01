



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
    const checkoutSection = document.querySelector(`.checkout-section[data-step="${step}"]`);
    if (!checkoutSection) return;
    checkoutSection.classList.add("open");

    // remove any previously inserted dynamic hidden-step elements so navigation back works
    document.querySelectorAll('.hidden-step.address, .hidden-step.payment, .hidden-step.review').forEach(el => el.remove());

    // default placeholder (the one present in DOM initially)
    const defaultHidden = document.querySelector(".hidden-step.default");

    // show default only on step 1, hide otherwise
    if (defaultHidden) {
        defaultHidden.style.display = step === 1 ? "" : "none";
    }

    const addressHidden = `
        <div class="hidden-step address">
            <h3 class="address-hidden">1. Shipping Address <span></span></h3>
        </div>
    `;
    const paymentHidden = `
        <div class="hidden-step payment">
            <h3 class="payment-hidden">2. Payment Method <span></span></h3>
            
        </div>
    `;
    const reviewHidden = `
        <div class="hidden-step review">
            <h3 class="review-hidden">3. Review &amp; Confirm <span></span></h3>
        </div>
    `;

    // Insert appropriate side/above/below helpers depending on active step
    if (step === 2) {
        checkoutSection.insertAdjacentHTML("beforebegin", addressHidden.trim());
        checkoutSection.insertAdjacentHTML("afterend", reviewHidden.trim());
        document.querySelector(".address-hidden span").innerHTML = `<i class="fa-solid fa-check"></i>`;
        document.querySelector(".address-hidden").classList.add("completed");
    } else if (step === 3) {
        checkoutSection.insertAdjacentHTML("beforebegin", addressHidden.trim());
        checkoutSection.insertAdjacentHTML("beforebegin", paymentHidden.trim());
        
        document.querySelector(".address-hidden span").innerHTML = `<i class="fa-solid fa-check"></i>`;
        document.querySelector(".payment-hidden span").innerHTML = `<i class="fa-solid fa-check"></i>`;
        document.querySelector(".address-hidden").classList.add("completed");
        document.querySelector(".payment-hidden").classList.add("completed");
    }

    // step badges
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
        const completeBtn = document.getElementById("complete-order-btn");
        if (completeBtn) completeBtn.disabled = !hasDefaultAddress;
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

            // If we're leaving step 3 (going back), disable the complete order button
            if (current === 3) {
                const completeBtn = document.getElementById("complete-order-btn");
                if (completeBtn) completeBtn.disabled = true;
            }

            goToStep(current - 1);
        });
    });


    renderAddresses();
    renderSummary();
    renderReview();
});

// ===== Step Validation =====
const errorEl = document.querySelector(".no-address-error");
const shippingContainer = document.querySelector(".shipping-details-container");
function validateStep(step) {
    switch(step) {
        case 1:
            const addresses = getAddresses();
            const hasDefaultAddress = addresses.some(a => a.isDefault);
            if (!hasDefaultAddress) {
                shippingContainer.classList.add("error");
                errorEl.style.display = "block";
                return false;
            } 
            showSuccessMessage('shipping-success');
            return true;
        case 2:
            const checked = document.querySelector('input[name="payment"]:checked');
            if (!checked) {
                alert("Please select a payment method before proceeding.");
                return false;
            }
            const paymentMethod = checked.value;
            localStorage.setItem("paymentMethod", paymentMethod);
            updateSelectedPaymentUI(paymentMethod);
            showSuccessMessage('payment-success');
            return true;
        default:
            return true;
    }
}


// Payment Method
function updateSelectedPaymentUI(selectedValue) {
    document.querySelectorAll('.payment-methods label.payment-option').forEach(label => {
        label.classList.remove('selected');
        const input = label.querySelector('input[name="payment"]');
        if (input && input.value === selectedValue) {
            label.classList.add('selected');
        }
    });
}

// Wire up change handlers and initialize the visual state when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', e => {
            const val = e.target.value;
            localStorage.setItem("paymentMethod", val);
            updateSelectedPaymentUI(val);
            showSuccessMessage('payment-success');
        });
    });

    // Initialize selection UI from saved method or checked radio
    const initVal = localStorage.getItem("paymentMethod") || (document.querySelector('input[name="payment"]:checked') && document.querySelector('input[name="payment"]:checked').value);
    if (initVal) updateSelectedPaymentUI(initVal);
});

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
    const addAddressBtn = document.getElementById("add-address-btn");
    const addresses = getAddresses();
    addressContainer.innerHTML = "";

    // No addresses
    if (addresses.length === 0) {
        addressContainer.innerHTML = `
            <div class="no-addresses">
                <i class="ri-map-pin-add-line"></i>
                No saved addresses yet. Please add your shipping address.
            </div>
        `;
        addAddressBtn.classList.add("empty-state"); // Special styling when no addresses exist (make the button more prominent)
        return;
    }

    // We have addresses
    addAddressBtn.classList.remove("empty-state"); // Remove special styling when addresses exist (less prominent style)
    addresses.forEach(addr => {
        const checked = addr.isDefault ? "checked" : "";
        const selClass = addr.isDefault ? "selected" : "";
        addressContainer.innerHTML += `
            <div class="address-card ${selClass}" data-id="${addr.id}">
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

    // Update selection state when radio changes
    document.querySelectorAll("input[name='selectedAddress']").forEach(radio => {
        radio.addEventListener("change", e => {
            const addresses = getAddresses();
            addresses.forEach(a => a.isDefault = a.id === e.target.value);
            saveAddresses(addresses);

            // Update visual selected class
            document.querySelectorAll(".address-card").forEach(card => card.classList.remove("selected"));
            const card = e.target.closest(".address-card");
            if (card) card.classList.add("selected");

            renderReview();
        });
        
    });

    // Make the whole card clickable (except action buttons) to select the address
    document.querySelectorAll(".address-card").forEach(card => {
        card.addEventListener("click", e => {
            if (e.target.closest(".edit-address-btn") || e.target.closest(".delete-address-btn")) return;
            const radio = card.querySelector("input[name='selectedAddress']");
            if (radio && !radio.checked) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });

    document.querySelectorAll(".edit-address-btn").forEach(btn => {
        btn.addEventListener("click", () => openEditModal(btn.dataset.id));
    });

    // Delete shipping address
    document.querySelectorAll(".delete-address-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = btn.dataset.id;
            const addresses = getAddresses();
            const addressToDelete = addresses.find(a => a.id === id);

            const deleteAddressConfirmModal = document.querySelector(".delete-address-confirm-modal");
            const deleteAddressConfirmBtn = document.querySelector(".confirm-delete-btn");
            const cancelDeleteBtn = document.querySelector(".cancel-delete-btn");

            // Fallback to native confirm if modal elements are missing
            if (!deleteAddressConfirmModal || !deleteAddressConfirmBtn || !cancelDeleteBtn) {
                if (!confirm("Are you sure you want to delete this address?")) return;
                const updated = addresses.filter(a => a.id !== id);
                if (addressToDelete && addressToDelete.isDefault && updated.length > 0) {
                    updated[0].isDefault = true;
                }
                saveAddresses(updated);
                renderAddresses();
                renderReview();
                return;
            }

            deleteAddressConfirmModal.style.display = "block";

            // handlers defined so we can remove them after use (avoid duplicate bindings)
            const onConfirm = () => {
                const updated = addresses.filter(a => a.id !== id);

                // If deleting the default address, set a new default if possible
                if (addressToDelete && addressToDelete.isDefault && updated.length > 0) {
                    updated[0].isDefault = true;
                }

                saveAddresses(updated);
                deleteAddressConfirmModal.style.display = "none";
                renderAddresses();
                renderReview();

                // cleanup
                deleteAddressConfirmBtn.removeEventListener("click", onConfirm);
                cancelDeleteBtn.removeEventListener("click", onCancel);
            };

            const onCancel = () => {
                deleteAddressConfirmModal.style.display = "none";
                deleteAddressConfirmBtn.removeEventListener("click", onConfirm);
                cancelDeleteBtn.removeEventListener("click", onCancel);
            };

            deleteAddressConfirmBtn.addEventListener("click", onConfirm);
            cancelDeleteBtn.addEventListener("click", onCancel);
        });
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


document.getElementById("address-form").addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("address-id").value;
    const baseAddr = {
        id: id || "ADDR" + Date.now(),
        fullname: document.getElementById("fullname").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        phone: document.getElementById("phone").value
    };

    let addresses = getAddresses();

    if (id) {
        // Editing: make edited address the selected/default one
        addresses = addresses.map(a => {
            if (a.id === id) {
                return { ...baseAddr, isDefault: true };
            }
            return { ...a, isDefault: false };
        });
    } else {
        // Adding new: make new address the selected/default one and unset others
        addresses = addresses.map(a => ({ ...a, isDefault: false }));
        addresses.push({ ...baseAddr, isDefault: true });
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
    shippingContainer.classList.remove("error");
    errorEl.style.display = "none";
};

document.getElementById("close-modal").onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// ===== Summary =====
function renderSummary() {
    const cart = getCart();
    const itemsEl = document.getElementById("summary-items");
    const shippingFee = 300; // Example static shipping cost
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

    document.getElementById("summary-subtotal").textContent = formatKES(subtotal);
    const tax = Math.round(subtotal * 0.16); // Example 16% VAT
    document.getElementById("summary-shipping").textContent = formatKES(shippingFee);
    document.getElementById("summary-tax").textContent = formatKES(tax);
    document.getElementById("summary-total").textContent = formatKES(subtotal + shippingFee + tax);
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
            let amount = item.qty * item.price

            reviewHTML += `
            <div>
            <img src="${item.image}" alt="${item.name}" width="60px" height="60px" style="border-radius: 4px;">
            <p>${item.name}</p>
            <p><strong>Color: </strong>${item.color}, <strong>Size: </strong>${item.size}</p>
            <p><strong>Price: </strong>${formatKES(item.price)}</p>
            <p><strong>Qty: </strong>${item.qty}</p>
            <p><strong>Amount: </strong>${formatKES(amount)}</p>
            </div>
            <br>
            <hr>
            <br>
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
    const tax = Math.round(subtotal * 0.16); // Example 16% VAT
    const total = subtotal + shipping + tax;

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
        subtotal,
        total,
        paymentMethod,
        shippingAddress: selected,
        shipping,
        tax,
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
        window.location.href = "../pages/order-success.html";
    }, 1500);
});



