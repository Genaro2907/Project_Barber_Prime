// public/admin-script.js

const verifyAdminPin = (async () => {
  const typedPin = window.prompt('Digite o PIN de administrador:');

  if (!typedPin) {
    alert('Acesso negado. PIN não informado.');
    window.location.href = '/';
    return false;
  }

  try {
    const response = await fetch('/api/auth/verify-pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pin: typedPin }),
    });
    const result = await response.json();

    if (response.ok && result.success) {
      return true;
    }

    alert('PIN inválido. Você será redirecionado para a página inicial.');
    window.location.href = '/';
    return false;
  } catch (error) {
    console.error('Error verifying admin PIN:', error);
    alert('Erro ao verificar PIN. Você será redirecionado para a página inicial.');
    window.location.href = '/';
    return false;
  }
})();

document.addEventListener('DOMContentLoaded', async () => {
  const hasValidPin = await verifyAdminPin;
  if (!hasValidPin) {
    return;
  }

  const container = document.getElementById('appointmentsList');
  const adminFeedback = document.getElementById('adminFeedback');
  const statsTotalAppointments = document.getElementById('statsTotalAppointments');
  const statsTodayAppointments = document.getElementById('statsTodayAppointments');
  const statsMostRequestedService = document.getElementById('statsMostRequestedService');
  const statsMostRequestedServiceCount = document.getElementById('statsMostRequestedServiceCount');

  if (!container) {
    return;
  }

  const setStateMessage = (message, isError = false) => {
    container.innerHTML = `<div class="no-data${isError ? ' error' : ''}">${message}</div>`;
  };

  const showAdminFeedback = (message, type) => {
    if (!adminFeedback) {
      return;
    }

    adminFeedback.textContent = message;
    adminFeedback.classList.remove('success', 'error', 'visible');

    if (!message) {
      return;
    }

    adminFeedback.classList.add(type, 'visible');
  };

  const setStatsFallback = () => {
    if (statsTotalAppointments) {
      statsTotalAppointments.textContent = '--';
    }
    if (statsTodayAppointments) {
      statsTodayAppointments.textContent = '--';
    }
    if (statsMostRequestedService) {
      statsMostRequestedService.textContent = '--';
    }
    if (statsMostRequestedServiceCount) {
      statsMostRequestedServiceCount.textContent = '--';
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/appointments/stats');
      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        setStatsFallback();
        showAdminFeedback('Não foi possível carregar as estatísticas.', 'error');
        return;
      }

      const stats = result.data;

      if (statsTotalAppointments) {
        statsTotalAppointments.textContent = String(stats.totalAppointments);
      }
      if (statsTodayAppointments) {
        statsTodayAppointments.textContent = String(stats.todayAppointments);
      }
      if (statsMostRequestedService) {
        statsMostRequestedService.textContent = stats.mostRequestedService;
      }
      if (statsMostRequestedServiceCount) {
        statsMostRequestedServiceCount.textContent = `${stats.mostRequestedServiceCount} agendamentos`;
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setStatsFallback();
      showAdminFeedback('Erro ao carregar estatísticas do painel.', 'error');
    }
  };

  const cancelAppointment = async (appointmentId, customerName) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok && result.success) {
        showAdminFeedback(`Agendamento de ${customerName} cancelado com sucesso.`, 'success');
        await Promise.all([loadAppointments(), loadStats()]);
        return;
      }

      showAdminFeedback(`Erro ao cancelar agendamento: ${result.message}`, 'error');
    } catch (error) {
      console.error('Error canceling appointment:', error);
      showAdminFeedback('Erro de conexão com o servidor. Tente novamente.', 'error');
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
        const professionalName = appointment.professional || 'Não informado';

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
              <span>Profissional:</span>
              <span>${professionalName}</span>
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
      console.error('Error loading appointments:', error);
      setStateMessage('Erro ao conectar com o servidor.', true);
    }
  };

  showAdminFeedback('', 'success');
  await Promise.all([loadStats(), loadAppointments()]);
});
