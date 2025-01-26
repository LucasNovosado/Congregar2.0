<template>
    <div class="statistics-container">
      <!-- Card Cultos -->
      <div class="card cult-card">
        <van-icon name="fire-o" size="24" color="#fff"/>
        <h3>Cultos</h3>
        <p>Congregou: {{ congregatedCount }}x</p>
      </div>
   
      <!-- Card Atendimentos -->
      <div class="card service-card">
        <van-icon name="friends-o" size="24" color="#fff"/>
        <van-icon name="arrow" class="detail-icon" @click="showPopup('service', 'Atendimentos')"/>
        <h3>Atendimentos</h3>
        <ul>
          <li v-for="(count, brother, index) in topServiceCounts" :key="brother" :class="'rank-' + (index + 1)">
            {{ brother }}: {{ count }}x
          </li>
        </ul>
      </div>
   
      <!-- Card Palavra Revelada -->
      <div class="card preaching-card">
        <van-icon name="description" size="24" color="#fff"/>
        <van-icon name="arrow" class="detail-icon" @click="showPopup('preaching', 'Palavra Revelada')"/>
        <h3>Palavra Revelada ao</h3>
        <ul>
          <li v-for="(count, brother, index) in topPreachingCounts" :key="brother" :class="'rank-' + (index + 1)">
            {{ brother }}: {{ count }}x
          </li>
        </ul>
      </div>
   
      <!-- Card Casas de Oração -->
      <div class="card location-card">
        <van-icon name="wap-home-o" size="24" color="#fff"/>
        <van-icon name="arrow" class="detail-icon" @click="showPopup('location', 'Casas de Oração')"/>
        <h3>Casas de Oração</h3>
        <ul>
          <li v-for="(count, location, index) in topLocationCounts" :key="location" :class="'rank-' + (index + 1)">
            {{ location }}: {{ count }}x
          </li>
        </ul>
      </div>
   
      <!-- Popup Component -->
      <PopupStatistic 
        :isVisible="popupVisible"
        :title="popupTitle"
        :items="userCults"
        :field="selectedField"
        @close="closePopup"
      />
    </div>
   </template>
   
   <script>
   import { mapGetters } from 'vuex';
   import { Icon as VanIcon } from 'vant';
   import PopupStatistic from './Popup_Statistic.vue';
   
   export default {
    name: 'CardStatistic',
    components: {
      VanIcon,
      PopupStatistic
    },
    data() {
      return {
        popupVisible: false,
        popupTitle: '',
        selectedField: ''
      }
    },
    mounted() {
      this.$store.dispatch('fetchCults');
    },
    computed: {
      ...mapGetters(['getCults']),
      userCults() {
        return this.getCults;
      },
      congregatedCount() {
        return this.userCults.length;
      },
      serviceCounts() {
        const counts = {};
        this.userCults.forEach(cult => {
          const brother = cult.service;
          if (brother) {
            counts[brother] = (counts[brother] || 0) + 1;
          }
        });
        return counts;
      },
      preachingCounts() {
        const counts = {};
        this.userCults.forEach(cult => {
          const brother = cult.preaching;
          if (brother) {
            counts[brother] = (counts[brother] || 0) + 1;
          }
        });
        return counts;
      },
      locationCounts() {
        const counts = {};
        this.userCults.forEach(cult => {
          const location = cult.location;
          if (location) {
            counts[location] = (counts[location] || 0) + 1;
          }
        });
        return counts;
      },
      topServiceCounts() {
        return Object.fromEntries(
          Object.entries(this.serviceCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
        );
      },
      topPreachingCounts() {
        return Object.fromEntries(
          Object.entries(this.preachingCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
        );
      },
      topLocationCounts() {
        return Object.fromEntries(
          Object.entries(this.locationCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
        );
      }
    },
    methods: {
  showPopup(field, title) {
    this.selectedField = field;
    this.popupTitle = title;
    this.popupVisible = true;
    this.$emit('popup-opened');
  },
  closePopup() {
    this.popupVisible = false;
    this.$emit('popup-closed');
  }
}
   };
   </script>
   
   <style scoped>
   .statistics-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    padding: 25px;
    border-radius: 20px;
    margin: 20px;
   }
   
   .card {
    position: relative;
    background: linear-gradient(145deg, #032549, #1d6fcc);
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    text-align: center;
    transition: all 0.3s ease;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
   }
   
   .cult-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    background: linear-gradient(145deg, #1a237e, #0d47a1);
   }
   
   .service-card { background: linear-gradient(145deg, #1565c0, #0277bd); }
   .preaching-card { background: linear-gradient(145deg, #0288d1, #0097a7); }
   .location-card { background: linear-gradient(145deg, #00acc1, #00838f); }
   
   .card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
   }
   
   .card h3 {
    font-size: 1.4rem;
    color: #fff;
    margin: 15px 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
   }
   
   .card p {
    font-size: 1.2rem;
    color: #fff;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
   }
   
   .card ul {
    list-style: none;
    padding: 0;
    margin: 15px 0 0;
   }
   
   .card ul li {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 8px;
    background: rgba(255,255,255,0.1);
    transition: all 0.3s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
   }
   
   .rank-1 {
    border-left: 4px solid #ffd700;
    font-weight: bold;
    background: linear-gradient(90deg, rgba(255,215,0,0.1), transparent) !important;
   }
   
   .rank-2 {
    border-left: 4px solid #c0c0c0;
    background: linear-gradient(90deg, rgba(192,192,192,0.1), transparent) !important;
   }
   
   .rank-3 {
    border-left: 4px solid #cd7f32;
    background: linear-gradient(90deg, rgba(205,127,50,0.1), transparent) !important;
   }
   
   .van-icon {
 position: absolute;
 top: 15px;
 opacity: 0.8;
 transition: all 0.3s ease;
}

.service-card .van-icon-user-o {
 left: 15px;
}
.preaching-card .van-icon-book {
 left: 15px;
}
.location-card .van-icon-location-o {
 left: 15px;  
}
   
.detail-icon {
 right: 15px;
 cursor: pointer;
 color: #ffffff;
 font-size: 24px;
 opacity: 0.9;
 background: rgba(255,255,255,0.15);
 padding: 8px;
 border-radius: 50%;
 box-shadow: 0 2px 8px rgba(0,0,0,0.2);
 border: 1px solid rgba(255,255,255,0.2);
}

.detail-icon:hover {
 transform: scale(1.1);
 background: rgba(255,255,255,0.25);
 box-shadow: 0 4px 12px rgba(0,0,0,0.3);
 color: #fff;
}

   .card:hover .van-icon {
    opacity: 1;
   }

   @media (max-width: 768px) {
    .statistics-container {
      grid-template-columns: 1fr;
      padding: 15px;
      margin: 10px;
    }
    
    .card {
      padding: 20px;
    }
   
    .card h3 {
      font-size: 1.2rem;
    }
   
    .card p {
      font-size: 1rem;
    }
   
    .card ul li {
      font-size: 0.9rem;
    }
   }
   </style>