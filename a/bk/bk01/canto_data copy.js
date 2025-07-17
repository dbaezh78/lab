// Este archivo contendrá la "base de datos" de todos los cantos.
// Cada objeto en el array representa un canto.

const allCantosData = [
    {
        id: "victima_pascual", // Un ID único para el canto
        tt: "A la Víctima Pascual",
        title: "A la Víctima Pascual",
        subtitle: "Secuencia de Pascua - Himno lat. «Victimae paschall laudes»",
        category: ["Pascua", "Pentecostes", "Cuaresma", "Adviento", "Liturgia"], // Sigue siendo un array de nombres de categorías
        nCan: "Notas del canto, ej: * Se repite todo el canto en un tono más alto",
        dbno: "1",
        notes: "Este canto se usa en la liturgia de Pascua.",
        // Datos específicos del canto, ahora referenciados aquí
        lizq: [
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,400)", sC: "tc" },
            { line: "hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)" },
            { line: "el sacrificio de alabanza. (Mi,m,15)(Re,m,85)" },
            { line: "Asi habla el amen, el testigo fiel y veras (Do,,25)(Re,m,40)(Mi,7,80)(Do,,120)(Re,m,160)(Mi,7,190)(Sol,7,240)" },
            { line: "OCASIÓN DE TROPIEZO (Mi,m,12)(Re,m,85)", sC: "as" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", sC: "" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", sC: "as" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", sC: "as" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", sC: "as" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", sC: "as" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,360)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,360)" },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
        ],
        lder: [
            { line: "HERMANOS, A NADIE DEMOS (Mi,m,15)(Re,m,85)", sC: "ta", sC: "as b1-1" },
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
    {
        id: "anadiedemosocasiondetropiezo", // Un ID único para el canto
        tt: "A nadie demos ocasión de tropiezo",
        title: "A NADIE DEMOS OCASIÓN DE TROPIEZO",
        subtitle: "2ª Corintios 6,3ss",
        category: ["PreCatecumenado", "Pascua", "Pentecostés", "Comunión"], // Sigue siendo un array de nombres de categorías
        nCan: "Notas",
        dbno: "1",
        notes: "Este canto se usa en la liturgia de Pascua.",

        lizq: [
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (Mi,,25),,15)(La,m,150)", sC: "tc" },
            { line: "hermanos, vivamos aceptando las tribulaciones, (Re,m,15) (Mi,,65)" },
            { line: "necesidades, angustias y fatigas,   (Re,m,15) (Mi,,65)" },
            { line: "viviendo en pureza, paciencia y bondad, (Fa,,15) (Mi,,65)" },
            { line: "en el Espíritu Santo, y en el poder de Dios,    (Fa,,15)" },
            { line: "con las armas de la justicia,   (Mi,,65)" },
            { line: "las de la derecha y las de la izquierda." },
            { line: "HERMANOS, A NADIE DEMOS (La,m,15)", sC: "mt as" },
            { line: "OCASIÓN DE TROPIEZO,    (Re,m,15)", sC: "as" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,,65)", sC: "as" },
            { line: "LAS TRIBULACIONES,  (La,m,15)", sC: "as" },
            { line: "NECESIDADES, ANGUSTIAS Y FATIGAS.   (Re,m,15) (Mi,,65) (Re,m,15) (Mi,,65)", sC: "as" },
            { line: "En calumnias y en buena fama, (Re,m,15) (Mi,,65)", sC: "mt" },
            { line: "en gloria e igno(Mi,,65)nia, (Re,m,15) (Mi,,65)" },
            { line: "como pobres, aunque enriqueciendo a muchos; (Fa,,15)" },
            { line: "como quienes nada tienen, (Mi,,65)" },
            { line: "aunque lo poseemos todo. " },
            { line: "HERMANOS, A NADIE DEMOS... (La,m,15) (La,7,155) (Re,m,205)", sC: "mt" },
            { line: "Hermanos, os hemos hablado con franqueza, (Mi,,65)", sC: "mt" },
        ],
        lder: [
            { line: "os hemos hablado en toda verdad. (Re,m,15) (Mi,,65)", sC: "ta" },
            { line: "No unciros al yugo desigual con los paganos. (Re,m,15) (Mi,,205)" },
            { line: "¿Qué participación hay entre el fiel y el infiel? (Fa,,205)" },
            { line: "¿Qué unión entre el santuario de Dios (Mi,,65) " },
            { line: "y el santuario de los ídolos? (Re,m,15) (Mi,,65)" },
            { line: "Porque somos el santuario de Dios. " },
            { line: "HERMANOS, A NADIE DEMOS... (La,m,15) (La,7,155) (Re,m,215)", sC: "mt" },
            { line: "Tengo plena confianza en el hablaros, (Mi,,65)", sC: "mt" },
            { line: "porque estoy orgulloso de vosotros. (Re,m,15) (Mi,,65)" },
            { line: "No unciros al yugo desigual con los paganos. (Re,m,15) (Mi,,65)" },
            { line: "¿Qué participación hay entre el fiel y el infiel? (Fa,,15)" },
            { line: "¿Qué unión entre el santuario de Dios (Mi,,65)" },
            { line: "y el santuario de los ídolos?" },
            { line: "HERMANOS, A NADIE DEMOS... (La,m,15) (Re,m,150) (Mi,,265)", sC: "mt" },
            { line: "En pureza, paciencia y bondad, (Fa,,15) (Mi,,65)", sC: "mt" },
            { line: "en el Espíritu Santo, y en el poder de Dios." },
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
