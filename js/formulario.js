(function () {
    'use strict';

    const form = document.querySelector('#formulario');
    const familia = document.querySelector('#familia');
    const familiaError = document.querySelector('#familia-error');
    const invitados = document.querySelector('#invitados');
    const invitadosError = document.querySelector('#invitados-error');

    const setError = (input, errorElement, message) => {
        errorElement.textContent = message;
        input.classList.toggle('is-invalid', Boolean(message));
        input.setAttribute('aria-invalid', String(Boolean(message)));
    };

    const validateFamilia = () => {
        if (!familia.value.trim()) return 'Este campo es obligatorio.';
        return '';
    };

    const validateInvitados = () => {
        const value = invitados.value.trim();
        if (!value) return 'Ingresa al menos un invitado.';

        const names = value.split(',').map((name) => name.trim());
        if (names.some((name) => !name)) {
            return 'Escribe un nombre por invitado, separados por coma.';
        }
        return '';
    };

    form.addEventListener('submit', (event) => {
        const familiaMessage = validateFamilia();
        const invitadosMessage = validateInvitados();

        setError(familia, familiaError, familiaMessage);
        setError(invitados, invitadosError, invitadosMessage);

        if (familiaMessage) {
            event.preventDefault();
            familia.focus();
            return;
        }
        if (invitadosMessage) {
            event.preventDefault();
            invitados.focus();
        }
    });

    familia.addEventListener('input', () => {
        if (!familiaError.textContent) return;
        setError(familia, familiaError, validateFamilia());
    });

    invitados.addEventListener('input', () => {
        if (!invitadosError.textContent) return;
        setError(invitados, invitadosError, validateInvitados());
    });
})();
