<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <div class="max-w-3xl bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">About Chicken Dash</h1>
      <p class="text-gray-600 text-lg">
        Welcome to <span class="font-semibold text-blue-500">Chicken Dash</span>, a fun and exciting game where speed, strategy, and reflexes matter! 
        Navigate through thrilling challenges, collect rewards, and beat your high score!
      </p>

      <h2 class="text-2xl font-semibold text-gray-700 mt-6">Features</h2>
      <ul class="list-disc list-inside text-gray-600 text-lg mt-2">
        <li>Fast-paced gameplay</li>
        <li>Multiple game modes</li>
        <li>Exciting power-ups</li>
        <li>Leaderboard to compete with friends</li>
      </ul>

      <h2 class="text-2xl font-semibold text-gray-700 mt-6">Meet the Developer</h2>
      <p class="text-gray-600 text-lg">
        This game was crafted with ❤️ using Vue 3, Phaser, and Tailwind CSS.
      </p>

      <router-link to="/" class="mt-6 inline-block text-blue-600 hover:underline">
        ← Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
