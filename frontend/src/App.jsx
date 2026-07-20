import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const api = import.meta.env.VITE_API_URL
  
  // 1. Guardaremos las categorías aquí. Empieza como un arreglo vacío.
  const [categorias, setCategorias] = useState([])

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
    // 2. Llamamos exactamente a la ruta
    fetch(`${api}/productos`)
      .then(response => response.json())
      .then(data => {
        
          setProductos(data.products)
      
      })
      .catch(error => {
        console.error('Error al consumir la API:', error)
      })
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">APIs</h1>

      <div className="flex flex-col gap-6">
        {categorias.map((categoria) => (
          <div key={categoria.slug} className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            
            {/* Sección de la Categoría (Botón/Cabecera) */}
            <button className="w-full md:w-1/4 lg:w-1/5 hover:bg-blue-600 hover:text-white bg-gray-50 text-gray-700 transition-colors duration-300 cursor-pointer flex flex-col justify-center items-center p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <span className="text-lg font-semibold capitalize">{categoria.slug.replace('-', ' ')}</span>
            </button>

            {/* Contenedor de Productos de la categoría */}
            <div className="w-full md:w-3/4 lg:w-4/5 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Productos</h2>
              <div className="flex flex-wrap gap-4">
                {/* Aquí renderizarás los productos de la categoría */}
                <p className="text-gray-400 italic text-sm">Los productos de "{categoria.slug}" aparecerán aquí...</p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
