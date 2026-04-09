import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

function ProductTile({ product, index }) {
  const isLarge = index === 0 || index === 3;

  return (
    <motion.div
      variants={cardVariants}
      className={`group relative overflow-hidden rounded-2xl ${
        isLarge ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <Link to="/colecao" className="block relative h-full min-h-[320px] md:min-h-[400px]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/90 via-burgundy-dark/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <div className="glass rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg text-pearl">{product.name}</h3>
                  <p className="font-body text-sm text-rose-glass/70">{product.price}</p>
                </div>
                <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-pearl/70">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="glass-subtle rounded-full px-4 py-1.5 font-body text-[11px] tracking-wider text-pearl/60 uppercase">
            {product.category}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedGrid({ products }) {
  return (
    <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="font-body text-xs tracking-[0.4em] text-rose-glass/60 uppercase mb-4">
          Curadoria Especial
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-light text-pearl">
          Peças em Destaque
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-auto"
      >
        {products.map((product, i) => (
          <ProductTile key={product.id} product={product} index={i} />
        ))}
      </motion.div>
    </section>
  );
}