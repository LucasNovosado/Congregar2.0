import Parse from 'parse';

export default {
  async fetchCults() {
    const Cult = Parse.Object.extend('Cult');
    const query = new Parse.Query(Cult);
    const currentUser = Parse.User.current();
    query.equalTo('user', currentUser);
    try {
      const results = await query.find();
      return results.map(cult => ({
        id: cult.id,
        date: cult.get('date'),
        location: cult.get('location'),
        service: cult.get('service'),
        hollyWord: cult.get('hollyWord'),
        preaching: cult.get('preaching'),
        amount: cult.get('amount'),
        exhortation: cult.get('exhortation'),
        typeCult: cult.get('typeCult'),
        user: cult.get('user').id
      }));
    } catch (error) {
      console.error('Erro ao buscar cultos:', error);
      throw error;
    }
  },

  async addCult(cultData) {
    console.log('Iniciando addCult com dados:', cultData);
    const Cult = Parse.Object.extend('Cult');
    const cult = new Cult();
    const currentUser = Parse.User.current();
  
    if (!currentUser) {
      console.error('Usuário não encontrado');
      throw new Error('Usuário não autenticado');
    }
  
    try {
      console.log('Usuário atual:', currentUser.id);
      
      // Conversão explícita de tipos
      const processedData = {
        ...cultData,
        amount: parseInt(cultData.amount),
        date: new Date(cultData.date)
      };
  
      Object.entries(processedData).forEach(([key, value]) => {
        console.log(`Definindo ${key}:`, value);
        cult.set(key, value);
      });
      
      cult.set('user', currentUser);
      
      const result = await cult.save(null, { sessionToken: currentUser.getSessionToken() });
      console.log('Culto salvo com sucesso:', result.id);
      
      return {
        id: result.id,
        ...processedData,
        user: currentUser.id
      };
    } catch (error) {
      console.error('Erro detalhado ao adicionar culto:', error.message, error.stack);
      throw error;
    }
  },

// Em cultService.js, modifique o método updateCult
async updateCult(cultId, cultData) {
    const Cult = Parse.Object.extend('Cult');
    const query = new Parse.Query(Cult);
    try {
      const cult = await query.get(cultId);
      const currentUser = Parse.User.current();
      
      const processedData = {
        ...cultData,
        date: new Date(cultData.date),
        amount: parseInt(cultData.amount),
        user: currentUser // Mantém o ponteiro User atual
      };
  
      // Remove user do processedData para não sobrescrever
      delete processedData.user;
  
      Object.entries(processedData).forEach(([key, value]) => {
        cult.set(key, value);
      });
  
      const result = await cult.save();
      return {
        id: result.id,
        ...cultData,
        user: currentUser.id
      };
    } catch (error) {
      console.error('Erro ao atualizar culto:', error);
      throw error;
    }
  },

  async deleteCult(cultId) {
    const Cult = Parse.Object.extend('Cult');
    const query = new Parse.Query(Cult);
    try {
      const cult = await query.get(cultId);
      await cult.destroy();
      return cultId;
    } catch (error) {
      console.error('Erro ao excluir culto:', error);
      throw error;
    }
  }
};