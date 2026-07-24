// ==========================================
// MAPA GENERAL ECLIPSE 2026
// ==========================================


// Crear mapa

const mapa = L.map("mapa-eclipse");



// Base OpenStreetMap

L.tileLayer(

"https://tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:
"&copy; OpenStreetMap contributors"

}

).addTo(mapa);




// ==========================================
// PUNTOS DE OBSERVACIÓN
// ==========================================


const puntos = [


{
nombre:"Villar del Arzobispo",

lat:39.73244,

lng:-0.825872,

tipo:"pueblo",

descripcion:
"🏘️ Punto de referencia del municipio."

},


{
nombre:"Casica Roger",

lat:39.686147,

lng:-0.799975,

tipo:"mejor",

descripcion:
"🏆 Mejor visibilidad del eclipse.",

distanciaCoche:
"🚗 10 min · 7.2 km",

url:
"puntos/casica-roger.html"

},



{
nombre:"La Loma",

lat:39.738317,

lng:-0.823408,

tipo:"acceso",

descripcion:
"🚶 Acceso fácil y próximo al núcleo urbano.",

distanciaCoche:
"🚗 6 min · 4 km",

url:
"puntos/la-loma.html"

},



{
nombre:"Cerro Castellar",

lat:39.726306,

lng:-0.851369,

tipo:"espacio",

descripcion:
"🌄 Espacio amplio con buenas vistas del horizonte.",

distanciaCoche:
"🚗 9 min · 7 km",

url:
"puntos/cerro-castellar.html"

}


];




// ==========================================
// ICONOS
// ==========================================


function icono(tipo){


let emoji = "🌄";


if(tipo==="pueblo"){

emoji="🏘️";

}


if(tipo==="mejor"){

emoji="🏆";

}


if(tipo==="acceso"){

emoji="🚶";

}



return L.divIcon({

html:
`
<div class="marcador-personalizado">
${emoji}
</div>
`,

className:"icono-mapa",

iconSize:[45,45],

iconAnchor:[22,45],

popupAnchor:[0,-45]

});


}





// ==========================================
// AÑADIR MARCADORES
// ==========================================


puntos.forEach(p=>{


const marcador = L.marker(

[p.lat,p.lng],

{

icon:
icono(p.tipo)

}

)

.addTo(mapa);



marcador.bindPopup(`

<h3>
${p.nombre}
</h3>

<p>
${p.descripcion}
</p>

<p>
${p.distanciaCoche || ""}
</p>

${
p.url

?

`<a href="${p.url}">
Ver información →
</a>`

:

""

}

`);


});




// ==========================================
// AJUSTAR VISTA DEL MAPA
// ==========================================


const limites = L.latLngBounds(

puntos.map(p=>[

p.lat,

p.lng

])

);



mapa.fitBounds(

limites,

{

padding:[50,50]

}

);




// ==========================================
// UBICACIÓN DEL USUARIO
// ==========================================


let usuario = null;

const botonUbicacion =
document.getElementById("boton-ubicacion");


function obtenerUbicacion(){


if(!navigator.geolocation){

alert(
"Tu navegador no permite obtener ubicación."
);

return;

}



navigator.geolocation.getCurrentPosition(

pos=>{


usuario=[

pos.coords.latitude,

pos.coords.longitude

];



L.marker(

usuario,

{

icon:
L.divIcon({

html:"📍",

className:"icono-mapa",

iconSize:[45,45],

iconAnchor:[22,45]

})

}

)

.addTo(mapa)

.bindPopup(
"📍 Tu ubicación"
)

.openPopup();



calcularDistancias();


recomendarPunto();



},

()=>{


document.getElementById(
"lista-distancias"
)

.innerHTML=

"📍 No se pudo obtener tu ubicación.";


}

);


}



botonUbicacion.addEventListener(

"click",

obtenerUbicacion()

);








// ==========================================
// CALCULAR DISTANCIAS
// ==========================================


function calcularDistancias(){


if(!usuario){

return;

}


let texto="";



puntos.forEach(p=>{


if(p.tipo==="pueblo"){

return;

}



const distancia =

mapa.distance(

usuario,

[

p.lat,

p.lng

]

)

/
1000;



texto += `

<div class="distancia-item">

<strong>
${p.nombre}
</strong>

<br>

${distancia.toFixed(1)}
km desde tu ubicación

</div>

`;



});



document.getElementById(
"lista-distancias"
)

.innerHTML = texto;


}

function recomendarPunto(){


let mejor=null;

let distanciaMenor=Infinity;



puntos.forEach(p=>{


if(p.tipo==="pueblo")
return;



const distancia=

mapa.distance(

usuario,

[p.lat,p.lng]

);



if(distancia < distanciaMenor){

distanciaMenor=distancia;

mejor=p;

}


});



const km =
(distanciaMenor/1000).toFixed(1);



document.getElementById(
"lista-distancias"
)

.innerHTML += `


<div class="recomendacion">


🌟 <strong>
Punto más cercano:
</strong>

<br>

${mejor.nombre}

(${km} km)


</div>


`;



}