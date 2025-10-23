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

    // Save summary in sessionStorage for the next step
    sessionStorage.setItem("checkoutSummary", JSON.stringify({
        cart,
        total,
    }));

    // Redirect to your payment page 
    window.location.href = "payment.html";
});
}




