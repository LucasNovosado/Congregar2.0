import Parse from "./parse";
import store from '@/store';

export const login = async (usernameOrEmail, password) => {
  try {
    // Tenta fazer login com o username (sem converter para minúsculas)
    let user = await Parse.User.logIn(usernameOrEmail, password.toLowerCase());
    
    // Salva as informações de autenticação
    store.dispatch('saveAuthToken', user.getSessionToken());
    store.dispatch('updateUsername', user.get('username'));
    
    return user;
  } catch (error) {
    // Se falhar, tenta fazer login com o email
    try {
      const query = new Parse.Query(Parse.User);
      query.equalTo("email", usernameOrEmail.toLowerCase());
      const userByEmail = await query.first();
      
      if (userByEmail) {
        const user = await Parse.User.logIn(userByEmail.get("username"), password.toLowerCase());
        
        // Salva as informações de autenticação
        store.dispatch('saveAuthToken', user.getSessionToken());
        store.dispatch('updateUsername', user.get('username'));
        
        return user;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }
};

export const cadastrarUsuario = async (username, email, password) => {
  try {
    const user = new Parse.User();
    user.set("username", username);
    user.set("email", email.toLowerCase());
    user.set("password", password.toLowerCase());
    
    await user.signUp();
    
    // Após cadastro bem-sucedido, salva as informações de autenticação
    store.dispatch('saveAuthToken', user.getSessionToken());
    store.dispatch('updateUsername', user.get('username'));
    
    return user;
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    throw error;
  }
};

export const checkAuth = async () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      await Parse.User.become(token);
      const currentUser = Parse.User.current();
      
      if (currentUser) {
        // Atualiza o store com as informações do usuário atual
        store.dispatch('saveAuthToken', token);
        store.dispatch('updateUsername', currentUser.get('username'));
        return true;
      }
    } catch (error) {
      // Se o token for inválido, limpa a autenticação
      store.dispatch('logout');
      return false;
    }
  }
  return false;
};

export const isAuthenticated = async () => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    return await checkAuth();
  }
  return currentUser.authenticated();
};

export const logout = async () => {
  try {
    await Parse.User.logOut();
    // Limpa os dados de autenticação no store
    store.dispatch('logout');
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};
