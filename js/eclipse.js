console.log("ECLIPSE JS CARGADO");
/* ==========================================
   ECLIPSE SOLAR 2026
   Villar del Arzobispo
========================================== */
// ===== MODO PRUEBAS =====
const MODO_PRUEBAS = true;

const FECHA_PRUEBA = "2026-08-12T20:28:20";
// ==========================================
// FECHAS DEL ECLIPSE
// ==========================================

const eclipse = {

    parcial: new Date(DATOS_PUNTO.eclipse.parcial),

    totalidad: new Date(DATOS_PUNTO.eclipse.totalidad),

    maximo: new Date(DATOS_PUNTO.eclipse.maximo),

    finTotalidad: new Date(DATOS_PUNTO.eclipse.finTotalidad),

    ocaso: new Date(DATOS_PUNTO.eclipse.ocaso)

};
// ==========================================
// COORDENADAS DEL PUNTO
// ==========================================

const ubicacion = {

    lat: DATOS_PUNTO.ubicacion.lat,

    lng: DATOS_PUNTO.ubicacion.lng

};


// ==========================================
// CALIBRACIÓN DE LA PANORÁMICA
// ==========================================

const vistaFoto = DATOS_PUNTO.vistaFoto;

const alturaEl =
document.getElementById("altura-sol");

const azimutEl =
document.getElementById("azimut-sol");

const planetas = DATOS_PUNTO.planetas;



// ==========================================
// ELEMENTOS HTML
// ==========================================

const diasEl = document.getElementById("dias");
const horasEl = document.getElementById("horas");
const minutosEl = document.getElementById("minutos");
const segundosEl = document.getElementById("segundos");

const mensajeEl = document.getElementById("mensaje-eclipse");


const fases = {

    parcial: document.getElementById("fase-parcial"),

    totalidad: document.getElementById("fase-totalidad"),

    maximo: document.getElementById("fase-maximo"),

    ocaso: document.getElementById("fase-ocaso")

};

const flechaSol =
document.getElementById("flecha-sol");

const direccionEl =
document.getElementById("direccion-sol");

const guiaBrujula =
document.getElementById("guia-brujula");

const grupoSol =
document.getElementById("grupoSol");


const modoEvento =
document.getElementById("acompanamiento");

const eventoIcono =
document.getElementById("eventoIcono");

const eventoTitulo =
document.getElementById("eventoTitulo");

const eventoMensaje =
document.getElementById("eventoMensaje");

const eventoAccion =
document.getElementById("eventoAccion");


// ==========================================
// UTILIDADES
// ==========================================

function dosCifras(numero){

    return String(numero).padStart(2,"0");

}

function limpiarFases(){

    Object.values(fases).forEach(fase=>{

        fase.classList.remove("activa");
        fase.classList.remove("completada");

    });

}


// ==========================================
// CONTADOR
// ==========================================

function actualizarContador(){

    const ahora = obtenerAhora();

    let diferencia = eclipse.parcial - ahora;

    if(diferencia < 0){

        diferencia = 0;

    }

    const dias = Math.floor(diferencia / 86400000);

    const horas = Math.floor((diferencia % 86400000) / 3600000);

    const minutos = Math.floor((diferencia % 3600000) / 60000);

    const segundos = Math.floor((diferencia % 60000) / 1000);

    diasEl.textContent = dosCifras(dias);
    horasEl.textContent = dosCifras(horas);
    minutosEl.textContent = dosCifras(minutos);
    segundosEl.textContent = dosCifras(segundos);

}


// ==========================================
// ESTADO DEL ECLIPSE
// ==========================================

function actualizarEstado(){

    const ahora = obtenerAhora();

    limpiarFases();

    // Antes del eclipse
    if(ahora < eclipse.parcial){

        mensajeEl.textContent =
        "🌞 Esperando el inicio del eclipse.";

        return;

    }

    // Eclipse parcial
    if(ahora < eclipse.totalidad){

        fases.parcial.classList.add("activa");

        mensajeEl.textContent =
        "🌗 El eclipse parcial está en curso.";

        return;

    }

    // Totalidad (antes del máximo)
    if(ahora < eclipse.maximo){

        fases.parcial.classList.add("completada");
        fases.totalidad.classList.add("activa");

        mensajeEl.textContent =
        "🌑 ¡Ha comenzado la totalidad!";

        return;

    }

    // Máximo (1 segundo)
    const finMaximo = new Date(eclipse.maximo.getTime() + 1000);

    if(ahora < finMaximo){

        fases.parcial.classList.add("completada");
        fases.totalidad.classList.add("completada");
        fases.maximo.classList.add("activa");

        mensajeEl.textContent =
        "⭐ Se está produciendo el máximo del eclipse.";

        return;

    }

    // Totalidad (después del máximo)
    if(ahora < eclipse.finTotalidad){

        fases.parcial.classList.add("completada");
        fases.maximo.classList.add("completada");
        fases.totalidad.classList.add("activa");

        mensajeEl.textContent =
        "🌑 La totalidad continúa.";

        return;

    }

    // Después de la totalidad
    if(ahora < eclipse.ocaso){

        fases.parcial.classList.add("completada");
        fases.totalidad.classList.add("completada");
        fases.maximo.classList.add("completada");

        mensajeEl.textContent =
        "🌅 El eclipse continúa hasta el ocaso.";

        return;

    }

    // Final

    fases.parcial.classList.add("completada");
    fases.totalidad.classList.add("completada");
    fases.maximo.classList.add("completada");
    fases.ocaso.classList.add("completada");

    mensajeEl.textContent =
    "🌙 El eclipse ha finalizado.";

}

// ==========================================
// ACTUALIZAR
// ==========================================

function actualizar(){

    actualizarContador();

    actualizarEstado();
    actualizarSol();
    actualizarBrujula();
    actualizarModoEvento();
    actualizarCielo();
    colocarPlanetas();

}



function actualizarSol(){

    const ahora = obtenerAhora();

    const posicion =
        SunCalc.getPosition(

            ahora,

            ubicacion.lat,

            ubicacion.lng

        );

    const altura =
        posicion.altitude * 180 / Math.PI;

    const azimut =
        posicion.azimuth * 180 / Math.PI + 180;

    alturaEl.textContent =
        altura.toFixed(1) + "°";

    azimutEl.textContent =
        azimut.toFixed(1) + "°";

}
function actualizarCielo(){

    const ahora = obtenerAhora();

    const posicion = SunCalc.getPosition(
        ahora,
        ubicacion.lat,
        ubicacion.lng
    );

    const altura =
        posicion.altitude * 180 / Math.PI;

    const azimut =
        (posicion.azimuth * 180 / Math.PI + 180) % 360;

    // Diferencia respecto al centro de la fotografía
    let diferencia =
        azimut - vistaFoto.azimutCentro;

    if(diferencia > 180){
        diferencia -= 360;
    }

    if(diferencia < -180){
        diferencia += 360;
    }

    // Posición en la imagen
    const x =
        400 +
        diferencia * vistaFoto.escalaHorizontal;

    const y =
        vistaFoto.horizonte -
        altura * vistaFoto.escalaVertical;

    document
        .getElementById("grupoSolCielo")
        .setAttribute(
            "transform",
            `translate(${x},${y})`
        );

}

// ==========================================
// BRÚJULA INTERACTIVA
// ==========================================

let rumboMovil = 0;
let brujulaActiva = false;


// Iniciar brújula

function iniciarBrujula(){

    if(
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ){

        DeviceOrientationEvent.requestPermission()
        .then(permission => {

            if(permission === "granted"){
                activarOrientacion();
            }

        })
        .catch(console.error);


    } else {

        activarOrientacion();

    }

}



function activarOrientacion(){

    if(brujulaActiva) return;

    brujulaActiva = true;


    window.addEventListener(
        "deviceorientation",
        actualizarOrientacion,
        true
    );

}



function actualizarOrientacion(event){


    let rumbo;


    // iPhone

    if(event.webkitCompassHeading){

        rumbo = event.webkitCompassHeading;


    } 
    // Android

    else if(event.alpha !== null){

        rumbo = 360 - event.alpha;

    }


    if(rumbo !== undefined){

        rumboMovil = rumbo;


        const rosa =
        document.getElementById("rosaBrujula");


        if(rosa){

            rosa.setAttribute(
                "transform",
                `rotate(${-rumboMovil} 200 200)`
            );

        }


        actualizarBrujula();

    }

}




function actualizarBrujula(){

    const posicion =
    SunCalc.getPosition(
        obtenerAhora(),
        ubicacion.lat,
        ubicacion.lng
    );


    // Azimut del Sol

    const azimutSol =
    (posicion.azimuth * 180 / Math.PI + 180 + 360) % 360;



    // Diferencia entre dónde mira el móvil y el Sol

    let diferencia =
    azimutSol - rumboMovil;



    // Normalizar entre -180 y 180

    if(diferencia > 180){

        diferencia -= 360;

    }


    if(diferencia < -180){

        diferencia += 360;

    }



    // Rotación de la flecha del Sol

    const grupo =
    document.getElementById("grupoSol");


    if(grupo){

        grupo.setAttribute(
            "transform",
            `rotate(${diferencia} 200 200)`
        );

    }



    // Texto de dirección general

    direccionEl.textContent =
    `Dirección del Sol: ${obtenerDireccion(azimutSol)} · ${azimutSol.toFixed(1)}°`;




    // ==========================================
    // GUÍA DEL VISITANTE
    // ==========================================

    if(!guiaBrujula){

        return;

    }



    const distancia =
    Math.abs(diferencia);



    // SOL ENCONTRADO

    if(distancia < 8){


        guiaBrujula.textContent =
        "☀️ ¡Dirección encontrada! Levanta la vista hacia el horizonte.";


        guiaBrujula.classList.add("encontrado");


        return;

    }



    guiaBrujula.classList.remove("encontrado");



    // GIRAR DERECHA

    if(diferencia > 0){


        guiaBrujula.textContent =
        `↪️ Gira ${Math.round(diferencia)}º hacia la derecha para encontrar el Sol`;

    }



    // GIRAR IZQUIERDA

    else {


        guiaBrujula.textContent =
        `↩️ Gira ${Math.abs(Math.round(diferencia))}º hacia la izquierda para encontrar el Sol`;

    }


}
function obtenerDireccion(grados){

    const direcciones = [
        "Norte",
        "Noreste",
        "Este",
        "Sureste",
        "Sur",
        "Suroeste",
        "Oeste",
        "Noroeste"
    ];

    const indice =
        Math.round(grados / 45) % 8;

    return direcciones[indice];

}

function actualizarModoEvento(){

    const ahora = obtenerAhora();

    const parcial = eclipse.parcial;
    const totalidad = eclipse.totalidad;
    const maximo = eclipse.maximo;
    const finTotalidad = eclipse.finTotalidad;
    const ocaso = eclipse.ocaso;

    // Restaurar aspecto normal

modoEvento.style.background = "white";
modoEvento.style.color = "#1c2b39";
modoEvento.style.borderLeftColor = "#3BA55D";

eventoTitulo.style.color = "#12355B";
eventoMensaje.style.color = "#1c2b39";
eventoAccion.style.color = "#1c2b39";

document.querySelector(".evento-accion").style.background = "#f4f7fb";
document.querySelector(".evento-accion strong").style.color = "#12355B";

    // ==========================
    // MÁS DE 30 MINUTOS
    // ==========================

    const segundosHastaParcial = (parcial - ahora) / 1000;

    if (segundosHastaParcial > 1800){

        modoEvento.style.borderLeftColor = "#3BA55D";

        eventoIcono.textContent = "🟢";

        eventoTitulo.textContent = "Todo preparado";

        eventoMensaje.textContent =
        "Todavía queda tiempo para instalarte con tranquilidad.";

        eventoAccion.textContent =
        "Comprueba las gafas homologadas, prepara agua y localiza el horizonte oeste.";

        return;

    }

    // ==========================
    // ÚLTIMOS 30 MINUTOS
    // ==========================

    if (segundosHastaParcial > 600){

        modoEvento.style.borderLeftColor = "#F6B800";

        eventoIcono.textContent = "🟡";

        eventoTitulo.textContent = "Cada vez falta menos";

        eventoMensaje.textContent =
        "El eclipse comenzará en menos de media hora.";

        eventoAccion.textContent =
        "Colócate en tu sitio definitivo y prepara todo el material.";

        return;

    }

    // ==========================
    // ÚLTIMOS 10 MINUTOS
    // ==========================

    if (segundosHastaParcial > 0){

        modoEvento.style.borderLeftColor = "#F08C00";

        eventoIcono.textContent = "🟠";

        eventoTitulo.textContent = "Comienza la cuenta atrás";

        eventoMensaje.textContent =
        "Quedan solo unos minutos para el inicio del eclipse.";

        eventoAccion.textContent =
        "Ponte las gafas homologadas y disfruta del comienzo del eclipse.";

        return;

    }

    // ==========================
    // ECLIPSE PARCIAL
    // ==========================

    if (ahora < totalidad){

        modoEvento.style.borderLeftColor = "#3F7AE0";

        eventoIcono.textContent = "🌗";

        eventoTitulo.textContent = "¡Ha comenzado el eclipse!";

        eventoMensaje.textContent =
        "La Luna ya está ocultando una parte del Sol.";

        eventoAccion.textContent =
        "Observa siempre el Sol utilizando las gafas homologadas.";

        return;

    }

    // ==========================
    // TOTALIDAD (ANTES DEL MÁXIMO)
    // ==========================

    if (ahora < maximo){

       modoEvento.style.background = "#14213D";
modoEvento.style.color = "white";

eventoTitulo.style.color = "white";
eventoMensaje.style.color = "white";
eventoAccion.style.color = "white";

document.querySelector(".evento-accion").style.background = "rgba(255,255,255,0.10)";
document.querySelector(".evento-accion strong").style.color = "white";

        eventoIcono.textContent = "🌑";

        eventoTitulo.textContent = "¡Ha comenzado la totalidad!";

        eventoMensaje.textContent =
        "La Luna está cubriendo completamente el Sol.";

        eventoAccion.textContent =
        "Disfruta de este momento único.";

        return;

    }

    // ==========================
    // MÁXIMO (1 segundo)
    // ==========================

    if (ahora < new Date(maximo.getTime() + 1000)){

        modoEvento.style.background = "#14213D";
modoEvento.style.color = "white";

eventoTitulo.style.color = "white";
eventoMensaje.style.color = "white";
eventoAccion.style.color = "white";

document.querySelector(".evento-accion").style.background = "rgba(255,255,255,0.10)";
document.querySelector(".evento-accion strong").style.color = "white";

        eventoIcono.textContent = "⭐";

        eventoTitulo.textContent = "Máximo del eclipse";

        eventoMensaje.textContent =
        "Se está produciendo el instante de máxima ocultación del Sol.";

        eventoAccion.textContent =
        "Estás viviendo el momento culminante del eclipse.";

        return;

    }

    // ==========================
    // TOTALIDAD (DESPUÉS DEL MÁXIMO)
    // ==========================

    if (ahora < finTotalidad){

        modoEvento.style.background = "#14213D";
modoEvento.style.color = "white";

eventoTitulo.style.color = "white";
eventoMensaje.style.color = "white";
eventoAccion.style.color = "white";

document.querySelector(".evento-accion").style.background = "rgba(255,255,255,0.10)";
document.querySelector(".evento-accion strong").style.color = "white";

        eventoIcono.textContent = "🌑";

        eventoTitulo.textContent = "La totalidad continúa";

        eventoMensaje.textContent =
        "Aún quedan unos segundos antes de que vuelva a aparecer el Sol.";

        eventoAccion.textContent =
        "Aprovecha estos últimos instantes de totalidad.";

        return;

    }

    // ==========================
    // DESPUÉS DE LA TOTALIDAD
    // ==========================

    if (ahora < ocaso){

        modoEvento.style.borderLeftColor = "#F6B800";

        eventoIcono.textContent = "🌅";

        eventoTitulo.textContent = "La totalidad ha terminado";

        eventoMensaje.textContent =
        "El eclipse continúa mientras el Sol desciende hacia el horizonte.";

        eventoAccion.textContent =
        "Sigue observando siempre con las gafas homologadas hasta el ocaso.";

        return;

    }

    // ==========================
    // FIN DEL ECLIPSE
    // ==========================

    modoEvento.style.borderLeftColor = "#6B7280";

    eventoIcono.textContent = "🌙";

    eventoTitulo.textContent = "El eclipse ha finalizado";

    eventoMensaje.textContent =
    "El Sol ya se ha ocultado y el eclipse ha terminado.";

    eventoAccion.textContent =
    "Esperamos que hayas disfrutado de esta experiencia.";
}

function obtenerAhora(){

    return MODO_PRUEBAS
        ? new Date(FECHA_PRUEBA)
        : new Date();

}

// ==========================================
// PLANETAS VISIBLES DURANTE LA TOTALIDAD
// ==========================================


// Colocar planetas en la imagen

function colocarPlanetas(){


    colocarAstro(
        "grupoVenus",
        planetas.venus
    );


    colocarAstro(
        "grupoMercurio",
        planetas.mercurio
    );


}



// Conversión cielo real -> imagen

function colocarAstro(id, astro){

    let diferencia =
        astro.azimut - vistaFoto.azimutCentro;

    if(diferencia > 180){
        diferencia -= 360;
    }

    if(diferencia < -180){
        diferencia += 360;
    }

    const x =
        400 +
        diferencia * vistaFoto.escalaHorizontal;

    const y =
        vistaFoto.horizonte -
        astro.altura * vistaFoto.escalaVertical;

    const elemento =
        document.getElementById(id);

    if(!elemento) return;

    // Astro dentro de la imagen
    if(x >= 0 && x <= 800 && y >= 0 && y <= 600){

        elemento.style.display = "";

        elemento.setAttribute(
            "transform",
            `translate(${x},${y})`
        );

        return;
    }

    // Si está fuera, ocultamos el astro
    elemento.style.display = "none";

    mostrarIndicador(id, x, y);

}
function mostrarIndicador(id, x, y){

    const indicador =
        document.getElementById(id + "Indicador");

    if(!indicador) return;

    indicador.style.display = "";

    let px = Math.min(Math.max(x,25),775);
    let py = Math.min(Math.max(y,25),575);

    let flecha = "";

    if(y < 0){

        py = 20;
        flecha = "↑";

    }

    else if(y > 600){

        py = 580;
        flecha = "↓";

    }

    else if(x < 0){

        px = 20;
        flecha = "←";

    }

    else if(x > 800){

        px = 780;
        flecha = "→";

    }

    indicador.setAttribute(
        "transform",
        `translate(${px},${py})`
    );

    indicador.querySelector(".flecha")
        .textContent = flecha;

}

actualizar();

setInterval(actualizar,1000);

