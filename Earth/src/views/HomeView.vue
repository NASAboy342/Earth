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

const thumnails = ref<GameThumbnailInfo[]>([
  {
    imgPath: new URL("../assets/GameThumnail/bet-n-run.png", import.meta.url).href,
    route: "/bet-n-run2",
  },
  {
    imgPath: new URL("../assets/GameThumnail/lucky-drop.png", import.meta.url).href,
    route: "/lucky-drop",
  },
  
  
])
</script>