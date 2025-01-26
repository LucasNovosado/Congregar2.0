import { createStore } from 'vuex';
import cultService from '@/services/cultService';
import Parse from '@/services/parse';

export default createStore({
  state: {
    username: null,
    cults: [],
    dateFilter: {
      startDate: null,
      endDate: null,
    },
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    SET_CULTS(state, cults) {
      state.cults = cults;
    },
    ADD_CULT(state, cult) {
      state.cults.push(cult);
    },
    UPDATE_CULT(state, updatedCult) {
      const index = state.cults.findIndex(c => c.id === updatedCult.id);
      if (index !== -1) {
        state.cults.splice(index, 1, updatedCult);
      }
    },
    DELETE_CULT(state, cultId) {
      state.cults = state.cults.filter(c => c.id !== cultId);
    },
    SET_DATE_FILTER(state, { startDate, endDate }) {
      state.dateFilter.startDate = startDate;
      state.dateFilter.endDate = endDate;
    },
  },
  actions: {
    updateUsername({ commit }, username) {
      commit('setUsername', username);
    },
    async fetchCults({ commit }) {
      try {
        const cults = await cultService.fetchCults();
        commit('SET_CULTS', cults);
      } catch (error) {
        console.error('Erro ao buscar cultos:', error);
        throw error;
      }
    },
    async addCult({ commit }, cultData) {
      try {
        const newCult = await cultService.addCult(cultData);
        commit('ADD_CULT', newCult);
        return newCult;
      } catch (error) {
        console.error('Erro ao adicionar culto:', error);
        throw error;
      }
    },
    async updateCult({ commit }, { cultId, cultData }) {
      try {
        const updatedCult = await cultService.updateCult(cultId, cultData);
        commit('UPDATE_CULT', updatedCult);
        return updatedCult;
      } catch (error) {
        console.error('Erro ao atualizar culto:', error);
        throw error;
      }
    },
    async deleteCult({ commit }, cultId) {
      try {
        await cultService.deleteCult(cultId);
        commit('DELETE_CULT', cultId);
      } catch (error) {
        console.error('Erro ao excluir culto:', error);
        throw error;
      }
    },
    setDateFilter({ commit }, { startDate, endDate }) {
      commit('SET_DATE_FILTER', { startDate, endDate });
    },
  },
  getters: {
    getUsername: state => state.username,
    getCults: state => {
      const { startDate, endDate } = state.dateFilter;
  
      // Ajusta as datas dos cultos para o fuso horário local
      const adjustedCults = state.cults.map(cult => {
        const adjustedDate = new Date(cult.date);
        adjustedDate.setDate(adjustedDate.getDate() + 1); // Adiciona um dia para corrigir a discrepância
  
        return {
          ...cult,
          date: adjustedDate.toISOString().split('T')[0], // Formata para o formato YYYY-MM-DD
        };
      });
  
      // Aplica o filtro de datas, se houver
      if (!startDate && !endDate) return adjustedCults;
  
      return adjustedCults.filter(cult => {
        const cultDate = new Date(cult.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
  
        return (!start || cultDate >= start) && (!end || cultDate <= end);
      });
    },
    getUserId: () => {
      const currentUser = Parse.User.current();
      return currentUser ? currentUser.id : null;
    },
  },
});