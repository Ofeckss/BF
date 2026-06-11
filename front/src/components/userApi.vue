<template>
  <div class="product-container">
    <h2>Lista de Usuarios</h2>

    <ul>
      <li v-for="user in productStore.users" :key="user.id">
        {{ user.apellido }}, {{ user.nombre }} - {{ user.edad }} años
      </li>
    </ul>

    <p v-if="productStore.users.length > 0">
      El apellido del segundo usuario es: {{ productStore.users[1].apellido }}
    </p>
    <p v-else>Cargando datos del usuario...</p>
    
    <button @click="cargarDatos">Actualizar Usuarios</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUsuariosStore } from '../stores/usuariosStore';

const productStore = useUsuariosStore();

const cargarDatos = () => {
  productStore.fetchUsuarios();
};

onMounted(() => {
  cargarDatos();
});
</script>