const summary = document.querySelector("#submission-summary");
const params = new URLSearchParams(window.location.search);

const fields = [
    ["Name", params.get("name")],
    ["Email", params.get("email")],
    ["Reason", params.get("reason")],
    ["Physics topic", params.get("topic") || "Not specified"],
    ["Message", params.get("message")]
];

if (!params.has("name") && !params.has("message")) {
    const heading = document.createElement("h2");
    heading.textContent = "No submission found";

    const message = document.createElement("p");
    message.textContent = "Please complete the contact form first.";

    summary.replaceChildren(heading, message);
} else {
    const heading = document.createElement("h2");
    heading.textContent = "Your Submitted Details";

    const descriptionList = document.createElement("dl");

    fields.forEach(([label, value]) => {
        const term = document.createElement("dt");
        term.textContent = label;

        const description = document.createElement("dd");
        description.textContent = value || "Not provided";

        descriptionList.append(term, description);
    });

    summary.replaceChildren(heading, descriptionList);
}