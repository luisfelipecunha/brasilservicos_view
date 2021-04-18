<template>
	<v-app>
		<v-app-bar
			app
			color="primary"
		>
			<v-btn
				icon
				@click="() => mostraNavBar = !mostraNavBar"
			>
				<v-icon> mdi-menu </v-icon>
			</v-btn>
		</v-app-bar>
		<ApplicationSidebar />
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
import ApplicationSidebar from '@/components/layout/ApplicationSidebar.vue'
import { Fragment } from 'vue-fragment'
import AppStore from "@/store/AppStore";

@Component({
	components: {
		ApplicationSidebar,
		Fragment,
	},
})
export default class App extends Vue {
	get mostraNavBar(): typeof AppStore.showSideBar {
		return AppStore.showSideBar
	}

	set mostraNavBar(valor: typeof AppStore.showSideBar) {
		AppStore.setShowSideBar(valor)
	}
}
</script>

<style>
body {
	height: 100vh;
}
</style>
