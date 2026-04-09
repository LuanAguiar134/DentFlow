import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative gradient-burgundy-deep">
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-burgundy-dark pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <h3 className="font-heading text-3xl font-light text-pearl mb-4 tracking-wider">
              VELVET <span className="text-rose-glass">·</span> Atelier
            </h3>
            <p className="font-body text-sm text-pearl/50 leading-relaxed max-w-xs">
              Vestidos exclusivos para mulheres que buscam elegância atemporal e confiança em cada momento especial.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg text-rose-glass/80 mb-6 tracking-wider">Navegação</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Coleção', path: '/colecao' },
                { label: 'Novidades', path: '/novidades' },
                { label: 'Sobre Nós', path: '/sobre' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-body text-sm text-pearl/40 hover:text-pearl/80 transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg text-rose-glass/80 mb-6 tracking-wider">Contato</h4>
            <p className="font-body text-sm text-pearl/40 mb-4">contato@velvetatelier.com</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center text-pearl/50 hover:text-rose-glass transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center text-pearl/50 hover:text-rose-glass transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center text-pearl/50 hover:text-rose-glass transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-pearl/5 pt-8">
          <p className="font-body text-xs text-pearl/25 text-center tracking-wider">
            © 2026 Velvet Atelier. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}