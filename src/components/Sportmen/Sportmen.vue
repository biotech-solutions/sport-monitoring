<template>
    <div id="container">
        <v-dialog v-model="showFormDialog" width="90%" :eager="true" persistent>
            <v-card>
                <SportmanForm ref="form" :mode="mode" :executing="executing" @onClickClose="showFormDialog = false"
                              @onClickAction="doAction($event)"/>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showDeleteDialog" max-width="290" persistent>
            <v-card>
                <v-card-title class="headline">Confirmar Eliminación</v-card-title>
                <v-card-text>Si elimina el deportista también eliminará todos los datos relacionados al mismo, continue
                    si
                    entiende las consecuencias
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" @click="showDeleteDialog = false" text>Cancelar</v-btn>
                    <v-btn color="green darken-1" :loading="executing" @click="deleteSportman" text>Quiero Eliminar
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
            <v-data-table v-model="selected" :headers="headers" :items="this.sportmen" item-key="id" :search="search"
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
import SportmanForm from "@/components/Sportmen/SportmanForm";
import axios from "axios";
import firebase from 'firebase/app';
import 'firebase/storage';


export default {
    name: "Sportmen",
    components: { SportmanForm },
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
                text: 'Apellido',
                value: 'surname'
            },
            {
                text: 'Identificación',
                value: 'identification'
            },
            {
                text: 'Correo Electrónico',
                value: 'email'
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
        sportmanIdToDelete: 0
    }),
    methods: {
        onSelect(items)
        {
            this.deleteMultipleDisabled = items.length === 0;
            this.selected = items;
        },
        openFormDialog(mode, sportman)
        {
            let refs = this.$refs;
            let store = this.$store;

            this.mode = mode;
            if (mode === 'new')
            {
                this.$store.dispatch('usersStore/getAvailableUsers');
            }
            else if (mode === 'edit')
            {
                this.$store.dispatch('usersStore/getAvailableUsersAndCurrentSportman', sportman.userId);
            }
            this.showFormDialog = true;
            if (sportman == null)
            {
                return;
            }
            let sportmanFixed = Object.assign({}, sportman);

            let promiseIdentification = this.getFirebaseUrl(sportmanFixed.identificationFile);
            let promiseAuthorization = this.getFirebaseUrl(sportmanFixed.authorizationFile);

            Promise.all([
                promiseIdentification,
                promiseAuthorization
            ]).then(function (value)
            {
                sportmanFixed.identificationFile = value[0];
                sportmanFixed.authorizationFile = value[1];
                store.commit('sportmenStore/setCurrentSportman', sportmanFixed);
                refs.form.setSportman();
            });
        },
        openDeleteDialog(userId)
        {
            this.sportmanIdToDelete = userId;
            this.showDeleteDialog = true;
        },
        doAction(sportman)
        {
            if (this.mode === 'new')
            {
                this.createSportman(sportman);
            }
            else if (this.mode === 'edit')
            {
                this.editSportman(sportman);
            }
        },
        createSportman(sportman)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            data.executing = true;

            let promiseIdentification = this.getBase64String(sportman.identificationFile);
            let promiseAuthorization = this.getBase64String(sportman.authorizationFile);

            Promise.all([
                promiseIdentification,
                promiseAuthorization
            ]).then(function (value)
            {
                sportman.identificationFileBase64 = value[0];
                sportman.authorizationFileBase64 = value[1];
                axios.post('sportmen', sportman).then(function ()
                {
                    store.dispatch('sportmenStore/getSportmen');
                    data.showFormDialog = false;
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Deportista Registrado',
                        color: 'success'
                    };
                    refs.form.clear();
                }).catch(function (error)
                {
                    if (!handler(error, store)) //not resolved by handler
                    {
                        store.state.appSnackBar = {
                            visible: true,
                            text: 'Error al registrar el deportista',
                            color: 'error'
                        };
                    }
                }).then(function ()
                {
                    data.executing = false;
                });
            });
        },
        editSportman(sportman)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            data.executing = true;

            let promiseIdentification = this.getBase64String(sportman.identificationFile);
            let promiseAuthorization = this.getBase64String(sportman.authorizationFile);
            Promise.all([
                promiseIdentification,
                promiseAuthorization
            ]).then(function (value)
            {
                sportman.identificationFileBase64 = value[0];
                sportman.authorizationFileBase64 = value[1];
                axios.patch(`sportmen/${store.state.sportmenStore.currentSportman.id}`, sportman).then(function ()
                {
                    store.dispatch('sportmenStore/getSportmen');
                    data.showFormDialog = false;
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Deportista Modificado',
                        color: 'success'
                    };
                    refs.form.clear();
                }).catch(function (error)
                {
                    if (!handler(error, store)) //not resolved by handler
                    {
                        store.state.appSnackBar = {
                            visible: true,
                            text: 'Error al modificar el deportista',
                            color: 'error'
                        };
                    }
                }).then(function ()
                {
                    data.executing = false;
                });
            });
        },
        deleteSportman()
        {
            let data = this.$data;
            let store = this.$store;

            data.executing = true;
            axios.delete(`sportmen/${this.sportmanIdToDelete}`).then(function ()
            {
                store.dispatch('sportmenStore/getSportmen');
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Deportista Eliminado',
                    color: 'success'
                };
                data.showDeleteDialog = false;

            }).catch(function ()
            {
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Error al eliminar el usuario',
                    color: 'error'
                };
            }).then(function ()
            {
                data.executing = false;
            });
        },
        sqlErrorHandler(errorResponse, store)
        {
            if (errorResponse.response.data == null)
            {
                return false;
            }
            let message = errorResponse.response.data.message;
            store.state.appSnackBar = {
                visible: true,
                text: message,
                color: 'error'
            };
            return true;
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
        ...mapState("sportmenStore", [
            "sportmen",
            'currentSportman'
        ])
    },
    created()
    {
        this.$store.dispatch('sportmenStore/getSportmen');
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