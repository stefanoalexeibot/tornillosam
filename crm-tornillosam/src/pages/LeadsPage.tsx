import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLeads, deleteLead } from '../services/leads'
import type { Lead, EstadoLead } from '../types'
import { ESTADOS } from '../types'
import LeadModal from '../components/LeadModal'
import LeadsImporter from '../components/LeadsImporter'
import { Plus, Search, Trash2, Edit, ExternalLink, FileSpreadsheet } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const PRIORIDAD_COLORS: Record<string, { color: string; label: string }> = {
  alta: { color: '#EF4444', label: '🔴 Alta' },
  media: { color: '#F59E0B', label: '🟡 Media' },
  baja: { color: '#10B981', label: '🟢 Baja' },
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState<EstadoLead | ''>('')
  const [showModal, setShowModal] = useState(false)
  const [showImporter, setShowImporter] = useState(false)
  const [editLead, setEditLead] = useState<Lead | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await getLeads()
      setLeads(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = leads.filter(l => {
    const q = search.toLowerCase()
    const matchQ = !q || l.nombre.toLowerCase().includes(q) || (l.empresa ?? '').toLowerCase().includes(q) || (l.cargo ?? '').toLowerCase().includes(q)
    const matchE = !filterEstado || l.estado === filterEstado
    return matchQ && matchE
  })

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este lead?')) return
    setLeads(prev => prev.filter(l => l.id !== id))
    await deleteLead(id)
  }

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Leads</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 2 }}>{leads.length} leads en total</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => setShowImporter(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileSpreadsheet size={16} /> Importar CSV
          </button>
          <button className="btn btn-primary" onClick={() => { setEditLead(null); setShowModal(true) }}>
            <Plus size={16} /> Nuevo Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            placeholder="Buscar por nombre, empresa, cargo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input"
          style={{ width: 'auto', minWidth: 160 }}
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value as EstadoLead | '')}
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
      </div>

      {/* Table / Card List */}
      <div className="glass-card" style={{ overflow: 'hidden', border: 'none', background: 'transparent', boxShadow: 'none' }}>
        {/* Desktop Table View */}
        <div className="desktop-only glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Lead', 'Empresa', 'Estado', 'Fuente', 'Prioridad', 'Actualizado', 'Acciones'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '0.72rem', fontWeight: 700, color: '#64748B',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} style={{ padding: '10px 16px' }}>
                      <div className="skeleton" style={{ height: 40, borderRadius: 8 }} />
                    </td>
                  </tr>
                ))
                : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', color: '#94A3B8', fontSize: '0.9rem' }}>
                        No se encontraron leads
                      </td>
                    </tr>
                  )
                  : filtered.map(lead => {
                    const estado = ESTADOS.find(e => e.value === lead.estado)
                    const prio = PRIORIDAD_COLORS[lead.prioridad]
                    return (
                      <tr
                        key={lead.id}
                        style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: `${estado?.color}15`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', fontWeight: 700, color: estado?.color, flexShrink: 0,
                            }}>
                              {lead.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <Link to={`/leads/${lead.id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', textDecoration: 'none' }}>
                                {lead.nombre}
                              </Link>
                              {lead.cargo && <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{lead.cargo}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: '#334155' }}>{lead.empresa ?? '—'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: estado?.bg, color: estado?.color,
                            borderRadius: 99, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700
                          }}>
                            {estado?.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500, textTransform: 'capitalize' }}>
                            {lead.fuente === 'linkedin' ? '💼 LinkedIn' : lead.fuente}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: prio.color }}>{prio.label}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#94A3B8' }}>
                          {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true, locale: es })}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <Link to={`/leads/${lead.id}`}><ExternalLink size={16} color="#94A3B8" /></Link>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { setEditLead(lead); setShowModal(true) }}>
                              <Edit size={16} color="#94A3B8" />
                            </button>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(lead.id)}>
                              <Trash2 size={16} color="#EF4444" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(lead => {
            const estado = ESTADOS.find(e => e.value === lead.estado)
            const prio = PRIORIDAD_COLORS[lead.prioridad]
            return (
              <div key={lead.id} className="glass-card animate-slide-up" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: `${estado?.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 800, color: estado?.color
                    }}>
                      {lead.nombre[0].toUpperCase()}
                    </div>
                    <div>
                      <Link to={`/leads/${lead.id}`} style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', textDecoration: 'none', display: 'block' }}>
                        {lead.nombre}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{lead.empresa || 'Empresa no reg.'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: 'none', border: 'none' }} onClick={() => { setEditLead(lead); setShowModal(true) }}><Edit size={16} color="#94A3B8" /></button>
                    <button style={{ background: 'none', border: 'none' }} onClick={() => handleDelete(lead.id)}><Trash2 size={16} color="#EF4444" /></button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ background: estado?.bg, color: estado?.color, borderRadius: 8, padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700 }}>
                    {estado?.label}
                  </span>
                  <span style={{ border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: 8, fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                    {lead.fuente}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: prio.color, marginTop: 4 }}>{prio.label}</span>
                </div>
                
                <div style={{ marginTop: 12, borderTop: '1px solid #F1F5F9', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                    Actualizado {formatDistanceToNow(new Date(lead.updated_at), { locale: es })}
                  </div>
                  <Link to={`/leads/${lead.id}`} className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.7rem' }}>
                    Ver Detalle <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <LeadModal
          lead={editLead ?? undefined}
          onClose={() => { setShowModal(false); setEditLead(null) }}
          onSaved={saved => {
            setLeads(prev => {
              const exists = prev.find(l => l.id === saved.id)
              return exists ? prev.map(l => l.id === saved.id ? saved : l) : [saved, ...prev]
            })
            setShowModal(false)
          }}
        />
      )}

      {showImporter && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20
        }}>
          <LeadsImporter 
            onImportComplete={() => load()} 
            onClose={() => setShowImporter(false)} 
          />
        </div>
      )}
    </div>
  )
}
