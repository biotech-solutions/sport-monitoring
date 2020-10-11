<template>
    <div id="container">
        <v-dialog v-model="showFormDialog" width="90%" :eager="true" persistent>
            <v-card>
                <TeamForm ref="form" :mode="mode" :executing="executing" @onClickClose="showFormDialog = false"
                          @onClickAction="doAction($event)"/>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showDeleteDialog" max-width="290" persistent>
            <v-card>
                <v-card-title class="headline">Confirmar Eliminación</v-card-title>
                <v-card-text>Si elimina el equipo también eliminará todos los datos relacionados al mismo, continue
                    si entiende las consecuencias
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" @click="showDeleteDialog = false" text>Cancelar</v-btn>
                    <v-btn color="green darken-1" :loading="executing" @click="deleteTeam" text>Quiero Eliminar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card>
            <v-card-title>
                <div id="options-container">
                    <v-btn class="mr-4" color="primary" @click="openFormDialog('new')"> Ingresar</v-btn>
                    <v-btn v-if="false" color="primary" :disabled="deleteMultipleDisabled">Eliminar</v-btn>
                </div>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details/>
            </v-card-title>
            <v-data-table v-model="selected" :headers="headers" :items="this.teams" item-key="id" :search="search"
                          class="elevation-1" :footer-props="{itemsPerPageOptions: paginationOption}" multi-sort
                          show-select @input="onSelect">
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="openFormDialog('view', item)">mdi-eye</v-icon>
                    <v-icon small class="mr-2" @click="openFormDialog('edit', item)">mdi-pencil</v-icon>
                    <v-icon small @click="openDeleteDialog(item.id)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import firebase from 'firebase/app';
import 'firebase/storage';
import TeamForm from "@/components/Teams/TeamForm";

export default {
    name: "Teams",
    components: { TeamForm },
    data: () => ({
        deleteMultipleDisabled: true,
        showFormDialog: false,
        showDeleteDialog: false,
        headers: [
            {
                text: 'Nombre',
                value: 'name',
            },
            {
                text: 'Entrenador',
                value: 'coach.fullname'
            },
            {
                text: 'Deporte',
                value: 'sport.name'
            },
            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },
        ],
        selected: [],
        search: '',
        paginationOption: [
            10,
            25,
            50,
            100
        ],
        mode: '',
        executing: false,
        teamIdToDelete: 0
    }),
    methods: {
        onSelect(items)
        {
            this.deleteMultipleDisabled = items.length === 0;
            this.selected = items;
        },
        openFormDialog(mode, team)
        {
            let refs = this.$refs;
            let store = this.$store;

            this.mode = mode;

            this.$store.dispatch('sportsStore/getSports');
            this.$store.dispatch('coachesStore/getCoaches');

            this.showFormDialog = true;
            if (team == null)
            {
                return;
            }
            let teamFixed = Object.assign({}, team);

            let promiseLogo = this.getFirebaseUrl(teamFixed.logo);

            promiseLogo.then(function (value)
            {
                teamFixed.logo = value;
                store.commit('teamsStore/setCurrentTeam', teamFixed);
                refs.form.setTeam();
            });
        },
        openDeleteDialog(teamId)
        {
            this.teamIdToDelete = teamId;
            this.showDeleteDialog = true;
        },
        doAction(team)
        {
            if (this.mode === 'new')
            {
                this.createTeam(team);
            }
            else if (this.mode === 'edit')
            {
                this.editTeam(team);
            }
        },
        createTeam(team)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            data.executing = true;

            let promiseLogo = this.getBase64String(team.logo);
            promiseLogo.then(function (value)
            {
                team.logoBase64 = value;

                axios.post('teams', team).then(function ()
                {
                    store.dispatch('teamsStore/getTeams');
                    data.showFormDialog = false;
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Equipo Registrado',
                        color: 'success'
                    };
                    refs.form.clear();
                }).catch(function (error)
                {
                    if (!handler(error, store)) //not resolved by handler
                    {
                        store.state.appSnackBar = {
                            visible: true,
                            text: 'Error al registrar el equipo',
                            color: 'error'
                        };
                    }
                }).then(function ()
                {
                    data.executing = false;
                });
            });
        },
        editTeam(team)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            data.executing = true;

            let promiseLogo = this.getBase64String(team.logo);

            promiseLogo.then(function (value)
            {
                team.logoBase64 = value;
                
                axios.patch(`teams/${store.state.teamsStore.currentTeam.id}`, team).then(function ()
                {
                    store.dispatch('teamsStore/getTeams');
                    data.showFormDialog = false;
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Equipo Modificado',
                        color: 'success'
                    };
                    refs.form.clear();
                }).catch(function (error)
                {
                    if (!handler(error, store)) //not resolved by handler
                    {
                        store.state.appSnackBar = {
                            visible: true,
                            text: 'Error al modificar el equipo',
                            color: 'error'
                        };
                    }
                }).then(function ()
                {
                    data.executing = false;
                });
            });
        },
        deleteTeam()
        {
            let data = this.$data;
            let store = this.$store;

            data.executing = true;
            axios.delete(`sports/${this.sportIdToDelete}`).then(function ()
            {
                store.dispatch('teamsStore/getTeams');
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Equipo Eliminado',
                    color: 'success'
                };
                data.showDeleteDialog = false;

            }).catch(function ()
            {
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Error al eliminar el equipo',
                    color: 'error'
                };
            }).then(function ()
            {
                data.executing = false;
            });
        },
        sqlErrorHandler(errorResponse, store)
        {
            if (!!errorResponse.response.data)
            {
                return false;
            }
            let errorMessage = errorResponse.response.data.cause.cause.message;
            let uniqueUsernameException = /(Duplicate entry)[\s\S]*'name'/;

            if (uniqueUsernameException.test(errorMessage))
            {
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Ya existe ese equipo',
                    color: 'error'
                };
                return true;
            }
            return false;
        },
        getBase64String(image)
        {
            return new Promise(resolve =>
            {

                if (image == null || typeof image == 'string')
                {
                    resolve();
                }
                let reader = new FileReader();
                let blob = new Blob([image], { type: 'image/jpg' });
                reader.readAsDataURL(blob);
                reader.onloadend = function ()
                {
                    resolve(reader.result);
                };
            });
        },
        getFirebaseUrl(path)
        {
            const storage = firebase.storage();
            return storage.ref(path).getDownloadURL();
        },
    },
    computed: {
        ...mapState("teamsStore", [
            "teams",
            'currentTeam'
        ])
    },
    created()
    {
        this.$store.dispatch('teamsStore/getTeams');
    },
    mounted()
    {
        if (this.$refs.form != null)
        {
            this.$refs.form.clear();
        }
    }
};
</script>

<style scoped>
#container
{
    margin: 2vw 2vw 0 2vw;
    padding: 20px;
}
</style>