<script>
    import { SearchOutline } from 'flowbite-svelte-icons';
    import { 
        Navbar, 
        NavBrand, 
        NavUl, 
        NavLi, 
        Button, 
        Input, 
        Dropdown, 
        DropdownItem, 
        NavHamburger 
    } from 'flowbite-svelte';
</script>

<Navbar class="fixed w-full z-20 bg-opacity-30 bg-black backdrop-blur-lg shadow-lg">
    <!-- Brand -->
    <NavBrand href="/" class="flex items-center">
        <img src="/cflogo.png" class="mr-3 h-8 sm:h-10" alt="CF Logo" />
        <span class="self-center text-2xl font-bold text-white">
            CF Cosmos
        </span>
    </NavBrand>

    <!-- Navigation Links - Now with flex-1 to take up space and justify-center -->
    <NavUl class="flex-1 flex flex-row justify-center items-center mx-4 hidden md:flex">
        <NavLi href="/app">Dashboard</NavLi>
        <NavLi href="/app/applications">Appliactions</NavLi>
        <NavLi href="/docs">Docs</NavLi>
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