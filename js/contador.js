const fechaEclipse = new Date(
    "2026-08-12T20:32:09+02:00"
);


function actualizarContadorWeb(){


    const ahora = new Date();


    let diferencia =
    fechaEclipse - ahora;


    if(diferencia < 0){

        diferencia = 0;

    }


    const dias =
    Math.floor(
        diferencia / (1000*60*60*24)
    );


    const horas =
    Math.floor(
        (diferencia % (1000*60*60*24))
        /(1000*60*60)
    );


    const minutos =
    Math.floor(
        (diferencia % (1000*60*60))
        /(1000*60)
    );


    const segundos =
    Math.floor(
        (diferencia % (1000*60))
        /(1000)
    );


    document.getElementById("dias-web").textContent = dias;

    document.getElementById("horas-web").textContent = horas;

    document.getElementById("minutos-web").textContent = minutos;

    document.getElementById("segundos-web").textContent = segundos;


}


actualizarContadorWeb();


setInterval(
    actualizarContadorWeb,
    1000
);