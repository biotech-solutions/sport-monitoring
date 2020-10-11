<template>
    <div>
        <v-navigation-drawer v-model="menuVisible" app temporary width="280px">
            <div id="organization-name">Nombre del centro</div>
            <div id="organization-logo"></div>
            <v-list dense>
                <v-list-item link @click="swapModule('Users')">
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Usuarios</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Deportistas</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Coaches')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Entrenadores</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Teams')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Equipos</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Ejercicios Individuales</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Ejercicios Grupales</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Cronograma de entrenamiento</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Alimentos</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Cronograma de Alimentación</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Formularios Individuales</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Formularios Grupales</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Reportes</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="swapModule('Sports')">
                    <v-list-item-action>
                        <v-icon>sports_football</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Deportes</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item class="mb-16" link @click="swapModule('Sportmen')">
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Configuración del Sistema</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click.stop="menuVisible = !menuVisible"></v-app-bar-nav-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer/>
            <v-btn icon @click="logout">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>
        <v-main>
            <component v-bind:is="currentContent"/>
<!--            <img src="https://firebasestorage.googleapis.com/v0/b/sport-monitoring.appspot.com/o/sportmen%2F2%2Ftest6.jpeg?alt=media&token=882371bf-8388-4537-af1e-fe08f1260690">-->
<!--            <Board></Board>-->
            <!--            <FormEditor></FormEditor>-->
        </v-main>
    </div>
</template>

<script>
import axios from 'axios';
import Sportmen from "@/components/Sportmen/Sportmen";
import SportmanForm from "@/components/Sportmen/SportmanForm";
import Users from "@/components/Users/Users";
import Board from "@/components/Board";
import FormEditor from "@/components/IndividualForm/FormEditor";
import Sports from "@/components/Sports/Sports";
import Coaches from "@/components/Coaches/Coaches";
import Teams from "@/components/Teams/Teams";
import router from "@/router";

export default {
    name: "Main",
    components: {
        FormEditor,
        Board,
        SportmanForm,
        Sportmen,
        Users,
        Sports,
        Coaches,
        Teams
    },
    data: () => ({
        menuVisible: false,
        title: "Sport Monitoring",
        currentContent: "",
    }),
    methods: {
        swapModule(module)
        {
            this.currentContent = module;
            this.menuVisible = false;
            if (module === 'Users')
            {
                this.title = 'Usuarios';
            }
            else if (module === 'Sportmen')
            {
                this.title = 'Deportistas';
            }
            else if (module==='Sports')
            {
                this.title = 'Deportes';
            }
            else if (module==='Teams')
            {
                this.title = 'Equipos';
            }
            else if (module==='Coaches')
            {
                this.title = 'Entrenadores';
            }
        },
        logout()
        {
            this.$session.clear();
            this.$session.destroy();
            this.$router.push('/');
        }
    },
    beforeMount()
    {
        let session = this.$session;
        let router = this.$router;

        //prevent disabled user logged
        let requestParams = {
            params: {
                userId: this.$session.get("userId")
            }
        };
        axios.post('checkEnabledUser', null, requestParams).then(function (response)
        {
            if (response.data.enabled === 0)
            {
                session.destroy();
                router.push('/');
            }
        }).catch(function ()
        {
        });

        //skip the logged user check
        if (session.has('temporal') && session.get('temporal') === true)
        {
            this.$session.set('temporal', false);
            return;
        }
        else if (session.has('temporal') && session.get('temporal') === false)
        {
            this.$session.destroy();
            this.$router.push('/');
        }

        //prevent non login use
        if (!this.$session.exists() && session.get('userId') == null)
        {
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>
#organization-logo
{
    background-image: url("../assets/logo.png");
    background-size: contain;
    height: 150px;
    width: 150px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

#organization-name
{
    width: 100%;
    font-size: 1.2em;
    text-align: center;
    font-weight: 650;
    margin-top: 10px;
}
</style>