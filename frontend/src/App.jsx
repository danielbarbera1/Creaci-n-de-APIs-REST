import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const api = import.meta.env.VITE_API_URL

  // 1. Guardaremos las categorías aquí. Empieza como un arreglo vacío.
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([]) // Agregamos el estado para los productos

  useEffect(() => {
    // 2. Llamamos exactamente a la ruta
    fetch(`${api}/productos/categories/slug`)
      .then(response => response.json())
      .then(data => {
        // 3. Cuando le pedimos "slug", la API nos responde que no existe
        // pero nos devuelve un arreglo llamado "availableCategories"
        // con todas las categorías disponibles. ¡Eso es lo que guardamos!

        setCategorias(data.availableCategories)
        console.log(data.availableCategories)

      })
      .catch(error => {
        console.error('Error al consumir la API:', error)
      })
  }, [])

  useEffect(() => {
    // 2. Llamamos a la ruta general de productos para obtenerlos todos
    fetch(`${api}/productos`)
      .then(response => response.json())
      .then(data => {
        // La API /api/productos devuelve directamente el arreglo de productos
        setProductos(data)
      })
      .catch(error => {
        console.error('Error al consumir la API de productos:', error)
      })
  }, [])

  const handleCategoriaClick = (slug) => {
    // 1. Hacemos fetch a la nueva ruta que devuelve los productos de una categoría
    fetch(`${api}/productos/categories/${slug}`)
      .then(response => response.json())
      .then(data => {
        // 2. La API devuelve un objeto con la propiedad 'products'
        setProductos(data.products || [])
      })
      .catch(error => {
        console.error('Error al consumir la API de productos:', error)
      })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">APIs</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Contenedor de Categorías (Izquierda) */}
        <div className="w-full md:w-1/4 flex flex-col gap-4 border-r border-gray-200 pr-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 border-b pb-2">Categorías</h2>
          {categorias.map((categoria) => (
            <button key={categoria.slug} onClick={() => handleCategoriaClick(categoria.slug)} className="w-full  text-gray-800 bg-gray-100 hover:bg-blue-600 hover:text-white transition-colors duration-300 cursor-pointer py-3 px-4 rounded text-left shadow-sm">
              <span className="text-lg text-center flex justify-center items-center font-semibold capitalize">{categoria.slug}</span>
            </button>
          ))}
        </div>

        {/* Contenedor de Productos (Derecha) */}
        <div className="w-full md:w-3/4 md:pl-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.length === 0 ? (
              <p className="text-gray-400 italic text-sm col-span-full">No hay productos cargados.</p>
            ) : (
              productos.map((producto) => {
                // Soportamos ambos formatos (el de /api/productos y el de /api/productos/categories/:slug)
                const id = producto.id || producto.id_producto;
                const nombre = producto.nombre || producto.nombre_producto;
                const stock = producto.inventario ? producto.inventario.stock_actual : (producto.stock_actual || 0);

                return (
                  <div key={id} className="border border-gray-300 rounded p-4 bg-white hover:shadow-md hover:border-blue-500 transition-all flex flex-col justify-between">
                    <h4 className="font-semibold text-gray-800 mb-2">{nombre}</h4>
                    <div>
                      {stock > 0 ? (
                        <span className="inline-block px-2 py-1 bg-green-100 text-xs text-green-700 rounded-full font-medium">En Stock</span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-red-100 text-xs text-red-700 rounded-full font-medium">Sin Stock</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
