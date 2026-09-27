import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

let store = {
    title: "PASE ÉLITE",
    description: "Consigue tu Pase Élite de Free Fire de forma rápida y segura.",
    priceCOP: 8000, // Actualizado a 8000 para evitar que parpadee al recargar
    priceUSD: 2.09,
    whatsapp: "",
    benefits: [
        {
            icon: "🎁",
            title: "Recompensas",
            text: "Obtén recompensas exclusivas."
        },
        {
            icon: "💎",
            title: "Contenido exclusivo",
            text: "Disfruta contenido especial."
        },
        {
            icon: "⚡",
            title: "Entrega rápida",
            text: "Procesamos tu pedido rápidamente."
        }
    ],
    topBuyers: [
        {
            name: "Jugador",
            passes: 10
        },
        {
            name: "Jugador",
            passes: 5
        },
        {
            name: "Jugador",
            passes: 3
        }
    ],
    faq: [
        {
            question: "¿Cómo recibo mi Pase Élite?",
            answer: "Después de confirmar tu pedido recibirás las instrucciones correspondientes por WhatsApp."
        },
        {
            question: "¿Qué necesito para comprar?",
            answer: "Necesitas tu ID y nombre de jugador de Free Fire."
        },
        {
            question: "¿Dónde hago el pedido?",
            answer: "El pedido se realiza directamente por WhatsApp."
        }
    ]
};

const $ = (id) => document.getElementById(id);

function formatoCOP(valor) {
    return Number(valor || 0).toLocaleString("es-CO");
}

function actualizarTotal() {
    const cantidadInput = $("cantidad");

    if (!cantidadInput) return;

    let cantidad = parseInt(cantidadInput.value) || 1;

    if (cantidad < 1) {
        cantidad = 1;
    }

    cantidadInput.value = cantidad;

    const total = cantidad * Number(store.priceCOP || 0);

    const totalElement = $("total");

    if (totalElement) {
        totalElement.textContent = `$${formatoCOP(total)} COP`;
    }
}

window.changeQuantity = function(cambio) {
    const input = $("cantidad");

    if (!input) return;

    let cantidad = parseInt(input.value) || 1;

    cantidad += cambio;

    if (cantidad < 1) {
        cantidad = 1;
    }

    input.value = cantidad;

    actualizarTotal();
};

function renderStore() {
    const title = $("storeTitle");

    if (title) {
        title.textContent = store.title;
    }

    const description = $("storeDescription");

    if (description) {
        description.textContent = store.description;
    }

    const priceCOP = $("priceCOP");

    if (priceCOP) {
        priceCOP.textContent =
            `$${formatoCOP(store.priceCOP)} COP`;
    }

    const priceUSD = $("priceUSD");

    if (priceUSD) {
        priceUSD.textContent =
            `US$${Number(store.priceUSD || 0).toFixed(2)}`;
    }

    renderBenefits();
    renderTopBuyers();
    renderFAQ();

    actualizarTotal();
}

function renderBenefits() {
    const container = $("benefits");

    if (!container) return;

    container.innerHTML = "";

    const benefits = Array.isArray(store.benefits)
        ? store.benefits
        : [];

    benefits.forEach((benefit) => {
        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <span>${benefit.icon || "🔥"}</span>

            <h3>${benefit.title || "Beneficio"}</h3>

            <p>${benefit.text || ""}</p>
        `;

        container.appendChild(card);
    });
}

function renderTopBuyers() {
    const container = $("topBuyers");

    if (!container) return;

    container.innerHTML = "";

    const buyers = Array.isArray(store.topBuyers)
        ? store.topBuyers
        : [];

    buyers.forEach((buyer, index) => {
        const element = document.createElement("div");

        element.className = "buyer";

        element.innerHTML = `
            <strong>#${index + 1}</strong>

            <span>
                ${buyer.name || "Jugador"}
            </span>

            <b>
                ${buyer.passes || 0} Pases
            </b>
        `;

        container.appendChild(element);
    });
}

function renderFAQ() {
    const container = $("faq");

    if (!container) return;

    container.innerHTML = "";

    const faq = Array.isArray(store.faq)
        ? store.faq
        : [];

    faq.forEach((item) => {
        const details = document.createElement("details");

        details.innerHTML = `
            <summary>
                ${item.question || "Pregunta"}
            </summary>

            <p>
                ${item.answer || ""}
            </p>
        `;

        container.appendChild(details);
    });
}

async function cargarConfiguracion() {
    try {
        const ref = doc(db, "config", "store");

        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
            store = {
                ...store,
                ...snapshot.data()
            };
        }

        renderStore();

    } catch (error) {
        console.error(
            "Error cargando configuración:",
            error
        );

        renderStore();
    }
}

window.comprar = function() {
    const playerId = $("playerId")?.value.trim();
    const playerName = $("playerName")?.value.trim();

    if (!playerId) {
        alert("Escribe tu ID de Free Fire.");
        return;
    }

    if (!playerName) {
        alert("Escribe tu nombre de Free Fire.");
        return;
    }

    if (!store.whatsapp) {
        alert(
            "La tienda todavía no tiene configurado el WhatsApp."
        );
        return;
    }

    const modal = $("paymentModal");
    if (modal) {
        modal.style.display = "flex";
    }
};

window.cerrarModalPago = function() {
    const modal = $("paymentModal");
    if (modal) {
        modal.style.display = "none";
    }
};

window.confirmarYEnviarWhatsApp = function() {
    const playerId = $("playerId")?.value.trim();
    const playerName = $("playerName")?.value.trim();
    const cantidad = parseInt($("cantidad")?.value) || 1;

    const selectedInput = document.querySelector('input[name="modalPaymentMethod"]:checked');
    const metodoPago = selectedInput ? selectedInput.value : "Nequi";

    const total =
        cantidad * Number(store.priceCOP || 0);

    const mensaje = `🔥 NUEVO PEDIDO - PASE ÉLITE

🆔 ID: ${playerId}
👤 Nombre: ${playerName}
📦 Cantidad: ${cantidad}
💰 Total: $${formatoCOP(total)} COP
💳 Método de pago: ${metodoPago}

🛒 Tienda: PaseEliteShop`;

    const numero = String(store.whatsapp)
        .replace(/\D/g, "");

    const url =
        `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    cerrarModalPago();
    window.open(url, "_blank");
};

document.addEventListener("DOMContentLoaded", () => {
    const cantidad = $("cantidad");

    if (cantidad) {
        cantidad.addEventListener(
            "change",
            actualizarTotal
        );
    }

    cargarConfiguracion();
});
