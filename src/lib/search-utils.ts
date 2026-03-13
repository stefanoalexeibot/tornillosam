/**
 * Utilidades para búsqueda inteligente en el catálogo de Tornillos AM.
 * Implementa expansión de sinónimos y lógica multitérrmino (AND).
 */

const SYNONYMS: Record<string, string[]> = {
  hex: ["hexagonal", "hex"],
  hexagonal: ["hexagonal", "hex"],
  hexagonales: ["hexagonal", "hex"],
  skt: ["socket", "skt"],
  socket: ["socket", "skt"],
  inox: ["inoxidable", "inox"],
  inoxidable: ["inoxidable", "inox"],
  galv: ["galvanizado", "galv"],
  galvanizado: ["galvanizado", "galv"],
  zinc: ["zincado", "zinc"],
  zincado: ["zincado", "zinc"],
  neg: ["negro", "neg"],
  pija: ["pija", "pijas"],
  pijas: ["pija", "pijas"],
  tornillo: ["tornillo", "tornillos"],
  tornillos: ["tornillo", "tornillos"],
  rondana: ["rondana", "rondanas"],
  rondanas: ["rondana", "rondanas"],
  tuerca: ["tuerca", "tuercas"],
  tuercas: ["tuerca", "tuercas"],
  grado: ["grado", "grados"],
  grados: ["grado", "grados"],
};

/**
 * Expande un término de búsqueda basándose en sinónimos conocidos.
 * Retorna una expresión OR para PostgREST.
 * Ejemplo: "hex" -> "name.ilike.%hexagonal%,name.ilike.%hex%,sku.ilike.%hexagonal%,sku.ilike.%hex%"
 */
function expandTermToPostgrestFilter(term: string): string {
  const normalized = term.toLowerCase().trim();
  const forms = SYNONYMS[normalized] || [normalized];
  
  // Creamos condiciones OR para nombre y SKU con cada forma (sinónimo)
  const conditions = forms.flatMap(f => [
    `name.ilike.%${f}%`,
    `sku.ilike.%${f}%`
  ]);
  
  return conditions.join(",");
}

/**
 * Aplica búsqueda inteligente a una query de Supabase.
 * Divide la búsqueda por espacios (AND logic) y expande cada término.
 */
export function applySmartSearch(query: any, searchTerm: string) {
  if (!searchTerm || !searchTerm.trim()) return query;

  // Dividimos por espacios para obtener términos individuales (Lógica AND)
  // Filtramos términos vacíos o muy cortos (opcional, aquí mantenemos todos >1 char)
  const terms = searchTerm
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  let currentQuery = query;

  // Aplicamos cada término como un filtro .or()
  // En Supabase/PostgREST, encadenar .or() actúa como un AND entre ellos.
  terms.forEach(term => {
    currentQuery = currentQuery.or(expandTermToPostgrestFilter(term));
  });

  return currentQuery;
}
