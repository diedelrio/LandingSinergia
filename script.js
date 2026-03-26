// Función principal para enviar datos sin recargar la página
async function enviarFormulario(event, statusId) {
    event.preventDefault();
    const form = event.target;
    const status = document.getElementById(statusId);
    const btn = form.querySelector('button');
    const data = new FormData(form);

    btn.disabled = true;
    btn.innerText = "Enviando...";

    try {
        const response = await fetch("https://formspree.io/f/xwvwezny", {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            status.innerHTML = "¡Listo! Te avisaremos pronto.";
            status.style.color = "#2ecc71";
            status.style.display = "block";
            form.reset();
            // Si es el modal, lo cerramos después de 2 segundos
            if(statusId === 'modal-status') setTimeout(() => cerrarModal(), 2000);
        } else {
            throw new Error();
        }
    } catch (error) {
        status.innerHTML = "Hubo un error. Intentá más tarde.";
        status.style.color = "#e74c3c";
        status.style.display = "block";
    } finally {
        btn.disabled = false;
        btn.innerText = (statusId === 'modal-status') ? "Obtener mi descuento" : "¡Quiero enterarme!";
    }
}

// Lógica del Pop-up de salida
const modal = document.getElementById('exit-modal');
const cerrarModal = () => {
    modal.style.display = 'none';
    localStorage.setItem('popup_visto', 'true');
};

// Se activa cuando el mouse sale de la pantalla (intención de cerrar o cambiar pestaña)
document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0 && !localStorage.getItem('popup_visto')) {
        modal.style.display = 'flex';
    }
});

// Cerrar modal al hacer clic en la X o fuera del cuadro
document.querySelector('.close-modal').onclick = cerrarModal;
window.onclick = (e) => { if (e.target == modal) cerrarModal(); };

// Asignar los eventos a los formularios
document.getElementById('footer-form').onsubmit = (e) => enviarFormulario(e, 'footer-status');
document.getElementById('modal-form').onsubmit = (e) => enviarFormulario(e, 'modal-status');