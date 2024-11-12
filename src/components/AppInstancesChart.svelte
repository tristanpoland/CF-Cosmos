<script lang="ts">
    import { instanceHistory } from '../store';
    import { BarChartStacked } from '@carbon/charts-svelte';

    $: chartData = $instanceHistory.flatMap(point => [
        {
            group: 'Running',
            date: new Date(point.timestamp),
            value: point.running
        },
        {
            group: 'Crashed',
            date: new Date(point.timestamp),
            value: point.crashed
        }
    ]);

    const options = {
        title: 'Application Instances Over Time',
        axes: {
            left: {
                title: 'Instance Count',
                mapsTo: 'value',
                stacked: true
            },
            bottom: {
                title: 'Time',
                mapsTo: 'date',
                scaleType: 'time'
            }
        },
        height: '400px',
        theme: 'g100',
        colors: {
            scale: {
                'Running': '#2ecc71',
                'Crashed': '#e74c3c'
            }
        },
        tooltip: {
            showTotal: true
        },
        legend: {
            alignment: 'center'
        }
    };
</script>

<div class="bg-neutral-900 rounded-lg shadow-lg">
    <div class="px-6 py-4 border-b border-neutral-700">
        <h2 class="text-lg font-semibold text-white">Application Instances Over Time</h2>
    </div>
    <div class="p-6">
        <BarChartStacked
            data={chartData}
            options={options}
        />
    </div>
</div>