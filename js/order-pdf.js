// PDF Generation Utilities for Order Receipts
class PDFGenerator {
    constructor() {
        this.jsPDF = window.jspdf.jsPDF;
        this.shippingFee = 300;
        this.taxRate = 0.16;
    }

    // Main method to generate and download receipt
    async generateReceiptPDF(order) {
        const downloadBtn = document.getElementById("download-receipt-btn");
        const originalHTML = downloadBtn?.innerHTML;

        try {
            // Show loading state
            if (downloadBtn) {
                downloadBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Generating PDF...';
                downloadBtn.disabled = true;
            }

            await this.generatePDF(order);
            this.trackDownload(order.id);

        } catch (error) {
            console.error("PDF generation failed:", error);
            throw new Error("Failed to generate PDF receipt");
        } finally {
            // Reset button state
            if (downloadBtn) {
                setTimeout(() => {
                    downloadBtn.innerHTML = '<i class="ri-download-line"></i> Download Receipt (PDF)';
                    downloadBtn.disabled = false;
                }, 1000);
            }
        }
    }

    generatePDF(order) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new this.jsPDF();
                const items = order.items || order.cart || [];
                const subtotal = order.subtotal || this.calculateSubtotal(items);
                const tax = order.tax || subtotal * this.taxRate;
                const total = order.total || (subtotal + this.shippingFee + tax);
                const shipping = order.shippingAddress;

                let yPosition = 20;

                // Generate PDF content
                this.addHeader(doc, yPosition);
                yPosition = this.addOrderDetails(doc, order, yPosition + 25);
                yPosition = this.addShippingInfo(doc, shipping, yPosition + 10);
                
                // Process items and continue with the rest
                this.processItemsWithImages(doc, items, yPosition + 15)
                    .then((newYPosition) => {
                        this.addCostSummary(doc, newYPosition + 10, subtotal, tax, this.shippingFee, total);
                        this.addFooter(doc);

                        // Save the PDF
                        const fileName = `KickStar_Receipt_${order.id || Date.now()}.pdf`;
                        doc.save(fileName);
                        resolve(true);
                    })
                    .catch(reject);

            } catch (error) {
                reject(error);
            }
        });
    }

    addHeader(doc, yPosition) {
        // Header background
        doc.setFillColor(244, 246, 246); 
        doc.rect(10, 10, 180, 26, 'F');
        
        // Company name
        doc.setFontSize(24);
        doc.setTextColor(0, 168, 150);
        doc.text("KICKSTAR", 105, yPosition, { align: 'center' });

        yPosition += 10;
        doc.setFontSize(16);
        doc.setTextColor(253, 48, 8);
        doc.text("ORDER RECEIPT", 105, yPosition, { align: 'center' });

        yPosition += 15;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Thank you for your order! Your purchase supports sustainable fashion.", 105, yPosition, { align: 'center' });
    }

    addOrderDetails(doc, order, yPosition) {
        yPosition += 15;
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

        // Table Header
        doc.setFontSize(14);
        doc.text("ORDER ITEMS", 20, yPosition);
        yPosition += 10;

        // Table Headers with background
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

        if (items.length === 0) {
            doc.text("No items in this order", 22, yPosition);
            return yPosition + 10;
        }

        // Process items with images
        return this.processItemsWithImages(doc, items, yPosition);
    }

    processItemsWithImages(doc, items, startY) {
        let yPosition = startY;

        return new Promise((resolve) => {
            const processNextItem = (index) => {
                if (index >= items.length) {
                    resolve(yPosition);
                    return;
                }

                const item = items[index];
                this.addItemToPDF(doc, item, index, yPosition).then((newYPosition) => {
                    yPosition = newYPosition;

                    // Page break check
                    if (yPosition > 250 && index < items.length - 1) {
                        this.addNewPageWithHeaders(doc);
                        yPosition = 32; // Start below headers on new page
                    }

                    processNextItem(index + 1);
                });
            };

            processNextItem(0);
        });
    }

    addItemToPDF(doc, item, index, yPosition) {
        return new Promise((resolve) => {
            const name = item.name || item.product || "Unnamed Product";
            const qty = item.qty || item.quantity || 1;
            const price = item.price || 0;
            const color = item.color || "-";
            const size = item.size || "-";
            const itemSubtotal = qty * price;
            const imageSrc = item.image || '';

            // Alternate row background
            if (index % 2 === 0) {
                doc.setFillColor(248, 249, 250);
                doc.rect(20, yPosition - 4, 170, 15, 'F');
            } else {
                doc.setFillColor(254, 254, 254);
                doc.rect(20, yPosition - 4, 170, 15, 'F');
            }

            doc.setTextColor(0, 0, 0);

            // Handle image loading
            this.addProductImage(doc, imageSrc, yPosition).then(() => {
                // Add text content
                doc.text(name.substring(0, 20), 40, yPosition + 4);
                doc.text(`${color}, ${size}`, 90, yPosition + 4);
                doc.text(qty.toString(), 140, yPosition + 4);
                doc.text(`KES ${price.toFixed(2)}`, 150, yPosition + 4);
                doc.text(`KES ${itemSubtotal.toFixed(2)}`, 170, yPosition + 4);

                resolve(yPosition + 12);
            });
        });
    }

    addProductImage(doc, imageSrc, yPosition) {
        return new Promise((resolve) => {
            if (!imageSrc) {
                this.addFallbackImage(doc, yPosition);
                resolve();
                return;
            }

            const img = new Image();
            img.crossOrigin = "Anonymous";
            
            img.onload = () => {
                try {
                    doc.addImage(img, 'JPEG', 22, yPosition - 3, 15, 15);
                } catch (e) {
                    console.warn('Could not add image to PDF, using fallback:', e);
                    this.addFallbackImage(doc, yPosition);
                }
                resolve();
            };
            
            img.onerror = () => {
                this.addFallbackImage(doc, yPosition);
                resolve();
            };
            
            // Set a timeout to prevent hanging
            setTimeout(() => {
                if (!img.complete) {
                    this.addFallbackImage(doc, yPosition);
                    resolve();
                }
            }, 2000);
            
            img.src = imageSrc;
        });
    }

    addFallbackImage(doc, yPosition) {
        doc.setFillColor(220, 220, 220);
        doc.rect(22, yPosition - 3, 15, 15, 'F');
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(6);
        doc.text("No", 26, yPosition + 3);
        doc.text("Img", 26, yPosition + 6);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
    }

    addNewPageWithHeaders(doc) {
        doc.addPage();
        
        // Add table headers on new page
        doc.setFillColor(244, 246, 246);
        doc.rect(20, 20, 170, 8, 'F');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Product", 35, 26);
        doc.text("Details", 90, 26);
        doc.text("Qty", 140, 26);
        doc.text("Price", 150, 26);
        doc.text("Subtotal", 170, 26);
    }

    addCostSummary(doc, yPosition, subtotal, tax, shippingFee, total) {
        // Separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 8;

        // Cost items
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

        const footerText = [
            "We'll notify you once your order is on its way.",
            "If you chose Cash on Delivery, please have the amount ready upon delivery.",
            "",
            "Signed,",
            "The KickStar Team",
            "Thank you for supporting sustainable fashion"
        ];

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);

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
        console.log(`PDF downloaded for order: ${orderId}`);
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'receipt_downloaded', {
                'event_category': 'engagement',
                'event_label': 'PDF Receipt',
                'value': orderId
            });
        }
    }
}

// Initialize and set up event listeners
document.addEventListener("DOMContentLoaded", () => {
    const pdfGenerator = new PDFGenerator();
    
    // Set up PDF download button
    const downloadBtn = document.getElementById("download-receipt-btn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", async () => {
            try {
                const order = window.orderSuccessPage?.getOrderData() || 
                             JSON.parse(localStorage.getItem("lastOrder") || "{}");
                await pdfGenerator.generateReceiptPDF(order);
            } catch (error) {
                alert("Sorry, we couldn't generate your receipt. Please try again.");
            }
        });
    }

    // Make PDF generator globally available
    window.pdfGenerator = pdfGenerator;
});