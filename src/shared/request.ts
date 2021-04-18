import axios from 'axios'
import { stringify } from 'qs'

const request = axios.create({
	baseURL: `${process.env.VUE_APP_BACKEND_API || 'http://localhost:8080/api'}`,
	paramsSerializer: params => stringify(params, {arrayFormat: 'repeat'}),
})

export default request
