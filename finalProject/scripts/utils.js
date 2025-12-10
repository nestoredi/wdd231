// This file demonstrates ES Module export functionality
// Rubric #12: ES Module use

export function calculateDaysBetween(timestamp1, timestamp2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((timestamp2 - timestamp1) / oneDay);
}

export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error fetching data:", await response.text());
            return null;
        }
    } catch (error) {
        console.error("Network error:", error);
        return null;
    }
}

export function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}