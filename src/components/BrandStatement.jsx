import React from 'react';
import { motion } from 'framer-motion';

export default function BrandStatement() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-rose-glass/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-3xl p-10 md:p-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="font-body text-xs tracking-[0.4em] text-rose-glass/50 uppercase mb-8">
              Nossa Filosofia
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-light text-pearl leading-snug mb-8 italic">
              "Cada vestido carrega a promessa de transformar um momento em memória"
            </h2>
            <p className="font-body text-sm md:text-base text-pearl/40 max-w-xl mx-auto leading-relaxed">
              No Velvet Atelier, acreditamos que a moda é uma forma de arte.
              Nossos vestidos são criados com tecidos nobres, atenção obsessiva aos detalhes
              e o compromisso de fazer cada mulher se sentir única.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-pearl/5">
            {[
              { number: '200+', label: 'Peças Exclusivas' },
              { number: '15k', label: 'Clientes Felizes' },
              { number: '8', label: 'Anos de Excelência' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-2xl md:text-3xl text-rose-glass/80">{stat.number}</p>
                <p className="font-body text-[11px] md:text-xs text-pearl/30 tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}