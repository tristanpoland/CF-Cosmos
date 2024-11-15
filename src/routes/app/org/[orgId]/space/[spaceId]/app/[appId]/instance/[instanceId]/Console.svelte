<script lang="ts">
    let commandHistory: string[] = [];
    let currentCommand = '';
</script>

<div class="bg-neutral-900 rounded-lg p-4">
    <div class="h-[calc(100vh-400px)]  overflow-y-auto mb-4 font-mono">
        {#each commandHistory as command}
            <div class="py-1">{command}</div>
        {/each}
    </div>
    <input
        bind:value={currentCommand}
        class="w-full bg-neutral-800 text-white px-4 py-2 rounded"
        placeholder="Enter command..."
        on:keydown={(e) => {
            if (e.key === 'Enter') {
                commandHistory = [...commandHistory, `$ ${currentCommand}`];
                currentCommand = '';
            }
        }}
    />
</div>