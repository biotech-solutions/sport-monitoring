<template>
    <v-textarea v-model="value" :label="props.etiqueta" rows=3 auto-grow/>
</template>

<script>
export default {
    name: "ParagraphValue",
    props: [
        'props'
    ],
    data: () => ({
        value: null
    }),
    mounted()
    {
        this.value = this.props.defaultValue;
    }
};
</script>

<style scoped>

</style>