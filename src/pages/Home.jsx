import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedGrid from '../components/home/FeaturedGrid';
import BrandStatement from '../components/home/BrandStatement';
import CategoryShowcase from '../components/home/CategoryShowcase';

const HERO_IMAGE = 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/e6e2b598f_generated_6ee086b8.png';

const FEATURED_PRODUCTS = [
  { id: 1, name: 'Vestido Bordeaux', price: 'R$ 2.890', category: 'Noite', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/f5041fe50_generated_29a5ecaf.png' },
  { id: 2, name: 'Vestido Noir Sequin', price: 'R$ 3.450', category: 'Festa', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/57ee407c8_generated_9e2ef7d2.png' },
  { id: 3, name: 'Vestido Champagne', price: 'R$ 2.190', category: 'Casual Chic', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/01536bde0_generated_92f327e8.png' },
  { id: 4, name: 'Vestido Esmeralda', price: 'R$ 3.780', category: 'Noite', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/5a989ccf3_generated_e2087086.png' },
  { id: 5, name: 'Vestido Rose Tulle', price: 'R$ 4.200', category: 'Noiva', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/93a9c84ff_generated_237d228d.png' },
  { id: 6, name: 'Vestido Midnight Silk', price: 'R$ 2.650', category: 'Festa', image: 'https://media.base44.com/images/public/69d6d1d602c2459cc797b1ab/ac5ef7246_generated_4f88286c.png' },
];

export default function Home() {
  return (
    <div>
      <HeroSection heroImage={HERO_IMAGE} />
      <FeaturedGrid products={FEATURED_PRODUCTS} />
      <BrandStatement />
      <CategoryShowcase />
    </div>
  );
}