<template>
    <div id="container">
        <v-dialog v-model="showFormDialog" width="90%" :eager="true" persistent>
            <v-card>
                <CoachForm ref="form" :mode="mode" :executing="executing" @onClickClose="showFormDialog = false"
                           @onClickAction="doAction($event)"/>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showDeleteDialog" max-width="290" persistent>
            <v-card>
                <v-card-title class="headline">Confirmar Eliminación</v-card-title>
                <v-card-text>Si elimina el entrenador también eliminará todos los datos relacionados al mismo, continue
                    si entiende las consecuencias
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" @click="showDeleteDialog = false" text>Cancelar</v-btn>
                    <v-btn color="green darken-1" :loading="executing" @click="deleteSport" text>Quiero Eliminar
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
            <v-data-table v-model="selected" :headers="headers" :items="this.coaches" item-key="id" :search="search"
                          class="elevation-1" :footer-props="{itemsPerPageOptions: paginationOption}" multi-sort
                          show-select @input="onSelect">
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="openFormDialog('edit', item)">mdi-pencil</v-icon>
                    <v-icon small @click="openDeleteDialog(item.id)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import CoachForm from "@/components/Coaches/CoachForm";
import axios from "axios";
import { mapState } from "vuex";

export default {
    name: "Coaches",
    components: { CoachForm },
    data: () => ({
        deleteMultipleDisabled: true,
        showFormDialog: false,
        showDeleteDialog: false,
        headers: [
            {
                text: 'Nombre Completo',
                value: 'fullname',
            },
            {
                text: 'Email',
                value: 'email',
            },
            {
                text: 'Phone',
                value: 'phone',
            },
            {
                text: 'Rol',
                value: 'role',
            },
            {
                text: 'Usuario',
                value: 'user.username',
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
        coachIdToDelete: 0
    }),
    methods: {
        onSelect(items)
        {
            this.deleteMultipleDisabled = items.length === 0;
            this.selected = items;
        },
        openFormDialog(mode, coach)
        {
            this.mode = mode;
            this.showFormDialog = true;

            if (mode === 'new')
            {
                this.$store.dispatch('usersStore/getAvailableUsers');
            }
            else if (mode === 'edit')
            {
                this.$store.dispatch('usersStore/getAvailableUserAndCurrentCoach', coach.userId);
            }
            if (coach == null)
            {
                return;
            }
            this.$store.commit('coachesStore/setCurrentCoach', coach);
            this.$refs.form.setCoach();
        },
        openDeleteDialog(coachId)
        {
            this.coachIdToDelete = coachId;
            this.showDeleteDialog = true;
        },
        doAction(coach)
        {
            if (this.mode === 'new')
            {
                this.createCoach(coach);
            }
            else if (this.mode === 'edit')
            {
                this.editCoach(coach);
            }
        },
        createCoach(coach)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            data.executing = true;
            axios.post('coaches', coach).then(function ()
            {
                store.dispatch('coachesStore/getCoaches');
                data.showFormDialog = false;
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Entrenador Registrado',
                    color: 'success'
                };
                refs.form.clear();
            }).catch(function (error)
            {
                if (!handler(error, store)) //not resolved by handler
                {
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Error al registrar el entrenador',
                        color: 'error'
                    };
                }
            }).then(function ()
            {
                data.executing = false;
            });
        },
        editCoach(coach)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            data.executing = true;
            axios.patch(`coaches/${store.state.coachesStore.currentCoach.id}`, coach).then(function ()
            {
                store.dispatch('coachesStore/getCoaches');
                data.showFormDialog = false;
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Entrenador Modificado',
                    color: 'success'
                };
                refs.form.clear();
            }).catch(function (error)
            {
                if (!handler(error, store)) //not resolved by handler
                {
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Error al modificar el entrenador',
                        color: 'error'
                    };
                }
            }).then(function ()
            {
                data.executing = false;
            });
        },
        deleteSport()
        {
            let data = this.$data;
            let store = this.$store;

            data.executing = true;
            axios.delete(`coaches/${this.coachIdToDelete}`).then(function ()
            {
                store.dispatch('coachesStore/getCoaches');
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Entreandor Eliminado',
                    color: 'success'
                };
                data.showDeleteDialog = false;

            }).catch(function ()
            {
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Error al eliminar el entrenador',
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
                    text: 'Ya existe ese deporte',
                    color: 'error'
                };
                return true;
            }
            return false;
        }
    },
    computed: {
        ...mapState('coachesStore', [
            'coaches',
            'currentCoach'
        ])
    },
    created()
    {
        this.$store.dispatch('coachesStore/getSports');
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