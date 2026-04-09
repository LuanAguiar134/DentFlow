import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Star, Ruler, Shirt } from 'lucide-react';

const ALL_PRODUCTS = [
  { id: 1, name: 'Vestido Bordeaux', price: 'R$ 2.890', category: 'Noite', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/f5041fe50_generated_29a5ecaf.png', fabric: 'Veludo Premium', fit: 'Ajustado', care: 'Lavagem a seco' },
  { id: 2, name: 'Vestido Noir Sequin', price: 'R$ 3.450', category: 'Festa', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/57ee407c8_generated_9e2ef7d2.png', fabric: 'Paetê sobre Tule', fit: 'Sereia', care: 'Lavagem a seco' },
  { id: 3, name: 'Vestido Champagne', price: 'R$ 2.190', category: 'Casual Chic', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/01536bde0_generated_92f327e8.png', fabric: 'Cetim com Renda', fit: 'Fluido', care: 'Lavagem delicada' },
  { id: 4, name: 'Vestido Esmeralda', price: 'R$ 3.780', category: 'Noite', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/5a989ccf3_generated_e2087086.png', fabric: 'Veludo Italiano', fit: 'Longo com fenda', care: 'Lavagem a seco' },
  { id: 5, name: 'Vestido Rose Tulle', price: 'R$ 4.200', category: 'Noiva', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/93a9c84ff_generated_237d228d.png', fabric: 'Tule Francês', fit: 'Princesa', care: 'Profissional' },
  { id: 6, name: 'Vestido Midnight Silk', price: 'R$ 2.650', category: 'Festa', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/ac5ef7246_generated_4f88286c.png', fabric: 'Seda Charmeuse', fit: 'Transpassado', care: 'Lavagem a seco' },
];

const SIZES = ['PP', 'P', 'M', 'G', 'GG'];

export default function ProductDetail() {
  const { id } = useParams();
  const product = ALL_PRODUCTS.find(p => p.id === parseInt(id)) || ALL_PRODUCTS[0];
  const [selectedSize, setSelectedSize] = useState(null);
  const [liked, setLiked] = useState(false);

  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/colecao" className="inline-flex items-center gap-2 font-body text-sm text-pearl/40 hover:text-pearl transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Voltar à Coleção
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative rounded-3xl overflow-hidden">
          <div className="aspect-[3/4]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <button onClick={() => setLiked(!liked)} className={`absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center transition-colors duration-300 ${liked ? 'text-rose-glass' : 'text-pearl/50'}`}>
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col justify-center">
          <span className="font-body text-xs tracking-[0.3em] text-rose-glass/60 uppercase">{product.category}</span>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-pearl mt-3 mb-4">{product.name}</h1>
          <p className="font-heading text-2xl text-rose-glass/80 mb-8">{product.price}</p>

          <div className="flex items-center gap-1 mb-8">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-rose-glass/60 fill-current" />)}
            <span className="font-body text-xs text-pearl/30 ml-2">(42 avaliações)</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Shirt, label: 'Tecido', value: product.fabric },
              { icon: Ruler, label: 'Modelagem', value: product.fit },
              { icon: Star, label: 'Cuidado', value: product.care },
            ].map((detail) => (
              <div key={detail.label} className="glass-subtle rounded-xl p-4 text-center">
                <detail.icon className="w-4 h-4 text-rose-glass/50 mx-auto mb-2" />
                <p className="font-body text-[10px] text-pearl/30 tracking-wider uppercase mb-1">{detail.label}</p>
                <p className="font-body text-xs text-pearl/70">{detail.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-10">
            <p className="font-body text-xs text-pearl/40 tracking-wider uppercase mb-4">Tamanho</p>
            <div className="flex gap-3">
              {SIZES.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl font-body text-sm tracking-wider transition-all duration-300 ${
                    selectedSize === size ? 'glass-strong text-rose-glass border border-rose-glass/30' : 'glass-subtle text-pearl/40 hover:text-pearl/70'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full glass-strong rounded-xl py-4 font-body text-sm tracking-widest uppercase text-pearl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            Adicionar à Sacola
          </button>
        </motion.div>
      </div>
    </div>
  );
}