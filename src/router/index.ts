import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import PremiumView from '../views/PremiumView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PremiumSuccessView from '../views/PremiumSuccessView.vue'
import InserisciSquadraView from '../views/InserisciSquadraView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/premium',
    name: 'premium',
    component: PremiumView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/premium-success',
    name: 'PremiumSuccess',
    component: PremiumSuccessView
  },
  {
    path: '/inserisci-squadra',
    name: 'InserisciSquadra',
    component:InserisciSquadraView
  },
  {
    path: '/formazione-ai',
    name: 'FormazioneAI',
    component: () => import('../views/FormazionePreview.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

