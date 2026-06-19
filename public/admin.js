// ==================== ADMIN JS ==================== 

class AdminDashboard {
  constructor() {
    this.token = localStorage.getItem('adminToken');
    this.baseUrl = '/api';
    this.currentReservas = [];
    this.currentReservaDetail = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    
    if (this.token) {
      this.verifyToken();
    } else {
      this.showLoginPage();
    }
  }

  setupEventListeners() {
    // Login
    document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
    
    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());
    
    // Filters
    document.getElementById('filter-status')?.addEventListener('change', () => this.filterReservas());
    document.getElementById('search-input')?.addEventListener('input', () => this.filterReservas());
    
    // Export
    document.getElementById('export-btn')?.addEventListener('click', () => this.exportCSV());
    
    // Modal
    document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closeModal());
    document.getElementById('btn-confirm')?.addEventListener('click', () => this.updateReservaStatus('confirmada'));
    document.getElementById('btn-cancel')?.addEventListener('click', () => this.updateReservaStatus('cancelada'));
    
    // Click outside modal to close
    document.getElementById('detail-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'detail-modal') {
        this.closeModal();
      }
    });
  }

  // ==================== AUTENTICAÇÃO ====================

  async handleLogin(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const errorDiv = document.getElementById('login-error');

    try {
      this.showLoading(true);
      
      const response = await fetch(`${this.baseUrl}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Armazenar token
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminName', data.admin.nome);
      
      this.token = data.token;
      this.showToast('Login realizado com sucesso!', 'success');
      
      // Mostrar painel após login
      document.getElementById('login-container').classList.remove('show');
      document.getElementById('dashboard-container').classList.add('show');
      // Atualizar nome do admin na UI
      const adminName = localStorage.getItem('adminName') || 'Admin';
      document.getElementById('admin-name').textContent = adminName;
      // Carregar reservas
      this.loadReservas();
    document.getElementById('dashboard-container').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.style.display = 'block';
      this.showToast(error.message, 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async verifyToken() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        this.showDashboard();
      } else {
        throw new Error('Token inválido');
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminName');
      this.token = null;
      this.showLoginPage();
    }
  }

  logout() {
    const confirm = window.confirm('Tem certeza que deseja sair?');
    if (!confirm) return;

    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    this.token = null;
    
    this.showLoginPage();
    this.showToast('Logout realizado com sucesso!', 'success');
  }

  // ==================== UI ====================

  showLoginPage() {
    document.getElementById('login-container').classList.add('show');
    document.getElementById('dashboard-container').classList.remove('show');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').style.display = 'none';
  }

  showDashboard() {
    document.getElementById('login-container').classList.remove('show');
    document.getElementById('dashboard-container').classList.add('show');
    
    const adminName = localStorage.getItem('adminName') || 'Admin';
    document.getElementById('admin-name').textContent = adminName;
    
    this.loadReservas();
  }

  showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
      overlay.style.display = 'flex';
    } else {
      overlay.style.display = 'none';
    }
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  // ==================== RESERVAS ====================

  async loadReservas() {
    try {
      this.showLoading(true);
      
      const response = await fetch(`${this.baseUrl}/reservas`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar reservas');
      }

      this.currentReservas = await response.json();
      this.renderReservas(this.currentReservas);
      this.updateStats();

    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.showLoading(false);
    }
  }

  renderReservas(reservas) {
    const tbody = document.getElementById('reservas-tbody');
    
    if (reservas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center">Nenhuma reserva encontrada</td></tr>';
      return;
    }

    tbody.innerHTML = reservas.map(reserva => `
      <tr>
        <td>#${reserva.id}</td>
        <td>${reserva.nome}</td>
        <td>${reserva.email}</td>
        <td>${reserva.telefone}</td>
        <td>${this.formatDate(reserva.data_entrada)}</td>
        <td>${this.formatDate(reserva.data_saida)}</td>
        <td>
          <span class="status-badge status-${reserva.status}">
            ${this.getStatusLabel(reserva.status)}
          </span>
        </td>
        <td>${this.formatDate(reserva.data_criacao)}</td>
        <td>
          <button class="action-btn action-btn-delete" onclick="dashboard.deleteReserva('${reserva.id}')">Apagar</button>
      </tr>
    `).join('');
  }

  filterReservas() {
    const status = document.getElementById('filter-status').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    let filtered = this.currentReservas;

    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.nome.toLowerCase().includes(searchTerm) ||
        r.email.toLowerCase().includes(searchTerm) ||
        r.telefone.includes(searchTerm)
      );
    }

    this.renderReservas(filtered);
  }

  updateStats() {
    const total = this.currentReservas.length;
    const pendentes = this.currentReservas.filter(r => r.status === 'pendente').length;
    const confirmadas = this.currentReservas.filter(r => r.status === 'confirmada').length;
    const canceladas = this.currentReservas.filter(r => r.status === 'cancelada').length;

    document.getElementById('total-reservas').textContent = total;
    document.getElementById('reservas-pendentes').textContent = pendentes;
    document.getElementById('reservas-confirmadas').textContent = confirmadas;
    document.getElementById('reservas-canceladas').textContent = canceladas;
  }

  async showDetailModal(id) {
    try {
      const reserva = this.currentReservas.find(r => r.id === id);
      if (!reserva) {
        throw new Error('Reserva não encontrada');
      }

      this.currentReservaDetail = reserva;
      const modalBody = document.getElementById('modal-body');

      modalBody.innerHTML = `
        <div class="detail-row">
          <div class="detail-col">
            <div class="detail-label">ID</div>
            <div class="detail-value">#${reserva.id}</div>
          </div>
          <div class="detail-col">
            <div class="detail-label">Status</div>
            <div class="detail-value">
              <span class="status-badge status-${reserva.status}">
                ${this.getStatusLabel(reserva.status)}
              </span>
            </div>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-col">
            <div class="detail-label">Nome</div>
            <div class="detail-value">${reserva.nome}</div>
          </div>
          <div class="detail-col">
            <div class="detail-label">Telefone</div>
            <div class="detail-value">
              <a href="tel:${reserva.telefone}">${reserva.telefone}</a>
            </div>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-col">
            <div class="detail-label">Email</div>
            <div class="detail-value">
              <a href="mailto:${reserva.email}">${reserva.email}</a>
            </div>
          </div>
          <div class="detail-col">
            <div class="detail-label">Cidade</div>
            <div class="detail-value">${reserva.cidade || '-'}</div>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-col">
            <div class="detail-label">Data de Nascimento</div>
            <div class="detail-value">${reserva.data_nascimento ? this.formatDate(reserva.data_nascimento) : '-'}</div>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-col">
            <div class="detail-label">Data de Entrada</div>
            <div class="detail-value">${this.formatDate(reserva.data_entrada)}</div>
          </div>
          <div class="detail-col">
            <div class="detail-label">Data de Saída</div>
            <div class="detail-value">${this.formatDate(reserva.data_saida)}</div>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-col">
            <div class="detail-label">Duração</div>
            <div class="detail-value">${this.calculateNights(reserva.data_entrada, reserva.data_saida)} noites</div>
          </div>
        </div>

        ${reserva.mensagem ? `
          <div class="detail-row">
            <div class="detail-col">
              <div class="detail-label">Mensagem/Observações</div>
              <div class="detail-value">${reserva.mensagem}</div>
            </div>
          </div>
        ` : ''}

        <div class="detail-row">
          <div class="detail-col">
            <div class="detail-label">Data de Criação</div>
            <div class="detail-value">${this.formatDate(reserva.data_criacao)}</div>
          </div>
        </div>
      `;

      // Atualizar visibilidade dos botões
      this.updateModalButtons();
      
      // Mostrar modal
      document.getElementById('detail-modal').classList.add('show');

    } catch (error) {
      this.showToast(error.message, 'error');
    }
  }

  updateModalButtons() {
    const confirmBtn = document.getElementById('btn-confirm');
    const cancelBtn = document.getElementById('btn-cancel');

    if (this.currentReservaDetail.status === 'confirmada') {
      confirmBtn.textContent = '✓ Já Confirmada';
      confirmBtn.disabled = true;
      cancelBtn.disabled = false;
    } else if (this.currentReservaDetail.status === 'cancelada') {
      cancelBtn.textContent = '✗ Já Cancelada';
      cancelBtn.disabled = true;
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Reativar';
    } else {
      confirmBtn.disabled = false;
      cancelBtn.disabled = false;
    }
  }

  async updateReservaStatus(novoStatus) {
    if (!this.currentReservaDetail) return;

    const confirma = window.confirm(
      `Tem certeza que deseja marcar como "${this.getStatusLabel(novoStatus)}"?`
    );
    if (!confirma) return;

    try {
      this.showLoading(true);

      const response = await fetch(
        `${this.baseUrl}/reserva/${this.currentReservaDetail.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ status: novoStatus })
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar reserva');
      }

      this.showToast('Reserva atualizada com sucesso!', 'success');
      this.closeModal();
      this.loadReservas();

    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.showLoading(false);
    }
  }

    async deleteReserva(id) {
    if (!confirm('Tem certeza que deseja excluir esta reserva?')) return;
    try {
      this.showLoading(true);
      const response = await fetch(`${this.baseUrl}/reserva/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir reserva');
      }
      this.showToast('Reserva excluída com sucesso!', 'success');
      this.loadReservas();
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.showLoading(false);
    }
  }

  closeModal() {
    document.getElementById('detail-modal').classList.remove('show');
    this.currentReservaDetail = null;
  }

  // ==================== UTILIDADES ====================

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusLabel(status) {
    const labels = {
      'pendente': 'Pendente',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada'
    };
    return labels[status] || status;
  }

  calculateNights(dataEntrada, dataSaida) {
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);
    const diff = Math.ceil((saida - entrada) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }

  // ==================== EXPORTAÇÃO ====================

  exportCSV() {
    if (this.currentReservas.length === 0) {
      this.showToast('Nenhuma reserva para exportar', 'warning');
      return;
    }

    // Headers
    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Data Entrada', 'Data Saída', 'Status', 'Data Criação'];
    
    // Rows
    const rows = this.currentReservas.map(r => [
      r.id,
      r.nome,
      r.email,
      r.telefone,
      this.formatDate(r.data_entrada),
      this.formatDate(r.data_saida),
      this.getStatusLabel(r.status),
      this.formatDate(r.data_criacao)
    ]);

    // Montar CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reservas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('Arquivo exportado com sucesso!', 'success');
  }
}

// ==================== INICIALIZAR ====================

let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new AdminDashboard();
});
