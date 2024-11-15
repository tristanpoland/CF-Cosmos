<script>
    import { SearchOutline } from 'flowbite-svelte-icons';
    import {
        Navbar,
        NavBrand,
        Button,
        Input,
        Dropdown,
        DropdownItem,
        NavHamburger,
        Avatar
    } from 'flowbite-svelte';
</script>

<Navbar class="fixed w-full z-20 bg-opacity-30 bg-black backdrop-blur-lg shadow-lg">
    <NavBrand href="/" class="flex items-center flex-shrink-0">
        <img src="/cflogo.png" class="mr-3 h-8 sm:h-10" alt="CF Logo" />
        <span class="self-center whitespace-nowrap text-2xl font-bold text-white">
            CF Cosmos
        </span>
    </NavBrand>

    <ul class="flex-1 flex justify-center space-x-8 items-center mx-4 hidden md:flex">
        <li><a href="/app">Dashboard</a></li>
        <li><a href="/app/orgs/">Orgs</a></li>
        <li><a href="/docs">Docs</a></li>
    </ul>
    
    <div class="flex items-center gap-2 flex-shrink-0">
        <Button color="none" data-collapse-toggle="mobile-menu-3" aria-controls="mobile-menu-3" aria-expanded="false"
            class="md:hidden text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 rounded-lg text-sm p-2.5">
            <SearchOutline class="w-5 h-5" />
        </Button>

        <div class="hidden relative md:block w-64">
            <div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">
                <SearchOutline class="w-4 h-4" />
            </div>
            <Input id="search-navbar" class="ps-10 bg-gray-800 text-gray-200 border-gray-600" placeholder="Search..." />
        </div>

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

        <NavHamburger class="md:hidden text-white hover:text-gray-300" />
    </div>
</Navbar>