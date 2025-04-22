import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import * as cartographer from '@replit/vite-plugin-cartographer';
import * as shadcnThemeJson from '@replit/vite-plugin-shadcn-theme-json';

export default defineConfig({
  plugins: [react(), cartographer(), shadcnThemeJson()],
  build: {
    outDir: 'client/dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@assets': path.resolve(__dirname, './attached_assets'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
});