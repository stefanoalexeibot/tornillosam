import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react'

interface LeadsImporterProps {
  onImportComplete: () => void;
  onClose: () => void;
}

export default function LeadsImporter({ onImportComplete, onClose }: LeadsImporterProps) {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{ total: number; success: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Por favor selecciona un archivo CSV válido (exportado de Excel).')
    }
  }

  const handleImport = async () => {
    if (!file || !user) return
    setImporting(true)
    setError(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: Papa.ParseResult<any>) => {
        try {
          const leadsToInsert = results.data.map((row: any) => ({
            user_id: user.id,
            nombre: row.nombre || row.Nombre || row.name || 'Sin nombre',
            empresa: row.empresa || row.Empresa || row.company || 'Sin empresa',
            cargo: row.cargo || row.Cargo || row.position || '',
            email: row.email || row.Email || row.correo || '',
            telefono: row.telefono || row.Telefono || row.phone || '',
            linkedin_url: row.linkedin || row.LinkedIn || '',
            estado: 'conectado', // Default stage
            fuente: 'manual',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }))

          const { error: insertError } = await supabase.from('leads').insert(leadsToInsert)
          if (insertError) throw insertError

          setStats({ total: leadsToInsert.length, success: leadsToInsert.length })
          setTimeout(() => {
            onImportComplete()
            onClose()
          }, 2000)
        } catch (err: any) {
          setError('Error al insertar leads: ' + err.message)
        } finally {
          setImporting(false)
        }
      },
      error: (err: Error) => {
        setError('Error al procesar el archivo: ' + err.message)
        setImporting(false)
      }
    })
  }

  return (
    <div className="glass-card" style={{ 
      maxWidth: 500, width: '90%', margin: '0 auto', 
      padding: 32, position: 'relative',
      background: 'white', border: '1px solid #E2E8F0',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, color: '#94A3B8', border: 'none', background: 'none', cursor: 'pointer' }}>
        <X size={20} />
      </button>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ 
          width: 48, height: 48, background: '#EFF6FF', 
          color: '#2563EB', borderRadius: 12, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <FileSpreadsheet size={24} />
        </div>
        <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F172A' }}>Importar Leads desde Excel</h2>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 8 }}>
          Sube tu archivo .csv con columnas como "nombre", "empresa", "email", etc.
        </p>
      </div>

      {!stats ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              border: '2px dashed #E2E8F0', 
              borderRadius: 16, 
              padding: '40px 20px', 
              textAlign: 'center',
              cursor: 'pointer',
              background: file ? '#F8FAFC' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <Upload size={32} style={{ color: '#94A3B8', marginBottom: 12 }} />
            <div style={{ fontSize: '0.9rem', color: file ? '#0F172A' : '#64748B', fontWeight: file ? 600 : 400 }}>
              {file ? file.name : 'Haz clic para seleccionar o arrastra el archivo'}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv"
              style={{ display: 'none' }} 
            />
          </div>

          {error && (
            <div style={{ color: '#EF4444', fontSize: '0.8rem', display: 'flex', gap: 8, alignItems: 'center', background: '#FEF2F2', padding: 12, borderRadius: 8 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button 
            className="btn btn-primary" 
            disabled={!file || importing}
            onClick={handleImport}
            style={{ width: '100%', height: 48, marginTop: 8 }}
          >
            {importing ? (
              <><Loader2 size={18} className="animate-spin" /> Importando...</>
            ) : (
              'Comenzar Importación'
            )}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircle2 size={48} style={{ color: '#10B981', marginBottom: 16 }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>¡Importación Exitosa!</h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: 8 }}>
            Se han añadido <strong>{stats.success}</strong> nuevos leads a tu pipeline.
          </p>
        </div>
      )}
    </div>
  )
}
