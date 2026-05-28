import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";

interface ProductDetailProps {
  productId: number;
  onClose: () => void;
  onAddToCart: () => void;
}

const productsData = [
  {
    id: 1,
    name: "ULTRA BLACK TEE",
    price: "12,900 ₽",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "SIGNATURE",
    description: "Премиум футболка из 100% органического хлопка плотностью 220 г/м². Глубокий насыщенный черный цвет достигается благодаря специальной технологии окрашивания.",
    features: ["100% органический хлопок", "Плотность 220 г/м²", "Оверсайз крой", "Усиленные швы"],
    care: "Стирка при 30°C, не отбеливать, гладить с изнанки",
  },
  {
    id: 2,
    name: "VOID ESSENTIAL",
    price: "11,500 ₽",
    image: "https://images.unsplash.com/photo-1562135291-7728cc647783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "NEW",
    description: "Базовая футболка в минималистичном стиле. Идеальный баланс комфорта и стиля для повседневной носки.",
    features: ["Премиум хлопок", "Плотность 200 г/м²", "Классический крой", "Двойная строчка"],
    care: "Стирка при 30°C, не отбеливать",
  },
  {
    id: 3,
    name: "MINIMAL BLACK",
    price: "10,900 ₽",
    image: "https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "CLASSIC",
    description: "Классическая черная футболка с продуманными деталями. Универсальная модель для любого стиля.",
    features: ["Качественный хлопок", "Плотность 180 г/м²", "Стандартный крой", "Рибаный воротник"],
    care: "Стирка при 40°C",
  },
  {
    id: 4,
    name: "DARK MATTER",
    price: "13,500 ₽",
    image: "https://images.unsplash.com/photo-1759572095317-3a96f9a98e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "LIMITED",
    description: "Лимитированная коллекция с уникальной текстурой ткани. Создана для ценителей эксклюзивности.",
    features: ["Премиум материал", "Плотность 240 г/м²", "Оверсайз крой", "Ограниченный тираж"],
    care: "Деликатная стирка 30°C, сушить в тени",
  },
  {
    id: 5,
    name: "SHADOW FORM",
    price: "12,200 ₽",
    image: "https://images.unsplash.com/photo-1759572095384-1a7e646d0d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "PREMIUM",
    description: "Футболка премиум качества с безупречной посадкой. Идеальные пропорции для любого типа фигуры.",
    features: ["Органический хлопок", "Плотность 210 г/м²", "Анатомический крой", "Премиум отделка"],
    care: "Стирка при 30°C, гладить при низкой температуре",
  },
  {
    id: 6,
    name: "OBSIDIAN CORE",
    price: "14,900 ₽",
    image: "https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "EXCLUSIVE",
    description: "Эксклюзивная модель из коллекции премиум. Использованы только лучшие материалы и инновационные технологии.",
    features: ["100% премиум хлопок", "Плотность 260 г/м²", "Дизайнерский крой", "Ручная обработка"],
    care: "Деликатная стирка 30°C, профессиональная чистка рекомендуется",
  },
];

export function ProductDetail({ productId, onClose, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const product = productsData.find(p => p.id === productId);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!product) return null;

  const sizes = ["XS", "S", "M", "L", "XL"];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="absolute right-0 top-0 h-full w-full md:w-[800px] lg:w-[1000px] bg-black border-l border-[#262626] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 hover:text-[#00d9ff] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8 md:p-12">
            {/* Product Tag */}
            <div className="inline-block bg-[#00d9ff] text-black px-4 py-2 mb-8">
              <span className="text-xs tracking-widest">{product.tag}</span>
            </div>

            {/* Product Image */}
            <div className="relative mb-12 border border-[#262626]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] md:h-[600px] object-cover grayscale"
              />
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#00d9ff]"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#00d9ff]"></div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-4xl md:text-5xl tracking-tighter">{product.name}</h2>
                  <span className="text-xs tracking-widest text-[#737373]">00{product.id}</span>
                </div>
                <p className="text-3xl tracking-tighter text-[#00d9ff]">{product.price}</p>
              </div>

              {/* Description */}
              <div className="border-l-2 border-[#00d9ff] pl-6">
                <p className="text-sm text-[#737373] leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              <div>
                <p className="text-xs tracking-widest text-[#737373] mb-4">ХАРАКТЕРИСТИКИ</p>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#00d9ff]"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <p className="text-xs tracking-widest text-[#737373] mb-4">РАЗМЕР</p>
                <div className="flex items-center gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 border transition-all ${
                        selectedSize === size
                          ? "border-[#00d9ff] bg-[#00d9ff] text-black"
                          : "border-[#262626] hover:border-[#00d9ff]"
                      }`}
                    >
                      <span className="text-sm tracking-wide">{size}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-xs tracking-widest text-[#737373] mb-4">КОЛИЧЕСТВО</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border border-[#262626] hover:border-[#00d9ff] transition-colors flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl tracking-tighter w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-12 h-12 border border-[#262626] hover:border-[#00d9ff] transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#00d9ff] text-black py-6 hover:bg-white transition-colors flex items-center justify-center gap-3 group"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="tracking-widest text-sm">ДОБАВИТЬ В КОРЗИНУ</span>
              </button>

              {/* Care Instructions */}
              <div className="border-t border-[#262626] pt-6">
                <p className="text-xs tracking-widest text-[#737373] mb-3">УХОД ЗА ИЗДЕЛИЕМ</p>
                <p className="text-sm text-[#737373]">{product.care}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
