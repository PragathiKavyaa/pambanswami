// ============================================================
// ROLE-BASED ADMIN DASHBOARD ACCESS
// ============================================================

let currentUserRole = null;

document.addEventListener("DOMContentLoaded", async () => {

    try {
        const response = await fetch("/api/current-user", {
            cache: "no-store"
        });

        if (!response.ok) {
            window.location.href = "/login.html";
            return;
        }

        const user = await response.json();

        currentUserRole = user.role;

        const adminOnlySections = [
            "services-manage",
            "physio-manage",
            "why-manage",
            "contact-manage",
            "header-footer-manage",
            "users-manage"
        ];

        const adminOnlyButtons = document.querySelectorAll(
            ".menu-tab-link"
        );

        if (currentUserRole === "STAFF") {

            adminOnlySections.forEach(sectionId => {

                const section = document.getElementById(sectionId);

                if (section) {
                    section.style.display = "none";
                    section.classList.remove("active-section");
                }
            });

            adminOnlyButtons.forEach(button => {

                const onclickValue = button.getAttribute("onclick") || "";

                if (!onclickValue.includes("appointments-view")) {
                    button.style.display = "none";
                    button.classList.remove("active-link");
                }

            });

            const appointmentSection = document.getElementById(
                "appointments-view"
            );

            if (appointmentSection) {
                appointmentSection.style.display = "block";
                appointmentSection.classList.add("active-section");
            }

            const appointmentButton = Array.from(adminOnlyButtons).find(
                button => (button.getAttribute("onclick") || "")
                    .includes("appointments-view")
            );

            if (appointmentButton) {
                appointmentButton.classList.add("active-link");
            }

        }
        document.dispatchEvent(new Event("dashboardRoleReady"));

    } catch (error) {

        console.error("Unable to verify dashboard role:", error);

        window.location.href = "/login.html";

    }

});
const HOME_CARE_API = "/api/home-care-services";

// Switch Admin Panel sections
function openSection(event, sectionId) {

    // Staff can access only Appointments
    if (
        currentUserRole === "STAFF" &&
        sectionId !== "appointments-view"
    ) {
        return;
    }

    const sections = document.querySelectorAll(
        ".workspace-tab-section"
    );

    sections.forEach(section =>
        section.classList.remove("active-section")
    );

    const tabLinks = document.querySelectorAll(
        ".menu-tab-link"
    );

    tabLinks.forEach(link =>
        link.classList.remove("active-link")
    );

    const selectedSection = document.getElementById(sectionId);

    if (!selectedSection) return;

    selectedSection.classList.add("active-section");

    event.currentTarget.classList.add("active-link");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.addEventListener('dashboardRoleReady', () => {

    if (currentUserRole === "STAFF") return;

    // const logoutBtn = document.querySelector('a[href="/admin/logout"]');

    // if (logoutBtn) {
    //     logoutBtn.addEventListener('click', () => {
    //         localStorage.clear();
    //         sessionStorage.clear();
    //     });
    // }

    const serviceForm = document.getElementById('homeCareServiceForm');

    if (!serviceForm) return;

    const serviceIdInput = document.getElementById('serviceId');
    const submitButton = document.getElementById('serviceSubmitButton');
    const cancelButton = document.getElementById('cancelServiceEdit');
    const servicesList = document.getElementById('homeCareServicesList');
    const alertBox = document.getElementById('statusAlertMessage');

    function showMessage(message, isError = false) {
        alertBox.textContent = message;
        alertBox.classList.remove('hidden-alert');

        alertBox.style.color = isError ? '#FA0073' : '#10b981';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Load all services from database
    async function loadServices() {
        try {
            const response = await fetch(HOME_CARE_API, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Unable to load services.');
            }

            const services = await response.json();

            servicesList.replaceChildren();

            if (services.length === 0) {
                servicesList.textContent = 'No Home Care services have been added yet.';
                return;
            }

            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'card-editor-box';
                card.style.marginBottom = '15px';

                const title = document.createElement('h4');
                title.textContent = `${service.serviceEmoji || ''} ${service.serviceTitle}`;

                const theme = document.createElement('p');
                theme.textContent = `Theme: ${service.themeColor}`;

                card.appendChild(title);
                card.appendChild(theme);

                if (service.serviceImage) {
                    const image = document.createElement('img');
                    image.src = service.serviceImage;
                    image.alt = service.serviceTitle;
                    image.style.width = '120px';
                    image.style.height = '90px';
                    image.style.objectFit = 'cover';
                    image.style.borderRadius = '10px';

                    card.appendChild(image);
                }

                const editButton = document.createElement('button');
                editButton.type = 'button';
                editButton.className = 'btn-save-changes';
                editButton.textContent = 'Edit';
                editButton.style.marginRight = '10px';

                editButton.addEventListener('click', () => {
                    editService(service);
                });

                const deleteButton = document.createElement('button');
                deleteButton.type = 'button';
                deleteButton.className = 'btn-save-changes';
                deleteButton.textContent = 'Delete';

                deleteButton.addEventListener('click', () => {
                    deleteService(service.id);
                });

                card.appendChild(editButton);
                card.appendChild(deleteButton);

                servicesList.appendChild(card);
            });

        } catch (error) {
            showMessage(error.message, true);
        }
    }

    // Add or update a service
    serviceForm.addEventListener('submit', async event => {
        event.preventDefault();

        const id = serviceIdInput.value;

        const formData = new FormData(serviceForm);

        const url = id
            ? `${HOME_CARE_API}/${id}`
            : HOME_CARE_API;

        const method = id ? 'PUT' : 'POST';

        try {
            submitButton.disabled = true;

            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Unable to save service.');
            }

            resetForm();

            showMessage(
                id
                    ? 'Service updated successfully!'
                    : 'Service added successfully!'
            );

            await loadServices();

        } catch (error) {
            showMessage(error.message, true);
        } finally {
            submitButton.disabled = false;
        }
    });

    // Fill form with selected service details
    function editService(service) {
        serviceIdInput.value = service.id;

        serviceForm.elements['serviceTitle'].value =
            service.serviceTitle || '';

        serviceForm.elements['serviceEmoji'].value =
            service.serviceEmoji || '';

        serviceForm.elements['serviceThemeColor'].value =
            service.themeColor || 'label-deep-blue';

        serviceForm.elements['serviceImageFile'].value = '';

        submitButton.textContent = 'Update Service';
        cancelButton.style.display = 'inline-block';

        serviceForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Delete a service
    async function deleteService(id) {
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            const response = await fetch(`${HOME_CARE_API}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Unable to delete service.');
            }

            showMessage('Service deleted successfully!');

            await loadServices();

        } catch (error) {
            showMessage(error.message, true);
        }
    }

    // Reset form after save or cancel
    function resetForm() {
        serviceForm.reset();
        serviceIdInput.value = '';

        submitButton.textContent = 'Publish Service Card';
        cancelButton.style.display = 'none';
    }

    cancelButton.addEventListener('click', resetForm);

    // Initial database loading
    loadServices();
});


// ==========================================================================
// ADMIN LOGOUT INTERACTIVE HANDLER (FORCED ABSOLUTE ROOT PATH)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('a[href="/admin/logout"]');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            sessionStorage.clear();
        });
    }
});


// ============================================================
// PHYSIOTHERAPY ADMIN - ADD / UPDATE / DELETE
// ============================================================

document.addEventListener("dashboardRoleReady", () => {
    if (currentUserRole === "STAFF") return;

    const PHYSIO_API = "/api/physio-services";

    const form = document.getElementById("physioServiceForm");

    if (!form) return;

    const idInput = document.getElementById("physioId");
    const submitButton = document.getElementById("physioSubmitButton");
    const cancelButton = document.getElementById("cancelPhysioEdit");
    const servicesList = document.getElementById("physioServicesList");
    const alertBox = document.getElementById("physioStatusMessage");

    function showMessage(message, isError = false) {

        alertBox.textContent = message;
        alertBox.classList.remove("hidden-alert");

        alertBox.style.color = isError ? "#FA0073" : "#10b981";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Load all physiotherapy services
    async function loadPhysioServices() {

        try {

            const response = await fetch(PHYSIO_API, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load physiotherapy services.");
            }

            const services = await response.json();

            servicesList.replaceChildren();

            if (!services.length) {
                servicesList.textContent =
                    "No physiotherapy services have been added yet.";
                return;
            }

            services.forEach(service => {

                const card = document.createElement("div");
                card.className = "card-editor-box";
                card.style.marginBottom = "15px";

                const title = document.createElement("h4");

                title.textContent =
                    `${service.physioEmoji || ""} ${service.physioTitle}`;

                const theme = document.createElement("p");
                theme.textContent = `Theme: ${service.themeColor}`;

                card.append(title, theme);

                if (service.physioImage) {

                    const image = document.createElement("img");

                    image.src = service.physioImage;
                    image.alt = service.physioTitle;
                    image.style.width = "120px";
                    image.style.height = "90px";
                    image.style.objectFit = "cover";
                    image.style.borderRadius = "10px";

                    card.appendChild(image);
                }

                const editButton = document.createElement("button");

                editButton.type = "button";
                editButton.className = "btn-save-changes";
                editButton.textContent = "Edit";
                editButton.style.marginRight = "10px";

                editButton.addEventListener("click", () => {
                    editPhysioService(service);
                });

                const deleteButton = document.createElement("button");

                deleteButton.type = "button";
                deleteButton.className = "btn-save-changes";
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", () => {
                    deletePhysioService(service.id);
                });

                card.append(editButton, deleteButton);

                servicesList.appendChild(card);
            });

        } catch (error) {

            showMessage(error.message, true);

        }
    }

    // Add or update service
    form.addEventListener("submit", async event => {

        event.preventDefault();

        const id = idInput.value;

        const formData = new FormData(form);

        const url = id
            ? `${PHYSIO_API}/${id}`
            : PHYSIO_API;

        const method = id ? "PUT" : "POST";

        try {

            submitButton.disabled = true;

            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (!response.ok) {

                const message = await response.text();

                throw new Error(message || "Unable to save service.");
            }

            resetPhysioForm();

            showMessage(
                id
                    ? "Physiotherapy service updated successfully!"
                    : "Physiotherapy service added successfully!"
            );

            await loadPhysioServices();

        } catch (error) {

            showMessage(error.message, true);

        } finally {

            submitButton.disabled = false;

        }
    });

    // Edit service
    function editPhysioService(service) {

        idInput.value = service.id;

        form.elements["physioTitle"].value =
            service.physioTitle || "";

        form.elements["physioEmoji"].value =
            service.physioEmoji || "";

        form.elements["physioThemeColor"].value =
            service.themeColor || "pill-deep-blue";

        form.elements["physioImageFile"].value = "";

        submitButton.textContent = "Update Therapy Card";

        cancelButton.style.display = "inline-block";

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // Delete service
    async function deletePhysioService(id) {

        if (!confirm("Are you sure you want to delete this physiotherapy service?")) {
            return;
        }

        try {

            const response = await fetch(`${PHYSIO_API}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Unable to delete physiotherapy service.");
            }

            showMessage("Physiotherapy service deleted successfully!");

            await loadPhysioServices();

        } catch (error) {

            showMessage(error.message, true);

        }
    }

    // Reset form
    function resetPhysioForm() {

        form.reset();

        idInput.value = "";

        submitButton.textContent = "Publish Therapy Card";

        cancelButton.style.display = "none";
    }

    cancelButton.addEventListener("click", resetPhysioForm);

    // Initial load
    loadPhysioServices();

});

// ==========================================
// WHY CHOOSE US - ADMIN CRUD
// ==========================================

document.addEventListener("dashboardRoleReady", function () {
    if (currentUserRole === "STAFF") return;

    const API_URL = "/api/why-choose-us";

    const form = document.getElementById("whyChooseUsForm");

    // Run only when the Why Choose Us form exists
    if (!form) return;

    const cardId = document.getElementById("whyCardId");
    const cardTitle = document.getElementById("whyCardTitle");
    const iconType = document.getElementById("whyIconType");
    const description = document.getElementById("whyCardDescription");

    const submitButton = document.getElementById("whySubmitButton");
    const cancelButton = document.getElementById("cancelWhyEdit");
    const cardList = document.getElementById("whyChooseUsList");
    const statusMessage = document.getElementById("whyStatusMessage");

    // Load existing cards
    async function loadWhyChooseUs() {

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Unable to load cards.");
            }

            const cards = await response.json();

            cardList.innerHTML = "";

            if (cards.length === 0) {
                cardList.innerHTML = "<p>No advantages added yet.</p>";
                return;
            }

            cards.forEach(card => {

                const item = document.createElement("div");
                item.className = "admin-list-item";

                const details = document.createElement("div");

                const title = document.createElement("h4");
                title.textContent = card.cardTitle;

                const text = document.createElement("p");
                text.textContent = card.description;

                const icon = document.createElement("p");
                icon.textContent = "Icon: " + card.iconType;

                details.append(title, text, icon);

                const actions = document.createElement("div");

                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.textContent = "Edit";
                editButton.className = "btn-save-changes";

                editButton.addEventListener("click", function () {
                    editWhyCard(card);
                });

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.textContent = "Delete";
                deleteButton.className = "btn-save-changes";

                deleteButton.addEventListener("click", function () {
                    deleteWhyCard(card.id);
                });

                actions.append(editButton, deleteButton);
                item.append(details, actions);
                cardList.appendChild(item);
            });

        } catch (error) {
            console.error("Why Choose Us loading error:", error);
            cardList.innerHTML = "<p>Unable to load advantages.</p>";
        }
    }

    // Add or update a card
    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const id = cardId.value;

        const cardData = {
            cardTitle: cardTitle.value.trim(),
            iconType: iconType.value,
            description: description.value.trim()
        };

        if (!cardData.cardTitle || !cardData.description) {
            statusMessage.textContent = "Please fill in all fields.";
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}/${id}` : API_URL;

        try {

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cardData)
            });

            if (!response.ok) {
                throw new Error("Unable to save card.");
            }

            statusMessage.textContent = id
                ? "Advantage updated successfully."
                : "Advantage added successfully.";

            resetWhyForm();
            await loadWhyChooseUs();

        } catch (error) {
            console.error("Why Choose Us save error:", error);
            statusMessage.textContent = "Unable to save advantage.";
        }
    });

    // Edit card
    function editWhyCard(card) {

        cardId.value = card.id;
        cardTitle.value = card.cardTitle;
        iconType.value = card.iconType;
        description.value = card.description;

        submitButton.textContent = "Update Advantage";
        cancelButton.style.display = "inline-block";

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // Delete card
    async function deleteWhyCard(id) {

        if (!confirm("Are you sure you want to delete this advantage?")) {
            return;
        }

        try {

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Unable to delete card.");
            }

            statusMessage.textContent = "Advantage deleted successfully.";

            if (cardId.value === String(id)) {
                resetWhyForm();
            }

            await loadWhyChooseUs();

        } catch (error) {
            console.error("Why Choose Us delete error:", error);
            statusMessage.textContent = "Unable to delete advantage.";
        }
    }

    // Reset form
    function resetWhyForm() {

        form.reset();
        cardId.value = "";

        submitButton.textContent = "Add Advantage";
        cancelButton.style.display = "none";
    }

    cancelButton.addEventListener("click", resetWhyForm);

    loadWhyChooseUs();
});


// ============================================================
// CONTACT DETAILS MANAGEMENT
// ============================================================

document.addEventListener("dashboardRoleReady", () => {
    if (currentUserRole === "STAFF") return;

    const CONTACT_API = "/api/contact-details";

    const contactFields = [
        "contactPhone",
        "contactEmail",
        "contactLocation",
        "contactHours"
    ];

    let contactRecordId = null;

    function showContactMessage(message, isError = false) {
        const box = document.getElementById("contactStatusMessage");
        if (!box) return;

        box.textContent = message;
        box.classList.remove("hidden-alert");
        box.style.color = isError ? "#FA0073" : "#10b981";
    }

    async function loadContactDetails() {
        try {
            const response = await fetch(CONTACT_API, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load contact details.");
            }

            const records = await response.json();

            const record = records.length ? records[0] : null;

            contactRecordId = record ? record.id : null;

            contactFields.forEach(field => {
                const input = document.getElementById(field);
                if (input) {
                    input.value = record ? (record[field] || "") : "";
                }
            });

        } catch (error) {
            showContactMessage(error.message, true);
        }
    }

    window.saveContactField = async function(field) {

        if (!contactFields.includes(field)) return;

        const input = document.getElementById(field);
        const value = input.value.trim();

        if (!value) {
            showContactMessage("Please enter a value before saving.", true);
            return;
        }

        try {
            const existing = {};

            contactFields.forEach(name => {
                existing[name] = document.getElementById(name).value.trim() || null;
            });

            existing[field] = value;

            const response = await fetch(
                contactRecordId
                    ? `${CONTACT_API}/${contactRecordId}`
                    : CONTACT_API,
                {
                    method: contactRecordId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(existing)
                }
            );

            if (!response.ok) {
                throw new Error("Unable to save contact detail.");
            }

            showContactMessage("Contact detail saved successfully.");
            await loadContactDetails();

        } catch (error) {
            showContactMessage(error.message, true);
        }
    };

    window.deleteContactField = async function(field) {

        if (!contactFields.includes(field)) return;

        if (!contactRecordId) {
            showContactMessage("There is no contact record to update.", true);
            return;
        }

        if (!confirm("Are you sure you want to delete this contact detail?")) {
            return;
        }

        try {
            const existing = {};

            contactFields.forEach(name => {
                existing[name] = document.getElementById(name).value.trim() || null;
            });

            existing[field] = null;

            const response = await fetch(
                `${CONTACT_API}/${contactRecordId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(existing)
                }
            );

            if (!response.ok) {
                throw new Error("Unable to delete contact detail.");
            }

            showContactMessage("Contact detail deleted successfully.");
            await loadContactDetails();

        } catch (error) {
            showContactMessage(error.message, true);
        }
    };

    if (document.getElementById("contact-manage")) {
        loadContactDetails();
    }

});


// ============================================================
// CUSTOMER CALLBACK REQUEST MANAGEMENT
// ============================================================

document.addEventListener("dashboardRoleReady", () => {

    const CALLBACK_API = "/api/callback-requests";

    const tableBody = document.getElementById(
        "callbackRequestsTableBody"
    );

    if (!tableBody) return;

    const statusMessage = document.getElementById(
        "callbackStatusMessage"
    );

    function showCallbackMessage(message, isError = false) {
        if (!statusMessage) return;

        statusMessage.textContent = message;
        statusMessage.classList.remove("hidden-alert");
        statusMessage.style.color = isError ? "#FA0073" : "#10b981";
    }

    function createCell(value) {
        const cell = document.createElement("td");
        cell.textContent = value || "-";
        return cell;
    }

    async function loadCallbackRequests() {

        try {

            const response = await fetch(CALLBACK_API, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load callback requests.");
            }

            const requests = await response.json();

            tableBody.replaceChildren();

            if (!requests.length) {
                const row = document.createElement("tr");
                const cell = createCell("No callback requests received yet.");
                cell.colSpan = 9;
                row.appendChild(cell);
                tableBody.appendChild(row);
                return;
            }

            requests.forEach(request => {

                const row = document.createElement("tr");

                row.appendChild(
                    createCell(
                        request.selectedServiceCategory === "physio"
                            ? "Physiotherapy"
                            : "Home Care"
                    )
                );

                row.appendChild(createCell(request.fullName));

                // Click-to-call phone number
                const phoneCell = document.createElement("td");
                const phoneLink = document.createElement("a");

                phoneLink.textContent = request.phoneNumber || "-";

                if (request.phoneNumber) {
                    phoneLink.href = "tel:" + request.phoneNumber;
                }

                phoneCell.appendChild(phoneLink);
                row.appendChild(phoneCell);

                row.appendChild(
                    createCell(
                        `${request.patientAge ?? "-"} / ${request.patientGender || "-"}`
                    )
                );

                row.appendChild(createCell(request.requestedServiceType));

                row.appendChild(createCell(request.userMessage));

                row.appendChild(
                    createCell(
                        request.createdAt
                            ? new Date(request.createdAt).toLocaleString()
                            : "-"
                    )
                );

                // Status selector
                const statusCell = document.createElement("td");
                const statusSelect = document.createElement("select");

                ["Pending", "Contacted", "Completed"].forEach(status => {
                    const option = document.createElement("option");
                    option.value = status;
                    option.textContent = status;
                    statusSelect.appendChild(option);
                });

                statusSelect.value = request.status || "Pending";

                statusSelect.addEventListener("change", async () => {
                    await updateCallbackStatus(
                        request.id,
                        statusSelect.value
                    );
                });

                statusCell.appendChild(statusSelect);
                row.appendChild(statusCell);

                // Delete request
                const actionCell = document.createElement("td");
                const deleteButton = document.createElement("button");

                deleteButton.type = "button";
                deleteButton.className = "btn-save-changes";
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", async () => {

                    if (!confirm("Delete this callback request?")) return;

                    await deleteCallbackRequest(request.id);
                });

                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);

                tableBody.appendChild(row);

            });

        } catch (error) {

            console.error("Callback loading error:", error);

            tableBody.replaceChildren();

            const row = document.createElement("tr");
            const cell = createCell(error.message);
            cell.colSpan = 9;
            row.appendChild(cell);
            tableBody.appendChild(row);
        }
    }

    async function updateCallbackStatus(id, status) {

        try {

            const response = await fetch(
                `${CALLBACK_API}/${id}/status?status=${encodeURIComponent(status)}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Unable to update callback status.");
            }

            showCallbackMessage("Callback status updated successfully.");

        } catch (error) {

            showCallbackMessage(error.message, true);
            await loadCallbackRequests();

        }
    }

    async function deleteCallbackRequest(id) {

        try {

            const response = await fetch(`${CALLBACK_API}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Unable to delete callback request.");
            }

            showCallbackMessage("Callback request deleted successfully.");

            await loadCallbackRequests();

        } catch (error) {

            showCallbackMessage(error.message, true);

        }
    }

    loadCallbackRequests();

});

// ============================================================
// GLOBAL HEADER, FOOTER, FIND US AND LOGO MANAGEMENT
// ============================================================

document.addEventListener("dashboardRoleReady", function () {

     if (currentUserRole === "STAFF") return;

    const GLOBAL_API = "/api/global-site-settings";

    const statusBox = document.getElementById("globalSettingsStatus");

    const logoInput = document.getElementById("globalLogoFile");
    const logoPreview = document.getElementById("globalLogoPreview");
    const logoEmptyMessage = document.getElementById("globalLogoEmptyMessage");

    let currentLogoPath = null;

    // Map database fields to HTML input IDs
    const globalFields = {
        brandName: "globalBrandName",
        footerDesc: "globalFooterDesc",
        footerPhoneString: "globalFooterPhone",
        footerEmailString: "globalFooterEmail",
        footerCityString: "globalFooterCity",
        findUsLocationString: "globalFindUsAddress",
        findUsMapUrl: "globalFindUsMapUrl",
        copyrightText: "globalCopyright",
        headerPhone: "globalHeaderPhone"
    };

    // Display success or error messages
    function showGlobalMessage(message, isError = false) {

        if (!statusBox) return;

        statusBox.textContent = message;

        statusBox.style.color = isError
            ? "#FA0073"
            : "#10b981";
    }

    // Load saved settings from database
    async function loadGlobalSettings() {

        try {

            const response = await fetch(GLOBAL_API, {
                method: "GET",
                cache: "no-store"
            });

            if (response.status === 204) {
                showGlobalMessage("No global settings added yet.");
                return;
            }

            if (!response.ok) {
                throw new Error("Unable to load global settings.");
            }

            const settings = await response.json();

            // Fill each individual input
            Object.entries(globalFields).forEach(([field, elementId]) => {

                const input = document.getElementById(elementId);

                if (input) {
                    input.value = settings[field] || "";
                }

            });

            // Load existing logo
            currentLogoPath = settings.logoImage || null;

            updateLogoPreview(currentLogoPath);

            showGlobalMessage("Global website settings loaded successfully.");

        } catch (error) {

            console.error("Global settings loading error:", error);

            showGlobalMessage(error.message, true);

        }
    }


    // Add or update an individual field
    window.saveGlobalField = async function (fieldName) {

        if (!Object.prototype.hasOwnProperty.call(globalFields, fieldName)) {
            return;
        }

        const input = document.getElementById(globalFields[fieldName]);

        if (!input) return;

        const value = input.value.trim();

        if (!value) {

            showGlobalMessage("Please enter a value before saving.", true);

            input.focus();

            return;
        }

        try {

            const response = await fetch(
                `${GLOBAL_API}/field/${fieldName}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        value: value
                    })
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                throw new Error(
                    errorText || "Unable to save this information."
                );
            }

            const savedSettings = await response.json();

            // Refresh the field from the saved database response
            input.value = savedSettings[fieldName] || "";

            showGlobalMessage(
                fieldName + " saved successfully!"
            );

        } catch (error) {

            console.error("Global field save error:", error);

            showGlobalMessage(error.message, true);

        }
    };


    // Delete an individual field
    window.deleteGlobalField = async function (fieldName) {

        if (!Object.prototype.hasOwnProperty.call(globalFields, fieldName)) {
            return;
        }

        const input = document.getElementById(globalFields[fieldName]);

        if (!input) return;

        if (!input.value.trim()) {

            showGlobalMessage("This field is already empty.", true);

            return;
        }

        if (!confirm("Are you sure you want to delete this information?")) {
            return;
        }

        try {

            const response = await fetch(
                `${GLOBAL_API}/field/${fieldName}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                throw new Error(
                    errorText || "Unable to delete this information."
                );
            }

            const savedSettings = await response.json();

            input.value = savedSettings[fieldName] || "";

            showGlobalMessage(
                fieldName + " deleted successfully!"
            );

        } catch (error) {

            console.error("Global field delete error:", error);

            showGlobalMessage(error.message, true);

        }
    };


    // Display uploaded logo
    function updateLogoPreview(imagePath) {

        if (!logoPreview || !logoEmptyMessage) return;

        if (imagePath) {

            logoPreview.src = imagePath;

            logoPreview.style.display = "block";

            logoEmptyMessage.style.display = "none";

        } else {

            logoPreview.removeAttribute("src");

            logoPreview.style.display = "none";

            logoEmptyMessage.style.display = "block";
        }
    }


    // Preview selected logo before uploading
    if (logoInput) {

        logoInput.addEventListener("change", function () {

            const file = logoInput.files[0];

            if (!file) return;

            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/webp",
                "image/gif"
            ];

            if (!allowedTypes.includes(file.type)) {

                showGlobalMessage(
                    "Please select a PNG, JPG, WEBP or GIF image.",
                    true
                );

                logoInput.value = "";

                return;
            }

            if (file.size > 5 * 1024 * 1024) {

                showGlobalMessage(
                    "Logo image must not exceed 5 MB.",
                    true
                );

                logoInput.value = "";

                return;
            }

            const previewURL = URL.createObjectURL(file);

            logoPreview.src = previewURL;

            logoPreview.style.display = "block";

            logoEmptyMessage.style.display = "none";

        });

    }


    // Upload a new logo or replace the existing logo
    window.uploadGlobalLogo = async function () {

        if (!logoInput || !logoInput.files.length) {

            showGlobalMessage(
                "Please select a logo image first.",
                true
            );

            return;
        }

        const file = logoInput.files[0];

        const formData = new FormData();

        formData.append("logo", file);

        try {

            showGlobalMessage("Uploading logo...");

            const response = await fetch(
                `${GLOBAL_API}/logo`,
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                throw new Error(
                    errorText || "Unable to upload logo."
                );
            }

            const settings = await response.json();

            currentLogoPath = settings.logoImage || null;

            updateLogoPreview(currentLogoPath);

            logoInput.value = "";

            showGlobalMessage(
                "Website logo uploaded successfully!"
            );

        } catch (error) {

            console.error("Logo upload error:", error);

            showGlobalMessage(error.message, true);

        }
    };


    // Delete uploaded logo
    window.deleteGlobalLogo = async function () {

        if (!currentLogoPath) {

            showGlobalMessage(
                "There is no logo available to delete.",
                true
            );

            return;
        }

        if (!confirm("Are you sure you want to delete the website logo?")) {
            return;
        }

        try {

            const response = await fetch(
                `${GLOBAL_API}/logo`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                throw new Error(
                    errorText || "Unable to delete logo."
                );
            }

            const settings = await response.json();

            currentLogoPath = settings.logoImage || null;

            updateLogoPreview(currentLogoPath);

            if (logoInput) {
                logoInput.value = "";
            }

            showGlobalMessage(
                "Website logo deleted successfully!"
            );

        } catch (error) {

            console.error("Logo deletion error:", error);

            showGlobalMessage(error.message, true);

        }
    };


    // Initial database loading
    if (document.getElementById("header-footer-manage")) {
        loadGlobalSettings();
    }

});


// ==========================================
// ADMIN ACCOUNT MANAGEMENT
// ADMIN ONLY
// ==========================================

document.addEventListener("dashboardRoleReady", () => {

    if (currentUserRole !== "ADMIN") return;

    const ACCOUNT_API = "/api/admin-accounts";

    const accountForm = document.getElementById("staffAccountForm");
    const accountIdInput = document.getElementById("staffAccountId");
    const usernameInput = document.getElementById("staffUsername");
    const passwordInput = document.getElementById("staffPassword");
    const submitButton = document.getElementById("staffAccountSubmit");
    const cancelButton = document.getElementById("cancelStaffEdit");
    const tableBody = document.getElementById("staffAccountsTableBody");
    const statusMessage = document.getElementById("accountStatusMessage");

    if (!accountForm || !tableBody) return;

    function showAccountMessage(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.classList.remove("hidden-alert");

        statusMessage.style.color = isError ? "#FA0073" : "#16803c";

        setTimeout(() => {
            statusMessage.classList.add("hidden-alert");
        }, 4000);
    }

    async function accountRequest(url, options = {}) {

        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            cache: "no-store"
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(
                responseText || `Request failed (${response.status})`
            );
        }

        return responseText;
    }

    function resetAccountForm() {
        accountForm.reset();
        accountIdInput.value = "";
        submitButton.textContent = "Create Staff Account";
        cancelButton.style.display = "none";
    }

    async function loadStaffAccounts() {

        tableBody.innerHTML = "";

        const loadingRow = document.createElement("tr");
        const loadingCell = document.createElement("td");
        loadingCell.colSpan = 5;
        loadingCell.textContent = "Loading staff accounts...";
        loadingRow.appendChild(loadingCell);
        tableBody.appendChild(loadingRow);

        try {
            const response = await fetch(ACCOUNT_API, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load staff accounts.");
            }

            const accounts = await response.json();

            tableBody.innerHTML = "";

            if (accounts.length === 0) {
                const row = document.createElement("tr");
                const cell = document.createElement("td");
                cell.colSpan = 5;
                cell.textContent = "No staff accounts found.";
                row.appendChild(cell);
                tableBody.appendChild(row);
                return;
            }

            accounts.forEach(account => {

                const row = document.createElement("tr");

                const usernameCell = document.createElement("td");
                usernameCell.textContent = account.username;

                const roleCell = document.createElement("td");
                roleCell.textContent = account.role;

                const statusCell = document.createElement("td");
                statusCell.textContent = account.active
                    ? "Active"
                    : "Inactive";

                const dateCell = document.createElement("td");
                dateCell.textContent = account.createdAt
                    ? new Date(account.createdAt).toLocaleString()
                    : "-";

                const actionsCell = document.createElement("td");

                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "btn-save-changes";
                editButton.textContent = "Edit";

                editButton.addEventListener("click", () => {
                    accountIdInput.value = account.id;
                    usernameInput.value = account.username;
                    passwordInput.value = "";

                    submitButton.textContent = "Update Staff Account";
                    cancelButton.style.display = "inline-block";

                    accountForm.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });

                const statusButton = document.createElement("button");
                statusButton.type = "button";
                statusButton.className = "btn-save-changes";
                statusButton.textContent = account.active
                    ? "Deactivate"
                    : "Activate";

                statusButton.addEventListener("click", async () => {

                    const newStatus = !account.active;

                    if (!confirm(
                        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} ${account.username}?`
                    )) {
                        return;
                    }

                    try {
                        await accountRequest(
                            `${ACCOUNT_API}/${account.id}/status`,
                            {
                                method: "PUT",
                                body: JSON.stringify({
                                    active: newStatus
                                })
                            }
                        );

                        showAccountMessage("Account status updated successfully.");
                        loadStaffAccounts();

                    } catch (error) {
                        showAccountMessage(error.message, true);
                    }
                });

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "btn-delete";
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", async () => {

                    if (!confirm(
                        `Are you sure you want to delete ${account.username}?`
                    )) {
                        return;
                    }

                    try {
                        await accountRequest(
                            `${ACCOUNT_API}/${account.id}`,
                            {
                                method: "DELETE"
                            }
                        );

                        showAccountMessage("Staff account deleted successfully.");
                        loadStaffAccounts();

                    } catch (error) {
                        showAccountMessage(error.message, true);
                    }
                });

                actionsCell.append(
                    editButton,
                    statusButton,
                    deleteButton
                );

                row.append(
                    usernameCell,
                    roleCell,
                    statusCell,
                    dateCell,
                    actionsCell
                );

                tableBody.appendChild(row);
            });

        } catch (error) {
            tableBody.innerHTML = "";

            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 5;
            cell.textContent = error.message;

            row.appendChild(cell);
            tableBody.appendChild(row);
        }
    }

    accountForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const id = accountIdInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username) {
            showAccountMessage("Please enter a username.", true);
            return;
        }

        if (!id && password.length < 8) {
            showAccountMessage(
                "Password must contain at least 8 characters.",
                true
            );
            return;
        }

        if (id && password && password.length < 8) {
            showAccountMessage(
                "Password must contain at least 8 characters.",
                true
            );
            return;
        }

        const data = {
            username: username,
            password: password
        };

        try {
            if (id) {

                await accountRequest(`${ACCOUNT_API}/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(data)
                });

                showAccountMessage("Staff account updated successfully.");

            } else {

                await accountRequest(ACCOUNT_API, {
                    method: "POST",
                    body: JSON.stringify(data)
                });

                showAccountMessage("Staff account created successfully.");
            }

            resetAccountForm();
            loadStaffAccounts();

        } catch (error) {
            showAccountMessage(error.message, true);
        }
    });

    cancelButton.addEventListener("click", resetAccountForm);

    loadStaffAccounts();

});
