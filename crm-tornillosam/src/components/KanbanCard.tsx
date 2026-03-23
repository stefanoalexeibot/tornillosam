import type { Lead } from '../types'
import { ESTADOS } from '../types'
import { Phone, Mail, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  lead: Lead
  onClick: (lead: Lead) => void
}

const PRIORIDAD_DOT: Record<string, string> = {
  alta: '#EF4444', media: '#F59E0B', baja: '#10B981'
}

export default function KanbanCard({ lead, onClick }: Props) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const estado = ESTADOS.find(e => e.value === lead.estado)
  const initials = lead.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const timeAgo = formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true, locale: es })

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="kanban-card"
      onClick={() => onClick(lead)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, minWidth: 36,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${estado?.color}33, ${estado?.color}66)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 700, color: estado?.color,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: PRIORIDAD_DOT[lead.prioridad],
              flexShrink: 0,
            }} />
            <span style={{
              fontWeight: 600, fontSize: '0.85rem', color: '#0F172A',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {lead.nombre}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 1 }}>
            {lead.cargo}{lead.cargo && lead.empresa ? ' · ' : ''}{lead.empresa}
          </div>
        </div>
      </div>

      {/* Notes preview */}
      {lead.notas && (
        <div style={{
          fontSize: '0.75rem', color: '#64748B',
          background: '#F8FAFC', borderRadius: 6, padding: '6px 8px',
          marginBottom: 8,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {lead.notas}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {lead.linkedin_url && (
            <a
              href={lead.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ color: '#0A66C2' }}
            >
              💼
            </a>
          )}
          {lead.telefono && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const text = encodeURIComponent(`Hola ${lead.nombre}, te escribo de Tornillos AM...`);
                window.open(`https://wa.me/${lead.telefono?.replace(/\D/g, '')}?text=${text}`, '_blank');
              }}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#25D366', display: 'flex', alignItems: 'center' }}
            >
              <Phone size={14} />
            </button>
          )}
          {lead.email && <Mail size={14} color="#64748B" />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: '#94A3B8' }}>
          <Clock size={11} />
          {timeAgo}
        </div>
      </div>
    </div>
  )
}
