<script lang="ts">
    import { onMount } from 'svelte';
    import { loading, error, loadDashboardData } from '../../store';
    import { Loader2 } from 'lucide-svelte';
    import '@carbon/charts-svelte/styles.css';
    import StatsCards from '../../components/StatsCards.svelte';
    import MemoryUsageChart from '../../components/MemChart.svelte';
    import AppInstancesChart from '../../components/AppInstancesChart.svelte';

    onMount(loadDashboardData);

</script>

<div class="space-y-6 min-h-screen bg-neutral-900 text-gray-100 p-6">
    {#if $loading}
        <div class="flex justify-center py-8">
            <Loader2 class="w-8 h-8 animate-spin text-gray-300" />
        </div>
    {:else if $error}
        <div class="bg-red-700 border border-red-500 text-red-100 px-4 py-3 rounded">
            {$error}
        </div>
    {:else}
        <!-- Stats Grid -->
        <StatsCards />  

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <MemoryUsageChart />
            <AppInstancesChart />
        </div>
    {/if}
</div>