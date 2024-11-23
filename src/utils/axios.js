import router from '@/router'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 API 기본 주소
  withCredentials: true, // 쿠키 전송 활성화
})

/**
 * 백엔드로 요청을 보내기 직전에 실행되는 함수
 * 요청(config)의 headers에 access라는 이름으로 토큰을 추가합니다.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['access'] = `${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/**
 * 백엔드로부터 응답을 받은 후 실행되는 함수입니다.
 * 성공적인 응답:
 * 응답 헤더에 새로 발급된 Access Token이 있으면 localStorage에 저장합니다.
 * 응답 데이터를 그대로 반환합니다.
 *
 * 에러 발생 시:
 * 응답 상태 코드가 401이고 메시지가 'access token expired'인 경우:
 * Refresh Token을 사용해 새로운 Access Token을 요청합니다.
 * 새로 발급된 Access Token을 요청 헤더에 추가하고, 원래 요청(originalRequest)을 재시도합니다.
 * /reissue 요청에서 에러가 발생하면, 로그인 페이지로 이동시킵니다.
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Access Token 갱신 시 응답 헤더에서 저장
    const accessToken = response.headers['access']
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    // Refresh Token을 사용해 Access Token 갱신
    if (error.response?.status === 401 && error.response?.data === 'access token expired') {
      // 무한 루프 방지: /reissue 요청은 재시도하지 않음
      if (originalRequest.url === '/reissue') {
        router.push('/login')
        return Promise.reject(error)
      }

      try {
        const response = await axiosInstance.post('/reissue', {}, { withCredentials: true })

        const newAccessToken = response.headers['access']
        if (!newAccessToken) {
          throw new Error('New Access Token not found in response headers')
        }
        // 새로운 Access Token 저장
        localStorage.setItem('accessToken', newAccessToken)
        // 원래 요청 재시도
        originalRequest.headers['access'] = `${newAccessToken}`
        return axiosInstance.request(originalRequest)
      } catch {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.')
        localStorage.removeItem('accessToken')
        router.push('/login')
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
