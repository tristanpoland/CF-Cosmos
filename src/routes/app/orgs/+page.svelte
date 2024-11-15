<!-- src/routes/organizations/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { Building2, Plus, Users, Cloud } from 'lucide-svelte';
    import DynamicFormModal from '../../../components/FormModal.svelte';
    
    // Mock data - replace with store/API
    let organizations = [
        {
            guid: '1',
            name: 'FiveTwenty INC',
            slug: 'fivetwenty-inc',
            spaces: 5,
            users: 12,
            memory_usage: 4.2,
            memory_quota: 10
        },
        {
            guid: '2',
            name: 'CNCF',
            slug: 'cncf',
            spaces: 3,
            users: 8,
            memory_usage: 7.8,
            memory_quota: 20
        }
    ];
    
    let showNewOrgModal = false;

    // Form configuration for new organization
    const newOrgFormConfig = {
        title: 'New Organization',
        endpoint: '/api/organizations',
        fields: [
            {
                id: 'name',
                label: 'Organization Name',
                type: 'text',
                placeholder: 'Enter organization name',
                required: true,
                validations: [
                    {
                        rule: (value) => value.length >= 3,
                        message: 'Organization name must be at least 3 characters'
                    },
                    {
                        rule: (value) => /^[a-zA-Z0-9\s-]+$/.test(value),
                        message: 'Organization name can only contain letters, numbers, spaces, and hyphens'
                    }
                ]
            },
            {
                id: 'memory_quota',
                label: 'Memory Quota (GB)',
                type: 'number',
                required: true,
                min: 1,
                max: 100,
                placeholder: 'Enter memory quota in GB'
            },
            {
                id: 'org_type',
                label: 'Organization Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'business', label: 'Business' },
                    { value: 'nonprofit', label: 'Non-Profit' },
                    { value: 'education', label: 'Educational' }
                ]
            }
        ]
    };

    function handleFormSuccess(event: CustomEvent) {
        const newOrgData = {
            ...event.detail.data,
            guid: crypto.randomUUID(),
            slug: generateSlug(event.detail.data.name),
            spaces: 0,
            users: 1,
            memory_usage: 0
        };
        
        organizations = [...organizations, newOrgData];
    }

    function generateSlug(name: string): string {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
</script>

<div class="space-y-6 min-h-screen bg-neutral-950 text-gray-300 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <div class="text-sm text-gray-400 mb-1">
                <a href="/app/orgs" class="hover:text-white transition-colors">Organizations</a>
                <span class="mx-2">/</span>
            </div>
            <div class="flex items-center space-x-3">
                <Building2 class="w-6 h-6 text-blue-400" />
                <h1 class="text-2xl font-semibold text-white">Organizations</h1>
            </div>
        </div>  
        <button 
            on:click={() => showNewOrgModal = true}
            class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
            <Plus class="w-4 h-4" />
            <span>New Organization</span>
        </button>
    </div>

    <!-- Organizations Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {#each organizations as org}
            <div class="group relative overflow-hidden rounded-lg bg-neutral-900 p-6">
                <div class="absolute inset-0 bg-gradient-to-bl from-blue-950/30 via-transparent to-transparent"></div>
                <div class="relative">
                    <h3 class="text-xl font-semibold text-white mb-4">{org.name}</h3>
                    
                    <div class="space-y-4">
                        <!-- Spaces -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2 text-gray-400">
                                <Cloud class="w-4 h-4" />
                                <span>Spaces</span>
                            </div>
                            <span class="text-white">{org.spaces}</span>
                        </div>
                        
                        <!-- Users -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2 text-gray-400">
                                <Users class="w-4 h-4" />
                                <span>Users</span>
                            </div>
                            <span class="text-white">{org.users}</span>
                        </div>
                        
                        <!-- Memory Usage -->
                        <div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-400">Memory Usage</span>
                                <span class="text-white">{org.memory_usage}GB / {org.memory_quota}GB</span>
                            </div>
                            <div class="w-full bg-neutral-800 rounded-full h-2">
                                <div 
                                    class="bg-blue-500 h-2 rounded-full transition-all"
                                    style="width: {(org.memory_usage / org.memory_quota) * 100}%"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-6 flex space-x-3">
                        <a href="/app/org/{org.slug}/spaces">
                            <button class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                View Spaces
                            </button>
                        </a>
                        <button class="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Dynamic Form Modal -->
    <DynamicFormModal
        show={showNewOrgModal}
        title={newOrgFormConfig.title}
        endpoint={newOrgFormConfig.endpoint}
        fields={newOrgFormConfig.fields}
        on:close={() => showNewOrgModal = false}
        on:success={handleFormSuccess}
    />
</div>