// public/admin-script.js

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('appointmentsList');

  try {
    const response = await fetch('/api/appointments');
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      container.innerHTML = ''; // Limpa o carregando

      result.data.forEach(appointment => {
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
          </div>
        `;

        item.querySelector('.accordion-header').addEventListener('click', () => {
          item.classList.toggle('active');
        });

        container.appendChild(item);
      });
    } else {
      container.innerHTML = '<div class="no-data">Nenhum agendamento encontrado até o momento.</div>';
    }
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    container.innerHTML = '<div class="no-data" style="color: #ff4d4d;">Erro ao conectar com o servidor.</div>';
  }
});