<template>
    <v-text-field v-model="value" :label="props.etiqueta" type="text"/>
</template>

<script>
export default {
    name: "PhraseValue",
    props: ['props'],
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