<script lang="ts">
    import { page } from '$app/stores';
    import { Scale, MemoryStick, Cpu, Server, ArrowRight } from 'lucide-svelte';
    
    // Get app ID from route params
    $: appId = $page.params.appId;
    
    // Mock app data - replace with API call
    let app = {
        name: 'frontend-app',
        instances: 2,
        memory: 512,
        disk_quota: 1024,
        current_usage: {
            cpu: 78,
            memory: 423,
            disk: 756
        }
    };

    let newInstances = app.instances;
    let newMemory = app.memory;
    let newDisk = app.disk_quota;
    
    let scaling = false;
    let error = null;

    async function handleScale() {
        scaling = true;
        error = null;
        
        try {
            // Mock API call - replace with actual CF API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update local state after successful scaling
            app.instances = newInstances;
            app.memory = newMemory;
            app.disk_quota = newDisk;
            
        } catch (err) {
            error = "Failed to scale application. Please try again.";
        } finally {
            scaling = false;
        }
    }

    function formatMemory(mb) {
        return mb >= 1024 ? `${(mb/1024).toFixed(1)}GB` : `${mb}MB`;
    }
</script>

<div class="space-y-6 min-h-screen bg-neutral-950 text-gray-300 p-6">
    <!-- Header -->
    <div class="flex items-center space-x-3">
        <Scale class="w-6 h-6 text-blue-400" />
        <h1 class="text-2xl font-semibold text-white">Scale {app.name}</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Scaling Form -->
        <div class="space-y-6">
            <!-- Instance Scaling -->
            <div class="bg-neutral-900 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Server class="w-5 h-5 text-blue-400" />
                    <span>Application Instances</span>
                </h2>
                
                <div class="flex items-center space-x-4">
                    <div class="flex-1">
                        <input 
                            type="range" 
                            min="1" 
                            max="10"
                            bind:value={newInstances}
                            class="w-full"
                        />
                        <div class="flex justify-between text-sm text-gray-400 mt-1">
                            <span>1</span>
                            <span>5</span>
                            <span>10</span>
                        </div>
                    </div>
                    <div class="w-20">
                        <input 
                            type="number"
                            min="1"
                            max="10"
                            bind:value={newInstances}
                            class="w-full px-3 py-2 bg-neutral-800 rounded-lg text-center"
                        />
                    </div>
                </div>
            </div>

            <!-- Memory Scaling -->
            <div class="bg-neutral-900 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <MemoryStick class="w-5 h-5 text-blue-400" />
                    <span>Memory per Instance</span>
                </h2>
                
                <div class="flex items-center space-x-4">
                    <div class="flex-1">
                        <input 
                            type="range" 
                            min="256" 
                            max="4096"
                            step="256"
                            bind:value={newMemory}
                            class="w-full"
                        />
                        <div class="flex justify-between text-sm text-gray-400 mt-1">
                            <span>256MB</span>
                            <span>2GB</span>
                            <span>4GB</span>
                        </div>
                    </div>
                    <div class="w-32 text-right">
                        <span class="text-lg">{formatMemory(newMemory)}</span>
                    </div>
                </div>
            </div>

            <!-- Disk Quota -->
            <div class="bg-neutral-900 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-white mb-4">Disk Quota</h2>
                
                <div class="flex items-center space-x-4">
                    <div class="flex-1">
                        <input 
                            type="range" 
                            min="512" 
                            max="8192"
                            step="512"
                            bind:value={newDisk}
                            class="w-full"
                        />
                        <div class="flex justify-between text-sm text-gray-400 mt-1">
                            <span>512MB</span>
                            <span>4GB</span>
                            <span>8GB</span>
                        </div>
                    </div>
                    <div class="w-32 text-right">
                        <span class="text-lg">{formatMemory(newDisk)}</span>
                    </div>
                </div>
            </div>

            {#if error}
                <div class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                </div>
            {/if}

            <button 
                on:click={handleScale}
                disabled={scaling || (newInstances === app.instances && newMemory === app.memory && newDisk === app.disk_quota)}
                class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
                {#if scaling}
                    <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Scaling Application...</span>
                {:else}
                    <span>Apply Changes</span>
                {/if}
            </button>
        </div>

        <!-- Current Usage -->
        <div class="space-y-6">
            <div class="bg-neutral-900 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-white mb-6">Current Resource Usage</h2>
                
                <!-- CPU Usage -->
                <div class="space-y-2 mb-6">
                    <div class="flex justify-between items-center text-sm">
                        <div class="flex items-center space-x-2">
                            <Cpu class="w-4 h-4 text-blue-400" />
                            <span class="text-gray-400">CPU Usage</span>
                        </div>
                        <span class="text-white">{app.current_usage.cpu}%</span>
                    </div>
                    <div class="w-full bg-neutral-800 rounded-full h-2">
                        <div 
                            class="bg-blue-500 h-2 rounded-full transition-all"
                            style="width: {app.current_usage.cpu}%"
                        ></div>
                    </div>
                </div>

                <!-- Memory Usage -->
                <div class="space-y-2 mb-6">
                    <div class="flex justify-between items-center text-sm">
                        <div class="flex items-center space-x-2">
                            <MemoryStick class="w-4 h-4 text-blue-400" />
                            <span class="text-gray-400">Memory Usage</span>
                        </div>
                        <span class="text-white">{formatMemory(app.current_usage.memory)} / {formatMemory(app.memory)}</span>
                    </div>
                    <div class="w-full bg-neutral-800 rounded-full h-2">
                        <div 
                            class="bg-blue-500 h-2 rounded-full transition-all"
                            style="width: {(app.current_usage.memory / app.memory) * 100}%"
                        ></div>
                    </div>
                </div>

                <!-- Disk Usage -->
                <div class="space-y-2">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-400">Disk Usage</span>
                        <span class="text-white">{formatMemory(app.current_usage.disk)} / {formatMemory(app.disk_quota)}</span>
                    </div>
                    <div class="w-full bg-neutral-800 rounded-full h-2">
                        <div 
                            class="bg-blue-500 h-2 rounded-full transition-all"
                            style="width: {(app.current_usage.disk / app.disk_quota) * 100}%"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Scaling Impact -->
            <div class="bg-neutral-900 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-white mb-4">Scaling Impact</h2>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                        <div>
                            <div class="text-sm text-gray-400">Total Memory</div>
                            <div class="text-lg text-white">{formatMemory(app.memory * app.instances)}</div>
                        </div>
                        <ArrowRight class="w-5 h-5 text-gray-500" />
                        <div>
                            <div class="text-sm text-gray-400">New Total</div>
                            <div class="text-lg text-white">{formatMemory(newMemory * newInstances)}</div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                        <div>
                            <div class="text-sm text-gray-400">Total Disk</div>
                            <div class="text-lg text-white">{formatMemory(app.disk_quota * app.instances)}</div>
                        </div>
                        <ArrowRight class="w-5 h-5 text-gray-500" />
                        <div>
                            <div class="text-sm text-gray-400">New Total</div>
                            <div class="text-lg text-white">{formatMemory(newDisk * newInstances)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>