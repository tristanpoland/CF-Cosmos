<!-- src/lib/components/DeploymentModal.svelte -->
<script lang="ts">
    import { X, Github, GitBranch, Upload, Folder, Terminal } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
    
    export let show = false;
    const dispatch = createEventDispatcher();

    const sources = [
        {
            id: 'github',
            name: 'GitHub',
            description: 'Deploy from GitHub repository',
            icon: Github,
            color: 'text-white'
        },
        {
            id: 'gitlab',
            name: 'GitLab',
            description: 'Deploy from GitLab project',
            icon: GitBranch,
            color: 'text-orange-400'
        },
        {
            id: 'git',
            name: 'Public Git URL',
            description: 'Deploy from any Git repository',
            icon: GitBranch,
            color: 'text-blue-400'
        },
        {
            id: 'docker',
            name: 'Docker Image',
            description: 'Deploy from container image',
            icon: GitBranch,
            color: 'text-blue-400'
        },
        {
            id: 'archive',
            name: 'Application Archive',
            description: 'Upload and deploy archive file',
            icon: Upload,
            color: 'text-purple-400'
        },
        {
            id: 'folder',
            name: 'Application Folder',
            description: 'Deploy from local folder',
            icon: Folder,
            color: 'text-yellow-400'
        },
        {
            id: 'shell',
            name: 'Application Shell',
            description: 'Create new app from scratch',
            icon: Terminal,
            color: 'text-green-400'
        }
    ];

    function handleSelect(source) {
        dispatch('select', source);
        show = false;
    }

    function handleClose() {
        show = false;
        dispatch('close');
    }
</script>

{#if show}
<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-neutral-900 rounded-lg w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-white">Select Deployment Source</h2>
            <button 
                on:click={handleClose}
                class="text-gray-400 hover:text-white transition-colors"
            >
                <X class="w-5 h-5" />
            </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each sources as source}
                <button
                    on:click={() => handleSelect(source)}
                    class="flex flex-col items-center text-center p-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700 hover:border-neutral-600"
                >
                    <svelte:component 
                        this={source.icon} 
                        class="w-12 h-12 mb-4 {source.color}"
                    />
                    <h3 class="text-lg font-medium text-white mb-2">{source.name}</h3>
                    <p class="text-sm text-gray-400">{source.description}</p>
                </button>
            {/each}
        </div>
    </div>
</div>
{/if}