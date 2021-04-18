import { Page, Pageable } from "@/models"

export function obterPaginavelVazio(): Pageable {
	return {
		page: 0,
	}
}

export function obterPaginaVazia(): Page<any> {
	return {
		content: [],
		last: true,
		first: true,
		totalPages: 0,
		totalElements: 0,
		size: 0,
		number: 0,
		numberOfElements: 0,
		empty: true,
		sort: {
			empty: true,
			sorted: false,
			unsorted: true,
		},
	}
}
