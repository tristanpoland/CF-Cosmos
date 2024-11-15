<script lang="ts">
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { Play, Server, MemoryStick, Database, Cpu } from 'lucide-svelte';
import Slider from '../../../../../../../components/Slider.svelte';
import AutoscaleSlider from '../../../../../../../components/AutoscaleSlider.svelte';

const source = $page.url.searchParams.get('source');
const { orgId, spaceId } = $page.params;

let loading = false;
let error: string | null = null;
let autoscalingEnabled = false;
let aceEnabled = false;

type SourceField = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: Array<{value: string, label: string}>;
}

type FormData = {
    name: string;
    instances: number;
    memory: number;
    disk_quota: number;
    cpu_limit: number;
    source_config: Record<string, any>;
    env: Record<string, any>;
    [key: string]: any;
}

let formData: FormData = {
    name: '',
    instances: 1,
    memory: 256,
    disk_quota: 512,
    cpu_limit: 100,
    source_config: {},
    env: {}
};

function getSourceFields(source: string): SourceField[] {
    switch(source) {
        case 'github':
            return [
                { id: 'repo', label: 'Repository', type: 'text', placeholder: 'owner/repo', required: true },
                { id: 'branch', label: 'Branch', type: 'text', placeholder: 'main', required: true }
            ];
        case 'gitlab':
            return [
                { id: 'project', label: 'Project', type: 'text', placeholder: 'group/project', required: true },
                { id: 'branch', label: 'Branch', type: 'text', placeholder: 'main', required: true }
            ];
        case 'git':
            return [
                { id: 'url', label: 'Repository URL', type: 'text', placeholder: 'https://github.com/user/repo.git', required: true },
                { id: 'branch', label: 'Branch', type: 'text', placeholder: 'main', required: true }
            ];
        case 'docker':
            return [
                { id: 'image', label: 'Image', type: 'text', placeholder: 'nginx:latest', required: true }
            ];
        case 'shell':
            return [];
        default:
            return [];
    }
}

// Initialize source fields in formData
$: {
    if (source) {
        const fields = getSourceFields(source);
        fields.forEach(field => {
            if (!(field.id in formData)) {
                formData[field.id] = '';
            }
        });
    }
}

$: sourceFields = getSourceFields(source ?? '');

let resourceConfigs = [
    {
        icon: Server,
        title: "Application Instances",
        value: 1,
        minValue: 1,
        maxValue: 10,
        min: 1,
        max: 20,
        step: 1,
        format: (val: number) => val.toString()
    },
    {
        icon: MemoryStick,
        title: "Memory per Instance",
        value: 256,
        minValue: 256,
        maxValue: 512,
        min: 128,
        max: 4096,
        step: 128,
        format: (val: number) => val >= 1024 ? `${(val/1024).toFixed(1)}GB` : `${val}MB`
    },
    {
        icon: Database,
        title: "Disk Quota",
        value: 512,
        minValue: 512,
        maxValue: 1024,
        min: 512,
        max: 8192,
        step: 512,
        format: (val: number) => val >= 1024 ? `${(val/1024).toFixed(1)}GB` : `${val}MB`
    },
    {
        icon: Cpu,
        title: "CPU Limit",
        value: 100,
        minValue: 0,
        maxValue: 400,
        min: 0,
        max: 400,
        step: 5,
        format: (val: number) => `${val}%`
    }
];

function handleScalingModeChange() {
    if (!autoscalingEnabled) {
        resourceConfigs.forEach(config => {
            config.minValue = config.value;
            config.maxValue = config.value;
        });
    }
}

async function handleSubmit() {
    loading = true;
    error = null;

    try {
        // Add source-specific config
        const sourceConfig = sourceFields.reduce((acc, field) => {
            acc[field.id] = formData[field.id];
            return acc;
        }, {} as Record<string, any>);

        // Prepare submission data
        const submitData = {
            ...formData,
            source_type: source,
            source_config: sourceConfig,
            instances: resourceConfigs[0].value,
            memory: resourceConfigs[1].value,
            disk_quota: resourceConfigs[2].value,
            cpu_limit: resourceConfigs[3].value
        };

        if (autoscalingEnabled) {
            (submitData as any).autoscaling = {
                enabled: true,
                ace_enabled: aceEnabled,
                instances: {
                    min: resourceConfigs[0].bind.min,
                    max: resourceConfigs[0].bind.max
                },
                memory: {
                    min: resourceConfigs[1].bind.min,
                    max: resourceConfigs[1].bind.max
                },
                disk: {
                    min: resourceConfigs[2].bind.min,
                    max: resourceConfigs[2].bind.max
                },
                cpu: {
                    min: resourceConfigs[3].bind.min,
                    max: resourceConfigs[3].bind.max
                }
            };
        }

        const response = await fetch(`/api/orgs/${orgId}/spaces/${spaceId}/apps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitData)
        });

        if (!response.ok) {
            throw new Error('Failed to create application');
        }

        const result = await response.json();
        goto(`/app/org/${orgId}/spaces/${spaceId}/applications/${result.guid}`);

    } catch (e) {
        error = e instanceof Error ? e.message : 'An error occurred while creating the application';
        console.error('Deployment error:', e);
    } finally {
        loading = false;
    }
}
</script>


<div class="max-w-4xl mx-auto my-8">
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <!-- Basic Details -->
      <div class="space-y-4">
        <h2 class="text-lg font-medium text-white">Application Details</h2>
        <div class="space-y-2">
          <label for="name" class="block text-sm font-medium">Application Name</label>
          <input
            id="name"
            type="text" 
            bind:value={formData.name}
            required
            class="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="my-application"
          />
        </div>
      </div>
   
      <!-- Source Configuration -->
      {#if sourceFields.length > 0}
      <div class="space-y-4">
        <h2 class="text-lg font-medium text-white">Source Configuration</h2> 
        <div class="space-y-4">
          {#each sourceFields as field}
          <div class="space-y-2">
            <label for={field.id} class="block text-sm font-medium">{field.label}</label>
            {#if field.type === 'select'}
            <select
              id={field.id}
              bind:value={formData[field.id]}
              required={field.required}
              class="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {#each field.options || [] as option}
              <option value={option.value}>{option.label}</option>
              {/each}
            </select>
            {:else}
            <input
              id={field.id}
              type={field.type}
              bind:value={formData[field.id]}
              required={field.required}
              placeholder={field.placeholder}
              class="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {/if}
          </div>
          {/each}
        </div>
      </div>
      {/if}
   
      <!-- Resource Configuration -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-white">Resource Configuration</h2>
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
                      after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
            </div>
            <span class="ml-2">Enable Autoscaling</span>
          </label>
        </div>
   
        {#if !autoscalingEnabled}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each resourceConfigs as config}
          <Slider 
            icon={config.icon}
            title={config.title}
            bind:value={config.value}
            min={config.min}
            max={config.max}
            step={config.step}
            formatValue={config.format}
          />
          {/each}
        </div>
        {:else}
        <div class="space-y-4">
          <div class="bg-neutral-800 rounded-lg p-4">
            <h3 class="text-sm font-medium text-white mb-4">AI-powered Scaling</h3>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                bind:checked={aceEnabled}
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
              <span class="ml-2">Use AI scaling engine (ACE)</span>
            </label>
          </div>
   
          {#each resourceConfigs as config}
          <AutoscaleSlider
            icon={config.icon}
            title={config.title}
            bind:minValue={config.minValue}
            bind:maxValue={config.maxValue}
            bind:value={config.value}
            min={config.min}
            max={config.max}
            step={config.step}
            formatValue={config.format}
          />
          {/each}
        </div>
        {/if}
      </div>
   
      {#if error}
      <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
        {error}
      </div>
      {/if}
   
      <!-- Submit Button -->
      <div class="flex justify-end space-x-4">
        <button 
          type="button"
          class="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          on:click={() => goto(`/app/org/${orgId}/spaces/${spaceId}/applications`)}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          class="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <Play class="w-4 h-4" />
          <span>{loading ? 'Deploying...' : 'Deploy Application'}</span>
        </button>
      </div>
    </form>
</div>