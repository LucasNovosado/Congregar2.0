<template>
  <div class="cards-container">
    <div v-for="cult in paginatedCults" :key="cult.id" class="cult-card">
      <div class="cult-header">
        <h3>Culto n°: {{ getCultNumber(cult) }}</h3>
        <span class="cult-type">{{ cult.typeCult }}</span>
      </div>

      <div class="cult-content">
        <div class="info-row">
          <span class="label">Data:</span>
          <span class="value">{{ formatDate(cult.date) }}</span>
        </div>

        <div class="info-row">
          <span class="label">Local:</span>
          <span class="value">{{ cult.location }}</span>
        </div>

        <div class="info-row">
          <span class="label">Atendimento:</span>
          <span class="value">{{ cult.service }}</span>
        </div>

        <div class="info-row">
          <span class="label">Palavra:</span>
          <span class="value">{{ cult.hollyWord }}</span>
        </div>

        <div class="info-row">
          <span class="label">Revelado ao:</span>
          <span class="value">{{ cult.preaching }}</span>
        </div>

        <div class="exhortation-section">
          <span class="label">Exortação:</span>
          <p class="exhortation-text">{{ cult.exhortation }}</p>
        </div>
      </div>

      <div class="action-buttons">
  <button class="edit-btn" @click="handleEdit(cult)">
    <van-icon name="edit" /> Editar
  </button>
  <button class="share-btn" @click="handleShare(cult, getCultNumber(cult))">
    <van-icon name="share" /> Compartilhar
  </button>
  <button class="delete-btn" @click="confirmDelete(cult.id)">
    <van-icon name="delete" /> Remover
  </button>
</div>
    </div>
  </div>

  <!-- Botão Carregar Mais -->
  <div v-if="hasMoreCults" class="load-more-container">
    <button class="load-more-btn" @click="loadMore" :disabled="loading">
      <van-loading v-if="loading" size="20px" />
      <span v-else>Carregar mais cultos</span>
    </button>
  </div>
</template>

<script>
import { Icon as VanIcon, Dialog, Toast, Loading as VanLoading } from 'vant';
import { format } from 'date-fns';
import 'vant/es/dialog/style';
import 'vant/es/toast/style';
import { mapGetters } from 'vuex';

export default {
name: 'CardCult',
components: { 
  VanIcon,
  VanLoading
},
data() {
  return {
    currentPage: 1,
    itemsPerPage: 20,
    loading: false
  };
},
computed: {
  ...mapGetters(['getCults']),
  sortedCults() {
    return [...this.getCults].sort((a, b) => {
      const dateComparison = new Date(b.date) - new Date(a.date);
      if (dateComparison === 0) {
        const indexA = this.getCults.findIndex(c => c.id === a.id);
        const indexB = this.getCults.findIndex(c => c.id === b.id);
        return indexB - indexA;
      }
      return dateComparison;
    });
  },
  paginatedCults() {
    return this.sortedCults.slice(0, this.currentPage * this.itemsPerPage);
  },
  hasMoreCults() {
    return this.paginatedCults.length < this.sortedCults.length;
  }
},
methods: {
  async loadMore() {
    this.loading = true;
    // Simulando um pequeno delay para melhor UX
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentPage += 1;
    this.loading = false;
  },
  getCultNumber(cult) {
    const index = this.getCults.findIndex(c => c.id === cult.id);
    return index + 1;
  },
  handleEdit(cult) {
    this.$router.push(`/cults/edit/${cult.id}`);
  },
  formatDate(date) {
    return format(new Date(date), 'dd/MM/yyyy');
  },

  handleShare(cult, cultNumber) {
  this.$emit('share', { cult, cultNumber });
},

  async confirmDelete(cultId) {
    try {
      await Dialog.confirm({
        title: 'Confirmar exclusão',
        message: 'Tem certeza que deseja excluir este culto?',
        confirmButtonText: 'Sim, excluir',
        confirmButtonColor: '#f44336',
        cancelButtonText: 'Cancelar'
      });

      const loading = Toast.loading({
        message: 'Excluindo...',
        forbidClick: true,
      });

      await this.$store.dispatch('deleteCult', cultId);
      loading.clear();
      Toast.success('Culto excluído com sucesso!');
    } catch (error) {
      if (error.toString().includes('cancel')) return;
      Toast.fail('Erro ao excluir culto');
      console.error('Erro ao excluir:', error);
    }
  }
}
};
</script>
  
  <style scoped>

.share-btn {
  background: #4a90e2;
  color: white;
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.load-more-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  margin-bottom: 30px;
}

.load-more-btn {
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 200px;
}

.load-more-btn:hover {
  background: #357abd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.load-more-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

  /* Estilos permanecem os mesmos */
  .cards-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
}

.cult-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 500px; /* Altura mínima para uniformidade */
}

.cult-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.25);
}

.cult-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cult-content {
  flex: 1; /* Faz o conteúdo ocupar todo espaço disponível */
  display: flex;
  flex-direction: column;
}

.cult-header h3 {
  color: #ffd700;
  font-size: 1.4rem;
  margin: 0;
}

.cult-type {
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #fff;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
}

.label {
  color: #90caf9;
  font-weight: 500;
}

.value {
  color: #fff;
  text-align: right;
}

.exhortation-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex: 1; /* Permite que a seção de exortação cresça */
  display: flex;
  flex-direction: column;
}

.exhortation-text {
  color: #fff;
  margin-top: 8px;
  line-height: 1.5;
  text-align: justify;
  overflow-y: auto; /* Adiciona scroll se necessário */
  flex: 1; /* Permite que o texto cresça dentro da seção */
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.edit-btn,
.delete-btn,
.share-btn {
  background: #4a90e2;
  color: white;
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s ease;
  font-weight: 500;
  height: 36px; /* Altura fixa para os botões */
}

.edit-btn {
  background: #4caf50;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.edit-btn:hover,
.delete-btn:hover,
.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Estilos responsivos */
@media (max-width: 1200px) {
  .cards-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .cards-container {
    grid-template-columns: 1fr;
    padding: 10px;
  }

  .cult-card {
    min-height: auto; /* Remove altura mínima no mobile */
  }

  .action-buttons {
    flex-wrap: wrap;
    gap: 8px;
  }

  .edit-btn,
  .delete-btn {
    flex: 1 1 calc(50% - 4px);
  }

  .share-btn {
    flex: 1 1 100%;
    order: -1; /* Coloca o botão compartilhar primeiro no mobile */
  }
}
  </style>
