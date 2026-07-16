<template>
  <div class="modal-overlay" @click.self="omitir">
    <div class="modal-box">
      <h2 class="modal-title">¡Trato completado! 🎉</h2>
      <p class="modal-subtitle">
        ¿Cómo calificarías a {{ nombreOtro || 'la otra persona' }}?
      </p>

      <div class="estrellas" @mouseleave="hover = 0">
        <button
          v-for="n in 5"
          :key="n"
          type="button"
          class="estrella"
          :class="{ activa: n <= (hover || valor) }"
          @mouseenter="hover = n"
          @click="valor = n"
        >★</button>
      </div>

      <p v-if="errorMsg" class="modal-error-inline">{{ errorMsg }}</p>

      <div class="modal-actions">
        <button class="btn-omitir" :disabled="enviando" @click="omitir">
          Omitir
        </button>
        <button
          class="btn-enviar"
          :disabled="!valor || enviando"
          @click="enviar"
        >
          {{ enviando ? 'Enviando...' : 'Enviar calificación' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  nombreOtro: { type: String, default: '' }
})

const emit = defineEmits(['rate', 'close'])

const valor = ref(0)
const hover = ref(0)
const enviando = ref(false)
const errorMsg = ref('')

const omitir = () => {
  if (enviando.value) return
  emit('close')
}

const enviar = () => {
  if (!valor.value || enviando.value) return
  enviando.value = true
  errorMsg.value = ''
  // El padre es quien llama a usuariosApi.rate(...) y decide cuándo cerrar
  // el modal (o mostrar un error y dejarlo abierto para reintentar).
  emit('rate', valor.value)
}

// El padre puede llamar a esto (via template ref) si la calificación falló
// y quiere dejar el modal abierto para reintentar.
defineExpose({
  marcarError(msg) {
    enviando.value = false
    errorMsg.value = msg || 'No se pudo enviar la calificación. Intenta de nuevo.'
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 16px;
}

.modal-box {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 380px;
  padding: 26px 24px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.modal-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 18px;
}

.estrellas {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.estrella {
  background: none;
  border: none;
  font-size: 2.1rem;
  line-height: 1;
  color: #ddd;
  cursor: pointer;
  padding: 2px;
  transition: color 0.1s, transform 0.1s;
}

.estrella:hover { transform: scale(1.1); }
.estrella.activa { color: #FFC53D; }

.modal-error-inline {
  color: #d92100;
  font-size: 0.8rem;
  margin: 10px 0 0;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-omitir,
.btn-enviar {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 11px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-omitir {
  background: #f0f0f0;
  color: #555;
}
.btn-omitir:hover:not(:disabled) { background: #e2e2e2; }

.btn-enviar {
  background-color: #FA2700;
  color: white;
}
.btn-enviar:hover:not(:disabled) { background-color: #d92100; }

.btn-omitir:disabled,
.btn-enviar:disabled { opacity: 0.5; cursor: not-allowed; }
</style>