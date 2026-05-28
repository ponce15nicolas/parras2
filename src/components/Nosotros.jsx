import { CONTACT_INFO } from '../data/config'

export default function Nosotros() {
  const textos = [
    "Somos una inmobiliaria comprometida con brindarte la mejor experiencia en la compra, venta y alquiler de propiedades. Nuestro trabajo se basa en la confianza, la transparencia y el trato personalizado, acompañándote en cada etapa del proceso con dedicación y profesionalismo.",
    "Con años de experiencia en el mercado inmobiliario, ofrecemos un servicio cercano y profesional. Creemos que encontrar el hogar ideal es mucho más que una transacción: es un momento importante en tu vida, y estamos aquí para hacerlo más simple.",
    "Nuestra misión es conectar personas con propiedades que se adapten a sus necesidades y posibilidades. Trabajamos con honestidad, compromiso y vocación de servicio para que cada operación sea una experiencia positiva y segura.",
  ]

  const texto = textos[Math.floor(Math.random() * textos.length)]

  const agentes = [
    {
      nombre: 'Valentina Azul Parras',
      rol: 'Corredora Inmobiliaria',
      mat: 'Mat. 0000',
      tel: CONTACT_INFO.phoneFormatted,
      telHref: `tel:${CONTACT_INFO.phoneRaw}`,
      email: CONTACT_INFO.email,
      foto: '/pefilparras.jpg',
    },
    // Para agregar otro agente, copiá el objeto de arriba y pegalo acá
  ]

  return (
    <section id="nosotros" className="bg-black py-20 px-6">

      {/* Encabezado */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-10 bg-[#d4af37]" />
          <p className="text-[#d4af37] text-[11px] font-semibold tracking-[0.2em] uppercase">Quiénes somos</p>
          <div className="h-px w-10 bg-[#d4af37]" />
        </div>
        <h2 className="font-heading font-bold text-white text-5xl mb-4">Nosotros</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">{texto}</p>
      </div>

      {/* Cards agentes */}
      <div className="flex flex-wrap justify-center gap-5 max-w-5xl mx-auto mb-12">
        {agentes.map((a) => (
          <div key={a.nombre} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-7 text-center w-full max-w-[240px]">

            {/* Foto */}
            <div className="w-24 h-24 rounded-full border-[3px] border-[#d4af37] overflow-hidden mx-auto mb-4 bg-[#222] flex items-center justify-center">
              <img
                src={a.foto}
                alt={a.nombre}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
              <span style={{ display: 'none' }} className="w-full h-full items-center justify-center text-[#d4af37] text-4xl">
                <i className="fas fa-user"></i>
              </span>
            </div>

            <p className="text-white font-heading font-bold text-base mb-1">{a.nombre}</p>
            <p className="text-[#d4af37] text-[10px] font-semibold tracking-widest uppercase mb-1">{a.rol}</p>
            <p className="text-gray-600 text-[10px] mb-4">{a.mat}</p>
            <div className="h-px w-8 bg-[#d4af37] mx-auto mb-4" />

            <a href={a.telHref}
              className="flex items-center justify-center gap-2 bg-[#d4af37] text-black text-xs font-bold py-2 px-3 rounded-lg mb-2 hover:bg-white transition-colors">
              <i className="fas fa-phone text-xs"></i>
              {a.tel}
            </a>
            <a href={`mailto:${a.email}`}
              className="flex items-center justify-center gap-2 border border-[#2a2a2a] text-gray-400 text-xs py-2 px-3 rounded-lg hover:border-[#d4af37] hover:text-[#d4af37] transition-colors">
              <i className="fas fa-envelope text-[#d4af37] text-xs"></i>
              {a.email}
            </a>

          </div>
        ))}
      </div>

      {/* Footer de sección */}
      <div className="border-t border-[#222] pt-6 flex items-center justify-center gap-4 flex-wrap">
        <div className="w-11 h-11 rounded-full border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37]">
          <i className="fas fa-users text-base"></i>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Nuestro equipo está listo para ayudarte a encontrar la propiedad ideal.</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="h-px w-6 bg-[#d4af37]" />
            <p className="text-[#d4af37] text-sm font-bold">¡Estamos para asesorarte!</p>
            <div className="h-px w-6 bg-[#d4af37]" />
          </div>
        </div>
      </div>

    </section>
  )
}