<script lang="ts">
    import { recentApps } from '../store';
    import { onMount } from 'svelte';
    
    // Pagination controls
    let itemsPerPage = 25;
    let currentPage = 1;
    let isLoading = false;
    
    // Available options for items per page
    const itemsPerPageOptions = [25, 30, 40, 50, 100];
    
    const stateColors = {
        STARTED: 'text-green-400 bg-green-800',
        STOPPED: 'text-gray-400 bg-gray-800',
        CRASHED: 'text-red-400 bg-red-800',
        DEFAULT: 'text-blue-400 bg-blue-800'
    };
    function getStateColor(state: string) {
        return stateColors[state] || stateColors.DEFAULT;
    }
    
    // Reactive statement to get displayed apps
    $: displayedApps = $recentApps.slice(0, itemsPerPage * currentPage);
    
    // Check if there are more apps to load
    $: hasMoreApps = displayedApps.length < $recentApps.length;
    
    let loadingTrigger: HTMLDivElement;
    
    // Simulate loading delay
    async function loadMore() {
        if (isLoading || !hasMoreApps) return;
        
        isLoading = true;
        
        // Artificial delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        currentPage += 1;
        isLoading = false;
    }
    
    // Handle items per page change
    function handleItemsPerPageChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        itemsPerPage = parseInt(select.value);
        currentPage = 1; // Reset to first page when changing items per page
    }
    
    // Set up intersection observer
    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMoreApps) {
                    loadMore();
                }
            },
            {
                root: null,
                rootMargin: '100px',
                threshold: 0.1
            }
        );
        
        if (loadingTrigger) {
            observer.observe(loadingTrigger);
        }
        
        return () => {
            if (loadingTrigger) {
                observer.unobserve(loadingTrigger);
            }
        };
    });
</script>
<div class="bg-neutral-900 rounded-lg shadow-lg lg:col-span-2 h-fit overflow-y-scroll">
    <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-white">Recent Applications</h2>
        <div class="flex items-center space-x-2">
            <label for="itemsPerPage" class="text-sm text-gray-400">Show:</label>
            <select
                id="itemsPerPage"
                bind:value={itemsPerPage}
                on:change={handleItemsPerPageChange}
                class="bg-neutral-800 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
            >
                {#each itemsPerPageOptions as option}
                    <option value={option}>{option} items</option>
                {/each}
            </select>
        </div>
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
                    {#each displayedApps as app}
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
                                {new Date(app.updated_at).toLocaleString()}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            
            {#if hasMoreApps || isLoading}
                <div 
                    bind:this={loadingTrigger}
                    class="mt-4 text-center py-4"
                >
                    {#if isLoading}
                        <div class="inline-block">
                            <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    {:else}
                        <div class="text-gray-500 text-sm">Scroll for more</div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>