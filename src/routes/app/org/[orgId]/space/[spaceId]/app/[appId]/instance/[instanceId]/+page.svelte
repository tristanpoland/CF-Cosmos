<script lang="ts">
    import { Server, Plus } from 'lucide-svelte';
    import { page } from '$app/stores';
    import Console from './Console.svelte';
    import Sidecars from './Sidecars.svelte';
    import { get } from 'svelte/store';
    import { onMount, onDestroy } from 'svelte';
   
    const { orgId, spaceId, appId, instanceId } = get(page).params;
    let activeTab = 'Sidecars';

    const tabs = ['Sidecars', 'console'];

    function handleKeydown(event: KeyboardEvent) {
        // Check if a number key 1-5 is pressed and no modifiers are active
        const num = parseInt(event.key);
        if (num >= 1 && num <= 6 && 
            !event.ctrlKey && !event.altKey && !event.metaKey && 
            !event.shiftKey) {
            // Prevent default behavior if user is not in an input field
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

<div class="space-y-6 min-h-screen bg-neutral-950 text-gray-300 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div class="text-sm text-gray-400">
            <a href="/app/orgs" class="hover:text-white transition-colors">Organizations /</a>
            <a href="/app/org/{orgId}" class="hover:text-white transition-colors">{orgId}</a>
            <span class="mx-0">/ space /</span>
            <a href="/app/org/{orgId}/space/{spaceId}" class="hover:text-white transition-colors">{spaceId}</a>
            <span class="mx-0">/ app /</span>
            <a href="/app/org/{orgId}/space/{spaceId}/app/{appId}" class="hover:text-white transition-colors">{appId}</a>
            <span class="mx-0">/instance/</span>
            <a href="/app/org/{orgId}/space/{spaceId}/app/{appId}/instance/{instanceId}" class="hover:text-white transition-colors">{instanceId}</a>
            <div class="flex items-center space-x-3 pt-5">
                <Server class="w-6 h-6 text-blue-400" />
                <h1 class="text-2xl font-semibold text-white">Instance {instanceId} of app {appId}</h1>
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
                        <span>{tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                        <span class="inline-block px-1.5 py-0.5 text-xs font-medium bg-neutral-800 text-gray-400 rounded border border-neutral-700 shadow-sm">{i + 1}</span>
                    </div>
                </button>
            {/each}
        </nav>
    </div>

    <!-- Tab Content -->
    <div class="py-4">
        {#if activeTab === 'Sidecars'}
            <Sidecars />
        {:else if activeTab === 'console'}
            <Console />
        {/if}
    </div>
</div>