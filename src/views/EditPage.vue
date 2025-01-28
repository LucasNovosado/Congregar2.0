<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <div class="header-container">
        <button class="back-button" @click="goBack">
          <span class="back-icon">←</span> Voltar
        </button>
        <div class="title-container">
          <h1>Editar Culto</h1>
        </div>
      </div>
      <FormCult 
        :editData="cultData"
        @submit-success="handleSuccess" 
        v-if="cultData"
      />
    </div>
  </div>
</template>

<script>
import FormCult from '@/components/Form_Cult.vue'
import { mapGetters } from 'vuex';

export default {
 name: 'EditPage',
 components: {
   FormCult
 },
 data() {
   return {
     cultData: null
   }
 },
 computed: {
   ...mapGetters(['getCults'])
 },
 async created() {
   const cultId = this.$route.params.id;
   const cult = this.getCults.find(cult => cult.id === cultId);
   
   if (!cult) {
     this.$router.push('/dashboard');
     return;
   }
   
   this.cultData = { ...cult };
 },
 methods: {
   handleSuccess() {
     this.$router.push('/dashboard');
   },
   goBack() {
     this.$router.push('/dashboard');
   }
 }
}
</script>

<style scoped>
.dashboard-container {
 min-height: 100vh;
 background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
}

.dashboard-content {
 padding: 30px 20px;
 animation: fadeIn 0.8s ease-out forwards;
}

.header-container {
 display: flex;
 flex-direction: column;
 align-items: flex-start;
 gap: 20px;
 margin-bottom: 30px;
 width: 100%;
}

.title-container {
  width: 100%;
  text-align: center;
}

.back-button {
 display: flex;
 align-items: center;
 gap: 8px;
 padding: 10px 20px;
 background: rgba(255, 255, 255, 0.1);
 border: 1px solid rgba(255, 255, 255, 0.2);
 border-radius: 8px;
 color: #ffffff;
 font-size: 1rem;
 cursor: pointer;
 transition: all 0.3s ease;
}

.back-button:hover {
 background: rgba(255, 255, 255, 0.2);
 transform: translateX(-5px);
}

.back-icon {
 font-size: 1.2rem;
}

h1 {
 font-size: 2.8rem;
 font-weight: 800;
 color: #ffffff;
 text-shadow: 0 4px 8px rgba(0,0,0,0.2);
 margin: 0;
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

@media (max-width: 768px) {
 h1 {
   font-size: 2rem;
 }
 
 .dashboard-content {
   padding: 20px 15px;
 }
}
</style>
