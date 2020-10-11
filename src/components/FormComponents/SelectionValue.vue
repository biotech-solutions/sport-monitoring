<template>
    <v-select :items="props.items" :label="label" v-model="value"/>
</template>

<script>
export default {
    name: "SelectionValue",
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