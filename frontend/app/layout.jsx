import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/src/context/AuthContext'
import { CartProvider } from '@/src/context/CartContext'
import { WishlistProvider } from '@/src/context/WishlistContext'
import Navbar from '@/src/components/Navbar'
import Footer from '@/src/components/Footer'
import CartDrawer from '@/src/components/CartDrawer'
import Providers from './providers'

export const metadata = {
  title: 'Ghar Sajaoo | Modern Elegance, Indian Soul',
  description: 'Premium home décor — wall art, vases, lighting and canvas art handcrafted by Indian artisans. Free shipping above ₹999.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
