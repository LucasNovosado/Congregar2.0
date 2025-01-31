<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button class="nav-btn" @click="previousMonth">
        <van-icon name="arrow-left" />
      </button>
      <h2>{{ currentMonth }} {{ currentYear }}</h2>
      <button class="nav-btn" @click="nextMonth">
        <van-icon name="arrow" />
      </button>
    </div>

    <div class="weekdays-header">
      <span v-for="day in weekDays" :key="day">{{ day }}</span>
    </div>

    <div class="calendar-grid">
      <div
        v-for="{ date, inMonth, cultCount, cults } in calendarDays"
        :key="date.toISOString()"
        class="calendar-day"
        :class="{
          'other-month': !inMonth,
          'has-cult': cultCount > 0,
          'multiple-cults': cultCount > 1
        }"
        @click="cultCount > 0 ? showCultDetails(date, cults) : null"
      >
        <span class="day-number">{{ date.getDate() }}</span>
        <span v-if="cultCount > 0" class="cult-indicator">
          <span v-if="cultCount > 1" class="cult-count">{{ cultCount }}x</span>
          <van-icon v-else name="hand-o" />
        </span>
      
      </div>
    </div>
  </div>
</template>

<script>
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Icon as VanIcon, Dialog } from 'vant';
import 'vant/es/dialog/style';
import { mapGetters } from 'vuex';

export default {
  name: 'CalendarCult',
  components: { VanIcon },
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
        .map(date => {
          const cults = this.getCults.filter(cult => 
            format(new Date(cult.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );

          return {
            date,
            inMonth: date.getMonth() === this.currentDate.getMonth(),
            cultCount: cults.length,
            cults: cults
          };
        });
    }
  },
  methods: {
    previousMonth() {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    nextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
    },
    showCultDetails(date, cults) {
      const formattedDate = format(date, 'dd/MM/yyyy');
      let message = '';
      
      if (cults.length === 1) {
        message = `Local: ${cults[0].location}`;
      } else {
        message = cults.map((cult, index) => 
          `${index + 1}º Culto - Local: ${cult.location}`
        ).join('\n');
      }

      Dialog.alert({
        title: `Cultos em ${formattedDate}`,
        message,
        theme: 'round-button',
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#073e79'
      });
    }
  }
};
</script>

<style scoped>

.calendar-day {
  cursor: pointer;
}

.calendar-day.has-cult:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.calendar-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  max-width: 600px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.calendar-header h2 {
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 800;
  text-transform: capitalize;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 6px;
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
  margin-bottom: 5px;
}

.weekdays-header span {
  color: #90caf9;
  font-weight: 600;
  text-align: center;
  padding: 4px;
  font-size: 0.7rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 4px;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.calendar-day:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.day-number {
  color: white;
  font-weight: 500;
  font-size: 0.8rem;
}

.other-month {
  opacity: 0.5;
}

.has-cult {
  background: rgba(76, 175, 80, 0.3);
  border: 1px solid rgba(76, 175, 80, 0.5);
}

.multiple-cults {
  background: rgba(76, 175, 80, 0.5);
  border: 1px solid rgba(76, 175, 80, 0.8);
}

.has-cult:hover {
  background: rgba(76, 175, 80, 0.4);
}

.cult-indicator {
  font-size: 0.8rem;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cult-count {
  color: #ffd700;
  font-weight: bold;
  font-size: 0.7rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.cult-indicator .van-icon {
  font-size: 1rem;
  color: #ffd700;
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 8px;
  }

  .calendar-header h2 {
    font-size: 1rem;
  }

  .calendar-day {
    padding: 2px;
  }

  .weekdays-header span {
    font-size: 0.6rem;
  }

  .day-number {
    font-size: 0.9rem;
  }

  .cult-count {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .calendar-container {
    padding: 6px;
  }

  .calendar-header h2 {
    font-size: 0.9rem;
  }

  .calendar-day {
    padding: 1px;
    aspect-ratio: 1;
    min-width: 20px;
    min-height: 20px;
    gap: 1px;
  }

  .weekdays-header span {
    font-size: 0.5rem;
  }

  .day-number {
    font-size: 0.6rem;
  }

  .cult-count {
    font-size: 0.5rem;
  }
}
</style>
