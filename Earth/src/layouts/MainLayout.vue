<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import logoImg from '../assets/Logo.png';

const route = useRoute();
const logoDisplayType = ref<string>("");
const screenWidth = ref<number>(window.innerWidth);

watch(
  () => route.name, (newName, oldName) => {
    if (newName === "Home") {
      logoDisplayType.value = "";
    } else {
      logoDisplayType.value = "none";
    }
  }
);
</script>

<template>
  <div class="layout">
    <div
      :style="`display: ${logoDisplayType} ;`"
      class="logo-container flex justify-center"
    >
      <img :src="logoImg" alt="PilotGaming Logo" class="w-36" />
    </div>
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>

    <main :class="screenWidth < 768 ? 'mobile-main' : 'desktop-main'">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  text-align: center;
}

nav {
  padding: 10px;
}

nav a {
  margin: 10px;
  text-decoration: none;
  color: white;
  font-weight: bold;
}

nav a.router-link-active {
  color: var(--active-color);
}
.desktop-main{
  padding: 50px;
  border-radius: 10px;
}
.mobile-main{
  padding: 0px;
}
</style>
