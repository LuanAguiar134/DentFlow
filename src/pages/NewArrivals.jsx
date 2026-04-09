import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Sparkles } from 'lucide-react';

const NEW_PRODUCTS = [
  { id: 3, name: 'Vestido Champagne', price: 'R$ 2.190', category: 'Casual Chic', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/01536bde0_generated_92f327e8.png' },
  { id: 5, name: 'Vestido Rose Tulle', price: 'R$ 4.200', category: 'Noiva', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/93a9c84ff_generated_237d228d.png' },
  { id: 6, name: 'Vestido Midnight Silk', price: 'R$ 2.650', category: 'Festa', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/ac5ef7246_generated_4f88286c.png' },
];

export default function NewArrivals() {
  return (
    <div className="pt-28 pb-20 px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-14">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-rose-glass/60" />
          <p className="font-body text-xs tracking-[0.4em] text-rose-glass/60 uppercase">Recém Chegados</p>
        </div>
        <h1 className="font-heading text-5xl md:text-6xl font-light text-pearl">Novidades</h1>
        <p className="font-body text-sm text-pearl/30 mt-4 max-w-md mx-auto">
          As últimas adições à nossa coleção exclusiva, criadas com os mais finos tecidos da temporada.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {NEW_PRODUCTS.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: i * 0.15 }}>
            <Link to={`/produto/${product.id}`} className="group block relative overflow-hidden rounded-2xl">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="glass rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg text-pearl">{product.name}</h3>
                    <p className="font-body text-sm text-rose-glass/70 mt-1">{product.price}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-pearl/70">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="glass-strong rounded-full px-3 py-1 font-body text-[11px] tracking-wider text-rose-glass uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Novo
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}