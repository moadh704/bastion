import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import UsersView from '../views/UsersView.vue';
import LogsView from '../views/LogsView.vue';
import ProfileView from '../views/ProfileView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/users', component: UsersView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/logs', component: LogsView, meta: { requiresAuth: true, requiresSuperAdmin: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) return next('/login');
  if (to.meta.requiresAdmin && !auth.isAdmin) return next('/dashboard');
  if (to.meta.requiresSuperAdmin && !auth.isSuperAdmin) return next('/dashboard');
  next();
});

export default router;