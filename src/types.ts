// types.ts
export interface CFApp {
    name: string;
    state: 'STARTED' | 'STOPPED' | 'CRASHED';
    updated_at: string;
    lifecycle: {
        data: {
            stack: string;
        };
    };
}

export interface CFEvent {
    type: string;
    target: {
        name: string;
        type: string;
    };
    created_at: string;
}

export interface CFStats {
    apps: {
        total: number;
        running: number;
        crashed: number;
    };
    services: {
        total: number;
        bound: number;
    };
    memory: {
        used_gb: number;
        total_gb: number;
        used_percentage: number;
    };
    instances: {
        total: number;
        running: number;
        crashed: number;
    };
}

export interface StatsCard {
    name: string;
    value: () => string;
    icon: any;
    subtitle: () => string;
}

export interface TimeSeriesData {
    timestamp: string;
    value: number;
}

export interface MemoryData extends TimeSeriesData {
    used_gb: number;
    total_gb: number;
    percentage: number;
}

export interface InstanceData extends TimeSeriesData {
    running: number;
    crashed: number;
    total: number;
}