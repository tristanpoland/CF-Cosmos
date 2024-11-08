<script>
    import '../app.css'
    import { onMount } from 'svelte'
    import { auth } from '../stores/auth'
    import { page } from '$app/stores'
    import { authGuard } from '../stores/authGuard'
    import { Navbar, NavBrand, NavHamburger, NavUl, NavLi, Dropdown, DropdownItem, Avatar, Spinner, Button, Input } from 'flowbite-svelte'
    import { SearchOutline } from 'flowbite-svelte-icons'
    import { browser } from '$app/environment'

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
        <Navbar class="fixed w-full z-20 bg-opacity-90 bg-black backdrop-blur-lg shadow-lg">
            <!-- Brand -->
            <NavBrand href="/" class="flex items-center">
                <img src="/cflogo.png" class="mr-3 h-8 sm:h-10" alt="CF Logo" />
                <span class="self-center text-2xl font-bold text-white">
                    CF Cosmos
                </span>
            </NavBrand>

            <!-- Navigation Links - Now with flex-1 to take up space and justify-center -->
            <NavUl class="flex-1 flex justify-center items-center mx-4 hidden md:flex">
                <NavLi href="/" active={$page.url.pathname === '/'}>Home</NavLi>
                <NavLi href="/about" active={$page.url.pathname === '/about'}>About</NavLi>
                <NavLi href="/docs" active={$page.url.pathname.startsWith('/docs')}>Docs</NavLi>
            </NavUl>

            <!-- Search and Profile - Now properly aligned to the right -->
            <div class="flex items-center gap-2">
                <!-- Search -->
                <Button color="none" data-collapse-toggle="mobile-menu-3" aria-controls="mobile-menu-3" aria-expanded="false" 
                    class="md:hidden text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 rounded-lg text-sm p-2.5">
                    <SearchOutline class="w-5 h-5" />
                </Button>
                <div class="hidden relative md:block">
                    <div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">
                        <SearchOutline class="w-4 h-4" />
                    </div>
                    <Input id="search-navbar" class="ps-10 bg-gray-800 text-gray-200 border-gray-600" placeholder="Search..." />
                </div>

                <!-- Profile Dropdown -->
                <Dropdown triggeredBy="#avatar" class="bg-black text-gray-200 shadow-lg">
                    <div slot="trigger">
                        <Avatar
                            id="avatar"
                            class="cursor-pointer ring-2 ring-gray-600 hover:ring-gray-400 transition-all"
                            src={user.avatar || ''}
                            alt={user.name}
                        />
                    </div>
                    <DropdownItem href="/profile" class="hover:bg-gray-800 transition-colors duration-150">Profile</DropdownItem>
                    <DropdownItem href="/settings" class="hover:bg-gray-800 transition-colors duration-150">Settings</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem on:click={() => auth.logout()} class="hover:bg-red-700 transition-colors duration-150">
                        Sign out
                    </DropdownItem>
                </Dropdown>

                <!-- Mobile Menu Button - Only visible on mobile -->
                <NavHamburger class="md:hidden text-white hover:text-gray-300" />
            </div>
        </Navbar>
        <main class="pt-24 px-4 sm:px-6 lg:px-8">
            <slot />
        </main>
    </div>
{:else}
    <h1 class="text-white text-5xl text-center">AUTH ERROR</h1>
{/if}