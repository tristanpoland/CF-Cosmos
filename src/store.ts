// store.ts
import { writable } from 'svelte/store';
import type { CFApp, CFEvent, CFStats, MemoryData, InstanceData } from './types';
import { generateMockData } from './mockdata';

export const loading = writable(true);
export const error = writable<string | null>(null);
export const recentApps = writable<CFApp[]>([]);
export const events = writable<CFEvent[]>([]);
export const stats = writable<CFStats>({
    apps: { total: 0, running: 0, crashed: 0 },
    services: { total: 0, bound: 0 },
    memory: { used_gb: 0, total_gb: 100, used_percentage: 0 },
    instances: { total: 0, running: 0, crashed: 0 }
});
export const memoryHistory = writable<MemoryData[]>([]);
export const instanceHistory = writable<InstanceData[]>([]);

export async function loadDashboardData() {
    try {
        loading.set(true);
        const mockData = generateMockData();
        
        recentApps.set(mockData.apps);
        events.set(mockData.events);
        stats.set(mockData.stats);
        memoryHistory.set(mockData.memoryHistory);
        instanceHistory.set(mockData.instanceHistory);
        
        error.set(null);
    } catch (e) {
        error.set('Failed to load dashboard data');
        console.error(e);
    } finally {
        loading.set(false);
    }
}