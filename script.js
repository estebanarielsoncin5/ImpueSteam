// Variable global para almacenar el valor del dólar (se actualiza sola)
let valor_dolar_mp = 0; 
const iva = 0.21; 
const iibb = 0.02;

const miFormulario = document.getElementById("myForm");
const resultadoElement = document.getElementById("resultado");

// --- FUNCIÓN PARA OBTENER EL DÓLAR AUTOMÁTICAMENTE ---
async function obtenerDolar() {
    try {
        // Usamos una API pública para obtener cotizaciones
        // 'tarjeta' suele ser la referencia más cercana para compras digitales + impuestos
        // Si prefieres el oficial puro, cambia la URL a .../dolares/oficial
        const response = await fetch("https://dolarapi.com/v1/dolares/blue");
        const data = await response.json();

        // data.venta es el valor de venta del dólar tarjeta
        valor_dolar_mp = parseFloat(data.venta);
        
        console.log(`Dólar actualizado: $${valor_dolar_mp}`);
        
        // Opcional: Mostrar en el HTML que ya cargó el precio
        if(resultadoElement) {
            resultadoElement.textContent = `Dólar hoy cargado: $${valor_dolar_mp}`;
        }

    } catch (error) {
        console.error("Error al obtener el dólar:", error);
        // Fallback: Si falla la API, usamos un valor estimado por seguridad
        valor_dolar_mp = 1450; 
        resultadoElement.textContent = "Error cargando dólar. Usando valor estimado.";
    }
}

// Llamamos a la función apenas carga el script
obtenerDolar();

// --- TU LÓGICA DE FORMULARIO ---
miFormulario.addEventListener('submit', (event) => {
    event.preventDefault();

    if (valor_dolar_mp === 0) {
        resultadoElement.textContent = "Aguarde, cargando cotización del dólar...";
        return;
    }

    const datos = new FormData(miFormulario);
    
    // ★ 1. Obtenemos el valor como texto puro primero
    let valorInput = datos.get('precioJuego'); // Ej: "1.200,50" o "1200,50"

    // ★ 2. Normalizamos el formato español al formato inglés (JS)
    // a. Quitamos los puntos de los miles (si el usuario los puso)
    valorInput = valorInput.replace(/\./g, ''); 
    // b. Cambiamos la coma decimal por un punto
    valorInput = valorInput.replace(',', '.');

    // ★ 3. Ahora sí convertimos a número flotante
    const precioJuego = parseFloat(valorInput);

    // ★ 4. Validación extra: Si el usuario escribió letras o nada
    if (isNaN(precioJuego)) {
        resultadoElement.textContent = "Por favor, ingresa un número válido.";
        return;
    }

    // --- CÁLCULOS (Tu lógica original) ---
    let precio_sin_impuestos = precioJuego * valor_dolar_mp;
    let precioFinal = precio_sin_impuestos * (1 + iva + iibb);

    let precioFormateado = precioFinal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    document.getElementById("resultado").textContent = `El precio final es: ${precioFormateado}`;
});