<script lang="ts">
    import { stats } from '../store';
    import { Cloud, Database, Server, Activity } from 'lucide-svelte';
    import type { StatsCard } from '../types';

    const statsCards: StatsCard[] = [
        {
            name: 'Applications',
            value: () => `${$stats.apps.running}/${$stats.apps.total}`,
            icon: Cloud,
            subtitle: () => $stats.apps.crashed > 0 ? `${$stats.apps.crashed} crashed` : 'All healthy'
        },
        {
            name: 'Services',
            value: () => `${$stats.services.bound}/${$stats.services.total}`,
            icon: Database,
            subtitle: () => 'Bound Services'
        },
        {
            name: 'Memory Usage',
            value: () => `${$stats.memory.used_gb}GB`,
            icon: Server,
            subtitle: () => `${$stats.memory.used_percentage}% of ${$stats.memory.total_gb}GB`
        },
        {
            name: 'App Instances',
            value: () => `${$stats.instances.running}/${$stats.instances.total}`,
            icon: Activity,
            subtitle: () => $stats.instances.crashed > 0 ? `${$stats.instances.crashed} crashed` : 'All healthy'
        }
    ];
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each statsCards as stat}
        <div class="bg-neutral-900 rounded-lg shadow p-6">
            <div class="flex items-start">
                <div class="inline-flex p-3 rounded-lg bg-gray-800">
                    <svelte:component this={stat.icon} class="w-6 h-6 text-blue-400" />
                </div>
                <div class="ml-4">
                    <h3 class="text-base font-normal text-gray-400">
                        {stat.name}
                    </h3>
                    <p class="mt-1 text-2xl font-semibold text-white">
                        {stat.value()}
                    </p>
                    <p class="mt-1 text-sm text-gray-500">
                        {stat.subtitle()}
                    </p>
                </div>
            </div>
        </div>
    {/each}
</div>