import { motion } from 'framer-motion'

export default function PropertyCard({ property, index, onVerDetalle }) {
  const { title, image, dormitorios, banos, m2, precio, ubicacion, barrio, descripcion } = property

  const esAlquiler = property.tipo === 'alquiler'
  const simbolo = esAlquiler ? '$' : 'U$S'
  const locale = esAlquiler ? 'es-AR' : 'en-US'
  const formatted = new Intl.NumberFormat(locale).format(precio)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col group"
    >
      <div className="overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-black/75 text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          {property.tipo}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-2">
        <h3 className="font-heading font-bold text-gray-900 text-base leading-snug">{title}</h3>
        {descripcion && <p className="text-gray-500 text-xs">{descripcion}</p>}
        <p className="text-gray-500 text-sm">
          {dormitorios} dorm. · {banos} baño{banos > 1 ? 's' : ''} · {m2} m²
        </p>

        {property.garaje && (
          <p className="text-[#d4af37] text-sm flex items-center gap-1">
            {property.garaje === 'moto' && <><i className="fas fa-motorcycle"></i> Garaje para moto</>}
            {property.garaje === 'auto' && <><i className="fas fa-car"></i> Garaje para auto</>}
            {property.garaje === 'auto y moto' && <><i className="fas fa-car"></i> Garaje para auto y moto</>}
          </p>
        )}

        <p className="text-[#d4af37] font-heading font-bold text-xl">
          {simbolo} {formatted}
        </p>

        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <i className="fas fa-map-marker-alt text-[#d4af37]"></i>
          <span>{ubicacion}</span>
          <span className="mx-1">·</span>
          <span>{barrio}</span>
        </div>

        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
          <div className="flex gap-3 text-gray-500 text-sm flex-1">
            <span className="flex items-center gap-1">
              <i className="fas fa-bed text-[#d4af37]"></i>{dormitorios}
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-bath text-[#d4af37]"></i>{banos}
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-ruler-combined text-[#d4af37]"></i>{m2}m²
            </span>
          </div>
          <motion.button
            onClick={() => onVerDetalle(property)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-[#d4af37] transition-colors duration-300 cursor-pointer border-0"
          >
            Ver detalles
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}