// Este archivo contendrá la "base de datos" de todos los cantos.
// Cada objeto en el array representa un canto.

const allCantosData = [
    {
        id: "victima_pascual", // Un ID único para el canto
        title: "A la Víctima Pascual",
        subtitle: "Secuencia de Pascua - Himno lat. «Victimae paschall laudes»",
        category: ["Pascua", "Pentecostes", "Cuaresma", "Adviento", "Liturgia"], // Sigue siendo un array de nombres de categorías
        dbno: "1",
        notes: "Este canto se usa en la liturgia de Pascua.",
        // Datos específicos del canto, ahora referenciados aquí
        lizq: [
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,416)", sC: "tc" },
            { line: "hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)" },
            { line: "el sacrificio de alabanza. (Mi,m,15)(Re,m,85)" },
            { line: "Asi habla el amen, el testigo fiel y veras (Do,,25)(Re,m,40)(Mi,7,80)(Do,,120)(Re,m,160)(Mi,7,190)(Sol,7,240)" },
            { line: "OCASIÓN DE TROPIEZO (Mi,m,12)(Re,m,85)", tcss: "atx" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", tcss: "atx" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", tcss: "atx" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", tcss: "atx" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", tcss: "atx" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", tcss: "atx" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,360)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,360)" },
            { line: "Hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)"  },
        ],
        lder: [
            { line: "HERMANOS, A NADIE DEMOS (Mi,m,15)(Re,m,85)", sC: "ta", tcss: "atx" },
            { line: "OCASIÓN DE TROPIEZO (Mi,m,15)(Re,m,85)", sC: "r1" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,m,15)(Re,m,85)", tcss: "atx" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,160)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,360)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,260)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,400)", sC: "tc" },
            { line: "Hermanos, a nadie demos ocasión de tropiezo, (La,m,15)(Re,m,180)", sC: "tc" },
            { line: "hermanos, vivamos aceptando las tribulaciones, (Mi,,50)(La,m,363)", sC: "ta", tcss: "atx" },
            { line: "el sacrificio de alabanza. (Mi,m,12)(Re,m,85)" },
            { line: "Asi habla el amen, el testigo fiel y veras (Do,,8)(Re,m,40)(Mi,7,80)(Do,,120)(Re,m,160)(Mi,7,190)(Sol,7,240)" }
        ]
    },
    {
        id: "anadiedemosocasiondetropiezo", // Un ID único para el canto
        title: "A NADIE DEMOS OCASIÓN DE TROPIEZO",
        subtitle: "2ª Corintios 6,3ss",
        category: ["PreCatecumenado", "Pascua", "Pentecostés", "Comunión"], // Sigue siendo un array de nombres de categorías
        dbno: "1",
        notes: "Este canto se usa en la liturgia de Pascua.",

        lizq: [
            { line: "Hermanos, a nadie demos ocasión de tropiezo, ((Mi,,65),,15)(La,m,50)" },
            { line: "hermanos, vivamos aceptando las tribulaciones, (Re,m,15) (Mi,,65)" },
            { line: "necesidades, angustias y fatigas,   (Re,m,15) (Mi,,65)" },
            { line: "viviendo en pureza, paciencia y bondad, Fa (Mi,,65)" },
            { line: "en el Espíritu Santo, y en el poder de Dios,    Fa" },
            { line: "con las armas de la justicia,   (Mi,,65)" },
            { line: "las de la derecha y las de la izquierda." },
            { line: "HERMANOS, A NADIE DEMOS Lam" },
            { line: "OCASIÓN DE TROPIEZO,    (Re,m,15)" },
            { line: "HERMANOS, VIVAMOS ACEPTANDO (Mi,,65)" },
            { line: "LAS TRIBULACIONES,  Lam" },
            { line: "NECESIDADES, ANGUSTIAS Y FATIGAS.   (Re,m,15) (Mi,,65) (Re,m,15) (Mi,,65)" },
            { line: "En calumnias y en buena fama, (Re,m,15) (Mi,,65)" },
            { line: "en gloria e igno(Mi,,65)nia, (Re,m,15) (Mi,,65)" },
            { line: "como pobres, aunque enriqueciendo a muchos; Fa" },
            { line: "como quienes nada tienen, (Mi,,65)" },
            { line: "aunque lo poseemos todo. " },
            { line: "HERMANOS, A NADIE DEMOS... Lam La7 (Re,m,15)" },
            { line: "Hermanos, os hemos hablado con franqueza, (Mi,,65)" },
        ],
        lder: [
            { line: "os hemos hablado en toda verdad. (Re,m,15) (Mi,,65)" },
            { line: "No unciros al yugo desigual con los paganos. (Re,m,15) (Mi,,65)" },
            { line: "¿Qué participación hay entre el fiel y el infiel? Fa" },
            { line: "¿Qué unión entre el santuario de Dios (Mi,,65) " },
            { line: "y el santuario de los ídolos? (Re,m,15) (Mi,,65)" },
            { line: "Porque somos el santuario de Dios. " },
            { line: "HERMANOS, A NADIE DEMOS... Lam La7 (Re,m,15)" },
            { line: "Tengo plena confianza en el hablaros, (Mi,,65)" },
            { line: "porque estoy orgulloso de vosotros. (Re,m,15) (Mi,,65)" },
            { line: "No unciros al yugo desigual con los paganos. (Re,m,15) (Mi,,65)" },
            { line: "¿Qué participación hay entre el fiel y el infiel? Fa" },
            { line: "¿Qué unión entre el santuario de Dios (Mi,,65)" },
            { line: "y el santuario de los ídolos?" },
            { line: "HERMANOS, A NADIE DEMOS... Lam (Re,m,15) (Mi,,65)" },
            { line: "En pureza, paciencia y bondad, Fa (Mi,,65)" },
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
