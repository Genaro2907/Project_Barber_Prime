// public/admin-script.js

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('appointmentsList');

  if (!container) {
    return;
  }

  const setStateMessage = (message, isError = false) => {
    container.innerHTML = `<div class="no-data${isError ? ' error' : ''}">${message}</div>`;
  };

  const cancelAppointment = async (appointmentId, customerName) => {
    const shouldCancel = window.confirm(`Tem certeza que deseja cancelar o agendamento de ${customerName}?`);
    if (!shouldCancel) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok && result.success) {
        await loadAppointments();
        alert('Agendamento cancelado com sucesso.');
        return;
      }

      alert(`Erro ao cancelar agendamento: ${result.message}`);
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Erro de conexão com o servidor. Tente novamente.');
    }
  };

  const loadAppointments = async () => {
    setStateMessage('Carregando agendamentos...');

    try {
      const response = await fetch('/api/appointments');
      const result = await response.json();

      if (!result.success || result.data.length === 0) {
        setStateMessage('Nenhum agendamento encontrado até o momento.');
        return;
      }

      container.innerHTML = '';

      result.data.forEach((appointment) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        const dateParts = appointment.appointmentDate.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        item.innerHTML = `
          <div class="accordion-header">
            <div>
              <h4>${appointment.customerName}</h4>
              <span class="info-resumo">${formattedDate} às ${appointment.appointmentTime}</span>
            </div>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <div class="accordion-content">
            <div class="detail-row">
              <span>Serviço:</span>
              <span>${appointment.service}</span>
            </div>
            <div class="detail-row">
              <span>Telefone:</span>
              <span>${appointment.phoneNumber}</span>
            </div>
            <div class="detail-row">
              <span>Data do Registro:</span>
              <span>${new Date(appointment.createdAt).toLocaleString('pt-BR')}</span>
            </div>
            <div class="appointment-actions">
              <button type="button" class="cancel-appointment-btn">
                <i class="fa-solid fa-xmark"></i>
                Cancelar agendamento
              </button>
            </div>
          </div>
        `;

        item.querySelector('.accordion-header').addEventListener('click', () => {
          item.classList.toggle('active');
        });

        item.querySelector('.cancel-appointment-btn').addEventListener('click', async (event) => {
          event.stopPropagation();
          await cancelAppointment(appointment._id, appointment.customerName);
        });

        container.appendChild(item);
      });
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setStateMessage('Erro ao conectar com o servidor.', true);
    }
  };

  await loadAppointments();
});
