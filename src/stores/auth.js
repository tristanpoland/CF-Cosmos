import { writable } from 'svelte/store'
import { goto } from '$app/navigation'
import { browser } from '$app/environment'

function createAuthStore() {
    const { subscribe, set, update } = writable({
        isAuthenticated: false,
        token: null,
        user: null,
        error: null,
        loading: true
    })

    return {
        subscribe,
        login: async (credentials) => {
            try {
                const response = await fetch('/v3/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                })
                
                if (!response.ok) throw new Error('Login failed')
                
                const data = await response.json()
                set({
                    isAuthenticated: true,
                    token: data.token,
                    user: data.user,
                    error: null,
                    loading: false
                })
                
                if (browser) {
                    localStorage.setItem('cf_token', data.token)
                }
                
                goto('/dashboard')
            } catch (error) {
                set({ 
                    isAuthenticated: false, 
                    token: null, 
                    user: null, 
                    error: error.message,
                    loading: false 
                })
            }
        },
        logout: () => {
            if (browser) {
                localStorage.removeItem('cf_token')
            }
            set({ 
                isAuthenticated: false, 
                token: null, 
                user: null, 
                error: null,
                loading: false 
            })
            goto('/login')
        },
        checkAuth: async () => {
            if (!browser) return false

            const token = localStorage.getItem('cf_token')
            if (!token) {
                set({ 
                    isAuthenticated: false, 
                    token: null, 
                    user: null, 
                    error: null,
                    loading: false 
                })
                return false
            }
            
            try {
                const response = await fetch('/v3/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                
                if (!response.ok) throw new Error('Invalid token')
                
                const user = await response.json()
                set({ 
                    isAuthenticated: true, 
                    token, 
                    user, 
                    error: null,
                    loading: false 
                })
                return true
            } catch (error) {
                set({ 
                    isAuthenticated: false, 
                    token: null, 
                    user: null, 
                    error: error.message,
                    loading: false 
                })
                return false
            }
        }
    }
}

export const auth = createAuthStore()