<template>
  <div class="dashboard-container">
    <TopHeader />
    <div class="content-wrapper" :class="{ 'blur': isPopupVisible }">
      <main class="dashboard-content">
        <h1>Memórias do Caminho</h1>
        <div class="bible-calendar-container">
          <BibleVerse class="bible-verse" />
          <CalendarCult class="calendar-cult" />
        </div>
        <CardStatistic @popup-opened="handlePopupOpen" @popup-closed="handlePopupClose" />
        <FilterCult />
        <h1>Lista de Cultos</h1>
        <CardCult :cults="getCults" @edit="handleEdit" @delete="handleDelete" />
        <AddButton />
      </main>
    </div>
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
 
 export default {
  data() {
    return {
      isPopupVisible: false
    }
  },
  name: 'DashboardPage',
  components: {
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
    handlePopupOpen() {
      this.isPopupVisible = true;
    },
    handlePopupClose() {
      this.isPopupVisible = false;
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
 min-height: 100vh;
 background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
}

.dashboard-content {
 padding: 30px 20px;
}

h1 {
 font-size: 2.8rem;
 font-weight: 800;
 color: #ffffff;
 text-shadow: 0 4px 8px rgba(0,0,0,0.2);
 margin: 30px 0;
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

.dashboard-content > * {
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

@media (max-width: 768px) {
 h1 {
   font-size: 2rem;
 }
}
</style>