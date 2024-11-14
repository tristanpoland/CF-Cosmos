<script lang="ts">
    import { page } from '$app/stores';
    import { Scale, MemoryStick, Database, Cpu, Gauge, Server } from 'lucide-svelte';
    import AutoscaleSlider from '../../../../../../../../../components/AutoscaleSlider.svelte';
    import Slider from '../../../../../../../../../components/Slider.svelte';
    import Meter from '../../../../../../../../../components/Meter.svelte';

    $: appId = $page.params.appId;
    
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

    let app = {
        name: 'frontend-app',
        instances: 2,
        memory: 512,
        disk_quota: 1024,
        cpu_limit: 100,
        current_usage: {
            cpu: 78,
            memory: 423,
            disk: 756
        }
    };

    let autoscalingEnabled = false;
    let aceEnabled = false;
    let instances = { min: app.instances, max: app.instances * 2, current: app.instances };
    let memory = { min: app.memory, max: app.memory * 2, current: app.memory };
    let disk = { min: app.disk_quota, max: app.disk_quota * 2, current: app.disk_quota };
    let cpu = { min: 0, max: 400, current: app.cpu_limit };

    function formatMemory(mb) {
        return mb >= 1024 ? `${(mb/1024).toFixed(1)}GB` : `${mb}MB`;
    }

    const sliderConfigs = [
        {
            icon: Server,
            title: "Application Instances",
            bind: instances,
            min: 1,
            max: 20,
            step: 1,
            format: (val) => val.toString()
        },
        {
            icon: MemoryStick,
            title: "Memory per Instance",
            bind: memory,
            min: 128,
            max: 4096,
            step: 128,
            format: formatMemory
        },
        {
            icon: Cpu,
            title: "CPU Limit",
            bind: cpu,
            min: 0,
            max: 400,
            step: 5,
            format: (val) => `${val}%`
        },
        {
            icon: Database,
            title: "Disk Quota",
            bind: disk,
            min: 512,
            max: 8192,
            step: 512,
            format: formatMemory
        }
    ];

    const meterConfigs = [
        {
            icon: Cpu,
            title: "CPU Usage",
            current: app.current_usage.cpu,
            max: 100,
            format: (val) => `${val}%`
        },
        {
            icon: MemoryStick,
            title: "Memory Usage",
            current: app.current_usage.memory,
            max: memory.current,
            format: formatMemory
        },
        {
            icon: Database,
            title: "Disk Usage",
            current: app.current_usage.disk,
            max: disk.current,
            format: formatMemory
        }
    ];

    let scaling = false;
    let saving = false;
    let error = null;

    async function handleScale() {
        scaling = true;
        error = null;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (autoscalingEnabled) {
                app.instances = instances.current;
                app.memory = memory.current;
                app.disk_quota = disk.current;
                app.cpu_limit = cpu.current;
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
            cpu = { min: app.cpu_limit, max: app.cpu_limit, current: app.cpu_limit };
        }
    }
</script>
 
<div class="min-h-screen bg-neutral-950 text-gray-300 p-6 space-y-6">
    <div class="flex items-center space-x-3">
        <Scale class="w-6 h-6 text-blue-400" />
        <h1 class="text-2xl font-semibold text-white">Scale {app.name}</h1>
    </div>
 
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="space-y-6 lg:col-span-2">
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
                {#each sliderConfigs as config}
                    <Slider 
                        icon={config.icon}
                        title={config.title}
                        bind:value={config.bind.current}
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        formatValue={config.format}
                    />
                {/each}
            {:else}
            
                <div class="bg-neutral-900 rounded-lg p-6">
                    <div class="flex justify-between items-center">
                        <h2 class="text-lg font-semibold text-white flex items-center space-x-2">
                            <Gauge class="w-5 h-5 text-blue-400" />
                            <span>Use AI scaling engine (ACE)</span>
                        </h2>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                bind:checked={aceEnabled} 
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

                {#each sliderConfigs as config}
                    <AutoscaleSlider
                        icon={config.icon}
                        title={config.title}
                        bind:minValue={config.bind.min}
                        bind:maxValue={config.bind.max}
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        formatValue={config.format}
                    />
                {/each}
            {/if}
        </div>
 
        <div class="space-y-6">
            <div class="bg-neutral-900 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-white mb-6">Current Resource Usage</h2>
                {#each meterConfigs as config}
                    <Meter
                        icon={config.icon}
                        title={config.title}
                        current={config.current}
                        max={config.max}
                        formatValue={config.format}
                    />
                {/each}
            </div>
 
            {#if autoscalingEnabled}
                <div class="bg-neutral-900 rounded-lg p-6">
                    <h2 class="text-lg font-semibold text-white mb-4">Autoscaling Rules</h2>
                    <div class="space-y-4">
                        {#each sliderConfigs as config}
                            <div class="bg-neutral-800 rounded-lg p-4">
                                <h3 class="text-sm text-gray-400 mb-2">{config.title} Limits</h3>
                                <div class="text-white">
                                    Min: {config.format(config.bind.min)}
                                    <br>
                                    Max: {config.format(config.bind.max)}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
 
    <div class="flex justify-end space-x-4">
        <button class="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
            Cancel
        </button>
        <button 
            on:click={handleScale}
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