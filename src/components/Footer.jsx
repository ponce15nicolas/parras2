import { motion } from 'framer-motion'

export default function Footer({ onAdmin }) {
  return (
    <footer className="bg-black border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row gap-10 justify-between flex-wrap"
      >
        <div className="flex flex-col items-start gap-3">
          <img src="/logonavbar.png" alt="Logo" className="w-48 md:w-60 h-auto" />
          <p className="text-white/40 text-xs max-w-xs">
            Encontrá la propiedad ideal en Resistencia, Chaco y zona.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white font-heading font-bold text-sm tracking-widest uppercase mb-1">Enlaces</h4>
          {[
            { icon: 'fa-home', label: 'Inicio' },
            { icon: 'fa-building', label: 'Propiedades' },
            { icon: 'fa-briefcase', label: 'Servicios' },
            { icon: 'fa-envelope', label: 'Contacto' },
          ].map(({ icon, label }) => (
            <a key={label} href="#" className="text-white/60 text-sm flex items-center gap-2 hover:text-[#d4af37] transition-all duration-200 hover:translate-x-1">
              <i className={`fas ${icon} text-[#d4af37] w-4`}></i>{label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white font-heading font-bold text-sm tracking-widest uppercase mb-1">Contacto</h4>
          <p className="text-white/60 text-sm flex items-center gap-2">
            <i className="fas fa-map-marker-alt text-[#d4af37] w-4"></i>Resistencia, Chaco
          </p>
          <p className="text-white/60 text-sm flex items-center gap-2">
            <i className="fas fa-phone text-[#d4af37] w-4"></i>+54 9 3974 655615
          </p>
          <a href="mailto:azulparrastr@gmail.com" className="text-white/60 text-sm flex items-center gap-2 hover:text-[#d4af37] transition-all duration-200 hover:translate-x-1">
            <i className="fas fa-envelope text-[#d4af37] w-4"></i>Enviar email
          </a>
          <a href="https://www.instagram.com/valeparras_/" target="_blank" rel="noreferrer" className="text-white/60 text-sm flex items-center gap-2 hover:text-[#d4af37] transition-all duration-200 hover:translate-x-1">
            <i className="fab fa-instagram text-[#d4af37] w-4"></i>Instagram
          </a>
        </div>
      </motion.div>

      <div className="border-t border-white/5 px-6 py-4 text-center flex flex-col gap-1">
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Valentina Parras Inmobiliaria. Todos los derechos reservados | <a href="https://frannkode.vercel.app/">Desarollado por KodeFra</a>
        </p>
        <button onClick={onAdmin} className="text-white/10 hover:text-white/30 text-[10px] bg-transparent border-0 cursor-pointer transition-colors">
          admin
        </button>
      </div>
    </footer>
  )
}