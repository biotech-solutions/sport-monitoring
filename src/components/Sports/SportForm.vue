<template>
    <v-form v-model="valid" ref="form" :disabled="mode==='view'">
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="sport.name" label="Nombre*" prepend-icon="sports_football" counter="50"
                                  :rules="[rules.required]" maxlength="50"/>
                </v-col>
            </v-row>
            <div class="d-flex justify-end">
                <v-btn class="mr-4" color="primary" :loading="executing" @click="onActionClick" :disabled="!valid">
                    {{ buttonText }}
                </v-btn>
                <v-btn color="primary" @click="close" text>Cancelar</v-btn>
            </div>
        </v-container>
    </v-form>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "SportForm",
    props: [
        'mode',
        'executing'
    ],
    data: () => ({
        sport: {},
        valid: true,
        rules: {
            required(value)
            {
                return !!value || 'Este campo es obligatorio';
            }
        }
    }),
    methods: {
        close()
        {
            this.clear();
            this.$emit("onClickClose");
        },
        onActionClick()
        {
            this.$emit("onClickAction", this.sport);
        },
        clear()
        {
            this.sport.name ='';
            this.$refs.form.resetValidation();
        },
        setSport()
        {
            this.sport = Object.assign({}, this.currentSport);
        }
    },
    computed: {
        ...mapState('sportsStore',['currentSport']),
        buttonText: function ()
        {
            if (this.mode === "new")
            {
                return "Crear";
            }
            else if (this.mode === "edit")
            {
                return "Modificar";
            }
        }
    }
};
</script>

<style scoped>

</style>