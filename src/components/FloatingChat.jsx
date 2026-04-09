import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

// TODO: Integrar IA aqui — substituir handleSend pelo endpoint do seu modelo
export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Olá! Bem-vinda ao Velvet Atelier. Como posso ajudá-la a encontrar o vestido perfeito?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // ================================
    // PONTO DE INTEGRAÇÃO DA IA
    // Quando o banco estiver pronto, substitua o setTimeout abaixo
    // pela chamada ao seu endpoint de IA, ex:
    //
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   body: JSON.stringify({ message: input }),
    // });
    // const data = await response.json();
    // setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: data.reply }]);
    // ================================

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: 'Obrigada pela sua mensagem! Em breve nossa consultora virtual estará disponível para te ajudar. 🌹'
      }]);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-pearl/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-glass/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rose-glass" />
                </div>
                <div>
                  <h4 className="font-heading text-base text-pearl tracking-wide">Consultora</h4>
                  <p className="text-[11px] text-pearl/40 font-body">Assistente Virtual</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full glass flex items-center justify-center text-pearl/50 hover:text-pearl transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-rose-glass/20 text-pearl rounded-br-sm'
                      : 'glass-subtle text-pearl/80 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass-subtle px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-rose-glass/50"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2">
              <div className="glass rounded-xl flex items-center gap-2 px-4 py-2.5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escreva sua mensagem..."
                  className="flex-1 bg-transparent text-sm text-pearl placeholder:text-pearl/30 font-body outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-lg bg-rose-glass/20 flex items-center justify-center text-rose-glass hover:bg-rose-glass/30 transition-colors disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-black/30 transition-all duration-300 glass-strong"
      >
        {open ? (
          <X className="w-5 h-5 text-pearl" />
        ) : (
          <MessageCircle className="w-5 h-5 text-rose-glass" />
        )}
      </motion.button>
    </div>
  );
}