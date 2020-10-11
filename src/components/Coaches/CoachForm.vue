<template>
    <v-form v-model="valid" ref="form" :disabled="mode==='view'">
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="coach.fullname" label="Nombre Completo*" prepend-icon="sports" counter="250"
                                  :rules="[rules.required]" maxlength="250"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="coach.email" label="Correo Electrónico*" prepend-icon="email"
                                  counter="128" maxlength="128" :rules="[rules.required, rules.validEmail]"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="coach.phone" label="Teléfono*" prepend-icon="smartphone" counter="25"
                                  maxlength="25" :rules="[rules.required, rules.validPhone]"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <v-select :items="roleSelect" label="Rol*" v-model="coach.role"
                              prepend-icon="supervisor_account" :rules="[rules.required]"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-select v-if="mode!=='view'" :items="$store.state.usersStore.availableUsers"
                              label="Usuario*" :rules="[rules.required]" v-model="coach.userId" prepend-icon="contacts"
                              item-text="username" item-value="id"
                              :loading="$store.state.usersStore.availableUsers.length===0"/>
                </v-col>
                <v-col cols="12" md="4"></v-col>
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
    name: "CoachForm",
    props: [
        'mode',
        'executing'
    ],
    data: () => ({
        coach: {},
        valid: true,
        roleSelect: [
            'Entrenador',
            'Asistente'
        ],
        rules: {
            required(value)
            {
                return !!value || 'Este campo es obligatorio.';
            },
            validEmail(value)
            {
                let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if (!regex.test(value))
                {
                    return 'Correo electrónico no válido';
                }
                return true;
            },
            validPhone(value)
            {
                let regex = /[0-9]{7,}/;
                if (!regex.test(value))
                {
                    return 'Número telefónico no válido';
                }
                return true;
            }
        }
    }),
    methods: {
        close: function ()
        {
            this.clear();
            this.$emit("onClickClose");
        },
        onActionClick()
        {
            this.$emit("onClickAction", this.coach);
        },
        clear()
        {
            this.coach.fullname = '';
            this.coach.email = '';
            this.coach.phone = '';
            this.coach.role = '';
            this.coach.userId = 0;
            this.$refs.form.resetValidation();
        },
        setCoach()
        {
            this.coach = Object.assign({}, this.currentCoach);
        }
    },
    computed: {
        ...mapState('coachesStore', ['currentCoach']),
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