import { useState } from 'react'
import type { Lead, EstadoLead, FuenteLead, PrioridadLead } from '../types'
import { createLead, updateLead } from '../services/leads'
import { useAuth } from '../hooks/useAuth'
import { X } from 'lucide-react'

interface Props {
  lead?: Lead
  onClose: () => void
  onSaved: (lead: Lead) => void
}

export default function LeadModal({ lead, onClose, onSaved }: Props) {
  const isEdit = !!lead
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: lead?.nombre ?? '',
    empresa: lead?.empresa ?? '',
    cargo: lead?.cargo ?? '',
    linkedin_url: lead?.linkedin_url ?? '',
    telefono: lead?.telefono ?? '',
    email: lead?.email ?? '',
    estado: (lead?.estado ?? 'conectado') as EstadoLead,
    fuente: (lead?.fuente ?? 'linkedin') as FuenteLead,
    prioridad: (lead?.prioridad ?? 'media') as PrioridadLead,
    notas: lead?.notas ?? '',
  })

  const { user } = useAuth()

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let saved: Lead
      if (isEdit) {
        saved = await updateLead(lead!.id, form)
      } else {
        // Enforce user_id from current session
        saved = await createLead({ 
          ...form, 
          user_id: user?.id 
        })
      }
      onSaved(saved)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>
            {isEdit ? 'Editar Lead' : 'Nuevo Lead'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Main Info Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 12 
          }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Nombre *</label>
              <input className="input" required value={form.nombre} onChange={set('nombre')} placeholder="Nombre completo" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Empresa</label>
              <input className="input" value={form.empresa} onChange={set('empresa')} placeholder="Empresa o Negocio" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Cargo / Puesto</label>
              <input className="input" value={form.cargo} onChange={set('cargo')} placeholder="Ej. Gerente, Dueño..." />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Teléfono (WhatsApp)</label>
              <input className="input" value={form.telefono} onChange={set('telefono')} placeholder="+52 ..." />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Email</label>
              <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>LinkedIn / Web URL</label>
              <input className="input" value={form.linkedin_url} onChange={set('linkedin_url')} placeholder="URL de perfil o sitio" />
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: 12 
          }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Estado</label>
              <select className="input" value={form.estado} onChange={set('estado')}>
                <option value="conectado">Conectado</option>
                <option value="respondio">Respondió</option>
                <option value="llamada">Llamada</option>
                <option value="propuesta">Propuesta</option>
                <option value="cliente">Cliente</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Fuente</label>
              <select className="input" value={form.fuente} onChange={set('fuente')}>
                <option value="linkedin">LinkedIn</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="facebook">Facebook</option>
                <option value="directo">Trato Directo</option>
                <option value="referido">Referido</option>
                <option value="manual">Manual</option>
                <option value="webhook">Automático (Web)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Prioridad</label>
              <select className="input" value={form.prioridad} onChange={set('prioridad')}>
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Media</option>
                <option value="baja">🟢 Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Notas adicionales</label>
            <textarea
              className="input"
              value={form.notas}
              onChange={set('notas')}
              placeholder="Detalles importantes..."
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? '...' : isEdit ? 'Guardar Cambios' : 'Crear Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
