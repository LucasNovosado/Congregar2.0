import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import CadastroPage from "@/views/CadastroPage.vue";
import AddPage from "@/views/AddPage.vue";
import EditPage from "@/views/EditPage.vue";
import { checkAuth } from "@/services/auth";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: "/cadastro",
    name: "Cadastro",
    component: CadastroPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/cults/add',
    name: 'AddCult',
    component: AddPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/cults/edit/:id',
    name: 'EditCult',
    component: EditPage,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthed = await checkAuth();
  
  // Se a rota requer autenticação e o usuário não está autenticado
  if (to.meta.requiresAuth && !isAuthed) {
    next({ name: "Login" });
  }
  // Se o usuário está tentando acessar login/cadastro enquanto autenticado
  else if (isAuthed && (to.name === "Login" || to.name === "Cadastro")) {
    next({ name: "Dashboard" });
  }
  // Em outros casos, permite a navegação
  else {
    next();
  }
});

export default router;
