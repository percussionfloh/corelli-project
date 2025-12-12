<script setup>
import { computed } from 'vue'
import Chart from '@/components/Chart.vue';

const fbConfig = computed(() => ({
    type: 'bar',
    data: {
        datasets: [
            {
                label: viewFbMode.value === 'fb' ? t('fb') : t('exactIntervals'),
                data: fbGroupedChords.value.map(i => ({ x: i[0], y: i[1] })),
            }
        ],
    },
}));
</script>


<template>
	<div class="h-[300px]">
        <Chart :config="fbConfig" @chart-click="(chart, event) => chartClickHandler(viewFbMode, chart, event)" />
    </div>
</template>