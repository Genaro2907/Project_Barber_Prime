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

  const bookingTotal = document.getElementById('bookingTotal');

  const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const servicesDropdown = document.getElementById('servicesDropdown');
  const servicesToggle = servicesDropdown ? servicesDropdown.querySelector('.multi-select-toggle') : null;
  const servicesText = servicesDropdown ? servicesDropdown.querySelector('.multi-select-text') : null;
  const servicesCount = servicesDropdown ? servicesDropdown.querySelector('.multi-select-count') : null;
  const servicesMenu = servicesDropdown ? servicesDropdown.querySelector('.multi-select-menu') : null;
  const serviceCheckboxes = servicesDropdown
    ? Array.from(servicesDropdown.querySelectorAll('input[type="checkbox"]'))
    : [];

  const populateTimeOptions = () => {
    const timeSelect = document.getElementById('horario');
    if (!timeSelect) return;

    timeSelect.innerHTML = '';
    const pad = (n) => String(n).padStart(2, '0');
    let hour = 8;
    let minute = 0;
    while (hour < 17 || (hour === 17 && minute === 0)) {
      // last start should be 16:30, stop when hour===17
      if (hour === 17) break;
      const hh = pad(hour);
      const mm = pad(minute);
      const value = `${hh}:${mm}`;
      const opt = document.createElement('option');
      opt.value = value;
      opt.text = value;
      timeSelect.appendChild(opt);

      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour += 1;
      }
      if (hour === 17) break; // stop adding start times at 16:30
    }
  };

  const updateBookingTotal = () => {
    if (!bookingTotal) return;
    if (!serviceCheckboxes.length) { bookingTotal.textContent = `Total: ${formatCurrency(0)}`; return; }
    const selected = serviceCheckboxes.filter((opt) => opt.checked);
    const total = selected.reduce((acc, opt) => {
      const p = Number(opt.getAttribute('data-price')) || 0;
      return acc + p;
    }, 0);
    bookingTotal.textContent = `Total: ${formatCurrency(total)}`;
  };

  const updateServicesSummary = () => {
    if (!servicesText || !servicesCount || !servicesDropdown) return;
    const selected = serviceCheckboxes.filter((opt) => opt.checked);
    if (selected.length === 0) {
      servicesText.textContent = 'Selecione os serviços';
      servicesCount.textContent = '';
      servicesDropdown.classList.remove('has-selection');
      return;
    }
    const names = selected.map((opt) => opt.value);
    let summary = names.join(', ');
    if (summary.length > 32) {
      summary = `${names[0]} +${names.length - 1}`;
    }
    servicesText.textContent = summary;
    servicesCount.textContent = `${selected.length} selecionado${selected.length > 1 ? 's' : ''}`;
    servicesDropdown.classList.add('has-selection');
  };

  const closeServicesMenu = () => {
    if (!servicesDropdown || !servicesToggle) return;
    servicesDropdown.classList.remove('open');
    servicesToggle.setAttribute('aria-expanded', 'false');
  };

  if (servicesToggle && servicesMenu && servicesDropdown) {
    servicesToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = servicesDropdown.classList.toggle('open');
      servicesToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  serviceCheckboxes.forEach((opt) => {
    opt.addEventListener('change', () => {
      updateServicesSummary();
      updateBookingTotal();
    });
  });

  document.addEventListener('click', (event) => {
    if (servicesDropdown && !servicesDropdown.contains(event.target)) {
      closeServicesMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeServicesMenu();
    }
  });

  populateTimeOptions();
  updateServicesSummary();
  updateBookingTotal();

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
      const professional = document.getElementById('profissional').value;
      const appointmentDate = document.getElementById('data').value;
      const appointmentTime = document.getElementById('horario').value;

      const selectedOptions = serviceCheckboxes.filter((opt) => opt.checked);
      const services = selectedOptions.map((opt) => opt.value);
      const totalPrice = selectedOptions.reduce((acc, opt) => acc + (Number(opt.getAttribute('data-price')) || 0), 0);

      if (services.length === 0) {
        showBookingFeedback('Selecione ao menos um serviço.', 'error');
        submitButton.innerText = originalButtonText;
        submitButton.disabled = false;
        return;
      }

      const payload = {
        customerName,
        phoneNumber,
        services,
        professional,
        appointmentDate,
        appointmentTime,
        totalPrice,
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
          updateServicesSummary();
          updateBookingTotal();
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
