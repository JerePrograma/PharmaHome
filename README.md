# PharmaHome (PWA mobile-first)

Aplicación web simple para control cotidiano de medicamentos desde celular, pensada para una persona no técnica.

## Stack
React  TypeScript  Vite
Tailwind CSS (mobile-first)
Persistencia local con IndexedDB (`idb`)
PWA con `manifest.webmanifest`  `service worker`
Sin backend, sin login, sin APIs externas

## Cómo levantar localmente
```bash
npm install
npm run dev
```
Abrir `http://localhost:5173`.

## Build producción
```bash
npm run build
npm run preview
```

## Testing
```bash
npm run test
```

## Deploy en GitHub Pages
Este repo ya incluye workflow en `.github/workflows/deploy-pages.yml`.

### Pasos
1. Subir el proyecto a GitHub.
2. Asegurar que la rama principal sea `main`.
3. En GitHub: **Settings → Pages → Build and deployment**.
4. En **Source**, elegir **GitHub Actions**.
5. Hacer push a `main` (o ejecutar el workflow manualmente desde **Actions**).

El workflow compila con una base automática del nombre del repositorio (`/${repo}/`) para que las rutas funcionen correctamente en Pages.

## Instalar como PWA en Android (Chrome)
1. Abrir la app desplegada por HTTPS.
2. Menú de Chrome (`⋮`) → **Instalar app** / **Agregar a pantalla principal**.
3. Confirmar instalación.
4. La app queda con icono propio y abre en modo app.

## Offline
Después de la primera carga, el service worker cachea recursos para uso básico offline.
Los datos se guardan en IndexedDB dentro del dispositivo.

## Funcionalidades incluidas
Listado tipo tarjetas.
Alta, edición, eliminación con confirmación.
Reordenamiento manual (subir/bajar).
Búsqueda por droga o marca.
Filtros rápidos:
  - todos
  - receta pendiente
  - receta utilizada
  - sin receta
  - cobertura próxima a vencer
  - vencidos
Vista detalle con explicación de cálculo.
Marcas alternativas múltiples.
Archivar/desactivar con campo `activo`.
Exportación a JSON y CSV.
Importación desde JSON (reemplaza datos).
Seed inicial con:
  - Lorazepam 2.5 mg x 100
  - DBI 500 mg x 100
  - T4 137 mcg x 50

## Cálculo de cobertura
Se calcula con:
comprimidos por caja
comprimidos por día (admite decimales)
fecha de inicio de caja actual
stock extra en cajas y/o sueltos (si existe)

Resultado mostrado:
fecha estimada de fin de cobertura
días restantes
detalle de cuenta en lenguaje simple

Si faltan datos o son inválidos, el sistema muestra “cálculo incompleto” y no inventa resultados.

## Estructura
```text
src/
  components/
  hooks/
  lib/
  pages/
  storage/
  test/
public/
  manifest.webmanifest
  sw.js
  icon-192.svg
  icon-512.svg
```

## Decisiones técnicas
**IndexedDB** en vez de localStorage para robustez y futura migración a backend.
Estado global liviano con Context  hooks (sin Redux para evitar sobreingeniería).
Router simple con 4 pantallas principales.
UI optimizada para uso táctil (botones/inputs grandes, contraste alto, textos claros).

## Limitaciones actuales (v1)
Reordenamiento por botones (no drag and drop).
Service worker simple (cache-first básico, sin estrategias avanzadas).
Sin sincronización entre dispositivos.

## Mejora futura sugerida
Opción Capacitor para empaquetar APK.
Notas de adherencia diaria.
Historial de cambios por medicamento.
Modo cuidador con recordatorios locales opcionales.
