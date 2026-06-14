import { defineStore } from 'pinia'
import productosApi from '../services/productosApi'


const mapArticulo = (a) => ({
  id: String(a.id),
  title: a.nombre,
  description: a.descripcion,
  price: Number(a.precio),
  location: a.ubicacion,
  status: a.disponible ? 'Disponible' : 'No disponible',
  trueque: a.trueque,         
  categoria_id: a.categoria_id,
  vendedor_id: a.vendedor_id,
  tags: a.categoria ? [a.categoria.nombre] : [],
  image: a.fotos?.[0]?.url || '',
  owner: a.vendedor
    ? `${a.vendedor.nombre} ${a.vendedor.apellido}`
    : 'Anónimo',
  fecha_publicacion: a.fecha_publicacion
})

const makeTempProduct = (form, id) => ({
  id,
  title: form.title,
  description: form.description,
  price: Number(form.price),
  location: form.location,
  status: form.disponible ? 'Disponible' : 'No disponible',
  trueque: form.trueque,
  categoria_id: form.categoria_id,
  vendedor_id: form.vendedor_id,
  tags: form.tags || [],
  image: form.image || '',
  owner: 'Anónimo',
  fecha_publicacion: new Date().toISOString().slice(0, 10)
})

export const useProductosStore = defineStore('productos', {
  state: () => ({
    products: [],
    categorias: [],
    loading: false,
    error: ''
  }),

  getters: {
    getProductById: (state) => (id) =>
      state.products.find((p) => String(p.id) === String(id))
  },

  actions: {
    async fetchFromServer() {
      this.loading = true
      try {
        const res = await productosApi.getAll()
        if (res?.data && Array.isArray(res.data)) {
          this.products = res.data.map(mapArticulo)
        }
      } catch (err) {
        console.warn('API no disponible:', err)
        this.error = 'No se pudo conectar al servidor.'
      } finally {
        this.loading = false
      }
    },

    async fetchCategorias() {
      try {
        const res = await productosApi.getCategorias()
        if (res?.data) this.categorias = res.data
      } catch (err) {
        console.warn('No se pudieron cargar categorias:', err)
        this.categorias = [
          { id: 1, nombre: 'Electrónicos' },
          { id: 2, nombre: 'Ropa' },
          { id: 3, nombre: 'Accesorios' },
          { id: 4, nombre: 'Hogar' },
          { id: 5, nombre: 'Deportes' }
        ]
      }
    },

    async addProduct(form) {
      const payload = {
        nombre: form.title,
        descripcion: form.description,
        vendedor_id: form.vendedor_id || 1,   
        categoria_id: form.categoria_id || 1,
        precio: Number(form.price),
        trueque: form.trueque ?? 0,           
        fecha_publicacion: new Date().toISOString().slice(0, 10),
        ubicacion: form.location || 'Playa del Carmen',
        disponible: 1
      }

      try {
        const res = await productosApi.create(payload)
        const created = res?.data

        if (created?.id && form.image) {
          try {
            await productosApi.createFoto({
              articulo_id: created.id,
              url: form.image,
              orden: 0
            })
          } catch (fotoErr) {
            console.warn('Foto no se pudo guardar en DB:', fotoErr)
          }
        }

        const newProduct = makeTempProduct(
          { ...form, tags: form.tags || [] },
          String(created?.id || Date.now())
        )
        if (form.image) newProduct.image = form.image

        this.products.unshift(newProduct)
        return newProduct
      } catch (err) {
        // Fallback local si la API falla
        console.warn('API falló, agregando localmente:', err)
        const tempProduct = makeTempProduct(form, String(Date.now()))
        this.products.unshift(tempProduct)
        return tempProduct
      }
    }
  }
})