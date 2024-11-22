import router from '@/router'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 API 기본 주소
  withCredentials: true, // 쿠키 전송 활성화
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken') // 로컬 스토리지에서 토큰 가져오기
    if (accessToken) {
      config.headers['access'] = `${accessToken}` // Authorization 헤더 추가
    }
    return config
  },
  (error) => Promise.reject(error),
)
// Axios Interceptor 설정
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
    // Access Token 만료 시
    if (error.response?.status === 401 && error.response?.data === 'access token expired') {
      try {
        // Refresh Token을 사용해 Access Token 갱신
        const { data } = await axiosInstance.post('/reissue', {}, { withCredentials: true })

        // 새로운 Access Token 저장
        localStorage.setItem('accessToken', data.accessToken)

        // 원래 요청 재시도
        error.config.headers['Authorization'] = `Bearer ${data.accessToken}`
        return axiosInstance.request(error.config)
      } catch (reissueError) {
        // 갱신 실패 시 로그인 페이지로 리다이렉트
        alert('세션이 만료되었습니다. 다시 로그인해주세요.')
        localStorage.removeItem('accessToken') // 만료된 토큰 삭제
        router.push('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
