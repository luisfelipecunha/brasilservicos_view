<template>
	<v-navigation-drawer
		:value="mostraNavBar"
		app
		@input="valor => mostraNavBar = valor"
		width="200"
	>
		<v-divider />
		<v-list
			nav
			dense
		>
				<v-list-item
					v-for="(item) in itensDeMenu"
					:key="item.title"
					:to="item.route"
					:exact="item.exact"
				>
					<v-list-item-icon class="mr-3">
						<v-icon v-text="item.icon"/>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<script lang="ts">
import {Vue, Component } from 'vue-property-decorator'
import AppStore from "@/store/AppStore";

@Component
export default class ApplicationSidebar extends Vue {
	itensDeMenu = [
		{
			icon: 'mdi-clipboard-edit-outline',
			title: 'Pedidos',
			route: { name: 'Pedidos' },
		},
		{
			icon: 'mdi-tools',
			title: 'Serviços',
			route: { name: 'Servicos' },
		},
	]

	get mostraNavBar(): typeof AppStore.showSideBar {
		return AppStore.showSideBar
	}

	set mostraNavBar(valor: typeof AppStore.showSideBar) {
		AppStore.setShowSideBar(valor)
	}
}
</script>

<style scoped>

</style>
