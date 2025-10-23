document.addEventListener("DOMContentLoaded", () => {
  const receiptEl = document.getElementById("order-receipt");
  const orderData = JSON.parse(sessionStorage.getItem("lastOrder") || "{}");

  if (!orderData.cart || orderData.cart.length === 0) {
    receiptEl.innerHTML = `<p>No order found. Please <a href="../index.html">go back to the shop</a>.</p>`;
    return;
  }

  const orderId = orderData.orderId || "ORD" + Date.now();
  const date = new Date().toLocaleString();

  let html = `
    <div class="receipt-box">
      <h2>Order Receipt</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Date:</strong> ${date}</p>
      <hr>
      <table class="receipt-table">
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

  orderData.cart.forEach(item => {
    const subtotal = item.qty * item.price;
    html += `
      <tr>
        <td>${item.name}</td>
        <td>${item.color}, Size ${item.size}</td>
        <td>${item.qty}</td>
        <td>KES ${item.price}</td>
        <td>KES ${subtotal.toFixed(2)}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <hr>
      <p class="receipt-total"><strong>Total:</strong> KES ${orderData.total.toFixed(2)}</p>
      <p class="receipt-method"><strong>Payment Method:</strong> ${orderData.method}</p>
    </div>
  `;

  receiptEl.innerHTML = html;
});
