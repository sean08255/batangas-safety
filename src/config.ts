// Settings you may need to change.
// ALERTS_URL is the address of the alerts backend (the /alerts part is not needed).
// Leave it empty until the backend is deployed; the app then shows "unable to check alerts".
export const ALERTS_URL: string = 'https://batangas-alerts.bsafe-ph-7421.workers.dev';

// Alert data older than this is treated as unavailable (never shown as current).
export const MAX_ALERT_AGE_MINUTES = 60;
