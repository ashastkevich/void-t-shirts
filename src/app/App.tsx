import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ShoppingCart, User, UserPlus } from "lucide-react";

const products = [
  {
    id: 1,
    name: "ULTRA BLACK",
    series: "SIGNATURE",
    price: "12,900 ₽",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "100% органический хлопок • 220 г/м²",
  },
  {
    id: 2,
    name: "VOID ESSENTIAL",
    series: "CORE",
    price: "11,500 ₽",
    image: "https://images.unsplash.com/photo-1562135291-7728cc647783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Премиум хлопок • 200 г/м²",
  },
  {
    id: 3,
    name: "MINIMAL BLACK",
    series: "CLASSIC",
    price: "10,900 ₽",
    image: "https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Качественный хлопок • 180 г/м²",
  },
  {
    id: 4,
    name: "DARK MATTER",
    series: "LIMITED",
    price: "13,500 ₽",
    image: "https://images.unsplash.com/photo-1759572095317-3a96f9a98e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Премиум материал • 240 г/м²",
  },
  {
    id: 5,
    name: "SHADOW FORM",
    series: "PREMIUM",
    price: "12,200 ₽",
    image: "https://images.unsplash.com/photo-1759572095384-1a7e646d0d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Органический хлопок • 210 г/м²",
  },
  {
    id: 6,
    name: "OBSIDIAN CORE",
    series: "EXCLUSIVE",
    price: "14,900 ₽",
    image: "https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "100% премиум хлопок • 260 г/м²",
  },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [cart, setCart] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{id: number, name: string, size: string, price: string, image: string}>>([]);

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoplay]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setIsAutoplay(false);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setIsAutoplay(false);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoplay(false);
  };

  const handleViewDetails = () => {
    setShowModal(true);
    setIsAutoplay(false);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    setIsAutoplay(false);
  };

  const handleAddToCart = () => {
    setCartItems([...cartItems, {
      id: current.id,
      name: current.name,
      size: selectedSize,
      price: current.price,
      image: current.image
    }]);
    setCart(cart + 1);
    setShowModal(false);
  };

  const current = products[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -45 : 45,
    }),
  };

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-full w-full"
          style={{
            backgroundImage: 'linear-gradient(#00d9ff 1px, transparent 1px), linear-gradient(90deg, #00d9ff 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-8 flex items-center justify-between"
      >
        <motion.h1
          className="text-4xl tracking-tighter font-bold cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-white">VOID</span>
          <span className="text-[#00d9ff]">.</span>
        </motion.h1>

        <div className="flex items-center gap-2">
          {[...Array(products.length)].map((_, index) => (
            <motion.div
              key={index}
              onClick={() => goToSlide(index)}
              className={`cursor-pointer transition-all ${
                index === currentIndex ? "w-12 bg-[#00d9ff]" : "w-2 bg-[#262626] hover:bg-[#404040]"
              } h-2`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        <div className="flex items-center gap-6">
          {/* Cart */}
          <motion.button
            onClick={() => setShowCart(true)}
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-6 h-6 group-hover:text-[#00d9ff] transition-colors" />
            {cart > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-[#00d9ff] text-black text-xs w-5 h-5 flex items-center justify-center font-bold"
              >
                {cart}
              </motion.span>
            )}
          </motion.button>

          {/* Login */}
          <motion.button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 border border-[#262626] px-4 py-2 hover:border-[#00d9ff] hover:text-[#00d9ff] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-4 h-4" />
            <span className="text-xs tracking-widest hidden md:inline">LOGIN</span>
          </motion.button>

          {/* Register */}
          <motion.button
            onClick={() => setShowRegister(true)}
            className="flex items-center gap-2 bg-[#00d9ff] text-black px-4 py-2 hover:bg-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-xs tracking-widest hidden md:inline">REGISTER</span>
          </motion.button>

          {/* Counter */}
          <motion.div
            className="text-sm tracking-widest hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-[#737373]">0{currentIndex + 1}</span>
            <span className="text-[#262626] mx-2">/</span>
            <span className="text-[#737373]">0{products.length}</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center px-4 md:px-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              rotateY: { duration: 0.6 },
            }}
            className="absolute grid md:grid-cols-2 gap-8 md:gap-16 items-center px-4 md:px-12 lg:px-20 max-w-[1400px] w-full"
            style={{ perspective: "1000px" }}
          >
            {/* Product Image */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                {/* Glowing effect - только при наведении */}
                {isImageHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 blur-3xl bg-[#00d9ff]"
                  />
                )}

                <div className="relative w-full h-[600px] border-2 border-[#00d9ff] overflow-hidden bg-black">
                  <img
                    src={current.image}
                    alt={current.name}
                    className={`w-full h-full object-contain transition-all duration-500 ${
                      isImageHovered ? "" : "grayscale"
                    }`}
                  />
                </div>

                {/* Corner decorations */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-[#00d9ff]"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-[#00d9ff]"
                />
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.div
                  className="inline-block border-2 border-[#00d9ff] px-6 py-2 mb-6"
                  whileHover={{ scale: 1.05, backgroundColor: "#00d9ff", color: "#000" }}
                >
                  <span className="text-xs tracking-widest">{current.series}</span>
                </motion.div>

                <motion.h2
                  className="text-7xl md:text-8xl tracking-tighter leading-none mb-6"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {current.name.split(" ").map((word, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    >
                      {i === 1 ? <span className="text-[#00d9ff]">{word}</span> : word}
                    </motion.div>
                  ))}
                </motion.h2>

                <motion.p
                  className="text-xl text-[#737373] mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {current.description}
                </motion.p>

                <motion.div
                  className="flex items-center gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-5xl tracking-tighter text-[#00d9ff]">
                    {current.price}
                  </div>

                  <motion.button
                    onClick={handleViewDetails}
                    className="bg-[#00d9ff] text-black px-10 py-4 tracking-widest text-sm hover:bg-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    VIEW DETAILS
                  </motion.button>
                </motion.div>

                {/* Size indicators */}
                <motion.div
                  className="flex items-center gap-4 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-xs text-[#737373] tracking-widest">SIZES:</span>
                  {["XS", "S", "M", "L", "XL"].map((size, i) => (
                    <motion.div
                      key={size}
                      onClick={() => handleSizeClick(size)}
                      className={`w-10 h-10 border flex items-center justify-center text-xs cursor-pointer transition-all ${
                        selectedSize === size
                          ? "border-[#00d9ff] bg-[#00d9ff] text-black"
                          : "border-[#262626] hover:border-[#00d9ff] hover:text-[#00d9ff]"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.05 }}
                    >
                      {size}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        onClick={prevSlide}
        className="hidden lg:flex fixed left-2 xl:left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 xl:w-14 xl:h-14 border-2 border-[#262626] hover:border-[#00d9ff] items-center justify-center group transition-all bg-black/90 backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-5 h-5 xl:w-6 xl:h-6 group-hover:text-[#00d9ff] transition-colors" />
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        onClick={nextSlide}
        className="hidden lg:flex fixed right-2 xl:right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 xl:w-14 xl:h-14 border-2 border-[#262626] hover:border-[#00d9ff] items-center justify-center group transition-all bg-black/90 backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-5 h-5 xl:w-6 xl:h-6 group-hover:text-[#00d9ff] transition-colors" />
      </motion.button>

      {/* Product Navigation Sidebar */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="fixed right-8 bottom-8 z-50 space-y-4"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            onClick={() => goToSlide(index)}
            className={`cursor-pointer border-l-4 pl-4 transition-all ${
              index === currentIndex
                ? "border-[#00d9ff] opacity-100"
                : "border-[#262626] opacity-40 hover:opacity-70 hover:border-[#404040]"
            }`}
            whileHover={{ x: -5 }}
          >
            <div className="text-2xl tracking-tighter">0{index + 1}</div>
            <div className="text-xs text-[#737373] tracking-wide">{product.series}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating elements */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed top-1/4 right-1/4 w-3 h-3 bg-[#00d9ff] blur-sm"
      />
      <motion.div
        animate={{
          y: [0, -30, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="fixed bottom-1/3 left-1/4 w-3 h-3 bg-[#00d9ff] blur-sm"
      />
      <motion.div
        animate={{
          x: [0, 15, 0],
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="fixed top-1/2 left-1/3 w-2 h-2 bg-[#00d9ff] blur-sm"
      />
      <motion.div
        animate={{
          x: [0, -10, 0],
          y: [0, 25, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="fixed bottom-1/4 right-1/3 w-2 h-2 bg-[#00d9ff] blur-sm"
      />

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogin(false)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black border-2 border-[#00d9ff] max-w-md w-full p-8 relative"
            >
              <motion.button
                onClick={() => setShowLogin(false)}
                className="absolute -top-4 -right-4 w-12 h-12 bg-[#00d9ff] text-black flex items-center justify-center hover:bg-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">×</span>
              </motion.button>

              <h2 className="text-4xl tracking-tighter mb-2">
                LOG<span className="text-[#00d9ff]">IN</span>
              </h2>
              <p className="text-sm text-[#737373] mb-8">Войдите в свой аккаунт</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">EMAIL</label>
                  <input
                    type="email"
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">PASSWORD</label>
                  <input
                    type="password"
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-[#737373]">Запомнить меня</span>
                  </label>
                  <button className="text-[#00d9ff] hover:text-white transition-colors">
                    Забыли пароль?
                  </button>
                </div>

                <motion.button
                  className="w-full bg-[#00d9ff] text-black py-4 tracking-widest text-sm hover:bg-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ВОЙТИ
                </motion.button>

                <p className="text-center text-sm text-[#737373]">
                  Нет аккаунта?{" "}
                  <button
                    onClick={() => {
                      setShowLogin(false);
                      setShowRegister(true);
                    }}
                    className="text-[#00d9ff] hover:text-white transition-colors"
                  >
                    Зарегистрироваться
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {showRegister && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRegister(false)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black border-2 border-[#00d9ff] max-w-md w-full p-8 relative"
            >
              <motion.button
                onClick={() => setShowRegister(false)}
                className="absolute -top-4 -right-4 w-12 h-12 bg-[#00d9ff] text-black flex items-center justify-center hover:bg-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">×</span>
              </motion.button>

              <h2 className="text-4xl tracking-tighter mb-2">
                REGIS<span className="text-[#00d9ff]">TER</span>
              </h2>
              <p className="text-sm text-[#737373] mb-8">Создайте новый аккаунт</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">ИМЯ</label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">EMAIL</label>
                  <input
                    type="email"
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">PASSWORD</label>
                  <input
                    type="password"
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-[#737373] mb-2">CONFIRM PASSWORD</label>
                  <input
                    type="password"
                    className="w-full bg-transparent border-2 border-[#262626] px-4 py-3 focus:border-[#00d9ff] outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-[#737373]">Я согласен с условиями использования</span>
                </label>

                <motion.button
                  className="w-full bg-[#00d9ff] text-black py-4 tracking-widest text-sm hover:bg-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ЗАРЕГИСТРИРОВАТЬСЯ
                </motion.button>

                <p className="text-center text-sm text-[#737373]">
                  Уже есть аккаунт?{" "}
                  <button
                    onClick={() => {
                      setShowRegister(false);
                      setShowLogin(true);
                    }}
                    className="text-[#00d9ff] hover:text-white transition-colors"
                  >
                    Войти
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-end p-8"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black border-l-2 border-[#00d9ff] w-full max-w-lg h-full p-8 relative overflow-y-auto"
            >
              <motion.button
                onClick={() => setShowCart(false)}
                className="absolute top-4 right-4 w-12 h-12 border-2 border-[#262626] hover:border-[#00d9ff] flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">×</span>
              </motion.button>

              <h2 className="text-4xl tracking-tighter mb-2">
                КОРЗ<span className="text-[#00d9ff]">ИНА</span>
              </h2>
              <p className="text-sm text-[#737373] mb-8">
                {cart} {cart === 1 ? "товар" : "товара"}
              </p>

              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <ShoppingCart className="w-20 h-20 text-[#262626] mb-4" />
                  <p className="text-xl text-[#737373] mb-2">Корзина пуста</p>
                  <p className="text-sm text-[#737373]">Добавьте товары для оформления заказа</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 border-2 border-[#262626] p-4 hover:border-[#00d9ff] transition-colors group"
                      >
                        <div className="w-20 h-20 bg-black border border-[#262626] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="tracking-tight mb-1">{item.name}</h4>
                          <p className="text-xs text-[#737373] mb-2">Размер: {item.size}</p>
                          <p className="text-[#00d9ff]">{item.price}</p>
                        </div>

                        <button
                          onClick={() => {
                            const newItems = [...cartItems];
                            newItems.splice(index, 1);
                            setCartItems(newItems);
                            setCart(cart - 1);
                          }}
                          className="text-[#737373] hover:text-[#ff0033] transition-colors"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t-2 border-[#262626] pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#737373]">Подытог:</span>
                      <span className="text-xl tracking-tighter">
                        {cartItems.reduce((sum, item) => sum + parseInt(item.price.replace(/[^\d]/g, "")), 0).toLocaleString()} ₽
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#737373]">Доставка:</span>
                      <span className="text-[#00d9ff]">Бесплатно</span>
                    </div>

                    <div className="flex justify-between items-center text-xl border-t-2 border-[#262626] pt-4">
                      <span>Итого:</span>
                      <span className="text-[#00d9ff] tracking-tighter">
                        {cartItems.reduce((sum, item) => sum + parseInt(item.price.replace(/[^\d]/g, "")), 0).toLocaleString()} ₽
                      </span>
                    </div>

                    <motion.button
                      className="w-full bg-[#00d9ff] text-black py-4 tracking-widest text-sm hover:bg-white transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ОФОРМИТЬ ЗАКАЗ
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: -20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black border-2 border-[#00d9ff] max-w-6xl w-full relative"
              style={{ perspective: "1000px" }}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setShowModal(false)}
                className="absolute -top-4 -right-4 w-12 h-12 bg-[#00d9ff] text-black flex items-center justify-center hover:bg-white transition-colors z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">×</span>
              </motion.button>

              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Image */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative group"
                >
                  <motion.div
                    className="absolute inset-0 blur-3xl bg-[#00d9ff] opacity-0 group-hover:opacity-40 transition-opacity duration-500 z-0"
                  />
                  <div className="relative w-full h-[500px] border-2 border-[#262626] overflow-hidden bg-black">
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Corners */}
                  <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-[#00d9ff]" />
                  <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-4 border-r-4 border-[#00d9ff]" />
                </motion.div>

                {/* Details */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <motion.div
                      className="inline-block border border-[#00d9ff] px-4 py-1 mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="text-xs tracking-widest text-[#00d9ff]">{current.series}</span>
                    </motion.div>

                    <h3 className="text-5xl tracking-tighter mb-4">
                      {current.name.split(" ")[0]}
                      <br />
                      <span className="text-[#00d9ff]">{current.name.split(" ")[1]}</span>
                    </h3>

                    <p className="text-[#737373] text-lg mb-6">{current.description}</p>

                    <div className="text-4xl tracking-tighter text-[#00d9ff] mb-8">
                      {current.price}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <p className="text-xs tracking-widest text-[#737373] mb-4">ВЫБЕРИТЕ РАЗМЕР</p>
                    <div className="flex gap-3">
                      {["XS", "S", "M", "L", "XL"].map((size) => (
                        <motion.button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-14 h-14 border-2 transition-all ${
                            selectedSize === size
                              ? "border-[#00d9ff] bg-[#00d9ff] text-black"
                              : "border-[#262626] hover:border-[#00d9ff]"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <p className="text-xs tracking-widest text-[#737373] mb-4">КОЛИЧЕСТВО</p>
                    <div className="flex items-center gap-4">
                      <motion.button
                        className="w-12 h-12 border border-[#262626] hover:border-[#00d9ff] flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-xl">−</span>
                      </motion.button>
                      <span className="text-2xl w-12 text-center">1</span>
                      <motion.button
                        className="w-12 h-12 border border-[#262626] hover:border-[#00d9ff] flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-xl">+</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <motion.button
                    onClick={handleAddToCart}
                    className="w-full bg-[#00d9ff] text-black py-5 tracking-widest text-sm hover:bg-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ДОБАВИТЬ В КОРЗИНУ
                  </motion.button>

                  {/* Features */}
                  <div className="border-t border-[#262626] pt-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-[#00d9ff]" />
                      <span className="text-[#737373]">Бесплатная доставка</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-[#00d9ff]" />
                      <span className="text-[#737373]">Возврат в течение 30 дней</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-[#00d9ff]" />
                      <span className="text-[#737373]">Премиум упаковка</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
