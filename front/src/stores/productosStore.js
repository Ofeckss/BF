import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import productosApi from '../services/productosApi'


const mapArticulo = (a) => ({
  id: String(a.id),
  title: a.nombre,
  description: a.descripcion,
  price: Number(a.precio),
  location: a.ubicacion,
  status: a.disponible ? 'Disponible' : 'No disponible',
  esTrueque: a.esTrueque,         
  categoria_id: a.categoriaId,
  vendedor_id: a.vendedorId,
  tags: a.categoria ? [a.categoria.nombre] : [],
  image: '',
  owner: a.vendedor
    ? `${a.vendedor.nombre} ${a.vendedor.apellido}`
    : 'Anónimo',
  fecha_publicacion: a.fecha_publicacion
})

export const useProductosStore = defineStore('productos', () => {
  const products = ref([])
  const categorias = ref([])
  const loading = ref(false)
  const error = ref('')
 
  const getProductById = computed(
    () => (id) => products.value.find((p) => String(p.id) === String(id))
  )
 
  const fetchFotos = async (articulos) => {
    return Promise.all(
      articulos.map(async (producto) => {
        try {
          const res = await productosApi.getFotosByArticulo(producto.id)
          const fotos = res?.data || []
          producto.image = fotos[0]?.url || ''
        } catch {
          producto.image = ''
        }
        return producto
      })
    )
  }
 
  const fetchFromServer = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await productosApi.getAll()
      if (res?.data && Array.isArray(res.data)) {
        const articulosMapeados = res.data.map(mapArticulo)
        products.value = await fetchFotos(articulosMapeados)
      }
    } catch (err) {
      console.warn('API no disponible:', err)
      error.value = 'No se pudo conectar al servidor.'
    } finally {
      loading.value = false
    }
  }
 
  const fetchCategorias = async () => {
    try {
      const res = await productosApi.getCategorias()
      if (res?.data) categorias.value = res.data
    } catch (err) {
      console.warn('No se pudieron cargar categorias:', err)
      categorias.value = [
        { id: 1, nombre: 'Electrónicos' },
        { id: 2, nombre: 'Ropa' },
        { id: 3, nombre: 'Accesorios' },
        { id: 4, nombre: 'Hogar' },
        { id: 5, nombre: 'Deportes' }
      ]
    }
  }
 
  const addProduct = async (form) => {
    const payload = {
      Nombre: form.title,
      Descripcion: form.description,
      VendedorId: form.vendedor_id,
      CategoriaId: form.categoria_id,
      Precio: Number(form.price),
      EsTrueque: form.trueque,
      EstadoId: form.estadoId1,
      UbicacionId: form.ubicacionId,
      disponible: true
    }
 
    const res = await productosApi.create(payload)
    const created = res?.data
 
    let imageUrl = ''
    if (created?.id && form.imageFiles?.length) {
      try {
        const fotoRes = await productosApi.createFoto(form.imageFiles, created.id)
        imageUrl = fotoRes?.data?.[0]?.url || ''
      } catch (fotoErr) {
        console.warn('Foto no se pudo guardar:', fotoErr)
      }
    }
 
    const newProduct = {
      id: String(created?.id || Date.now()),
      title: form.title,
      description: form.description,
      price: Number(form.price),
      location: form.location,
      status: 'Disponible',
      trueque: form.trueque,
      categoria_id: form.categoria_id,
      vendedor_id: form.vendedor_id,
      tags: [],
      image: imageUrl,
      owner: form.ownerName || 'Anónimo',
      fecha_publicacion: new Date().toISOString().slice(0, 10)
    }
 
    products.value.unshift(newProduct)
    return newProduct
  }
 
  return {
    products,
    categorias,
    loading,
    error,
    getProductById,
    fetchFromServer,
    fetchCategorias,
    addProduct
  }
})