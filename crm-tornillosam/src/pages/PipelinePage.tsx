import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { getLeads, updateLeadEstado } from '../services/leads'
import { supabase } from '../lib/supabase'
import type { Lead, EstadoLead } from '../types'
import { ESTADOS } from '../types'
import KanbanCard from '../components/KanbanCard'
import LeadModal from '../components/LeadModal'
import { Plus, RefreshCw } from 'lucide-react'

const PIPELINE_STAGES: EstadoLead[] = ['conectado', 'respondio', 'llamada', 'propuesta', 'cliente']

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
      className="stage-column"
      style={{
        background: isOver ? '#EFF6FF' : '#F8FAFC',
        borderColor: isOver ? '#93C5FD' : '#E2E8F0',
        padding: '0 0 12px',
      }}
    >
      {/* Column header */}
      <div style={{
        padding: '14px 14px 12px',
        borderBottom: '1px solid #E2E8F0',
        marginBottom: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: estado.color }} />
          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A' }}>{estado.label}</span>
        </div>
        <span style={{
          background: estado.bg, color: estado.color,
          borderRadius: '9999px', padding: '2px 8px',
          fontSize: '0.72rem', fontWeight: 700,
        }}>
          {leads.length}
        </span>
      </div>

      {/* Cards container with scroll */}
      <div style={{ 
        padding: '0 10px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8,
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        paddingBottom: 10
      }}>
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <KanbanCard key={lead.id} lead={lead} onClick={onLeadClick} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div style={{
            padding: '20px 12px', textAlign: 'center',
            color: '#CBD5E1', fontSize: '0.8rem',
            border: '2px dashed #E2E8F0', borderRadius: 10,
          }}>
            Sin leads
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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const load = async () => {
    try {
      setLoading(true)
      const data = await getLeads()
      setLeads(data.filter(l => l.estado !== 'archivado'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('pipeline-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        load()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const getByStage = (estado: EstadoLead) => leads.filter(l => l.estado === estado)
  const activeCard = activeId ? leads.find(l => l.id === activeId) : null

  const handleDragStart = (event: any) => setActiveId(String(event.active.id))

  const handleDragEnd = async (event: any) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return
    const lead = leads.find(l => l.id === active.id)
    const newEstado = over.id as EstadoLead
    if (!lead || lead.estado === newEstado || !PIPELINE_STAGES.includes(newEstado)) return
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, estado: newEstado } : l))
    try {
      await updateLeadEstado(lead.id, newEstado)
    } catch {
      // Revert
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, estado: lead.estado } : l))
    }
  }

  const handleLeadClick = (lead: Lead) => navigate(`/leads/${lead.id}`)

  return (
    <div style={{ padding: '28px 28px 0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>Pipeline de Ventas</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 2 }}>
            Arrastra las tarjetas para avanzar leads en el pipeline
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /> Actualizar</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Nuevo Lead</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 24 }}>
          {PIPELINE_STAGES.map(s => (
            <div key={s} className="stage-column skeleton" style={{ height: 400 }} />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 28, alignItems: 'flex-start' }}>
            {PIPELINE_STAGES.map(stage => {
              const estadoInfo = ESTADOS.find(e => e.value === stage)!
              return (
                <DroppableColumn
                  key={stage}
                  estado={estadoInfo}
                  leads={getByStage(stage)}
                  onLeadClick={handleLeadClick}
                />
              )
            })}
          </div>
          <DragOverlay>
            {activeCard && <KanbanCard lead={activeCard} onClick={() => {}} />}
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
