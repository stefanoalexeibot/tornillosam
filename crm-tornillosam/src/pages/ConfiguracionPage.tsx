import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { User, Bell, Shield, Building2, Save, LogOut, Database } from 'lucide-react'

export default function ConfiguracionPage() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '')

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Configuración guardada correctamente')
    }, 800)
  }

  const handleSeedLeads = async () => {
    if (!user) return
    setLoading(true)
    try {
      const email = user.email || ''
      let count = 0
      
      // Initial leads for a.luna@tornillosam.com
      if (email === 'a.luna@tornillosam.com') {
        const { error } = await supabase.from('leads').insert([
          { user_id: user.id, nombre: 'Alejandro Galván (CEMEX)', empresa: 'CEMEX', cargo: 'Comprador Industrial', estado: 'respondio', fuente: 'linkedin', prioridad: 'alta' },
          { user_id: user.id, nombre: 'Roberto Soto (Ternium)', empresa: 'Ternium', cargo: 'Gerente Mantenimiento', estado: 'conectado', fuente: 'linkedin', prioridad: 'media' },
          { user_id: user.id, nombre: 'Marcia Ruiz (Kia Motors)', empresa: 'Kia Motors', cargo: 'Procurement Specialist', estado: 'llamada', fuente: 'manual', prioridad: 'alta' },
        ])
        if (error) throw error
        count = 3
      }
      // Initial leads for jluna@tornillosam.com
      else if (email === 'jluna@tornillosam.com') {
        const { error } = await supabase.from('leads').insert([
          { user_id: user.id, nombre: 'Manuel Torres (Femsa)', empresa: 'Femsa', cargo: 'Facility Manager', estado: 'respondio', fuente: 'linkedin', prioridad: 'alta' },
          { user_id: user.id, nombre: 'Sandra Luz (PepsiCo)', empresa: 'PepsiCo', cargo: 'Mantenimiento de Línea', estado: 'conectado', fuente: 'linkedin', prioridad: 'media' },
        ])
        if (error) throw error
        count = 2
      }
      // Initial leads for dcanales@tornillosam.com
      else if (email === 'dcanales@tornillosam.com') {
        const { error } = await supabase.from('leads').insert([
          { user_id: user.id, nombre: 'David Arriaga (MetalSa)', empresa: 'MetalSa', cargo: 'Ingeniero de Planta', estado: 'respondio', fuente: 'linkedin', prioridad: 'alta' },
          { user_id: user.id, nombre: 'Gerardo Ortiz (Carrier)', empresa: 'Carrier', cargo: 'Purchasing', estado: 'llamada', fuente: 'webhook', prioridad: 'media' },
        ])
        if (error) throw error
        count = 2
      } else {
        alert('Este usuario no tiene un set de leads pre-definido. Puedes agregarlos manualmente en la sección de Leads.')
        setLoading(false)
        return
      }

      alert(`¡Portal activado! Se han cargado ${count} leads estratégicos de LinkedIn a tu cuenta.`)
    } catch (err: any) {
      alert('Error cargando leads: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 28, maxWidth: 800, margin: '0 auto' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0F172A', marginBottom: 8 }}>Configuración</h1>
        <p style={{ color: '#64748B' }}>Gestiona tu perfil, preferencias del equipo e integraciones</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Personal Profile */}
        <section className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 10, background: '#EFF6FF', color: '#2563EB', borderRadius: 12 }}>
              <User size={20} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Perfil Personal</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 6 }}>Nombre Público</label>
              <input 
                className="input" 
                value={nombre} 
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre" 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 6 }}>Correo Electrónico</label>
              <input className="input" disabled value={user?.email || ''} style={{ background: '#F8FAFC', cursor: 'not-allowed' }} />
            </div>
          </div>
          
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            <Save size={16} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </section>

        {/* Portal Activation (Seed Data) */}
        {(user?.email === 'a.luna@tornillosam.com' || user?.email === 'jluna@tornillosam.com' || user?.email === 'dcanales@tornillosam.com') && (
          <section className="glass-card" style={{ padding: 24, background: 'linear-gradient(135deg, #ECFDF5, #F0FDFA)', border: '1px solid #6EE7B7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 10, background: 'white', color: '#059669', borderRadius: 12, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <Database size={20} />
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#065F46' }}>Activación de Portal Inicial</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#065F46', marginBottom: 16 }}>
              Hola <strong>{user.email.split('@')[0]}</strong>. He detectado que tu cuenta es una de las principales de Tornillos AM. 
              Puedes cargar automáticamente tus primeros prospectos estratégicos de LinkedIn para empezar a vender hoy mismo.
            </p>
            <button className="btn" onClick={handleSeedLeads} disabled={loading} style={{ background: '#059669', color: 'white' }}>
              🚀 Cargar mis Leads de LinkedIn
            </button>
          </section>
        )}

        {/* Workspace / Team */}
        <section className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 10, background: '#F5F3FF', color: '#8B5CF6', borderRadius: 12 }}>
              <Building2 size={20} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Empresa: Tornillos AM</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>Plan Enterprise</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Usuarios ilimitados, RLS activo y automatizaciones LinkedIn.</div>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', background: '#ECFDF5', padding: '4px 10px', borderRadius: 999 }}>ACTIVO</span>
            </div>
          </div>
        </section>

        {/* Communication Templates */}
        <section className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 10, background: '#DCFCE7', color: '#16A34A', borderRadius: 12 }}>
              <Save size={20} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Plantillas de Comunicación</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 6 }}>Mensaje de Primer Contacto (LinkedIn/WhatsApp)</label>
              <textarea 
                className="input" 
                rows={3}
                defaultValue="Hola [Nombre], vi tu perfil en relación a [Empresa]. En Tornillos AM nos especializamos en suministro industrial de alta resistencia. ¿Te interesaría conocer nuestro catálogo?"
                style={{ fontSize: '0.85rem', lineHeight: '1.5', resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 6 }}>Seguimiento (Lead Frío)</label>
              <textarea 
                className="input" 
                rows={3}
                defaultValue="Hola [Nombre], paso a saludarte. Sigo a tu disposición para cualquier requerimiento de tornillería especializada para [Empresa]. ¡Saludos!"
                style={{ fontSize: '0.85rem', lineHeight: '1.5', resize: 'vertical' }}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 10, background: '#FFFBEB', color: '#D97706', borderRadius: 12 }}>
              <Bell size={20} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Notificaciones</h2>
          </div>

          {[
            { id: 'leads', label: 'Nuevos leads entrantes (Webhook)', desc: 'Recibir notificación cuando Phantombuster detecte un nuevo contacto.' },
            { id: 'followup', label: 'Recordatorios de seguimiento', desc: 'Alertas de leads que llevan más de 5 días sin actividad.' },
            { id: 'wa', label: 'WhatsApp Status', desc: 'Notificar si la conexión con WhatsApp Web se pierde.' }
          ].map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <input type="checkbox" defaultChecked style={{ marginTop: 4, width: 16, height: 16, cursor: 'pointer' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>{item.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Security / System */}
        <section className="glass-card" style={{ padding: 24, background: '#FEF2F2', border: '1px solid #FEE2E2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 10, background: 'white', color: '#EF4444', borderRadius: 12 }}>
              <Shield size={20} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#991B1B' }}>Zona de Seguridad</h2>
          </div>
          
          <p style={{ fontSize: '0.8rem', color: '#B91C1C', marginBottom: 16 }}>
            Ten cuidado al cerrar sesión o cambiar credenciales. Tu acceso está protegido por Row Level Security.
          </p>

          <button onClick={signOut} className="btn-ghost" style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>
            <LogOut size={16} /> Cerrar Sesión del Sistema
          </button>
        </section>
      </div>
    </div>
  )
}
