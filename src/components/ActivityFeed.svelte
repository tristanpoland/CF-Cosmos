<script lang="ts">
    import { events } from '../store';

    function formatEventType(type: string) {
        return type
            .replace('audit.', '')
            .split('.')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') || 'Unknown Event';
    }
</script>

<div class="rounded-lg shadow-lg bg-neutral-900 h-screen overflow-scroll">
    <div class="px-6 py-4 border-b border-gray-700">
        <h2 class="text-lg font-semibold text-white">Recent Activity</h2>
    </div>
    <div class="p-6">
        <div class="space-y-4">
            {#each $events as event}
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
                            {new Date(event?.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            {/each}
            {#if $events.length === 0}
                <p class="text-gray-400 text-center py-4">No recent activity</p>
            {/if}
        </div>
    </div>
</div>