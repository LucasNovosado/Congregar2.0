import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import CadastroPage from "@/views/CadastroPage.vue";
import { isAuthenticated } from "@/services/auth";
import AddPage from "@/views/AddPage.vue";
import EditPage from "@/views/EditPage.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/cadastro",
    name: "Cadastro",
    component: CadastroPage,
  },
  {
    path: '/cults/add',
    name: 'AddCult',
    component: AddPage
  },
  {
    path: '/cults/edit/:id',
    name: 'EditCult',
    component: EditPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;