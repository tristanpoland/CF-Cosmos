<script lang="ts">
    import { memoryHistory } from '../store';
    import { LineChart, ScaleTypes } from '@carbon/charts-svelte';

    $: chartData = $memoryHistory.map(point => ({
        group: 'Memory Usage',
        date: new Date(point.timestamp),
        value: point.used_gb
    }));

    const options = {
        title: 'Memory Usage Over Time',
        axes: {
            left: {
                title: 'GB Used',
                mapsTo: 'value',
                scaleType: ScaleTypes.LINEAR,
                color: '#9CA3AF', // gray-400
                ticks: {
                    color: '#9CA3AF'
                }
            },
            bottom: {
                title: 'Time',
                mapsTo: 'date',
                scaleType: ScaleTypes.TIME,
                color: '#9CA3AF', // gray-400
                ticks: {
                    color: '#9CA3AF'
                }
            }
        },
        curve: 'curveMonotoneX',
        height: '400px',
        theme: 'g100',
        background: '#171717', // neutral-900
        color: {
            scale: {
                'Memory Usage': '#3B82F6' // blue-500
            }
        },
        grid: {
            x: {
                enabled: true,
                color: '#262626' // neutral-800
            },
            y: {
                enabled: true,
                color: '#262626' // neutral-800
            }
        },
        tooltip: {
            showTotal: false,
            style: {
                bg: '#1F2937', // gray-800
                color: '#F3F4F6' // gray-100
            }
        },
        legend: {
            alignment: 'center',
            color: '#D1D5DB' // gray-300
        },
        margins: {
            top: 40,
            right: 50,
            bottom: 50,
            left: 60
        },
        animations: true
    };
</script>

<div class="bg-neutral-900 rounded-lg shadow-lg">
    <div class="px-6 py-4 border-b border-neutral-700">
        <h2 class="text-lg font-semibold text-white">Memory Usage Over Time</h2>
    </div>
    <div class="p-6 bg-neutral-900">
        <div class="chart-container">
            <LineChart
                data={chartData}
                options={options}
            />
        </div>
    </div>
</div>

<style>
    :global(.chart-container) {
        --chart-bg: #171717;
        --chart-text: #D1D5DB;
        --chart-grid: #262626;
    }
    
    :global(.chart-container .tick text) {
        fill: var(--chart-text) !important;
    }
    
    :global(.chart-container .domain) {
        stroke: var(--chart-grid) !important;
    }
    
    :global(.chart-container .grid line) {
        stroke: var(--chart-grid) !important;
    }

    :global(.chart-container .tooltip) {
        background-color: #1F2937 !important;
        border-color: #374151 !important;
        color: #F3F4F6 !important;
    }
</style>