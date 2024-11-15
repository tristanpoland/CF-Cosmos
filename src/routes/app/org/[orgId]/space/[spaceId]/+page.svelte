<!-- src/routes/organizations/[orgId]/spaces/[spaceId]/applications/+page.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Server, Plus } from 'lucide-svelte';
    import { page } from '$app/stores';
    import Applications from './Apps.svelte';
    import { get } from 'svelte/store';
    
    const { orgId, spaceId } = get(page).params;
    let activeTab = 'Applications';
    const tabs = ['Applications', 'Access Control'];

    function handleKeydown(event: KeyboardEvent) {
        const num = parseInt(event.key);
        if (num >= 1 && num <= 6 &&
            !event.ctrlKey && !event.altKey && !event.metaKey &&
            !event.shiftKey) {
            if (!['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
                event.preventDefault();
                activeTab = tabs[num - 1];
            }
        }
    }

    onMount(() => {
        window.addEventListener('keydown', handleKeydown);
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleKeydown);
    });
</script>

<div class="flex flex-col h-screen bg-neutral-950 text-gray-300">
    <div class="flex-none p-6 pb-10">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div class="text-sm text-gray-400">
                <a href="/app/orgs" class="hover:text-white transition-colors">Organizations</a>
                <span class="mx-2">/</span>
                <a href="/app/org/{orgId}" class="hover:text-white transition-colors">{orgId}</a>
                <span class="mx-2">/</span>
                <a href="/app/org/{orgId}/space/{spaceId}" class="hover:text-white transition-colors">{spaceId}</a>
                <span class="mx-2">/</span>
                <span>Apps/</span>
                <div class="flex items-center space-x-3 pt-5">
                    <Server class="w-6 h-6 text-blue-400" />
                    <h1 class="text-2xl font-semibold text-white">Space {spaceId}</h1>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-700">
            <nav class="-mb-px flex space-x-8">
                {#each tabs as tab, i}
                    <button
                        class="py-2 px-1 border-b-2 {activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent hover:border-gray-700 hover:text-gray-200'}"
                        on:click={() => activeTab = tab}>
                        <div class="flex items-center gap-2">
                            <span>{tab}</span>
                            <span class="inline-block px-1.5 py-0.5 text-xs font-medium bg-neutral-800 text-gray-400 rounded border border-neutral-700 shadow-sm">{i + 1}</span>
                        </div>
                    </button>
                {/each}
            </nav>
        </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 min-h-0 p-6 pt-0">
        {#if activeTab === 'Applications'}
            <Applications />
        {:else if activeTab === 'Access Control'}
            <h1 class="text-lg">NOT IMPLEMENTED</h1>
        {/if}
    </div>
</div>