<template>
    <div id="container">
        <v-dialog v-model="showFormDialog" width="90%" :eager="true" persistent>
            <v-card>
                <SportForm ref="form" :mode="mode" :executing="executing" @onClickClose="showFormDialog = false"
                           @onClickAction="doAction($event)"/>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showDeleteDialog" max-width="290" persistent>
            <v-card>
                <v-card-title class="headline">Confirmar Eliminación</v-card-title>
                <v-card-text>Si elimina el deporte también eliminará todos los datos relacionados al mismo, continue
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
            <v-data-table v-model="selected" :headers="headers" :items="this.sports" item-key="id" :search="search"
                          class="elevation-1" :footer-props="{itemsPerPageOptions: paginationOption}" multi-sort
                          show-select @input="onSelect">
                <template v-slot:item.actions="{ item }">
                    <div v-if="item.editable===1">
                        <v-icon small class="mr-2" @click="openFormDialog('edit', item)">mdi-pencil</v-icon>
                        <v-icon small @click="openDeleteDialog(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import { mapState } from "vuex";
import SportForm from "@/components/Sports/SportForm";
import axios from "axios";

export default {
    name: "Sports",
    components: { SportForm },
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
        sportIdToDelete: 0
    }),
    methods: {
        onSelect(items)
        {
            this.deleteMultipleDisabled = items.length === 0;
            this.selected = items;
        },
        openFormDialog(mode, sport)
        {
            this.mode = mode;
            this.showFormDialog = true;

            if (sport == null)
            {
                return;
            }
            this.$store.commit('sportsStore/setCurrentSport', sport);
            this.$refs.form.setSport();
        },
        openDeleteDialog(sportId)
        {
            this.sportIdToDelete = sportId;
            this.showDeleteDialog = true;
        },
        doAction(sport)
        {
            if (this.mode === 'new')
            {
                this.createSport(sport);
            }
            else if (this.mode === 'edit')
            {
                this.editSport(sport);
            }
        },
        createSport(sport)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            data.executing = true;
            axios.post('sports', sport).then(function ()
            {
                store.dispatch('sportsStore/getSports');
                data.showFormDialog = false;
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Deporte Registrado',
                    color: 'success'
                };
                refs.form.clear();
            }).catch(function (error)
            {
                if (!handler(error, store)) //not resolved by handler
                {
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Error al registrar el deporte',
                        color: 'error'
                    };
                }
            }).then(function ()
            {
                data.executing = false;
            });
        },
        editSport(sport)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            data.executing = true;
            axios.patch(`sports/${store.state.sportsStore.currentSport.id}`, sport).then(function ()
            {
                store.dispatch('sportsStore/getSports');
                data.showFormDialog = false;
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Deporte Modificado',
                    color: 'success'
                };
                refs.form.clear();
            }).catch(function (error)
            {
                if (!handler(error, store)) //not resolved by handler
                {
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Error al modificar el deporte',
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
            axios.delete(`sports/${this.sportIdToDelete}`).then(function ()
            {
                store.dispatch('sportsStore/getSports');
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Deporte Eliminado',
                    color: 'success'
                };
                data.showDeleteDialog = false;

            }).catch(function ()
            {
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Error al eliminar el deporte',
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
        ...mapState('sportsStore', [
            'sports',
            'currentSport'
        ])
    },
    created()
    {
        this.$store.dispatch('sportsStore/getSports');
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