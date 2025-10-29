
document.addEventListener("DOMContentLoaded", () => {
    const order = JSON.parse(localStorage.getItem("lastOrder") || "{}");
    const items = order.items || order.cart || [];

    const shippingFee = 300;

    document.getElementById("order-id").textContent = order.id || "#12345";
    document.getElementById("order-date").textContent = new Date().toLocaleString();
    document.getElementById("order-payment").textContent = order.paymentMethod || "MPesa";
    document.getElementById("order-subtotal").textContent = order.subtotal.toFixed(2) || "0.00";
    document.getElementById("order-shipping").textContent = shippingFee.toFixed(2) || "0.00";
    document.getElementById("order-tax").textContent = order.tax?.toFixed(2) || "0.00";
    document.getElementById("order-total").textContent = order.total?.toFixed(2) || "0.00";

    const itemsEl = document.getElementById("receipt-items");
    itemsEl.innerHTML = "";

    const shipping = order.shippingAddress;
    const shippingEl = document.getElementById("shipping-details");

    if (shipping) {
        shippingEl.innerHTML = `
            <strong>Shipping To:</strong><br>
            ${shipping.fullname}<br>
            ${shipping.phone}<br>
            ${shipping.address}, ${shipping.city}
        `;
    } else {
        shippingEl.innerHTML = `<em>No shipping address provided</em>`;
    }


if (items.length > 0) {
    items.forEach(item => {
        const imageSrc = item.image || item.product || "";
        const name = item.name || item.product || "Unnamed";
        const qty = item.qty || item.quantity || 1;
        const price = item.price || 0;
        const color = item.color || "-";
        const size = item.size || "-";
        const subtotal = qty * price;

        const row = document.createElement("tr");

        // Image + name cell: create img element and set crossOrigin before src
        const tdImage = document.createElement("td");
        const img = document.createElement("img");
        img.alt = name;
        img.width = 50;
        if (imageSrc) {
            // allow html2canvas to fetch cross-origin images (server must send CORS headers)
            img.crossOrigin = "anonymous";
            img.src = imageSrc;
        } else {
            img.src = "";
        }
        tdImage.appendChild(img);
        tdImage.appendChild(document.createElement("br"));
        tdImage.appendChild(document.createTextNode(name));
        row.appendChild(tdImage);

        // Other cells
        const tdDetails = document.createElement("td");
        tdDetails.textContent = `${color}, Size ${size}`;
        row.appendChild(tdDetails);
        const options = {
            margin: 10,
            filename: `KickStar_${order.id || Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, allowTaint: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const tdQty = document.createElement("td");
        tdQty.textContent = `${qty}`;
        row.appendChild(tdQty);

        const tdPrice = document.createElement("td");
        tdPrice.textContent = `KES ${price.toFixed(2)}`;
        row.appendChild(tdPrice);

        const tdSubtotal = document.createElement("td");
        tdSubtotal.textContent = `KES ${subtotal.toFixed(2)}`;
        row.appendChild(tdSubtotal);

        itemsEl.appendChild(row);
    });
} else {
    itemsEl.innerHTML = `<tr><td colspan="5" style="text-align:center;">No items found</td></tr>`;
}

    // Auto-clear cart (optional)
    localStorage.removeItem("cart");

    // PDF generation
    document.getElementById("download-receipt-btn").addEventListener("click", () => {
        const element = document.getElementById("order-receipt");
        const options = {
            margin: 10,
            filename: `KickStar_${order.id || Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(element).save();
    });

});



// Add crossOrigin and useCORS so html2canvas can include remote images and build image elements programmatically (setting crossOrigin before src) to avoid tainting the canvas.