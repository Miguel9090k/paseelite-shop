import { auth, db } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const ADMIN_UID = "fhBecoZtqUV8K6Z3pMPlZqxCo7n1";

const $ = (id) => document.getElementById(id);

let configuracion = {
    title: "PASE ÉLITE",
    description: "Consigue tu Pase Élite de Free Fire de forma rápida y segura.",
    priceCOP: 7000,
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

window.login = async function() {
    const email = $("email").value.trim();
    const password = $("password").value;

    if (!email || !password) {
        $("loginMessage").textContent = "⚠️ Escribe tu correo y contraseña.";
        return;
    }

    $("loginMessage").textContent = "⏳ Iniciando sesión...";

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
        $("loginMessage").textContent = "❌ Correo o contraseña incorrectos.";
    }
};

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        mostrarLogin();
        return;
    }

    if (user.uid !== ADMIN_UID) {
        await signOut(auth);
        $("loginMessage").textContent = "❌ Esta cuenta no tiene permisos de administrador.";
        mostrarLogin();
        return;
    }

    mostrarPanel();
    await cargarConfiguracion();
});

function mostrarLogin() {
    $("loginBox").style.display = "block";
    $("adminPanel").style.display = "none";
}

function mostrarPanel() {
    $("loginBox").style.display = "none";
    $("adminPanel").style.display = "block";
}

async function cargarConfiguracion() {
    try {
        const referencia = doc(db, "config", "store");
        const resultado = await getDoc(referencia);

        if (resultado.exists()) {
            configuracion = {
                ...configuracion,
                ...resultado.data()
            };
        }

        llenarFormulario();
    } catch (error) {
        console.error(error);
        $("message").textContent = "❌ No se pudo cargar la configuración.";
    }
}

function llenarFormulario() {
    $("title").value = configuracion.title || "";
    $("description").value = configuracion.description || "";
    $("priceCOP").value = configuracion.priceCOP || 0;
    $("priceUSD").value = configuracion.priceUSD || 0;
    $("whatsapp").value = configuracion.whatsapp || "";

    $("benefits").value = JSON.stringify(configuracion.benefits || [], null, 2);
    $("topBuyers").value = JSON.stringify(configuracion.topBuyers || [], null, 2);
    $("faq").value = JSON.stringify(configuracion.faq || [], null, 2);
}

window.guardar = async function() {
    const usuario = auth.currentUser;

    if (!usuario || usuario.uid !== ADMIN_UID) {
        $("message").textContent = "❌ No tienes permisos.";
        return;
    }

    try {
        const benefits = JSON.parse($("benefits").value);
        const topBuyers = JSON.parse($("topBuyers").value);
        const faq = JSON.parse($("faq").value);

        const nuevaConfiguracion = {
            title: $("title").value.trim(),
            description: $("description").value.trim(),
            priceCOP: Number($("priceCOP").value),
            priceUSD: Number($("priceUSD").value),
            whatsapp: $("whatsapp").value.trim(),
            benefits,
            topBuyers,
            faq
        };

        $("message").textContent = "⏳ Guardando cambios...";

        await setDoc(doc(db, "config", "store"), nuevaConfiguracion);

        configuracion = nuevaConfiguracion;

        $("message").textContent = "✅ ¡Cambios guardados correctamente!";
    } catch (error) {
        console.error(error);
        $("message").textContent = "❌ Revisa que Beneficios, Top compradores y FAQ tengan un formato JSON válido.";
    }
};

window.logout = async function() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
    }
};
