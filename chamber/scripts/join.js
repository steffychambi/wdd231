// Add the form submission timestamp.
const timestampInput = document.querySelector("#timestamp");

if (timestampInput) {
    timestampInput.value = new Date().toISOString();
}

// Membership information dialogs.
const membershipLinks = document.querySelectorAll(".membership-link");

membershipLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const modalId = link.dataset.modal;
        const modal = modalId
            ? document.getElementById(modalId)
            : null;

        if (modal && typeof modal.showModal === "function") {
            modal.showModal();
        }
    });
});

// Close dialog buttons and backdrop.
const dialogs = document.querySelectorAll("dialog");

dialogs.forEach((dialog) => {
    const closeButton = dialog.querySelector(".modal-close");

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            dialog.close();
        });
    }

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});