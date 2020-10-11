import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import CustomIcon from "@/components/CustomIcon";

Vue.use(Vuetify);

export default new Vuetify({
	icons: {
		values: {
			custom: { // name of our custom icon
				component: CustomIcon, // our custom component
			}
		}
	}
});
