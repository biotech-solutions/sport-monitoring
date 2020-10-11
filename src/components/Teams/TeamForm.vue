<template>
    <v-form v-model="valid" ref="form" :disabled="mode==='view'">
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="team.name" label="Nombre*" prepend-icon="people_alt" counter="50"
                                  :rules="[rules.required]" maxlength="50"/>
                </v-col>
                <v-col cols="12" md="4">
                    <ImageInput ref="logoImage" label="Logo*" :saved-url="team.logo" :error-message="errors.logo"
                                @onFileSelected="team.logo=$event; errors.logo=''"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-select v-if="mode!=='view'" :items="$store.state.coachesStore.coaches" label="Entrenador*"
                              :rules="[rules.required]" v-model="team.coachId" prepend-icon="sports"
                              item-text="fullname"
                              item-value="id" :loading="$store.state.coachesStore.coaches.length===0"/>
                    <v-text-field v-if="mode==='view'" :value="!!team.coach?team.coach.fullname:''"
                                  prepend-icon="sports_football"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <v-select v-if="mode!=='view'" :items="$store.state.sportsStore.sports" label="Deporte*"
                              :rules="[rules.required]" v-model="team.sportId" prepend-icon="sports_football"
                              item-text="name" item-value="id" :loading="$store.state.sportsStore.sports.length===0"/>
                    <v-text-field v-if="mode==='view'" :value="!!team.sport?team.sport.name:''"
                                  prepend-icon="sports_football"/>
                </v-col>
            </v-row>
            <div class="d-flex justify-end">
                <v-btn v-if="mode!=='view'" class="mr-4" color="primary" :loading="executing" @click="onActionClick" :disabled="!valid">
                    {{ buttonText }}
                </v-btn>
                <v-btn v-if="mode!=='view'" color="primary" @click="close" text>Cancelar</v-btn>
                <v-btn v-if="mode==='view'" color="primary" @click="close">Cerrar</v-btn>
            </div>
        </v-container>
    </v-form>
</template>

<script>
import ImageInput from "@/components/ImageInput";
import { mapState } from "vuex";

export default {
    name: "TeamForm",
    props: [
        'mode',
        'executing'
    ],
    components: { ImageInput },
    data: () => ({
        team: {
            logo: null
        },
        valid: true,
        rules: {
            required(value)
            {
                return !!value || 'Este campo es obligatorio';
            }
        },
        errors: {
            logo: ''
        }

    }),
    methods: {
        close()
        {
            this.clear();
            this.$emit("onClickClose");
        },
        onActionClick()
        {
            if (!this.validateLogo())
            {
                return;
            }
            this.$emit("onClickAction", this.team);
        },
        clear()
        {
            this.team.name = '';
            this.team.logo = null;
            this.team.sportId = '';
            this.team.coachId = '';
            this.$refs.logoImage.clear();
            this.$refs.form.resetValidation();
        },
        setTeam()
        {
            this.team = Object.assign({}, this.currentTeam);
        },
        validateLogo()
        {
            if (this.team.logo == null)
            {
                this.errors.logo = 'Seleccione la imagen del logo del equipo';
                return false;
            }
            return true;
        }
    },
    computed: {
        ...mapState('teamsStore', ['currentTeam']),
        buttonText()
        {
            if (this.mode === 'new')
            {
                return 'Crear';
            }
            else if (this.mode === 'edit')
            {
                return 'Modificar';
            }
            else
            {
                return 'Cerrar';
            }
        }
    },
};
</script>

<style scoped>

</style>