<template>
    <div class="background-image d-flex justify-end">
        <div class="form">
            <h1 class="text-center">nombre del centro</h1>
            <div id="organization-logo"></div>
            <form>
                <v-text-field v-model="username" label="Nombre de usuario" :error="usernameError"
                              :error-messages="usernameMessage"/>
                <v-text-field v-model="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPassword ? 'text' : 'password'" label="Contraseña" :error="passwordError"
                              :error-messages="passwordMessage" class="input-group--focused"
                              @click:append="showPassword = !showPassword" autocomplete/>
                <div class="d-flex justify-space-between mb-4" id="login-options">
                    <v-checkbox v-model="rememberMe" label="Recuerdame"/>
                    <div id="password-reset">
                        <PassswordRecovery/>
                    </div>
                </div>
                <div class="d-block">
                    <v-btn color="primary" :loading="executing" @click="checkCredentials" block>Ingresar</v-btn>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import PassswordRecovery from "@/components/Login/PassswordRecovery";

export default {
    name: "Login",
    components: { PassswordRecovery },
    data: () => ({
        username: "",
        password: "",
        showPassword: false,
        rememberMe: false,
        usernameError: false,
        passwordError: false,
        usernameMessage: '',
        passwordMessage: '',
        executing: false
    }),
    methods: {
        async checkCredentials()
        {
            let router = this.$router;
            let data = this.$data;
            let store = this.$store;
            let session = this.$session;

            this.resetFields();

            let requestContent = {
                username: this.username,
                password: this.password
            };

            data.executing = true;
            axios.post('login', requestContent).then(function (response)
            {
                session.start();
                session.set('userId', response.data.userId);
                if (!data.rememberMe)
                {
                    session.set('temporal', true);
                }
                router.push('main');
            }).catch(function (error)
            {
                let responseBody = error.response.data;
                if (responseBody.reason === 'wrong username')
                {
                    data.usernameError = true;
                    data.usernameMessage = 'Usuario no existe';
                }
                else if (responseBody.reason === 'wrong password')
                {
                    data.passwordError = true;
                    data.passwordMessage = 'Contraseña incorrecta';
                }
                else if (responseBody.reason === 'disabled user')
                {
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Usuario Deshabilitado',
                        color: 'info'
                    };
                }
                else
                {
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Error al intentar ingresar',
                        color: 'error'
                    };
                }
            }).then(function ()
            {
                data.executing = false;
            });
        },
        resetFields()
        {
            this.usernameMessage = '';
            this.passwordMessage = '';
            this.usernameError = false;
            this.passwordError = false;
        }
    },
    beforeCreate()
    {
        if (this.$session.has('userId'))
        {
            this.$router.push('main');
        }
    }
};
</script>

<style scoped>
.background-image
{
    width: 100%;
    height: 100%;
    background-image: url("../assets/login-background.jpg");
}

#organization-logo
{
    background-image: url("../assets/logo.png");
    height: 200px;
    width: 200px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.form
{
    width: 500px;
    background-color: white;
    padding: 40px 40px 0 40px;
}

#password-reset
{
    margin: 16px 0 16px 0;
}

@media only screen and (max-width: 768px)
{
    .form
    {
        width: 100%;
    }
}
</style>