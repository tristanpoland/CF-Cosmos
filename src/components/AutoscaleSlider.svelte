<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  
    export let title = "Price";
    export let min = 0;
    export let max = 100;
    export let step = 1;
    export let minValue = min;
    export let maxValue = max;
  
    let sliderWidth;
    let minThumb;
    let maxThumb;
    let isDraggingMin = false;
    let isDraggingMax = false;
  
    function percentToValue(percent) {
      return min + (max - min) * percent;
    }
  
    function valueToPercent(value) {
      return ((value - min) / (max - min)) * 100;
    }
  
    function handleMouseDown(isMin, e) {
      if (isMin) isDraggingMin = true;
      else isDraggingMax = true;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  
    function handleMouseMove(e) {
      if (!isDraggingMin && !isDraggingMax) return;
  
      const rect = sliderWidth.getBoundingClientRect();
      const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      const value = percentToValue(percent);
  
      if (isDraggingMin) {
        minValue = Math.min(Math.max(value, min), maxValue - step);
        dispatch('change', { min: minValue, max: maxValue });
      } else {
        maxValue = Math.min(Math.max(value, minValue + step), max);
        dispatch('change', { min: minValue, max: maxValue });
      }
    }
  
    function handleMouseUp() {
      isDraggingMin = false;
      isDraggingMax = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  
    function handleInputChange(isMin, value) {
      const numValue = Number(value);
      if (isMin) {
        minValue = Math.min(Math.max(numValue, min), maxValue - step);
      } else {
        maxValue = Math.min(Math.max(numValue, minValue + step), max);
      }
      dispatch('change', { min: minValue, max: maxValue });
    }
  </script>
  
  <div class="space-y-6">
    <div>
      <label class="block text-sm text-gray-400 mb-2">{title} Range</label>
      <div class="flex items-center space-x-4">
        <input 
          type="number"
          value={minValue}
          on:input={e => handleInputChange(true, e.target.value)}
          {min}
          {max}
          {step}
          class="w-24 px-3 py-2 bg-neutral-800 rounded-lg text-center"
        />
        <div 
          class="relative flex-1 h-12"
          bind:this={sliderWidth}
        >
          <div class="absolute w-full h-1 top-4 bg-neutral-800 rounded"/>
          <div 
            class="absolute h-1 top-4 bg-blue-500 rounded"
            style="left: {valueToPercent(minValue)}%; right: {100 - valueToPercent(maxValue)}%;"
          />
          <div 
            class="thumb absolute z-10 cursor-pointer"
            bind:this={minThumb}
            on:mousedown={e => handleMouseDown(true, e)}
            style="left: calc({valueToPercent(minValue)}% - 8px); top: 12px;"
          />
          <div 
            class="thumb absolute z-20 cursor-pointer"
            bind:this={maxThumb}
            on:mousedown={e => handleMouseDown(false, e)}
            style="left: calc({valueToPercent(maxValue)}% - 8px); top: 12px;"
          />
        </div>
        <input 
          type="number"
          value={maxValue}
          on:input={e => handleInputChange(false, e.target.value)}
          {min}
          {max}
          {step}
          class="w-24 px-3 py-2 bg-neutral-800 rounded-lg text-center"
        />
      </div>
    </div>
  </div>
  
  <style>
    .thumb {
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 16px solid #3B82F6;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      margin-bottom: 8px;
    }
  
    .thumb:hover {
      border-top-color: #2563eb;
    }
  
    .thumb:active {
      border-top-color: #1d4ed8;
    }
  </style>