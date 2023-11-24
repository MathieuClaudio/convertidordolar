// Obtener elementos del DOM
const fechaActualizacionElement = document.getElementById('fechaActualizacion');
const blueCompraElement = document.getElementById('blueCompra');
const blueVentaElement = document.getElementById('blueVenta');
const pesosInput = document.getElementById('pesos');
const conversionElement = document.getElementById('conversion');
const blueMonedaElement = document.getElementById('blueMoneda');
const pesoArgentinoElement = document.getElementById('pesoArgentino');

// Función para formatear la fecha y hora en español
function formatearFecha(fecha) {
    try {
        const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        const fechaFormateada = new Date(fecha).toLocaleDateString('es-AR', opcionesFecha);
        return fechaFormateada;
    } catch (error) {
        console.error('Error al formatear la fecha:', error);
        return 'Fecha desconocida';
    }
}

// Función para obtener la cotización del Dólar Blue
async function obtenerCotizacionDolarBlue() {
    try {
        const respuesta = await fetch('https://dolarapi.com/v1/dolares/blue');
        const datos = await respuesta.json();
        console.log(datos);

        // Actualizar elementos HTML con la cotización
        console.log(datos.fechaActualizacion);
        console.log(formatearFecha(datos.fechaActualizacion));
        fechaActualizacionElement.textContent = formatearFecha(datos.fechaActualizacion);
        blueCompraElement.textContent = datos.compra;
        blueVentaElement.textContent = datos.venta;

        return datos;
    } catch (error) {
        console.error('Error al obtener la cotización del Dólar Blue:', error);
    }
}

// Función para convertir pesos a Dólar Blue
function convertirAPesoBlue() {
    const cantidadPesos = parseFloat(pesosInput.value) || 0;
    const cotizacionActual = obtenerCotizacionDolarBlue();

    cotizacionActual.then((cotizacion) => {
        const resultadoConversion = cantidadPesos / cotizacion.venta;

        // Actualizar elementos HTML con el resultado de la conversión
        conversionElement.textContent = resultadoConversion.toFixed(2);
        blueMonedaElement.textContent = 'USD';
        pesoArgentinoElement.textContent = cantidadPesos.toFixed(2) + " ARS = ";
    });
}

// Evento clic en el botón de conversión
const btnConvertir = document.querySelector('.btn-primary');
btnConvertir.addEventListener('click', convertirAPesoBlue);

// Inicializar la aplicación obteniendo la cotización inicial del Dólar Blue
obtenerCotizacionDolarBlue();
