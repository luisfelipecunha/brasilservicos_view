import { Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'

@Module({ name: 'aplicacao', store, dynamic: true, namespaced: true })
class AppStore extends VuexModule {
	showSideBar: boolean | null = null
	mostraSumarioDeTeclas: boolean | null = null

	@Mutation
	setShowSideBar(show: AppStore['showSideBar']) {
		this.showSideBar = show
	}
}
export default getModule(AppStore)
