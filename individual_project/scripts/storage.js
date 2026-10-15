const STORAGE_KEY = "physicsLabSavedExperiments";

export function getSavedExperiments() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.warn("Unable to read saved experiments:", error);
        return [];
    }
}

export function toggleSavedExperiment(id) {
    const saved = getSavedExperiments();

    const updated = saved.includes(id)
        ? saved.filter((savedId) => savedId !== id)
        : [...saved, id];

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.warn("Unable to save this experiment:", error);
    }

    return getSavedExperiments();
}
