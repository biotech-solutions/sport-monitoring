<template>
    <div>
        <v-subheader>{{ props.etiqueta }}</v-subheader>
        <v-row>
            <v-col cols="12" md="5">
                <v-text-field class="mr-4" v-model="firstValue" :label="props.primeraEtiqueta" type="number"
                              :min="props.primerMinimo"
                              :max="props.primerMaximo"/>
            </v-col>
            <v-col v-if="!isCriticalBreakpoint" class="text-h3" cols="12" md="1">/</v-col>
            <v-col v-if="isCriticalBreakpoint"  cols="12" md="1"><hr style="height:2px;border-width:0;color:gray;background-color:#1976d2"/></v-col>
            <v-col cols="12" md="5">
                <v-text-field v-model="secondValue" :label="props.segundaEtiqueta" type="number"
                              :min="props.segundoMinimo"
                              :max="props.segundoMaximo"/>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "RatioValue",
    props: ['props'],
    data: () => ({
        firstValue: null,
        secondValue: null,
    }),
    computed: {
        isCriticalBreakpoint()
        {
            return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm';
        }
    },
    mounted()
    {
        this.firstValue = this.props.firstDefaultValue;
        this.secondValue = this.props.secondDefaultValue;
    }
};
</script>

<style scoped>

</style>