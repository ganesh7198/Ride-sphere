export const BASE_URL = "http://localhost:2000/api/v1";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    MY_PROFILE: "/auth/myprofile",
    UPDATE_PROFILE: "/auth/updateprofile",
  },

  RIDE: {
    CREATE: "/ride/create",
    GET_ALL: "/ride/all",
    GET_SINGLE: (id) => `/ride/${id}`,

    CREATED_BY_USER: "/ride/user/created",
    JOINED_BY_USER: "/ride/user/joined",

    JOIN: (rideId) => `/ride/join/${rideId}`,
    LEAVE: (rideId) => `/ride/leave/${rideId}`,

    ADD_COMMENT: (rideId) => `/ride/comment/${rideId}`,

    UPDATE: (rideId) => `/ride/update/${rideId}`,
    DELETE: (rideId) => `/ride/delete/${rideId}`,

    COMPLETE: (rideId) => `/ride/complete/${rideId}`,

    NEARBY: "/ride/nearby/search",

    INVITE: (rideId, userId) => `/ride/invite/${rideId}/${userId}`,
    ACCEPT_INVITE: (rideId) => `/ride/accept-invite/${rideId}`,
  },
};