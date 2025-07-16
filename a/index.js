// index.js (o abraham.js en el futuro) - JavaScript específico del canto

// Asumiendo que `allCantosData` está disponible globalmente desde `canto_data.js`
// En un sistema de módulos, usarías: import { allCantosData } from './canto_data.js';

// Selecciona el canto específico que se va a mostrar en esta página
const currentCanto = allCantosData[0]; // Para este ejemplo, toma el primer canto

document.addEventListener('DOMContentLoaded', () => {
    if (currentCanto) {
        // Procesar las categorías para incluir sus URLs
        const processedCategories = currentCanto.category.map(catName => {
            // Aquí defines la lógica para generar la URL de cada categoría.
            // Por ejemplo, convertir "Pascua" a "/categorias/pascua.html"
            const categoryUrl = `/categorias/${catName.toLowerCase().replace(/\s/g, '-')}.html`;
            return { name: catName, url: categoryUrl };
        });

        // Llamar a la función de inicialización del JS general, pasándole los datos del canto
        // y las categorías procesadas.
        if (typeof initializeCantoPage === 'function') {
            initializeCantoPage(currentCanto, processedCategories);
        } else {
            console.error("Error: initializeCantoPage no está definida.");
        }
    } else {
        console.error("Error: currentCanto no se encontró.");
    }
});
