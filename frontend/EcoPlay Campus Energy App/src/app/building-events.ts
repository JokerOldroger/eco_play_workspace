export const BUILDINGS_UPDATED_EVENT = 'ecoplay:buildings-updated';

export function emitBuildingsUpdated() {
  window.dispatchEvent(new Event(BUILDINGS_UPDATED_EVENT));
}
