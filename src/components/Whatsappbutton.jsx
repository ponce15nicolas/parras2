import { motion } from 'framer-motion'

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/5493794655615?text=Hola!%20Quiero%20más%20información%20sobre%20una%20propiedad"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src="/whatsapp.png" alt="WhatsApp" className="w-14 h-14 drop-shadow-xl" />
    </motion.a>
  )
}