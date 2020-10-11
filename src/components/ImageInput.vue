<template>
    <div>
        <v-file-input accept=".jpg,.jpeg" :label="label" v-model="file" @change="loadImage"
                      :error-messages="errorMessage" :error="!!errorMessage" chips show-size/>
        <v-img v-if="url!==''" :src="url" alt="Previsualización de la imagen" />
    </div>
</template>

<script>
export default {
    name: "ImageInput",
    props: [
        'label',
        'savedUrl',
        'errorMessage'
    ],
    data: () => ({
        file: null,
    }),
    methods: {
        loadImage: function (file)
        {
            this.file = file;
            this.$emit("onFileSelected", file);
        },
        clear()
        {
            this.file = null;
        },
    },
    computed: {
        url()
        {
            if (this.savedUrl == null)
            {
                return '';
            }
            if (this.savedUrl !== '' && typeof this.savedUrl === 'string')
            {
                return this.savedUrl;
            }
            else if (this.file == null)
            {
                return '';
            }
            return URL.createObjectURL(this.file);
        }
    }
};
</script>

<style scoped>
img
{
    width: 100%;
}
</style>