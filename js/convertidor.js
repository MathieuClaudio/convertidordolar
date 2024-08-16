// Obtener elementos del DOM
const fechaActualizacionElement = document.getElementById('fechaActualizacion');
const blueCompraElement = document.getElementById('blueCompra');
const blueVentaElement = document.getElementById('blueVenta');
const pesosInput = document.getElementById('pesos');
const conversionElement = document.getElementById('conversion');
const blueMonedaElement = document.getElementById('blueMoneda');
const pesoArgentinoElement = document.getElementById('pesoArgentino');
const loadingElement = document.querySelector("div#loading");


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
async function obtenerCotizacionDolarBlue(tipo = "blue") {
    try {
        const respuesta = await fetch('https://dolarapi.com/v1/dolares/' + tipo);
        const datos = await respuesta.json();

        // Actualizar elementos HTML con la cotización
        fechaActualizacionElement.textContent = formatearFecha(datos.fechaActualizacion);
        blueCompraElement.textContent = datos.compra;
        blueVentaElement.textContent = datos.venta;

        return datos;
    } catch (error) {
        console.error('Error al obtener la cotización del Dólar Blue:', error);
    }
}


// Función para convertir pesos a Dólar Blue o viceversa
function convertirAPesoBlue() {
    const cantidadPesos = parseFloat(pesosInput.value) || 0;
    const direccionConversion = document.getElementById('direccionConversion').value;
    const tipoDolarElement = document.getElementById('tipoDolar').value;
    const cotizacionActual = obtenerCotizacionDolarBlue(tipoDolarElement);
    loadingElement.style.display = "block";

    cotizacionActual.then((cotizacion) => {
        let resultadoConversion;

        if (direccionConversion === 'pesoADolar') {
            resultadoConversion = cantidadPesos / cotizacion.venta;
            blueMonedaElement.textContent = 'USD';
            pesoArgentinoElement.textContent = cantidadPesos.toFixed(2) + " ARS = ";
        } else if (direccionConversion === 'dolarAPeso') {
            resultadoConversion = cantidadPesos * cotizacion.compra;
            blueMonedaElement.textContent = 'ARS';
            pesoArgentinoElement.textContent = cantidadPesos.toFixed(2) + " USD = ";
        }
        dolarTipoCoversion.textContent = 'Tipo de dolar usado para la conversión: ' + tipoDolarElement;
        // Actualizar elementos HTML con el resultado de la conversión
        // Agregué un timer para darle un efecto de tardanza 
        setTimeout(() => {
            conversionElement.textContent = resultadoConversion.toFixed(2);
            loadingElement.style.display = "none";
            $('#mensaje').addClass('show');
        }, 2000);
    });
}

// Evento clic en el botón de Convertir a Dolar
const btnConvertir = document.querySelector('.btn-primary');
btnConvertir.addEventListener('click', convertirAPesoBlue);

// Inicializar la aplicación obteniendo la cotización inicial del Dólar Blue
obtenerCotizacionDolarBlue();
