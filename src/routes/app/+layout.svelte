<script>
    import '../../app.css'
    import { onMount } from 'svelte'
    import { auth } from '../../stores/auth'
    import { page } from '$app/stores'
    //import { authGuard } from '../../stores/authGuard'
    import { browser } from '$app/environment'
    import Navbar from '../../components/Navbar.svelte'
    import { Spinner } from 'flowbite-svelte'
    
    /** @type {{ avatar: any; name: any; email?: string; } | null} */
    let user = null
    let loading = true
    const isDev = import.meta.env.MODE === 'development'
    let isTestMode = true
    let initialized = false

    auth.subscribe(state => {
        user = state.user
        loading = state.loading
    })

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search)
        isTestMode = urlParams.has('test')
        initialized = true
        
        if (isDev || isTestMode) {
            user = {
                name: 'Test User',
                email: 'test@example.com',
                avatar: ''
            }
            loading = false
        } else if (!user) {
            auth.checkAuth()
        }
    })

    //$: if (browser && $page.url.pathname && initialized && !isDev && !isTestMode && !user) {
    //    authGuard.requireAuth($page.url.pathname)
    //}
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
<div class="min-h-screen text-gray-200">
    <Navbar></Navbar>
    <main class="pt-4.5">
        <div style="height: 72px;"></div>
        <slot></slot>
    </main>
</div>
{/if}