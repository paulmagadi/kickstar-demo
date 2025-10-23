document.addEventListener("DOMContentLoaded", () => {
    renderPaymentSummary();

    document.getElementById("cod-btn").addEventListener("click", () => {
        simulatePayment("Cash on Delivery");
    });

    document.getElementById("simulate-mpesa-btn").addEventListener("click", () => {
        simulatePayment("MPesa");
    });
});

function renderPaymentSummary() {
    const summary = JSON.parse(sessionStorage.getItem("checkoutSummary") || "{}");
    const container = document.getElementById("order-summary");

    if (!summary.cart || summary.cart.length === 0) {
        container.innerHTML = `<p>Your cart is empty or session expired.</p>`;
        return;
    }

    let html = `
        <table class="order-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

    summary.cart.forEach(item => {
        const subtotal = item.qty * item.price;
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.color}, ${item.size}</td>
                <td>${item.qty}</td>
                <td>KES ${item.price}</td>
                <td>KES ${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <p><strong>Total: KES ${summary.total.toFixed(2)}</strong></p>
    `;

    container.innerHTML = html;
}

function simulatePayment(method) {
    const statusEl = document.getElementById("payment-status");
    statusEl.style.color = "blue";
    statusEl.textContent = `Processing ${method}...`;

    // Add a spinner
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.innerHTML = `<i class="ri-loader-4-line ri-spin" style="font-size: 24px; color: blue;"></i>`;
    statusEl.appendChild(spinner);

    // Simulate payment delay
    setTimeout(() => {
        const summary = JSON.parse(sessionStorage.getItem("checkoutSummary") || "{}");

        const orderData = {
            id: "ORD" + Date.now(),
            total: summary.total || 0,
            paymentMethod: method,
            cart: summary.cart || []
        };

        // Save order
        localStorage.setItem("lastOrder", JSON.stringify(orderData));

        // Clear cart
        localStorage.removeItem("cart");
        sessionStorage.removeItem("checkoutSummary");

        // Remove spinner
        spinner.remove();

        // Show success popup
        showPaymentSuccessPopup(method);

        // Redirect after short delay
        setTimeout(() => {
            window.location.href = "../pages/thankyou.html";
        }, 3500);
    }, 2500);
}

function showPaymentSuccessPopup(method) {
    const popup = document.createElement("div");
    popup.classList.add("payment-popup");

    popup.innerHTML = `
        <div class="popup-content">
            <div class="success-icon">
                <i class="ri-checkbox-circle-fill"></i>
            </div>
            <h3>Payment Successful!</h3>
            <p>Your payment via <strong>${method}</strong> was completed successfully.</p>
            <p class="redirect-note">Redirecting to receipt...</p>
        </div>
    `;

    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 50);
    setTimeout(() => popup.classList.remove("show"), 3200);
    setTimeout(() => popup.remove(), 4000);
}
