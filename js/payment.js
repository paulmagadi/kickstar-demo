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

  setTimeout(() => {
    const summary = JSON.parse(sessionStorage.getItem("checkoutSummary") || "{}");

    const orderData = {
      orderId: "ORD" + Date.now(),
      method,
      cart: summary.cart || [],
      total: summary.total || 0,
    };

    localStorage.setItem("lastOrder", JSON.stringify({
  id: "12345",
  total: 2599.00,
  paymentMethod: "MPesa"
}));


    // Save order for receipt page
    sessionStorage.setItem("lastOrder", JSON.stringify(orderData));

    // Clear cart
    localStorage.removeItem("cart");
    sessionStorage.removeItem("checkoutSummary");

    // Redirect to thank-you page
    window.location.href = "../pages/thankyou.html";
  }, 2000);
}

