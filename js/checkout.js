document.addEventListener("DOMContentLoaded", () => {
    renderCheckoutSummary();
});

function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function renderCheckoutSummary() {
    const cart = getCart();
    const body = document.getElementById("checkout-body");
    const totalEl = document.getElementById("checkout-total");

    if (!body || !totalEl) return;

    body.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        body.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
        totalEl.textContent = "KES 0.00";
        document.getElementById("proceed-payment-btn").disabled = true;
        return;
    }

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        body.innerHTML += `
            <tr>
                <td>
                    <img src="${item.image}" alt="${item.name}" width="50">
                    <br>${item.name}
                </td>
                <td>${item.color}, Size ${item.size}</td>
                <td>KES ${item.price}</td>
                <td>${item.qty}</td>
                <td>KES ${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    totalEl.textContent = `KES ${total.toFixed(2)}`;


    document.getElementById("proceed-payment-btn").addEventListener("click", () => {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);


    // Include selected shipping address
    const selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress") || "null");

    // Save summary in sessionStorage for the next step
    sessionStorage.setItem("checkoutSummary", JSON.stringify({
        cart,
        total,
        shipping: selectedAddress || null,
    }));


    // Redirect to your payment page 
    window.location.href = "payment.html";
});
}


document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("address-modal");
    const closeBtn = document.getElementById("close-modal");
    const addNewBtn = document.getElementById("add-new-address");
    const editSavedBtn = document.getElementById("edit-saved-address");
    const useSavedBtn = document.getElementById("use-saved-address");
    const addressForm = document.getElementById("address-form");
    const selectedAddressEl = document.getElementById("selected-address");
    const selectedText = document.getElementById("selected-address-text");

    const savedAddress = {
        name: "Bella Diamonds",
        phone: "+254 712 345 678",
        address: "123 Eco Street, Nairobi, Kenya"
    };

    // Use saved address
    useSavedBtn.addEventListener("click", () => {
        sessionStorage.setItem("selectedAddress", JSON.stringify(savedAddress));
        showSelectedAddress(savedAddress);
    });

    // Open popup for new or edit
    addNewBtn.addEventListener("click", () => openModal());
    editSavedBtn.addEventListener("click", () => openModal(savedAddress));

    // Close modal
    closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Save new address
    addressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newAddress = {
            name: document.getElementById("full-name").value,
            phone: document.getElementById("phone-number").value,
            address: document.getElementById("address-text").value
        };

        sessionStorage.setItem("selectedAddress", JSON.stringify(newAddress));
        closeModal();
        showSelectedAddress(newAddress);
    });

    function openModal(address = null) {
        modal.classList.remove("hidden");
        if (address) {
            document.getElementById("full-name").value = address.name;
            document.getElementById("phone-number").value = address.phone;
            document.getElementById("address-text").value = address.address;
        } else {
            addressForm.reset();
        }
    }

    function closeModal() {
        modal.classList.add("hidden");
    }

    function showSelectedAddress(addr) {
        selectedAddressEl.classList.remove("hidden");
        selectedText.innerHTML = `
            <strong>${addr.name}</strong><br>
            ${addr.phone}<br>
            ${addr.address}
        `;
    }

    // Restore from session (if already chosen)
    const stored = JSON.parse(sessionStorage.getItem("selectedAddress") || "null");
    if (stored) showSelectedAddress(stored);
});


