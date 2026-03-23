import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLeads, getLeadStats } from '../services/leads'
import type { Lead } from '../types'
import { ESTADOS } from '../types'
import LeadModal from '../components/LeadModal'
import {
  Users, TrendingUp, PhoneCall, CheckCircle2,
  Plus, ArrowRight, AlertCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Stats {
  total: number; thisWeek: number; conectados: number; respondieron: number;
  llamadas: number; propuestas: number; clientes: number;
  tasaRespuesta: number; tasaConversion: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [urgentLeads, setUrgentLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const load = async () => {
    try {
      const [s, leads] = await Promise.all([getLeadStats(), getLeads()])
      setStats(s)
      setRecentLeads(leads.slice(0, 5))
      // Leads with alta priority not yet clients
      const urgent = leads.filter(l => l.prioridad === 'alta' && !['cliente', 'archivado'].includes(l.estado))
      setUrgentLeads(urgent.slice(0, 3))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const kpis = stats ? [
    { label: 'Total Leads', value: stats.total, icon: Users, color: '#2563EB', bg: '#EFF6FF', sub: `+${stats.thisWeek} esta semana` },
    { label: 'Tasa de Respuesta', value: `${stats.tasaRespuesta}%`, icon: TrendingUp, color: '#6366F1', bg: '#EEF2FF', sub: `${stats.respondieron} respondieron` },
    { label: 'En Llamada/Propuesta', value: stats.llamadas + stats.propuestas, icon: PhoneCall, color: '#F59E0B', bg: '#FFFBEB', sub: `${stats.llamadas} llamadas · ${stats.propuestas} propuestas` },
    { label: 'Clientes Cerrados', value: stats.clientes, icon: CheckCircle2, color: '#10B981', bg: '#ECFDF5', sub: `${stats.tasaConversion}% conversión` },
  ] : []

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0F172A' }}>
            Buenos días 👋
          </h1>
          <p style={{ color: '#64748B', marginTop: 4, fontSize: '0.9rem' }}>
            Aquí está el resumen de tu pipeline de ventas LinkedIn
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Nuevo Lead
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 16, 
        marginBottom: 28 
      }}>
        {loading
          ? Array(4).fill(0).map((_, i) => <div key={i} className="kpi-card skeleton" style={{ height: 100 }} />)
          : kpis.map(({ label, value, icon: Icon, color, bg, sub }) => (
            <div key={label} className="kpi-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500, marginBottom: 6 }}>{label}</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 6 }}>{sub}</p>
                </div>
                <div style={{ background: bg, borderRadius: 10, padding: 10 }}>
                  <Icon size={20} color={color} />
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 20 
      }}>
        {/* Leads urgentes */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} color="#EF4444" />
              <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Atención Urgente</h2>
            </div>
            <span style={{
              background: '#FEF2F2', color: '#EF4444',
              borderRadius: 9999, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700
            }}>Alta Prioridad</span>
          </div>
          {urgentLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
              ✅ Sin leads urgentes pendientes
            </div>
          ) : urgentLeads.map(lead => {
            const estado = ESTADOS.find(e => e.value === lead.estado)
            return (
              <Link key={lead.id} to={`/leads/${lead.id}`} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: '1px solid #F1F5F9', textDecoration: 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: `${estado?.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: estado?.color, flexShrink: 0,
                }}>
                  {lead.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>{lead.nombre}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{lead.empresa} · {lead.cargo}</div>
                </div>
                <span style={{
                  background: estado?.bg, color: estado?.color,
                  borderRadius: 9999, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600
                }}>
                  {estado?.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Leads recientes */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1rem' }}>💼</span>
              <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Leads Recientes</h2>
            </div>
            <Link to="/leads" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: '#2563EB', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none'
            }}>
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          {loading
            ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 8 }} />
            ))
            : recentLeads.map(lead => {
              const estado = ESTADOS.find(e => e.value === lead.estado)
              return (
                <Link key={lead.id} to={`/leads/${lead.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0', borderBottom: '1px solid #F1F5F9', textDecoration: 'none',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: `${estado?.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: estado?.color, flexShrink: 0,
                  }}>
                    {lead.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>{lead.nombre}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                      {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: es })}
                    </div>
                  </div>
                  <span style={{
                    background: estado?.bg, color: estado?.color,
                    borderRadius: 9999, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600
                  }}>
                    {estado?.label}
                  </span>
                </Link>
              )
            })
          }
        </div>
      </div>

      {/* Pipeline mini */}
      <div className="glass-card" style={{ padding: 20, marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Resumen del Pipeline</h2>
          <Link to="/pipeline" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#2563EB', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none'
          }}>
            Ver Pipeline <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden', height: 12 }}>
          {stats && ESTADOS.filter(e => e.value !== 'archivado').map(e => {
            const count = (() => {
              switch (e.value) {
                case 'conectado': return stats.conectados
                case 'respondio': return stats.respondieron
                case 'llamada': return stats.llamadas
                case 'propuesta': return stats.propuestas
                case 'cliente': return stats.clientes
                default: return 0
              }
            })()
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0
            return <div key={e.value} style={{ background: e.color, width: `${pct}%`, minWidth: pct > 0 ? 4 : 0, transition: 'width 0.4s ease' }} title={`${e.label}: ${count}`} />
          })}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
          {stats && ESTADOS.filter(e => e.value !== 'archivado').map(e => {
            const count = (() => {
              switch (e.value) {
                case 'conectado': return stats.conectados
                case 'respondio': return stats.respondieron
                case 'llamada': return stats.llamadas
                case 'propuesta': return stats.propuestas
                case 'cliente': return stats.clientes
                default: return 0
              }
            })()
            return (
              <div key={e.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color }} />
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{e.label}: <strong style={{ color: '#0F172A' }}>{count}</strong></span>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <LeadModal
          onClose={() => setShowModal(false)}
          onSaved={() => { load(); setShowModal(false) }}
        />
      )}
    </div>
  )
}
