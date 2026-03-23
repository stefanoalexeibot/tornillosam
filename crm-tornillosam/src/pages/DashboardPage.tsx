import { useState, useEffect } from 'react'
import { getLeads, getLeadStats } from '../services/leads'
import type { Lead } from '../types'
import { ESTADOS } from '../types'
import { Users, Target, CheckCircle, TrendingUp, Clock, ArrowRight, Plus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Link } from 'react-router-dom'
import LeadModal from '../components/LeadModal'

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const loadData = async () => {
    try {
      const [allLeads, s] = await Promise.all([getLeads(), getLeadStats()])
      setLeads(allLeads)
      setStats(s)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const kpis = [
    { label: 'Total Leads', value: stats?.total || 0, color: '#3B82F6', icon: <Users size={20} /> },
    { label: 'En Proceso', value: (stats?.total || 0) - (stats?.clientes || 0), color: '#6366F1', icon: <Target size={20} /> },
    { label: 'Clientes', value: stats?.clientes || 0, color: '#10B981', icon: <CheckCircle size={20} /> },
    { label: 'Conversión', value: `${stats?.tasaConversion || 0}%`, color: '#8B5CF6', icon: <TrendingUp size={20} /> },
  ]

  const chartData = ESTADOS.filter(e => e.value !== 'archivado').map(e => {
    const count = leads.filter(l => l.estado === e.value).length
    return {
      name: e.label,
      count: count,
      color: e.color
    }
  })

  if (loading) return (
    <div style={{ padding: 28 }}>
      <div className="skeleton" style={{ height: 160, borderRadius: 28, marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        <div className="skeleton" style={{ height: 400, borderRadius: 28 }} />
        <div className="skeleton" style={{ height: 400, borderRadius: 28 }} />
      </div>
    </div>
  )

  return (
    <div style={{ padding: '24px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="animate-premium">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>
            Panel de Control
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: 4 }}>
            Bienvenido. Esto es lo que está pasando en tu embudo hoy.
          </p>
        </div>
        <button 
          className="btn btn-primary desktop-only" 
          onClick={() => setShowModal(true)}
          style={{ padding: '12px 24px', borderRadius: 16 }}
        >
          <Plus size={18} /> Nuevo Lead
        </button>
      </header>
      
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: 20,
        marginBottom: 32 
      }}>
        {kpis.map((s, i) => (
          <div key={s.label} className="glass-card animate-premium" style={{ 
            padding: 24, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 16,
            animationDelay: `${i * 0.1}s` 
          }}>
            <div style={{ 
              width: 44, height: 44, borderRadius: 14, 
              background: `${s.color}12`, color: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: 24 
      }}>
        {/* Distribution Chart */}
        <div className="glass-card animate-premium" style={{ padding: 28, animationDelay: '0.4s' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Flujo del Pipeline</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Cantidad de leads por cada etapa del embudo.</p>
          </div>
          <div style={{ height: 320, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC', radius: 8 }}
                  contentStyle={{ 
                    borderRadius: 16, 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                    fontSize: '0.85rem',
                    padding: '12px 16px'
                  }} 
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={45}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card animate-premium" style={{ padding: 28, animationDelay: '0.5s' }}>
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Actividad Reciente</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Últimos leads que han entrado al sistema.</p>
            </div>
            <Link to="/leads" style={{ color: '#2563EB', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700 }}>Ver todos</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {leads.slice(0, 5).map((lead) => (
              <Link key={lead.id} to={`/leads/${lead.id}`} style={{ 
                padding: '14px 16px', borderRadius: 18, background: '#F8FAFC', 
                display: 'flex', alignItems: 'center', gap: 14,
                border: '1px solid #F1F5F9', textDecoration: 'none',
                transition: 'all 0.2s ease'
              }} className="hover:scale-[1.01]">
                <div style={{ 
                  width: 36, height: 36, borderRadius: 12, 
                  background: `${ESTADOS.find(e => e.value === lead.estado)?.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: ESTADOS.find(e => e.value === lead.estado)?.color,
                  fontSize: '0.75rem'
                }}>
                  {lead.nombre[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.nombre}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {lead.empresa || 'Sin empresa'}
                  </div>
                </div>
                <ArrowRight size={16} color="#CBD5E1" />
              </Link>
            ))}
            {leads.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Clock size={40} color="#E2E8F0" style={{ marginBottom: 12 }} />
                <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>No hay leads aún.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <LeadModal
          onClose={() => setShowModal(false)}
          onSaved={() => { loadData(); setShowModal(false) }}
        />
      )}
    </div>
  )
}
