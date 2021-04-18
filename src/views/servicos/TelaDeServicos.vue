<template>
	<div>
		<v-card
			class="mt-2"
		>
			<v-card-text>
				<v-data-table
					:headers="headers"
					:items="itens"
					:options.sync="options"
					:server-items-length="pagina.totalElements"
					:footer-props="{ itemsPerPageOptions: [ 5, 10, 15, 30, 50 ] }"
					:loading="carregando"
				>
					<template #[`body.append`]=" { headers }">
						<tr>
							<td :colspan="headers.length" class="pa-0">
								<v-btn
									text
									color="success"
									block
									@click="novoServico"
								>
									<v-icon left> mdi-plus </v-icon>
									Adicionar
								</v-btn>
							</td>
						</tr>
					</template>
				</v-data-table>
			</v-card-text>
		</v-card>
		<v-snackbar
			fixed
			v-model="show"
			top
			:color="corDaMensagem"
			content-class="d-flex align-center"
			style="z-index: 350;"
			:timeout="tempoDaMensagem"
		>
			<div
				v-html="mensagem"
			/>
			<div class="ml-auto pl-2 text-center d-flex flex-column">
				<v-btn
					text
					icon
					@click.stop="() => show = false"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</div>
		</v-snackbar>
		<v-dialog
			v-model="mostraDialogo"
			width="600"
		>
			<v-form
				ref="form"
				lazy-validation
			>
				<v-card>
					<v-card-title>
						<span class="headline">Novo Serviço</span>
					</v-card-title>
					<v-card-text>
						<v-row>
							<v-col
								cols="8"
								md="6"
							>
								<v-text-field
									v-model="servico.nome"
									required
									label="Nome"
									:rules="[obrigatorio]"
								>
								</v-text-field>
							</v-col>
							<v-col
								cols="4"
								md="6"
							>
								<v-text-field
									v-model.number="servico.valorHora"
									required
									label="valor/hora"
									type="number"
									step="0.01"
									:rules="[obrigatorio]"
								>
								</v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-btn type="button" text @click="fechaDialogo">Cancelar</v-btn>
						<v-btn class="ml-auto" color="success" text @click="salvarServico">Salvar</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>
	</div>
</template>

<script lang="ts">
import {Vue, Component, Ref, Watch} from "vue-property-decorator";
import {DataOptions} from "vuetify";
import { obterPaginaVazia } from "@/shared/util-paginacao";
import {Page, Servico} from "@/models";
import axios, { CancelTokenSource } from 'axios'
import request from "@/shared/request";
import {obrigatorio} from "@/shared/form-rules";
import {formatarMoeda} from "@/shared/format-utils";
import {vuetifyToSpring} from "@/shared/pageable-converter";

@Component
export default class TelaDeServicos extends Vue {
	@Ref() form!: HTMLFormElement
	servico: Servico = {
		nome: '',
		valorHora: 0.00,
	}
	obrigatorio = obrigatorio
	carregando = false
	salvando = false
	mostraDialogo = false
	show = false
	mensagem = 'Teste'
	tempoDaMensagem = 5000
	corDaMensagem = 'info'

	options: DataOptions | null = null
	pagina: Page<Servico> = obterPaginaVazia()

	headers = [
		{ text: 'Nome', value: 'nome' },
		{ text: 'Valor/Hora', value: 'valorHora' },
	]

	cancelToken: CancelTokenSource | null = null

	async created() {
		await this.buscar()
	}

	async buscar() {
		try {
			this.carregando = true
			if (this.cancelToken) this.cancelToken.cancel()
			this.cancelToken = axios.CancelToken.source()
			const page = this.options
				? { ...vuetifyToSpring(this.options) }
				: undefined
			this.pagina = (await request.get<Page<Servico>>('/servicos', {
				params: {...page},
			})).data
			this.carregando = false
		} catch (e) {
			if (axios.isCancel(e)) return
			this.mensagem = 'Não foi possível carregar os serviços'
			this.corDaMensagem = 'error'
			this.show = true
		} finally {
			this.carregando = false
		}
	}

	fechaDialogo() {
		this.form.reset()
		this.mostraDialogo = false
	}

	novoServico() {
		this.mostraDialogo = true
	}

	async salvarServico() {
		if (!this.form.validate()) return
		try {
			this.salvando = true
			await request.post<Servico>('/servicos', this.servico)
			await this.buscar()
			this.salvando = false
			this.fechaDialogo()
		} catch (e) {
			this.mensagem = 'Não foi possível salvar o serviço'
			this.corDaMensagem = 'error'
			this.show = true
		}
	}

	@Watch('options', { deep: true })
	onChangeOptions() {
		this.buscar()
	}

	get itens() {
		if (!this.pagina.content) return []
		return this.pagina.content
			.map(item => ({
				...item,
				valorHora: formatarMoeda(item.valorHora),
			}))
	}
}
</script>
