<script>
    import { 
        Table, 
        TableBody, 
        TableBodyCell, 
        TableBodyRow, 
        TableHead, 
        TableHeadCell,
        Button,
        Badge,
        Spinner,
        Search,
        Select,
        Pagination,
        Dropdown,
        DropdownItem,
        Modal,
        Label,
        Input,
        Tooltip
    } from 'flowbite-svelte'
    import { 
        Play, 
        Square, 
        RefreshCw, 
        Trash2, 
        Settings,
        Plus,
        Filter
    } from 'lucide-svelte'
//    import { api } from '../services/api'
    import { onMount } from 'svelte'

    let loading = true
    let apps = []
    let error = null
    let searchTerm = ''
    let currentPage = 1
    let totalPages = 1
    let itemsPerPage = 10
    let selectedSpace = 'all'
    let showNewAppModal = false

    // New app form
    let newApp = {
        name: '',
        memory: 256,
        instances: 1,
        disk_quota: 1024,
        space_guid: ''
    }

    $: filteredApps = apps.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedSpace === 'all' || app.space_guid === selectedSpace)
    )

    async function fetchApps() {
        loading = true
        try {
            const response = await api.getApps(currentPage, itemsPerPage)
            apps = response.resources
            totalPages = Math.ceil(response.pagination.total_results / itemsPerPage)
        } catch (e) {
            error = e.message
        } finally {
            loading = false
        }
    }

    async function handleAction(appGuid, action) {
        try {
            switch (action) {
                case 'start':
                    await api.startApp(appGuid)
                    break
                case 'stop':
                    await api.stopApp(appGuid)
                    break
                case 'restart':
                    await api.stopApp(appGuid)
                    await api.startApp(appGuid)
                    break
                case 'delete':
                    if (confirm('Are you sure you want to delete this application?')) {
                        await api.deleteApp(appGuid)
                    }
                    break
            }
            await fetchApps()
        } catch (e) {
            error = e.message
        }
    }

    async function createNewApp() {
        try {
            await api.createApp(newApp)
            showNewAppModal = false
            await fetchApps()
            newApp = {
                name: '',
                memory: 256,
                instances: 1,
                disk_quota: 1024,
                space_guid: ''
            }
        } catch (e) {
            error = e.message
        }
    }

    function getStatusColor(state) {
        switch (state) {
            case 'STARTED':
                return 'green'
            case 'STOPPED':
                return 'gray'
            case 'CRASHED':
                return 'red'
            default:
                return 'blue'
        }
    }

    onMount(fetchApps)
</script>

<div class="space-y-6 p-6">
    <div class="sm:flex sm:items-center sm:justify-between">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Applications
        </h1>
        <Button color="blue" on:click={() => showNewAppModal = true}>
            <Plus class="mr-2 h-5 w-5" />
            New Application
        </Button>
    </div>

    <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="w-full md:w-1/3">
            <Search bind:value={searchTerm} placeholder="Search applications..." />
        </div>
        
        <div class="flex gap-2 items-center">
            <Select class="w-48" bind:value={selectedSpace}>
                <option value="all">All Spaces</option>
                <!-- We'll populate this with actual spaces -->
            </Select>
            
            <Button color="alternative">
                <Filter class="mr-2 h-4 w-4" />
                Filters
            </Button>
        </div>
    </div>

    {#if loading}
        <div class="flex justify-center p-8">
            <Spinner size="12" />
        </div>
    {:else if error}
        <p class="text-red-500">{error}</p>
    {:else}
        <Table hoverable={true}>
            <TableHead>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Instances</TableHeadCell>
                <TableHeadCell>Memory</TableHeadCell>
                <TableHeadCell>Disk</TableHeadCell>
                <TableHeadCell class="w-20">Actions</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each filteredApps as app}
                    <TableBodyRow>
                        <TableBodyCell>{app.name}</TableBodyCell>
                        <TableBodyCell>
                            <Badge color={getStatusColor(app.state)}>
                                {app.state}
                            </Badge>
                        </TableBodyCell>
                        <TableBodyCell>
                            {app.instances}
                        </TableBodyCell>
                        <TableBodyCell>
                            {app.memory_in_mb}MB
                        </TableBodyCell>
                        <TableBodyCell>
                            {app.disk_in_mb}MB
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex gap-2">
                                {#if app.state === 'STOPPED'}
                                    <Tooltip content="Start">
                                        <Button 
                                            size="xs" 
                                            color="green" 
                                            on:click={() => handleAction(app.guid, 'start')}
                                        >
                                            <Play class="h-4 w-4" />
                                        </Button>
                                    </Tooltip>
                                {:else}
                                    <Tooltip content="Stop">
                                        <Button 
                                            size="xs" 
                                            color="gray" 
                                            on:click={() => handleAction(app.guid, 'stop')}
                                        >
                                            <Square class="h-4 w-4" />
                                        </Button>
                                    </Tooltip>
                                {/if}
                                
                                <Dropdown>
                                    <Button slot="trigger" size="xs" color="light">
                                        <Settings class="h-4 w-4" />
                                    </Button>
                                    <DropdownItem on:click={() => handleAction(app.guid, 'restart')}>
                                        <RefreshCw class="h-4 w-4 mr-2" />
                                        Restart
                                    </DropdownItem>
                                    <DropdownItem color="red" on:click={() => handleAction(app.guid, 'delete')}>
                                        <Trash2 class="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownItem>
                                </Dropdown>
                            </div>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>

        <div class="flex justify-center">
            <Pagination
                total={totalPages}
                bind:current={currentPage}
                on:change={fetchApps}
            />
        </div>
    {/if}
</div>

<!-- New Application Modal -->
<Modal bind:open={showNewAppModal} size="lg" title="Create New Application">
    <form class="space-y-6" on:submit|preventDefault={createNewApp}>
        <div>
            <Label for="name">Application Name</Label>
            <Input 
                id="name" 
                type="text" 
                bind:value={newApp.name} 
                required 
                placeholder="my-awesome-app"
            />
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <Label for="memory">Memory (MB)</Label>
                <Input 
                    id="memory" 
                    type="number" 
                    bind:value={newApp.memory} 
                    min="64" 
                    step="64" 
                    required 
                />
            </div>

            <div>
                <Label for="instances">Instances</Label>
                <Input 
                    id="instances" 
                    type="number" 
                    bind:value={newApp.instances} 
                    min="1" 
                    required 
                />
            </div>
        </div>

        <div>
            <Label for="disk">Disk Quota (MB)</Label>
            <Input 
                id="disk" 
                type="number" 
                bind:value={newApp.disk_quota} 
                min="512" 
                step="256" 
                required 
            />
        </div>

        <div>
            <Label for="space">Space</Label>
            <Select id="space" bind:value={newApp.space_guid} required>
                <option value="">Select a space</option>
                <!-- We'll populate this with actual spaces -->
            </Select>
        </div>

        <div class="flex justify-end gap-4">
            <Button color="alternative" on:click={() => showNewAppModal = false}>
                Cancel
            </Button>
            <Button type="submit" color="blue">
                Create Application
            </Button>
        </div>
    </form>
</Modal>