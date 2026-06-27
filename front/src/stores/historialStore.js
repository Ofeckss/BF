import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useHistorialStore = defineStore('historial', () => {
  const historial = ref([])

  const _storageKey = (userId) => `historial_${userId}`

  const cargarHistorial = (userId) => {
    if (!userId) return
    try {
      const raw = localStorage.getItem(_storageKey(userId))
      historial.value = raw ? JSON.parse(raw) : []
    } catch {
      historial.value = []
    }
  }

  const registrarVisita = (articulo, userId) => {
    if (!userId || !articulo?.id) return

    const filtrado = historial.value.filter(a => String(a.id) !== String(articulo.id))
    const entrada = { ...articulo, visitadoEn: new Date().toISOString() }
    
    historial.value = [entrada, ...filtrado].slice(0, 50) // máx 50
    localStorage.setItem(_storageKey(userId), JSON.stringify(historial.value))
  }

  const limpiarHistorial = (userId) => {
    if (!userId) return
    historial.value = []
    localStorage.removeItem(_storageKey(userId))
  }

  return { historial, cargarHistorial, registrarVisita, limpiarHistorial }
})
