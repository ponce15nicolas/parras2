import { motion } from 'framer-motion'
import { useState } from 'react'

export default function PropertyModal({ property, onClose }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (!property) return null
  const images =
  Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : property.image
    ? [property.image]
    : []

  const formatted = new Intl.NumberFormat('es-AR').format(property.precio)
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.nombre || !form.email || !form.telefono) return
    const texto = `Hola! Me interesa la propiedad: *${property.title}* %0APrecio: $${formatted} %0ANombre: ${form.nombre} %0AEmail: ${form.email} %0ATel: ${form.telefono} %0AMensaje: ${form.mensaje}`
    window.open(`https://wa.me/5493482440734?text=${texto}`, '_blank')
    setEnviado(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Breadcrumb / volver */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 md:px-10 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#d4af37] transition-colors duration-200 bg-transparent border-0 cursor-pointer"
        >
          <i className="fas fa-arrow-left text-[#d4af37]"></i>
          Volver al listado
        </button>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col gap-10">

        {/* Imagen + Info */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Imagen */}
          <motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="lg:w-3/5 flex-shrink-0 flex flex-col gap-3"
>
  {/* Imagen principal con zoom */}
  <div
    className="rounded-2xl overflow-hidden shadow-xl cursor-zoom-in relative"
    style={{ height: '480px' }}
    onClick={() => setZoomed(true)}
  >
    <img
      src={images[activeImg] || property.image}
      alt={property.title}
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
    />
    {images.length > 1 && (
      <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {activeImg + 1} / {images.length}
      </span>
    )}
  </div>

  {/* Miniaturas */}
  {images.length > 1 && (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => setActiveImg(i)}
          className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
            i === activeImg ? 'border-[#d4af37]' : 'border-transparent opacity-60 hover:opacity-100'
          }`}
        >
          <img src={img} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  )}
</motion.div>

          {/* Info + Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:w-2/5 flex flex-col gap-5"
          >
            {/* Badge + título + precio */}
            <div>
              <span className="inline-block bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                {property.tipo}
              </span>
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 leading-snug">{property.title}</h1>
              <p className="text-[#d4af37] font-heading font-bold text-4xl mt-2">${formatted}</p>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                <i className="fas fa-map-marker-alt text-[#d4af37]"></i>
                <span>{property.ubicacion} · {property.barrio}</span>
              </div>
            </div>

            {/* Características */}
            <div className="flex gap-6 py-4 border-y border-gray-100">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <i className="fas fa-bed text-[#d4af37] text-base"></i>
                <span>{property.dormitorios} dorm.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <i className="fas fa-bath text-[#d4af37] text-base"></i>
                <span>{property.banos} baño{property.banos > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <i className="fas fa-ruler-combined text-[#d4af37] text-base"></i>
                <span>{property.m2} m²</span>
              </div>
            </div>

            {/* Formulario */}
            <div className="flex flex-col gap-3">
              <h3 className="font-heading font-semibold text-gray-800 text-sm">
                <i className="fas fa-envelope text-[#d4af37] mr-2"></i>
                Consultar por esta propiedad
              </h3>
              {enviado ? (
                <div className="text-center py-6">
                  <i className="fas fa-check-circle text-4xl text-green-500 mb-3 block"></i>
                  <p className="font-heading font-bold text-gray-800 text-lg">¡Consulta enviada!</p>
                  <p className="text-gray-400 text-sm mt-1">Nos pondremos en contacto a la brevedad</p>
                </div>
              ) : (
                <>
                  {[
                    { name: 'nombre', placeholder: 'Tu nombre', type: 'text' },
                    { name: 'email', placeholder: 'Tu email', type: 'email' },
                    { name: 'telefono', placeholder: 'Tu teléfono', type: 'tel' },
                  ].map(({ name, placeholder, type }) => (
                    <input key={name} type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                      className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40" />
                  ))}
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange} placeholder="Tu mensaje (opcional)" rows={3}
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 resize-none" />
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                    className="py-3.5 bg-[#d4af37] text-white font-heading font-bold rounded-lg text-sm hover:bg-black transition-colors duration-300 border-0 cursor-pointer">
                    <i className="fab fa-whatsapp mr-2 text-base"></i>Enviar consulta por WhatsApp
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Fila inferior: Datos + Descripción + Mapa */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Datos del inmueble */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-4">
              <i className="fas fa-info-circle text-[#d4af37] mr-2"></i>
              Datos del inmueble
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'País', value: property.pais, icon: 'fa-flag' },
                { label: 'Región', value: property.region, icon: 'fa-map' },
                { label: 'Ciudad', value: property.ciudad, icon: 'fa-city' },
                { label: 'Área construida', value: property.areaConstruida, icon: 'fa-home' },
                { label: 'Área terreno', value: property.areaTerreno, icon: 'fa-ruler-combined' },
                { label: 'Tipo', value: property.tipo.charAt(0).toUpperCase() + property.tipo.slice(1), icon: 'fa-tag' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <i className={`fas ${icon} text-[#d4af37] text-xs`}></i>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                  </div>
                  <p className="font-heading font-bold text-gray-800 text-sm">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Descripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-1"
          >
            {property.descripcionExtra && (
              <>
                <h3 className="font-heading font-bold text-gray-900 text-lg mb-4">
                  <i className="fas fa-align-left text-[#d4af37] mr-2"></i>
                  Descripción
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{property.descripcionExtra}</p>
              </>
            )}
          </motion.div>

          {/* Ubicación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-4">
              <i className="fas fa-map-marker-alt text-[#d4af37] mr-2"></i>
              Ubicación
            </h3>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${property.mapsQuery}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full py-5 bg-gray-50 hover:bg-[#d4af37]/10 border border-gray-200 hover:border-[#d4af37] rounded-xl transition-all duration-300 text-gray-700 hover:text-[#d4af37] font-semibold text-sm"
            >
              <i className="fas fa-map-marked-alt text-[#d4af37] text-xl"></i>
              Ver en Google Maps
            </a>
          </motion.div>

        </div>
      </div>
      {/* Lightbox zoom */}
{zoomed && (
  <div
    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
    onClick={() => setZoomed(false)}
  >
    {/* Flechas */}
    {images.length > 1 && (
      <>
        <button
          onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg - 1 + images.length) % images.length) }}
          className="absolute left-4 text-white text-3xl bg-black/40 hover:bg-[#d4af37] w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer border-0"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg + 1) % images.length) }}
          className="absolute right-4 text-white text-3xl bg-black/40 hover:bg-[#d4af37] w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer border-0"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </>
    )}
    {/* Imagen ampliada */}
    <img
      src={images[activeImg] || property.image}
      alt={property.title}
      className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
    {/* Cerrar */}
    <button
      onClick={() => setZoomed(false)}
      className="absolute top-4 right-4 text-white bg-black/40 hover:bg-[#d4af37] w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border-0"
    >
      <i className="fas fa-times"></i>
    </button>
    {/* Contador */}
    {images.length > 1 && (
      <span className="absolute bottom-4 text-white/60 text-sm">{activeImg + 1} / {images.length}</span>
    )}
  </div>
)}
    </motion.div>
  )
}
