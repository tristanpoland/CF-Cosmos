<!-- EnvVariables.svelte -->
<script lang="ts">
    let variables = [
        { key: 'DATABASE_URL', value: '********', isSecret: true },
        { key: 'API_KEY', value: '********', isSecret: true },
        { key: 'PORT', value: '3000', isSecret: false }
    ];
 
    let showModal = false;
    let showDeleteModal = false;
    let editingVar: { key: string; value: string; isSecret: boolean } | null = null;
    let newVar = { key: '', value: '', isSecret: false };
    let showSecretValue = false;
    let deletingVar: typeof variables[0] | null = null;
 
    function handleSubmit() {
        if (editingVar) {
            variables = variables.map(v => 
                v.key === editingVar.key ? newVar : v
            );
        } else {
            variables = [...variables, newVar];
        }
        closeModal();
    }
 
    function editVariable(variable: typeof variables[0]) {
        editingVar = variable;
        newVar = { ...variable };
        showModal = true;
    }
 
    function confirmDelete(variable: typeof variables[0]) {
        deletingVar = variable;
        showDeleteModal = true;
    }
 
    function handleDelete() {
        if (deletingVar) {
            variables = variables.filter(v => v.key !== deletingVar.key);
        }
        showDeleteModal = false;
        deletingVar = null;
    }
 
    function closeModal() {
        showModal = false;
        editingVar = null;
        newVar = { key: '', value: '', isSecret: false };
        showSecretValue = false;
    }
 </script>
 
 <div class="space-y-4">
    <div class="flex justify-between items-center">
        <h2 class="text-lg font-medium">Environment Variables</h2>
        <button 
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            on:click={() => showModal = true}>
            Add Variable
        </button>
    </div>
 
    <div class="bg-neutral-900 rounded-lg divide-y divide-neutral-800">
        {#each variables as variable}
            <div class="flex items-center justify-between p-4">
                <div class="space-y-1">
                    <div class="font-medium flex items-center gap-2">
                        {variable.key}
                        {#if variable.isSecret}
                            <span class="text-xs bg-neutral-800 px-2 py-1 rounded-full">
                                Secret
                            </span>
                        {/if}
                    </div>
                    <div class="text-sm text-gray-400 font-mono">
                        {variable.value}
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button 
                        class="text-gray-400 hover:text-white"
                        on:click={() => editVariable(variable)}>
                        Edit
                    </button>
                    <button 
                        class="text-red-400 hover:text-red-300"
                        on:click={() => confirmDelete(variable)}>
                        Delete
                    </button>
                </div>
            </div>
        {/each}
    </div>
 </div>
 
 {#if showModal}
 <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-neutral-900 p-6 rounded-lg space-y-4 w-[500px]">
        <h2 class="text-lg font-medium">
            {editingVar ? 'Edit Variable' : 'Add Variable'}
        </h2>
        
        <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
            <div class="space-y-2">
                <label class="text-sm text-gray-400">Key</label>
                <input
                    type="text"
                    bind:value={newVar.key}
                    placeholder="VARIABLE_NAME"
                    class="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingVar}
                />
            </div>
 
            <div class="space-y-2">
                <label class="text-sm text-gray-400">Value</label>
                <div class="relative">
                    <input
                        type={newVar.isSecret && !showSecretValue ? "password" : "text"}
                        bind:value={newVar.value}
                        placeholder="variable_value"
                        class="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {#if newVar.isSecret}
                        <button 
                            type="button"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                            on:click={() => showSecretValue = !showSecretValue}>
                            {showSecretValue ? 'Hide' : 'Show'}
                        </button>
                    {/if}
                </div>
            </div>
 
            <label class="flex items-center gap-2">
                <input
                    type="checkbox"
                    bind:checked={newVar.isSecret}
                    class="rounded bg-neutral-800 border-neutral-700 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-400">
                    This is a secret value
                </span>
            </label>
 
            <div class="flex justify-end gap-3 pt-2">
                <button 
                    type="button"
                    class="px-4 py-2 text-sm text-gray-400 hover:text-white"
                    on:click={closeModal}>
                    Cancel
                </button>
                <button 
                    type="submit"
                    class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded"
                    disabled={!newVar.key || !newVar.value}>
                    {editingVar ? 'Save Changes' : 'Add Variable'}
                </button>
            </div>
        </form>
    </div>
 </div>
 {/if}
 
 {#if showDeleteModal}
 <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-neutral-900 p-6 rounded-lg space-y-4 w-[400px]">
        <h2 class="text-lg font-medium">Delete Variable</h2>
        
        <p class="text-gray-400">
            Are you sure you want to delete the variable <span class="text-white font-medium">{deletingVar?.key}</span>? This action cannot be undone.
        </p>
 
        <div class="flex justify-end gap-3 pt-2">
            <button 
                class="px-4 py-2 text-sm text-gray-400 hover:text-white"
                on:click={() => showDeleteModal = false}>
                Cancel
            </button>
            <button 
                class="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded"
                on:click={handleDelete}>
                Delete Variable
            </button>
        </div>
    </div>
 </div>
 {/if}