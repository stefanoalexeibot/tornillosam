export type EstadoLead = 'conectado' | 'respondio' | 'llamada' | 'propuesta' | 'cliente' | 'archivado'
export type FuenteLead = 'linkedin' | 'referido' | 'manual' | 'webhook'
export type PrioridadLead = 'alta' | 'media' | 'baja'
export type TipoActividad = 'mensaje' | 'llamada' | 'email' | 'nota' | 'whatsapp'

export interface Lead {
  id: string
  user_id?: string
  nombre: string
  empresa?: string
  cargo?: string
  linkedin_url?: string
  telefono?: string
  email?: string
  estado: EstadoLead
  fuente: FuenteLead
  notas?: string
  avatar_url?: string
  prioridad: PrioridadLead
  automation_enabled?: boolean
  last_followup_at?: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  lead_id: string
  user_id?: string
  tipo: TipoActividad
  descripcion: string
  fecha: string
  created_at: string
}

export interface PipelineStage {
  id: string
  nombre: string
  orden: number
  color: string
}

export const ESTADOS: { value: EstadoLead; label: string; color: string; bg: string }[] = [
  { value: 'conectado', label: 'Conectado', color: '#6366F1', bg: '#EEF2FF' },
  { value: 'respondio', label: 'Respondió', color: '#3B82F6', bg: '#EFF6FF' },
  { value: 'llamada', label: 'Llamada', color: '#F59E0B', bg: '#FFFBEB' },
  { value: 'propuesta', label: 'Propuesta', color: '#8B5CF6', bg: '#F5F3FF' },
  { value: 'cliente', label: 'Cliente', color: '#10B981', bg: '#ECFDF5' },
  { value: 'archivado', label: 'Archivado', color: '#94A3B8', bg: '#F8FAFC' },
]

export const ACTIVIDAD_ICONS: Record<TipoActividad, string> = {
  mensaje: '💬',
  llamada: '📞',
  email: '📧',
  nota: '📝',
  whatsapp: '📱',
}
