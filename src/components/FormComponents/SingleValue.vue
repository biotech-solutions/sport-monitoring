<template>
    <v-text-field v-model="value" :label="props.etiqueta" type="number" :min="props.min" :max="props.max"/>
</template>

<script>
export default {
    name: "SingleValue",
    props: ['props'],
    data: () => ({
        value: null,
    }),
    mounted()
    {
        this.value = this.props.defaultValue;
    }
};
</script>

<style scoped>

</style>