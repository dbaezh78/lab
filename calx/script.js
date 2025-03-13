document.getElementById('hoy').addEventListener('click', function() {
    const hoy = new Date();
    const tiempoLiturgico = calcularTiempoLiturgico(hoy);
    const semana = calcularSemanaTiempoLiturgico(hoy, tiempoLiturgico.toLowerCase().replace(/ /g, ''));
    const rutaRecurso = generarRutaRecurso(hoy);

    document.getElementById('resultado').innerHTML = `
        <p><strong>Tiempo Litúrgico:</strong> ${tiempoLiturgico}</p>
        <p><strong>Semana:</strong> ${semana}</p>
        <p><strong>Ruta del Recurso:</strong> ${rutaRecurso}</p>
    `;
});

// Funciones para calcular tiempos litúrgicos y rutas
function calcularTiempoLiturgico(fecha) {
    const año = fecha.getFullYear();
    const adviento = calcularPrimerDomingoAdviento(año);
    const navidad = new Date(año, 11, 25); // 25 de diciembre
    const cuaresma = calcularMiércolesDeCeniza(año);
    const pascua = calcularDomingoDePascua(año);
    const pentecostes = new Date(pascua);
    pentecostes.setDate(pascua.getDate() + 49); // Domingo de Pentecostés
    const inicioOrdinario1 = calcularInicioTiempoOrdinario(año);
    const finOrdinario1 = new Date(cuaresma);
    finOrdinario1.setDate(cuaresma.getDate() - 1); // Martes antes del Miércoles de Ceniza
    const inicioOrdinario2 = calcularFinTiempoOrdinario(año);

    if (fecha >= adviento && fecha < navidad) {
        return "Tiempo de Adviento";
    } else if (fecha >= navidad && fecha < inicioOrdinario1) {
        return "Tiempo de Navidad";
    } else if (fecha >= inicioOrdinario1 && fecha <= finOrdinario1) {
        return "Primera parte del Tiempo Ordinario";
    } else if (fecha >= cuaresma && fecha < pascua) {
        return "Tiempo de Cuaresma";
    } else if (fecha >= pascua && fecha < pentecostes) {
        return "Tiempo de Pascua";
    } else if (fecha >= inicioOrdinario2 && fecha < adviento) {
        return "Segunda parte del Tiempo Ordinario";
    } else {
        return "Fecha no válida";
    }
}

function calcularSemanaTiempoLiturgico(fecha, tiempoLiturgico) {
    let inicioTiempo;
    switch (tiempoLiturgico) {
        case 'tiempodeadviento':
            inicioTiempo = calcularPrimerDomingoAdviento(fecha.getFullYear());
            break;
        case 'tiempodecuaresma':
            inicioTiempo = calcularMiércolesDeCeniza(fecha.getFullYear());
            break;
        case 'tiempodepascua':
            inicioTiempo = calcularDomingoDePascua(fecha.getFullYear());
            break;
        case 'primera partedeltiempoordinario':
            inicioTiempo = calcularInicioTiempoOrdinario(fecha.getFullYear());
            break;
        case 'segunda partedeltiempoordinario':
            inicioTiempo = calcularFinTiempoOrdinario(fecha.getFullYear());
            break;
        default:
            return 0; // No aplica
    }

    const diferenciaDias = Math.floor((fecha - inicioTiempo) / (1000 * 60 * 60 * 24));
    return Math.floor(diferenciaDias / 7) + 1; // Semana actual
}

function generarRutaRecurso(fecha) {
    const tiempoLiturgico = calcularTiempoLiturgico(fecha).toLowerCase().replace(/ /g, '');
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const dia = fecha.getDate();

    // Mapear el tiempo litúrgico a la abreviatura de la carpeta
    const carpetasTiempo = {
        'tiempodeadviento': 'adv',
        'tiempodenavidad': 'nav',
        'tiempodecuaresma': 'cua',
        'tiempodepascua': 'pas',
        'primera partedeltiempoordinario': 'to1',
        'segunda partedeltiempoordinario': 'to2'
    };

    const carpetaTiempo = carpetasTiempo[tiempoLiturgico] || 'to'; // Por defecto, Tiempo Ordinario
    return `/${carpetaTiempo}/${mes}/${dia}/recurso.mp3`;
}

// Funciones auxiliares
function calcularPrimerDomingoAdviento(año) {
    const navidad = new Date(año, 11, 25);
    const diaSemana = navidad.getDay();
    const diasHastaDomingo = (diaSemana + 7 - 1) % 7;
    const primerDomingoAdviento = new Date(navidad);
    primerDomingoAdviento.setDate(navidad.getDate() - diasHastaDomingo - 21);
    return primerDomingoAdviento;
}

function calcularMiércolesDeCeniza(año) {
    const pascua = calcularDomingoDePascua(año);
    const miercolesDeCeniza = new Date(pascua);
    miercolesDeCeniza.setDate(pascua.getDate() - 46);
    return miercolesDeCeniza;
}

function calcularDomingoDePascua(año) {
    const a = año % 19;
    const b = Math.floor(año / 100);
    const c = año % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(año, mes - 1, dia);
}

function calcularInicioTiempoOrdinario(año) {
    const epifania = new Date(año, 0, 6); // 6 de enero
    const diaSemanaEpifania = epifania.getDay();
    const diasHastaDomingo = (7 - diaSemanaEpifania) % 7;
    const primerDomingoOrdinario = new Date(epifania);
    primerDomingoOrdinario.setDate(epifania.getDate() + diasHastaDomingo);
    return primerDomingoOrdinario;
}

function calcularFinTiempoOrdinario(año) {
    const pentecostes = new Date(calcularDomingoDePascua(año));
    pentecostes.setDate(pentecostes.getDate() + 49); // Domingo de Pentecostés
    const lunesDespuesPentecostes = new Date(pentecostes);
    lunesDespuesPentecostes.setDate(pentecostes.getDate() + 1); // Lunes después de Pentecostés
    return lunesDespuesPentecostes;
}