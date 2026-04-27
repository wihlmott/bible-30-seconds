import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),

        VitePWA({
            registerType: "prompt",
            includeAssets: ["favicon.svg"],
            manifest: {
                name: "Bible 30 Seconds",
                short_name: "Bible30",
                description: "Offline Bible Taboo style game",
                theme_color: "#111111",
                background_color: "#111111",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "/pwa.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/pwa.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/pwa.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
            workbox: {
                cleanupOutdatedCaches: true,
                clientsClaim: true,
            },
        }),
    ],
});
