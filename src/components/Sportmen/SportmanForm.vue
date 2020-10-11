<template>
    <v-form v-model="valid" ref="form" :disabled="mode==='view'">
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="sportman.name" label="Nombre*" prepend-icon="account_box" counter="50"
                                  :rules="[rules.required]" maxlength="50"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="sportman.surname" label="Apellido*" counter="50" maxlength="50"
                                  :rules="[rules.required]" prepend-icon="account_box"/>
                </v-col>
                <v-col cols="12" md="4">
                    <DatePicker ref="birthdatePicker" :dateValue="sportman.birthdate" label="Fecha de Nacimiento*"
                                :allowed-dates="getPastDates" :rules="[rules.required]"
                                @onSelect="sportman.birthdate=$event"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <CountrySelect label="País de Origen" :selected="sportman.countryOfOrigin"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-select :items="idTypeSelect" label="Tipo de Identificación" v-model="sportman.identificationType"
                              prepend-icon="contacts" :rules="[rules.required]" @change="onSelectIdentificationType"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="sportman.identification" :counter="idLenght" :maxlength="idLenght"
                                  label="Identificación*" :error-messages="errors.idCardError"
                                  :error="!!errors.idCardError"
                                  prepend-icon="contacts" @input="errors.idCardError=''"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <ImageInput ref="idImage" label="Archivo de Identificación*"
                                :error-message="errors.identificationFile" :saved-url="sportman.identificationFile"
                                @onFileSelected="sportman.identificationFile = $event; errors.identificationFile=''"/>
                </v-col>
                <v-col cols="12" md="6">
                    <ImageInput ref="authImage" label="Archivo de Autorización*"
                                :error-message="errors.authorizationFile" :saved-url="sportman.authorizationFile"
                                @onFileSelected="sportman.authorizationFile = $event; errors.authorizationFile=''"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <v-select :items="maritalStatusSelect" label="Estado Civíl*" v-model="sportman.maritalStatus"
                              prepend-icon="family_restroom" :rules="[rules.required]"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="sportman.email" label="Correo Electrónico*" prepend-icon="email"
                                  counter="128"
                                  maxlength="128" :rules="[rules.required, rules.validEmail]"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="sportman.phone" label="Teléfono*" prepend-icon="smartphone" counter="25"
                                  maxlength="25" :rules="[rules.required, rules.validPhone]"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <v-select :items="bloodTypeSelect" label="Tipo de Sangre*" :rules="[rules.required]"
                              v-model="sportman.healthInformation.bloodType" prepend-icon="opacity"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-select :items="shirtSizeSelect" label="Talla de Camiseta*" :rules="[rules.required]"
                              v-model="sportman.technicalInformation.shirtSize" prepend-icon="checkroom"/>
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="sportman.technicalInformation.shoeSize" label="Talla de Zapato*"
                                  prepend-icon="straighten" type="number" min="30" max="50" :rules="[rules.required]"
                                  required/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <DatePicker ref="lastHealthCheckPicker" :dateValue="sportman.healthInformation.lastHealthCheck"
                                label="Última Revision Médica" :allowed-dates="getPastDates"
                                @onSelect="sportman.healthInformation.lastHealthCheck=$event"/>
                </v-col>
                <v-col cols="12" md="4">
                    <DatePicker ref="lastDewormingPicker" :dateValue="sportman.healthInformation.lastDeworming"
                                label="Última Desparasitación" :allowed-dates="getPastDates"
                                @onSelect="sportman.healthInformation.lastDeworming=$event"/>
                </v-col>
                <v-col cols="12" md="4">
                    <DatePicker ref="lastSurgerPicker" :dateValue="sportman.healthInformation.lastSurgery"
                                label="Última Cirugía" :allowed-dates="getPastDates"
                                @onSelect="sportman.healthInformation.lastSurgery=$event"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                    <v-textarea v-model="sportman.healthInformation.alergies" label="Alergias"
                                prepend-icon="coronavirus" counter="250" maxlength="250" rows=3 auto-grow/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                    <v-textarea v-model="sportman.healthInformation.diseases" label="Enfermedades*" prepend-icon="sick"
                                counter="250" maxlength="250" rows=3 :rules="[rules.required]" auto-grow/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                    <v-textarea v-model="sportman.healthInformation.injuries" label="Lesiones" prepend-icon="healing"
                                counter="250" maxlength="250" rows=3 auto-grow/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <v-select v-if="mode!=='view'" :items="$store.state.usersStore.availableUsers"
                              label="Usuario*" :rules="[rules.required]" v-model="sportman.userId"
                              prepend-icon="contacts" item-text="username" item-value="id"
                              :loading="$store.state.usersStore.availableUsers.length===0"/>
                    <v-text-field v-if="mode==='view'" :value="!!sportman.user.username?sportman.user.username:''"
                                  prepend-icon="contacts"/>
                </v-col>
            </v-row>
            <div class="d-flex justify-end">
                <v-btn v-if="mode!=='view'" class="mr-4" color="primary" :loading="executing" @click="onActionClick"
                       :disabled="!valid">
                    {{ buttonText }}
                </v-btn>
                <v-btn v-if="mode!=='view'" color="primary" @click="close" text>Cancelar</v-btn>
                <v-btn v-if="mode==='view'" color="primary" @click="close">Cerrar</v-btn>
            </div>
        </v-container>
    </v-form>
</template>

<script>
import CountrySelect from "@/components/CountrySelect";
import ImageInput from "@/components/ImageInput";
import DatePicker from "@/components/DatePicker";
import { mapState } from "vuex";

export default {
    name: "SportmanForm",
    props: [
        'mode',
        'executing'
    ],
    components: {
        DatePicker,
        ImageInput,
        CountrySelect
    },
    data: () => ({
        sportman: {
            name: '',
            surname: '',
            birthdate: '',
            countryOfOrigin: "Ecuador",
            identificationType: "Cédula",
            identification: '',
            identificationFile: null,
            authorizationFile: null,
            maritalStatus: '',
            email: '',
            phone: '',
            technicalInformation: {
                shirtSize: '',
                shoeSize: 0,
            },
            healthInformation: {
                bloodType: '',
                alergies: '',
                diseases: '',
                injuries: '',
                lastHealthCheck: null,
                lastDeworming: null,
                lastSurgery: null
            },
            userId: 0
        },
        idLenght: 10,
        idTypeSelect: [
            'Cédula',
            'Pasaporte'
        ],
        maritalStatusSelect: [
            'Soltero',
            'Casado',
            'Divorciado',
            'Unión Libre'
        ],
        bloodTypeSelect: [
            'A+',
            'A-',
            'B+',
            'B-',
            'O+',
            'O-',
            'AB+',
            'AB-'
        ],
        shirtSizeSelect: [
            'XXS',
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL',
        ],
        valid: true,
        rules: {
            required(value)
            {
                return !!value || 'Este campo es obligatorio.';
            },
            validEmail(value)
            {
                let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if (!regex.test(value))
                {
                    return 'Correo electrónico no válido';
                }
                return true;
            },
            validPhone(value)
            {
                let regex = /[0-9]{7,}/;
                if (!regex.test(value))
                {
                    return 'Número telefónico no válido';
                }
                return true;
            }
        },
        errors: {
            idCardError: '',
            identificationFile: '',
            authorizationFile: ''
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
            if (!this.validateIdCard() || !this.validateIdentificationFile() || !this.validateAuthorizationFile())
            {
                return;
            }
            this.$emit("onClickAction", this.sportman);
        },
        clear()
        {
            this.sportman.name = '';
            this.sportman.surname = '';
            this.sportman.birthdate = null;
            this.sportman.countryOfOrigin = 'Ecuador';
            this.sportman.identificationType = 'Cédula';
            this.sportman.identification = '';
            this.sportman.identificationFile = null;
            this.sportman.authorizationFile = null;
            this.sportman.maritalStatus = '';
            this.sportman.email = '';
            this.sportman.phone = '';
            this.sportman.technicalInformation = {
                shirtSize: '',
                shoeSize: 0,
            };
            this.sportman.healthInformation = {
                bloodType: '',
                alergies: '',
                diseases: '',
                injuries: '',
                lastHealthCheck: null,
                lastDeworming: null,
                lastSurgery: null
            };
            this.sportman.userId = 0;
            this.idCardError = '';
            // this.valid = true;
            this.$refs.birthdatePicker.clear();
            this.$refs.lastHealthCheckPicker.clear();
            this.$refs.lastDewormingPicker.clear();
            this.$refs.lastSurgerPicker.clear();
            this.$refs.idImage.clear();
            this.$refs.authImage.clear();
            this.$refs.form.resetValidation();
        },
        setSportman()
        {
            this.sportman = Object.assign({}, this.currentSportman);
        },
        onSelectIdentificationType(value)
        {
            if (value === "Cédula")
            {
                this.idLenght = 10;
            }
            else
            {
                this.idLenght = 25;
            }
        },
        getPastDates(date)
        {
            let today = new Date();
            return new Date(date) < today;
        },
        validateIdCard()
        {
            let idCard = this.sportman.identification;

            if (this.sportman.identificationType === 'Pasaporte')
            {
                return true;
            }
            if (idCard == null || idCard.length !== 10)
            {
                this.errors.idCardError = 'Cédula no válida';
                return false;
            }

            //province check
            let regionDigit = idCard.substring(0, 2);
            if (regionDigit < 1 || regionDigit > 24)
            {
                this.errors.idCardError = 'Cédula no válida';
                return false;
            }

            //third digit check
            let thirdDigit = idCard.substring(3, 3);
            if (thirdDigit > 6)
            {
                this.errors.idCardError = 'Cédula no válida';
                return false;
            }

            let pairsSum = parseInt(idCard.substring(1, 2)) + parseInt(idCard.substring(3, 4)) + parseInt(idCard.substring(5, 6)) + parseInt(idCard.substring(7, 8));

            let n1 = idCard.substring(0, 1) * 2;
            if (n1 > 9)
            {
                n1 = n1 - 9;
            }

            let n3 = idCard.substring(2, 3) * 2;
            if (n3 > 9)
            {
                n3 = n3 - 9;
            }

            let n5 = idCard.substring(4, 5) * 2;
            if (n5 > 9)
            {
                n5 = n5 - 9;
            }

            let n7 = idCard.substring(6, 7) * 2;
            if (n7 > 9)
            {
                n7 = n7 - 9;
            }

            let n9 = idCard.substring(8, 9) * 2;
            if (n9 > 9)
            {
                n9 = n9 - 9;
            }

            let oddSum = n1 + n3 + n5 + n7 + n9;
            let sum = pairsSum + oddSum;
            let sumFirstDigit = String(sum).substring(0, 1);
            let superiorTen = (parseInt(sumFirstDigit) + 1) * 10;
            let validatorDigit = superiorTen - sum;

            if (validatorDigit === 10)
            {
                validatorDigit = 0;
            }

            let lastDigit = parseInt(idCard.substring(9, 10));
            if (validatorDigit === lastDigit)
            {
                return true;
            }
            else
            {
                this.errors.idCardError = 'Cédula no válida';
                return false;
            }
        },
        validateIdentificationFile()
        {
            if (this.sportman.identificationFile == null)
            {
                this.errors.identificationFile = 'Seleccione la imagen de la identificación';
                return false;
            }
            return true;
        },
        validateAuthorizationFile()
        {
            if (this.sportman.authorizationFile == null)
            {
                this.errors.authorizationFile = 'Seleccione la imagen de la autorización';
                return false;
            }
            return true;
        }

    },
    computed: {
        ...mapState("sportmenStore", ["currentSportman"]),
        buttonText()
        {
            if (this.mode === "new")
            {
                return "Crear";
            }
            else if (this.mode === "edit")
            {
                return "Modificar";
            }
            else
            {
                return "Cerrar";
            }
        }
    },
    updated()
    {
        if (this.mode !== 'new')
        {
            this.$refs.birthdatePicker.setDate();
            this.$refs.lastHealthCheckPicker.setDate();
            this.$refs.lastDewormingPicker.setDate();
            this.$refs.lastSurgerPicker.setDate();
        }
    }
};
</script>

<style scoped>

</style>