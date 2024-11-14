<!-- Routes.svelte -->
<script lang="ts">
    let endpoints = [
        { url: 'my-app.cfcosmos.net', status: 'active' },
        { url: 'staging.my-app.cfcosmos.net', status: 'staging' }
    ];
 
    let showDomainModal = false;
    let newDomain = '';
    let verifying = false;
 
    function handleAddDomain() {
        verifying = true;
        setTimeout(() => {
            endpoints = [...endpoints, { url: newDomain, status: 'pending' }];
            verifying = false; 
            showDomainModal = false;
            newDomain = '';
        }, 1000);
    }
 </script>
 
 <div class="space-y-4">
    <div class="flex justify-between items-center">
        <h2 class="text-lg font-medium">Public Endpoints</h2>
        <button 
            class="text-sm text-blue-400 hover:text-blue-300"
            on:click={() => showDomainModal = true}>
            Add Custom Domain
        </button>
    </div>
    
    <div class="bg-neutral-900 rounded-lg divide-y divide-neutral-800">
        {#each endpoints as endpoint}
            <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-3">
                    <div class="h-2 w-2 rounded-full {endpoint.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}"></div>
                    <a href="https://{endpoint.url}" 
                       class="font-mono text-blue-400 hover:text-blue-300" 
                       target="_blank" 
                       rel="noopener">
                        {endpoint.url}
                    </a>
                </div>
                <span class="text-sm text-gray-400 capitalize">{endpoint.status}</span>
            </div>
        {/each}
    </div>
 </div>
 
 {#if showDomainModal}
 <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-neutral-900 p-6 rounded-lg space-y-4 w-[400px]">
        <h2 class="text-lg font-medium">Add Custom Domain</h2>
        
        <div class="space-y-2">
            <label class="text-sm text-gray-400">Domain Name</label>
            <input
                type="text"
                bind:value={newDomain}
                placeholder="example.com"
                class="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
 
        <div class="flex justify-end gap-3">
            <button 
                class="px-4 py-2 text-sm text-gray-400 hover:text-white"
                on:click={() => showDomainModal = false}>
                Cancel
            </button>
            <button 
                class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newDomain || verifying}
                on:click={handleAddDomain}>
                {verifying ? 'Verifying...' : 'Add Domain'}
            </button>
        </div>
    </div>
 </div>
 {/if}