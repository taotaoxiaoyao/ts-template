import axios from 'axios'
import { Message } from 'element-ui'
const request = axios.create({})

// 请求拦截器
request.interceptors.request.use(
  config => {
    console.log('config: ', config)
    if (config?.method?.toLowerCase() == 'get') {
      config.params = config?.data
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    console.log('response: ', response)
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default request
