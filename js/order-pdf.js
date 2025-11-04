function setupPDFDownload(order) {
            const downloadBtn = document.getElementById("download-receipt-btn");
            if (!downloadBtn) return;

            downloadBtn.addEventListener("click", () => {
                // Store original button state
                const originalHTML = downloadBtn.innerHTML;

                try {
                    // Show loading state
                    downloadBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Generating PDF...';
                    downloadBtn.disabled = true;

                    // Generate PDF 
                    generatePDF(order);

                } catch (error) {
                    console.error("PDF generation failed:", error);
                    alert("Sorry, we couldn't generate your receipt. Please try again.");
                } finally {
                    // Reset button state after a small delay to ensure UI updates
                    setTimeout(() => {
                        downloadBtn.innerHTML = '<i class="ri-download-line"></i> Download Receipt (PDF)';
                        downloadBtn.disabled = false;
                    }, 1000);
                }
            });
        }

        function generatePDF(order) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const items = order.items || order.cart || [];
            const shippingFee = 300;
            const subtotal = order.subtotal || calculateSubtotal(items);
            const tax = order.tax || subtotal * 0.16;
            const total = order.total || (subtotal + shippingFee + tax);
            const shipping = order.shippingAddress;

            let yPosition = 20;

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

            yPosition += 20;

            // Order Information
            doc.setFontSize(14);
            doc.setTextColor(45, 45, 45); // Dark color
            doc.text("ORDER DETAILS", 20, yPosition);

            yPosition += 10;
            doc.setFontSize(10);
            doc.text(`Order ID: ${order.id || "#12345"}`, 20, yPosition);
            doc.text(`Date: ${new Date().toLocaleString('en-KE')}`, 120, yPosition);

            yPosition += 6;
            doc.text(`Payment Method: ${order.paymentMethod || "MPesa"}`, 20, yPosition);

            yPosition += 15;

            // Shipping Information
            if (shipping) {
                doc.setFontSize(14);
                doc.text("SHIPPING ADDRESS", 20, yPosition);

                yPosition += 8;
                doc.setFontSize(10);
                doc.text(`${shipping.fullname}`, 20, yPosition);
                yPosition += 5;
                doc.text(`${shipping.phone}`, 20, yPosition);
                yPosition += 5;
                doc.text(`${shipping.address}, ${shipping.city}`, 20, yPosition);

                yPosition += 15;
            }

            // Order Items Table
            doc.setFontSize(14);
            doc.text("ORDER ITEMS", 20, yPosition);
            yPosition += 10;

            // Table Headers - Adjusted for images
            doc.setFillColor(244, 246, 246); // Light gray background
            doc.rect(20, yPosition, 170, 8, 'F');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text("Product", 35, yPosition + 6); // Moved right to accommodate image
            doc.text("Details", 90, yPosition + 6);
            doc.text("Qty", 140, yPosition + 6);
            doc.text("Price", 150, yPosition + 6);
            doc.text("Subtotal", 170, yPosition + 6);

            yPosition += 12;

            // Order Items with Images
            if (items.length > 0) {
                // Process items sequentially to handle async image loading
                processItemsForPDF(doc, items, yPosition, subtotal, tax, shippingFee, total, shipping, order);
            } else {
                doc.text("No items in this order", 22, yPosition);
                yPosition += 10;
                completePDF(doc, yPosition, subtotal, tax, shippingFee, total, order);
            }
        }

        function processItemsForPDF(doc, items, startY, subtotal, tax, shippingFee, total, shipping, order) {
            let yPosition = startY;
            let processedItems = 0;

            items.forEach((item, index) => {
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
                    doc.rect(20, yPosition - 4, 170, 12, 'F');
                }

                doc.setTextColor(0, 0, 0);

                // Add product image if available
                if (imageSrc) {
                    try {
                        // Create a temporary image to check if it loads
                        const img = new Image();
                        img.crossOrigin = "Anonymous";
                        img.onload = function () {
                            try {
                                // Add image to PDF (15x15px)
                                doc.addImage(img, 'JPEG', 22, yPosition - 3, 15, 15);
                                addTextToRow();
                            } catch (e) {
                                console.warn('Could not add image to PDF, using fallback:', e);
                                addFallbackImage();
                            }
                        };
                        img.onerror = function () {
                            addFallbackImage();
                        };
                        img.src = imageSrc;
                    } catch (e) {
                        addFallbackImage();
                    }
                } else {
                    addFallbackImage();
                }

                function addFallbackImage() {
                    // Add a simple rectangle as fallback
                    doc.setFillColor(220, 220, 220);
                    doc.rect(22, yPosition - 3, 15, 15, 'F');
                    doc.setTextColor(150, 150, 150);
                    doc.setFontSize(6);
                    doc.text("No", 26, yPosition + 3);
                    doc.text("Img", 26, yPosition + 6);
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    addTextToRow();
                }

                function addTextToRow() {
                    // Product name (starting after image)
                    doc.text(name.substring(0, 20), 40, yPosition + 4);

                    // Other details
                    doc.text(`${color}, ${size}`, 90, yPosition + 4);
                    doc.text(qty.toString(), 140, yPosition + 4);
                    doc.text(`KES ${price.toFixed(2)}`, 150, yPosition + 4);
                    doc.text(`KES ${itemSubtotal.toFixed(2)}`, 170, yPosition + 4);

                    yPosition += 12;
                    processedItems++;

                    // Check if all items are processed
                    if (processedItems === items.length) {
                        completePDF(doc, yPosition, subtotal, tax, shippingFee, total, order);
                    }

                    // Page break check
                    if (yPosition > 250 && processedItems < items.length) {
                        doc.addPage();
                        yPosition = 20;

                        // Add table headers on new page
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
                    }
                }
            });
        }

        function completePDF(doc, yPosition, subtotal, tax, shippingFee, total, order) {
            yPosition += 10;

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

            yPosition += 20;

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

            // Save the PDF
            doc.save(`KickStar_Receipt_${order.id || Date.now()}.pdf`);

            // Track download event
            trackEvent('receipt_downloaded', { orderId: order.id });
        }