import { motion } from "motion/react";

interface ProductGalleryProps {
  onSelectProduct: (id: number) => void;
}

const products = [
  {
    id: 1,
    name: "ULTRA BLACK TEE",
    price: "12,900 ₽",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "SIGNATURE",
  },
  {
    id: 2,
    name: "VOID ESSENTIAL",
    price: "11,500 ₽",
    image: "https://images.unsplash.com/photo-1562135291-7728cc647783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "NEW",
  },
  {
    id: 3,
    name: "MINIMAL BLACK",
    price: "10,900 ₽",
    image: "https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "CLASSIC",
  },
  {
    id: 4,
    name: "DARK MATTER",
    price: "13,500 ₽",
    image: "https://images.unsplash.com/photo-1759572095317-3a96f9a98e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "LIMITED",
  },
  {
    id: 5,
    name: "SHADOW FORM",
    price: "12,200 ₽",
    image: "https://images.unsplash.com/photo-1759572095384-1a7e646d0d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "PREMIUM",
  },
  {
    id: 6,
    name: "OBSIDIAN CORE",
    price: "14,900 ₽",
    image: "https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tag: "EXCLUSIVE",
  },
];

export function ProductGallery({ onSelectProduct }: ProductGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group cursor-pointer"
          onClick={() => onSelectProduct(product.id)}
        >
          <div className="relative overflow-hidden mb-4 border border-[#262626]">
            {/* Tag */}
            <div className="absolute top-4 left-4 z-10 bg-[#00d9ff] text-black px-3 py-1">
              <span className="text-xs tracking-widest">{product.tag}</span>
            </div>

            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white px-6 py-3">
                  <span className="text-white text-sm tracking-widest">VIEW DETAILS</span>
                </div>
              </div>
            </div>

            {/* Decorative corner */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#00d9ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-lg tracking-tight group-hover:text-[#00d9ff] transition-colors">
                {product.name}
              </h4>
              <span className="text-xs tracking-widest text-[#737373]">00{product.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xl tracking-tighter">{product.price}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#737373]">XS</span>
                <span className="text-xs text-[#737373]">S</span>
                <span className="text-xs text-[#737373]">M</span>
                <span className="text-xs text-[#737373]">L</span>
                <span className="text-xs text-[#737373]">XL</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
