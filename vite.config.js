import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    base: './',
    // server: {
    //     host: true,
    //     https: true,
    // },
    plugins: [tsconfigPaths()],
});
