<script>
    import { Card } from 'flowbite-svelte'
    export let stats = []
    export let columns = 3
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-{columns}">
    {#each stats as stat}
        <Card padding="sm">
            <div class="flex items-center">
                {#if stat.icon}
                    <div class="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-blue-500 rounded-lg">
                        <svelte:component this={stat.icon} class="w-6 h-6" />
                    </div>
                {/if}
                
                <div class="flex-1 text-right">
                    <span class="text-2xl font-bold leading-none text-gray-900 dark:text-white">
                        {stat.value}
                    </span>
                    <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">
                        {stat.name}
                    </h3>
                    
                    {#if stat.change}
                        <div class="flex items-center justify-end mt-1">
                            <span class="text-sm font-medium
                                {stat.change.type === 'increase' 
                                    ? 'text-green-600 dark:text-green-500' 
                                    : 'text-red-600 dark:text-red-500'}">
                                {stat.change.value}
                            </span>
                        </div>
                    {/if}
                </div>
            </div>
        </Card>
    {/each}
</div>