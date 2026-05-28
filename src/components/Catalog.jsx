import { motion, AnimatePresence } from 'framer-motion'
import PropertyCard from './PropertyCard'

export default function Catalog({ properties, onVerDetalle }) {
  return (
    <section id="catalogo" className="py-20 px-6 md:px-10 bg-[#f5f5f5]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900">
          PROPIEDADES <span className="text-[#d4af37]">DISPONIBLES</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {properties.length} propiedad{properties.length !== 1 ? 'es' : ''} encontrada{properties.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {properties.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-16 text-center text-gray-400"
          >
            <i className="fas fa-search text-5xl mb-4 block text-[#d4af37]/40"></i>
            <p className="font-heading font-semibold text-lg">No se encontraron propiedades</p>
            <p className="text-sm mt-1">Probá con otros filtros de búsqueda</p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10"
          >
            {properties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} onVerDetalle={onVerDetalle} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}