<!-- src/routes/organizations/[orgId]/spaces/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { Layers, Plus, BoxSelect, Server, Database } from 'lucide-svelte';
    import { page } from '$app/stores';
    
    // Mock data - replace with store/API
    let spaces = [
        {
            guid: '1',
            name: 'Development',
            apps_count: 8,
            services_count: 5,
            memory_usage: 2.1,
            memory_quota: 5
        },
        {
            guid: '2',
            name: 'Staging',
            apps_count: 4,
            services_count: 3,
            memory_usage: 1.8,
            memory_quota: 5
        }
    ];
    
    let loading = false;
    let error = null;
    
    // Get from URL params
    $: orgId = $page.params.orgId;
</script>

<div class="space-y-6 min-h-screen bg-neutral-950 text-gray-300 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <div class="text-sm text-gray-400 mb-1">
                <a href="/app/orgs" class="hover:text-white transition-colors">Organizations</a>
                <span class="mx-2">/</span>
                <span>{orgId}</span>
            </div>
            <div class="flex items-center space-x-3">
                <Layers class="w-6 h-6 text-blue-400" />
                <h1 class="text-2xl font-semibold text-white">Spaces</h1>
            </div>
        </div>
        <button class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Plus class="w-4 h-4" />
            <span>New Space</span>
        </button>
    </div>

    <!-- Spaces Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {#each spaces as space}
            <div class="group relative overflow-hidden rounded-lg bg-neutral-900 p-6">
                <div class="absolute inset-0 bg-gradient-to-bl from-blue-950/30 via-transparent to-transparent"></div>
                <div class="relative">
                    <h3 class="text-xl font-semibold text-white mb-4">{space.name}</h3>
                    
                    <div class="space-y-4">
                        <!-- Applications -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2 text-gray-400">
                                <Server class="w-4 h-4" />
                                <span>Applications</span>
                            </div>
                            <span class="text-white">{space.apps_count}</span>
                        </div>
                        
                        <!-- Services -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2 text-gray-400">
                                <Database class="w-4 h-4" />
                                <span>Services</span>
                            </div>
                            <span class="text-white">{space.services_count}</span>
                        </div>
                        
                        <!-- Memory Usage -->
                        <div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-400">Memory Usage</span>
                                <span class="text-white">{space.memory_usage}GB / {space.memory_quota}GB</span>
                            </div>
                            <div class="w-full bg-neutral-800 rounded-full h-2">
                                <div 
                                    class="bg-blue-500 h-2 rounded-full transition-all"
                                    style="width: {(space.memory_usage / space.memory_quota) * 100}%"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-6 flex space-x-3">
                        <a href="./space/{space.guid}/">
                            <button class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                View Applications
                            </button>
                        </a>
                        <button class="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>