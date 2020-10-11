<template>
    <v-menu ref="menu" v-model="showDialog" :close-on-content-click="false" :nudge-right="40" :return-value.sync="date"
            transition="scale-transition" offset-y min-width="290px">
        <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="date" :label="label" prepend-icon="event" v-bind="attrs" v-on="on" :rules="rules"
                          clearable readonly/>
        </template>
        <v-date-picker v-model="date" color="primary" min="1920-01-01" :allowed-dates="allowedDates">
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="showDialog = false">Cancelar</v-btn>
            <v-btn text color="primary" @click="onAccept">OK</v-btn>
        </v-date-picker>
    </v-menu>
</template>

<script>
export default {
    name: "DatePicker",
    props: [
        'label',
        'dateValue',
        'allowedDates',
        'rules'
    ],
    data: () => ({
        date: null,
        showDialog: false
    }),
    methods: {
        onAccept()
        {
            this.$refs.menu.save(this.date);
            this.$emit('onSelect', this.date);
            this.showDialog = false;
        },
        clear()
        {
            this.date = null;
            this.showDialog = false;
        },
        setDate()
        {
            /*console.log(this.value);
            console.log(new Date( this.value));
            console.log(new Date( this.value).toISOString());*/
            //console.log(this.dateValue);
            this.date = this.dateValue;
        }
    },
    mounted()
    {
        this.date = this.dateValue;
    }
};
</script>

<style scoped>

</style>