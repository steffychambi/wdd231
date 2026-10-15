export async function loadExperiments() {
    try {
        const response = await fetch("data/experiments.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length < 15) {
            throw new Error(
                "The experiment data must contain at least 15 items."
            );
        }

        const hasInvalidItems = data.some((item) => {
            return (
                !item.id ||
                !item.name ||
                !item.topic ||
                !item.description ||
                !Array.isArray(item.materials) ||
                !Array.isArray(item.procedure)
            );
        });

        if (hasInvalidItems) {
            throw new Error(
                "One or more experiments have missing or invalid required fields."
            );
        }

        return data;
    } catch (error) {
        console.error("Unable to load experiments:", error);
        throw error;
    }
}
