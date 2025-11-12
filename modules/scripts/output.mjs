// scripts/output.mjs

// Exporta la función para establecer el título del curso
export function setTitle(course) {
    const courseName = document.querySelector("#courseName");
    const courseCode = document.querySelector("#courseCode");
    courseName.textContent = course.name;
    courseCode.textContent = course.code;
}

// Exporta la función para renderizar las secciones en la tabla
export function renderSections(sections) {
    const sectionsElement = document.querySelector("#sections");
    const sectionsHtml = sections.map(
        (section) => `
        <tr>
            <td>${section.sectionNum}</td>
            <td>${section.enrolled}</td>
            <td>${section.instructor}</td>
        </tr>
        `
    );
    sectionsElement.innerHTML = sectionsHtml.join("");
}