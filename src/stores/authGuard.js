import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { writable, derived } from 'svelte/store'
import { auth } from './auth'
import { dev } from '$app/environment'

const PUBLIC_ROUTES = ['/login', '/forgot-password']

function createAuthGuard() {
    const { subscribe, set } = writable({
        isAuthenticated: false,
        isLoading: true,
        isDev: dev
    })

    auth.subscribe(({ isAuthenticated, loading }) => {
        set({
            isAuthenticated,
            isLoading: loading,
            isDev: dev
        })
    })

    return {
        subscribe,
        requireAuth: async (path) => {
            if (!browser) return true
            
            const isPublicRoute = PUBLIC_ROUTES.includes(path)
            if (isPublicRoute) return true
            
            const isAuthenticated = await auth.checkAuth()
            
            if (!isAuthenticated && !dev) {
                goto('/login')
                return false
            }
            
            return true
        }
    }
}

export const authGuard = createAuthGuard()

export const canAccess = derived(
    authGuard,
    $authGuard => $authGuard.isDev || $authGuard.isAuthenticated
)