'use client'
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react'
import { motion } from 'framer-motion'


const PageTransition = ({ children }) => {
  const { pathname } = { pathname: usePathname() || "", search: useSearchParams()?.toString() || "" }
  
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
