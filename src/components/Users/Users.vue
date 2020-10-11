<template>
    <div id="container">
        <v-dialog v-model="showFormDialog" width="90%" :eager="true" persistent>
            <v-card>
                <UserForm ref="form" :mode="mode" :executing="executing" @onClickClose="showFormDialog = false"
                          @onClickAction="doAction($event)"/>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showDeleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Confirmar Eliminación</v-card-title>
                <v-card-text>Si elimina el usuario también eliminará todos los datos relacionados al mismo, continue si
                    entiende las consecuencias
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" @click="showDeleteDialog = false" text>Cancelar</v-btn>
                    <v-btn color="green darken-1" :loading="executing" @click="deleteUser" text>Quiero Eliminar</v-btn>
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
            <v-data-table v-model="selected" :headers="headers" :items="this.fixedUsers" item-key="id" :search="search"
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
import { mapState, mapGetters } from "vuex";
import UserForm from "@/components/Users/UserForm";
import axios from 'axios';

export default {
    name: "Users",
    components: { UserForm },
    data: () => ({
        deleteMultipleDisabled: true,
        showFormDialog: false,
        showDeleteDialog: false,
        headers: [
            {
                text: 'Nombre de usuario',
                value: 'username',
            },
            {
                text: 'Perfil',
                value: 'profile.name'
            },
            {
                text: 'Habilitado',
                value: 'enabled'
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
        mode: '*',
        executing: false,
        userIdToDelete: 0
    }),
    methods: {
        onSelect(items)
        {
            this.deleteMultipleDisabled = items.length === 0;
            this.selected = items;
        },
        openFormDialog(mode, user)
        {
            this.mode = mode;
            this.showFormDialog = true;
            if (user == null)
            {
                return;
            }
            let currentUser = {
                id: user.id,
                profile: user.profile.id,
                username: user.username,
                enabled: user.enabled
            };
            currentUser.enabled = user.enabled === 'Si';
            this.$store.commit('usersStore/setCurrentUser', currentUser);
            this.$refs.form.setUser();
        },
        openDeleteDialog(userId)
        {
            this.userIdToDelete = userId;
            this.showDeleteDialog = true;
        },
        doAction(user)
        {
            const crypto = require('crypto');

            if (user.password === '')
            {
                delete user.password;
            }
            else
            {
                user.password = crypto.createHash('sha512').update(user.password).digest('hex');
            }

            if (this.mode === 'new')
            {
                delete user.enabled;
                this.createUser(user);
            }
            else if (this.mode === 'edit')
            {
                this.editUser(user);
            }
        },
        createUser(user)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            data.executing = true;
            axios.post('users', user).then(function (response)
            {
                store.dispatch('usersStore/getUsers');
                data.showFormDialog = false;
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Usuario Registrado',
                    color: 'success'
                };
                refs.form.clear();
            }).catch(function (error)
            {
                if (!handler(error, store)) //not resolved by handler
                {
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Error al registrar el usuario',
                        color: 'error'
                    };
                }
            }).then(function ()
            {
                data.executing = false;
            });
        },
        editUser(user)
        {
            let data = this.$data;
            let store = this.$store;
            let refs = this.$refs;
            let handler = this.sqlErrorHandler;

            user.enabled = user.enabled === true ? 1 : 0;

            data.executing = true;
            axios.patch(`users/${this.currentUser.id}`, user).then(function ()
            {
                store.dispatch('usersStore/getUsers');
                data.showFormDialog = false;
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Usuario Modificado',
                    color: 'success'
                };
                refs.form.clear();
            }).catch(function (error)
            {
                if (!handler(error, store)) //not resolved by handler
                {
                    store.state.appSnackBar = {
                        visible: true,
                        text: 'Error al modificar el usuario',
                        color: 'error'
                    };
                }
            }).then(function ()
            {
                data.executing = false;
            });
        },
        deleteUser()
        {
            let data = this.$data;
            let store = this.$store;

            data.executing = true;
            axios.delete(`users/${this.userIdToDelete}`).then(function ()
            {
                store.dispatch('usersStore/getUsers');
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Usuario Eliminado',
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
            if (!!errorResponse.response.data)
            {
                return false;
            }
            let errorMessage = errorResponse.response.data.cause.cause.message;
            let uniqueUsernameException = /(Duplicate entry)[\s\S]*'username'/;

            if (uniqueUsernameException.test(errorMessage))
            {
                store.state.appSnackBar = {
                    visible: true,
                    text: 'Ya existe ese nombre de usuario',
                    color: 'error'
                };
                return true;
            }
            return false;
        }
    },
    computed: {
        ...mapState("usersStore", [
            "users",
            'currentUser'
        ]), ...mapGetters("usersStore", ["fixedUsers"])
    },
    created()
    {
        this.$store.dispatch('usersStore/getUsers');
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