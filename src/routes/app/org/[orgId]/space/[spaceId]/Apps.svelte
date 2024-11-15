<!-- src/routes/organizations/[orgId]/spaces/[spaceId]/applications/Applications.svelte -->
<script lang="ts">
    import { Server, Play, Square, RefreshCw, Plus, MoreVertical, 
             ArrowUpDown, Search, Activity, MemoryStick, Cpu } from 'lucide-svelte';
    import AppActions from './AppActions.svelte';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import DeploymentModal from './DeploymentModal.svelte';
    
    const { orgId, spaceId } = get(page).params;
    const generateMockApps = (count = 20) => {
        const appTypes = ['api', 'worker', 'frontend', 'backend', 'service', 'job', 'auth', 'cache', 'proxy', 'monitor'];
        const environments = ['dev', 'staging', 'prod', 'test', 'demo'];
        const buildpacks = ['nodejs_buildpack', 'java_buildpack', 'python_buildpack', 'ruby_buildpack', 'go_buildpack', 'php_buildpack'];
        const states = ['STARTED', 'STOPPED', 'CRASHED'];
        const stateWeights = [0.7, 0.2, 0.1]; // 70% started, 20% stopped, 10% crashed
                
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
            const appType = appTypes[Math.floor(Math.random() * appTypes.length)];
            const env = environments[Math.floor(Math.random() * environments.length)];
            const state = getWeightedState();
            const instances = Math.floor(Math.random() * 5) + 1;
            const running_instances = state === 'STARTED' ? instances : 0;
            const memory = [256, 512, 1024, 2048][Math.floor(Math.random() * 4)];
            const buildpack = buildpacks[Math.floor(Math.random() * buildpacks.length)];
            
            const randomDate = new Date();
            randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));
        
            return {
                guid: (i + 1).toString(),
                name: `${appType}-${env}-${Math.floor(Math.random() * 1000)}`,
                state,
                instances,
                running_instances,
                memory,
                disk_quota: memory * 2,
                cpu_usage: state === 'STARTED' ? Math.floor(Math.random() * 95) : 0,
                urls: state === 'STOPPED' ? [] : [`${appType}-${env}.apps.cf.example.com`],
                created_at: randomDate.toISOString(),
                buildpack,
                stack: 'cflinuxfs3'
            };
        });
    };
    
    let searchQuery = '';
    let sortField = 'name';
    let sortDirection = 'asc';
    let selectedApps = new Set();
    let loading = false;

    const applications = generateMockApps(50);

    // Filter and sort applications
    $: filteredApps = applications
        .filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
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

    let showDeployModal = false;

    function handleDeploymentSourceSelect(event) {
        const source = event.detail;
        window.location.href = `/app/org/${orgId}/space/${spaceId}/deploy?source=${source.id}`;
    }
</script>

<div class="h-full flex flex-col">

    <!-- Deployment Modal -->
    <DeploymentModal 
        bind:show={showDeployModal}
        on:select={handleDeploymentSourceSelect}
        on:close={() => showDeployModal = false}
    />

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
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

            <button on:click={() => showDeployModal = true} class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Plus class="w-4 h-4" />
                <span>Deploy Application</span>
            </button>
        </div>
    </div>

    <!-- Applications Table -->
    <div class="flex-1">
        <table class="w-full">
            <thead>
                <tr class="text-left border-b border-neutral-800">
                    <th class="p-4">
                        <input 
                            type="checkbox"
                            checked={selectedApps.size === applications.length}
                            on:change={(e) => {
                                selectedApps = e.target.checked 
                                    ? new Set(applications.map(a => a.guid))
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
                    <th class="p-4">Instances</th>
                    <th class="p-4">Memory</th>
                    <th class="p-4">CPU</th>
                    <th class="p-4">Routes</th>
                    <th class="p-4"></th>
                </tr>
            </thead>
            <tbody>
                {#each filteredApps as app}
                    <tr class="border-b border-neutral-800 hover:bg-neutral-900/50">
                        <td class="p-4">
                            <input 
                                type="checkbox"
                                checked={selectedApps.has(app.guid)}
                                on:change={(e) => {
                                    if (e.target.checked) {
                                        selectedApps.add(app.guid);
                                    } else {
                                        selectedApps.delete(app.guid);
                                    }
                                    selectedApps = selectedApps;
                                }}
                                class="rounded border-neutral-700 text-blue-500 focus:ring-blue-500"
                            />
                        </td>
                        <td class="p-4">
                            <a href="./{spaceId}/app/{app.guid}" class="text-white hover:text-blue-400">
                                {app.name}
                            </a>
                            <div class="text-sm text-gray-400">{app.buildpack}</div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center space-x-2">
                                <Activity class="w-4 h-4 {getStateColor(app.state)}" />
                                <span class={getStateColor(app.state)}>{app.state}</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center space-x-2">
                                <Server class="w-4 h-4 text-blue-400" />
                                <span>{app.running_instances}/{app.instances}</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center space-x-2">
                                <MemoryStick class="w-4 h-4 text-blue-400" />
                                <span>{formatMemory(app.memory)}</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center space-x-2">
                                <Cpu class="w-4 h-4 text-blue-400" />
                                <span>{app.cpu_usage}%</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <div class="space-y-1">
                                {#each app.urls as url}
                                    <div class="text-sm">{url}</div>
                                {/each}
                            </div>
                        </td>
                        <td class="p-4">
                            <AppActions {app} />
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>