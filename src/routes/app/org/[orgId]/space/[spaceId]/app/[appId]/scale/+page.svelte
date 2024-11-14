<!-- src/routes/organizations/[orgId]/spaces/[spaceId]/applications/[appId]/scale/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { Scale, MemoryStick, Database, Cpu, Gauge, Server, ArrowRight, Activity, Clock } from 'lucide-svelte';
    import AutoscaleSlider from '../../../../../../../../../components/AutoscaleSlider.svelte';
    import Slider from '../../../../../../../../../components/Slider.svelte';
    import Meter from '../../../../../../../../../components/Meter.svelte';

    $: appId = $page.params.appId;
    
    // Mock historical data
    const generateHistoricalData = (days = 7) => {
        return Array.from({ length: days * 24 }, (_, i) => {
            const date = new Date();
            date.setHours(date.getHours() - i);
            return {
                timestamp: date.toISOString(),
                cpu: 30 + Math.random() * 50,
                memory: 300 + Math.random() * 200,
                disk: 600 + Math.random() * 300
            };
        }).reverse();
    };

    const historicalData = generateHistoricalData();

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#9CA3AF'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#374151'
                },
                ticks: {
                    color: '#9CA3AF'
                }
            },
            y: {
                grid: {
                    color: '#374151'
                },
                ticks: {
                    color: '#9CA3AF'
                }
            }
        },
        elements: {
            line: {
                tension: 0.3
            }
        }
    };

    const cpuData = {
        labels: historicalData.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [{
            label: 'CPU Usage (%)',
            data: historicalData.map(d => d.cpu),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true
        }]
    };

    const memoryData = {
        labels: historicalData.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [{
            label: 'Memory Usage (MB)',
            data: historicalData.map(d => d.memory),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true
        }]
    };

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

    let autoscalingEnabled = false;
    let instances = { min: app.instances, max: app.instances * 2, current: app.instances };
    let memory = { min: app.memory, max: app.memory * 2, current: app.memory };
    let disk = { min: app.disk_quota, max: app.disk_quota * 2, current: app.disk_quota };
    let maxMemory = memory.max;
    let minMemory = memory.min;
    let minDisk = disk.min;
    let maxDisk = disk.max;

    
    // Auto-scaling rules
    let cpuThreshold = { scale_up: 80, scale_down: 20 };
    let memoryThreshold = { scale_up: 85, scale_down: 40 };
    let cooldown = 300; // seconds
    let scaleUpMemory = 85; // Initialize scaleUpMemory

    let minInstances = instances.min;
    let maxInstances = instances.max;
    let scaleOutCpu = cpuThreshold.scale_up;
    let scaleInCpu = cpuThreshold.scale_down;
    let minCpu = 0;
    let maxCpu = 400;

    let scaling = false;
    let saving = false;
    let error = null;

    function formatMemory(mb) {
        return mb >= 1024 ? `${(mb/1024).toFixed(1)}GB` : `${mb}MB`;
    }

    async function handleScale() {
        scaling = true;
        error = null;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (autoscalingEnabled) {
                app.instances = instances.current;
                app.memory = memory.current;
                app.disk_quota = disk.current;
            }
            
        } catch (err) {
            error = "Failed to scale application. Please try again.";
        } finally {
            scaling = false;
        }
    }

    function handleScalingModeChange() {
        if (!autoscalingEnabled) {
            instances = { min: app.instances, max: app.instances, current: app.instances };
            memory = { min: app.memory, max: app.memory, current: app.memory };
            disk = { min: app.disk_quota, max: app.disk_quota, current: app.disk_quota };
        }
    }

    function handleApplyChanges() {
        handleScale();
    }
</script>
 
 <div class="min-h-screen bg-neutral-950 text-gray-300 p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-3">
        <Scale class="w-6 h-6 text-blue-400" />
        <h1 class="text-2xl font-semibold text-white">Scale {app.name}</h1>
    </div>
 
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-6">
            <!-- Autoscaling Toggle -->
            <div class="bg-neutral-900 rounded-lg p-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-semibold text-white flex items-center space-x-2">
                        <Gauge class="w-5 h-5 text-blue-400" />
                        <span>Autoscaling</span>
                    </h2>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            bind:checked={autoscalingEnabled} 
                            on:change={handleScalingModeChange}
                            class="sr-only peer"
                        >
                        <div class="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer 
                                  peer-checked:after:translate-x-full peer-checked:after:border-white 
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                  after:bg-white after:border-gray-300 after:border after:rounded-full 
                                  after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
 
            {#if !autoscalingEnabled}
                <Slider 
                    icon={Server}
                    title="Application Instances"
                    bind:value={instances.current}
                    min={1}
                    max={20}
                    step={1}
                />
                
                <Slider 
                    icon={MemoryStick}
                    title="Memory per Instance"
                    bind:value={memory.current}
                    min={128}
                    max={4096}
                    step={128}
                    formatValue={formatMemory}
                />
                
                <Slider 
                    icon={Cpu}
                    title="CPU Limit"
                    bind:value={app.cpu_limit}
                    min={0}
                    max={400}
                    step={5}
                    unit="%"
                />
                
                <Slider 
                    icon={Database}
                    title="Disk Quota"
                    bind:value={disk.current}
                    min={512}
                    max={8192}
                    step={512}
                    formatValue={formatMemory}
                />
            {:else}
                <AutoscaleSlider
                    icon={Server} 
                    title="Instances"
                    bind:minValue={minInstances}
                    bind:maxValue={maxInstances}
                    min={1}
                    max={20}
                    step={1}
                    formatValue={formatMemory}
                />
                
                <AutoscaleSlider
                    icon={MemoryStick}
                    title="Memory"
                    bind:minValue={minMemory}
                    bind:maxValue={maxMemory}
                    min={128}
                    max={4096}
                    step={128}
                    formatValue={formatMemory}
                />
                
                <AutoscaleSlider
                    icon={Cpu}
                    title="CPU"
                    bind:minValue={minCpu}
                    bind:maxValue={maxCpu}
                    min={0}
                    max={400}
                    step={5}
                    formatValue={val => `${val}%`}
                />
                
                <AutoscaleSlider
                    icon={Database}
                    title="Disk"
                    bind:minValue={minDisk}
                    bind:maxValue={maxDisk}
                    min={512}
                    max={8192}
                    step={512}
                    formatValue={formatMemory}
                />
            {/if}
        </div>
 
        <!-- Right Column -->
        <div class="space-y-6">
            <!-- Current Usage -->
            <div class="bg-neutral-900 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-white mb-6">Current Resource Usage</h2>
                
                <Meter
                    icon={Cpu}
                    title="CPU Usage"
                    current={app.current_usage.cpu}
                    max={100}
                    formatValue={val => `${val}%`}
                />
                
                <Meter
                    icon={MemoryStick}
                    title="Memory Usage" 
                    current={app.current_usage.memory}
                    max={memory.current}
                    formatValue={formatMemory}
                />
                
                <Meter
                    icon={Database}
                    title="Disk Usage"
                    current={app.current_usage.disk}
                    max={disk.current}
                    formatValue={formatMemory}
                />
            </div>
 
            <!-- Autoscaling Rules Summary -->
            {#if autoscalingEnabled}
                <div class="bg-neutral-900 rounded-lg p-6">
                    <h2 class="text-lg font-semibold text-white mb-4">Autoscaling Rules</h2>
                    <div class="space-y-4">
                        {#each [
                            { title: 'Instance Limits', min: minInstances, max: maxInstances },
                            { title: 'Memory Limits', min: formatMemory(minMemory), max: formatMemory(maxMemory) },
                            { title: 'CPU Limits', min: `${minCpu}%`, max: `${maxCpu}%` },
                            { title: 'Disk Limits', min: formatMemory(minDisk), max: formatMemory(maxDisk) }
                        ] as rule}
                            <div class="bg-neutral-800 rounded-lg p-4">
                                <h3 class="text-sm text-gray-400 mb-2">{rule.title}</h3>
                                <div class="text-white">
                                    Min: {rule.min}
                                    <br>
                                    Max: {rule.max}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
 
    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4">
        <button class="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
            Cancel
        </button>
        <button 
            on:click={handleApplyChanges}
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
        >
            {#if saving}
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Applying Changes...</span>
            {:else}
                <span>Apply Changes</span>
            {/if}
        </button>
    </div>
 </div>