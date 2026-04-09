import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Gem } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Paixão', desc: 'Cada vestido é criado com amor e dedicação artesanal.' },
  { icon: Award, title: 'Excelência', desc: 'Utilizamos apenas os mais nobres tecidos importados.' },
  { icon: Gem, title: 'Exclusividade', desc: 'Peças em edição limitada para momentos únicos.' },
];

export default function About() {
  return (
    <div className="pt-28 pb-20 px-6 md:px-10 max-w-5xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-20">
        <p className="font-body text-xs tracking-[0.4em] text-rose-glass/60 uppercase mb-4">Nossa História</p>
        <h1 className="font-heading text-5xl md:text-6xl font-light text-pearl mb-8">Sobre Nós</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="glass rounded-3xl p-10 md:p-16 mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-light text-pearl mb-6 italic">
          Onde a elegância encontra a emoção
        </h2>
        <div className="space-y-4 font-body text-sm text-pearl/50 leading-relaxed max-w-3xl">
          <p>Fundado em 2018, o Zuest Fashion nasceu de um sonho: criar vestidos que não apenas vestissem o corpo, mas que tocassem a alma. Cada peça é resultado de meses de pesquisa, seleção de tecidos e confecção artesanal.</p>
          <p>Nosso ateliê combina técnicas tradicionais de alta-costura com uma visão contemporânea de elegância. Acreditamos que um vestido deve contar uma história — a sua história.</p>
          <p>Trabalhamos com os melhores fornecedores de tecidos da Itália, França e Japão, garantindo que cada detalhe, cada costura, cada acabamento esteja à altura da mulher que o veste.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {values.map((v, i) => (
          <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }} className="glass rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-full glass-strong mx-auto mb-5 flex items-center justify-center">
              <v.icon className="w-6 h-6 text-rose-glass/70" />
            </div>
            <h3 className="font-heading text-xl text-pearl mb-3">{v.title}</h3>
            <p className="font-body text-sm text-pearl/40 leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}