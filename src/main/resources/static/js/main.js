
document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    // Mobile navigation
    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        const isExpanded = navLinks.classList.contains("active");

        menuToggle.setAttribute("aria-expanded", isExpanded);

        menuToggle.innerHTML = isExpanded
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';

    });

    // Close mobile menu after clicking a navigation link
    document.querySelectorAll(".nav-links a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

        });

    });

});

document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.getElementById('btnExploreServices');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Locates your subsequent care-services container grid section component block dynamically
            const servicesSection = document.querySelector('.services-section, #services');
            
            if (servicesSection) {
                servicesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn("Target services section element (.services-section or #services) not detected on document DOM tree context flow layout rules.");
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');

    if(serviceCards.length > 0) {
        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                const titleElement = this.querySelector('.pill-title-string');
                if (titleElement) {
                    console.log(`Navigating to specialized handler for: ${titleElement.textContent}`);
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Configures lists matching your distinct services requirements matrices data fields
    const servicesDataMapping = {
        'home-care': [
            { value: 'elderly', label: 'Elderly Care' },
            { value: 'nursing', label: 'Nursing Care' },
            { value: 'patient', label: 'Patient Care' },
            { value: 'companion', label: 'Companion Care' },
            { value: 'bedridden', label: 'Bedridden Care' },
            { value: 'palliative', label: 'Palliative Care' },
            { value: 'post-hospital', label: 'Post Hospital Care' },
            { value: 'baby-care', label: 'Baby Care' },
            { value: 'medicine-assist', label: 'Medicine Assistance' }
        ],
        'physio': [
            { value: 'pain-relief', label: 'Pain Relief Therapy' },
            { value: 'post-surgery', label: 'Post-Surgery Rehabilitation' },
            { value: 'sports-injury', label: 'Sports Injury Recovery' },
            { value: 'elderly-physio', label: 'Elderly Physiotherapy' },
            { value: 'stroke-rehab', label: 'Stroke & Neurological Rehabilitation' },
            { value: 'mobility-training', label: 'Strength, Mobility & Balance Training' }
        ]
    };

    const tabButtons = document.querySelectorAll('.tab-toggle-btn');
    const serviceSelectorDropdown = document.getElementById('dynamicServiceSelector');
    const hiddenCategoryInput = document.getElementById('hiddenCategoryTracker');

    // Function to populate the option entries dynamically into selection wrapper box loops
    function updateDropdownOptions(categoryKey) {
        if (!serviceSelectorDropdown) return;
        
        // Wipe old options cleanly
        serviceSelectorDropdown.innerHTML = '';

        // Add a clean unselected default placeholder row item
        const defaultPlaceholder = document.createElement('option');
        defaultPlaceholder.value = '';
        defaultPlaceholder.disabled = true;
        defaultPlaceholder.selected = true;
        defaultPlaceholder.hidden = true;
        defaultPlaceholder.textContent = 'Select a service';
        serviceSelectorDropdown.appendChild(defaultPlaceholder);

        // Fetch new records matching array parameters keys maps
        const recordsList = servicesDataMapping[categoryKey] || [];
        recordsList.forEach(item => {
            const optionNode = document.createElement('option');
            optionNode.value = item.value;
            optionNode.textContent = item.label;
            serviceSelectorDropdown.appendChild(optionNode);
        });
    }

    // Initialize dropdown options by loading default home-care data
    updateDropdownOptions('home-care');

    // Attach click listener interactions onto toggle tab loops
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Drop old active classes from tabs array fields group
            tabButtons.forEach(btn => btn.classList.remove('active-tab-state'));
            
            // Highlight current clicked item box state parameters
            this.classList.add('active-tab-state');

            const targetsCategory = this.getAttribute('data-service-type');
            
            // Sync hidden inputs track value metrics parameters fields safely
            if (hiddenCategoryInput) {
                hiddenCategoryInput.value = targetsCategory;
            }

            // Fire data population update transitions
            updateDropdownOptions(targetsCategory);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const footerLinks = document.querySelectorAll('.footer-menu-links a[href^="#"]');
    
    footerLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {

    const servicesContainer =
        document.getElementById("dynamicHomeCareServices");

    if (!servicesContainer) return;

    async function loadHomeCareServices() {

        try {

            const response = await fetch("/api/home-care-services", {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load Home Care services.");
            }

            const services = await response.json();

            // Remove previously rendered service cards.
            // Keep the existing medicine information promo box.
            servicesContainer
                .querySelectorAll(".service-card")
                .forEach(card => card.remove());

            services.forEach(service => {

                const card = document.createElement("div");
                card.className = "service-card";

                const imageBox = document.createElement("div");
                imageBox.className = "card-image-crop-box";

                const image = document.createElement("img");
                image.src = service.serviceImage || "";
                image.alt = service.serviceTitle;
                image.className = "service-zoom-img";
                image.loading = "lazy";

                const label = document.createElement("div");
                label.className =
                    `service-label-pill ${service.themeColor}`;

                const emoji = document.createElement("span");
                emoji.className = "pill-icon-badge";
                emoji.textContent = service.serviceEmoji || "";

                const title = document.createElement("span");
                title.className = "pill-title-string";
                title.textContent = service.serviceTitle;

                label.appendChild(emoji);
                label.appendChild(title);

                imageBox.appendChild(image);
                imageBox.appendChild(label);

                card.appendChild(imageBox);

                servicesContainer.insertBefore(
                    card,
                    servicesContainer.querySelector(
                        ".services-info-promo-box"
                    )
                );
            });
        } catch (error) {
            console.error("Home Care Services Error:", error);
        }
    }
    loadHomeCareServices();
});


// ============================================================
// PUBLIC PHYSIOTHERAPY SERVICES - LOAD FROM MYSQL
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("dynamicPhysioServices");

    if (!container) return;

    async function loadPhysioServices() {

        try {

            const response = await fetch("/api/physio-services", {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load physiotherapy services.");
            }

            const services = await response.json();

            container.replaceChildren();

            services.forEach(service => {

                const card = document.createElement("div");
                card.className = "physio-card";

                const media = document.createElement("div");
                media.className = "physio-media-wrapper";

                const image = document.createElement("img");

                image.src = service.physioImage || "";
                image.alt = service.physioTitle || "Physiotherapy service";
                image.className = "physio-zoom-img";
                image.loading = "lazy";

                const label = document.createElement("div");

                const allowedThemes = [
                    "pill-deep-blue",
                    "pill-vibrant-pink"
                ];

                const theme = allowedThemes.includes(service.themeColor)
                    ? service.themeColor
                    : "pill-deep-blue";

                label.className = `physio-label-pill ${theme}`;

                const emoji = document.createElement("span");
                emoji.className = "physio-pill-icon";
                emoji.textContent = service.physioEmoji || "";

                const title = document.createElement("span");
                title.className = "physio-pill-text";
                title.textContent = service.physioTitle || "";

                label.append(emoji, title);

                media.append(image, label);

                card.appendChild(media);

                container.appendChild(card);

            });

        } catch (error) {

            console.error("Physiotherapy Services Error:", error);

        }
    }

    loadPhysioServices();

});

// ==========================================
// WHY CHOOSE US - PUBLIC DYNAMIC CARDS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("dynamicWhyChooseUs");

    if (!container) return;

    const API_URL = "/api/why-choose-us";

    // Icon SVG templates
    function getWhyIcon(type) {

        const icons = {

            shield: `
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
            `,

            heart: `
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            `,

            rupee: `<span class="rupee-symbol-asset">₹</span>`,

            home: `
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            `
        };

        return icons[type] || icons.shield;
    }

    async function loadWhyChooseUs() {

        try {

            const response = await fetch(API_URL, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load Why Choose Us cards.");
            }

            const cards = await response.json();

            container.innerHTML = "";

            cards.forEach(card => {

                const cardElement = document.createElement("div");
                cardElement.className = "choose-card";

                const inner = document.createElement("div");
                inner.className = "choose-card-inner";

                const iconBadge = document.createElement("div");
                iconBadge.className = "choose-icon-badge";
                iconBadge.innerHTML = getWhyIcon(card.iconType);

                const title = document.createElement("h3");
                title.className = "choose-card-title";
                title.textContent = card.cardTitle;

                const text = document.createElement("p");
                text.className = "choose-card-text";
                text.textContent = card.description;

                inner.append(iconBadge, title, text);
                cardElement.appendChild(inner);

                container.appendChild(cardElement);
            });

        } catch (error) {
            console.error("Why Choose Us loading error:", error);
        }
    }

    loadWhyChooseUs();
});


document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    // Mobile navigation
    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        const isExpanded = navLinks.classList.contains("active");

        menuToggle.setAttribute("aria-expanded", isExpanded);

        menuToggle.innerHTML = isExpanded
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';

    });

    // Close mobile menu after clicking a navigation link
    document.querySelectorAll(".nav-links a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

        });

    });

});

document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.getElementById('btnExploreServices');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Locates your subsequent care-services container grid section component block dynamically
            const servicesSection = document.querySelector('.services-section, #services');
            
            if (servicesSection) {
                servicesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn("Target services section element (.services-section or #services) not detected on document DOM tree context flow layout rules.");
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');

    if(serviceCards.length > 0) {
        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                const titleElement = this.querySelector('.pill-title-string');
                if (titleElement) {
                    console.log(`Navigating to specialized handler for: ${titleElement.textContent}`);
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Configures lists matching your distinct services requirements matrices data fields
    const servicesDataMapping = {
        'home-care': [
            { value: 'elderly', label: 'Elderly Care' },
            { value: 'nursing', label: 'Nursing Care' },
            { value: 'patient', label: 'Patient Care' },
            { value: 'companion', label: 'Companion Care' },
            { value: 'bedridden', label: 'Bedridden Care' },
            { value: 'palliative', label: 'Palliative Care' },
            { value: 'post-hospital', label: 'Post Hospital Care' },
            { value: 'baby-care', label: 'Baby Care' },
            { value: 'medicine-assist', label: 'Medicine Assistance' }
        ],
        'physio': [
            { value: 'pain-relief', label: 'Pain Relief Therapy' },
            { value: 'post-surgery', label: 'Post-Surgery Rehabilitation' },
            { value: 'sports-injury', label: 'Sports Injury Recovery' },
            { value: 'elderly-physio', label: 'Elderly Physiotherapy' },
            { value: 'stroke-rehab', label: 'Stroke & Neurological Rehabilitation' },
            { value: 'mobility-training', label: 'Strength, Mobility & Balance Training' }
        ]
    };

    const tabButtons = document.querySelectorAll('.tab-toggle-btn');
    const serviceSelectorDropdown = document.getElementById('dynamicServiceSelector');
    const hiddenCategoryInput = document.getElementById('hiddenCategoryTracker');

    // Function to populate the option entries dynamically into selection wrapper box loops
    function updateDropdownOptions(categoryKey) {
        if (!serviceSelectorDropdown) return;
        
        // Wipe old options cleanly
        serviceSelectorDropdown.innerHTML = '';

        // Add a clean unselected default placeholder row item
        const defaultPlaceholder = document.createElement('option');
        defaultPlaceholder.value = '';
        defaultPlaceholder.disabled = true;
        defaultPlaceholder.selected = true;
        defaultPlaceholder.hidden = true;
        defaultPlaceholder.textContent = 'Select a service';
        serviceSelectorDropdown.appendChild(defaultPlaceholder);

        // Fetch new records matching array parameters keys maps
        const recordsList = servicesDataMapping[categoryKey] || [];
        recordsList.forEach(item => {
            const optionNode = document.createElement('option');
            optionNode.value = item.value;
            optionNode.textContent = item.label;
            serviceSelectorDropdown.appendChild(optionNode);
        });
    }

    // Initialize dropdown options by loading default home-care data
    updateDropdownOptions('home-care');

    // Attach click listener interactions onto toggle tab loops
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Drop old active classes from tabs array fields group
            tabButtons.forEach(btn => btn.classList.remove('active-tab-state'));
            
            // Highlight current clicked item box state parameters
            this.classList.add('active-tab-state');

            const targetsCategory = this.getAttribute('data-service-type');
            
            // Sync hidden inputs track value metrics parameters fields safely
            if (hiddenCategoryInput) {
                hiddenCategoryInput.value = targetsCategory;
            }

            // Fire data population update transitions
            updateDropdownOptions(targetsCategory);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const footerLinks = document.querySelectorAll('.footer-menu-links a[href^="#"]');
    
    footerLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {

    const servicesContainer =
        document.getElementById("dynamicHomeCareServices");

    if (!servicesContainer) return;

    async function loadHomeCareServices() {

        try {

            const response = await fetch("/api/home-care-services", {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load Home Care services.");
            }

            const services = await response.json();

            // Remove previously rendered service cards.
            // Keep the existing medicine information promo box.
            servicesContainer
                .querySelectorAll(".service-card")
                .forEach(card => card.remove());

            services.forEach(service => {

                const card = document.createElement("div");
                card.className = "service-card";

                const imageBox = document.createElement("div");
                imageBox.className = "card-image-crop-box";

                const image = document.createElement("img");
                image.src = service.serviceImage || "";
                image.alt = service.serviceTitle;
                image.className = "service-zoom-img";
                image.loading = "lazy";

                const label = document.createElement("div");
                label.className =
                    `service-label-pill ${service.themeColor}`;

                const emoji = document.createElement("span");
                emoji.className = "pill-icon-badge";
                emoji.textContent = service.serviceEmoji || "";

                const title = document.createElement("span");
                title.className = "pill-title-string";
                title.textContent = service.serviceTitle;

                label.appendChild(emoji);
                label.appendChild(title);

                imageBox.appendChild(image);
                imageBox.appendChild(label);

                card.appendChild(imageBox);

                servicesContainer.insertBefore(
                    card,
                    servicesContainer.querySelector(
                        ".services-info-promo-box"
                    )
                );
            });
        } catch (error) {
            console.error("Home Care Services Error:", error);
        }
    }
    loadHomeCareServices();
});


// ============================================================
// PUBLIC PHYSIOTHERAPY SERVICES - LOAD FROM MYSQL
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("dynamicPhysioServices");

    if (!container) return;

    async function loadPhysioServices() {

        try {

            const response = await fetch("/api/physio-services", {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load physiotherapy services.");
            }

            const services = await response.json();

            container.replaceChildren();

            services.forEach(service => {

                const card = document.createElement("div");
                card.className = "physio-card";

                const media = document.createElement("div");
                media.className = "physio-media-wrapper";

                const image = document.createElement("img");

                image.src = service.physioImage || "";
                image.alt = service.physioTitle || "Physiotherapy service";
                image.className = "physio-zoom-img";
                image.loading = "lazy";

                const label = document.createElement("div");

                const allowedThemes = [
                    "pill-deep-blue",
                    "pill-vibrant-pink"
                ];

                const theme = allowedThemes.includes(service.themeColor)
                    ? service.themeColor
                    : "pill-deep-blue";

                label.className = `physio-label-pill ${theme}`;

                const emoji = document.createElement("span");
                emoji.className = "physio-pill-icon";
                emoji.textContent = service.physioEmoji || "";

                const title = document.createElement("span");
                title.className = "physio-pill-text";
                title.textContent = service.physioTitle || "";

                label.append(emoji, title);

                media.append(image, label);

                card.appendChild(media);

                container.appendChild(card);

            });

        } catch (error) {

            console.error("Physiotherapy Services Error:", error);

        }
    }

    loadPhysioServices();

});

// ==========================================
// WHY CHOOSE US - PUBLIC DYNAMIC CARDS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("dynamicWhyChooseUs");

    if (!container) return;

    const API_URL = "/api/why-choose-us";

    // Icon SVG templates
    function getWhyIcon(type) {

        const icons = {

            shield: `
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
            `,

            heart: `
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            `,

            rupee: `<span class="rupee-symbol-asset">₹</span>`,

            home: `
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            `
        };

        return icons[type] || icons.shield;
    }

    async function loadWhyChooseUs() {

        try {

            const response = await fetch(API_URL, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Unable to load Why Choose Us cards.");
            }

            const cards = await response.json();

            container.innerHTML = "";

            cards.forEach(card => {

                const cardElement = document.createElement("div");
                cardElement.className = "choose-card";

                const inner = document.createElement("div");
                inner.className = "choose-card-inner";

                const iconBadge = document.createElement("div");
                iconBadge.className = "choose-icon-badge";
                iconBadge.innerHTML = getWhyIcon(card.iconType);

                const title = document.createElement("h3");
                title.className = "choose-card-title";
                title.textContent = card.cardTitle;

                const text = document.createElement("p");
                text.className = "choose-card-text";
                text.textContent = card.description;

                inner.append(iconBadge, title, text);
                cardElement.appendChild(inner);

                container.appendChild(cardElement);
            });

        } catch (error) {
            console.error("Why Choose Us loading error:", error);
        }
    }

    loadWhyChooseUs();
});

// ==========================================
// PUBLIC CONTACT DETAILS - LOAD FROM MYSQL
// ==========================================

document.addEventListener("DOMContentLoaded", async function () {

    const phoneElement = document.getElementById("publicContactPhone");
    const emailElement = document.getElementById("publicContactEmail");
    const locationElement = document.getElementById("publicContactLocation");
    const hoursElement = document.getElementById("publicContactHours");

    try {

        const response = await fetch("/api/contact-details", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Unable to load contact details.");
        }

        const records = await response.json();

        // Contact API returns a list of records
        const contact = Array.isArray(records) ? records[0] : records;

        if (!contact) {
            console.warn("No contact details found in database.");
            return;
        }

        // Update phone
        if (phoneElement && contact.contactPhone) {
            phoneElement.textContent = contact.contactPhone;
        }

        // Update email
        if (emailElement && contact.contactEmail) {
            emailElement.textContent = contact.contactEmail;
        }

        // Update location
        if (locationElement && contact.contactLocation) {
            locationElement.textContent = contact.contactLocation;
        }

        // Update working hours
        if (hoursElement && contact.contactHours) {
            hoursElement.textContent = contact.contactHours;
        }

        console.log("Public contact details loaded successfully.");

    } catch (error) {

        console.error("Contact Details Loading Error:", error);

    }

});


// ============================================================
// CUSTOMER APPOINTMENT / CALLBACK FORM SUBMISSION
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("callbackRequestForm");

    if (!form) return;

    // Create an inline message area
    let messageBox = document.getElementById("callbackFormMessage");

    if (!messageBox) {
        messageBox = document.createElement("p");
        messageBox.id = "callbackFormMessage";
        messageBox.style.marginTop = "15px";
        messageBox.style.fontWeight = "600";
        messageBox.setAttribute("role", "status");
        form.appendChild(messageBox);
    }

    form.addEventListener("submit", async function (event) {

        // Stop normal HTML form submission to "/"
        event.preventDefault();

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        const payload = {
            fullName: form.elements["fullName"].value.trim(),
            phoneNumber: form.elements["phoneNumber"].value.trim(),
            patientAge: Number(form.elements["patientAge"].value),
            patientGender: form.elements["patientGender"].value,
            selectedServiceCategory:
                document.getElementById("hiddenCategoryTracker").value,
            requestedServiceType:
                document.getElementById("dynamicServiceSelector").value,
            userMessage: form.elements["userMessage"].value.trim()
        };

        if (
            !payload.fullName ||
            !payload.phoneNumber ||
            !payload.patientAge ||
            !payload.patientGender ||
            !payload.requestedServiceType
        ) {
            messageBox.textContent = "Please fill in all required fields.";
            messageBox.style.color = "#FA0073";
            return;
        }

        try {

            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";

            messageBox.textContent = "";

            const response = await fetch("/api/callback-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    errorText || "Unable to submit your appointment request."
                );
            }

            messageBox.textContent =
                "Your appointment request has been submitted successfully. Our team will contact you soon.";

            messageBox.style.color = "#10b981";

            form.reset();

            // Restore the default Home Care tab and dropdown
            const homeCareTab = form.querySelector(
                '[data-service-type="home-care"]'
            );

            if (homeCareTab) {
                homeCareTab.click();
            }

        } catch (error) {

            console.error("Appointment submission error:", error);

            messageBox.textContent =
                "Unable to submit your request. Please try again.";

            messageBox.style.color = "#FA0073";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Request a Callback";

        }

    });

});

// ============================================================
// PUBLIC WEBSITE - GLOBAL HEADER, FOOTER AND FIND US SETTINGS
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {

    const API_URL = "/api/global-site-settings";

    try {

        const response = await fetch(API_URL, {
            method: "GET",
            cache: "no-store"
        });

        if (response.status === 204) {
            console.log("No global website settings available yet.");
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to load website settings.");
        }

        const settings = await response.json();


        // ----------------------------------------------------
        // HELPER: Update text safely
        // ----------------------------------------------------

        function updateText(elementId, value) {

            const element = document.getElementById(elementId);

            if (element && value) {
                element.textContent = value;
            }
        }


        // ----------------------------------------------------
        // FOOTER BRAND NAME
        // ----------------------------------------------------

        updateText(
            "publicFooterBrandName",
            settings.brandName
        );


        // ----------------------------------------------------
        // FOOTER DESCRIPTION
        // ----------------------------------------------------

        updateText(
            "publicFooterDescription",
            settings.footerDesc
        );


        // ----------------------------------------------------
        // FOOTER LOGO
        // ----------------------------------------------------

        const footerLogo = document.getElementById(
            "publicFooterLogo"
        );

        if (footerLogo && settings.logoImage) {

            footerLogo.src = settings.logoImage;

            footerLogo.style.display = "block";

        }


        // ----------------------------------------------------
        // FOOTER PHONE
        // ----------------------------------------------------

        const footerPhone = document.getElementById(
            "publicFooterPhone"
        );

        if (footerPhone && settings.footerPhoneString) {

            footerPhone.textContent = settings.footerPhoneString;

            // Use the first number for the clickable phone link
            const firstPhone = settings.footerPhoneString
                .split(",")[0]
                .trim();

            footerPhone.href = "tel:" + firstPhone.replace(
                /[^0-9+]/g,
                ""
            );

        }


        // ----------------------------------------------------
        // FOOTER EMAIL
        // ----------------------------------------------------

        const footerEmail = document.getElementById(
            "publicFooterEmail"
        );

        if (footerEmail && settings.footerEmailString) {

            footerEmail.textContent = settings.footerEmailString;

            footerEmail.href =
                "mailto:" + settings.footerEmailString.trim();

        }


        // ----------------------------------------------------
        // FOOTER CITY
        // ----------------------------------------------------

        updateText(
            "publicFooterCity",
            settings.footerCityString
        );


        // ----------------------------------------------------
        // COPYRIGHT
        // ----------------------------------------------------

        updateText(
            "publicFooterCopyright",
            settings.copyrightText
        );


        // ----------------------------------------------------
        // FIND US BUSINESS NAME
        // ----------------------------------------------------

        updateText(
            "publicFindUsBrandName",
            settings.brandName
        );


        // ----------------------------------------------------
        // FIND US ADDRESS
        // ----------------------------------------------------

        updateText(
            "publicFindUsAddress",
            settings.findUsLocationString
        );


        // ----------------------------------------------------
        // GOOGLE MAPS LINK
        // ----------------------------------------------------

        const mapLink = document.getElementById(
            "publicFindUsMapLink"
        );

        if (mapLink && settings.findUsMapUrl) {

            mapLink.href = settings.findUsMapUrl;

            mapLink.target = "_blank";

            mapLink.rel = "noopener noreferrer";

        }

        console.log("Global website settings loaded successfully.");

    } catch (error) {

        console.error(
            "Public Global Settings Error:",
            error
        );

    }

});

// ============================================================
// PUBLIC WEBSITE - GLOBAL HEADER, FOOTER AND FIND US SETTINGS
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {

    const API_URL = "/api/global-site-settings";

    try {

        const response = await fetch(API_URL, {
            method: "GET",
            cache: "no-store"
        });

        if (response.status === 204) {
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to load website settings.");
        }

        const settings = await response.json();

        // Helper: update text safely
        function updateText(id, value) {

            const element = document.getElementById(id);

            if (element && value) {
                element.textContent = value;
            }
        }

        // Helper: update image
        function updateImage(id, imagePath) {

            const element = document.getElementById(id);

            if (element && imagePath) {
                element.src = imagePath + "?t=" + Date.now();
            }
        }

        // Helper: update clickable phone
        function updatePhone(id, phone) {

            const element = document.getElementById(id);

            if (!element || !phone) return;

            element.textContent = phone;
            element.href = "tel:" + phone.replace(/[^\d+]/g, "");
            element.style.display = "inline-block";
        }

        // HEADER
        updateText("publicHeaderBrandName", settings.brandName);
        updateImage("publicHeaderLogo", settings.logoImage);
        updatePhone("publicHeaderPhone", settings.headerPhone);

        // FIND US
        updateText("publicFindUsBrandName", settings.brandName);
        updateText("publicFindUsAddress", settings.findUsLocationString);

        const mapLink = document.getElementById("publicFindUsMapLink");

        if (mapLink && settings.findUsMapUrl) {
            mapLink.href = settings.findUsMapUrl;
        }

        // FOOTER BRANDING
        updateText("publicFooterBrandName", settings.brandName);
        updateText("publicFooterDescription", settings.footerDesc);
        updateImage("publicFooterLogo", settings.logoImage);

        // FOOTER PHONE NUMBERS
        const phoneContainer = document.getElementById("publicFooterPhones");

        if (phoneContainer && settings.footerPhoneString) {

            phoneContainer.replaceChildren();

            const phoneNumbers = settings.footerPhoneString
                .split(",")
                .map(phone => phone.trim())
                .filter(Boolean);

            phoneNumbers.forEach((phone, index) => {

                if (index > 0) {
                    phoneContainer.appendChild(
                        document.createTextNode(" / ")
                    );
                }

                const link = document.createElement("a");

                link.className = "contact-link";
                link.textContent = phone;
                link.href = "tel:" + phone.replace(/[^\d+]/g, "");

                phoneContainer.appendChild(link);

            });
        }

        // FOOTER EMAIL
        const emailElement = document.getElementById("publicFooterEmail");

        if (emailElement && settings.footerEmailString) {
            emailElement.textContent = settings.footerEmailString;
            emailElement.href = "mailto:" + settings.footerEmailString;
        }

        // FOOTER CITY
        updateText("publicFooterCity", settings.footerCityString);

        // FOOTER COPYRIGHT
        updateText("publicFooterCopyright", settings.copyrightText);

    } catch (error) {

        console.error("Public Global Settings Error:", error);

    }

});