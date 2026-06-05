import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TIPOS = ['Casa', 'Departamento', 'Lote', 'Local comercial', 'Oficina', 'Otro']

export default function ModalVender({ onClose }) {
  const [form, setForm] = useState({
    nombre: '', telefono: '', email: '',
    tipo: '', operacion: '', descripcion: ''
  })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleWhatsApp = () => {
    if (!form.nombre || !form.telefono || !form.operacion) return
    const texto = `Hola! Quiero *${form.operacion}* mi propiedad.%0ANombre: ${form.nombre}%0ATel: ${form.telefono}%0AEmail: ${form.email}%0ATipo: ${form.tipo}%0ADescripción: ${form.descripcion}`
    window.open(`https://wa.me/5493794655615?text=${texto}`, '_blank')
    setEnviado(true)
  }

  const handleEmail = () => {
    if (!form.nombre || !form.telefono || !form.operacion) return
    const asunto = `Consulta para ${form.operacion} propiedad - ${form.nombre}`
    const cuerpo = `Nombre: ${form.nombre}%0ATel: ${form.telefono}%0AEmail: ${form.email}%0ATipo: ${form.tipo}%0AOperación: ${form.operacion}%0ADescripción: ${form.descripcion}`
    window.open(`mailto:azulparrastr@gmail.com?subject=${asunto}&body=${cuerpo}`, '_blank')
    setEnviado(true)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl w-full max-w-md p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cerrar */}
          <button onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors bg-transparent border-0 cursor-pointer text-lg">
            <i className="fas fa-times"></i>
          </button>

          {enviado ? (
            <div className="text-center py-8">
              <i className="fas fa-check-circle text-5xl text-green-500 mb-4 block"></i>
              <p className="font-heading font-bold text-gray-900 text-xl">¡Consulta enviada!</p>
              <p className="text-gray-400 text-sm mt-2">Nos pondremos en contacto a la brevedad.</p>
              <button onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-[#d4af37] text-white font-bold rounded-lg text-sm border-0 cursor-pointer hover:bg-black transition-colors">
                Cerrar
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <span className="inline-block bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                  Gestión de propiedades
                </span>
                <h2 className="font-heading font-bold text-2xl text-gray-900">Vender o Alquilar</h2>
                <p className="text-gray-400 text-sm mt-1">Completá el formulario y te contactamos a la brevedad.</p>
              </div>

              {/* Operación */}
              <div className="flex gap-3 mb-4">
                {['Vender', 'Alquilar'].map((op) => (
                  <button key={op}
                    onClick={() => setForm({ ...form, operacion: op })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 cursor-pointer transition-all duration-200 ${
                      form.operacion === op
                        ? 'bg-[#d4af37] border-[#d4af37] text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#d4af37]'
                    }`}>
                    {op}
                  </button>
                ))}
              </div>

              {/* Campos */}
              <div className="flex flex-col gap-3 mb-4">
                {[
                  { name: 'nombre', placeholder: 'Nombre y apellido', type: 'text' },
                  { name: 'telefono', placeholder: 'Teléfono / WhatsApp', type: 'tel' },
                  { name: 'email', placeholder: 'Email (opcional)', type: 'email' },
                ].map(({ name, placeholder, type }) => (
                  <input key={name} type={type} name={name} value={form[name]}
                    onChange={handleChange} placeholder={placeholder}
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40" />
                ))}

                {/* Tipo de propiedad */}
                <select name="tipo" value={form.tipo} onChange={handleChange}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 bg-white">
                  <option value="">Tipo de propiedad</option>
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>

                <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                  placeholder="Descripción de la propiedad (opcional)" rows={3}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 resize-none" />
              </div>

              {/* Botones envío */}
              <div className="flex flex-col gap-2">
                <button onClick={handleWhatsApp}
                  className="py-3 bg-[#d4af37] text-white font-heading font-bold rounded-lg text-sm border-0 cursor-pointer hover:bg-black transition-colors duration-300">
                  <i className="fab fa-whatsapp mr-2 text-base"></i>Enviar por WhatsApp
                </button>
                <button onClick={handleEmail}
                  className="py-3 bg-white text-gray-700 font-heading font-bold rounded-lg text-sm border border-gray-200 cursor-pointer hover:border-[#d4af37] hover:text-[#d4af37] transition-colors duration-300">
                  <i className="fas fa-envelope mr-2 text-[#d4af37]"></i>Enviar por Email
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}