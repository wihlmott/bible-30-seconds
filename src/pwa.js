import { registerSW } from "virtual:pwa-register";
/* This runs once when the app loads.
 */
const updateSW = registerSW({
    immediate: true,

    /**
     * Called when a new version is available.
     * At this point, the app is still running the old version.
     */
    onNeedRefresh() {
        // You can swap this for a custom modal or toast later
        const shouldReload = window.confirm(
            "A new version of Bible 30 Seconds is available.\nReload now?",
        );

        if (shouldReload) {
            updateSW();
        }
    },

    /**
     * Called when the app is fully cached and ready to work offline.
     */
    onOfflineReady() {
        console.log("✅ Bible 30 Seconds is ready to work offline.");
    },
});

export default updateSW;

/**/
