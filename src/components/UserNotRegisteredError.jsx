export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-burgundy">
      <div className="max-w-md w-full glass rounded-3xl p-10 text-center">
        <div className="w-16 h-16 rounded-full glass-strong mx-auto mb-6 flex items-center justify-center">
          <span className="text-rose-glass text-2xl">✦</span>
        </div>
        <h1 className="font-heading text-3xl font-light text-pearl mb-4">
          Acesso Restrito
        </h1>
        <p className="font-body text-sm text-pearl/50 leading-relaxed">
          Você não tem acesso a esta aplicação. Entre em contato com a administração.
        </p>
      </div>
    </div>
  )
}