// mockData.ts
import type { CFApp, CFEvent, CFStats, MemoryData, InstanceData } from './types';

export function generateMockData() {
    // Generate mock apps
    const mockApps: CFApp[] = Array.from({ length: 100000 }, (_, i) => ({
        name: `CF App ${i + 1}`,
        state: i % 3 === 0 ? 'CRASHED' : i % 2 === 0 ? 'STOPPED' : 'STARTED',
        updated_at: new Date().toISOString(),
        lifecycle: {
            data: {
                stack: 'cflinuxfs4'
            }
        }
    }));

    // Generate mock events
    console.log('Generating mock data');
    const eventTypes = ['audit.app.create', 'audit.app.update', 'audit.app.delete', 'audit.service.bind', 'audit.service.unbind'];
    const targetTypes = ['app', 'service'];
    
    const mockEvents: CFEvent[] = Array.from({ length: 50 }, (_, i) => ({
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        target: {
            name: `Target ${i + 1}`,
            type: targetTypes[Math.floor(Math.random() * targetTypes.length)]
        },
        created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
    }));

    // Generate mock stats
    const mockStats: CFStats = {
        apps: {
            total: mockApps.length,
            running: mockApps.filter(app => app.state === 'STARTED').length,
            crashed: mockApps.filter(app => app.state === 'CRASHED').length
        },
        services: {
            total: Math.floor(Math.random() * 100),
            bound: Math.floor(Math.random() * 50)
        },
        memory: {
            used_gb: Math.floor(Math.random() * 100),
            total_gb: 100,
            used_percentage: Math.floor(Math.random() * 100)
        },
        instances: {
            total: Math.floor(Math.random() * 500),
            running: Math.floor(Math.random() * 300),
            crashed: Math.floor(Math.random() * 50)
        }
    };
    console.log('Generated mock data');
    console.log(mockStats);

    // Generate mock time series data
    const mockMemoryHistory: MemoryData[] = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        used_gb: Math.floor(Math.random() * 100),
        total_gb: 100,
        percentage: Math.floor(Math.random() * 100),
        value: Math.floor(Math.random() * 100)
    }));

    const mockInstanceHistory: InstanceData[] = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        running: Math.floor(Math.random() * 300),
        crashed: Math.floor(Math.random() * 50),
        total: Math.floor(Math.random() * 500),
        value: Math.floor(Math.random() * 500)
    }));

    console.log('Generated mock data');
    console.log(mockMemoryHistory);
    console.log(mockInstanceHistory);
    return {
        apps: mockApps,
        events: mockEvents,
        stats: mockStats,
        memoryHistory: mockMemoryHistory,
        instanceHistory: mockInstanceHistory
    };
}