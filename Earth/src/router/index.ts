import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue';
import About from '../views/About.vue';
import BetNRun from '../Games/BetNRun/BetNRun.vue';
import BetNRun2 from '../Games/BetNRun2/BetNRun2.vue';

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/about", name: "About", component: About },
  { path: "/bet-n-run", name: "BetNRun", component: BetNRun },
  { path: "/bet-n-run2", name: "BetNRun2", component: BetNRun2 },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
