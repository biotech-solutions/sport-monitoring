<template>
    <div>
        <a @click="showDialog=true">¿Olvidaste tu contraseña?</a>
        <v-dialog v-model="showDialog" transition="dialog-bottom-transition" width="700px">
            <v-card>
                <v-card-title>
                    <span class="headline">Recuperación de contraseña</span>
                </v-card-title>
                <v-card-text>
                    Ingrese el correo electrónico asociado a su usuario
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <v-text-field v-model="email" label="Correo Electrónico" type="email" autocomplete="off"
                                          required></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :loading="executing" @click="sendRecoveryEmail">Recuperar</v-btn>
                    <v-btn color="primary" @click=closeDialog text>Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "PassswordRecovery",
    data: () => ({
        showDialog: false,
        executing: false,
        email: ''
    }),
    methods: {
        sendRecoveryEmail()
        {
            let data = this.$data;
            let email = { email: this.email };
            let store = this.$store;

            data.executing = true;
            axios.post('sendRecoveryEmail', email).then(function ()
            {
                data.showDialog = false;
                data.email = '';
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Se ha enviado un correo con la nueva contraseña',
                    color: 'sucess'
                };
            }).catch(function (error)
            {
                if (error.response.status === 404)
                {
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'El correo no cohincide con ningun usuario',
                        color: 'error'
                    };
                    return;
                }
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Error al enviar el correo de recuperacion de contraseña',
                    color: 'error'
                };
                data.showDialog = false;
            }).then(function ()
            {
                data.executing = false;
            });
        },
        closeDialog()
        {
            this.showDialog = false;
            this.email = '';
        }
    }
};
</script>

<style scoped>

</style>