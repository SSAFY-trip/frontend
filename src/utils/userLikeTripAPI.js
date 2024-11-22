import axiosInstance from './axios'

// 1. 사용자 좋아하는 여행 정보 가져오기
export const getUserTrips = async () => {
  try {
    const response = await axiosInstance.get('/user/trips')
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

// 2. 특정 여행 추가
export const addUserTrip = async (tripId) => {
  try {
    const response = await axiosInstance.post(`/user/trips/${tripId}`)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

// 3. 특정 여행 삭제
export const deleteUserTrip = async (tripId) => {
  try {
    const response = await axiosInstance.delete(`/user/trips/${tripId}`)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
