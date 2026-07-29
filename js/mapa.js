/* ==========================================
   MAPA - 
========================================== */

// Coordenadas del punto de observación
const destino = L.latLng(
    DATOS_PUNTO.ubicacion.lat,
    DATOS_PUNTO.ubicacion.lng
);

// Crear mapa
const mapa = L.map("mapa", {
    zoomControl: true
}).setView(destino, 14);

// Satélite ESRI
L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles © Esri"
    }
).addTo(mapa);

// Marcador del destino
const marcadorDestino = L.marker(destino)
    .addTo(mapa)
    .bindPopup(`
    <strong>📍 ${DATOS_PUNTO.nombre}</strong><br>
    Punto recomendado para observar el eclipse.
`);

marcadorDestino.openPopup();

// Obtener ubicación del usuario
if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

        function (posicion) {

            const origen = L.latLng(
                posicion.coords.latitude,
                posicion.coords.longitude
            );

            mostrarRuta(origen);

        },

        function () {

            console.log("No se pudo obtener la ubicación.");

        }

    );

}


/* ==========================================
   RUTA
========================================== */

function mostrarRuta(origen) {

    // Marcador del usuario
    L.marker(origen)
        .addTo(mapa)
        .bindPopup("📍 Tu ubicación");

    // ========= RUTA EN COCHE =========

    const rutaCoche = L.Routing.control({

        waypoints: [
            origen,
            destino
        ],

        router: L.Routing.osrmv1({
            profile: "car"
        }),

        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false,

        lineOptions: {
            styles: [{
                color: "#F6B800",
                opacity: 0.95,
                weight: 6
            }]
        },

        createMarker: function () {
            return null;
        }

    }).addTo(mapa);

    rutaCoche.on("routesfound", function (e) {

        const ruta = e.routes[0];

        const km = (ruta.summary.totalDistance / 1000).toFixed(1);

        const minutos = Math.round(ruta.summary.totalTime / 60);

        document.getElementById("rutaCoche").innerHTML =
            `${km} km · ${minutos} min`;

    });

}
/* ==========================================
   NAVEGACIÓN
========================================== */

document
.getElementById("btnNavegar")
.addEventListener("click", iniciarNavegacion);

function iniciarNavegacion(){

    const url =
        `https://www.google.com/maps/dir/?api=1&destination=${destino.lat},${destino.lng}`;

    window.open(url, "_blank");

}
