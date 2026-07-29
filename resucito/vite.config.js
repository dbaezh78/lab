import { defineConfig } from 'vite';

export default defineConfig({
  // Fuerza a Vite a usar rutas relativas para activos importados en el index.html de producción,
  // permitiendo que el proyecto funcione en cualquier subcarpeta (ej: /lab/resucito/)
  base: './',
  server: {
    port: 5173,
    open: true
  }
});
