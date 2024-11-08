<script>
    import { Card, Button, Label, Input, Alert } from 'flowbite-svelte'
    import { auth } from '../../stores/auth'
    
    let username = ''
    let password = ''
    let loading = false
    let error = ''

    async function handleLogin(e) {
        e.preventDefault()
        loading = true
        error = ''
        
        try {
            await auth.login({ username, password })
        } catch (e) {
            error = e.message
        } finally {
            loading = false
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <Card class="w-full max-w-md space-y-8">
        <div>
            <img class="mx-auto h-12 w-auto" src="/cf-logo.svg" alt="Cloud Foundry" />
            <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
            </h2>
        </div>

        <form class="mt-8 space-y-6" on:submit={handleLogin}>
            {#if error}
                <Alert color="red" dismissible>
                    {error}
                </Alert>
            {/if}

            <div class="space-y-4 rounded-md">
                <div>
                    <Label for="username" class="sr-only">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        bind:value={username}
                        placeholder="Username"
                    />
                </div>

                <div>
                    <Label for="password" class="sr-only">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        bind:value={password}
                        placeholder="Password"
                    />
                </div>
            </div>

            <div>
                <Button
                    type="submit"
                    class="w-full"
                    color="blue"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </div>
        </form>
    </Card>
</div>