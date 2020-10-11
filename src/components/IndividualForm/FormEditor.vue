<template>
    <div class="pa-14">
        <v-card class="ma-9" v-for="component in components" :key="component.id">
            <v-card-title class="headline">{{ component.etiqueta }}</v-card-title>
            <v-card-subtitle>{{ component.descripcion }}</v-card-subtitle>
            <v-card-text>
                <v-container>
                    <BooleanValue v-if="component.tipo==='BooleanValue'" :props="component"/>
                    <DoubleValue v-if="component.tipo==='DoubleValue'" :props="component"/>
                    <MultipleSelectionValue v-if="component.tipo==='MultipleSelectionValue'" :props="component"/>
                    <ParagraphValue v-if="component.tipo==='ParagraphValue'" :props="component"/>
                    <PhraseValue v-if="component.tipo==='PhraseValue'" :props="component"/>
                    <RatioValue v-if="component.tipo==='RatioValue'" :props="component"/>
                    <SelectionValue v-if="component.tipo==='SelectionValue'" :props="component"/>
                    <SingleValue v-if="component.tipo==='SingleValue'" :props="component"/>
                </v-container>
            </v-card-text>
            <v-card-actions>

            </v-card-actions>
            <v-expand-transition>
                <div v-show="false">
                    <v-divider></v-divider>
                    <v-card-text>
                        <span v-for="prop of getSpecification(component)">
                            {{ `${prop}: ${component[prop]}` }}<br/>
                        </span>
                    </v-card-text>
                </div>
            </v-expand-transition>
            <v-card-actions>
                <v-btn color="primary" text>Editar</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon>keyboard_arrow_down</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import SingleValue from "@/components/FormComponents/SingleValue";
import BooleanValue from "@/components/FormComponents/BooleanValue";
import DoubleValue from "@/components/FormComponents/DoubleValue";
import MultipleSelectionValue from "@/components/FormComponents/MultipleSelectionValue";
import ParagraphValue from "@/components/FormComponents/ParagraphValue";
import RatioValue from "@/components/FormComponents/RatioValue";
import SelectionValue from "@/components/FormComponents/SelectionValue";
import PhraseValue from "@/components/FormComponents/PhraseValue";

export default {
    name: "FormEditor",
    components: {
        PhraseValue,
        SelectionValue,
        RatioValue,
        ParagraphValue,
        MultipleSelectionValue,
        DoubleValue,
        BooleanValue,
        SingleValue
    },
    data: () => ({
        components: [],
        dontShowAttributes: [
            'id',
            'etiqueta',
            'descripcion'
        ]
    }),
    methods: {
        getSpecification(component)
        {
            let keys = [];
            for (let key in component)
            {
                keys.push(key);
            }

            this.dontShowAttributes.forEach(function (attrib)
            {
                delete keys.splice(keys.indexOf(attrib), 1);
            });
            return keys;
        }
    },
    mounted()
    {
        let component1 = {
            id: 1,
            etiqueta: "Distancia",
            tipo: "BooleanValue",
            defaultValue: true
        };

        let component2 = {
            id: 2,
            primeraEtiqueta: "primera et",
            segundaEtiqueta: "seg et",
            etiqueta: "Tiempo",
            primerMaximo: 66,
            segundoMaximo: 55,
            primerMinimo: 1,
            segundoMinimo: 2,
            firstDefaultValue: 5,
            secondDefaultValue: 6,
            descripcion: "descr1",
            tipo: "DoubleValue",
        };
        let component3 = {
            id: 3,
            etiqueta: "Opcion",
            descripcion: "descr2",
            tipo: "MultipleSelectionValue",
            items: [
                {
                    id: 'op1',
                    value: 'opcion1'
                },
                {
                    id: 'op2',
                    value: 'opcion2'
                }
            ],
            defaultValue: ['op1']
        };
        let component4 = {
            id: 4,
            etiqueta: "Distancia",
            descripcion: "descr2",
            tipo: "ParagraphValue",
            defaultValue: "asdasd"
        };
        let component5 = {
            id: 5,
            etiqueta: "frase",
            descripcion: "descr2",
            tipo: "PhraseValue",
            defaultValue: "asdas123"
        };
        let component6 = {
            id: 6,
            primeraEtiqueta: "primera et",
            segundaEtiqueta: "seg et",
            etiqueta: "Tiempo",
            primerMaximo: 66,
            segundoMaximo: 55,
            primerMinimo: 1,
            segundoMinimo: 2,
            firstDefaultValue: 5,
            secondDefaultValue: 6,
            descripcion: "descr1",
            tipo: "RatioValue"
        };
        let component7 = {
            id: 7,
            etiqueta: "Distancia",
            descripcion: "descr2",
            items: [
                'op1',
                'opc2'
            ],
            defaultValue: 'opc2',
            tipo: "SelectionValue"
        };
        let component8 = {
            id: 8,
            etiqueta: "Distancia",
            descripcion: "descr2",
            min: 5,
            max: 10,
            defaultValue: 7,
            tipo: "SingleValue"
        };


        this.components.push(component1, component2, component3, component4, component5, component6, component7, component8);
    },
};
</script>

<style scoped>

</style>