// script.js
document.getElementById('hoy').addEventListener('click', function() {
    const hoy = new Date();
    const tiempoLiturgico = calcularTiempoLiturgico(hoy);
    document.getElementById('resultado').innerText = `Hoy es: ${tiempoLiturgico}`;
});

document.getElementById('tiempoLiturgico').addEventListener('change', function(event) {
    const tiempoSeleccionado = event.target.value;
    const fecha = obtenerFechaPorTiempoLiturgico(tiempoSeleccionado);
    document.getElementById('resultado').innerText = `Fecha correspondiente: ${fecha}`;
});

function calcularTiempoLiturgico(fecha) {
    const año = fecha.getFullYear();
    const adviento = calcularPrimerDomingoAdviento(año);
    const navidad = new Date(año, 11, 25); // 25 de diciembre
    const cuaresma = calcularMiércolesDeCeniza(año);
    const pascua = calcularDomingoDePascua(año);
    const pentecostes = new Date(pascua);
    pentecostes.setDate(pascua.getDate() + 49);

    if (fecha >= adviento && fecha < navidad) {
        return "Tiempo de Adviento";
    } else if (fecha >= navidad && fecha < cuaresma) {
        return "Tiempo de Navidad";
    } else if (fecha >= cuaresma && fecha < pascua) {
        return "Tiempo de Cuaresma";
    } else if (fecha >= pascua && fecha < pentecostes) {
        return "Tiempo de Pascua";
    } else {
        return "Tiempo Ordinario";
    }
}

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

function obtenerFechaPorTiempoLiturgico(tiempo) {
    const hoy = new Date();
    const año = hoy.getFullYear();
    switch (tiempo) {
        case 'adviento':
            return calcularPrimerDomingoAdviento(año).toLocaleDateString();
        case 'navidad':
            return new Date(año, 11, 25).toLocaleDateString();
        case 'cuaresma':
            return calcularMiércolesDeCeniza(año).toLocaleDateString();
        case 'pascual':
            return calcularDomingoDePascua(año).toLocaleDateString();
        case 'ordinario':
            return "Tiempo Ordinario no tiene una fecha específica";
        default:
            return "Selección no válida";
    }
}