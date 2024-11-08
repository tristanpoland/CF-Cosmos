<script>
    import { onMount } from 'svelte'
    import { location } from 'svelte-spa-router'
    import { canAccess, authGuard } from '../stores/authGuard'
    import { Spinner } from 'flowbite-svelte'

    let isLoading = true

    onMount(async () => {
        await authGuard.checkAuth($location)
        isLoading = false
    })

    $: if (!isLoading && !$canAccess) {
        authGuard.checkAuth($location)
    }
</script>

{#if isLoading}
    <div class="flex justify-center items-center h-screen">
        <Spinner size="12" />
    </div>
{:else if $canAccess}
    <slot />
{/if}