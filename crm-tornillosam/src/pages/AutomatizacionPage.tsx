export default function AutomatizacionPage() {
  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A', marginBottom: 8 }}>Automatización</h1>
      <p style={{ color: '#64748B', marginBottom: 28 }}>Conecta tus herramientas para automatizar el pipeline de Maquinados CNC</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {[
          {
            title: '🔗 Webhook de n8n',
            desc: 'Recibe leads automáticamente desde Phantombuster cuando alguien acepta tu conexión en LinkedIn.',
            status: 'Configurable',
            statusColor: '#F59E0B',
            action: 'Configurar',
            url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/receive-lead`,
          },
          {
            title: '📱 WhatsApp Notificaciones',
            desc: 'Recibe una alerta en WhatsApp cuando un lead responde o necesita seguimiento.',
            status: 'Disponible vía n8n',
            statusColor: '#10B981',
            action: 'Ver guía',
            url: 'https://n8n.io',
          },
          {
            title: '💼 LinkedIn Sales Navigator',
            desc: 'Exporta prospectos de LinkedIn y cárgalos automáticamente a tu pipeline con Phantombuster.',
            status: 'Requiere Phantombuster',
            statusColor: '#6366F1',
            action: 'Ver guía',
            url: 'https://phantombuster.com',
          },
          {
            title: '🤖 GPT-4 Mensajes',
            desc: 'Genera mensajes personalizados para cada lead basados en su perfil y empresa.',
            status: 'Vía OpenAI + n8n',
            statusColor: '#10B981',
            action: 'Ver guía',
            url: 'https://openai.com',
          },
          {
            title: '📧 Seguimiento Automático',
            desc: 'Envía correos de seguimiento cada 3, 7 y 15 días después de enviar una propuesta.',
            status: 'Configurable vía n8n',
            statusColor: '#3B82F6',
            action: 'Configurar',
            url: 'https://n8n.io',
          },
        ].map(item => (
          <div key={item.title} className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 10 }}>{item.title.split(' ')[0]}</div>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginBottom: 8 }}>
              {item.title.split(' ').slice(1).join(' ')}
            </h3>
            <p style={{ fontSize: '0.83rem', color: '#64748B', lineHeight: 1.6, marginBottom: 14 }}>{item.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: item.statusColor }}>● {item.status}</span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                {item.action}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: 20, background: '#EFF6FF', borderRadius: 16, border: '1px solid #BFDBFE' }}>
        <h3 style={{ fontWeight: 700, color: '#1E40AF', marginBottom: 8 }}>🚀 Flujo de Automatización Completo</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: '0.85rem', color: '#1D4ED8' }}>
          {['LinkedIn Sales Nav', '→', 'Phantombuster', '→', 'n8n Webhook', '→', 'CRM (aquí)', '→', 'GPT-4 Mensaje', '→', 'WhatsApp Alerta'].map((item, i) => (
            <span key={i} style={{ fontWeight: item === '→' ? 400 : 600 }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
