import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Filter, X } from 'lucide-react';

const ALL_PRODUCTS = [
  { id: 1, name: 'Vestido Bordeaux', price: 'R$ 2.890', category: 'Noite', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/f5041fe50_generated_29a5ecaf.png' },
  { id: 2, name: 'Vestido Noir Sequin', price: 'R$ 3.450', category: 'Festa', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/57ee407c8_generated_9e2ef7d2.png' },
  { id: 3, name: 'Vestido Champagne', price: 'R$ 2.190', category: 'Casual Chic', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/01536bde0_generated_92f327e8.png' },
  { id: 4, name: 'Vestido Esmeralda', price: 'R$ 3.780', category: 'Noite', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/5a989ccf3_generated_e2087086.png' },
  { id: 5, name: 'Vestido Rose Tulle', price: 'R$ 4.200', category: 'Noiva', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/93a9c84ff_generated_237d228d.png' },
  { id: 6, name: 'Vestido Midnight Silk', price: 'R$ 2.650', category: 'Festa', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/ac5ef7246_generated_4f88286c.png' },
];

const CATEGORIES = ['Todos', 'Noite', 'Festa', 'Casual Chic', 'Noiva'];

function ProductCard({ product }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/produto/${product.id}`} className="group block relative overflow-hidden rounded-2xl">
        <div className="aspect-[3/4] overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg text-pearl">{product.name}</h3>
                <p className="font-body text-sm text-rose-glass/70 mt-1">{product.price}</p>
              </div>
              <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-pearl/70">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="glass-subtle rounded-full px-3 py-1 font-body text-[11px] tracking-wider text-pearl/60 uppercase">
            {product.category}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Collection() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = activeCategory === 'Todos'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="pt-28 pb-20 px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <p className="font-body text-xs tracking-[0.4em] text-rose-glass/60 uppercase mb-4">Explore Nossa</p>
        <h1 className="font-heading text-5xl md:text-6xl font-light text-pearl">Coleção</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-center gap-3 mb-14 flex-wrap"
      >
        <Filter className="w-4 h-4 text-pearl/30 mr-2" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full font-body text-xs tracking-wider uppercase transition-all duration-300 ${
              activeCategory === cat ? 'glass-strong text-rose-glass' : 'glass-subtle text-pearl/40 hover:text-pearl/70'
            }`}
          >
            {cat}
          </button>
        ))}
        {activeCategory !== 'Todos' && (
          <button onClick={() => setActiveCategory('Todos')} className="w-7 h-7 rounded-full glass flex items-center justify-center text-pearl/40 hover:text-pearl">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}