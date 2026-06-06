import { useState, useMemo, useEffect } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import Catalog from './components/Catalog'
import Nosotros from './components/Nosotros'
import Footer from './components/Footer'
import WhatsAppButton from './components/Whatsappbutton'
import PropertyModal from './components/PropertyModal'
import ModalVender from './components/Modalvender'
import { properties as allProperties } from './data/Properties'


export default function App() {
  const [filters, setFilters] = useState(null)
  const [tipoFilter, setTipoFilter] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showContact, setShowContact] = useState(false)
  const [showVender, setShowVender] = useState(false)

  // Scroll al tope cuando se abre el detalle
  useEffect(() => {
    if (selectedProperty) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedProperty])

  // Historial para el botón atrás del navegador
  useEffect(() => {
    if (selectedProperty) {
      window.history.pushState({ modal: true }, '')
    }
  }, [selectedProperty])

  useEffect(() => {
    const handlePopState = () => {
      setSelectedProperty(null)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

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
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md relative">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-2 right-3 text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Contacto</h2>
            <form className="flex flex-col gap-3">
              <input type="text" placeholder="Nombre" className="border p-2 rounded" />
              <input type="email" placeholder="Email" className="border p-2 rounded" />
              <textarea placeholder="Mensaje" className="border p-2 rounded"></textarea>
              <button type="submit" className="bg-black text-white py-2 rounded">Enviar</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}