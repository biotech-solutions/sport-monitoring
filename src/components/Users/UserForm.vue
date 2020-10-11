<template>
    <v-form v-model="valid" ref="form" autocomplete="off">
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-select :items="profileSelect" label="Perfíl" v-model="user.profile" :readonly="mode !== 'new'"
                              :rules="[...mode==='new' ? rules.required:[]]" prepend-icon="admin_panel_settings"
                              validate-on-blur/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="user.username" label="Nombre de usuario" prepend-icon="account_box"
                                  counter="50" :rules="[rules.required]" maxlength="50" autocomplete="new-password"
                                  required/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" v-model="user.password"
                                  :type="showPassword ? 'text' : 'password'" label="Contraseña"
                                  class="input-group--focused" @click:append="showPassword = !showPassword"
                                  :error-messages="passwordError" :error="!!passwordError" @input="passwordError=''"
                                  autocomplete="off"/>
                </v-col>
            </v-row>
            <v-row v-if="mode !== 'new'">
                <v-col cols="12" md="4">
                    <v-switch v-model="user.enabled" label="Habilitado"/>
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
    name: "UserForm",
    props: [
        'mode',
        'executing'
    ],
    data: () => ({
        user: {
            username: '',
            password: '',
            profile: 0,
            enabled: false,
        },
        valid: true,
        profileSelect: [
            {
                text: 'Deportista',
                value: 3
            },
            {
                text: 'Entrenador',
                value: 2
            }
        ],
        showPassword: false,
        rules: {
            required(value)
            {
                return !!value || 'Este campo es obligatorio.';
            }
        },
        passwordError: ''
    }),
    methods: {
        close: function ()
        {
            this.clear();
            this.$emit("onClickClose");
        },
        onActionClick()
        {
            if (!this.validatePassword())
            {
                return;
            }

            let user = {
                username: this.user.username,
                password: this.user.password,
                enabled: this.user.enabled,
                profileId: this.user.profile
            };
            this.$emit("onClickAction", user);
        },
        clear()
        {
            this.user.profile = '';
            this.user.username = '';
            this.user.password = '';
            this.user.enabled = false;
            this.showPassword = false;
            this.passwordError = '';
            this.$refs.form.resetValidation();
        },
        setUser()
        {
            this.user.profile = this.currentUser.profile;
            this.user.username = this.currentUser.username;
            this.user.enabled = this.currentUser.enabled;
        },
        validatePassword()
        {
            if (this.user.password === '' && this.mode === 'edit')
            {
                return true;
            }
            let passwordValidation = /^(?=.*[0-9])(?=.*[A-Z])[\s\S]{8,}$/;
            if (!passwordValidation.test(this.user.password))
            {
                this.passwordError = 'La contraseña debe tener 8 caracteres, 1 mayúscula y 1 número';
                return false;
            }
            return true;
        }
    },
    computed: {
        ...mapState("usersStore", ["currentUser"]),
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