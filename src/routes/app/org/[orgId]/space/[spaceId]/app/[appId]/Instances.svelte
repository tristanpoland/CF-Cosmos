<script>
import { Server, ArrowUpDown, Search, Activity, MemoryStick, Cpu, Play, Square, RefreshCw } from 'lucide-svelte';
import { page } from '$app/stores';
import InstanceActions from './InstanceActions.svelte';

const generateMockInstances = (count = 20) => {
    const environments = ['prod', 'stage', 'dev', 'test'];
    const regions = ['us-east', 'us-west', 'eu-west', 'ap-south'];
    const states = ['STARTED', 'STOPPED', 'CRASHED'];
    const stateWeights = [0.85, 0.12, 0.03];
            
    const getWeightedState = () => {
        const rand = Math.random();
        let sum = 0;
        for (let i = 0; i < states.length; i++) {
            sum += stateWeights[i];
            if (rand < sum) return states[i];
        }
        return states[0];
    };

    return Array.from({ length: count }, (_, i) => {
        const env = environments[Math.floor(Math.random() * environments.length)];
        const region = regions[Math.floor(Math.random() * regions.length)];
        const state = getWeightedState();
        
        // Standard memory size for all instances
        const memory = 2048;
        
        const timestamp = Date.now().toString(36).slice(-4);
        const randomness = Math.random().toString(36).substring(2, 8);
        
        // Generate structured instance ID
        const instanceId = `i-${env.slice(0,3)}-${region.split('-')[0]}-${
            i % 3 + 1
        }-${timestamp}-${randomness}`;
        
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));
    
        return {
            guid: (i + 1).toString(),
            instanceId,
            state,
            region,
            environment: env,
            memory,
            disk_quota: memory * 2,
            cpu_usage: state === 'STARTED' ? Math.floor(Math.random() * 95) : 0,
            created_at: randomDate.toISOString(),
            ip_address: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        };
    });
};

let searchQuery = '';
let sortField = 'name';
let sortDirection = 'asc';
let selectedApps = new Set();
let loading = false;

// Filter and sort instances
$: filteredInstances = instances
    .filter(app => app.instanceId.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        return a[sortField] > b[sortField] ? direction : -direction;
    });

function toggleSort(field) {
    if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortDirection = 'asc';
    }
}

function getStateColor(state) {
    switch (state) {
        case 'STARTED': return 'text-green-400';
        case 'STOPPED': return 'text-gray-400';
        case 'CRASHED': return 'text-red-400';
        default: return 'text-yellow-400';
    }
}

function formatMemory(mb) {
    return mb >= 1024 ? `${(mb/1024).toFixed(1)}GB` : `${mb}MB`;
}

function handleBulkAction(action) {
    console.log(`Bulk ${action}:`, Array.from(selectedApps));
}

const instances = generateMockInstances(50);
$: orgId = $page.params.orgId;
$: spaceId = $page.params.spaceId;
$: appId = $page.params.appId;
$: instanceId = $page.params.instanceId;
</script>

<!-- Toolbar -->
<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
    <!-- Search -->
    <div class="relative w-full sm:w-96">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search applications..."
            class="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500"
        />
    </div>

    <!-- Bulk Actions -->
    <div class="flex space-x-3 w-full sm:w-auto">
        <button 
            on:click={() => handleBulkAction('start')}
            class="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
            disabled={selectedApps.size === 0}
        >
            <Play class="w-4 h-4" />
            <span>Start</span>
        </button>
        <button 
            on:click={() => handleBulkAction('stop')}
            class="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
            disabled={selectedApps.size === 0}
        >
            <Square class="w-4 h-4" />
            <span>Stop</span>
        </button>
        <button 
            on:click={() => handleBulkAction('restart')}
            class="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
            disabled={selectedApps.size === 0}
        >
            <RefreshCw class="w-4 h-4" />
            <span>Restart</span>
        </button>
    </div>
</div>

<!-- Applications Table -->
<div class="overflow-x-auto">
    <table class="w-full">
        <thead>
            <tr class="text-left border-b border-neutral-800">
                <th class="p-4">
                    <input 
                        type="checkbox"
                        checked={selectedApps.size === instances.length}
                        on:change={(e) => {
                            selectedApps = e.target.checked 
                                ? new Set(instances.map(a => a.guid))
                                : new Set();
                        }}
                        class="rounded border-neutral-700 text-blue-500 focus:ring-blue-500"
                    />
                </th>
                <th class="p-4 cursor-pointer" on:click={() => toggleSort('name')}>
                    <div class="flex items-center space-x-2">
                        <span>Name</span>
                        <ArrowUpDown class="w-4 h-4" />
                    </div>
                </th>
                <th class="p-4">Status</th>
                <th class="p-4">Instance ID</th>
                <th class="p-4">Memory</th>
                <th class="p-4">CPU</th>
                <th class="p-4"></th>
            </tr>
        </thead>
        <tbody>
            {#each filteredInstances as instance}
                <tr class="border-b border-neutral-800 hover:bg-neutral-900/50">
                    <td class="p-4">
                        <input 
                            type="checkbox"
                            checked={selectedApps.has(instance.guid)}
                            on:change={(e) => {
                                if (e.target.checked) {
                                    selectedApps.add(instance.guid);
                                } else {
                                    selectedApps.delete(instance.guid);
                                }
                                selectedApps = selectedApps;
                            }}
                            class="rounded border-neutral-700 text-blue-500 focus:ring-blue-500"
                        />
                    </td>
                    <td class="p-4">
                        <span class="text-white">
                            <a href="./{appId}/instance/{instance.instanceId}" class="text-white hover:text-blue-400">
                                {instance.instanceId}
                            </a>
                        </span>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center space-x-2">
                            <Activity class="w-4 h-4 {getStateColor(instance.state)}" />
                            <span class={getStateColor(instance.state)}>{instance.state}</span>
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center space-x-2">
                            <Server class="w-4 h-4 text-blue-400" />
                            <span>{instance.instanceId}</span>
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center space-x-2">
                            <MemoryStick class="w-4 h-4 text-blue-400" />
                            <span>{formatMemory(instance.memory)}</span>
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center space-x-2">
                            <Cpu class="w-4 h-4 text-blue-400" />
                            <span>{instance.cpu_usage}%</span>
                        </div>
                    </td>
                    <td class="p-4">
                        <InstanceActions {instance} />
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>