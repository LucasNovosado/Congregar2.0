import Parse from "./parse";

export const login = async (usernameOrEmail, password) => {
  try {
    // Tenta fazer login com o username (sem converter para minúsculas)
    let user = await Parse.User.logIn(usernameOrEmail, password.toLowerCase()); // Apenas a senha é convertida para minúsculas
    return user;
  } catch (error) {
    // Se falhar, tenta fazer login com o email
    try {
      const query = new Parse.Query(Parse.User);
      query.equalTo("email", usernameOrEmail.toLowerCase()); // O email ainda é convertido para minúsculas
      const userByEmail = await query.first();
      if (userByEmail) {
        const user = await Parse.User.logIn(userByEmail.get("username"), password.toLowerCase()); // Apenas a senha é convertida para minúsculas
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
    user.set("username", username); // Sem conversão para minúsculas
    user.set("email", email.toLowerCase()); // O email ainda é convertido para minúsculas
    user.set("password", password.toLowerCase()); // Apenas a senha é convertida para minúsculas
    await user.signUp();
    return user;
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    throw error;
  }
};


export const isAuthenticated = async () => {
  const currentUser = Parse.User.current();
  return !!currentUser && currentUser.authenticated();
};

export const logout = async () => {
  try {
    await Parse.User.logOut();
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};