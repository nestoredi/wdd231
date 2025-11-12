// scripts/modules.mjs

// Importamos la exportación por defecto desde course.mjs
import byuiCourse from './course.mjs';

// Importamos las exportaciones nombradas usando llaves
import { setSectionSelection } from './sections.mjs';
import { setTitle, renderSections } from './output.mjs';

// Al cargar la página, configuramos el título y llenamos la lista de secciones
setTitle(byuiCourse);
setSectionSelection(byuiCourse.sections);
renderSections(byuiCourse.sections);

// Event listener para el botón de inscribir
document.querySelector("#enrollStudent").addEventListener("click", function () {
  const sectionNum = document.querySelector("#sectionNumber").value;
  byuiCourse.changeEnrollment(sectionNum); // Inscribe (add = true por defecto)
  renderSections(byuiCourse.sections); // Actualiza la vista
});
        
// Event listener para el botón de dar de baja
document.querySelector("#dropStudent").addEventListener("click", function () {
  const sectionNum = document.querySelector("#sectionNumber").value;
  byuiCourse.changeEnrollment(sectionNum, false); // Da de baja
  renderSections(byuiCourse.sections); // Actualiza la vista
});