<script>
    import '../../app.css'
    import { onMount } from 'svelte'
    import { auth } from '../../stores/auth'
    import { page } from '$app/stores'
    import { authGuard } from '../../stores/authGuard'
    import { browser } from '$app/environment'
    import Navbar from '../../components/Navbar.svelte'

    /** @type {{ avatar: any; name: any; email?: string; } | null} */
    let user = null
    let loading = true
    const isDev = import.meta.env.MODE === 'development'

    auth.subscribe(state => {
        user = state.user
        loading = state.loading
    })

    if (isDev && !user) {
        user = {
            name: 'Dev User',
            email: 'dev@example.com',
            avatar: ''
        }
        loading = false
    }

    $: if (browser && $page.url.pathname && !isDev) {
        authGuard.requireAuth($page.url.pathname)
    }

    onMount(() => {
        if (!isDev) {
            auth.checkAuth()
        }
    })
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen bg-black">
        <Spinner size="12" class="text-gray-200 animate-spin" />
    </div>
{:else if user}
    <div class="min-h-screen text-gray-200">
        <Navbar></Navbar>
        <main class="pt-4.5">
            <div style="height: 72px;"></div>
            <slot></slot>
        </main>
    </div>
{:else}
    <h1 class="text-white text-5xl text-center">AUTH ERROR</h1>
{/if}