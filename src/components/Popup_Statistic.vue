<template>
    <div class="popup-overlay" v-if="isVisible" @click="closePopup">
      <div class="popup-content" @click.stop>
        <div class="popup-header">
          <h2>{{ title }}</h2>
          <van-icon name="cross" @click="closePopup" class="close-icon"/>
        </div>
        
        <div class="popup-body">
          <div class="list-container">
            <div v-for="(group, key) in groupedItems" :key="key" class="list-item">
              <div class="item-content">
                <div class="item-main">
                  <span class="item-value">{{ group.value }}</span>
                  <span class="item-count">({{ group.items.length }}x)</span>
                  <van-icon 
                    name="info-o" 
                    class="info-icon"
                    @click="toggleDetails(key)"
                  />
                </div>
                
                <div v-if="expandedItems[key]" class="item-details">
                  <div v-for="(item, index) in group.items" :key="index" class="detail-row">
                    <span class="detail-date">{{ formatDate(item.date) }}</span>&nbsp;&nbsp;
                    <span v-if="title !== 'Casas de Oração'" class="detail-location">{{ item.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Icon as VanIcon } from 'vant';
  import { format } from 'date-fns';
  
  export default {
    name: 'PopupStatistic',
    components: { VanIcon },
    props: {
      isVisible: Boolean,
      title: String,
      items: Array,
      field: String
    },
    data() {
      return {
        expandedItems: {}
      }
    },
    computed: {
  groupedItems() {
    const groups = {};
    this.items.forEach(item => {
      const value = item[this.field];
      if (!groups[value]) {
        groups[value] = {
          value,
          items: []
        };
      }
      groups[value].items.push(item);
    });
    
    // Convert to array and sort by number of items
    return Object.entries(groups)
      .sort(([,a], [,b]) => b.items.length - a.items.length)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  },
  totalCount() {
    return this.items.length;
  }
},
    methods: {
      closePopup() {
        this.$emit('close');
        this.expandedItems = {};
      },
      formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy');
      },
      toggleDetails(key) {
  this.expandedItems = {
    ...this.expandedItems,
    [key]: !this.expandedItems[key]
  };
}
    }
  };
  </script>

<style scoped>
.item-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-count {
  color: #ffd700;
  font-size: 0.9rem;
}

.info-icon {
  cursor: pointer;
  color: #fff;
  transition: all 0.3s ease;
}

.info-icon:hover {
  transform: scale(1.1);
  color: #ffd700;
}

.item-details {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
}

.detail-date {
  color: #ffd700;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 9999; /* Aumentado para garantir que fique acima de tudo */
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  position: relative;
  z-index: 10000; /* Maior que o overlay */
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  background: linear-gradient(145deg, #032549, #1d6fcc);
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  overflow: hidden;
}

.popup-header {
 padding: 20px;
 display: flex;
 justify-content: space-between;
 align-items: center;
 background: rgba(255,255,255,0.1);
 border-bottom: 1px solid rgba(255,255,255,0.1);
}

.popup-header h2 {
 color: #fff;
 margin: 0;
 font-size: 1.4rem;
 font-weight: 600;
}

.close-icon {
 color: #fff;
 font-size: 24px;
 cursor: pointer;
 padding: 5px;
}

.popup-body {
 padding: 20px;
 overflow-y: auto;
 max-height: calc(80vh - 80px);
}

.list-container {
 display: flex;
 flex-direction: column;
 gap: 12px;
}

.list-item {
 background: rgba(255,255,255,0.1);
 border-radius: 12px;
 padding: 15px;
 transition: all 0.3s ease;
}

.list-item:hover {
 transform: translateX(5px);
 background: rgba(255,255,255,0.15);
}

.item-content {
 display: flex;
 justify-content: space-between;
 align-items: center;
 color: #fff;
}

.item-date {
 font-size: 0.9rem;
 color: #ffd700;
}

.item-value {
 font-weight: 600;
 font-size: 1.1rem;
}

.item-location {
 font-size: 0.9rem;
 color: rgba(255,255,255,0.8);
}

@keyframes fadeIn {
 from { opacity: 0; }
 to { opacity: 1; }
}

@keyframes slideUp {
 from { 
   transform: translateY(50px);
   opacity: 0;
 }
 to {
   transform: translateY(0);
   opacity: 1;
 }
}

::-webkit-scrollbar {
 width: 6px;
}

::-webkit-scrollbar-track {
 background: rgba(255,255,255,0.1);
}

::-webkit-scrollbar-thumb {
 background: rgba(255,255,255,0.3);
 border-radius: 3px;
}

@media (max-width: 768px) {
 .popup-content {
   width: 95%;
   max-height: 85vh;
 }
 
 .item-content {
   flex-direction: column;
   align-items: flex-start;
   gap: 5px;
 }
}
</style>
