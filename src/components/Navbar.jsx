import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = ['INICIO', 'ALQUILERES', 'VENTAS', 'LOTES', 'NOSOTROS', 'VENDER/ALQUILAR']

export default function Navbar({ onFilter, onVender, onNosotros }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('INICIO')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (link) => {
    setActive(link)
    setMenuOpen(false)
    if (link === 'VENTAS') {
      onFilter('venta')
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    } else if (link === 'ALQUILERES') {
      onFilter('alquiler')
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    } else if (link === 'LOTES') {
      onFilter('lote')
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    } else if (link === 'NOSOTROS') {
      onNosotros?.()
      document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })
    } else if (link === 'VENDER/ALQUILAR') {
      onVender?.()
    } else if (link === 'INICIO') {
      onFilter(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/60 backdrop-blur-md border-b border-white/10'
            : 'bg-black'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-[70px]">
          <div className="flex items-center">
            <img src="/logonavbar.png" alt="Logo" className="h-10 w-auto" />
          </div>

          <ul className="hidden md:flex items-center gap-5 list-none">
            {navLinks.map((link) => (
              <li key={link}>
                <button
                  onClick={() => handleLinkClick(link)}
                  className={`text-[#d4af37] text-xs font-semibold tracking-wide transition-all duration-200 hover:text-white hover:-translate-y-0.5 bg-transparent border-0 cursor-pointer ${
                    active === link ? 'border-b-2 border-[#d4af37] pb-1' : ''
                  }`}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="md:hidden text-[#d4af37] text-xl bg-transparent border-0 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </motion.nav>

      {/* Menú mobile separado del navbar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[70px] left-0 w-full z-40 list-none flex flex-col items-center gap-4 py-6 overflow-hidden md:hidden backdrop-blur-md border-b border-white/10"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            {navLinks.map((link, i) => (
              <motion.li
                key={link}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => handleLinkClick(link)}
                  className={`text-[#d4af37] text-xs font-semibold tracking-wide transition-all duration-200 hover:text-white hover:-translate-y-0.5 bg-transparent border-0 cursor-pointer ${
                    active === link ? 'border-b-2 border-[#d4af37] pb-1' : ''
                  }`}
                >
                  {link}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  )
}