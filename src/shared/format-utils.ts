export function formatarMoeda(valor: number) {
	return valor.toLocaleString('pt-BR', {
		currency: 'BRL',
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	})
}
