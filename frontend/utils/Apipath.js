export const BASE_URL = "http://localhost:2000/api/v1";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    MY_PROFILE:  `/auth/myprofile`,
    USER_PROFILE:(userId)=>`/auth/user/profile/${userId}`,
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

  POST: {
    CREATE: "/post/create",
    GET_ALL: "/post/allpost",
    GET_ALL_BY_USER: "/post/allpostbyuser",
    GET_SINGLE: (postId) => `/post/getsinglepost/${postId}`,
    DELETE: (postId) => `/post/delete/${postId}`,
    UPDATE: (postId) => `/post/updatepost/${postId}`,
    ADD_COMMENT: (postId) => `/post/comment/${postId}`,
    DELETE_COMMENT: (postId, commentId) => `/post/deletecomment/${postId}/${commentId}`,
    LIKE: (postId) => `/post/likepost/${postId}`,
    FOLLOW_UNFOLLOW: "/post/follow/unfollow",
  },

  NOTIFICATION: {
    GET_ALL: "/notification/all",
    DELETE: (notificationId) => `/notification/delete/${notificationId}`,
  },

  DISCUSSION: {
    CREATE: "/discussion/create",
    GET_ALL: "/discussion/all",
    DELETE: (discussionId) => `/discussion/${discussionId}`,
    ADD_COMMENT: (discussionId) => `/discussion/${discussionId}/comment`,
    DELETE_COMMENT: (discussionId, commentId) => `/discussion/${discussionId}/comment/${commentId}`,
    UPVOTE: (discussionId) => `/discussion/${discussionId}/upvote`,
    DOWNVOTE: (discussionId) => `/discussion/${discussionId}/downvote`,
    USER_DISCUSSIONS: "/discussion/user/discussion",
  },
};