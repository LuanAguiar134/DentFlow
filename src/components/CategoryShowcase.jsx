import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  { name: 'Noite', description: 'Elegância para eventos memoráveis', slug: 'noite' },
  { name: 'Festa', description: 'Brilho em cada detalhe', slug: 'festa' },
  { name: 'Casual Chic', description: 'Sofisticação para o dia a dia', slug: 'casual' },
  { name: 'Noiva', description: 'O vestido dos seus sonhos', slug: 'noiva' },
];

export default function CategoryShowcase() {
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
          Explore
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-light text-pearl">
          Categorias
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Link
              to="/colecao"
              className="group block glass rounded-2xl p-8 md:p-10 hover:bg-white/[0.08] transition-all duration-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl md:text-3xl text-pearl group-hover:text-rose-glass transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="font-body text-sm text-pearl/30 mt-2">{cat.description}</p>
                </div>
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-pearl/30 group-hover:text-rose-glass group-hover:bg-rose-glass/10 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}