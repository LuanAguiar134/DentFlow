import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingChat from '../chat/FloatingChat';

export default function AppLayout() {
  return (
    <div className="min-h-screen gradient-burgundy relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-burgundy-light/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-rose-glass/5 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-burgundy/10 rounded-full blur-3xl" />
      </div>
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}