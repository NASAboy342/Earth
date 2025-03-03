import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue';
import About from '../views/About.vue';
import BetNRun from '../Games/BetNRun/BetNRun.vue';

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/about", name: "About", component: About },
  { path: "/bet-n-run", name: "BetNRun", component: BetNRun },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
