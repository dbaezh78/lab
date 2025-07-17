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
    'tablet': { // Para anchos de pantalla entre 768px y 1024px
        minWidth: 768,
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
let currentCantoData = { lizq: [], lder: [] }; // Almacenará los datos del canto cargado actualmente

// Referencias para el control de audio
let cantoAudioPlayer;
let audioControlBtn;
let audioIcon;

// Nuevo: Mapa para almacenar el estado expandido/colapsado de los bloques
const collapsibleStates = new Map();

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
        });
        chordListContainer.appendChild(chordItem);
    });
    chordSelectionModal.style.display = 'flex';
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


// Función de inicialización que será llamada desde cada archivo de canto
const initializeCantoPage = (cantoSpecificData, processedCategories) => {
    console.log("Initializing canto page with data:", cantoSpecificData);
    // Asignar referencias a los elementos del DOM
    cantoLeftContainer = document.getElementById('canto-left-container');
    cantoRightContainer = document.getElementById('canto-right-container');
    chordSelectionModal = document.getElementById('chordSelectionModal');
    chordListContainer = document.getElementById('chordList');
    cantoCategoriesContainer = document.getElementById('cantoCategories');

    // Referencias para el control de audio
    cantoAudioPlayer = document.getElementById('cantoAudioPlayer');
    audioControlBtn = document.getElementById('audio-control-btn');
    audioIcon = audioControlBtn ? audioControlBtn.querySelector('.audio-icon') : null;


    // Verificar si los contenedores del canto se encontraron
    if (!cantoLeftContainer) console.error("Error: #canto-left-container no encontrado.");
    if (!cantoRightContainer) console.error("Error: #canto-right-container no encontrado.");
    if (!chordSelectionModal) console.error("Error: #chordSelectionModal no encontrado.");
    if (!chordListContainer) console.error("Error: #chordList no encontrado.");
    if (!cantoCategoriesContainer) console.error("Error: #cantoCategories no encontrado.");
    if (!cantoAudioPlayer) console.error("Error: #cantoAudioPlayer no encontrado.");
    if (!audioControlBtn) console.error("Error: #audio-control-btn no encontrado.");
    if (!audioIcon) console.error("Error: .audio-icon no encontrado dentro de #audio-control-btn.");


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


    // Parsear y almacenar los datos del canto actual
    currentCantoData.lizq = parseCantoSectionData(cantoSpecificData.lizq);
    currentCantoData.lder = parseCantoSectionData(cantoSpecificData.lder);
    console.log("Parsed canto data (lizq):", currentCantoData.lizq);
    console.log("Parsed canto data (lder):", currentCantoData.lder);


    renderCanto(); // Renderizar el canto inicialmente

    // Renderizar las categorías
    if (processedCategories && Array.isArray(processedCategories)) {
        renderCategories(processedCategories);
    } else {
        console.warn("Advertencia: No se proporcionaron categorías procesadas o no es un array.");
    }
};
