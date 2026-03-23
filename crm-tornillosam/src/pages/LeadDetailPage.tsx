import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getLeadById, getActivitiesByLead, createActivity, updateLead } from '../services/leads'
import { useAuth } from '../hooks/useAuth'
import type { Lead, Activity, TipoActividad, EstadoLead } from '../types'
import { ESTADOS, ACTIVIDAD_ICONS } from '../types'
import LeadModal from '../components/LeadModal'
import AutoFollowUpCard from '../components/AutoFollowUpCard'
import { ArrowLeft, Phone, Mail, Edit, Send } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'

const ACTIVITY_TYPES: TipoActividad[] = ['mensaje', 'llamada', 'email', 'nota', 'whatsapp']

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newActivity, setNewActivity] = useState('')
  const [activityType, setActivityType] = useState<TipoActividad>('nota')
  const [savingActivity, setSavingActivity] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [generatingAi, setGeneratingAi] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)

  const load = async () => {
    if (!id) return
    try {
      const [l, a] = await Promise.all([getLeadById(id), getActivitiesByLead(id)])
      setLead(l)
      setActivities(a)
    } catch {
      navigate('/leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const { user } = useAuth()

  const handleAddActivity = async () => {
    if (!id || !newActivity.trim()) return
    setSavingActivity(true)
    try {
      const a = await createActivity({ 
        lead_id: id, 
        user_id: user?.id,
        tipo: activityType, 
        descripcion: newActivity.trim(), 
        fecha: new Date().toISOString() 
      })
      setActivities(prev => [a, ...prev])
      setNewActivity('')
    } finally {
      setSavingActivity(false)
    }
  }

  const handleChangeEstado = async (estado: EstadoLead) => {
    if (!lead) return
    setLead(prev => prev ? { ...prev, estado } : null)
    await updateLead(lead.id, { estado })
  }

  const handleGenerateAiMessage = async () => {
    if (!lead) return
    setGeneratingAi(true)
    setShowAiPanel(true)
    // Simulate IA generation (would connect to n8n/OpenAI later)
    setTimeout(() => {
      const msg = `Hola ${lead.nombre.split(' ')[0]}, vi tu perfil como ${lead.cargo} en ${lead.empresa} y me pareció muy interesante lo que están haciendo en el sector industrial. En Tornillos AM nos especializamos en fijaciones de alta resistencia... ¿tendrás 5 min para platicar?`
      setAiMessage(msg)
      setGeneratingAi(false)
    }, 1500)
  }

  const handleSendWhatsApp = () => {
    if (!lead?.telefono) return
    const text = encodeURIComponent(`Hola ${lead.nombre}, te escribo de Tornillos AM para dar seguimiento a nuestra conversación en LinkedIn...`)
    window.open(`https://wa.me/${lead.telefono.replace(/\D/g, '')}?text=${text}`, '_blank')
  }

  if (loading) return (
    <div style={{ padding: 28 }}>
      <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
    </div>
  )

  if (!lead) return null

  const estado = ESTADOS.find(e => e.value === lead.estado)
  const initials = lead.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ padding: '16px 16px 32px', maxWidth: 900, margin: '0 auto' }}>
      {/* Back */}
      <Link to="/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, marginBottom: 16 }}>
        <ArrowLeft size={15} /> Volver a Leads
      </Link>

      {/* Lead Header Card */}
      <div className="glass-card" style={{ padding: '20px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: `linear-gradient(135deg, ${estado?.color}33, ${estado?.color}66)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 800, color: estado?.color, flexShrink: 0,
            }}>
              {initials}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F172A' }}>{lead.nombre}</h1>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{
                    background: estado?.bg, color: estado?.color,
                    borderRadius: 9999, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700
                  }}>
                    {estado?.label}
                  </span>
                  <span style={{
                    background: lead.prioridad === 'alta' ? '#FEF2F2' : lead.prioridad === 'media' ? '#FFFBEB' : '#ECFDF5',
                    color: lead.prioridad === 'alta' ? '#EF4444' : lead.prioridad === 'media' ? '#F59E0B' : '#10B981',
                    borderRadius: 9999, padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700
                  }}>
                    {lead.prioridad === 'alta' ? 'Alta' : lead.prioridad === 'media' ? 'Media' : 'Baja'}
                  </span>
                </div>
              </div>
              <div style={{ color: '#64748B', marginTop: 2, fontSize: '0.875rem', fontWeight: 500 }}>
                {lead.cargo}{lead.cargo && lead.empresa ? ' · ' : ''}{lead.empresa}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(true)}>
              <Edit size={16} /> <span className="desktop-only">Editar</span>
            </button>
            <button className="btn btn-primary" onClick={handleGenerateAiMessage} style={{ flex: 2, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
              ✨ <span className="desktop-only">IA Sugerir</span> Mensaje
            </button>
          </div>

          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
            <div style={{ display: 'flex', gap: 16, rowGap: 12, flexWrap: 'wrap' }}>
              {lead.linkedin_url && (
                <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0A66C2', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                  💼 LinkedIn
                </a>
              )}
              {lead.telefono && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <a href={`tel:${lead.telefono}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', textDecoration: 'none', fontSize: '0.85rem' }}>
                    <Phone size={15} /> {lead.telefono}
                  </a>
                  <button onClick={handleSendWhatsApp} 
                    style={{ background: '#25D366', color: 'white', border: 'none', padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                    WhatsApp
                  </button>
                </div>
              )}
              {lead.email && (
                <a href={`mailto:${lead.email}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', textDecoration: 'none', fontSize: '0.85rem' }}>
                  <Mail size={15} /> {lead.email}
                </a>
              )}
            </div>
          </div>
        </div>


        {/* Estado quick change */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: '0.73rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Mover en Pipeline
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ESTADOS.filter(e => e.value !== 'archivado').map(e => (
              <button
                key={e.value}
                onClick={() => handleChangeEstado(e.value as EstadoLead)}
                style={{
                  padding: '5px 14px', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 600,
                  border: `2px solid ${lead.estado === e.value ? e.color : 'transparent'}`,
                  background: lead.estado === e.value ? e.bg : '#F8FAFC',
                  color: lead.estado === e.value ? e.color : '#64748B',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        {lead.notas && (
          <div style={{
            marginTop: 16, padding: '12px 14px',
            background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10,
            fontSize: '0.85rem', color: '#92400E', lineHeight: 1.5,
          }}>
            📝 {lead.notas}
          </div>
        )}

        <div style={{ marginTop: 12, fontSize: '0.73rem', color: '#94A3B8' }}>
          Lead creado {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: es })}
          · Fuente: <strong>{lead.fuente}</strong>
        </div>

        {/* AI Message Panel */}
        {showAiPanel && (
          <div style={{
            marginTop: 20, padding: 20,
            background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
            border: '1px solid #C4B5FD', borderRadius: 16,
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#5B21B6', display: 'flex', alignItems: 'center', gap: 8 }}>
                ✨ Sugerencia de Mensaje IA
              </h3>
              <button onClick={() => setShowAiPanel(false)} style={{ background: 'none', border: 'none', color: '#7C3AED', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>
            {generatingAi ? (
              <div style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: 10, color: '#7C3AED', fontSize: '0.85rem' }}>
                <div className="skeleton" style={{ width: 20, height: 20, borderRadius: '50%' }} /> Generando propuesta personalizada...
              </div>
            ) : (
              <>
                <div style={{
                  background: 'white', padding: 16, borderRadius: 12, border: '1px solid #DDD6FE',
                  fontSize: '0.88rem', color: '#4C1D95', lineHeight: 1.6, marginBottom: 12
                }}>
                  {aiMessage}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn" 
                    onClick={() => { navigator.clipboard.writeText(aiMessage); alert('Copiado al portapapeles') }}
                    style={{ background: 'white', color: '#7C3AED', border: '1px solid #DDD6FE', fontSize: '0.8rem' }}>
                    📋 Copiar
                  </button>
                  <button className="btn"
                    onClick={handleSendWhatsApp}
                    style={{ background: '#25D366', color: 'white', fontSize: '0.8rem' }}>
                    📱 Enviar por WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <AutoFollowUpCard lead={lead} onUpdate={setLead} />

      {/* Activity Feed */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginBottom: 16 }}>Historial de Actividades</h2>

        {/* Add activity */}
        <div style={{
          display: 'flex', gap: 10, marginBottom: 20,
          padding: '14px', background: '#F8FAFC', borderRadius: 12, alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              {ACTIVITY_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setActivityType(t)}
                  style={{
                    padding: '4px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600,
                    border: '1px solid',
                    borderColor: activityType === t ? '#2563EB' : '#E2E8F0',
                    background: activityType === t ? '#EFF6FF' : 'white',
                    color: activityType === t ? '#2563EB' : '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  {ACTIVIDAD_ICONS[t]} {t}
                </button>
              ))}
            </div>
            <textarea
              className="input"
              value={newActivity}
              onChange={e => setNewActivity(e.target.value)}
              placeholder={`Registrar ${activityType}...`}
              rows={2}
              style={{ resize: 'none' }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddActivity() } }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddActivity} disabled={savingActivity || !newActivity.trim()} style={{ flexShrink: 0 }}>
            <Send size={14} />
          </button>
        </div>

        {/* Activities list */}
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#94A3B8', fontSize: '0.85rem' }}>
            Sin actividades registradas. ¡Agrega la primera! 👆
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activities.map((activity, i) => (
              <div key={activity.id} style={{
                display: 'flex', gap: 12, paddingBottom: 16,
                borderLeft: i < activities.length - 1 ? '2px solid #E2E8F0' : '2px solid transparent',
                marginLeft: 8, paddingLeft: 16, position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', left: -10, top: 0,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'white', border: '2px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem',
                }}>
                  {ACTIVIDAD_ICONS[activity.tipo]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#374151', textTransform: 'capitalize' }}>{activity.tipo}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      {format(new Date(activity.fecha), "d MMM yyyy 'a las' HH:mm", { locale: es })}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#4B5563', marginTop: 4, lineHeight: 1.5 }}>
                    {activity.descripcion}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <LeadModal
          lead={lead}
          onClose={() => setShowModal(false)}
          onSaved={updated => { setLead(updated); setShowModal(false) }}
        />
      )}
    </div>
  )
}
