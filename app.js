// ==========================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ==========================================
const store = {
    whatsapp: "573157874619", // Reemplaza o asegúrate de que tome tu número configurado
    priceCOP: 7000
};

// Función auxiliar para seleccionar elementos por ID
function $(id) {
    return document.getElementById(id);
}

// Formateador de moneda en pesos colombianos
function formatoCOP(valor) {
    return new Intl.NumberFormat('es-CO').format(valor);
}

// ==========================================
// CONTROL DE CANTIDAD DE PASES
// ==========================================
window.changeQuantity = function(change) {
    const inputCantidad = $("cantidad");
    if (!inputCantidad) return;

    let cantidadActual = parseInt(inputCantidad.value) || 1;
    let nuevaCantidad = cantidadActual + change;

    if (nuevaCantidad < 1) {
        nuevaCantidad = 1;
    }

    inputCantidad.value = nuevaCantidad;

    // Actualizar el texto del total en pantalla
    const totalBox = $("total");
    if (totalBox) {
        const total = nuevaCantidad * store.priceCOP;
        totalBox.textContent = `$${formatoCOP(total)} COP`;
    }
};

// ==========================================
// PROCESO DE COMPRA (MODAL DE PAGO)
// ==========================================

// 1. Se ejecuta al hacer clic en "PEDIR POR WHATSAPP"
window.comprar = function() {
    const playerId = $("playerId")?.value.trim();
    const playerName = $("playerName")?.value.trim();

    if (!playerId) {
        alert("Por favor, escribe tu ID de Free Fire.");
        return;
    }

    if (!playerName) {
        alert("Por favor, escribe tu nombre de Free Fire.");
        return;
    }

    if (!store.whatsapp) {
        alert("La tienda todavía no tiene configurado el número de WhatsApp.");
        return;
    }

    // Muestra la ventana emergente (modal) de método de pago
    const modal = $("paymentModal");
    if (modal) {
        modal.style.display = "flex";
    }
};

// 2. Cierra la ventana flotante si el usuario cancela
window.cerrarModalPago = function() {
    const modal = $("paymentModal");
    if (modal) {
        modal.style.display = "none";
    }
};

// 3. Confirma el método seleccionado y abre el WhatsApp con los datos
window.confirmarYEnviarWhatsApp = function() {
    const playerId = $("playerId")?.value.trim();
    const playerName = $("playerName")?.value.trim();
    const cantidad = parseInt($("cantidad")?.value) || 1;

    // Obtener el método de pago seleccionado en la ventana flotante
    const selectedInput = document.querySelector('input[name="modalPaymentMethod"]:checked');
    const metodoPago = selectedInput ? selectedInput.value : "Nequi";

    const total = cantidad * store.priceCOP;

    // Armar el mensaje para WhatsApp
    const mensaje = `🔥 NUEVO PEDIDO - PASE ÉLITE

🆔 ID: ${playerId}
👤 Nombre: ${playerName}
📦 Cantidad: ${cantidad}
💰 Total: $${formatoCOP(total)} COP
💳 Método de pago: ${metodoPago} (3157874619)

📸 *Adjunto la captura de mi transferencia*

🛒 Tienda: PaseEliteShop`;

    const numeroLimpio = String(store.whatsapp).replace(/\D/g, "");
    const urlWhatsApp = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;

    // Cerrar modal y abrir WhatsApp en otra pestaña
    cerrarModalPago();
    window.open(urlWhatsApp, "_blank");
};
