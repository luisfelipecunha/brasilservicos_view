import {DataOptions} from "vuetify";
import {Pageable} from "@/models";

export const vuetifyToSpring = (vuetify: DataOptions): Pageable => ({
	page: vuetify.page - 1,
	size: vuetify.itemsPerPage,
	sort: sortConverter(vuetify) || undefined,
})

export const sortConverter = (paginacao: DataOptions): string[] =>
	paginacao.sortBy.map(
		(sort, indice) => `${sort},${paginacao.sortDesc[indice] ? 'DESC' : 'ASC'}`,
	)
