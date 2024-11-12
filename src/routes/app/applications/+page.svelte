<script lang="ts">
    import { onMount } from 'svelte';
    import { Cloud, Database, Server, Activity, Loader2 } from 'lucide-svelte';
    import { loading, error, loadDashboardData } from '../../../store';
    import RecentApps from '../../../components/RecentApps.svelte';
    import ActivityFeed from '../../../components/ActivityFeed.svelte';

    onMount(loadDashboardData);

</script>

<div class="space-y-6 min-h-screen bg-neutral-950 text-gray-300 p-6">
    <!-- Recent Apps and Events Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentApps />
        <ActivityFeed />
    </div>
</div>
