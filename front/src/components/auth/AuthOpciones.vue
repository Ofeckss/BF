<!-- src/components/auth/AuthOpciones.vue -->
<script setup>
defineEmits(['cambiarVista'])
</script>

<template>
  <div class="view-fade">
    <h1 class="logo-title">Bartify</h1>
    <p class="subtitle">Compra, vende e intercambia con tus vecinos</p>
    
    <div class="button-stack">
      <button @click="$emit('cambiarVista', 'login')" class="btn-light">
        Iniciar Sesion
      </button>
      <button @click="$emit('cambiarVista', 'registro')" class="btn-light">
        Crear Cuenta
      </button>
    </div>
  </div>
</template>

<style scoped>
.logo-title {
  text-align: center;
  font-size: 3rem;
  color: var(--brand-orange);
  margin: 0 0 12px 0;
  font-weight: bold;
}

.subtitle {
  text-align: center;
  color: #555555;
  margin: 0 0 35px 0;
  font-size: 1.1rem;
  line-height: 1.4;
}

.button-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-light {
  background-color: #DCDCDC;
  color: #222222;
  border: none;
  border-radius: 16px;
  padding: 14px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
  width: 100%;
}

.btn-light:hover {
  background-color: #CECECE;
}

.view-fade {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>