document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitButton = bookingForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerText;
      submitButton.innerText = 'Agendando...';
      submitButton.disabled = true;

      const customerName = document.getElementById('nome').value;
      const phoneNumber = document.getElementById('telefone').value;
      const service = document.getElementById('servico').value;
      const appointmentDate = document.getElementById('data').value;
      const appointmentTime = document.getElementById('horario').value;

      const payload = {
        customerName,
        phoneNumber,
        service,
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
          alert('Agendamento realizado com sucesso! Te esperamos na Barbearia Prime.');
          bookingForm.reset();
        } else {
          alert(`Erro ao agendar: ${result.message}`);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de conexão com o servidor. Verifique sua internet ou tente novamente mais tarde.');
      } finally {
        submitButton.innerText = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});