const lat = 39.686147;
const lon = -0.799975;

const hoy = new Date();

const inicioPrevision =
    new Date("2026-08-07");

const diaEclipse =
    new Date("2026-08-12");

async function cargarMeteorologia(){

    const titulo =
        document.getElementById("tituloMeteo");

    let url;

    // ===================================
    // HASTA EL 6 DE AGOSTO
    // ===================================

    if(hoy < inicioPrevision){

        titulo.innerHTML =
        "Condiciones actuales en Casica Roger.";

        url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,cloud_cover,wind_speed_10m,visibility`;

    }

    // ===================================
    // DEL 7 AL 11
    // ===================================

    else if(hoy < diaEclipse){

        titulo.innerHTML =
        "<strong>Previsión para el eclipse</strong><br>12 de agosto · 19:00–21:00";

        url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,cloud_cover,wind_speed_10m,visibility`;

    }

    // ===================================
    // DÍA DEL ECLIPSE
    // ===================================

    else{

        titulo.innerHTML =
        "<strong>Condiciones en tiempo real</strong>";

        url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,cloud_cover,wind_speed_10m,visibility`;

    }

    try{

        const respuesta = await fetch(url);

        const datos = await respuesta.json();

        // CASO ACTUAL
        if(datos.current){

            actualizarTarjeta(datos.current);

        }

        // CASO PREVISIÓN
        else{

            actualizarPrevision(datos);

        }

    }

    catch(error){

        console.error(error);

    }

}

function evaluarCondiciones(actual){

    const caja =
        document.getElementById("estadoObservacion");

    if(actual.cloud_cover < 20){

        caja.innerHTML =
        "★★★★★ <strong>Condiciones excelentes para observar el eclipse.</strong>";

    }

    else if(actual.cloud_cover < 50){

        caja.innerHTML =
        "★★★★☆ <strong>Buenas condiciones de observación.</strong>";

    }

    else if(actual.cloud_cover < 80){

        caja.innerHTML =
        "★★★☆☆ <strong>La nubosidad puede dificultar parte de la observación.</strong>";

    }

    else{

        caja.innerHTML =
        "★☆☆☆☆ <strong>La nubosidad puede impedir observar el eclipse.</strong>";

    }

}

cargarMeteorologia();

function actualizarTarjeta(actual){

    document.getElementById("temp").textContent =
        actual.temperature_2m + "°C";

    document.getElementById("nubes").textContent =
        actual.cloud_cover + "%";

    document.getElementById("viento").textContent =
        actual.wind_speed_10m + " km/h";

    document.getElementById("visibilidad").textContent =
        (actual.visibility/1000).toFixed(1) + " km";

    evaluarCondiciones(actual);

}

function actualizarPrevision(datos){

    const indice =
        datos.hourly.time.findIndex(hora =>
            hora.startsWith("2026-08-12T20:00")
        );

    const actual = {

        temperature_2m:
            datos.hourly.temperature_2m[indice],

        cloud_cover:
            datos.hourly.cloud_cover[indice],

        wind_speed_10m:
            datos.hourly.wind_speed_10m[indice],

        visibility:
            datos.hourly.visibility[indice]

    };

    actualizarTarjeta(actual);

}