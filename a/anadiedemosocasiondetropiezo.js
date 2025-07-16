// index.js (o abraham.js en el futuro) - JavaScript específico del canto

// Asumiendo que `allCantosData` está disponible globalmente desde `canto_data.js`
// En un sistema de módulos, usarías: import { allCantosData } from './canto_data.js';

// Define el ID del canto que quieres cargar en esta página
const cantoIdToLoad = "anadiedemosocasiondetropiezo"; // <--- CAMBIA ESTE ID para cargar otro canto

// Busca el canto específico por su ID en la base de datos
const currentCanto = allCantosData.find(canto => canto.id === cantoIdToLoad);

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
        console.error(`Error: El canto con ID "${cantoIdToLoad}" no se encontró en canto_data.js.`);
    }
});
