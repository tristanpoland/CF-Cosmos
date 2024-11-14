<script lang="ts">
  export let icon: any;
  export let title: string;
  export let value: number;
  export let min: number;
  export let max: number;
  export let step: number;
  export let unit: string = '';
  export let formatValue: (val: number) => string = (val) => val?.toString() || '0';
   </script>
   
   <div class="bg-neutral-900 rounded-lg p-6">
    <h2 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
      <svelte:component this={icon} class="w-5 h-5 text-blue-400" />
      <span>{title}</span>
    </h2>
    
    <div class="flex items-center space-x-4">
      <div class="flex-1">
        <input 
          type="range"
          {min}
          {max}
          {step}
          bind:value
          class="w-full accent-blue-500"
        />
      </div>
      <div class="w-32 text-right">
        <span class="text-lg">{formatValue(value)}{unit}</span>
      </div>
  </div>
</div>