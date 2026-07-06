/**
 * Session ID utility for tracking learner progress without requiring login.
 *
 * Generates a UUID on first load, stores it in localStorage under 'waf-app-session-id',
 * and reuses it for all attempt submissions and progress fetches.
 *
 * NOTE: This ties progress to the browser, not a real account.
 * Swapping in real auth later is a drop-in replacement since sessionId is just a string.
 */

const STORAGE_KEY = 'waf-app-session-id';

export function getSessionId(): string {
  let sessionId = localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
}