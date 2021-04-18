
export const obrigatorio = (valor: any) => {
	if (typeof valor === 'boolean') { return true }
	return !!valor || 'Obrigatório'
}
