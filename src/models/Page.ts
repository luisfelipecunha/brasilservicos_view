import { Pageable } from './Pageable';

export interface Page<T> {
	content: T[]
	pageable?: Pageable
	last: boolean
	totalPages: number
	totalElements: number
	size: number
	number: number
	sort: {
		sorted: boolean
		unsorted: boolean
		empty: boolean
	}
	numberOfElements: number
	first: boolean
	empty: boolean
}
