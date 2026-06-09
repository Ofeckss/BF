<template>
  <div class="app-layout">
  
    <MainNavbar />
    <main class="page-content">
      <router-view />
      <HeroBanner />
      
      <div class="products-container"></div>
    </main>
  </div>
</template>

<script setup>
import MainNavbar from './components/MainNavbar.vue'
import HeroBanner from './components/HeroBanner.vue'
</script>

<style scoped>
.app-layout {
  width: 100%;
  min-height: 100vh;
}

.page-content {
  padding: 0 40px; 
  max-width: 1440px; 
  margin: 0 auto;
}

.products-container {
  margin-top: 20px;
}
</style>