import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Mail, Lock, LogIn, UserPlus, ShieldCheck, User, Zap } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegister, setIsRegister] = useState(false)
  const { session } = useAuth()
  const navigate = useNavigate()

  if (session) return <Navigate to="/" />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (isRegister) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: nombre,
            }
          }
        })
        if (signUpError) throw signUpError
        alert('Registro exitoso. ¡Revisa tu correo para confirmar tu cuenta!')
        setIsRegister(false)
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      padding: 20
    }}>
      <div className="glass-card" style={{ 
        width: '100%', 
        maxWidth: 400, 
        padding: '48px 32px', 
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            width: 56, height: 56, 
            background: 'linear-gradient(135deg, #2563EB, #6366F1)', 
            borderRadius: 16, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)'
          }}>
            <span style={{ fontSize: 28 }}>🔩</span>
          </div>
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: 8 }}>
            Tornillos AM
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
            {isRegister ? 'Crea tu cuenta de vendedor' : 'Bienvenido de nuevo'}
          </p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#FCA5A5', 
            padding: '12px 16px', 
            borderRadius: 12, 
            fontSize: '0.8rem', 
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <ShieldCheck size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {isRegister && (
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input 
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Nombre Completo"
                required
                style={{ 
                  width: '100%', 
                  background: 'rgba(15, 23, 42, 0.5)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 12, 
                  padding: '12px 16px 12px 48px',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  height: 48
                }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Correo Electrónico"
              required
              style={{ 
                width: '100%', 
                background: 'rgba(15, 23, 42, 0.5)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: 12, 
                padding: '12px 16px 12px 48px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                height: 48
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              style={{ 
                width: '100%', 
                background: 'rgba(15, 23, 42, 0.5)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: 12, 
                padding: '12px 16px 12px 48px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                height: 48
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ 
              marginTop: 8, 
              height: 52,
              fontSize: '1rem', 
              fontWeight: 700,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 10,
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              border: 'none',
              boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
              borderRadius: 12,
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : isRegister ? (
              <><UserPlus size={20} /> Crear Cuenta</>
            ) : (
              <><LogIn size={20} /> Iniciar Sesión</>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button 
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#94A3B8', 
                fontSize: '0.85rem', 
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#475569', fontSize: '0.75rem' }}>
          <Zap size={14} /> Powered by Antigravity CRM
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          input::placeholder { color: #475569; }
          input:focus { border-color: #3B82F6 !important; background: rgba(15, 23, 42, 0.8) !important; }
        `}</style>
      </div>
    </div>
  )
}
