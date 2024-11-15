<!-- src/lib/components/DynamicFormModal.svelte -->
<script lang="ts">
    import { X } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

    export let title: string;
    export let show: boolean;
    export let endpoint: string;
    export let fields: {
        id: string;
        label: string;
        type: 'text' | 'number' | 'email' | 'tel' | 'url' | 'date' | 'select';
        placeholder?: string;
        required?: boolean;
        min?: number;
        max?: number;
        options?: Array<{ value: string; label: string }>;
        validations?: Array<{
            rule: (value: any) => boolean;
            message: string;
        }>;
    }[];

    // Form state
    let formData: Record<string, any> = {};
    let formErrors: Record<string, string> = {};
    let loading = false;
    let error: string | null = null;

    // Initialize form data with empty values
    $: {
        if (show) {
            formData = fields.reduce((acc, field) => {
                acc[field.id] = '';
                return acc;
            }, {} as Record<string, any>);
            formErrors = {};
            error = null;
        }
    }

    function validateField(field: typeof fields[0], value: any): string {
        // Required field validation
        if (field.required && !value) {
            return `${field.label} is required`;
        }

        // Number range validation
        if (field.type === 'number') {
            const numValue = Number(value);
            if (field.min !== undefined && numValue < field.min) {
                return `${field.label} must be at least ${field.min}`;
            }
            if (field.max !== undefined && numValue > field.max) {
                return `${field.label} must not exceed ${field.max}`;
            }
        }

        // Custom validations
        if (field.validations) {
            for (const validation of field.validations) {
                if (!validation.rule(value)) {
                    return validation.message;
                }
            }
        }

        return '';
    }

    function validateForm(): boolean {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        fields.forEach(field => {
            const error = validateField(field, formData[field.id]);
            if (error) {
                newErrors[field.id] = error;
                isValid = false;
            }
        });

        formErrors = newErrors;
        return isValid;
    }

    async function handleSubmit() {
        if (!validateForm()) {
            return;
        }

        loading = true;
        error = null;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            dispatch('success', { data: result });
            closeModal();

        } catch (e) {
            error = e instanceof Error ? e.message : 'An error occurred while submitting the form';
            console.error('Form submission error:', e);
        } finally {
            loading = false;
        }
    }

    function closeModal() {
        formData = {};
        formErrors = {};
        error = null;
        dispatch('close');
    }
</script>

{#if show}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-neutral-900 rounded-lg w-full max-w-md p-6 space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold text-white">{title}</h2>
                <button 
                    on:click={closeModal}
                    class="text-gray-400 hover:text-white transition-colors"
                >
                    <X class="w-5 h-5" />
                </button>
            </div>

            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                {#each fields as field (field.id)}
                    <div>
                        <label 
                            for={field.id} 
                            class="block text-sm font-medium text-gray-300 mb-1"
                        >
                            {field.label}
                        </label>

                        {#if field.type === 'select'}
                            <select
                                id={field.id}
                                bind:value={formData[field.id]}
                                class="w-full px-3 py-2 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            >
                                <option value="">Select {field.label}</option>
                                {#each field.options || [] as option}
                                    <option value={option.value}>{option.label}</option>
                                {/each}
                            </select>
                        {:else}
                            <input
                                id={field.id}
                                type={field.type}
                                bind:value={formData[field.id]}
                                min={field.min}
                                max={field.max}
                                placeholder={field.placeholder}
                                class="w-full px-3 py-2 bg-neutral-800 rounded-lg border border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            />
                        {/if}

                        {#if formErrors[field.id]}
                            <p class="mt-1 text-sm text-red-400">{formErrors[field.id]}</p>
                        {/if}
                    </div>
                {/each}

                {#if error}
                    <p class="text-sm text-red-400">{error}</p>
                {/if}

                <div class="flex justify-end space-x-3">
                    <button
                        type="button"
                        on:click={closeModal}
                        class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}