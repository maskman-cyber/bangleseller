document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent page reload

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            const responseMessage = document.getElementById("responseMessage");

            console.log("📥 Form Data Captured:", { name, email, message }); // Debugging

            // Check if any field is empty
            if (!name || !email || !message) {
                responseMessage.innerText = "❌ All fields are required!";
                responseMessage.style.color = "red";
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/submit-form", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();
                console.log("✅ Server Response:", result);

                responseMessage.innerText = result.message;
                responseMessage.style.color = "green"; // Success message
                contactForm.reset(); // Clear the form after submission

            } catch (error) {
                console.error("❌ Error:", error);
                responseMessage.innerText = "❌ Error submitting form.";
                responseMessage.style.color = "red"; // Error message
            }
        });
    }

    // Slide-in Effect for Outlets
    const homeBtn = document.querySelector('a[href="#home"]');
    const outletSection = document.getElementById("outletSection");
    const closeBtn = document.getElementById("closeBtn");

    if (homeBtn && outletSection && closeBtn) {
        homeBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            outletSection.classList.add("active");
        });

        closeBtn.addEventListener("click", () => {
            outletSection.classList.remove("active");
        });

        // Close when clicking outside
        document.addEventListener("click", (e) => {
            if (!outletSection.contains(e.target) && e.target !== homeBtn) {
                outletSection.classList.remove("active");
            }
        });
    }

    // Get modal elements
    const modal = document.getElementById("shopModal");
    const shopName = document.getElementById("shopName");
    const shopAddress = document.getElementById("shopAddress");
    const shopContact = document.getElementById("shopContact");
    const shopLocation = document.getElementById("shopLocation");
    const modalClose = document.getElementById("modalClose");
    const sliderWrapper = document.querySelector(".slider-wrapper");

    // Shop details with multiple images
    const shopDetails = {
        1: {
            name: "Outlet 1 - New Indian Supermarket",
            images: ["images/shop1.jpg", "images/shop2.jpg", "images/shop3.jpg"],
            address: "Airport/St Matar Qadeem, Qatar",
            contact: "+974 1234 5678",
            location: "https://maps.google.com/?q=New+Indian+Supermarket+Qatar",
        },
        2: {
            name: "Outlet 2 - Safari Hypermarket",
            images: ["images/shop4.jpg", "images/shop5.jpg", "images/shop6.jpg"],
            address: "Behind Safari Hypermarket, Barwa Village, Qatar",
            contact: "+974 8765 4321",
            location: "https://maps.google.com/?q=Safari+Hypermarket+Qatar",
        },
        3: {
            name: "Outlet 3 - Rawabi Hypermarket",
            images: ["images/shop7.jpg", "images/shop8.jpg", "images/shop9.jpg"],
            address: "Izghawa/Rawabi Hypermarket, Ground Floor",
            contact: "+974 1122 3344",
            location: "https://maps.google.com/?q=Rawabi+Hypermarket+Qatar",
        },
    };

    // Function to update modal content
    function updateModalContent(shop) {
        shopName.innerText = shop.name;
        shopAddress.innerText = shop.address;
        shopContact.innerText = shop.contact;
        shopLocation.href = shop.location;

        // Clear previous images
        sliderWrapper.innerHTML = "";

        shop.images.forEach((image) => {
            console.log("📷 Loading image:", image); // Debugging check
            let imgElement = document.createElement("img");
            imgElement.classList.add("slide");
            imgElement.src = image;
            imgElement.alt = "Shop Image";
            sliderWrapper.appendChild(imgElement);
        });

        modal.style.display = "flex";
    }

    // Event listener for outlet clicks
    document.querySelectorAll(".outlet").forEach((outlet) => {
        outlet.addEventListener("click", function () {
            const shopId = this.getAttribute("data-id");
            const shop = shopDetails[shopId];

            if (shop) {
                updateModalContent(shop);
            }
        });
    });

    // Close modal
    if (modalClose) {
        modalClose.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
