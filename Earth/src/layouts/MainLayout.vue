<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const logoDisplayType = ref<string>("");

watch(
  () => route.name,
  (newName, oldName) => {
    console.log(newName);
    if (newName === "Home") {
      logoDisplayType.value = "";
    } else {
      logoDisplayType.value = "none";
    }
    console.log(logoDisplayType.value);
  }
);
</script>

<template>
  <div class="layout">
    <div
      :style="`display: ${logoDisplayType} ;`"
      class="logo-container flex justify-center"
    >
      <img src="../assets/Logo.png" alt="PilotGaming Logo" class="w-36" />
    </div>
    <header>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </nav>
    </header>

    <main style="padding: 50px;">
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
  color: yellow;
}
</style>
