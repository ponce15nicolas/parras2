import { useState } from 'react'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Banner({ onSearch }) {
  const [filters, setFilters] = useState({
    dormitorios: '', banos: '', precioMin: '', precioMax: '',
    m2Min: '', m2Max: '', ubicacion: '', barrio: '', orden: '',
  })

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  const handleSearch = () => {
    onSearch(filters)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-between px-6 md:px-10 pt-[120px] pb-16 gap-10 md:gap-16 overflow-hidden flex-col md:flex-row">
      <img src="/banner.png" alt="Banner" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.05) 75%)' }} />

      <div className="relative z-[2] text-white max-w-[600px] text-center md:text-left flex-1">
        <motion.h1 {...fadeUp(0.1)} className="font-heading font-extrabold leading-[1.05] mb-5" style={{ fontSize: 'clamp(32px, 4.5vw, 62px)', textShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>
          ENCONTRÁ LA PROPIEDAD IDEAL Y AL <span className="text-[#d4af37]">MEJOR PRECIO</span>
        </motion.h1>
        <motion.p {...fadeUp(0.25)} className="opacity-90 mb-8 hidden sm:block" style={{ fontSize: 'clamp(15px, 1.5vw, 20px)' }}>
          Casas, departamentos y lotes en venta
        </motion.p>
        <motion.a {...fadeUp(0.4)} href="#catalogo" className="inline-flex items-center justify-center px-7 py-3.5 bg-[#d4af37] text-white font-semibold text-sm rounded-md hover:bg-white hover:text-[#d4af37] transition-all duration-300">
          Ver Propiedades
        </motion.a>
      </div>

      <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative z-[2] w-full max-w-[420px] bg-white/90 backdrop-blur-md rounded-2xl p-7 flex flex-col gap-3 shadow-2xl flex-shrink-0">
        <h3 className="flex items-center gap-2 font-bold text-[#d4af37] mb-2 text-xl">
          <i className="fas fa-search"></i> Búsqueda avanzada
        </h3>

        {[{ name: 'dormitorios', label: 'Dormitorios', options: ['1','2','3+'] }, { name: 'banos', label: 'Baños', options: ['1','2','3+'] }].map(({ name, label, options }) => (
          <select key={name} name={name} value={filters[name]} onChange={handleChange} className="border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none">
            <option value="">{label}</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}

        {[['precioMin','Precio mínimo'],['precioMax','Precio máximo'],['m2Min','Superficie mínima (m²)'],['m2Max','Superficie máxima (m²)']].map(([name, placeholder]) => (
          <input key={name} type="number" name={name} value={filters[name]} onChange={handleChange} placeholder={placeholder} className="border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none" />
        ))}

        {[['ubicacion','Provincia / Ciudad'],['barrio','Localidad / Barrio']].map(([name, placeholder]) => (
          <input key={name} type="text" name={name} value={filters[name]} onChange={handleChange} placeholder={placeholder} className="border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none" />
        ))}

        <select name="orden" value={filters.orden} onChange={handleChange} className="border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none">
          <option value="">Ordenar por</option>
          <option value="menor">Precio menor</option>
          <option value="mayor">Precio mayor</option>
          <option value="recientes">Más recientes</option>
        </select>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSearch} className="mt-1 py-3 bg-[#d4af37] text-white font-bold rounded-md text-sm hover:bg-white hover:text-[#d4af37] hover:ring-1 hover:ring-[#d4af37] transition-all duration-300">
          Buscar
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setFilters({ dormitorios: '', banos: '', precioMin: '', precioMax: '', m2Min: '', m2Max: '', ubicacion: '', barrio: '', orden: '' })
            onSearch(null)
          }}
          className="py-3 bg-white text-gray-500 font-bold rounded-md text-sm border border-gray-200 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
        >
          <i className="fas fa-times mr-2"></i>Limpiar filtros
        </motion.button>
      </motion.div>
    </section>
  )
}