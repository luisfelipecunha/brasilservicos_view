<template>
	<v-autocomplete
		type="search"
		v-bind="$attrs"
		v-on="$listeners"
		:items="pagina.content"
		:loading="carregando"
		:search-input.sync="busca"
		item-value="id"
		:no-data-text="noDataMessage"
		item-text="nome"
		no-filter
	>
		<template #item="{ item }">
			<template>
				<v-list-item-content v-text="item.nome"></v-list-item-content>
			</template>
		</template>
		<template v-if="carregouTodosOsServicos" slot="append-item">
			<v-list-item>
				<p style="margin: auto; color: gray">Todos servicos foram carregados.</p>
			</v-list-item>
		</template>
		<template v-else slot="append-item">
			<v-list-item
				@click="() => pageNext()"
			>
				<p style="margin: auto; color: gray">Carregar mais serviços</p>
			</v-list-item>
		</template>
		<template
			v-for="(_, name) in $scopedSlots"
			:slot="name"
			slot-scope="slotData"
		>
			<slot :name="name" v-bind="slotData" />
		</template>

		<template v-for="(_, slotName) in $slots" v-slot:[slotName]>
			<slot :name="slotName" />
		</template>
	</v-autocomplete>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Page, Pageable, Servico} from "@/models";
import {obterPaginaVazia} from "@/shared/util-paginacao";
import axios, {CancelTokenSource} from "axios";
import request from "../../shared/request";

@Component
export default class SeletorDeServicos extends Vue {
	page: Pageable = {
		page: 0,
		size: 5,
	}
	pagina: Page<Servico> = obterPaginaVazia()
	cancelToken: CancelTokenSource | null = null
	busca = ''
	carregando = false
	carregouTodosOsServicos = false
	servicos: Servico[] = []
	show = false
	mensagem = ''
	corDaMensagem = ''

	async created() {
		await this.buscar()
	}

	async buscar() {
		try {
			this.carregando = true
			if (this.cancelToken) this.cancelToken.cancel()
			this.cancelToken = axios.CancelToken.source()
			this.pagina = (await request.get<Page<Servico>>('/servicos', {
				params: {
					page: this.busca ? this.page.page || -1 : this.page.page || 0,
					size: this.page.size,
					busca: this.busca || undefined,
				},
			})).data

			this.pagina.content
				.forEach(servico => this.servicos.push(servico))
			this.carregouTodosOsServicos = this.pagina.last
			this.carregando = false
		} catch (e) {
			if (axios.isCancel(e)) return
			this.mensagem = 'Não foi possível carregar os serviços'
			this.corDaMensagem = 'error'
			this.show = true
		}
	}

	async pageNext() {
		this.page.page = !this.page.page
			? 1
			: this.page.page += 1

		await this.buscar()
	}

	get noDataMessage() {
		if (!this.busca && !this.carregando) {
			return 'Digite para consultar...'
		} else if (this.carregando) {
			return 'Carregando...'
		}
		return '$vuetify.noDataText'
	}
}
</script>

<style scoped>

</style>
