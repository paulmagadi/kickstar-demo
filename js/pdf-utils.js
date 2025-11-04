// PDF Generation Utilities
class PDFGenerator {
    constructor() {
        this.{ jsPDF } = window.jspdf;
    }

    // Main method to generate and download receipt
    generateReceiptPDF(order) {
        try {
            const doc = new this.jsPDF();
            const items = order.items || order.cart || [];
            const shippingFee = 300;
            const subtotal = order.subtotal || this.calculateSubtotal(items);
            const tax = order.tax || subtotal * 0.16;
            const total = order.total || (subtotal + shippingFee + tax);
            const shipping = order.shippingAddress;

            let yPosition = 20;

            // Generate PDF content
            this.addHeader(doc, yPosition);
            yPosition = this.addOrderDetails(doc, order, yPosition + 25);
            yPosition = this.addShippingInfo(doc, shipping, yPosition + 10);
            yPosition = this.addOrderItems(doc, items, yPosition + 15);
            this.addCostSummary(doc, yPosition + 10, subtotal, tax, shippingFee, total);
            this.addFooter(doc);

            // Save the PDF
            const fileName = `KickStar_Receipt_${order.id || Date.now()}.pdf`;
            doc.save(fileName);

            // Track download event
            this.trackDownload(order.id);

            return true;
        } catch (error) {
            console.error("PDF generation failed:", error);
            throw new Error("Failed to generate PDF receipt");
        }
    }

    addHeader(doc, yPosition) {
        // Header Section
        doc.setFontSize(24);
        doc.setTextColor(0, 168, 150); // Secondary color
        doc.text("KICKSTAR", 105, yPosition, { align: 'center' });

        yPosition += 10;
        doc.setFontSize(16);
        doc.setTextColor(253, 48, 8); // Primary color
        doc.text("ORDER CONFIRMATION", 105, yPosition, { align: 'center' });

        yPosition += 15;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Thank you for your order! Your purchase supports sustainable fashion.", 105, yPosition, { align: 'center' });
    }

    addOrderDetails(doc, order, yPosition) {
        // Order Information
        doc.setFontSize(14);
        doc.setTextColor(45, 45, 45);
        doc.text("ORDER DETAILS", 20, yPosition);

        yPosition += 10;
        doc.setFontSize(10);
        doc.text(`Order ID: ${order.id || "#12345"}`, 20, yPosition);
        doc.text(`Date: ${new Date().toLocaleString('en-KE')}`, 120, yPosition);

        yPosition += 6;
        doc.text(`Payment Method: ${order.paymentMethod || "MPesa"}`, 20, yPosition);

        return yPosition;
    }

    addShippingInfo(doc, shipping, yPosition) {
        if (!shipping) return yPosition;

        // Shipping Information
        doc.setFontSize(14);
        doc.text("SHIPPING ADDRESS", 20, yPosition);

        yPosition += 8;
        doc.setFontSize(10);
        doc.text(`${shipping.fullname}`, 20, yPosition);
        yPosition += 5;
        doc.text(`${shipping.phone}`, 20, yPosition);
        yPosition += 5;
        doc.text(`${shipping.address}, ${shipping.city}`, 20, yPosition);

        return yPosition;
    }

    addOrderItems(doc, items, startY) {
        let yPosition = startY;

        // Order Items Table Header
        doc.setFontSize(14);
        doc.text("ORDER ITEMS", 20, yPosition);
        yPosition += 10;

        // Table Headers
        doc.setFillColor(244, 246, 246);
        doc.rect(20, yPosition, 170, 8, 'F');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Product", 35, yPosition + 6);
        doc.text("Details", 90, yPosition + 6);
        doc.text("Qty", 140, yPosition + 6);
        doc.text("Price", 150, yPosition + 6);
        doc.text("Subtotal", 170, yPosition + 6);

        yPosition += 12;

        // Order Items
        if (items.length === 0) {
            doc.text("No items in this order", 22, yPosition);
            return yPosition + 10;
        }

        items.forEach((item, index) => {
            const name = item.name || item.product || "Unnamed Product";
            const qty = item.qty || item.quantity || 1;
            const price = item.price || 0;
            const color = item.color || "-";
            const size = item.size || "-";
            const itemSubtotal = qty * price;

            // Alternate row background
            if (index % 2 === 0) {
                doc.setFillColor(248, 249, 250);
                doc.rect(20, yPosition - 4, 170, 12, 'F');
            }

            doc.setTextColor(0, 0, 0);

            // Add product info
            doc.text(name.substring(0, 20), 22, yPosition + 4);
            doc.text(`${color}, ${size}`, 90, yPosition + 4);
            doc.text(qty.toString(), 140, yPosition + 4);
            doc.text(`KES ${price.toFixed(2)}`, 150, yPosition + 4);
            doc.text(`KES ${itemSubtotal.toFixed(2)}`, 170, yPosition + 4);

            yPosition += 12;

            // Page break check
            if (yPosition > 250 && index < items.length - 1) {
                doc.addPage();
                yPosition = 20;

                // Add table headers on new page
                doc.setFillColor(244, 246, 246);
                doc.rect(20, yPosition, 170, 8, 'F');
                doc.setFontSize(10);
                doc.text("Product", 35, yPosition + 6);
                doc.text("Details", 90, yPosition + 6);
                doc.text("Qty", 140, yPosition + 6);
                doc.text("Price", 150, yPosition + 6);
                doc.text("Subtotal", 170, yPosition + 6);
                yPosition += 12;
            }
        });

        return yPosition;
    }

    addCostSummary(doc, yPosition, subtotal, tax, shippingFee, total) {
        // Cost Summary
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        doc.text("Subtotal:", 120, yPosition);
        doc.text(`KES ${subtotal.toFixed(2)}`, 170, yPosition, { align: 'right' });

        yPosition += 6;
        doc.text("Tax (16%):", 120, yPosition);
        doc.text(`KES ${tax.toFixed(2)}`, 170, yPosition, { align: 'right' });

        yPosition += 6;
        doc.text("Shipping:", 120, yPosition);
        doc.text(`KES ${shippingFee.toFixed(2)}`, 170, yPosition, { align: 'right' });

        yPosition += 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("TOTAL:", 120, yPosition);
        doc.text(`KES ${total.toFixed(2)}`, 170, yPosition, { align: 'right' });
    }

    addFooter(doc) {
        let yPosition = 250;

        // Footer Message
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);

        const footerText = [
            "We'll notify you once your order is on its way.",
            "If you chose Cash on Delivery, please have the amount ready upon delivery.",
            "",
            "Signed,",
            "The KickStar Team",
            "Thank you for supporting sustainable fashion"
        ];

        footerText.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 105, yPosition, { align: 'center' });
            yPosition += 5;
        });
    }

    calculateSubtotal(items) {
        return items.reduce((total, item) => {
            const qty = item.qty || item.quantity || 1;
            const price = item.price || 0;
            return total + (qty * price);
        }, 0);
    }

    trackDownload(orderId) {
        // In a real app, you would send this to your analytics service
        console.log(`PDF downloaded for order: ${orderId}`);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'receipt_downloaded', {
                'event_category': 'engagement',
                'event_label': 'PDF Receipt',
                'value': orderId
            });
        }
    }
}

// Create global instance
window.PDFGenerator = new PDFGenerator();