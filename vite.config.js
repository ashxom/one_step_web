import { defineConfig } from 'vite'

// GitHub Pages project sites are served below /<repository-name>/.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/one_step_web/' : '/',
})
