import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, KeyboardSensor
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { getLeads, updateLeadEstado } from '../services/leads'
import { supabase } from '../lib/supabase'
import type { Lead, EstadoLead } from '../types'
import { ESTADOS } from '../types'
import KanbanCard from '../components/KanbanCard'
import LeadModal from '../components/LeadModal'
import { Plus, RefreshCw, Layers } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function DroppableColumn({
  estado, leads, onLeadClick
}: {
  estado: typeof ESTADOS[0]
  leads: Lead[]
  onLeadClick: (l: Lead) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: estado.value })
  
  return (
    <div
      ref={setNodeRef}
      className={`stage-column ${isOver ? 'drop-indicator' : ''}`}
      style={{
        padding: '0 0 12px',
        transition: 'all 0.3s ease',
        border: isOver ? '2px dashed var(--primary)' : '1px solid var(--border)'
      }}
    >
      {/* Column header */}
      <div style={{
        padding: '16px 18px 14px',
        borderBottom: '1px solid var(--border)',
        marginBottom: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: estado.color }} />
          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', letterSpacing: '-0.01em' }}>{estado.label}</span>
        </div>
        <span style={{
          background: `${estado.color}15`, color: estado.color,
          borderRadius: 10, padding: '2px 8px',
          fontSize: '0.75rem', fontWeight: 800,
        }}>
          {leads.length}
        </span>
      </div>

      {/* Cards container with scroll */}
      <div style={{ 
        padding: '4px 12px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 12,
        maxHeight: 'calc(100vh - 220px)',
        overflowY: 'auto',
        paddingBottom: 20
      }}>
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <KanbanCard key={lead.id} lead={lead} onClick={onLeadClick} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div style={{
            padding: '32px 16px', textAlign: 'center',
            color: '#94A3B8', fontSize: '0.85rem',
            border: '2px dashed #E2E8F0', borderRadius: 20,
            background: 'rgba(255,255,255,0.2)'
          }}>
            Arrastra aquí
          </div>
        )}
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const load = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await getLeads()
      setLeads(data.filter(l => l.estado !== 'archivado'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) load()
    
    const channel = supabase
      .channel(`pipeline-leads-${user?.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'leads',
        filter: user ? `user_id=eq.${user.id}` : undefined
      }, () => load())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  const getByStage = (estado: EstadoLead) => leads.filter(l => l.estado === estado)
  const activeCard = activeId ? leads.find(l => l.id === activeId) : null

  const handleDragStart = (event: any) => setActiveId(String(event.active.id))

  const handleDragEnd = async (event: any) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return
    const lead = leads.find(l => l.id === active.id)
    const newEstado = over.id as EstadoLead
    if (!lead || lead.estado === newEstado) return
    
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, estado: newEstado } : l))
    try {
      await updateLeadEstado(lead.id, newEstado)
    } catch {
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, estado: lead.estado } : l))
    }
  }

  const handleLeadClick = (lead: Lead) => navigate(`/leads/${lead.id}`)

  return (
    <div style={{ padding: '24px 24px 80px', minHeight: '100vh', maxWidth: 1600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }} className="animate-premium">
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.7rem', color: '#0F172A', letterSpacing: '-0.03em' }}>Flujo de Ventas</h1>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: 4 }}>
            Organiza y gestiona tus oportunidades de negocio.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }} className="desktop-only">
          <button className="btn btn-ghost" onClick={load} style={{ borderRadius: 16 }}><RefreshCw size={16} /> Refrescar</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ borderRadius: 16 }}><Plus size={18} /> Nuevo Lead</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 24 }}>
          {ESTADOS.filter(e => e.value !== 'archivado').map(s => (
            <div key={s.value} className="stage-column skeleton" style={{ height: 500, minWidth: 320, borderRadius: 28 }} />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={{ 
            display: 'flex', 
            gap: 24, 
            overflowX: 'auto', 
            paddingBottom: 40, 
            alignItems: 'flex-start',
            scrollSnapType: 'x mandatory',
            padding: '0 4px',
            minHeight: 'calc(100vh - 250px)'
          }}>
            {ESTADOS.filter(e => e.value !== 'archivado').map(stage => (
              <DroppableColumn
                key={stage.value}
                estado={stage}
                leads={getByStage(stage.value as EstadoLead)}
                onLeadClick={handleLeadClick}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {activeCard ? (
              <div className="drag-shadow" style={{ cursor: 'grabbing' }}>
                <KanbanCard lead={activeCard} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {showModal && (
        <LeadModal
          onClose={() => setShowModal(false)}
          onSaved={newLead => {
            setLeads(prev => [newLead, ...prev])
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}
