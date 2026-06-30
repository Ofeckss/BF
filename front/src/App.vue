<template> 
    <div class="app-layout"> 
        <MainNavbar/> 
        <main class="page-content"> 
            <router-view/> 
        </main>         
    </div>     
</template> 

<script setup>
import MainNavbar from './components/MainNavbar.vue'
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
</style>