<script lang="ts">
    let logs = [
        { timestamp: '2024-01-01 12:00:00', level: 'INFO', message: 'Application started' },
        { timestamp: '2024-01-01 12:00:01', level: 'ERROR', message: 'Failed to connect to database' }
    ];
</script>

<div class="bg-neutral-900 rounded-lg p-4">
    <div class="h-96 overflow-y-auto font-mono">
        {#each logs as log}
            <div class="py-1 flex gap-4">
                <span class="text-gray-400">{log.timestamp}</span>
                <span class={log.level === 'ERROR' ? 'text-red-400' : 'text-green-400'}>
                    [{log.level}]
                </span>
                <span>{log.message}</span>
            </div>
        {/each}
    </div>
</div>