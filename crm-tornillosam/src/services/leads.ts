import { supabase } from '../lib/supabase'
import type { Lead, Activity, EstadoLead } from '../types'

// --- LEADS ---
export async function getLeads(userId?: string) {
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Lead[]
}

export async function getLeadById(id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Lead
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single()
  if (error) throw error
  return data as Lead
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  // Trigger n8n webhook if automation is active or status moved to proposal
  if (updates.estado === 'propuesta' || updates.automation_enabled) {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead_update',
          lead: data,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Error triggering n8n:', err))
    }
  }

  return data as Lead
}

export async function updateLeadEstado(id: string, estado: EstadoLead) {
  return updateLead(id, { estado })
}

export async function deleteLead(id: string) {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}

// --- ACTIVITIES ---
export async function getActivitiesByLead(leadId: string) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('fecha', { ascending: false })
  if (error) throw error
  return data as Activity[]
}

export async function createActivity(activity: Omit<Activity, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single()
  if (error) throw error
  return data as Activity
}

// --- STATS ---
export async function getLeadStats() {
  const { data, error } = await supabase
    .from('leads')
    .select('estado, fuente, prioridad, created_at')
  if (error) throw error
  
  const leads = data || []
  const total = leads.length
  const thisWeek = leads.filter(l => {
    const d = new Date(l.created_at)
    const now = new Date()
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }).length

  return {
    total,
    thisWeek,
    conectados: leads.filter(l => l.estado === 'conectado').length,
    respondieron: leads.filter(l => l.estado === 'respondio').length,
    llamadas: leads.filter(l => l.estado === 'llamada').length,
    propuestas: leads.filter(l => l.estado === 'propuesta').length,
    clientes: leads.filter(l => l.estado === 'cliente').length,
    tasaRespuesta: total > 0
      ? Math.round((leads.filter(l => ['respondio','llamada','propuesta','cliente'].includes(l.estado)).length / total) * 100)
      : 0,
    tasaConversion: total > 0
      ? Math.round((leads.filter(l => l.estado === 'cliente').length / total) * 100)
      : 0,
  }
}
