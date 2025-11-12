// scripts/sections.mjs

// Exportamos la función como una exportación nombrada
export function setSectionSelection(sections) {
    const selectElement = document.querySelector("#sectionNumber");
    const html = sections.map(
        (section) => `<option value="${section.sectionNum}">${section.sectionNum}</option>`
    );
    selectElement.innerHTML = html.join("");
}