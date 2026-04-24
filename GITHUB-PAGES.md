# Deploy en github pages

1. En routes reemplazar BrowserRouter por HashRouter de react-router-dom, esto evita errores 404 al recargar rutas en GitHub Pages. ejemplo:
    ```tsx
    import { HashRouter } from "react-router-dom"
    import App from "./App"

    createRoot(document.getElementById("root")!).render(
      <HashRouter>
        <App />
      </HashRouter>
    )
    ```
2. Configurar vite.config.ts
    ```tsx
    export default defineConfig({
      ...
      base: "/<NOMBRE-REPORSITORIO>/", // <--- tu nombre de repo
      // ejemplo: base: "/diplomado-react/",
      ...
    })

    ```
3. Configurar las variables de entorno con VITE_

4. Instalar gh-pages y configurar el script de despliegue en package.json
    ```bash
    npm install gh-pages --save-dev
    ```
    >Permite subir automáticamente tu carpeta dist/ a la rama gh-pages.

    ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "deploy": "gh-pages -d dist"
    }
    ```
5. Ejecutar npm run build y luego deploy
    > build → genera la carpeta dist/
    > deploy → sube dist/ a la rama gh-page

    ```bash
    npm run build

    npm run deploy
    ```

6. Configuración en GitHub:
   1. Entrá a tu repositorio en GitHub.
   2. Andá a Settings → Pages.
   3. En Source:
   4. Deploy from a branch
   5. Branch: gh-pages
   6. Carpeta: / (root)
   7. Guardá los cambios.
