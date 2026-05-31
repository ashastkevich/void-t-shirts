'use client'

import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/products'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { Header } from '@/components/layout/Header'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterModal } from '@/components/auth/RegisterModal'
import { HeroCarousel } from '@/components/product/HeroCarousel'
import { ProductDetailModal } from '@/components/product/ProductDetailModal'
import { Lightbox } from '@/components/product/ProductGallery'
import { AnimatePresence } from 'motion/react'

export default function App({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState('M')
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const { addItem } = useCartStore()
  const current = products[currentIndex]

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => setUser(data.user))
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null)
      })
      return () => subscription.unsubscribe()
    } catch {
      // Supabase not configured — auth disabled
    }
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
    } catch {
      setUser(null)
    }
  }

  const handleAddToCart = (qty: number) => {
    addItem({ id: current.id, name: current.name, size: selectedSize, price: current.price, image: current.image, quantity: qty })
    setShowModal(false)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (showLightbox) setShowLightbox(false)
      else if (showModal) setShowModal(false)
      else if (showCart) setShowCart(false)
      else if (showLogin) setShowLogin(false)
      else if (showRegister) setShowRegister(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showLightbox, showModal, showCart, showLogin, showRegister])

  const handleCheckout = () => {
    if (!user) {
      setShowCart(false)
      setShowLogin(true)
    }
    // When user is logged in: createOrder() will be wired here in Phase 9
  }

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative">
      <AnimatedBackground />

      <Header
        currentIndex={currentIndex}
        total={products.length}
        onGoToSlide={setCurrentIndex}
        onCartOpen={() => setShowCart(true)}
        onLoginOpen={() => setShowLogin(true)}
        onRegisterOpen={() => setShowRegister(true)}
        user={user?.email ?? null}
        onLogout={handleLogout}
        onLogoClick={() => setCurrentIndex(0)}
      />

      <div className="absolute left-0 right-0 top-20 md:top-0 bottom-0">
        <HeroCarousel
          products={products}
          currentIndex={currentIndex}
          onSlideChange={setCurrentIndex}
          onViewDetails={() => setShowModal(true)}
          onImageClick={() => setShowLightbox(true)}
        />
      </div>

      <AnimatePresence>
        {showLightbox && (
          <Lightbox
            images={current.images}
            name={current.name}
            startIndex={0}
            onClose={() => setShowLightbox(false)}
          />
        )}
      </AnimatePresence>

      <ProductDetailModal
        show={showModal}
        onClose={() => setShowModal(false)}
        product={current}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        show={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />

      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true) }}
      />

      <RegisterModal
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true) }}
      />
    </div>
  )
}
