<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

const items = [
    {
        label: t('home'),
        to: localePath({name: 'index'}),
    },
    {
        label: t('about'),
        to: localePath({name: 'about'}),
    },
    {
        label: t('pieces'),
        to: localePath({name: 'piece'}),
    },
    {
        label: t('chords'),
        to: localePath({name: 'chords'}),
    },
    {
        label: t('modulations'),
        to: localePath({name: 'modulations'}),
    },
    {
        label: t('cadences'),
        to: localePath({name: 'cadences'}),
    },
    {
        label: t('sequences'),
        to: localePath({name: 'sequences'}),
    },
    {
        label: t('suspensions'),
        to: localePath({name: 'suspensions'}),
    },
    {
        label: t('faq'),
        to: localePath({name: 'faq'}),
    },
];
</script>

<template>
    <UNavigationMenu :items="items" class="border-b border-gray-200 dark:border-gray-800 px-2"/>
</template>
