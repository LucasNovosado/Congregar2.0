# Share_Cult_Popup.vue

<template>
    <div v-if="isVisible" class="popup-overlay" @click.self="$emit('close')">
      <div class="popup-content" ref="popupContent" :class="{ 'is-sharing': sharing }">
        <div class="cult-card">
          <div class="cult-header">
            <div class="header-content">
              <h3>Culto n°: {{ cultNumber }}</h3>
              <div class="cult-type-badge">{{ cult.typeCult }}</div>
            </div>
            <div class="decorative-line"></div>
          </div>
  
          <div class="cult-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Data:</span>
                <span class="value">{{ formatDate(cult.date) }}</span>
              </div>
  
              <div class="info-item">
                <span class="label">Local:</span>
                <span class="value">{{ cult.location }}</span>
              </div>
  
              <div class="info-item">
                <span class="label">Atendimento:</span>
                <span class="value">{{ cult.service }}</span>
              </div>
  
  
              <div class="info-item">
                <span class="label">Revelado ao:</span>
                <span class="value">{{ cult.preaching }}</span>
              </div>
            </div>
  
            <div class="info-item">
                <span class="label">Palavra:</span>
                <span class="value">{{ cult.hollyWord }}</span>
              </div>

            <div class="exhortation-section">
              <div class="exhortation-header">
                <span class="label">Exortação</span>
              </div>
              <div class="exhortation-container">
                <p class="exhortation-text">{{ cult.exhortation }}</p>
              </div>
            </div>
          </div>
  
          <div class="action-buttons" v-if="!sharing">
            <button class="share-btn" @click="handleShare">
              <van-loading v-if="sharing" size="20px" color="#ffffff" />
              <span v-else>
                Enviar
              </span>
            </button>
            <button class="close-btn" @click="$emit('close')">
              Fechar
            </button>
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
        await new Promise(resolve => setTimeout(resolve, 100));
        const canvas = await cultService.generateSummaryImage(this.$refs.popupContent);
        
        // Tenta usar a Web Share API primeiro
        if (navigator.share) {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const file = new File([blob], 'culto.png', { type: 'image/png' });
          
          await navigator.share({
            files: [file],
            title: `Culto nº ${this.cultNumber}`,
            text: `Compartilhando detalhes do culto nº ${this.cultNumber}`
        });
        } else {
          // Fallback para o método tradicional
          await cultService.shareImage(canvas);
        }
        
        Toast.success('Compartilhado com sucesso!');
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        Toast.fail('Erro ao compartilhar imagem');
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
  background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(26,42,108,0.95) 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  overflow-y: auto;
  backdrop-filter: blur(8px);
}

.popup-content {
  width: 90%;
  max-width: 550px;
  margin: 30px auto;
  perspective: 1000px;
}

.cult-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(31,38,135,0.2);
  border: 1px solid rgba(255,255,255,0.18);
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.cult-card:hover {
  transform: translateY(-5px) rotateX(2deg);
}

.cult-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.cult-header h3 {
  color: #ffd700;
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  margin: 0;
}

.decorative-line {
  height: 3px;
  background: linear-gradient(90deg, #ffd700 0%, rgba(255,215,0,0.2) 100%);
  border-radius: 2px;
}

.cult-type-badge {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(74,144,226,0.3);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.info-item:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.08);
}

.info-icon {
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
}

.label {
  color: #90caf9;
  font-weight: 500;
  font-size: 0.9rem;
}

.value {
  color: white;
  margin-left: auto;
  font-weight: 400;
}

.exhortation-section {
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
}

.exhortation-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.exhortation-container {
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  padding: 20px;
}

.exhortation-text {
  color: #fff;
  line-height: 1.6;
  text-align: justify;
  margin: 0;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.share-btn, .close-btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.share-btn {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
}

.close-btn {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.share-btn:hover, .close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.share-btn:active, .close-btn:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .popup-content {
    width: 100%;
    margin: 0;
    min-height: 100vh;
  }

  .cult-card {
    border-radius: 0;
    min-height: 100vh;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .exhortation-text {
    padding-bottom: 100px;
  }

  .action-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(10px);
    margin: 0;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
}
</style>
