import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';


export default defineConfig({
  plugins: [react()],
  server: {
    port: 8001
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'assets': path.resolve(__dirname, './src/assets'),
      'components': path.resolve(__dirname, './src/components'),
      'constants': path.resolve(__dirname, './src/constants'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'lib': path.resolve(__dirname, './src/lib'),
      'pages': path.resolve(__dirname, './src/pages'),
      'router': path.resolve(__dirname, './src/router'),
      'services': path.resolve(__dirname, './src/services'),
      'types': path.resolve(__dirname, './src/types'),
      'contexts': path.resolve(__dirname, './src/contexts'),
      'models': path.resolve(__dirname, './src/models')
    }
  }
})