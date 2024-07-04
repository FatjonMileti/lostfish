import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build'
    },
    plugins: [react()],
    define: {
      'process.env': process.env
    },
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT) : 4000
    }
  };
});
