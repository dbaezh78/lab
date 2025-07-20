// Este archivo contendrá la "base de datos" de todos los cantos.
// Cada objeto en el array representa un canto.

const allCantosData = [
    {
        id: "alavictimapascual", // Un ID único para el canto
        tt: "A la Víctima Pascual",
        title: "A la Víctima Pascual",
        subtitle: "Secuencia de Pascua - Himno lat. «Victimae paschall laudes»",
        category: ["Pascua", "Pentecostes", "Cuaresma", "Adviento", "Liturgia"], // Sigue siendo un array de nombres de categorías
        nCan: "Notas del canto, ej: * Se repite todo el canto en un tono más alto",
        dbno: "1",
        notes: "Este canto se usa en la liturgia de Pascua.",
        audioSrc: "/audio/alavictimapascual.mp3", // <-- Nueva propiedad para el audio
        // Nueva propiedad para la velocidad de desplazamiento
        scrollConfig: {
            mobile: { velocidad: 6, incremento: 3 }, // Para celular
            tablet: { velocidad: 7, incremento: 1 }  // Para tablet
        },
        // Datos específicos del canto, ahora referenciados aquí
        lizq: [
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,400)", sC: "tc" },
            { line: "hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)" },
            { line: "el sacrificio de alabanza. (Mi,m,15)(Re,m,85)" },
            { line: "Asi habla el amen, el testigo fiel y veras (Do,,25)(Re,m,40)(Mi,7,80)(Do,,120)(Re,m,160)(Mi,7,190)(Sol,7,240)" },
            // Primer bloque de asamblea expandido
            {
                type: "collapsible-block",
                id: "asamblea_victima_1",
                initialState: "expanded",
                triggerLine: "HERMANOS, A NADIE DEMOS (La,m,15)", // Texto del disparador sin "..."
                lines: [ // Contenido completo del bloque
                    { line: "HERMANOS, A NADIE DEMOS (La,m,15)", tcss: "atx" },
                    { line: "OCASIÓN DE TROPIEZO, (Re,m,15)" },
                    { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,,65)" },
                    { line: "LAS TRIBULACIONES, (La,m,15)" },
                    { line: "NECESIDADES, ANGUSTIAS Y FATIGAS. (Re,m,15) (Mi,,65)" }
                ]
            },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,360)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,360)" },
            // Segundo bloque de asamblea colapsado
            {
                type: "collapsible-block",
                id: "asamblea_victima_2",
                initialState: "collapsed",
                triggerLine: "HERMANOS, A NADIE DEMOS (La,m,15)", // Texto del disparador sin "..."
                lines: [
                    { line: "HERMANOS, A NADIE DEMOS (La,m,15)", sC: "as" },
                    { line: "OCASIÓN DE TROPIEZO, (Re,m,15)", sC: "as" },
                    { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,,65)", sC: "as" },
                    { line: "LAS TRIBULACIONES, (La,m,15)", sC: "as" },
                    { line: "NECESIDADES, ANGUSTIAS Y FATIGAS. (Re,m,15) (Mi,,65)", sC: "as" },
                ]
            },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
        ],
        lder: [
            { line: "HERMANOS, A NADIE DEMOS (Mi,m,15)(Re,m,85)", sC: "ta as b1-1" }, // Nota: sC corregido
            { line: "OCASIÓN DE TROPIEZO (Mi,m,15)(Re,m,85)", sC: "as" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", sC: "as" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,160)", sC: "tc clase1 clase2 clase3" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,360)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,260)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,400)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,180)", sC: "tc" },
            { line: "hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)", sC: "ta" },
            { line: "el sacrificio de alabanza. (Mi,m,12)(Re,m,85)", sC: "b1-2" },
            { line: "Asi habla el amen, el testigo fiel y veras (Do,,8)(Re,m,40)(Mi,7,80)(Do,,120)(Re,m,160)(Mi,7,190)(Sol,7,240)" }
        ]
    },
    //  A NADIE DEMOS OCASIÓN DE TROPIEZO
    {
        id: "anadiedemosocasiondetropiezo", // Un ID único para el canto
        tt: "A nadie demos ocasión de tropiezo",
        title: "A NADIE DEMOS OCASIÓN DE TROPIEZO",
        subtitle: "2ª Corintios 6,3ss",
        category: ["PreCatecumenado", "Pascua", "Pentecostés", "Comunión"], // Sigue siendo un array de nombres de categorías
        // Nueva propiedad para la velocidad de desplazamiento
        scrollConfig: {
            mobile: { velocidad: 6, incremento: 3 },
            tablet: { velocidad: 7, incremento: 1 }
        },
        nCan: "Notas",
        dbno: "2",
        notes: "Este canto se usa en la liturgia de Pascua.",
        audioSrc: "/audio/anadiedemosocasiondetropiezo.mp3", // <-- Nueva propiedad para el audio
        lizq: [
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,16)(Re,m,416)", sC: "tc" },
            { line: "hermanos, vivamos aceptando las tribulaciones, (Mi,,61) (La,m,418)" },
            { line: "necesidades, angustias y fatigas,   (Re,m,16) (Mi,,284)" },
            { line: "viviendo en pureza, paciencia y bondad, (Re,m,16) (Mi,,365)" },
            { line: "en el Espíritu Santo, y en el poder de Dios, (Fa,,152)(Mi,,387)" },
            { line: "con las armas de la justicia, (Fa,,235)" },
            { line: "las de la derecha y las de la izquierda. (Mi,,327)" },
            
            { line: "HERMANOS, A NADIE DEMOS (La,m,18)", sC: "mt ta as" },
            { line: "OCASIÓN DE TROPIEZO,    (Re,m,192)", sC: "as" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,,69)", sC: "as" },
            { line: "LAS TRIBULACIONES,  (La,m,154)", sC: "as" },
            { line: "NECESIDADES, ANGUSTIAS Y FATIGAS. (Re,m,18)(Mi,,328)", sC: "as" },

            { line: "En calumnias y en buena fama, (Re,m,15)(Mi,,263)", sC: "mt tc" },
            { line: "en gloria e ignominia, (Re,m,15) (Mi,,175)" },
            { line: "como pobres, aunque enriqueciendo a muchos; (Re,m,72) (Mi,,300)" },
            { line: "como quienes nada tienen, (Fa,,211)" },
            { line: "aunque lo poseemos todo. (Mi,,218)" },

            {   type: "collapsible-block",
                id: "asamblea_anadie_1",
                initialState: "collapsed",
                triggerLine: "HERMANOS, A NADIE DEMOS (La,m,18)", sC: "mt as ta",
                lines: [
                    { line: "OCASIÓN DE TROPIEZO, (Re,m,192)", sC: "as" },
                    { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,,69)", sC: "as" },
                    { line: "LAS TRIBULACIONES,  (La,m,154)", sC: "as" },
                    { line: "NECESIDADES, ANGUSTIAS Y FATIGAS. (Re,m,18)(Mi,,328)", sC: "as" },
                ]},
        ],
        lder: [
            { line: "Hermanos, os hemos hablado con franqueza, (La,7,13)(Re,m,398)", sC: "tc" },
            { line: "os hemos hablado en toda verdad. (Mi,,307)", sC: "" },
            { line: "No unciros al yugo desigual con los paganos. (Re,m,15) (Mi,,391)" },
            { line: "¿Qué participación hay entre el fiel y el infiel? (Re,m,15) (Mi,,420)" },
            { line: "¿Qué unión entre el santuario de Dios (Fa,,348) " },
            { line: "y el santuario de los ídolos? (Mi,,208)" },
            { line: "Porque somos el santuario de Dios. (Re,m,15) (Mi,,320) " },
            // Bloque de asamblea colapsado en lder
            
            {
                type: "collapsible-block",
                id: "asamblea_anadie_2",
                initialState: "collapsed",
                triggerLine: "HERMANOS, A NADIE DEMOS (La,m,18)", sC: "as mt ta",
                lines: [
                    { line: "OCASIÓN DE TROPIEZO, (Re,m,192)", sC: "as" },
                    { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,,69)", sC: "as" },
                    { line: "LAS TRIBULACIONES,  (La,m,154)", sC: "as" },
                    { line: "NECESIDADES, ANGUSTIAS Y FATIGAS. (Re,m,18)(Mi,,328)", sC: "as" },
                ]},

            { line: "Tengo plena confianza en el hablaros, (La,7,15) (Re,m,313)", sC: "mt tc" },
            { line: "porque estoy orgulloso de vosotros. (Mi,,289)" },
            { line: "No unciros al yugo desigual con los paganos. (Re,m,15) (Mi,,388)" },
            { line: "¿Qué participación hay entre el fiel y el infiel? (Re,m,15) (Mi,,421)" },
            { line: "¿Qué unión entre el santuario de Dios (Fa,,349)" },
            { line: "y el santuario de los ídolos? (Mi,,207)"  },

            {   type: "collapsible-block",
                id: "asamblea_anadie_2",
                initialState: "collapsed",
                triggerLine: "HERMANOS, A NADIE DEMOS (La,m,18)", sC: "as mt ta", // Texto del disparador sin "..."
                lines: [
                    { line: "OCASIÓN DE TROPIEZO, (Re,m,192)", sC: "as" },
                    { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,,69)", sC: "as" },
                    { line: "LAS TRIBULACIONES,  (La,m,154)", sC: "as" },
                    { line: "NECESIDADES, ANGUSTIAS Y FATIGAS. (Re,m,18)(Mi,,328)", sC: "as" },
                ]},

            { line: "En pureza, paciencia y bondad, (Re,m,15) (Mi,,277)", sC: "mt tc" },
            { line: "en el Espíritu Santo, y en el poder de Dios. (Fa,,147) (Mi,,381)" },
        ]

    }
    // Aquí irían más cantos:
    // {
    //     id: "abraham",
    //     title: "Abraham",
    //     subtitle: "Canto de Cuaresma",
    //     category: ["Cuaresma", "Meditación"], // Ejemplo de múltiples categorías
    //     notes: "Un canto para el tiempo de Cuaresma.",
    //     lizq: [ /* datos de Abraham */ ],
    //     lder: [ /* datos de Abraham */ ]
    // },
    // ... y así sucesivamente
];
