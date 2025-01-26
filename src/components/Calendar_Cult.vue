<template>
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="nav-btn" @click="previousMonth">
          <van-icon name="arrow-left" /> <!-- Ícone para o mês anterior -->
        </button>
        <h2>{{ currentMonth }} {{ currentYear }}</h2>
        <button class="nav-btn" @click="nextMonth">
            <van-icon name="arrow" /> <!-- Tente usar este ícone como alternativa -->
        </button>
      </div>
  
      <div class="weekdays-header">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>
  
      <div class="calendar-grid">
        <div
          v-for="{ date, inMonth, hasCult } in calendarDays"
          :key="date.toISOString()"
          class="calendar-day"
          :class="{
            'other-month': !inMonth,
            'has-cult': hasCult
          }"
        >
          <span class="day-number">{{ date.getDate() }}</span>
          <span v-if="hasCult" class="cult-indicator">
            <van-icon name="hand-o" /> <!-- Ícone de mão do Vant -->
          </span>
        </div>
      </div>
    </div>
  </template>

<script>
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Icon as VanIcon } from 'vant';
import { mapGetters } from 'vuex';

export default {
  name: 'CalendarCult',
  components: { VanIcon }, // Certifique-se de que o ícone está registrado
  data() {
    return {
      currentDate: new Date(),
      weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    };
  },
  computed: {
    ...mapGetters(['getCults']),
    currentMonth() {
      return format(this.currentDate, 'MMMM', { locale: ptBR });
    },
    currentYear() {
      return format(this.currentDate, 'yyyy');
    },
    calendarDays() {
      const monthStart = startOfMonth(this.currentDate);
      const monthEnd = endOfMonth(this.currentDate);
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);

      return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
        .map(date => ({
          date,
          inMonth: date.getMonth() === this.currentDate.getMonth(),
          hasCult: this.getCults.some(cult => 
            format(new Date(cult.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          )
        }));
    }
  },
  methods: {
    previousMonth() {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    nextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
    }
  }
};
</script>

<style scoped>
.calendar-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 12px; /* Reduzido */
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  max-width: 400px; /* Reduzido */
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px; /* Reduzido */
}

.calendar-header h2 {
  color: #ffd700;
  font-size: 1.2rem; /* Reduzido */
  font-weight: 800;
  text-transform: capitalize;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px; /* Reduzido */
  padding: 6px; /* Reduzido */
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 5px; /* Reduzido */
}

.weekdays-header span {
  color: #90caf9;
  font-weight: 600;
  text-align: center;
  padding: 4px; /* Reduzido */
  font-size: 0.7rem; /* Reduzido */
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px; /* Reduzido */
}

.calendar-day {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px; /* Reduzido */
  padding: 4px; /* Reduzido */
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.calendar-day:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.day-number {
  color: white;
  font-weight: 500;
  font-size: 0.8rem; /* Reduzido */
}

.other-month {
  opacity: 0.5;
}

.has-cult {
  background: rgba(76, 175, 80, 0.3);
  border: 1px solid rgba(76, 175, 80, 0.5);
}

.has-cult:hover {
  background: rgba(76, 175, 80, 0.4);
}

.cult-indicator {
  font-size: 0.8rem; /* Reduzido */
  margin-top: 2px; /* Reduzido */
  display: flex;
  align-items: center;
  justify-content: center;
}

.cult-indicator .van-icon {
  font-size: 1rem; /* Tamanho do ícone */
  color: #ffd700; /* Cor do ícone (dourado) */
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 8px; /* Reduzido */
  }

  .calendar-header h2 {
    font-size: 1rem; /* Reduzido */
  }

  .calendar-day {
    padding: 2px; /* Reduzido */
  }

  .weekdays-header span {
    font-size: 0.6rem; /* Reduzido */
  }

  .day-number {
    font-size: 0.7rem; /* Reduzido */
  }
}

@media (max-width: 480px) {
  .calendar-container {
    padding: 6px; /* Reduzido */
  }

  .calendar-header h2 {
    font-size: 0.9rem; /* Reduzido */
  }

  .calendar-day {
    padding: 1px; /* Reduzido */
    aspect-ratio: 1;
    min-width: 20px; /* Reduzido */
    min-height: 20px; /* Reduzido */
  }

  .weekdays-header span {
    font-size: 0.5rem; /* Reduzido */
  }

  .day-number {
    font-size: 0.6rem; /* Reduzido */
  }

}
</style>