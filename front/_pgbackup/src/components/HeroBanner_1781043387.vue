<template> 
    <div class="hero-banner"> 
        <h1 class="hero-title">Bartify</h1> 
        <p class="hero-description"> 
      Compra, vende e intercambia con tus vecinos en <br>  <strong>Playa del Carmen</strong>  </p> <span class="hero-footer">Encuentra artículos únicos de segunda mano cerca de ti</span> 
    </div>     
</template> 
<style scoped>
.hero-banner {
  background-color: var(--brand-red);
  color: white;
  padding: 32px 40px;
  border-radius: 16px;
  margin: 30px auto;
  max-width: 1100px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.hero-title {
  font-size: 2.2rem;
  margin: 0 0 16px 0;
  font-weight: 500;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.5;
  margin: 0 0 24px 0;
  opacity: 0.9;
}

.hero-footer {
  font-size: 0.85rem;
  opacity: 0.7;
  display: block;
}
</style>