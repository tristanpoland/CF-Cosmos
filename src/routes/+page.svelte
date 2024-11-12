<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { 
        Github, Globe, Heart, Coffee, Cloud, Database, 
        Server, Activity, Star, GitFork, Users, Clock,
        GitCommit, GitBranch
    } from 'lucide-svelte';
    import Navbar from '../components/Navbar.svelte';
    
    let visible = false;
    let githubStats = {
        stars: null,
        forks: null,
        contributors: null,
        lastUpdate: null,
        totalCommits: null,
        recentCommits: null,
        loading: true,
        error: null
    };

    async function fetchGithubStats() {
        try {
            // Replace with your actual repo details
            const repoOwner = 'tristanpoland';
            const repoName = 'CF-Cosmos';
            
            const [repoData, contributorsData, commitsData, recentCommitsData] = await Promise.all([
                fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`).then(r => r.json()),
                fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contributors?per_page=1`).then(r => {
                    const linkHeader = r.headers.get('link');
                    if (linkHeader && linkHeader.includes('rel="last"')) {
                        const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
                        return match ? parseInt(match[1]) : 0;
                    }
                    return r.json().then(data => data.length);
                }),
                fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=1`).then(r => {
                    const linkHeader = r.headers.get('link');
                    if (linkHeader && linkHeader.includes('rel="last"')) {
                        const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
                        return match ? parseInt(match[1]) : 0;
                    }
                    return r.json().then(data => data.length);
                }),
                fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=30`).then(r => r.json())
                    .then(commits => commits.length)
            ]);

            githubStats = {
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                contributors: contributorsData,
                lastUpdate: new Date(repoData.updated_at).toLocaleDateString(),
                totalCommits: commitsData,
                recentCommits: recentCommitsData,
                loading: false,
                error: null
            };
        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            githubStats = {
                stars: 0,
                forks: 0,
                contributors: 0,
                lastUpdate: 'N/A',
                loading: false,
                error: 'Failed to load GitHub stats'
            };
        }
    }

    const features = [
        {
            title: 'Modern Dashboard',
            description: 'A sleek, intuitive interface for managing your Cloud Foundry applications and services with real-time updates and comprehensive monitoring.',
            icon: Cloud
        },
        {
            title: 'Resource Management',
            description: 'Easy-to-use tools for monitoring application states, service bindings, memory usage, and instance health across your Cloud Foundry environment.',
            icon: Database
        },
        {
            title: 'Activity Tracking',
            description: 'Detailed activity feeds and audit logs to help you stay informed about changes and events within your Cloud Foundry organization.',
            icon: Activity
        },
        {
            title: 'Performance Metrics',
            description: 'Visual representations of key performance indicators and resource utilization to help optimize your application deployment.',
            icon: Server
        }
    ];

    let intersectingFeatures = new Array(features.length).fill(false);
    let intersectingStats = false;

    function handleIntersection(type: 'feature' | 'stats', index?: number) {
        if (type === 'feature' && typeof index === 'number') {
            intersectingFeatures[index] = true;
        } else if (type === 'stats') {
            intersectingStats = true;
        }
    }

    onMount(() => {
        visible = true;
        fetchGithubStats();
    });
</script>

<div class="bg-black">
    <Navbar />
    <div class="min-h-screen bg-neutral-950 text-gray-300">
        <!-- Hero Section -->
        {#if visible}
        <div class="relative overflow-hidden py-24 sm:py-32" in:fade={{ duration: 1000 }}>
            <div class="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-neutral-950/20"></div>
            <div class="relative px-6 lg:px-8">
                <div class="mx-auto max-w-2xl text-center">
                    <div in:fly={{ y: 50, duration: 1000 }}>
                        <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-2">
                            Cosmos Web UI
                        </h1>
                        <div class="inline-block p-2 rounded-full bg-blue-500/10 mb-8">
                            <Cloud class="w-12 h-12 text-blue-400" />
                        </div>
                    </div>
                    <div in:fly={{ y: 50, duration: 1000, delay: 300 }}>
                        <p class="text-lg leading-8 text-gray-400">
                            A next-generation dashboard for Cloud Foundry, delivering powerful management 
                            capabilities with an elegant and intuitive interface.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        {/if}

        <!-- GitHub Stats Section -->
        <div class="py-16" 
            use:inview={{ threshold: 0.2 }}
            on:inview={() => handleIntersection('stats')}>
            {#if intersectingStats}
                <div class="mx-auto max-w-7xl px-6 lg:px-8"
                    in:fly={{ y: 50, duration: 1000 }}>
                    {#if githubStats.loading}
                        <div class="text-center text-gray-400">
                            Loading GitHub statistics...
                        </div>
                    {:else if githubStats.error}
                        <div class="text-center text-red-400">
                            {githubStats.error}
                        </div>
                    {:else}
                        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            {#each [
                                { icon: Star, value: githubStats.stars, label: 'Stars', color: 'text-yellow-400' },
                                { icon: GitFork, value: githubStats.forks, label: 'Forks', color: 'text-blue-400' },
                                { icon: Users, value: githubStats.contributors, label: 'Contributors', color: 'text-green-400' },
                                { icon: GitCommit, value: githubStats.totalCommits, label: 'Total Commits', color: 'text-orange-400' },
                                { icon: GitBranch, value: githubStats.recentCommits, label: 'Recent Commits', color: 'text-indigo-400' },
                                { icon: Clock, value: githubStats.lastUpdate, label: 'Last Update', color: 'text-purple-400' }
                            ] as stat}
                                <div class="relative overflow-hidden rounded-2xl bg-neutral-900 p-6 lg:col-span-1 xl:col-span-1 group">
                                    <div class="absolute inset-0 bg-gradient-to-bl from-blue-950/30 via-transparent to-transparent"></div>
                                    <div class="relative flex items-center transition-transform transform group-hover:scale-105">
                                        <svelte:component this={stat.icon} class={`h-6 w-6 ${stat.color} mr-3`} />
                                        <div>
                                            <p class="text-2xl font-semibold text-white">
                                                {stat.value?.toLocaleString() ?? 0}
                                            </p>
                                            <p class="text-sm text-gray-400">{stat.label}</p>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}
        </div>


        <!-- Features Section -->
        <div class="py-16">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <div class="text-center mb-16" in:fade={{ duration: 1000, delay: 500 }}>
                    <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Powerful Features
                    </h2>
                    <p class="mt-4 text-lg text-gray-400">
                        Everything you need to manage your Cloud Foundry environment
                    </p>
                </div>

                <div class="grid gap-8 grid-cols-1 sm:grid-cols-2">
                    {#each features as feature, i}
                        <div
                            use:inview={{ threshold: 0.5 }}
                            on:inview={() => handleIntersection('feature', i)}
                        >
                            {#if intersectingFeatures[i]}
                                <div
                                    class="relative group"
                                    in:fly={{ x: i % 2 === 0 ? -50 : 50, duration: 1000, delay: i * 200 }}
                                >
                                    <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                    <div class="relative px-8 py-10 bg-neutral-900 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                                        <svelte:component this={feature.icon} class="w-8 h-8 text-blue-400 flex-shrink-0" />
                                        <div class="space-y-2">
                                            <p class="text-xl font-semibold text-white">
                                                {feature.title}
                                            </p>
                                            <p class="text-gray-400">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="border-t border-neutral-800 mt-12">
            <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div class="flex justify-center space-x-6 md:order-2">
                    <a href="https://github.com/tristanpoland/CF-Cosmos" class="text-gray-400 hover:text-gray-300 transition-colors duration-300">
                        <Github class="h-6 w-6" />
                    </a>
                    <a href="#" class="text-gray-400 hover:text-gray-300 transition-colors duration-300">
                        <Globe class="h-6 w-6" />
                    </a>
                </div>
                <div class="mt-8 md:order-1 md:mt-0 text-center md:text-left">
                    <div class="flex md:justify-start space-x-2 text-gray-400">
                        <span>Made with</span>
                        <Heart class="h-5 w-5 text-red-500" />
                        <span>and</span>
                        <Coffee class="h-5 w-5 text-yellow-500" />
                        <span>by Tristan J. Poland</span>
                    </div>
                    <p class="mt-2 text-xs text-gray-400">
                        © {new Date().getFullYear()} Cosmos Web UI for Cloud Foundry. Licensed under Apache 2.0.
                    </p>
                </div>
            </div>
        </footer>
    </div>
</div>
<script context="module">
    function inview(node, params = {}) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        node.dispatchEvent(new CustomEvent('inview'));
                        if (!params.persistent) {
                            observer.unobserve(node);
                        }
                    }
                });
            },
            {
                threshold: params.threshold || 0,
            }
        );

        observer.observe(node);

        return {
            destroy() {
                observer.unobserve(node);
            }
        };
    }
</script>