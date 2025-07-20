// jsgral.js - JavaScript General para todos los cantos

// Definición de los acordes y su mapeo a semitonos (desde Do)
const cords = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "Si♭", "Si"];
// Mapeo de nombres de notas a su índice de semitono (Do=0, Do#=1, etc.)
const noteToSemitone = {};
cords.forEach((note, index) => {
    noteToSemitone[note] = index;
});

// Definición de los factores de escalado y posibles sobrescrituras de posición
const positionConfigs = {
    'mobile': { // Para anchos de pantalla <= 700px (aproximado)
        minWidth: 0, // Aplica desde 0px
        maxWidth: 700,
        factor: 0.734, // Factor actualizado por el usuario
    },
    'tablet': { // Para anchos de pantalla entre 701px y 1024px (ajustado para cubrir el rango)
        minWidth: 701, // Cambiado de 768px para no dejar un hueco
        maxWidth: 1024,
        factor: 1.36,
    },
    'desktop': { // Para anchos de pantalla > 1024px
        minWidth: 1025,
        maxWidth: Infinity,
        factor: 1.0,
    }
};

let currentKeyOffset = 0;
let clickedDisplayedNoteSemitone = 0;

// Referencias a los contenedores del DOM (se inicializarán al cargar el canto)
let cantoLeftContainer;
let cantoRightContainer;
let chordSelectionModal;
let chordListContainer;
let cantoCategoriesContainer; // Nueva referencia para el contenedor de categorías
let cantoContentWrapper; // Nueva referencia para el contenedor principal de las columnas

// Referencias para el control de audio
let cantoAudioPlayer;
let audioControlBtn;
let audioIcon;

// Nuevo: Referencia para el botón "Mostrar toda la asamblea"
let showAllAsambleaBtn;
let showAllAsambleaIcon; // Icono dentro del botón

// Nuevo: Referencia para el botón de alternar vista
let toggleVistaBtn;
let toggleVistaIcon;

// Nuevo: Referencias para la modal de imágenes de acordes
let callNotasBtn; // El botón music_note
let chordImagesModal;
let chordImagesContainer;

// Nuevo: Referencias para la modal de imagen grande
let largeImageModal;
let largeChordImage;

// Nuevo: Mapa para almacenar el estado expandido/colapsado de los bloques
const collapsibleStates = new Map();

// Lista de nombres de archivos de imágenes de acordes
const chordImageFilenames = [
    "do.jpg",
    "dot3.jpg",
    "dom.jpg",
    "do7.jpg",
    "do72.jpg",
    "dos.jpg", 
    "dos7.jpg", 
    "dosm.jpg", 

    "re.jpg",
    "rem.jpg", 
    "re7.jpg", 
    "rem9.jpg", 
    "res.jpg", 
    "res1.jpg", 
    "resm.jpg",

    "mi.jpg",
    "mim.jpg", 
    "mi6.jpg", 
    "mi7.jpg", 
    "mim6.jpg", 
    "mimaj7.jpg", 

    "fa.jpg", 
    "fam.jpg", 
    "fa7.jpg", 
    "famaj7.jpg", 
    "famaj713.jpg", 

    "fas.jpg",
    "fasm.jpg", 
    "fas5-9dim.jpg", 
    "fas7.jpg", 

    "sol.jpg", 
    "sol2.jpg", 
    "sol3.jpg", 
    "solm.jpg", 
    "sol7.jpg", 

    "sols.jpg", 
    "solsm.jpg",
    "sols7.jpg", 

    "la.jpg", 
    "la2.jpg", 
    "la3.jpg", 
    "la6.jpg",
    "la7.jpg", 
    "lab.jpg", 
    "lam.jpg", 
    "lam6.jpg", 
    "lam7.jpg", 
    
    

    "si.jpg", 
    "si7.jpg", 
    "si72.jpg", 
    "sib.jpg", 
    "sib7.jpg", 
    "sibm.jpg", 
    "sim.jpg",

];
const IMAGE_BASE_PATH = "/cantos/src/ima/";

// Variables para el scroll automático
let scrollSpeed = 200; // Velocidad de desplazamiento en píxeles por segundo (valor por defecto)
let scrollIncrement = 1; // Cantidad de píxeles a desplazar en cada paso (valor por defecto)
let isScrolling = false;
let scrollInterval;
let startScrollBtn; // Referencia al botón de scroll
let scrollIcon; // Referencia al icono del botón de scroll


// Función para obtener el nombre legible del acorde a partir del nombre del archivo
const getDisplayNameFromFilename = (filename) => {
    let name = filename.split('.')[0];
    // Reemplazar 's' por '#' para sostenidos (ej. 'dos' -> 'Do#')
    name = name.replace(/s$/, '#');
    name = name.replace(/s7$/, '#7');
    name = name.replace(/2$/, '');
    name = name.replace(/sm$/, '#m');
    name = name.replace(/t3$/, '');
    name = name.replace(/s1$/, '#');
    name = name.replace(/s5$/, '#5 Traste');
    name = name.replace(/s7$/, '#7 Traste');
    name = name.replace(/s5-9dim$/, '#5-9dim');
    name = name.replace(/sib$/, 'si♭');
    name = name.replace(/sib7$/, 'si♭7');
    name = name.replace(/sibm$/, 'si♭m');
    name = name.replace(/sol2$/, 'sol');
    name = name.replace(/sol3$/, 'sol');
    name = name.replace(/la3$/, 'la');
    // Reemplazar 'b' por '♭' para bemoles (ej. 'sib' -> 'Si♭')
    name = name.replace(/b$/, '♭');

    // Capitalizar la primera letra
    if (name.length > 0) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
};


// Función para transponer una nota
const transposeNote = (originalNote, semitoneDifference) => {
    const originalSemitone = noteToSemitone[originalNote];
    if (originalSemitone === undefined) {
        return originalNote;
    }
    let newSemitone = (originalSemitone + semitoneDifference) % cords.length;
    if (newSemitone < 0) {
        newSemitone += cords.length;
    }
    return cords[newSemitone];
};

// Función para obtener la configuración de posición actual basada en el ancho de la pantalla
const getCurrentPositionConfig = (screenWidth) => {
    if (screenWidth <= positionConfigs.mobile.maxWidth) {
        return positionConfigs.mobile;
    } else if (screenWidth >= positionConfigs.tablet.minWidth && screenWidth <= positionConfigs.tablet.maxWidth) {
        return positionConfigs.tablet;
    } else {
        return positionConfigs.desktop;
    }
};

// Función para obtener el tipo de dispositivo basado en el ancho de la pantalla
const getDeviceType = (screenWidth) => {
    if (screenWidth <= positionConfigs.mobile.maxWidth) {
        return 'mobile';
    } else if (screenWidth >= positionConfigs.tablet.minWidth && screenWidth <= positionConfigs.tablet.maxWidth) {
        return 'tablet';
    } else {
        return 'desktop'; // Podrías considerar un valor por defecto o 'desktop' para otros casos
    }
};

// Función auxiliar para parsear una sola línea de canto (letra y notas)
const parseSingleLineData = (lineContent, sectionClass = null, textStyleClass = null) => {
    const firstParenIndex = lineContent.indexOf('(');
    let letra = '';
    let notasRawString = '';

    if (firstParenIndex !== -1) {
        letra = lineContent.substring(0, firstParenIndex).trim();
        // Eliminar comas al final si existen
        if (letra.endsWith(',')) {
            letra = letra.substring(0, letra.length - 1).trim();
        }
        // Eliminar comillas si la letra está entre comillas
        if (letra.startsWith('"') && letra.endsWith('"')) {
            letra = letra.substring(1, letra.length - 1);
        }
        notasRawString = lineContent.substring(firstParenIndex);
    } else {
        letra = lineContent.trim();
    }

    const notes = [];
    if (notasRawString) {
        const noteBlockMatches = notasRawString.match(/\(([^)]+)\)/g);
        if (noteBlockMatches) {
            noteBlockMatches.forEach(noteBlock => {
                const content = noteBlock.substring(1, noteBlock.length - 1);
                const parts = content.split(',');
                const noteName = parts[0].trim();
                const noteType = parts[1] ? parts[1].trim() : '';
                const conceptualPositionUnit = parseFloat(parts[2]);
                notes.push({
                    originalNote: noteName,
                    type: noteType,
                    conceptualPositionUnit: conceptualPositionUnit
                });
            });
        }
    }
    return { letra, notes, sectionClass, textStyleClass };
};


// Función para parsear una sección del canto (lizq o lder), incluyendo bloques colapsables
const parseCantoSectionData = (cantoSectionData) => {
    return cantoSectionData.map(entry => {
        if (entry.type === "collapsible-block") {
            // Es un bloque colapsable
            return {
                type: "collapsible-block",
                id: entry.id,
                initialState: entry.initialState || "collapsed", // Default a colapsado
                triggerLine: parseSingleLineData(entry.triggerLine, entry.sC, entry.tcss), // Parsear la línea del disparador
                lines: entry.lines.map(lineEntry => parseSingleLineData(lineEntry.line, lineEntry.sC, lineEntry.tcss)) // Parsear todas las líneas internas
            };
        } else {
            // Es una línea normal
            return parseSingleLineData(entry.line, entry.sC, entry.tcss);
        }
    });
};

// Función auxiliar para renderizar una línea de canto ya parseada
const renderParsedLine = (lineaParsed) => {
    const lineaDiv = document.createElement('div');
    lineaDiv.classList.add('linea-canto');

    if (lineaParsed.sectionClass) {
        lineaParsed.sectionClass.split(' ').forEach(cls => {
            if (cls) {
                lineaDiv.classList.add(cls);
            }
        });
    }

    const letraSpan = document.createElement('span');
    letraSpan.classList.add('letra');
    letraSpan.textContent = lineaParsed.letra;
    // Almacenar el texto original limpio para los disparadores colapsables
    letraSpan.dataset.originalText = lineaParsed.letra;
    
    if (lineaParsed.textStyleClass) {
        letraSpan.classList.add(lineaParsed.textStyleClass);
    }

    lineaDiv.appendChild(letraSpan);

    lineaParsed.notes.forEach(noteInfo => {
        const noteSpan = document.createElement('span');
        noteSpan.classList.add('nota-posicionada');

        const transposedNoteName = transposeNote(noteInfo.originalNote, currentKeyOffset);
        noteSpan.textContent = transposedNoteName + noteInfo.type;

        noteSpan.dataset.originalNote = noteInfo.originalNote;
        noteSpan.dataset.conceptualPositionUnit = noteInfo.conceptualPositionUnit;

        noteSpan.addEventListener('click', () => {
            openChordSelectionModal(transposedNoteName);
        });

        lineaDiv.appendChild(noteSpan);
    });
    return lineaDiv;
};


// Función para renderizar una sección específica del canto en un contenedor
const renderCantoSection = (container, parsedData) => {
    container.innerHTML = ''; // Limpiar contenido del contenedor

    parsedData.forEach(entry => {
        if (entry.type === "collapsible-block") {
            // Es un bloque colapsable
            const blockContainer = document.createElement('div');
            blockContainer.classList.add('collapsible-block-container');
            blockContainer.dataset.blockId = entry.id;

            const triggerDiv = renderParsedLine(entry.triggerLine); // Renderizar el disparador
            triggerDiv.classList.add('collapsible-trigger');
            triggerDiv.dataset.blockId = entry.id; // Para referencia

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('collapsible-content');
            contentDiv.dataset.blockId = entry.id; // Para referencia

            // Renderizar las líneas internas del bloque
            entry.lines.forEach(linea => {
                contentDiv.appendChild(renderParsedLine(linea));
            });

            const triggerLetraSpan = triggerDiv.querySelector('.letra');

            // Determinar el estado actual del bloque: si ya está en el mapa, usar ese estado; si no, usar el estado inicial
            let isCurrentlyExpanded = collapsibleStates.has(entry.id) ? collapsibleStates.get(entry.id) : (entry.initialState === "expanded");
            triggerDiv.dataset.isExpanded = isCurrentlyExpanded.toString();

            // Aplicar el display y el texto del disparador según el estado
            if (isCurrentlyExpanded) {
                contentDiv.style.display = ''; // Mostrar
                triggerLetraSpan.textContent = triggerLetraSpan.dataset.originalText; // Asegurarse de que no tenga "..."
            } else {
                contentDiv.style.display = 'none'; // Ocultar
                if (!triggerLetraSpan.textContent.endsWith(' ...')) {
                    triggerLetraSpan.textContent += ' ...'; // Añadir "..."
                }
                triggerDiv.dataset.isExpanded = "false";
                collapsibleStates.set(entry.id, false); // Guardar estado
            }

            // Lógica para el toggle
            triggerDiv.addEventListener('click', () => {
                const wasExpanded = contentDiv.style.display !== 'none';
                if (wasExpanded) {
                    contentDiv.style.display = 'none';
                    if (!triggerLetraSpan.textContent.endsWith(' ...')) {
                        triggerLetraSpan.textContent += ' ...';
                    }
                    triggerDiv.dataset.isExpanded = "false";
                    collapsibleStates.set(entry.id, false); // Guardar estado
                } else {
                    contentDiv.style.display = ''; // Mostrar
                    triggerLetraSpan.textContent = triggerLetraSpan.dataset.originalText; // Restaurar texto original
                    triggerDiv.dataset.isExpanded = "true";
                    collapsibleStates.set(entry.id, true); // Guardar estado
                }
                updateShowAllAsambleaIcon(); // Actualizar el icono del botón de asamblea
            });

            blockContainer.appendChild(triggerDiv);
            blockContainer.appendChild(contentDiv);
            container.appendChild(blockContainer);

        } else {
            // Es una línea normal
            container.appendChild(renderParsedLine(entry));
        }
    });
};

// Función principal para renderizar todo el canto
const renderCanto = () => {
    console.log("Rendering canto sections...");
    renderCantoSection(cantoLeftContainer, currentCantoData.lizq);
    renderCantoSection(cantoRightContainer, currentCantoData.lder);
    adjustNotePositions(); // Ajustar posiciones después de renderizar ambos lados
    console.log("Canto rendering complete.");
};

const adjustNotePositions = () => {
    const screenWidth = window.innerWidth;
    const currentConfig = getCurrentPositionConfig(screenWidth);

    // Ajustar notas en ambos contenedores
    document.querySelectorAll('.linea-canto').forEach(lineaDiv => {
        lineaDiv.querySelectorAll('.nota-posicionada').forEach(notaSpan => {
            const conceptualPositionUnit = parseFloat(notaSpan.dataset.conceptualPositionUnit);
            let adjustedPosition = conceptualPositionUnit;

            const overrideKey = `p${conceptualPositionUnit}`;
            if (currentConfig[overrideKey] !== undefined) {
                adjustedPosition = currentConfig[overrideKey];
            } else {
                adjustedPosition = conceptualPositionUnit * currentConfig.factor;
            }

            notaSpan.style.left = `${adjustedPosition}px`;
        });
    });
};

const openChordSelectionModal = (currentDisplayedNoteClicked) => {
    clickedDisplayedNoteSemitone = noteToSemitone[currentDisplayedNoteClicked];
    chordListContainer.innerHTML = '';

    cords.forEach(chord => {
        const chordItem = document.createElement('div');
        chordItem.classList.add('chord-item');
        chordItem.textContent = chord;
        chordItem.addEventListener('click', () => {
            const selectedChordFromModalSemitone = noteToSemitone[chord];
            const semitonesToShift = selectedChordFromModalSemitone - clickedDisplayedNoteSemitone;

            currentKeyOffset = (currentKeyOffset + semitonesToShift) % cords.length;
            if (currentKeyOffset < 0) {
                currentKeyOffset += cords.length;
            }

            renderCanto(); // Esto ahora preservará el estado de los colapsables
            chordSelectionModal.style.display = 'none';
            updateShowAllAsambleaIcon(); // Actualizar el icono del botón de asamblea
        });
        chordListContainer.appendChild(chordItem);
    });
    chordSelectionModal.style.display = 'flex';
};

// Nueva función para abrir la modal de imágenes de acordes
const openChordImagesModal = () => {
    if (!chordImagesContainer) {
        console.error("Error: #chordImageList no encontrado.");
        return;
    }
    chordImagesContainer.innerHTML = ''; // Limpiar contenido previo

    chordImageFilenames.forEach(filename => {
        const chordName = getDisplayNameFromFilename(filename); // Usar la nueva función
        const chordImageItem = document.createElement('div');
        chordImageItem.classList.add('chord-image-item');

        // Determinar la nota base para la clase de color
        let baseNoteForColor = chordName.replace(/[#♭m79]/g, ''); // Eliminar #, ♭, m, 7, 9 para obtener la nota base (Do, Re, Mi, etc.)
        baseNoteForColor = baseNoteForColor.toLowerCase(); // Convertir a minúsculas para la clase CSS

        // Añadir una clase basada en la nota base para el estilo de color
        chordImageItem.classList.add(`chord-color-${baseNoteForColor}`);

        const img = document.createElement('img');
        img.src = IMAGE_BASE_PATH + filename;
        img.alt = chordName; // Texto alternativo para accesibilidad
        // Manejo de error para imágenes no encontradas
        img.onerror = () => {
            console.warn(`No se pudo cargar la imagen: ${img.src}`);
            img.style.display = 'none'; // Ocultar la imagen si no se carga
        };

        const nameSpan = document.createElement('span');
        nameSpan.textContent = chordName;

        // Añadir event listener para abrir la imagen grande
        chordImageItem.addEventListener('click', () => {
            openLargeImageModal(img.src, chordName);
        });

        chordImageItem.appendChild(img);
        chordImageItem.appendChild(nameSpan);
        chordImagesContainer.appendChild(chordImageItem);
    });

    chordImagesModal.style.display = 'flex'; // Mostrar la modal
};

// Nueva función para abrir la modal de imagen grande
const openLargeImageModal = (imageSrc, imageName) => {
    if (!largeImageModal || !largeChordImage) {
        console.error("Error: Elementos de la modal de imagen grande no encontrados.");
        return;
    }
    largeChordImage.src = imageSrc;
    largeChordImage.alt = imageName;
    largeImageModal.style.display = 'flex'; // Mostrar la modal de imagen grande
};

// Función para cerrar la modal de imágenes de acordes
const closeChordImagesModal = () => {
    chordImagesModal.style.display = 'none';
};

// Función para cerrar la modal de imagen grande
const closeLargeImageModal = () => {
    largeImageModal.style.display = 'none';
};


let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustNotePositions, 100);
});

// Función para renderizar las categorías como enlaces
const renderCategories = (categoriesWithUrls) => {
    if (!cantoCategoriesContainer) {
        console.error("Error: cantoCategoriesContainer no se encontró en el DOM.");
        return;
    }
    cantoCategoriesContainer.innerHTML = '';

    categoriesWithUrls.forEach(catInfo => {
        const categoryLink = document.createElement('a');
        categoryLink.href = catInfo.url;
        categoryLink.textContent = catInfo.name;
        categoryLink.classList.add('category-link');
        cantoCategoriesContainer.appendChild(categoryLink);
    });
    console.log("Categories rendered:", categoriesWithUrls);
};

// Función para verificar si todos los bloques de asamblea están expandidos
const areAllAssemblyBlocksExpanded = () => {
    // Obtener todos los bloques colapsables que tienen un ID que comienza con "asamblea_"
    const assemblyBlocks = document.querySelectorAll('.collapsible-block-container[data-block-id^="asamblea_"]');
    if (assemblyBlocks.length === 0) return false; // Si no hay bloques de asamblea, consideramos que no todos están expandidos

    for (const block of assemblyBlocks) {
        const blockId = block.dataset.blockId;
        // Si el estado del bloque no está en el mapa o es false (colapsado), entonces no todos están expandidos
        if (!collapsibleStates.has(blockId) || !collapsibleStates.get(blockId)) {
            return false;
        }
    }
    return true; // Todos los bloques de asamblea están expandidos
};

// Función para actualizar el icono del botón "Mostrar toda la asamblea"
const updateShowAllAsambleaIcon = () => {
    if (showAllAsambleaIcon) {
        const allExpanded = areAllAssemblyBlocksExpanded();
        // Si todos están expandidos, el botón debería ofrecer la opción de colapsar (visibility_off)
        // Si no todos están expandidos (alguno o todos colapsados), el botón debería ofrecer la opción de expandir (visibility)
        showAllAsambleaIcon.textContent = allExpanded ? 'visibility_off' : 'visibility';
    }
};

// Función para actualizar el icono del botón de alternar vista
const updateToggleVistaIcon = () => {
    if (toggleVistaIcon && cantoContentWrapper) {
        // Comprobar la dirección actual del flexbox
        const isStacked = cantoContentWrapper.classList.contains('stacked-layout');
        toggleVistaIcon.textContent = isStacked ? 'view_agenda' : 'menu_book';
    }
};

// Declaración global de currentCantoData
// Es crucial que esta variable se declare una sola vez en el ámbito global.
// Su valor inicial se establecerá en initializeCantoPage.
let currentCantoData = { lizq: [], lder: [] };


// Función de inicialización que será llamada desde cada archivo de canto
const initializeCantoPage = (cantoSpecificData, processedCategories) => {
    console.log("Initializing canto page with data:", cantoSpecificData);
    // Asignar referencias a los elementos del DOM
    cantoLeftContainer = document.getElementById('canto-left-container');
    cantoRightContainer = document.getElementById('canto-right-container');
    chordSelectionModal = document.getElementById('chordSelectionModal');
    chordListContainer = document.getElementById('chordList');
    cantoCategoriesContainer = document.getElementById('cantoCategories');
    cantoContentWrapper = document.querySelector('.canto-content-wrapper'); // Obtener el wrapper

    // Referencias para el control de audio
    cantoAudioPlayer = document.getElementById('cantoAudioPlayer');
    audioControlBtn = document.getElementById('audio-control-btn');
    audioIcon = audioControlBtn ? audioControlBtn.querySelector('.audio-icon') : null;

    // Referencias para el nuevo botón de asamblea
    showAllAsambleaBtn = document.getElementById('showAllAsambleaBtn');
    showAllAsambleaIcon = showAllAsambleaBtn ? showAllAsambleaBtn.querySelector('.material-symbols-outlined') : null;

    // Referencias para el botón de alternar vista
    toggleVistaBtn = document.getElementById('toggleVista');
    toggleVistaIcon = toggleVistaBtn ? toggleVistaBtn.querySelector('.material-symbols-outlined') : null;

    // Referencias para la modal de imágenes de acordes
    callNotasBtn = document.getElementById('CallNotas');
    chordImagesModal = document.getElementById('chordImagesModal');
    chordImagesContainer = document.getElementById('chordImageList');

    // Referencias para la modal de imagen grande
    largeImageModal = document.getElementById('largeImageModal');
    largeChordImage = document.getElementById('largeChordImage');

    // Referencias para el scroll automático
    startScrollBtn = document.getElementById('startScroll');
    scrollIcon = startScrollBtn ? startScrollBtn.querySelector('.scroll-icon') : null;


    // Verificar si los contenedores del canto se encontraron
    if (!cantoLeftContainer) console.error("Error: #canto-left-container no encontrado.");
    if (!cantoRightContainer) console.error("Error: #canto-right-container no encontrado.");
    if (!chordSelectionModal) console.error("Error: #chordSelectionModal no encontrado.");
    if (!chordListContainer) console.error("Error: #chordList no encontrado.");
    if (!cantoCategoriesContainer) console.error("Error: #cantoCategories no encontrado.");
    if (!cantoAudioPlayer) console.error("Error: #cantoAudioPlayer no encontrado.");
    if (!audioControlBtn) console.error("Error: #audio-control-btn no encontrado.");
    if (!audioIcon) console.error("Error: .audio-icon no encontrado dentro de #audio-control-btn.");
    if (!showAllAsambleaBtn) console.error("Error: #showAllAsambleaBtn no encontrado.");
    if (!showAllAsambleaIcon) console.error("Error: .material-symbols-outlined no encontrado dentro de #showAllAsambleaBtn.");
    if (!toggleVistaBtn) console.error("Error: #toggleVista no encontrado.");
    if (!toggleVistaIcon) console.error("Error: .material-symbols-outlined no encontrado dentro de #toggleVista.");
    if (!cantoContentWrapper) console.error("Error: .canto-content-wrapper no encontrado.");
    if (!callNotasBtn) console.error("Error: #CallNotas no encontrado.");
    if (!chordImagesModal) console.error("Error: #chordImagesModal no encontrado.");
    if (!chordImagesContainer) console.error("Error: #chordImageList no encontrado.");
    if (!largeImageModal) console.error("Error: #largeImageModal no encontrado.");
    if (!largeChordImage) console.error("Error: #largeChordImage no encontrado.");
    if (!startScrollBtn) console.error("Error: #startScroll no encontrado.");
    if (!scrollIcon) console.error("Error: .scroll-icon no encontrado dentro de #startScroll.");


    // Actualizar los títulos y subtítulos del canto
    const dbt1Element = document.querySelector('.dbt1');
    const dbs2Element = document.querySelector('.dbs2');
    const dbnoElement = document.getElementById('dbno');
    const nCanElement = document.getElementById('nCan');

    if (dbt1Element) dbt1Element.textContent = cantoSpecificData.title;
    else console.error("Error: Elemento con clase .dbt1 no encontrado.");

    if (dbs2Element) dbs2Element.textContent = cantoSpecificData.subtitle;
    else console.error("Error: Elemento con clase .dbs2 no encontrado.");

    if (dbnoElement) dbnoElement.textContent = cantoSpecificData.dbno;
    else console.error("Error: Elemento con ID #dbno no encontrado.");
    
    if (nCanElement) nCanElement.textContent = cantoSpecificData.nCan;
    else console.error("Error: Elemento con ID #nCan no encontrado.");
    
    // Actualizar el título de la pestaña del navegador (la etiqueta <title>)
    const pageTitleElement = document.getElementById('tt');
    if (pageTitleElement && cantoSpecificData.tt) {
        pageTitleElement.textContent = cantoSpecificData.tt;
    } else if (!pageTitleElement) {
        console.error("Error: Elemento con ID #tt no encontrado.");
    }

    // Configurar el reproductor de audio
    if (cantoAudioPlayer && cantoSpecificData.audioSrc) {
        cantoAudioPlayer.src = cantoSpecificData.audioSrc;
        cantoAudioPlayer.load(); // Cargar el nuevo audio
        cantoAudioPlayer.style.display = 'none'; // Asegurarse de que esté oculto al inicio
        if (audioIcon) {
            audioIcon.textContent = 'play_circle'; // Asegurarse de que el icono sea de reproducción
        }
    } else if (cantoAudioPlayer) {
        // Si no hay audioSrc para el canto actual, ocultar el reproductor y el botón
        cantoAudioPlayer.style.display = 'none';
        if (audioControlBtn) audioControlBtn.style.display = 'none';
    } else if (audioControlBtn) {
        // Si no hay reproductor de audio, ocultar el botón de control
        audioControlBtn.style.display = 'none';
    }


    // Event listener para el botón de control de audio
    if (audioControlBtn && cantoAudioPlayer) {
        audioControlBtn.onclick = (event) => {
            event.preventDefault(); // Evitar el comportamiento por defecto del enlace
            if (cantoAudioPlayer.paused) {
                cantoAudioPlayer.play();
                cantoAudioPlayer.style.display = 'block'; // Mostrar el reproductor
                if (audioIcon) audioIcon.textContent = 'pause_circle'; // Cambiar a icono de pausa
            } else {
                cantoAudioPlayer.pause();
                cantoAudioPlayer.style.display = 'none'; // Ocultar el reproductor
                if (audioIcon) audioIcon.textContent = 'play_circle'; // Cambiar a icono de reproducción
            }
        };

        // Event listener para cuando el audio termina
        cantoAudioPlayer.onended = () => {
            cantoAudioPlayer.style.display = 'none'; // Ocultar el reproductor
            if (audioIcon) audioIcon.textContent = 'play_circle'; // Cambiar a icono de reproducción
        };
    }

    // Lógica para el botón "Mostrar toda la asamblea"
    if (showAllAsambleaBtn && showAllAsambleaIcon) {
        showAllAsambleaBtn.onclick = (event) => {
            event.preventDefault();
            const allCurrentlyExpanded = areAllAssemblyBlocksExpanded();
            const targetState = !allCurrentlyExpanded; // Si todos están expandidos, colapsar; si no, expandir

            document.querySelectorAll('.collapsible-block-container[data-block-id^="asamblea_"]').forEach(blockContainer => {
                const blockId = blockContainer.dataset.blockId;
                const contentDiv = blockContainer.querySelector('.collapsible-content');
                const triggerDiv = blockContainer.querySelector('.collapsible-trigger');
                const triggerLetraSpan = triggerDiv.querySelector('.letra');

                if (targetState) { // Expandir
                    contentDiv.style.display = '';
                    triggerLetraSpan.textContent = triggerLetraSpan.dataset.originalText;
                    triggerDiv.dataset.isExpanded = "true";
                    collapsibleStates.set(blockId, true);
                } else { // Colapsar
                    contentDiv.style.display = 'none';
                    if (!triggerLetraSpan.textContent.endsWith(' ...')) {
                        triggerLetraSpan.textContent += ' ...';
                    }
                    triggerDiv.dataset.isExpanded = "false";
                    collapsibleStates.set(blockId, false);
                }
            });
            // Actualizar el icono del botón principal después de la acción
            updateShowAllAsambleaIcon();
        };

        // Efecto hover para el icono del ojo
        showAllAsambleaBtn.addEventListener('mouseover', () => {
            const allCurrentlyExpanded = areAllAssemblyBlocksExpanded();
            // Si todos están expandidos, al pasar el ratón se sugiere "visibility" (para colapsar al hacer clic)
            // Si no todos están expandidos, al pasar el ratón se sugiere "visibility_off" (para expandir al hacer clic)
            showAllAsambleaIcon.textContent = allCurrentlyExpanded ? 'visibility' : 'visibility_off';
        });

        showAllAsambleaBtn.addEventListener('mouseout', () => {
            // Al quitar el ratón, el icono vuelve a su estado normal (indicando la acción actual)
            updateShowAllAsambleaIcon();
        });
    }

    // Lógica para el botón de alternar vista (menu_book)
    if (toggleVistaBtn && toggleVistaIcon && cantoContentWrapper) {
        toggleVistaBtn.onclick = (event) => {
            event.preventDefault();
            // Solo aplicar el cambio si la pantalla es de escritorio
            if (window.innerWidth >= 992) {
                cantoContentWrapper.classList.toggle('stacked-layout');
                updateToggleVistaIcon(); // Actualizar icono después de alternar la clase
            }
        };
        // Inicializar el icono de la vista al cargar
        updateToggleVistaIcon();
    }

    // Lógica para el botón de mostrar imágenes de acordes (music_note)
    if (callNotasBtn) {
        callNotasBtn.onclick = (event) => {
            event.preventDefault();
            openChordImagesModal();
        };
    }

    // Lógica para cerrar la modal de imágenes de acordes al hacer clic fuera
    if (chordImagesModal) {
        chordImagesModal.addEventListener('click', (event) => {
            if (event.target === chordImagesModal) {
                closeChordImagesModal();
            }
        });
        // Lógica para cerrar la modal de imágenes de acordes al presionar 'Escape'
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && chordImagesModal.style.display === 'flex') {
                closeChordImagesModal();
            }
        });
    }

    // Lógica para cerrar la modal de imagen grande al hacer clic fuera
    if (largeImageModal) {
        largeImageModal.addEventListener('click', (event) => {
            if (event.target === largeImageModal) {
                closeLargeImageModal();
            }
        });
        // Lógica para cerrar la modal de imagen grande al presionar 'Escape'
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && largeImageModal.style.display === 'flex') {
                closeLargeImageModal();
            }
        });
    }

    // Lógica para el scroll automático
    if (startScrollBtn && scrollIcon) {
        // Determinar el tipo de dispositivo actual
        const deviceType = getDeviceType(window.innerWidth);
        let selectedScrollConfig = null;

        if (cantoSpecificData.scrollConfig) {
            selectedScrollConfig = cantoSpecificData.scrollConfig[deviceType];
        }

        if (selectedScrollConfig) {
            scrollSpeed = selectedScrollConfig.velocidad;
            scrollIncrement = selectedScrollConfig.incremento;
        } else {
            console.warn(`No se encontró configuración de scroll para ${deviceType}. Usando valores por defecto.`);
            // scrollSpeed y scrollIncrement ya tienen valores por defecto definidos globalmente.
        }

        startScrollBtn.onclick = (event) => {
            event.preventDefault();
            if (isScrolling) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        };
    }

    // Función para iniciar el scroll automático
    const startAutoScroll = () => {
        if (isScrolling) return; // Evitar iniciar múltiples intervalos

        isScrolling = true;
        scrollIcon.textContent = 'pause'; // Cambiar icono a pausa
        
        // Calcular el tiempo de intervalo para la velocidad deseada
        // (1000 ms / scrollSpeed pixels/sec) * scrollIncrement pixels/step
        const intervalTime = (1000 / scrollSpeed) * scrollIncrement; 

        scrollInterval = setInterval(() => {
            window.scrollBy(0, scrollIncrement); // Desplazar hacia abajo
            // Detener el scroll si llegamos al final de la página
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                stopAutoScroll();
            }
        }, intervalTime);
    };

    // Función para detener el scroll automático
    const stopAutoScroll = () => {
        if (!isScrolling) return; // No hay scroll para detener

        isScrolling = false;
        scrollIcon.textContent = 'south'; // Cambiar icono a flecha abajo
        clearInterval(scrollInterval);
    };


    // Parsear y almacenar los datos del canto actual
    // Asegurarse de que currentCantoData sea un objeto válido antes de intentar asignar propiedades.
    // Esto es una medida defensiva si por alguna razón la declaración global no se procesara a tiempo.
    if (typeof currentCantoData === 'undefined' || currentCantoData === null) {
        console.warn("currentCantoData no está definido o es nulo al inicio de initializeCantoPage, inicializando.");
        currentCantoData = { lizq: [], lder: [] };
    }
    currentCantoData.lizq = parseCantoSectionData(cantoSpecificData.lizq);
    currentCantoData.lder = parseCantoSectionData(cantoSpecificData.lder);
    console.log("Parsed canto data (lizq):", currentCantoData.lizq);
    console.log("Parsed canto data (lder):", currentCantoData.lder);


    renderCanto(); // Renderizar el canto inicialmente
    updateShowAllAsambleaIcon(); // Establecer el icono inicial del botón de asamblea
    updateToggleVistaIcon(); // Establecer el icono inicial del botón de vista

    // Renderizar las categorías
    if (processedCategories && Array.isArray(processedCategories)) {
        renderCategories(processedCategories);
    } else {
        console.warn("Advertencia: No se proporcionaron categorías procesadas o no es un array.");
    }
};
