// index.js - JavaScript específico del canto para la página principal

// Asumiendo que `allCantosData` está disponible globalmente desde `canto_data.js`
// En un sistema de módulos, usarías: import { allCantosData } from './canto_data.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired.");

    // 1. Obtener el parámetro 'canto' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const cantoIdFromUrl = urlParams.get('canto');

    // 2. Definir el ID del canto a cargar
    // Si hay un ID en la URL, úsalo; de lo contrario, usa "victima_pascual" como predeterminado
    const cantoIdToLoad = cantoIdFromUrl || "victima_pascual"; 

    // 3. Busca el canto específico por su ID en la base de datos
    const currentCanto = allCantosData.find(canto => canto.id === cantoIdToLoad);

    if (currentCanto) {
        console.log("Canto found:", currentCanto.title);
        // Procesar las categorías para incluir sus URLs
        const processedCategories = currentCanto.category.map(catName => {
            // Aquí defines la lógica para generar la URL de cada categoría.
            // Por ejemplo, convertir "Pascua" a "/categorias/pascua.html"
            const categoryUrl = `/categorias/${catName.toLowerCase().replace(/\s/g, '-')}.html`;
            return { name: catName, url: categoryUrl };
        });
        console.log("Processed categories:", processedCategories);

        // Llamar a la función de inicialización del JS general, pasándole los datos del canto
        // y las categorías procesadas.
        if (typeof initializeCantoPage === 'function') {
            initializeCantoPage(currentCanto, processedCategories);
        } else {
            console.error("Error: initializeCantoPage no está definida. Asegúrate de que jsgral.js se cargue correctamente.");
        }
    } else {
        console.error(`Error: El canto con ID "${cantoIdToLoad}" no se encontró en canto_data.js. Verifica el ID y el contenido de canto_data.js.`);
        // Opcional: Mostrar un mensaje al usuario si el canto no se encuentra
        document.querySelector('.dbt1').textContent = "Canto no encontrado";
        document.querySelector('.dbs2').textContent = "Verifica la URL o el ID del canto.";
        document.getElementById('canto-left-container').innerHTML = "<p>Lo sentimos, el canto solicitado no existe.</p>";
        document.getElementById('canto-right-container').innerHTML = "";
        document.getElementById('cantoCategories').innerHTML = "";
        document.getElementById('dbno').textContent = "";
        document.getElementById('tt').textContent = "Canto no encontrado";
    }
});