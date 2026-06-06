import { useState, useEffect } from 'react'

const PASSWORD = 'parra2026'

const emptyProperty = {
  title: '', dormitorios: '', banos: '', m2: '', precio: '',
  ubicacion: '', ubicacionKey: '', barrio: '', barrioKey: '',
  tipo: 'venta', descripcion: '', descripcionExtra: '',
  mapsQuery: '', areaConstruida: '', areaTerreno: '',
  ciudad: '', region: '', pais: 'Argentina',
  image: '', images: [],
}

export default function AdminPanel({ onClose, baseProperties }) {
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [properties, setProperties] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProperty)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('admin_properties')
    if (stored) {
      setProperties(JSON.parse(stored))
    } else {
      setProperties(baseProperties)
    }
  }, [])

  const handleLogin = () => {
    if (pass === PASSWORD) {
      setAuth(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const save = (list) => {
    localStorage.setItem('admin_properties', JSON.stringify(list))
    setProperties(list)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleEdit = (prop) => {
    setEditing(prop.id)
    setForm({ ...prop })
  }

  const handleNew = () => {
    const newId = Date.now()
    setEditing(newId)
    setForm({ ...emptyProperty, id: newId })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSaveProperty = () => {
    const exists = properties.find((p) => p.id === form.id)
    let updated
    if (exists) {
      updated = properties.map((p) => p.id === form.id ? { ...form } : p)
    } else {
      updated = [...properties, { ...form }]
    }
    save(updated)
    setEditing(null)
  }

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar esta propiedad?')) return
    save(properties.filter((p) => p.id !== id))
    if (editing === id) setEditing(null)
  }

  const inputClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 w-full"
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block"

  if (!auth) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-[90%] max-w-sm flex flex-col gap-4 shadow-2xl">
          <h2 className="font-heading font-bold text-xl text-gray-900 text-center">Panel de administración</h2>
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className={inputClass}
          />
          {error && <p className="text-red-500 text-xs text-center">Contraseña incorrecta</p>}
          <button onClick={handleLogin} className="bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d4af37] transition-colors border-0 cursor-pointer">
            Ingresar
          </button>
          <button onClick={onClose} className="text-gray-400 text-xs text-center hover:text-gray-600 border-0 bg-transparent cursor-pointer">
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto my-10 bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="font-heading font-bold text-xl text-gray-900">
            <i className="fas fa-cog text-[#d4af37] mr-2"></i>
            Panel de administración
          </h2>
          <div className="flex items-center gap-3">
            {saved && <span className="text-green-500 text-sm font-semibold">✓ Guardado</span>}
            <button onClick={handleNew} className="px-4 py-2 bg-[#d4af37] text-white text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-gray-900 transition-colors">
              + Nueva propiedad
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-gray-200 transition-colors">
              Cerrar
            </button>
          </div>
        </div>

        <div className="flex">

          {/* Lista de propiedades */}
          <div className="w-72 border-r border-gray-100 p-4 flex flex-col gap-2 min-h-[600px]">
            {properties.map((p) => (
              <div
                key={p.id}
                onClick={() => handleEdit(p)}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${editing === p.id ? 'bg-[#d4af37]/10 border border-[#d4af37]' : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <p className="text-sm font-semibold text-gray-800 truncate">{p.title || 'Sin título'}</p>
                <p className="text-xs text-gray-400">{p.tipo} · {p.ubicacion}</p>
              </div>
            ))}
          </div>

          {/* Formulario */}
          {editing !== null ? (
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">

                <div className="col-span-2">
                  <label className={labelClass}>Título</label>
                  <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Tipo</label>
                  <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Precio</label>
                  <input name="precio" type="number" value={form.precio} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Dormitorios</label>
                  <input name="dormitorios" type="number" value={form.dormitorios} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Baños</label>
                  <input name="banos" type="number" value={form.banos} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>M²</label>
                  <input name="m2" type="number" value={form.m2} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Área construida</label>
                  <input name="areaConstruida" value={form.areaConstruida} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Área terreno</label>
                  <input name="areaTerreno" value={form.areaTerreno} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Ubicación</label>
                  <input name="ubicacion" value={form.ubicacion} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Ubicación Key</label>
                  <input name="ubicacionKey" value={form.ubicacionKey} onChange={handleChange} className={inputClass} placeholder="ej: resistencia" />
                </div>

                <div>
                  <label className={labelClass}>Barrio</label>
                  <input name="barrio" value={form.barrio} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Barrio Key</label>
                  <input name="barrioKey" value={form.barrioKey} onChange={handleChange} className={inputClass} placeholder="ej: belgrano" />
                </div>

                <div>
                  <label className={labelClass}>Ciudad</label>
                  <input name="ciudad" value={form.ciudad} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Región</label>
                  <input name="region" value={form.region} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>País</label>
                  <input name="pais" value={form.pais} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Maps Query</label>
                  <input name="mapsQuery" value={form.mapsQuery} onChange={handleChange} className={inputClass} placeholder="ej: Cangallo+1615+Resistencia" />
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Descripción corta</label>
                  <input name="descripcion" value={form.descripcion} onChange={handleChange} className={inputClass} />
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Descripción completa</label>
                  <textarea name="descripcionExtra" value={form.descripcionExtra} onChange={handleChange} rows={5} className={inputClass + ' resize-none'} />
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Imagen de portada (ruta)</label>
                  <input name="image" value={form.image} onChange={handleChange} className={inputClass} placeholder="ej: /terreno2.jpeg" />
                </div>

              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSaveProperty} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-[#d4af37] transition-colors">
                  Guardar cambios
                </button>
                <button onClick={() => handleDelete(form.id)} className="px-6 py-2.5 bg-red-50 text-red-500 text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-red-100 transition-colors">
                  Eliminar propiedad
                </button>
                <button onClick={() => setEditing(null)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-gray-200 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-300">
              <p className="text-sm">Seleccioná una propiedad o creá una nueva</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}