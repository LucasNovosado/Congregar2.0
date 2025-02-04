# Share_Cult_Popup.vue

<template>
  <div v-if="isVisible" class="popup-overlay" @click.self="$emit('close')">
    <div class="popup-content" ref="popupContent" :class="{ 'is-sharing': sharing }">
      <div class="cult-card">
        <div class="cult-header">
          <h3>Culto n°: {{ cultNumber }}</h3>
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

        <div class="action-buttons" v-if="!sharing">
          <button class="share-btn" @click="handleShare">
            <van-loading v-if="sharing" size="20px" color="#ffffff" />
            <span v-else>Enviar</span>
          </button>
          <button class="close-btn" @click="$emit('close')">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { Loading as VanLoading, Toast } from 'vant';
import cultService from '@/services/cultService';

export default {
  name: 'ShareCultPopup',
  components: {
    VanLoading
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    cult: {
      type: Object,
      required: true
    },
    cultNumber: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      sharing: false
    };
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy');
    },
    async handleShare() {
  try {
    this.sharing = true;
    // Aguarda a UI atualizar
    await new Promise(resolve => setTimeout(resolve, 100));

    // Gera a imagem
    const canvas = await cultService.generateSummaryImage(this.$refs.popupContent);
    if (!canvas) {
      throw new Error('Falha ao gerar imagem');
    }

    // Tenta compartilhar
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
    if (!blob) {
      throw new Error('Falha ao processar imagem');
    }

    const file = new File([blob], 'culto.png', { type: 'image/png' });

    // Verifica suporte ao compartilhamento
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `Culto nº ${this.cultNumber}`,
        text: 'Compartilhando detalhes do culto'
      });
      Toast.success('Compartilhado com sucesso!');
    } else {
      // Usa o método alternativo
      await cultService.shareImage(canvas);
      Toast.success('Imagem salva com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
    if (error.name === 'AbortError') {
      // Usuário cancelou o compartilhamento
      return;
    }
    Toast.fail(error.message || 'Erro ao compartilhar imagem');
  } finally {
    this.sharing = false;
  }
}
  }
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  overflow-y: auto;
}

.popup-content {
  width: 90%;
  max-width: 500px;
  padding: 20px;
  border-radius: 15px;
  margin: 20px auto;
}

.cult-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.cult-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
}

.exhortation-text {
  color: #fff;
  margin-top: 8px;
  line-height: 1.5;
  text-align: justify;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.share-btn, .close-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s ease;
  font-weight: 500;
  color: white;
}

.share-btn {
  background: #4a90e2;
}

.close-btn {
  background: #666;
}

.share-btn:hover, .close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.is-sharing .action-buttons {
  display: none !important;
}

.is-sharing .cult-card {
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .popup-overlay {
    padding: 0;
  }

  .popup-content {
    width: 100%;
    margin: 0;
    min-height: 100vh;
    border-radius: 0;
  }

  .cult-card {
    border-radius: 0;
    min-height: 100vh;
  }
  
  .exhortation-text {
    padding-bottom: 80px; /* Espaço extra para o conteúdo não ficar sob os botões no mobile */
  }
}
</style>
