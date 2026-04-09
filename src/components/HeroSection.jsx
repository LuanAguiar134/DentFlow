import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ heroImage }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        animate={{
          x: (mousePos.x - 0.5) * -20,
          y: (mousePos.y - 0.5) * -20,
          scale: 1.05,
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-burgundy-dark/60 via-burgundy/40 to-burgundy-dark/90" />

      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(226, 168, 168, 0.07) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body text-xs md:text-sm tracking-[0.4em] text-rose-glass/70 uppercase mb-6">
            Coleção Exclusiva 2026
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-light text-pearl leading-none mb-8 text-glow"
        >
          A Arte de
          <br />
          <span className="italic text-rose-glass/90">Vestir</span> Sonhos
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-body text-sm md:text-base text-pearl/50 max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Vestidos criados para mulheres extraordinárias. Cada peça é uma obra-prima em tecido, feita para momentos que merecem ser eternos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <Link
            to="/colecao"
            className="group inline-flex items-center gap-3 glass rounded-full px-8 py-4 text-pearl/90 font-body text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-500"
          >
            Descobrir a Coleção
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border border-pearl/20 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-rose-glass/60"
          />
        </div>
      </motion.div>
    </section>
  );
}