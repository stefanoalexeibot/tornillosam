export interface Product {
  id: string;
  name: string;
  category: string;
  material: string;
  grade: string;
  finish: string;
  sku: string;
  image?: string;
  price?: number;
  currency?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Tornillo Hexagonal G5",
    category: "Tornillería",
    material: "Acero al Carbón",
    grade: "Grado 5",
    finish: "Zincado",
    sku: "THG5-1420-1",
  },
  {
    id: "2",
    name: "Birlo Automotriz High Stress",
    category: "Birlos",
    material: "Acero Aleado",
    grade: "Grado 8",
    finish: "Pavonado",
    sku: "BAHS-M12-15",
  },
  {
    id: "3",
    name: "Tuerca de Seguridad (Nyloc)",
    category: "Tuercas",
    material: "Acero Inoxidable",
    grade: "304",
    finish: "Natural",
    sku: "TSN-SS-304",
  },
  {
    id: "4",
    name: "Pija Autoperforante Punta de Broca",
    category: "Pijas",
    material: "Acero",
    grade: "Estándar",
    finish: "Galvanizado",
    sku: "PAB-8x1-G",
  },
  {
    id: "5",
    name: "Varilla Roscada 1 Metro",
    category: "Varillas",
    material: "Acero B7",
    grade: "B7",
    finish: "Negro",
    sku: "VRB7-58-1M",
  },
  {
    id: "6",
    name: "Grapa Plástica Automotriz",
    category: "Automotriz",
    material: "Nylon",
    grade: "Premium",
    finish: "Negro",
    sku: "GPA-UNI-01",
  },
];
