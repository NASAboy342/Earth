<template>
    <div>
      <div class="font-bold text-5xl">Welcome to <span class="pilot-gaming-name text-6xl">PilotGaming</span>!</div>
      <nav class="game-thumnail-nav flex flex-col items-center gap-6 mt-5">
        <div v-for="(game, index) in thumnails" :key="index">
          <router-link :to="game.route">
            <img 
            :src="game.imgPath" 
            alt="Game Thumbnail" 
            class="thumpnail-img h-36 rounded-md transition transform hover:scale-105 hover:shadow-lg hover:border-2">
          </router-link>
        </div>
      </nav>
      <div class="mt-10 text-gray-500 italic">
        More games coming soon...
      </div>
    </div>
  </template>
  
<style scoped>
.thumpnail-img:hover{
  border-color: var(--hover-border-color);
}
.pilot-gaming-name{
  color: var(--hover-border-color);
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';
import type { GameThumbnailInfo } from '../models/gameThumnailInfo';
import betNRunThumbnail from '../assets/GameThumnail/bet-n-run.png';
import luckyDropThumbnail from '../assets/GameThumnail/lucky-drop.png';

const thumnails = ref<GameThumbnailInfo[]>([
  {
    imgPath: betNRunThumbnail,
    route: "/bet-n-run2",
  },
  // {
  //   imgPath: luckyDropThumbnail,
  //   route: "/lucky-drop",
  // },
  
  
])
</script>