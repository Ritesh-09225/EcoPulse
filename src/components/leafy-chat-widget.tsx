'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuMessageCircle as MessageCircle,
  LuX as X,
  LuSend as Send,
  LuLeaf as Leaf,
} from 'react-icons/lu'

type Message = { id: string; role: 'user' | 'assistant'; content: string }

export function LeafyChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      if (!res.ok) throw new Error('Network response was not ok')
      if (!res.body) throw new Error('No readable stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      }

      setMessages((prev) => [...prev, assistantMsg])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        assistantMsg.content += text
        setMessages((prev) => [...prev.slice(0, -1), { ...assistantMsg }])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center transition-all duration-300 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Ask Leafy"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-full max-w-[360px] h-[500px] bg-[#022C22] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    Leafy <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  </h3>
                  <p className="text-xs text-white/50">EcoPulse Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white/70 transition-colors p-2 rounded-lg hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                  <Leaf className="h-10 w-10 text-emerald-400 mb-2" />
                  <p className="text-sm">
                    Hi! I&apos;m Leafy. 🌿
                    <br />
                    Ask me about reducing your carbon footprint or how to earn more Eco Points!
                  </p>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-emerald-500 text-[#022C22] rounded-br-sm font-medium'
                          : 'bg-white/10 text-white rounded-bl-sm border border-white/5'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white rounded-2xl rounded-bl-sm border border-white/5 px-4 py-3 flex gap-1">
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white/[0.02] border-t border-white/10 shrink-0">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  className="flex-1 bg-white/[0.05] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500/50 transition-colors placeholder:text-white/30"
                  value={input}
                  placeholder="Ask Leafy anything..."
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#022C22] rounded-xl px-4 flex items-center justify-center transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
