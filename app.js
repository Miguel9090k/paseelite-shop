window.comprar = function() {
    const playerId = $("playerId")?.value.trim();
    const playerName = $("playerName")?.value.trim();
    const cantidad = parseInt($("cantidad")?.value) || 1;
    
    // Detecta el método de pago elegido
    const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
    const metodoPago = paymentMethodInput ? paymentMethodInput.value : "Nequi";

    if (!playerId) { alert("Escribe tu ID de Free Fire."); return; }
    if (!playerName) { alert("Escribe tu nombre de Free Fire."); return; }
    if (!store.whatsapp) { alert("La tienda no tiene configurado el WhatsApp."); return; }
    
    const total = cantidad * Number(store.priceCOP || 0);
    
    // Mensaje que llega a tu WhatsApp con el método de pago y el aviso del comprobante
    const mensaje = `🔥 NUEVO PEDIDO - PASE ÉLITE\n\n🆔 ID: ${playerId}\n👤 Nombre: ${playerName}\n📦 Cantidad: ${cantidad}\n💰 Total: $${formatoCOP(total)} COP\n💳 Método de pago: ${metodoPago} (3157874619)\n\n📸 *Adjunto la captura de mi transferencia*\n\n🛒 Tienda: PaseEliteShop`;
    
    const numero = String(store.whatsapp).replace(/\D/g, "");
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
};
