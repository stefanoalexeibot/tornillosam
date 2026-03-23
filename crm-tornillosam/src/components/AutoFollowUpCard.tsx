import { useState } from 'react'
import { Mail, Clock, Play, Pause, AlertCircle, CheckCircle2 } from 'lucide-react'
import { updateLead } from '../services/leads'
import type { Lead } from '../types'

interface Props {
  lead: Lead
  onUpdate: (updatedLead: Lead) => void
}

export default function AutoFollowUpCard({ lead, onUpdate }: Props) {
  const [loading, setLoading] = useState(false)

  const toggleAutomation = async () => {
    setLoading(true)
    try {
      const updated = await updateLead(lead.id, { 
        automation_enabled: !lead.automation_enabled 
      })
      onUpdate(updated)
    } catch (error) {
      console.error('Error toggling automation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card" style={{ padding: 20, marginBottom: 20, background: lead.automation_enabled ? 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)' : 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            padding: 8, 
            background: lead.automation_enabled ? '#DCFCE7' : '#F1F5F9', 
            color: lead.automation_enabled ? '#16A34A' : '#64748B', 
            borderRadius: 10 
          }}>
            <Mail size={18} />
          </div>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>Seguimiento Automático</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {lead.automation_enabled ? 'Secuencia activa · n8n' : 'Secuencia inactiva'}
            </p>
          </div>
        </div>
        <button 
          onClick={toggleAutomation}
          disabled={loading}
          style={{
            background: lead.automation_enabled ? '#FEF2F2' : '#EFF6FF',
            color: lead.automation_enabled ? '#EF4444' : '#2563EB',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s'
          }}
        >
          {loading ? '...' : lead.automation_enabled ? (
            <><Pause size={14} /> Detener</>
          ) : (
            <><Play size={14} /> Activar</>
          )}
        </button>
      </div>

      {lead.automation_enabled ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16A34A', fontSize: '0.8rem', fontWeight: 500 }}>
            <CheckCircle2 size={14} />
            Próximo contacto programado en 3 días
          </div>
          <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Clock size={12} color="#64748B" />
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>HISTORIAL DE AUTOMATIZACIÓN</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#475569' }}>
              {lead.last_followup_at 
                ? `Último correo enviado el ${new Date(lead.last_followup_at).toLocaleDateString()}`
                : 'Esperando primer intervalo de 3 días para enviar correo de seguimiento.'}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: '0.8rem' }}>
          <AlertCircle size={14} />
          Activa para que n8n detecte este lead y envíe correos automáticos.
        </div>
      )}
    </div>
  )
}
