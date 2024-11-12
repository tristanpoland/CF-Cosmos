<script lang="ts">
    import { onMount } from 'svelte';
    import { Cloud, Database, Server, Activity, Loader2 } from 'lucide-svelte';

    onMount(loadDashboardData);

    let loading = true;
    let error = null;
    let recentApps = [];
    let events = [];
    
    /** @type {Array<{name: string, state: string, updated_at: string, lifecycle: {data: {stack: string}}}>} */
    let mockApps = [];
    
    function populateMockApps() {
        for (let i = 1; i <= 500; i++) {
            mockApps.push({
                name: "CF App "+i.toString(),
                state: i % 3 === 0 ? 'CRASHED' : i % 2 === 0 ? 'STOPPED' : 'STARTED',
                updated_at: new Date().toISOString(),
                lifecycle: {
                    data: {
                        stack: 'cflinuxfs4'
                    }
                }
            });
        }
    }

    populateMockApps();
    
    let stats = {
        apps: { total: mockApps.length, running: mockApps.filter(app => app.state === 'STARTED').length, crashed: mockApps.filter(app => app.state === 'CRASHED').length },
        services: { total: 0, bound: 0 },
        memory: { used_gb: 0, total_gb: 0, used_percentage: 0 },
        instances: { total: 0, running: 0, crashed: 0 }
    };
    
    async function loadDashboardData() {
        try {
            recentApps = mockApps;
            loading = false;
        } catch (e) {
            error = 'Failed to load dashboard data';
            console.error(e);
        } finally {
            loading = false;
        }
    }

    const stateColors = {
        STARTED: 'text-green-400 bg-green-800',
        STOPPED: 'text-gray-400 bg-gray-800',
        CRASHED: 'text-red-400 bg-red-800',
        DEFAULT: 'text-blue-400 bg-blue-800'
    };

    function getStateColor(state) {
        return stateColors[state] || stateColors.DEFAULT;
    }
    function formatEventType(type) {    
        return type
            .replace('audit.', '')
            .split('.')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') || 'Unknown Event';
    }

    const statsCards = [
        {
            name: 'Applications',
            value: () => `${stats.apps.running}/${stats.apps.total}`,
            icon: Cloud,
            subtitle: () => stats.apps.crashed > 0 ? `${stats.apps.crashed} crashed` : 'All healthy'
        },
        {
            name: 'Services',
            value: () => `${stats.services.bound}/${stats.services.total}`,
            icon: Database,
            subtitle: () => 'Bound Services'
        },
        {
            name: 'Memory Usage',
            value: () => `${stats.memory.used_gb}GB`,
            icon: Server,
            subtitle: () => `${stats.memory.used_percentage}% of ${stats.memory.total_gb}GB`
        },
        {
            name: 'App Instances',
            value: () => `${stats.instances.running}/${stats.instances.total}`,
            icon: Activity,
            subtitle: () => stats.instances.crashed > 0 ? `${stats.instances.crashed} crashed` : 'All healthy'
        }
    ];

    onMount(loadDashboardData);
</script>


<!-- Page code: -->

<div class="space-y-6 min-h-screen bg-neutral-950 text-gray-300">
    <!-- Handle Loading Screen -->
    {#if loading}
        <div class="flex justify-center py-8">
            <Loader2 class="w-8 h-8 animate-spin text-gray-400" />
        </div>
    <!-- Handle Page Errors Gracefully -->
    {:else if error}
        <div class="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded">
            {error}
        </div>
    {:else}
        <!-- Stats Grid -->
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

        <!-- Recent Apps and Events Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Recent Applications -->
            <div class="bg-neutral-900 rounded-lg shadow-lg lg:col-span-2">
                <div class="px-6 py-4 border-b border-neutral-700">
                    <h2 class="text-lg font-semibold text-white">Recent Applications</h2>
                </div>
                <div class="p-6">
                    <div class="relative overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-400">
                            <thead class="text-xs text-gray-500 uppercase bg-neutral-800">
                                <tr>
                                    <th class="px-6 py-3">Name</th>
                                    <th class="px-6 py-3">Status</th>
                                    <th class="px-6 py-3">Stack</th>
                                    <th class="px-6 py-3">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each recentApps as app}
                                    <tr class="bg-neutral-800 border-b border-neutral-700 hover:bg-neutral-700">
                                        <td class="px-6 py-4 font-medium text-blue-400 hover:underline">
                                            {app.name || 'Unnamed App'}
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class={`px-2 py-1 text-xs font-medium rounded-full ${getStateColor(app.state)}`}>
                                                {app.state || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">
                                            {app.lifecycle?.data?.stack || 'Unknown Stack'}
                                        </td>
                                        <td class="px-6 py-4">
                                            {app.updated_at ? new Date(app.updated_at).toLocaleString() : 'Never'}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Activity Feed -->
            <div class="rounded-lg shadow-lg bg-neutral-900">
                <div class="px-6 py-4 border-b border-gray-700">
                    <h2 class="text-lg font-semibold text-white">Recent Activity</h2>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        {#each events as event}
                            <div class="flex gap-4 items-start">
                                <div class="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <p class="font-medium text-white">
                                        {formatEventType(event?.type)}
                                    </p>
                                    {#if event?.target}
                                        <p class="text-sm text-gray-400">
                                            {event.target.name || 'Unnamed'} ({event.target.type || 'unknown'})
                                        </p>
                                    {/if}
                                    <p class="text-xs text-gray-500 mt-1">
                                        {event?.created_at ? new Date(event.created_at).toLocaleString() : 'Unknown time'}
                                    </p>
                                </div>
                            </div>
                        {/each}
                        {#if events.length === 0}
                            <p class="text-gray-400 text-center py-4">No recent activity</p>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
