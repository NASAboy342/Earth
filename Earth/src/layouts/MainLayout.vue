<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import logoImg from '../assets/Logo.png';

const route = useRoute();
const logoDisplayType = ref<string>("");
const screenWidth = ref<number>(window.innerWidth);
const isMobileScreen = ref<boolean>(screenWidth.value < 768);
const navBarStyle = ref<string>(isMobileScreen.value ? "mobile-nav-bar" : "desktop-nav-bar");
const layoutStyle = ref<string>(isMobileScreen.value ? "mobile_layout" : "desktop_layout");

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
  <div :class="layoutStyle">
    <div
      :style="`display: ${logoDisplayType} ;`"
      class="logo-container flex justify-center"
    >
      <img :src="logoImg" alt="PilotGaming Logo" class="w-36" />
    </div>
    <header>
      <nav :class="navBarStyle">
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
.desktop_layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 100%;
}
.mobile_layout {
  @apply desktop_layout;
  justify-content: start;
  padding-top: 10px;
}

.mobile-nav-bar {
  padding: 5px;
}
.desktop-nav-bar {
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
.logo-container{
  margin-top: 10px;
}
</style>
