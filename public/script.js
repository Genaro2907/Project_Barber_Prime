document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');
  const bookingFeedback = document.getElementById('bookingFeedback');

  const showBookingFeedback = (message, type) => {
    if (!bookingFeedback) {
      return;
    }

    bookingFeedback.textContent = message;
    bookingFeedback.classList.remove('success', 'error', 'visible');

    if (!message) {
      return;
    }

    bookingFeedback.classList.add(type, 'visible');
  };

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showBookingFeedback('', 'success');

      const submitButton = bookingForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerText;
      submitButton.innerText = 'Agendando...';
      submitButton.disabled = true;

      const customerName = document.getElementById('nome').value;
      const phoneNumber = document.getElementById('telefone').value;
      const service = document.getElementById('servico').value;
      const professional = document.getElementById('profissional').value;
      const appointmentDate = document.getElementById('data').value;
      const appointmentTime = document.getElementById('horario').value;

      const payload = {
        customerName,
        phoneNumber,
        service,
        professional,
        appointmentDate,
        appointmentTime
      };

      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showBookingFeedback('Agendamento confirmado! Obrigado!', 'success');
          bookingForm.reset();
        } else {
          showBookingFeedback(`Erro ao agendar: ${result.message}`, 'error');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        showBookingFeedback('Erro de conexão com o servidor. Verifique sua internet ou tente novamente mais tarde.', 'error');
      } finally {
        submitButton.innerText = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});
