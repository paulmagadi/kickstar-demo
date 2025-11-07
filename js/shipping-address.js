// Shipping Address Management Module
class ShippingAddressManager {
    constructor(options = {}) {
        this.options = {
            containerId: 'saved-addresses-container',
            modalId: 'address-modal',
            addButtonId: 'add-address-btn',
            formId: 'address-form',
            onAddressChange: null,
            onAddressUpdate: null,
            ...options
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAddresses();
    }

    // ===== Address Data Management =====
    getAddresses() {
        return JSON.parse(localStorage.getItem("addresses") || "[]");
    }

    saveAddresses(addresses) {
        localStorage.setItem("addresses", JSON.stringify(addresses));
        this.triggerAddressUpdate();
    }

    // ===== Address Rendering =====
    renderAddresses() {
        const container = document.getElementById(this.options.containerId);
        const addButton = document.getElementById(this.options.addButtonId);
        const addresses = this.getAddresses();

        if (!container) return;

        // No addresses
        if (addresses.length === 0) {
            container.innerHTML = `
                <div class="no-addresses">
                    <i class="ri-map-pin-add-line"></i>
                    No saved addresses yet. Please add your shipping address.
                </div>
            `;
            if (addButton) addButton.classList.add("empty-state");
            return;
        }

        // We have addresses
        if (addButton) addButton.classList.remove("empty-state");
        
        container.innerHTML = addresses.map(addr => this.createAddressCard(addr)).join('');
        this.setupAddressCardEvents();
    }

    createAddressCard(address) {
        const checked = address.isDefault ? "checked" : "";
        const selClass = address.isDefault ? "selected" : "";
        
        return `
            <div class="address-card ${selClass}" data-id="${address.id}">
                <label>
                    <input type="radio" name="selectedAddress" value="${address.id}" ${checked}>
                    <div class="address-details">
                        <strong>${address.fullname}</strong>
                        <div>${address.address}, ${address.city}</div>
                        <div>${address.phone}</div>
                    </div>
                </label>
                <div class="address-actions">
                    <button class="edit-address-btn" data-id="${address.id}"><i class="ri-edit-line"></i> Edit</button>
                    <button class="delete-address-btn" data-id="${address.id}"><i class="ri-delete-bin-line"></i> Delete</button>
                </div>
            </div>
        `;
    }

    setupAddressCardEvents() {
        const container = document.getElementById(this.options.containerId);
        if (!container) return;

        // Update selection state when radio changes
        container.querySelectorAll("input[name='selectedAddress']").forEach(radio => {
            radio.addEventListener("change", e => {
                this.setDefaultAddress(e.target.value);
            });
        });

        // Make the whole card clickable (except action buttons)
        container.querySelectorAll(".address-card").forEach(card => {
            card.addEventListener("click", e => {
                if (e.target.closest(".edit-address-btn") || e.target.closest(".delete-address-btn")) return;
                const radio = card.querySelector("input[name='selectedAddress']");
                if (radio && !radio.checked) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });

        // Edit address buttons
        container.querySelectorAll(".edit-address-btn").forEach(btn => {
            btn.addEventListener("click", () => this.openEditModal(btn.dataset.id));
        });

        // Delete address buttons
        container.querySelectorAll(".delete-address-btn").forEach(btn => {
            btn.addEventListener("click", (e) => this.handleDeleteAddress(btn.dataset.id));
        });
    }

    // ===== Address Operations =====
    setDefaultAddress(addressId) {
        const addresses = this.getAddresses();
        const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        }));

        this.saveAddresses(updatedAddresses);
        this.renderAddresses();
        this.triggerAddressChange();
    }

    addAddress(addressData) {
        const addresses = this.getAddresses();
        const newAddress = {
            id: "ADDR" + Date.now(),
            ...addressData,
            isDefault: addresses.length === 0 // Set as default if first address
        };

        // If this is being set as default, unset others
        const updatedAddresses = newAddress.isDefault 
            ? addresses.map(addr => ({ ...addr, isDefault: false }))
            : addresses;

        updatedAddresses.push(newAddress);
        this.saveAddresses(updatedAddresses);
        this.renderAddresses();
        this.triggerAddressChange();
    }

    updateAddress(addressId, addressData) {
        const addresses = this.getAddresses();
        const updatedAddresses = addresses.map(addr => 
            addr.id === addressId 
                ? { ...addr, ...addressData, isDefault: true } // Edited address becomes default
                : { ...addr, isDefault: false } // Unset others
        );

        this.saveAddresses(updatedAddresses);
        this.renderAddresses();
        this.triggerAddressChange();
    }

    deleteAddress(addressId) {
        const addresses = this.getAddresses();
        const addressToDelete = addresses.find(a => a.id === addressId);
        
        if (!addressToDelete) return;

        const updatedAddresses = addresses.filter(a => a.id !== addressId);

        // If deleting the default address, set a new default if possible
        if (addressToDelete.isDefault && updatedAddresses.length > 0) {
            updatedAddresses[0].isDefault = true;
        }

        this.saveAddresses(updatedAddresses);
        this.renderAddresses();
        this.triggerAddressChange();
    }

    // ===== Modal Management =====
    openAddModal() {
        this.openModal("Add New Address");
    }

    openEditModal(addressId) {
        const address = this.getAddresses().find(a => a.id === addressId);
        if (!address) return;

        this.openModal("Edit Address", address);
    }

    openModal(title, address = null) {
        const modal = document.getElementById(this.options.modalId);
        const modalTitle = document.getElementById("modal-title");
        const form = document.getElementById(this.options.formId);

        if (!modal || !modalTitle || !form) return;

        modalTitle.textContent = title;
        form.reset();

        if (address) {
            document.getElementById("address-id").value = address.id;
            document.getElementById("fullname").value = address.fullname;
            document.getElementById("address").value = address.address;
            document.getElementById("city").value = address.city;
            document.getElementById("phone").value = address.phone;
        } else {
            document.getElementById("address-id").value = "";
        }

        modal.style.display = "flex";
    }

    closeModal() {
        const modal = document.getElementById(this.options.modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }

    // ===== Event Handlers =====
    setupEventListeners() {
        // Add address button
        const addButton = document.getElementById(this.options.addButtonId);
        if (addButton) {
            addButton.addEventListener("click", () => this.openAddModal());
        }

        // Address form submission
        const form = document.getElementById(this.options.formId);
        if (form) {
            form.addEventListener("submit", (e) => this.handleFormSubmit(e));
        }

        // Modal close handlers
        const closeButton = document.getElementById("close-modal");
        if (closeButton) {
            closeButton.addEventListener("click", () => this.closeModal());
        }

        // Close modal when clicking outside
        const modal = document.getElementById(this.options.modalId);
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) this.closeModal();
            });
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const addressData = {
            fullname: formData.get("fullname"),
            address: formData.get("address"),
            city: formData.get("city"),
            phone: formData.get("phone")
        };

        const addressId = document.getElementById("address-id").value;

        if (addressId) {
            this.updateAddress(addressId, addressData);
        } else {
            this.addAddress(addressData);
        }

        this.closeModal();
    }

    handleDeleteAddress(addressId) {
        if (!confirm("Are you sure you want to delete this address?")) return;
        this.deleteAddress(addressId);
    }

    // ===== Event Triggers =====
    triggerAddressChange() {
        if (typeof this.options.onAddressChange === 'function') {
            this.options.onAddressChange(this.getAddresses());
        }
    }

    triggerAddressUpdate() {
        if (typeof this.options.onAddressUpdate === 'function') {
            this.options.onAddressUpdate(this.getAddresses());
        }
    }

    // ===== Utility Methods =====
    getDefaultAddress() {
        const addresses = this.getAddresses();
        return addresses.find(a => a.isDefault) || addresses[0];
    }

    hasAddresses() {
        return this.getAddresses().length > 0;
    }

    validateAddresses() {
        return this.hasAddresses() && this.getDefaultAddress();
    }
}

// Make it globally available
window.ShippingAddressManager = ShippingAddressManager;