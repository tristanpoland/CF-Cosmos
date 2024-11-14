<script lang="ts">
  export let icon: any;
  export let title: string;
  export let current: number;
  export let max: number;
  export let formatValue: (val: number) => string = (val) => val?.toString() || '0';
   </script>
   
   <div class="space-y-4 mb-6">
    <div class="flex justify-between items-center text-sm">
      <div class="flex items-center space-x-2">
        <svelte:component this={icon} class="w-4 h-4 text-blue-400" />
        <span class="text-gray-400">{title}</span>
      </div>
      <span class="text-white">{formatValue(current)} / {formatValue(max)}</span>
    </div>
    <div class="w-full bg-neutral-800 rounded-lg h-4 overflow-hidden">
      <div 
        class="bg-blue-500 h-full transition-all"
        style="width: {(current / max) * 100}%"
      >
        <div class="w-full h-full opacity-50 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      </div>
    </div>
   </div>