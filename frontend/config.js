/**
 * DishDiary - Central API & Environment Configuration
 * 
 * Automatically selects the appropriate backend API URL:
 * - Localhost Mode: http://localhost:5942/api/v1
 * - Production Mode: http://92.112.192.226:5942/api/v1
 * 
 * Auto-detection Rule:
 * When loaded on localhost or 127.0.0.1 -> uses Local URL.
 * When loaded from GitHub Pages, Vercel, or live VPS -> uses Production URL.
 */

(function () {
  const LOCAL_API = "http://localhost:5942/api/v1";
  const PROD_API = "https://api-dishdiary.hamim.dpdns.org/api/v1";

  // Check if current browser hostname is local
  const isLocalHost = Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "" || // file:// protocol
    window.location.hostname === "[::1]"
  );

  // Allow manual override from localStorage if desired
  const manualOverride = localStorage.getItem("dishdiary_api_url");

  // Determine active API base URL
  let resolvedApi = manualOverride;
  if (!resolvedApi) {
    resolvedApi = isLocalHost ? LOCAL_API : PROD_API;
  }

  // Ensure no trailing slash
  if (resolvedApi.endsWith("/")) {
    resolvedApi = resolvedApi.slice(0, -1);
  }

  window.API_CONFIG = {
    LOCAL_API,
    PROD_API,
    isLocal: isLocalHost,
    activeUrl: resolvedApi,
    
    // Switch between modes anytime from browser console or settings:
    // setMode("local"), setMode("prod"), or setMode("auto")
    setMode(mode) {
      if (mode === "prod") {
        localStorage.setItem("dishdiary_api_url", PROD_API);
        console.log(`[API Config] Switched manually to PRODUCTION: ${PROD_API}`);
      } else if (mode === "local") {
        localStorage.setItem("dishdiary_api_url", LOCAL_API);
        console.log(`[API Config] Switched manually to LOCAL: ${LOCAL_API}`);
      } else {
        localStorage.removeItem("dishdiary_api_url");
        console.log("[API Config] Reset to AUTO environment detection.");
      }
      window.location.reload();
    }
  };

  // Global API base variable used across all frontend scripts
  window.API_BASE = resolvedApi;

  console.info(
    `%c[DishDiary API]%c Connected to: ${window.API_BASE} (${isLocalHost ? "Localhost" : "Production VPS"})`,
    "background: #ea580c; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;",
    "color: #ea580c; font-weight: bold;"
  );
})();
