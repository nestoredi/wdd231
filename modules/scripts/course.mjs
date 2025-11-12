// scripts/course.mjs

const byuiCourse = {
    code: "WDD231",
    name: "Web Frontend Development I",
    sections: [
        { sectionNum: 1, enrolled: 88, instructor: 'Brother Bingham' },
        { sectionNum: 2, enrolled: 80, instructor: 'Sister Shultz' },
        { sectionNum: 3, enrolled: 95, instructor: 'Sister Smith' }
    ],
    changeEnrollment: function (sectionNum, add = true) {
        // Encontrar el índice de la sección en el array
        const sectionIndex = this.sections.findIndex(
            (section) => section.sectionNum == sectionNum
        );
        if (sectionIndex >= 0) {
            if (add) {
                this.sections[sectionIndex].enrolled++;
            } else {
                this.sections[sectionIndex].enrolled--;
            }
        }
    }
};

// Exportamos el objeto byuiCourse como la exportación por defecto
export default byuiCourse;