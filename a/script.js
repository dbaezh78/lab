document.addEventListener('DOMContentLoaded', () => {
    // Este array contiene las líneas de tu canto.
    // Cada entrada es un objeto que puede incluir una clase de sección y un estilo de texto.
    // 'tcss' se usa para estilos de texto (ej. "atx" para negrita). Si no está presente, el texto es normal.
    const cantoData = [
        { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,5)(Re,m,360)", sC: "tc" },
        { line: "hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)" },
        { line: "el sacrificio de alabanza. (Mi,m,12)(Re,m,85)" },
        { line: "Asi habla el amen, el testigo fiel y veras (Do,,8)(Re,m,40)(Mi,7,80)(Do,,120)(Re,m,160)(Mi,7,190)(Sol,7,240)" },
        { line: "HERMANOS, A NADIE DEMOS (Mi,m,12)(Re,m,85)", sC: "ta" },
        { line: "OCASIÓN DE TROPIEZO (Mi,m,12)(Re,m,85)" },
        { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,12)(Re,m,85)" },
        { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,5)(Re,m,360)", sC: "tc" }, // No tiene 'tcss', por defecto será normal
        { line: "HERMANOS, VIVAMOS ACEPTANDO LAS TRIBULACIONES, (Mi,,50)(La,m,363)", sC: "ta", tcss: "atx" }, // Ejemplo con negrita
        { line: "el sacrificio de alabanza. (Mi,m,12)(Re,m,85)" }, // No tiene 'tcss', por defecto será normal
        { line: "Asi habla el amen, el testigo fiel y veras (Do,,8)(Re,m,40)(Mi,7,80)(Do,,120)(Re,m,160)(Mi,7,190)(Sol,7,240)" } // No tiene 'tcss', por defecto será normal
    ];

    const cantoContainer = document.getElementById('canto-container');
    const chordSelectionModal = document.getElementById('chordSelectionModal');
    const chordListContainer = document.getElementById('chordList');

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
            factor: 1.076, // Factor actualizado por el usuario
            // Puedes definir sobrescrituras de posición específicas aquí.
            // Por ejemplo: p5: 10 (si la unidad conceptual 5 debe ser 10px en móvil)
            // p5: 10,
            // p20: 30
        },
        'tablet': { // Para anchos de pantalla entre 768px y 1024px
            minWidth: 768,
            maxWidth: 1024,
            factor: 1.272,
            // p15: 40,
            // p50: 100
        },
        'desktop': { // Para anchos de pantalla > 1024px
            minWidth: 1025,
            maxWidth: Infinity,
            factor: 1.0,
        }
    };

    let parsedCantoData = [];
    let currentKeyOffset = 0;
    let clickedDisplayedNoteSemitone = 0;

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

    const getCurrentPositionConfig = (screenWidth) => {
        if (screenWidth <= positionConfigs.mobile.maxWidth) {
            return positionConfigs.mobile;
        } else if (screenWidth >= positionConfigs.tablet.minWidth && screenWidth <= positionConfigs.tablet.maxWidth) {
            return positionConfigs.tablet;
        } else {
            return positionConfigs.desktop;
        }
    };

    const parseCantoData = () => {
        parsedCantoData = cantoData.map(entry => {
            const lineContent = entry.line;
            const sectionClass = entry.sC || null;
            const textStyleClass = entry.tcss || null; // <--- CAMBIO: Usar 'tcss'

            const firstParenIndex = lineContent.indexOf('(');
            let letra = '';
            let notasRawString = '';

            if (firstParenIndex !== -1) {
                letra = lineContent.substring(0, firstParenIndex).trim();
                if (letra.endsWith(',')) {
                    letra = letra.substring(0, letra.length - 1).trim();
                }
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
            return { letra, notes, sectionClass, textStyleClass }; // <--- CAMBIO: Devolver 'textStyleClass'
        });
    };

    const renderCanto = () => {
        cantoContainer.innerHTML = '';

        parsedCantoData.forEach(lineaParsed => {
            const lineaDiv = document.createElement('div');
            lineaDiv.classList.add('linea-canto');

            if (lineaParsed.sectionClass) {
                lineaDiv.classList.add(lineaParsed.sectionClass);
            }

            const letraSpan = document.createElement('span');
            letraSpan.classList.add('letra');
            letraSpan.textContent = lineaParsed.letra;
            
            // Añadir la clase de estilo de texto SOLO si está definida
            if (lineaParsed.textStyleClass) { // <--- CAMBIO: Comprobar si 'textStyleClass' existe
                letraSpan.classList.add(lineaParsed.textStyleClass);
            }
            // No se añade 'tx' por defecto si no se especifica, ya que el texto normal es el predeterminado del CSS

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
            cantoContainer.appendChild(lineaDiv);
        });
        adjustNotePositions();
    };

    const adjustNotePositions = () => {
        const screenWidth = window.innerWidth;
        const currentConfig = getCurrentPositionConfig(screenWidth);

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

                currentKeyOffset = (currentKeyOffset + semitonesToShift) % cords.length; // Corregido a semitonesToShift
                if (currentKeyOffset < 0) {
                    currentKeyOffset += cords.length;
                }

                renderCanto();
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

    parseCantoData();
    renderCanto();
});
