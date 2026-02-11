export const PRODUCT_CATEGORIES = [
  // Abarrotes
  'Abarrotes',
  'Bebidas',
  'Lácteos',
  'Panadería',
  'Carnes y Embutidos',
  'Frutas y Verduras',
  'Congelados',
  'Snacks y Botanas',
  'Cereales y Granos',
  'Enlatados y Conservas',
  'Condimentos y Especias',
  'Aceites y Vinagres',
  'Dulces y Chocolates',
  
  // Farmacia
  'Medicamentos',
  'Vitaminas y Suplementos',
  'Cuidado Personal',
  'Higiene Bucal',
  'Cuidado de la Piel',
  'Primeros Auxilios',
  'Productos para Bebé',
  'Cuidado del Cabello',
  
  // Ferretería
  'Herramientas Manuales',
  'Herramientas Eléctricas',
  'Pinturas y Barnices',
  'Plomería',
  'Electricidad',
  'Tornillería',
  'Adhesivos y Selladores',
  'Materiales de Construcción',
  'Jardinería',
  'Cerrajería',
  
  // Limpieza
  'Limpieza del Hogar',
  'Detergentes y Jabones',
  'Desinfectantes',
  'Artículos de Limpieza',
  
  // Papelería
  'Papelería',
  'Útiles Escolares',
  'Oficina',
  
  // Electrónica
  'Electrónica',
  'Accesorios Electrónicos',
  'Telefonía',
  
  // Hogar
  'Hogar y Decoración',
  'Cocina',
  'Textiles',
  'Muebles',
  
  // Ropa y Calzado
  'Ropa',
  'Calzado',
  'Accesorios de Moda',
  
  // Deportes
  'Deportes',
  'Fitness',
  
  // Mascotas
  'Alimento para Mascotas',
  'Accesorios para Mascotas',
  
  // Juguetería
  'Juguetes',
  'Juegos de Mesa',
  
  // Automotriz
  'Automotriz',
  'Accesorios para Auto',
  
  // Otros
  'Otros',
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]
