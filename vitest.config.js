import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    env: { VITE_API_URL: 'http://api.test' },
    include: ['tests/**/*.test.{js,jsx}'],
    maxWorkers: 1,
    pool: 'threads',
  },
}));
