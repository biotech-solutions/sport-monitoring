<template>
    <v-select :items="countries" :label="label" v-model="selectedCountry" prepend-icon="map"/>
</template>

<script>
export default {
    name: "CountrySelect",
    props: ["label","selected"],
    data: () => ({
        selectedCountry: "",
        countries: ['Afganistán',
            'Albania',
            'Alemania',
            'Andorra',
            'Angola',
            'Anguila',
            'Antártida',
            'Antigua y Barbuda',
            'Antillas holandesas',
            'Arabia Saudí',
            'Argelia',
            'Argentina',
            'Armenia',
            'Aruba',
            'Australia',
            'Austria',
            'Azerbaiyán',
            'Bahamas',
            'Bahrein',
            'Bangladesh',
            'Barbados',
            'Bélgica',
            'Belice',
            'Benín',
            'Bermudas',
            'Bhután',
            'Bielorrusia',
            'Birmania',
            'Bolivia',
            'Bosnia y Herzegovina',
            'Botsuana',
            'Brasil',
            'Brunei',
            'Bulgaria',
            'Burkina Faso',
            'Burundi',
            'Cabo Verde',
            'Camboya',
            'Camerún',
            'Canadá',
            'Chad',
            'Chile',
            'China',
            'Chipre',
            'Ciudad estado del Vaticano',
            'Colombia',
            'Comores',
            'Congo',
            'Corea',
            'Corea del Norte',
            'Costa del Marfíl',
            'Costa Rica',
            'Croacia',
            'Cuba',
            'Dinamarca',
            'Djibouri',
            'Dominica',
            'Ecuador',
            'Egipto',
            'El Salvador',
            'Emiratos Arabes Unidos',
            'Eritrea',
            'Eslovaquia',
            'Eslovenia',
            'España',
            'Estados Unidos',
            'Estonia',
            'Etiopía',
            'Ex-República Yugoslava de Macedonia',
            'Filipinas',
            'Finlandia',
            'Francia',
            'Gabón',
            'Gambia',
            'Georgia',
            'Georgia del Sur y las islas Sandwich del Sur',
            'Ghana',
            'Gibraltar',
            'Granada',
            'Grecia',
            'Groenlandia',
            'Guadalupe',
            'Guam',
            'Guatemala',
            'Guayana',
            'Guayana francesa',
            'Guinea',
            'Guinea Ecuatorial',
            'Guinea-Bissau',
            'Haití',
            'Holanda',
            'Honduras',
            'Hong Kong R. A. E',
            'Hungría',
            'India',
            'Indonesia',
            'Irak',
            'Irán',
            'Irlanda',
            'Isla Bouvet',
            'Isla Christmas',
            'Isla Heard e Islas McDonald',
            'Islandia',
            'Islas Caimán',
            'Islas Cook',
            'Islas de Cocos o Keeling',
            'Islas Faroe',
            'Islas Fiyi',
            'Islas Malvinas Islas Falkland',
            'Islas Marianas del norte',
            'Islas Marshall',
            'Islas menores de Estados Unidos',
            'Islas Palau',
            'Islas Salomón',
            'Islas Tokelau',
            'Islas Turks y Caicos',
            'Islas Vírgenes EE.UU.',
            'Islas Vírgenes Reino Unido',
            'Israel',
            'Italia',
            'Jamaica',
            'Japón',
            'Jordania',
            'Kazajistán',
            'Kenia',
            'Kirguizistán',
            'Kiribati',
            'Kuwait',
            'Laos',
            'Lesoto',
            'Letonia',
            'Líbano',
            'Liberia',
            'Libia',
            'Liechtenstein',
            'Lituania',
            'Luxemburgo',
            'Macao R. A. E',
            'Madagascar',
            'Malasia',
            'Malawi',
            'Maldivas',
            'Malí',
            'Malta',
            'Marruecos',
            'Martinica',
            'Mauricio',
            'Mauritania',
            'Mayotte',
            'México',
            'Micronesia',
            'Moldavia',
            'Mónaco',
            'Mongolia',
            'Montserrat',
            'Mozambique',
            'Namibia',
            'Nauru',
            'Nepal',
            'Nicaragua',
            'Níger',
            'Nigeria',
            'Niue',
            'Norfolk',
            'Noruega',
            'Nueva Caledonia',
            'Nueva Zelanda',
            'Omán',
            'Panamá',
            'Papua Nueva Guinea',
            'Paquistán',
            'Paraguay',
            'Perú',
            'Pitcairn',
            'Polinesia francesa',
            'Polonia',
            'Portugal',
            'Puerto Rico',
            'Qatar',
            'Reino Unido',
            'República Centroafricana',
            'República Checa',
            'República de Sudáfrica',
            'República Democrática del Congo Zaire',
            'República Dominicana',
            'Reunión',
            'Ruanda',
            'Rumania',
            'Rusia',
            'Samoa',
            'Samoa occidental',
            'San Kitts y Nevis',
            'San Marino',
            'San Pierre y Miquelon',
            'San Vicente e Islas Granadinas',
            'Santa Helena',
            'Santa Lucía',
            'Santo Tomé y Príncipe',
            'Senegal',
            'Serbia y Montenegro',
            'Sychelles',
            'Sierra Leona',
            'Singapur',
            'Siria',
            'Somalia',
            'Sri Lanka',
            'Suazilandia',
            'Sudán',
            'Suecia',
            'Suiza',
            'Surinam',
            'Svalbard',
            'Tailandia',
            'Taiwán',
            'Tanzania',
            'Tayikistán',
            'Territorios británicos del océano Indico',
            'Territorios franceses del sur',
            'Timor Oriental',
            'Togo',
            'Tonga',
            'Trinidad y Tobago',
            'Túnez',
            'Turkmenistán',
            'Turquía',
            'Tuvalu',
            'Ucrania',
            'Uganda',
            'Uruguay',
            'Uzbekistán',
            'Vanuatu',
            'Venezuela',
            'Vietnam',
            'Wallis y Futuna',
            'Yemen',
            'Zambia',
            'Zimbabue'],
    }),
    mounted()
    {
        this.selectedCountry = this.selected;
    }
};
</script>

<style scoped>

</style>