# Estadísticas - Guía de Implementación

## 📊 Componente Creado

Se ha creado el componente `Estadisticas.tsx` que muestra 12 tipos diferentes de gráficos:

### Gráficos Implementados:

1. **Precipitación Total por Zona** - Gráfico de Barras
2. **Reportes por Instrumento** - Gráfico de Barras
3. **Top Sitios por Precipitación** - Gráfico de Barras Horizontal
4. **Distribución por Tipo de Precipitación** - Gráfico de Torta/Pastel
5. **Evolución Mensual por Tipo** - Gráfico Compuesto (Barras + Líneas + Áreas)
6. **Comparativa de Zonas en el Tiempo** - Gráfico de Líneas Múltiples
7. **Precipitación vs Coordenadas** - Gráfico de Dispersión (Scatter)
8. **Patrón Mensual** - Gráfico Radial/Radar
9. **Análisis de Frecuencia** - Histograma
10. **Comparativa Año a Año** - Gráfico de Áreas Apiladas

## 🎨 Características

- ✅ Diseño con Glassmorphism consistente con tu aplicación
- ✅ Todos los gráficos en una sola página
- ✅ Responsive y adaptable
- ✅ Esquema de colores coherente
- ✅ Loading states
- ✅ Tooltips informativos
- ✅ Leyendas claras

## 🔌 Conectar con Backend Real

### 1. Endpoints del Backend Necesarios

Crea estos endpoints en tu API (Laravel/Node.js):

```
GET /api/estadisticas/precipitacion-por-zona
GET /api/estadisticas/reportes-por-instrumento
GET /api/estadisticas/precipitacion-por-sitio?limit=10
GET /api/estadisticas/distribucion-instrumentos
GET /api/estadisticas/reportes-por-periodo
GET /api/estadisticas/evolucion-por-zona?zonaId={id}
GET /api/estadisticas/comparativa-sitios?sitioIds=1,2,3
GET /api/estadisticas/tendencia-caudal
GET /api/estadisticas/serie-por-tipo
GET /api/estadisticas/distribucion-por-tipo
GET /api/estadisticas/precipitacion-coordenadas
GET /api/estadisticas/patron-mensual
GET /api/estadisticas/analisis-frecuencia
GET /api/estadisticas/comparativa-anual
```

### 2. Formato de Respuesta Esperado

#### Precipitación por Zona
```json
[
  { "zona": "Norte", "precipitacion": 450 },
  { "zona": "Sur", "precipitacion": 620 }
]
```

#### Reportes por Instrumento
```json
[
  { "instrumento": "Pluviómetro", "cantidad": 245 },
  { "instrumento": "Caudalímetro", "cantidad": 180 }
]
```

#### Top Sitios
```json
[
  { "sitio": "Sitio A", "precipitacion": 750 },
  { "sitio": "Sitio B", "precipitacion": 680 }
]
```

#### Distribución por Tipo
```json
[
  { "tipo": "Lluvia", "cantidad": 320, "porcentaje": 61.5 },
  { "tipo": "Nieve", "cantidad": 125, "porcentaje": 24.0 }
]
```

#### Evolución Mensual
```json
[
  { "mes": "Ene", "lluvia": 45, "nieve": 85, "caudal": 120 },
  { "mes": "Feb", "lluvia": 52, "nieve": 78, "caudal": 115 }
]
```

#### Comparativa de Zonas
```json
[
  { "fecha": "Ene", "Norte": 120, "Sur": 145, "Este": 98 },
  { "fecha": "Feb", "Norte": 135, "Sur": 152, "Este": 105 }
]
```

#### Precipitación vs Coordenadas
```json
[
  { "x": -33.5, "y": -70.6, "precipitacion": 450, "sitio": "Sitio 1" },
  { "x": -33.3, "y": -70.8, "precipitacion": 520, "sitio": "Sitio 2" }
]
```

#### Patrón Mensual
```json
[
  { "mes": "Ene", "precipitacion": 85 },
  { "mes": "Feb", "precipitacion": 92 }
]
```

#### Análisis de Frecuencia
```json
[
  { "rango": "0-10", "frecuencia": 45 },
  { "rango": "10-20", "frecuencia": 78 }
]
```

#### Comparativa Anual
```json
[
  { "mes": "Ene", "2023": 120, "2024": 135, "2025": 145 },
  { "mes": "Feb", "2023": 115, "2024": 128, "2025": 140 }
]
```

### 3. Implementar Hooks Personalizados

Crea un hook para cada estadística en `src/hooks/`:

```typescript
// hooks/useEstadisticas.ts
import { useState, useEffect } from 'react';
import * as estadisticasService from '../services/estadisticasService';

export const useEstadisticas = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    precipitacionPorZona: [],
    reportesPorInstrumento: [],
    // ... más datos
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [zona, instrumento, sitios, ...rest] = await Promise.all([
          estadisticasService.getPrecipitacionPorZona(),
          estadisticasService.getReportesPorInstrumento(),
          estadisticasService.getPrecipitacionPorSitio(),
          // ... más llamadas
        ]);
        
        setData({
          precipitacionPorZona: zona,
          reportesPorInstrumento: instrumento,
          topSitios: sitios,
          // ... más datos
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { loading, error, data };
};
```

### 4. Actualizar el Componente

Reemplaza los datos de ejemplo por el hook:

```typescript
// En Estadisticas.tsx
import { useEstadisticas } from '../../hooks/useEstadisticas';

const Estadisticas = () => {
  const { loading, error, data } = useEstadisticas();

  if (error) return <ErrorComponent error={error} />;

  return (
    // ... usar data.precipitacionPorZona, data.reportesPorInstrumento, etc.
  );
};
```

## 🗄️ Queries SQL de Ejemplo (Backend)

### Precipitación por Zona
```sql
SELECT z.locality as zona, SUM(s.kPrecipitation) as precipitacion
FROM zona z
JOIN sitio s ON s.kZona = z.id
GROUP BY z.locality
ORDER BY precipitacion DESC;
```

### Reportes por Instrumento
```sql
SELECT i.type as instrumento, COUNT(r.id) as cantidad
FROM instrument i
LEFT JOIN report r ON r.kInstrument = i.id
GROUP BY i.type;
```

### Top Sitios
```sql
SELECT s.locality as sitio, SUM(s.kPrecipitation) as precipitacion
FROM sitio s
GROUP BY s.locality
ORDER BY precipitacion DESC
LIMIT 10;
```

### Evolución Mensual por Tipo
```sql
SELECT 
  DATE_FORMAT(r.date, '%b') as mes,
  SUM(CASE WHEN p.type = 'lluvia' THEN r.kPrecipitation ELSE 0 END) as lluvia,
  SUM(CASE WHEN p.type = 'nieve' THEN r.kPrecipitation ELSE 0 END) as nieve,
  SUM(CASE WHEN i.type = 'caudalimetro' THEN r.kPrecipitation ELSE 0 END) as caudal
FROM report r
JOIN precipitation p ON r.id = p.id
JOIN instrument i ON r.kInstrument = i.id
WHERE YEAR(r.date) = YEAR(CURDATE())
GROUP BY mes
ORDER BY MONTH(r.date);
```

## 🎯 Próximos Pasos

1. ✅ Componente creado con datos de ejemplo
2. ⏳ Crear endpoints en el backend
3. ⏳ Implementar hooks con llamadas reales
4. ⏳ Agregar manejo de errores
5. ⏳ Implementar filtros (por fecha, zona, etc.)
6. ⏳ Agregar exportación a PDF/Excel
7. ⏳ Agregar modo de comparación interactivo

## 📝 Notas

- Los datos actuales son de ejemplo para visualizar el diseño
- Los colores son consistentes con tu paleta de la app
- El componente es totalmente responsive
- Se incluye estado de loading para mejorar UX
