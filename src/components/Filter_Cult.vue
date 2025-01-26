<template>
  <div class="filter-container">
    <van-field
      v-model="startDate"
      type="date"
      label="Data Inicial"
      placeholder="Selecione a data inicial"
      class="custom-field"
    />
    <van-field
      v-model="endDate"
      type="date"
      label="Data Final"
      placeholder="Selecione a data final"
      class="custom-field"
    />
    <van-button type="primary" @click="applyFilter" class="custom-button primary">Aplicar Filtro</van-button>
    <van-button type="default" @click="clearFilter" class="custom-button default">Limpar Filtro</van-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { Field, Button } from 'vant';

export default {
  name: 'FilterCult',
  components: {
    VanField: Field,
    VanButton: Button,
  },
  data() {
    return {
      startDate: '',
      endDate: '',
    };
  },
  methods: {
    ...mapActions(['setDateFilter']),
    applyFilter() {
      this.setDateFilter({ startDate: this.startDate, endDate: this.endDate });
    },
    clearFilter() {
      this.startDate = '';
      this.endDate = '';
      this.setDateFilter({ startDate: null, endDate: null });
    },
  },
};
</script>

<style scoped>
.filter-container {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease-out forwards;
}

.custom-field {
  background: rgba(255, 255, 255, 0.938);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff; /* Cor do texto branca */
  padding: 10px;
  font-size: 1rem;
}

.custom-field::placeholder {
  color: rgba(255, 255, 255, 0.5); /* Cor do placeholder mais clara */
}

/* Estilo para o ícone do calendário */
.custom-field .van-field__control {
  color: #ffffff; /* Cor do texto branca */
}

.custom-field .van-field__control::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Inverte a cor do ícone do calendário para branco */
}

.custom-button {
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.custom-button.primary {
  background: linear-gradient(135deg, #1a2a6c, #2a4858);
  color: #ffffff;
  border: none;
}

.custom-button.primary:hover {
  background: linear-gradient(135deg, #2a4858, #1a2a6c);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.custom-button.default {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-button.default:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>