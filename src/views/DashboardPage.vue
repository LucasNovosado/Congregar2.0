<template>
  <div class="dashboard-container">
    <TopHeader />
    <div class="content-wrapper" :class="{ 'blur': isPopupVisible }">
      <main class="dashboard-content">
        <h1>Memórias do Caminho</h1>
        <div class="bible-calendar-container">
          <BibleVerse class="bible-verse" />
          <CalendarCult class="calendar-cult" />
          <FilterCult />

        </div>
        <CardStatistic @popup-opened="handlePopupOpen" @popup-closed="handlePopupClose" />
        <h1>Lista de Cultos</h1>
        <CardCult :cults="getCults" @edit="handleEdit" @delete="handleDelete" />
        <AddButton />
      </main>
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

 
 export default {
  data() {
    return {
      isPopupVisible: false,
      popupData: {
        isVisible: false,
        title: '',
        items: [],
        field: ''
      }
    }
  },
  name: 'DashboardPage',
  components: {
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
  margin: 30px 0 60px 0; /* Aumentado para 50px na margem inferior */
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
