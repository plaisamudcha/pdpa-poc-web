import { AliasOptions, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

const root = path.resolve(__dirname, 'src');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_APP_BASE_NAME || '/',

    plugins: [react(), viteTsconfigPaths()],

    resolve: {
      alias: {
        '@': root
      } as AliasOptions
    },

    server: {
      strictPort: true,
      open: false,
      port: Number(env.VITE_APP_PORT || 5173)
    },

    build: {
      target: 'esnext',
      sourcemap: false
    }
  };
});
