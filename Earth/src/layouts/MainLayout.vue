<template>
    <div class="layout">
      <header>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
        </nav>
      </header>
  
      <main>
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
  