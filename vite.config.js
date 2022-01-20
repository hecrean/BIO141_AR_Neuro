import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    server: {
        // host: true,
        // https: true
    },
    plugins: [mkcert(), tsconfigPaths()],
});
