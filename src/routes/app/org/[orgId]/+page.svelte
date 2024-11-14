<!-- src/routes/organizations/[orgId]/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { Building2, Users, Cloud, Server, Database, Activity, Settings } from 'lucide-svelte';
    
    let org = {
        name: "Development Org",
        stats: {
            spaces: 5,
            users: 12,
            apps: 24,
            services: 15,
            memory_used: 8.5,
            memory_quota: 16,
            routes: 18,
            domains: 3
        },
        recent_activity: [
            { type: 'app_start', name: 'frontend-app', user: 'john.doe', time: '10m ago' },
            { type: 'service_bind', name: 'database-service', user: 'jane.smith', time: '25m ago' },
            { type: 'space_created', name: 'testing', user: 'admin', time: '1h ago' }
        ],
        memory_trends: [
            { month: 'Jan', usage: 6.2 },
            { month: 'Feb', usage: 7.1 },
            { month: 'Mar', usage: 8.5 }
        ]
    };
</script>

<div class="space-y-6 min-h-screen bg-neutral-950 text-gray-300 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div class="flex items-center space-x-3">
            <Building2 class="w-6 h-6 text-blue-400" />
            <h1 class="text-2xl font-semibold text-white">{org.name}</h1>
        </div>
        <button class="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
            <Settings class="w-4 h-4" />
            <span>Organization Settings</span>
        </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Spaces -->
        <div class="bg-neutral-900 rounded-lg p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-400">Spaces</p>
                    <p class="text-2xl font-semibold text-white mt-1">{org.stats.spaces}</p>
                </div>
                <Cloud class="w-5 h-5 text-blue-400" />
            </div>
        </div>

        <!-- Applications -->
        <div class="bg-neutral-900 rounded-lg p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-400">Applications</p>
                    <p class="text-2xl font-semibold text-white mt-1">{org.stats.apps}</p>
                </div>
                <Server class="w-5 h-5 text-blue-400" />
            </div>
        </div>

        <!-- Services -->
        <div class="bg-neutral-900 rounded-lg p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-400">Services</p>
                    <p class="text-2xl font-semibold text-white mt-1">{org.stats.services}</p>
                </div>
                <Database class="w-5 h-5 text-blue-400" />
            </div>
        </div>

        <!-- Users -->
        <div class="bg-neutral-900 rounded-lg p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-400">Users</p>
                    <p class="text-2xl font-semibold text-white mt-1">{org.stats.users}</p>
                </div>
                <Users class="w-5 h-5 text-blue-400" />
            </div>
        </div>
    </div>

    <!-- Memory Usage and Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Memory Usage Card -->
        <div class="lg:col-span-2 bg-neutral-900 rounded-lg p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Memory Usage</h2>
            <div class="space-y-4">
                <div>
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-400">Current Usage</span>
                        <span class="text-white">{org.stats.memory_used}GB / {org.stats.memory_quota}GB</span>
                    </div>
                    <div class="w-full bg-neutral-800 rounded-full h-2">
                        <div 
                            class="bg-blue-500 h-2 rounded-full transition-all"
                            style="width: {(org.stats.memory_used / org.stats.memory_quota) * 100}%"
                        ></div>
                    </div>
                </div>
                
                <!-- Memory Trend -->
                <div class="pt-4">
                    <h3 class="text-sm text-gray-400 mb-4">3 Month Trend</h3>
                    <div class="flex items-end space-x-2 h-32">
                        {#each org.memory_trends as trend}
                            <div class="flex-1 flex flex-col items-center">
                                <div class="w-full bg-blue-900/50 rounded-t"
                                     style="height: {(trend.usage / org.stats.memory_quota) * 100}%">
                                </div>
                                <span class="text-xs text-gray-400 mt-2">{trend.month}</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-neutral-900 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-white">Recent Activity</h2>
                <Activity class="w-5 h-5 text-blue-400" />
            </div>
            <div class="space-y-4">
                {#each org.recent_activity as activity}
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 mt-2 rounded-full bg-blue-400"></div>
                        <div>
                            <p class="text-sm text-white">
                                {activity.name}
                                <span class="text-gray-400">by {activity.user}</span>
                            </p>
                            <p class="text-xs text-gray-400">{activity.time}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Additional Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Routes -->
        <div class="bg-neutral-900 rounded-lg p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Routes</h2>
            <div class="flex justify-between items-center">
                <span class="text-3xl font-bold text-white">{org.stats.routes}</span>
                <span class="text-sm text-gray-400">Across {org.stats.domains} domains</span>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-neutral-900 rounded-lg p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div class="grid grid-cols-2 gap-3">
                <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm">
                    Create Space
                </button>
                <button class="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-sm">
                    Invite User
                </button>
                <button class="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-sm">
                    Manage Quotas
                </button>
                <button class="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-sm">
                    View Billing
                </button>
            </div>
        </div>
    </div>
</div>