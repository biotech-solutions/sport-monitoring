<template>
    <v-container>
        <v-subheader>{{props.etiqueta}}</v-subheader>
        <v-checkbox v-for="item in props.items" v-model="value" :label="item.value" :value="item.value" :key="item.id"/>
    </v-container>
</template>

<script>
export default {
    name: "MultipleSelectionValue",
    props: [
        'props'
    ],
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