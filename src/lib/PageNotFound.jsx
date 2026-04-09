import { useLocation } from 'react-router-dom'

export default function PageNotFound() {
  const location = useLocation()
  const pageName = location.pathname.substring(1)

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-burgundy">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="font-heading text-8xl font-light text-rose-glass/30">404</h1>
        <div className="h-px w-16 bg-pearl/10 mx-auto" />
        <h2 className="font-heading text-3xl font-light text-pearl">
          Página não encontrada
        </h2>
        <p className="font-body text-sm text-pearl/40 leading-relaxed">
          A página <span className="text-rose-glass/70">"{pageName}"</span> não existe.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="inline-flex items-center gap-2 glass rounded-full px-8 py-3 font-body text-sm text-pearl/70 hover:text-pearl tracking-widest uppercase transition-all duration-300"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  )
}