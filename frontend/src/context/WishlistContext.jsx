import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WishlistContext = createContext(null)

const STORAGE_KEY = 'ghar_sajaoo_wishlist'

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product) => {
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev
      return [...prev, product]
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const toggleItem = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.filter(i => i.id !== product.id)
      return [...prev, product]
    })
  }, [])

  const isWishlisted = useCallback((id) => {
    return items.some(i => i.id === id)
  }, [items])

  const clearWishlist = useCallback(() => setItems([]), [])

  return (
    <WishlistContext.Provider value={{
      items,
      totalItems: items.length,
      addItem,
      removeItem,
      toggleItem,
      isWishlisted,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}
