/***********************
 * DATOS DEL CANTO
 ***********************/
const partitura = {
    titulo: "AMO AL SEÑOR",
    salmo: "Salmo 116 (114-115)",
    dbnos: "18",

    // Estructura para Asamblea (texto y acordes separados)
    asamblea: [
        "RECOBRA, ALMA MÍA, TU REPOSO,",
        "PORQUE EL SEÑOR FUE BUENO CONTIGO.",
        "ÉL TE HA LIBRADO DE LA MUERTE.",
        "HA PRESERVADO TUS PIES, DE LA CAÍDA.",
        "RECOBRA, ALMA MÍA, TU REPOSO,",
        "PORQUE EL SEÑOR FUE BUENO CONTIGO.",
        "ÉL TE HA LIBRADO DE LA MUERTE.",
        "HA PRESERVADO TUS PIES, DE LA CAÍDA."
    ],

    asambleaAcordes: [
        [
            { acorde: "Sol", posicion: 0, base: "Sol", extension: "" },
            { acorde: "Do7", posicion: 180, base: "Do", extension: "7" }
        ],
        [
            { acorde: "Re", posicion: 0, base: "Re", extension: "" },
            { acorde: "Sol", posicion: 160, base: "Sol", extension: "" }
        ],
        [
            { acorde: "Lam", posicion: 10, base: "La", extension: "m" },
            { acorde: "Re", posicion: 150, base: "Re", extension: "" }
        ],
        [
            { acorde: "Mim6", posicion: 20, base: "Mi", extension: "m6" },
            { acorde: "La7", posicion: 170, base: "La", extension: "7" }
        ],
        [
            { acorde: "Sol", posicion: 0, base: "Sol", extension: "" },
            { acorde: "Do7", posicion: 180, base: "Do", extension: "7" }
        ],
        [
            { acorde: "Re", posicion: 0, base: "Re", extension: "" },
            { acorde: "Sol", posicion: 160, base: "Sol", extension: "" }
        ],
        [
            { acorde: "Lam", posicion: 10, base: "La", extension: "m" },
            { acorde: "Re", posicion: 150, base: "Re", extension: "" }
        ],
        [
            { acorde: "Mim6", posicion: 20, base: "Mi", extension: "m6" },
            { acorde: "La7", posicion: 170, base: "La", extension: "7" }
        ]
    ],

    // Estructura IDÉNTICA para Cantor (arrays paralelos)
    cantor: [
        "Amo al Señor, porque escucha",
        "mi voz suplicante;",
        "inclina hacia mí su oído",
        "el día en que lo invoco."
    ],

    cantorAcordes: [
        [
            { acorde: "Mim6", posicion: 10, base: "Mi", extension: "-6" },
            { acorde: "La7", posicion: 128, base: "La", extension: "7" }
        ],
        [
            { acorde: "Sol", posicion: 0, base: "Sol", extension: "" },
            { acorde: "Do", posicion: 120, base: "Do", extension: "" }
        ],
        [
            { acorde: "Rem", posicion: 15, base: "Re", extension: "m" },
            { acorde: "Sol7", posicion: 140, base: "Sol", extension: "7" }
        ],
        [
            { acorde: "La", posicion: 30, base: "La", extension: "" },
            { acorde: "Re", posicion: 160, base: "Re", extension: "" }
        ]
    ]
};

const acordesCromaticos = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "Si♭", "Si"];
const tiposAcordes = ['', 'm', '7', 'm7', 'Maj7', 'dim', 'aug', '–'];
let acordesOriginales = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarCanto(partitura);
});

function cargarCanto(partitura) {
    document.getElementById('titulo').textContent = partitura.titulo;
    document.getElementById('salmo').textContent = partitura.salmo;
    document.getElementById('dbnos').textContent = partitura.dbnos;

    cargarColumnas(partitura);

    acordesOriginales = extraerAcordesOriginales(partitura);
    configurarSelectores();
}

function cargarColumnas(partitura) {
    const columnaIzquierda = document.getElementById('columna-izquierda');
    const columnaDerecha = document.getElementById('columna-derecha');

    let htmlIzquierda = '';
    let htmlDerecha = '';

    // Combinar y distribuir versos y acordes
    const todosVersos = [...partitura.asamblea, ...partitura.cantor];
    const todosAcordes = [...partitura.asambleaAcordes, ...partitura.cantorAcordes];

    todosVersos.forEach((verso, index) => {
        const acordeLinea = todosAcordes[index] || [];
        const versoHTML = generarVersoHTML(verso, acordeLinea, index);

        if (index < todosVersos.length / 2) {
            htmlIzquierda += versoHTML;
        } else {
            htmlDerecha += versoHTML;
        }
    });

    columnaIzquierda.innerHTML = htmlIzquierda;
    columnaDerecha.innerHTML = htmlDerecha;
}

function generarVersoHTML(verso, acordes, index) {
    return `<div class="verso">
              <div class="acordes-container">
                ${acordes.map(acorde => `
                  <select class="acorde-select" style="left: ${acorde.posicion}px;"
                          data-original="${acorde.acorde}"
                          data-index="${index}">
                    ${generarOpcionesAcordes(acorde.acorde)}
                  </select>
                `).join('')}
              </div>
              <div class="letra">${verso}</div>
            </div>`;
}

function generarOpcionesAcordes(acordeSeleccionado) {
    let opciones = '';
    acordesCromaticos.forEach(nota => {
        tiposAcordes.forEach(tipo => {
            const acorde = nota + tipo;
            const seleccionado = acorde === acordeSeleccionado ? 'selected' : '';
            opciones += `<option value="${acorde}" ${seleccionado}>${acorde}</option>`;
        });
    });
    return opciones;
}

function extraerAcordesOriginales(partitura) {
    const todosAcordes = [];

    ['asambleaAcordes', 'cantorAcordes'].forEach(seccion => {
        if (partitura[seccion]) {
            partitura[seccion].forEach(lineaAcordes => {
                if (lineaAcordes) {
                    lineaAcordes.forEach(acorde => {
                        todosAcordes.push(acorde.acorde);
                    });
                }
            });
        }
    });

    return todosAcordes;
}

function configurarSelectores() {
    const acordeSelectores = document.querySelectorAll('.acorde-select');

    acordeSelectores.forEach(selector => {
        selector.addEventListener('change', function() {
            const acordeSeleccionado = this.value;
            const acordeOriginal = this.dataset.original;
            const index = parseInt(this.dataset.index);

            const desplazamiento = obtenerDesplazamiento(acordeOriginal.replace(/[^A-Za-z#♭]/g, ''), acordeSeleccionado.replace(/[^A-Za-z#♭]/g, ''));

            // Aplicar el cambio a todos los acordes de la misma línea
            const acordesEnLinea = Array.from(this.parentNode.querySelectorAll('.acorde-select'));

            acordesEnLinea.forEach(otroSelector => {
                const acordeOriginalOtro = otroSelector.dataset.original;
                otroSelector.value = calcularAcordeDesplazado(acordeOriginalOtro, desplazamiento);
                otroSelector.dataset.original = otroSelector.value;
            });
        });
    });
}

function obtenerDesplazamiento(acordeInicial, acordeFinal) {
    const indiceInicial = acordesCromaticos.indexOf(acordeInicial);
    const indiceFinal = acordesCromaticos.indexOf(acordeFinal);

    if (indiceInicial === -1 || indiceFinal === -1) return 0;

    return (indiceFinal - indiceInicial + acordesCromaticos.length) % acordesCromaticos.length;
}

function calcularAcordeDesplazado(acordeOriginal, desplazamiento) {
    if (!acordeOriginal) return '';

    const baseOriginal = acordeOriginal.replace(/[^A-Za-z#♭]/g, '');
    const tipo = acordeOriginal.slice(baseOriginal.length);
    const indiceOriginal = acordesCromaticos.indexOf(baseOriginal);

    if (indiceOriginal === -1) return acordeOriginal;

    const indiceNuevo = (indiceOriginal + desplazamiento + acordesCromaticos.length) % acordesCromaticos.length;
    const baseNueva = acordesCromaticos[indiceNuevo];

    return baseNueva + tipo;
}