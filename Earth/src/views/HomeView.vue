<template>
    <div>
      <div class="font-bold text-5xl">Welcome to <span class="pilot-gaming-name text-6xl">PilotGaming</span>!</div>
      <nav class="game-thumnail-nav flex flex-col items-center gap-6 mt-5">
        <div v-for="(game, index) in gameInfos?.games" :key="index">
          <router-link :to="game.route">
            <img 
            :src="game.iconUrl" 
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
import { onMounted, ref } from 'vue';
import type { IGameThumbnailInfo } from '../models/gameThumnailInfo';
import betNRunThumbnail from '../assets/GameThumnail/bet-n-run.png';
import luckyDropThumbnail from '../assets/GameThumnail/lucky-drop.png';
import { EarthApiService } from '../Services/EarthApiService';
import type { IGetGameInfosResponse } from '../models/EarthApi/IGetGameInfosResponse';

const earthApiService = new EarthApiService();
const gameInfos = ref<IGetGameInfosResponse>();

onMounted(async () => {
  const response = await earthApiService.getGameInfos();
  if (response.errorCode === 0 && response.responseData) {
    gameInfos.value = response.responseData;
  } else {
    console.error('Failed to fetch game infos:', response.errorMessage);
  }
});
</script>