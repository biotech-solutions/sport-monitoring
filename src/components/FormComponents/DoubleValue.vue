<template>
    <div>
        <v-subheader>{{ props.etiqueta }}</v-subheader>
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field v-model="firstValue" :label="props.primeraEtiqueta" type="number"
                              :min="props.primerMinimo"
                              :max="props.primerMaximo"/>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field v-model="secondValue" :label="props.segundaEtiqueta" type="number"
                              :min="props.segundoMinimo"
                              :max="props.segundoMaximo"/>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "DoubleValue",
    props: ['props'],
    data: () => ({
        firstValue: null,
        secondValue: null,
    }),
    mounted()
    {
        this.firstValue = this.props.firstDefaultValue;
        this.secondValue = this.props.secondDefaultValue;
    }
};
</script>

<style scoped>

</style>