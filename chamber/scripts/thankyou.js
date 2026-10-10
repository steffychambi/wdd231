// Read submitted form data from the URL.
const params = new URLSearchParams(window.location.search);

const firstName = params.get("firstName") || "";
const lastName = params.get("lastName") || "";
const email = params.get("email") || "";
const mobile = params.get("mobile") || "";
const organization = params.get("organization") || "";
const timestamp = params.get("timestamp") || "";

// Display submitted information safely.
function displayValue(elementId, value) {
    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = value || "Not provided";
    }
}

displayValue("display-first-name", firstName);
displayValue("display-last-name", lastName);
displayValue("display-email", email);
displayValue("display-mobile", mobile);
displayValue("display-organization", organization);

// Format the form submission date.
const timestampElement = document.querySelector("#display-timestamp");

if (timestampElement) {
    if (timestamp) {
        const date = new Date(timestamp);

        timestampElement.textContent = Number.isNaN(date.getTime())
            ? "Not available"
            : date.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short"
            });
    } else {
        timestampElement.textContent = "Not available";
    }
}