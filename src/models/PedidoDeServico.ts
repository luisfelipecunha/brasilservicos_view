import {Servico} from "@/models/servico/Servico";

export type PedidoDeServico = {
	id?: string
	servicos: ServidoDoPedido[]
	nomeDoProfissional: string
	imposto: number
	status: StatusDoPedidoDeServico
}

export type ServidoDoPedido = {
	id?: string
	servico: Servico
	horas: string
	minutos: string
}

export type InfosDoPedidos = {
	valorTotalDoPedido: number
	percentualDeLucro: number
}

export type StatusDoPedidoDeServico = 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO'
