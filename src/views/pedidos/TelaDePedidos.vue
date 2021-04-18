<template>
	<div>
		<v-card
			class="mt-2"
		>
			<v-card-text>
				<v-data-table
					:headers="headers"
					:items="pagina.content"
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
									@click="mostra"
								>
									<v-icon left> mdi-plus </v-icon>
									Novo Pedido
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
			persistent
		>
			<v-form
				ref="form"
				lazy-validation
			>
				<v-card>
					<v-card-title>
						<span class="headline">Novo Pedido</span>
					</v-card-title>
					<v-card-text>
						<v-row>
							<v-data-table
								:headers="headersDialogo"
								:items="novoPedido.servicos"
								:footer-props="{ itemsPerPageOptions: [ 3, 5 ] }"
							>
								<template v-slot:item.horas="{ item }">
									<v-chip
									>
										{{ item.horas }}h{{item.minutos}}
									</v-chip>
								</template>
								<template #[`body.append`]=" { headers }">
									<tr>
										<td :colspan="headers.length" class="pa-0">
											<v-btn
												text
												color="success"
												block
												@click="mostraDialogoAddServico"
											>
												<v-icon left> mdi-plus </v-icon>
												Adicionar Serviço
											</v-btn>
										</td>
									</tr>
								</template>
							</v-data-table>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-text-field
									v-model="novoPedido.nomeDoProfissional"
									:rules="[obrigatorio]"
									label="Profissional"
								/>
							</v-col>
							<v-col cols="6">
								<v-text-field
									v-model="novoPedido.imposto"
									:rules="[obrigatorio]"
									label="Imposto %"
									type="number"
									step="0.01"
								/>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-btn type="button" text @click="fechaDialogo">Cancelar</v-btn>
						<v-btn class="ml-auto" color="success" text @click="salvarPedido">Salvar</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>
		<v-dialog
			v-model="mostraDialogoDeServico"
			width="600"
		>
			<v-form
				ref="formDeServicos"
				lazy-validation
			>
				<v-card>
					<v-card-text>
						<v-row>
							<v-col cols="6">
								<SeletorDeServicos
									label="Serviço"
									v-model="servico"
									clearable
									return-object
								/>
							</v-col>
							<v-col cols="3">
								<v-text-field
									v-model="duracao.horas"
									label="Horas"
									:rules="[obrigatorio]"
									single-line
								>
								</v-text-field>
							</v-col>
							<v-col cols="3">
								<v-text-field
									v-model="duracao.minutos"
									label="Minutos"
									:rules="[obrigatorio]"
									single-line
								>
								</v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-btn type="button" text @click="fechaDialogoServico">Cancelar</v-btn>
						<v-btn class="ml-auto" color="success" text @click="addServico">Adicionar</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>
		<v-dialog
			v-model="mostraDialogoInfos"
			width="600"
			v-if="mostraDialogoInfos"
		>
			<v-card>
				<v-card-title>
					<span class="headline">Informações do Pedido</span>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="6">
							<v-text-field
								readonly
								:value="formatarMoeda(infosDoPedido.valorTotalDoPedido)"
								label="Valor total do Pedido"
								outlined
							/>
						</v-col>
						<v-col cols="6">
							<v-text-field
								readonly
								:value="infosDoPedido.percentualDeLucro"
								label="Percentual de Lucro %"
								outlined
							/>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script lang="ts">
import {Vue, Component, Watch, Ref} from "vue-property-decorator";
import SeletorDeServicos from '@/components/servicos/SeletorDeServicos.vue'
import {InfosDoPedidos, PedidoDeServico} from "@/models/PedidoDeServico";
import {DataOptions} from "vuetify";
import {Page, Servico} from "@/models";
import {obterPaginaVazia} from "@/shared/util-paginacao";
import axios, {CancelTokenSource} from "axios";
import {vuetifyToSpring} from "@/shared/pageable-converter";
import request from "@/shared/request";
import {obrigatorio} from "@/shared/form-rules";
import {formatarMoeda} from "@/shared/format-utils";
@Component({
	components: {
		SeletorDeServicos,
	},
})
export default class TelaDePedidos extends Vue {
	@Ref() form!: HTMLFormElement
	@Ref() formDeServicos!: HTMLFormElement
	obrigatorio = obrigatorio
	formatarMoeda = formatarMoeda
	novoPedido: PedidoDeServico = {
		imposto: 0,
		nomeDoProfissional: '',
		servicos: [],
		status: 'ABERTO',
	}

	servico: Servico | null = null
	duracao = {
		horas: 0,
		minutos: 0,
	}

	carregando = false
	salvando = false

	mostraDialogo = false
	mostraDialogoDeServico = false
	mostraDialogoInfos = false

	show = false
	mensagem = 'Teste'
	tempoDaMensagem = 5000
	corDaMensagem = 'info'

	options: DataOptions | null = null
	pagina: Page<PedidoDeServico> = obterPaginaVazia()

	headers = [
		{ text: 'Profissional', value: 'nomeDoProfissional' },
		{ text: 'Imposto %', value: 'imposto' },
		{ text: 'Situação', value: 'status' },
	]

	headersDialogo = [
		{ text: 'Serviço', value: 'servico.nome' },
		{ text: 'Duração', value: 'horas' },
	]

	cancelToken: CancelTokenSource | null = null

	infosDoPedido: null | InfosDoPedidos = null

	async buscar() {
		try {
			this.carregando = true
			if (this.cancelToken) this.cancelToken.cancel()
			this.cancelToken = axios.CancelToken.source()
			const page = this.options
				? { ...vuetifyToSpring(this.options) }
				: undefined
			this.pagina = (await request.get<Page<PedidoDeServico>>('/pedidos', {
				params: {...page},
			})).data
			this.carregando = false
		} catch (e) {
			if (axios.isCancel(e)) return
			this.mensagem = 'Não foi possível carregar os pedidos'
			this.corDaMensagem = 'error'
			this.show = true
		} finally {
			this.carregando = false
		}
	}

	@Watch('options', { deep: true })
	onChangeOptions() {
		this.buscar()
	}

	async mostra() {
		this.mostraDialogo = true
		try {
			this.novoPedido = (await request.post('/pedidos')).data
		} catch (e) {
			this.mensagem = 'Não foi possível criar o pedido'
			this.corDaMensagem = 'error'
			this.show = true
		}
	}

	async fechaDialogo() {
		try {
			await request.delete(`/pedidos/${this.novoPedido.id}`)
		} catch (e) {
			this.mensagem = 'Não foi possível criar o pedido'
			this.corDaMensagem = 'error'
			this.show = true
		}
		this.form.reset()
		this.mostraDialogo = false
	}

	mostraDialogoAddServico() {
		this.mostraDialogoDeServico = true
	}

	fechaDialogoServico() {
		this.formDeServicos.reset()
		this.mostraDialogoDeServico = false
	}

	async addServico() {
		if (!this.novoPedido.id) return
		try {
			const servidoAdicionado = (await request.post(`/pedidos/${this.novoPedido.id}/servicos`, {
				pedido: this.novoPedido.id,
				servico: this.servico?.id,
				...this.duracao,
			})).data
			this.novoPedido.servicos
				? this.novoPedido.servicos = [...this.novoPedido.servicos, servidoAdicionado]
				: this.novoPedido.servicos = [servidoAdicionado]

			this.fechaDialogoServico()
		} catch (e) {
			this.mensagem = 'Não foi possível adicionar o serviço'
			this.corDaMensagem = 'error'
			this.show = true
		}
	}

	async salvarPedido() {
		if (!this.novoPedido.id) return
		try {
			this.salvando = true
			await request.put(`/pedidos/${this.novoPedido.id}`, this.novoPedido)
			this.infosDoPedido = (await request.get(`/pedidos/${this.novoPedido.id}/infos`)).data
			await this.buscar()
			this.mostraDialogo = false
			this.mostraDialogoInfos = true
		} catch (e) {
			this.mensagem = 'Não foi possível salvar o pedido'
			this.corDaMensagem = 'error'
			this.show = true
		}
	}
}
</script>
