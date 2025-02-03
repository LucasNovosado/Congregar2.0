<template>
  <div class="dashboard-container">
    <TopHeader />
    <div class="content-wrapper" :class="{ 'blur': isPopupVisible || isSharePopupVisible }">
      <main class="dashboard-content">
        <h1>Memórias do Caminho</h1>
        <h2 class="dashboard-subtitle">
  Este registro nasce com o propósito de preservar os momentos marcantes vividos na presença de Deus em sua casa, onde a palavra ministrada fortalece a fé e edifica a alma. Cada anotação busca guardar os detalhes de datas, locais, e palavras que marcaram nossa vida cristã, como um tesouro espiritual para revisitar e relembrar a direção do Senhor em nossa vida.
</h2>
        <div class="bible-calendar-container">
          <BibleVerse class="bible-verse" />
          <CalendarCult class="calendar-cult" />
          <FilterCult />

        </div>
        <CardStatistic @popup-opened="handlePopupOpen" @popup-closed="handlePopupClose" />
        <h1>Lista de Cultos</h1>
        <CardCult :cults="getCults" @edit="handleEdit" @delete="handleDelete" @share="handleShare" />
        
      </main>
      <div class="add-button-wrapper">
          <AddButton />
</div>
    </div>
    <!-- Popup movido para fora do content-wrapper -->
    <PopupStatistic 
      v-if="popupData.isVisible"
      :isVisible="popupData.isVisible"
      :title="popupData.title"
      :items="popupData.items"
      :field="popupData.field"
      @close="handlePopupClose"
    />
    <ShareCultPopup
      v-if="sharePopupData.isVisible"
      :isVisible="sharePopupData.isVisible"
      :cult="sharePopupData.cult"
      :cultNumber="sharePopupData.cultNumber"
      @close="handleSharePopupClose"
    />
  </div>
</template>
 
 <script>
 import FilterCult from '@/components/Filter_Cult.vue'; 
 import CalendarCult from '@/components/Calendar_Cult.vue';
 import { mapActions, mapGetters } from 'vuex';
 import TopHeader from '@/components/Top_Header.vue';
 import BibleVerse from '@/components/Bible_Verse.vue';
 import CardStatistic from '@/components/Card_Statistic.vue';
 import CardCult from '@/components/Card_Cult.vue';
 import AddButton from '@/components/Add_Button.vue';
 import PopupStatistic from '@/components/Popup_Statistic.vue';
 import ShareCultPopup from '@/components/Share_Cult_Popup.vue';

 
 export default {
  data() {
    return {
      isPopupVisible: false,
      popupData: {
        isVisible: false,
        title: '',
        items: [],
        field: ''
      },
      sharePopupData: {
        isVisible: false,
        cult: null,
        cultNumber: null
      }
    }
  },
  name: 'DashboardPage',
  components: {
    ShareCultPopup,
    PopupStatistic,
    TopHeader,
    BibleVerse,
    CardStatistic,
    CardCult,
    AddButton,
    CalendarCult,
    FilterCult
  },
  computed: {
    ...mapGetters(['getCults'])
  },
  methods: {

    handleShare({ cult, cultNumber }) {
      this.sharePopupData = {
        isVisible: true,
        cult,
        cultNumber
      };
    },
    
    handleSharePopupClose() {
      this.sharePopupData = {
        isVisible: false,
        cult: null,
        cultNumber: null
      };
    },

    handlePopupOpen(data) {
      this.isPopupVisible = true;
      this.popupData = {
        isVisible: true,
        title: data.title,
        items: data.items,
        field: data.field
      };
    },
    handlePopupClose() {
      this.isPopupVisible = false;
      this.popupData.isVisible = false;
    },
    ...mapActions(['fetchCults']),
    handleEdit(cult) {
      // Implementar lógica de edição
      console.log('Editar culto:', cult);
    },
    handleDelete(cultId) {
      // Implementar lógica de remoção
      console.log('Remover culto:', cultId);
    }
  },
  async created() {
    await this.fetchCults();
  }
  
 };
 </script>

<style scoped>

.blur {
  filter: blur(4px);
  pointer-events: none;
}

.add-button-wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99;
}

@media (max-width: 768px) {
  .add-button-wrapper {
    bottom: 20px;
    right: 20px;
  }
}

.dashboard-subtitle {
  font-size: 1.2rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  max-width: 900px;
  margin: 0 auto 40px;
  line-height: 1.6;
  padding: 0 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  font-style: italic;
}

.dashboard-subtitle::after {
  content: '';
  position: absolute;
  height: 1px;
  width: 100px;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
  left: 50%;
  transform: translateX(-50%);
}

.dashboard-subtitle::before {
  top: -15px;
}


@media (max-width: 768px) {
  .dashboard-subtitle {
    font-size: 1rem;
    padding: 0 15px;
    margin-bottom: 30px;
  }
  
  .dashboard-subtitle::before,
  .dashboard-subtitle::after {
    width: 60px;
  }
}

.bible-calendar-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  max-width: 100%; /* Garantir que o contêiner não ultrapasse a largura da tela */
}

@media (max-width: 768px) {
  .bible-calendar-container {
    flex-direction: column;
    gap: 10px;
    width: 93%;
    padding-left: 10px;
    margin-bottom: 10px;
  }

  .bible-verse,
  .calendar-cult {
    width: 100%;
    margin-bottom: 10px;
  }
}

.dashboard-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
}

h1 {
  font-size: 2.8rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 4px 8px rgba(0,0,0,0.2);
  margin: 30px 0 30px 0; /* Aumentado para 50px na margem inferior */
  /* ou você pode usar: */
  position: relative;
  display: inline-block;
}
h1::after {
 content: '';
 position: absolute;
 bottom: -10px;
 left: 50%;
 transform: translateX(-50%);
 width: 120px;
 height: 4px;
 background: linear-gradient(90deg, #ffd700, transparent);
 border-radius: 2px;
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
.dashboard-content {
  position: relative;
  z-index: 1;
  padding: 30px 20px;
  animation: fadeIn 0.8s ease-out forwards;
}

.dashboard-content > *:nth-child(1) { animation-delay: 0.2s; }
.dashboard-content > *:nth-child(2) { animation-delay: 0.4s; }
.dashboard-content > *:nth-child(3) { animation-delay: 0.6s; }

::-webkit-scrollbar {
 width: 8px;
}

::-webkit-scrollbar-track {
 background: rgba(255,255,255,0.1);
}

::-webkit-scrollbar-thumb {
 background: linear-gradient(180deg, #1d6fcc, #032549);
 border-radius: 4px;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  transition: filter 0.3s ease;
}
.content-wrapper.blur {
  filter: blur(4px);
  pointer-events: none;
}
/* Garantir que o filtro fique abaixo do popup */
:deep(.filter-cult) {
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
 h1 {
   font-size: 2rem;
 }
}
</style>
