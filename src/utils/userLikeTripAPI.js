import axiosInstance from '@/utils/axios'

// 여행 좋아요 추가/삭제
export const updateLikeTrip = async (tripId) => {
  return await axiosInstance.post(`/user-like-trip/${tripId}`)
}

// 사용자가 좋아요한 여행 목록 조회
export const getLikedTrips = async () => {
  return await axiosInstance.get('/user-like-trip/user')
}

// 특정 여행을 좋아요한 사용자 목록 조회
export const getUsersWhoLikedTrip = async (tripId) => {
  return await axiosInstance.get(`/user-like-trip/trip/${tripId}`)
}
