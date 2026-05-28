import { useState, useMemo, useEffect } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import Catalog from './components/Catalog'
import Nosotros from './components/Nosotros'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import PropertyModal from './components/PropertyModal'
import ModalVender from './components/ModalVender'
import { properties as allProperties } from './data/Properties'
import { CONTACT_INFO } from './data/config'

export default function App() {
  const [filters, setFilters] = useState(null)
  const [tipoFilter, setTipoFilter] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showContact, setShowContact] = useState(false)
  const [showVender, setShowVender] = useState(false)
  
  // Formulario de contacto
  const [contactForm, setContactForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)

  // Scroll al tope cuando se abre el detalle
  useEffect(() => {
    if (selectedProperty) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedProperty])

  const filtered = useMemo(() => {
    let result = [...allProperties]

    if (tipoFilter) {
      result = result.filter((p) => p.tipo === tipoFilter)
    }

    if (filters) {
      const { dormitorios, banos, precioMin, precioMax, m2Min, m2Max, ubicacion, barrio, orden } = filters

      result = result.filter((p) => {
        if (dormitorios && p.dormitorios < parseInt(dormitorios)) return false
        if (banos && p.banos < parseInt(banos)) return false
        if (precioMin && p.precio < parseInt(precioMin)) return false
        if (precioMax && p.precio > parseInt(precioMax)) return false
        if (m2Min && p.m2 < parseInt(m2Min)) return false
        if (m2Max && p.m2 > parseInt(m2Max)) return false
        if (ubicacion && !p.ubicacionKey.includes(ubicacion.toLowerCase())) return false
        if (barrio && !p.barrioKey.includes(barrio.toLowerCase())) return false
        return true
      })

      if (orden === 'menor') result.sort((a, b) => a.precio - b.precio)
      if (orden === 'mayor') result.sort((a, b) => b.precio - a.precio)
      if (orden === 'recientes') result.sort((a, b) => b.id - a.id)
    }

    return result
  }, [filters, tipoFilter])

  const handleContactSubmit = (e) => {
    e.preventDefault()
    if (!contactForm.nombre || !contactForm.email) return
    const texto = `Hola! Mi nombre es ${contactForm.nombre}.%0AEmail: ${contactForm.email}%0AMensaje: ${contactForm.mensaje}`
    window.open(`https://wa.me/${CONTACT_INFO.phoneRaw}?text=${texto}`, '_blank')
    setContactSubmitted(true)
    setTimeout(() => {
      setContactSubmitted(false)
      setShowContact(false)
      setContactForm({ nombre: '', email: '', mensaje: '' })
    }, 2000)
  }

  // Vista de detalle: página completa con navbar y footer
  if (selectedProperty) {
    return (
      <>
        <Navbar 
          onFilter={(tipo) => { setTipoFilter(tipo); setFilters(null) }} 
          onContact={() => setShowContact(true)}
          onNosotros={() => { setSelectedProperty(null); setTimeout(() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' }), 300) }}
            />
        <div className="pt-[70px] min-h-screen bg-white">
          <PropertyModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        </div>
        <Footer />
        <WhatsAppButton />
      </>
    )
  }

  // Vista principal
  return (
    <>
      <Navbar
        onFilter={(tipo) => { setTipoFilter(tipo); setFilters(null) }}
        onContact={() => setShowContact(true)}
         onVender={() => setShowVender(true)}
         onNosotros={() => setTimeout(() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' }), 100)}
      />
      {showVender && <ModalVender onClose={() => setShowVender(false)} />}
      <Banner onSearch={setFilters} />
      <Catalog properties={filtered} onVerDetalle={setSelectedProperty} />
      <Nosotros/>
      <Footer />
      <WhatsAppButton />
      {showContact && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-[90%] max-w-md relative shadow-2xl">

      {/* BOTÓN CERRAR */}
      <button
        onClick={() => setShowContact(false)}
        className="absolute top-2 right-3 text-xl bg-transparent border-0 cursor-pointer text-gray-400 hover:text-black transition-colors"
      >
        ✕
      </button>

      {/* TÍTULO */}
      <h2 className="text-xl font-bold mb-4 font-heading text-gray-900">Contacto</h2>

      {/* FORMULARIO */}
      {contactSubmitted ? (
        <div className="text-center py-6">
          <i className="fas fa-check-circle text-4xl text-green-500 mb-3 block"></i>
          <p className="font-heading font-bold text-gray-800 text-lg">¡Mensaje enviado!</p>
          <p className="text-gray-400 text-sm mt-1">Abriendo WhatsApp...</p>
        </div>
      ) : (
        <form onSubmit={handleContactSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Nombre"
            value={contactForm.nombre}
            onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
            className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={contactForm.email}
            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
            className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
          />
          <textarea
            placeholder="Mensaje"
            rows={3}
            value={contactForm.mensaje}
            onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })}
            className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 resize-none"
          ></textarea>

          <button
            type="submit"
            className="bg-black hover:bg-[#d4af37] text-white py-2.5 rounded-lg font-heading font-bold text-sm transition-colors cursor-pointer border-0"
          >
            Enviar por WhatsApp
          </button>
        </form>
      )}

    </div>
  </div>
)}
    </>
  )
}
