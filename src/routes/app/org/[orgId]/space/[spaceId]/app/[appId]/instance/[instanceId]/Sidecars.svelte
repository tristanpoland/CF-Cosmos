<script>
    import { ArrowUpDown, Search, Activity, Server, Play, Square, Plus } from 'lucide-svelte';
import { page } from '$app/stores';

const generateMockSidecars = (count = 10) => {
    const sidecarTypes = ["consul", "spring-cloud-config-sidecar", "prometheus-node-exporter", "statsd", "prometheus-node-exporter", "statsd", "fluentd", "logstash", "vector", "envoy", "istio-proxy", "redis", "memcached"];
    const states = ['RUNNING', 'STOPPED', 'FAILED'];
    const stateWeights = [0.85, 0.10, 0.05];
    
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
        const sidecarType = sidecarTypes[Math.floor(Math.random() * sidecarTypes.length)];
        const state = getWeightedState();
        const processId = `pid-${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            id: (i + 1).toString(),
            name: `${sidecarType}-0`,
            type: sidecarType,
            state,
            processId,
            memory_usage: state === 'RUNNING' ? Math.floor(Math.random() * 512) : 0,
            cpu_usage: state === 'RUNNING' ? Math.floor(Math.random() * 30) : 0,
            created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
        };
    });
};

// State management
let searchQuery = '';
let sortField = 'name';
let sortDirection = 'asc';
let selectedSidecars = new Set();
let showNewSidecarModal = false;
let loading = false;

// New sidecar form state
let newSidecar = {
    name: '',
    type: 'logger',
    memory_limit: 256,
    command: ''
};

// Available sidecar templates
const sidecarTemplates = {
    logger: {
        name: 'Promethius',
        description: 'Captures and forwards application logs',
        default_command: '/usr/local/bin/log-forwarder',
        memory_limit: 256
    },
    metrics: {
        name: 'Netdata Agent',
        description: 'Collects application metrics',
        default_command: '/usr/local/bin/metrics-agent',
        memory_limit: 384
    }
};

// Generate mock data
const sidecars = generateMockSidecars(5);

// Computed properties
$: filteredSidecars = sidecars
    .filter(sidecar => 
        sidecar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sidecar.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        return a[sortField] > b[sortField] ? direction : -direction;
    });

// Functions
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
        case 'RUNNING': return 'text-green-400';
        case 'STOPPED': return 'text-gray-400';
        case 'FAILED': return 'text-red-400';
        default: return 'text-yellow-400';
    }
}

function handleBulkAction(action) {
    loading = true;
    console.log(`Bulk ${action}:`, Array.from(selectedSidecars));
    // Simulate API call
    setTimeout(() => {
        loading = false;
    }, 1000);
}

async function deploySidecar() {
    loading = true;
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Deploying sidecar:', newSidecar);
        
        // Reset form and close modal
        newSidecar = {
            name: '',
            type: 'logger',
            memory_limit: 256,
            command: ''
        };
        showNewSidecarModal = false;
    } catch (error) {
        console.error('Error deploying sidecar:', error);
    } finally {
        loading = false;
    }
}

function handleTemplateSelect(type) {
    const template = sidecarTemplates[type];
    newSidecar = {
        ...newSidecar,
        type,
        command: template.default_command,
        memory_limit: template.memory_limit
    };
}

$: orgId = $page.params.orgId;
$: spaceId = $page.params.spaceId;
</script>

<!-- Toolbar -->
<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
    <!-- Search -->
    <div class="relative w-full sm:w-96">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search sidecars..."
            class="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500"
        />
    </div>

    <!-- Actions -->
    <div class="flex space-x-3 w-full sm:w-auto">
        <button 
            on:click={() => handleBulkAction('start')}
            class="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
            disabled={selectedSidecars.size === 0 || loading}
        >
            <Play class="w-4 h-4" />
            <span>Start</span>
        </button>
        <button 
            on:click={() => handleBulkAction('stop')}
            class="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
            disabled={selectedSidecars.size === 0 || loading}
        >
            <Square class="w-4 h-4" />
            <span>Stop</span>
        </button>
        <button 
            on:click={() => showNewSidecarModal = true}
            class="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
            <Plus class="w-4 h-4" />
            <span>New Sidecar</span>
        </button>
    </div>
</div>

<!-- Sidecars Table -->
<div class="mt-6 overflow-x-auto">
    <table class="w-full">
        <thead>
            <tr class="text-left border-b border-neutral-800">
                <th class="p-4">
                    <input 
                        type="checkbox"
                        checked={selectedSidecars.size === sidecars.length}
                        on:change={(e) => {
                            selectedSidecars = e.target.checked 
                                ? new Set(sidecars.map(s => s.id))
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
                <th class="p-4">Process ID</th>
                <th class="p-4">Memory</th>
                <th class="p-4">CPU</th>
                <th class="p-4">Age</th>
                <th class="p-4"></th>
            </tr>
        </thead>
        <tbody>
            {#each filteredSidecars as sidecar}
                <tr class="border-b border-neutral-800 hover:bg-neutral-900/50">
                    <td class="p-4">
                        <input 
                            type="checkbox"
                            checked={selectedSidecars.has(sidecar.id)}
                            on:change={(e) => {
                                if (e.target.checked) {
                                    selectedSidecars.add(sidecar.id);
                                } else {
                                    selectedSidecars.delete(sidecar.id);
                                }
                                selectedSidecars = selectedSidecars;
                            }}
                            class="rounded border-neutral-700 text-blue-500 focus:ring-blue-500"
                        />
                    </td>
                    <td class="p-4">
                        <span class="text-white">
                            {sidecar.name}
                        </span>
                        <div class="text-sm text-gray-400">{sidecar.type}</div>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center space-x-2">
                            <Activity class="w-4 h-4 {getStateColor(sidecar.state)}" />
                            <span class={getStateColor(sidecar.state)}>{sidecar.state}</span>
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center space-x-2">
                            <Server class="w-4 h-4 text-blue-400" />
                            <span>{sidecar.processId}</span>
                        </div>
                    </td>
                    <td class="p-4">
                        <span>{sidecar.memory_usage}MB</span>
                    </td>
                    <td class="p-4">
                        <span>{sidecar.cpu_usage}%</span>
                    </td>
                    <td class="p-4">
                        <span>{new Date(sidecar.created_at).toLocaleDateString()}</span>
                    </td>
                    <td class="p-4">
                        <div class="flex justify-end space-x-2">
                            <button
                                class="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                                on:click={() => handleBulkAction(sidecar.state === 'RUNNING' ? 'stop' : 'start')}
                            >
                                {#if sidecar.state === 'RUNNING'}
                                    <Square class="w-4 h-4" />
                                {:else}
                                    <Play class="w-4 h-4" />
                                {/if}
                            </button>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- New Sidecar Modal -->
{#if showNewSidecarModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-neutral-900 rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 class="text-xl font-semibold mb-4">Deploy New Sidecar</h2>
            
            <form on:submit|preventDefault={deploySidecar} class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Sidecar Type</label>
                    <select
                        bind:value={newSidecar.type}
                        on:change={() => handleTemplateSelect(newSidecar.type)}
                        class="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        {#each Object.entries(sidecarTemplates) as [type, template]}
                            <option value={type}>{template.name}</option>
                        {/each}
                    </select>
                    <p class="mt-1 text-sm text-gray-400">
                        {sidecarTemplates[newSidecar.type].description}
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        bind:value={newSidecar.name}
                        placeholder="Enter sidecar name"
                        class="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Command</label>
                    <input
                        type="text"
                        bind:value={newSidecar.command}
                        placeholder="Enter command to run"
                        class="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Memory Limit (MB)</label>
                    <input
                        type="number"
                        bind:value={newSidecar.memory_limit}
                        min="64"
                        max="2048"
                        step="64"
                        class="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        on:click={() => showNewSidecarModal = false}
                        class="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Deploying...' : 'Deploy'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}   