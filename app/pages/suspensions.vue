<script setup>
const { t } = useI18n();

useHead({
    title: t('home'),
});
</script>

<template>
	<div class="h-[300px]">
        <Chart :config="fbConfig" @chart-click="(chart, event) => chartClickHandler(viewFbMode, chart, event)" />
    </div>
</template>