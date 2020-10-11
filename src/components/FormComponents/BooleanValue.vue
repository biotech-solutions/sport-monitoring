<template>
    <v-switch v-model="value" :label="props.etiqueta"/>
</template>

<script>
export default {
    name: "BooleanValue",
    props: [
        'props',
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