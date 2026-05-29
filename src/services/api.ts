/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_URL || 'https://skillvibe-b-production.up.railway.app';

// If the env variable was configured without https:// (e.g. skillvibe-b...), Axios takes it as relative.
// Automatically add https:// if it doesn't start with http or /
if (rawBaseURL && !rawBaseURL.startsWith('http') && !rawBaseURL.startsWith('/')) {
  rawBaseURL = 'https://' + rawBaseURL;
}

// Remove trailing slash to avoid double slash errors (//api)
const cleanBaseURL = rawBaseURL.replace(/\/+$/, '');

// Base URL from env variable (for Vercel) or fallback to production backend
const api = axios.create({
  baseURL: cleanBaseURL.endsWith('/api') ? cleanBaseURL : `${cleanBaseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillvibes_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server returns 401, clear session and redirect to login
api.interceptors.response.use(
  (response) => {
    // Automatically unwrap the backend ApiResponse
    if (response.data && typeof response.data.success === 'boolean') {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('skillvibes_token');
      localStorage.removeItem('skillvibes_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  fullName: string;
  email: string;
  role: string;
  balance: number;
}

export interface AuthResponseDTO {
  token: string;
  user: UserResponseDTO;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string; // "STUDENT" | "TUTOR"
}

export interface TutorRegistrationRequest {
  fullName: string;
  email: string;
  password: string;
  bio: string;
  profilePictureUrl: string;
  identityCardUrl: string;
  degreeUrl: string;
  hourlyRate: number;
  yearsOfExperience: number;
  subjects: string[];
}

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponseDTO>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<UserResponseDTO>('/auth/register', data),

  registerTutor: (data: TutorRegistrationRequest) =>
    api.post<UserResponseDTO>('/auth/register/tutor', data),

  getUser: (id: number) =>
    api.get<UserResponseDTO>(`/auth/${id}`),
};

// ── Classes ─────────────────────────────────────────────────────────────────

export interface TutoringClass {
  id: number;
  subject: string;
  description: string;
  price: number;
  scheduledAt: string; // ISO string from backend
  meetingLink: string;
  status: string; // "PROGRAMMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  tutor: UserResponseDTO;
  student: UserResponseDTO;
}

export interface CreateClassRequest {
  subject: string;
  description: string;
  price: number;
  scheduledAt: string;
  meetingLink: string;
  tutor: { id: number };
  student: { id: number };
}

export interface BookingRequest {
  tutorId: number;
  subject: string;
  description: string;
  scheduledAt: string;
}

export const classesApi = {
  getMyBoard: (userId: number) =>
    api.get<TutoringClass[]>(`/tutoringClasses/mi-tablero/${userId}`),

  create: (data: CreateClassRequest) =>
    api.post<TutoringClass>('/tutoringClasses/programar', data),

  book: (data: BookingRequest) =>
    api.post<TutoringClass>('/tutoringClasses/reservar', data),

  finalize: (id: number) =>
    api.put<TutoringClass>(`/tutoringClasses/${id}/finalizar`),
};

// ── Tutors ───────────────────────────────────────────────────────────────────

export interface TutorProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  bio: string;
  profilePictureUrl: string;
  hourlyRate: number;
  yearsOfExperience: number;
  subjects: string[];
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  credentialsUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TutorSearchParams {
  query?: string;
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  minExperience?: number;
  onlyVerified?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export const tutorApi = {
  search: (params: TutorSearchParams) =>
    api.get<PageResponse<TutorProfile>>('/tutor/search', { params }),

  getMyProfile: () =>
    api.get<TutorProfile>('/tutor/profile'),

  updateProfile: (data: Partial<TutorProfile>) =>
    api.put<TutorProfile>('/tutor/profile', data),
};

export const paymentApi = {
  createCheckout: (amount: number) =>
    api.post<string>('/payments/simulate', { amount }),

  getHistory: () =>
    api.get<any[]>('/payments/historial'),
};

// ── Reviews ──────────────────────────────────────────────────────────────────

export interface CreateReviewDTO {
  tutoringClassId: number;
  rating: number;
  comment: string;
}

export interface ReviewResponseDTO {
  id: number;
  tutoringClassId: number;
  tutorId: number;
  studentId: number;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviewApi = {
  create: (data: CreateReviewDTO) =>
    api.post<ReviewResponseDTO>('/reviews', data),

  getTutorReviews: (tutorId: number) =>
    api.get<ReviewResponseDTO[]>(`/reviews/tutor/${tutorId}`),
};

// ── Notifications ────────────────────────────────────────────────────────────

export interface NotificationDTO {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getUnread: () =>
    api.get<NotificationDTO[]>('/notifications/unread'),

  getHistory: (page: number = 0, size: number = 20) =>
    api.get<PageResponse<NotificationDTO>>('/notifications/history', { params: { page, size } }),

  markAsRead: (id: number) =>
    api.put<void>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.put<void>('/notifications/read-all'),
};

// ── Admin ────────────────────────────────────────────────────────────────────

export interface AdminVerifyDTO {
  verified: boolean;
  reason?: string;
}

export const adminApi = {
  getPendingTutors: () =>
    api.get<TutorProfile[]>('/admin/tutors/pending'),

  getVerifiedTutors: () =>
    api.get<TutorProfile[]>('/admin/tutors/verified'),

  verifyTutor: (id: number, data: AdminVerifyDTO) =>
    api.put<void>(`/admin/tutors/${id}/verify`, data),

  getSystemStats: () =>
    api.get<any>('/admin/stats'),
};

// ── Community Posts ──────────────────────────────────────────────────────────

export interface PostComment {
  id: number;
  authorId: number;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: number;
  authorId: number;
  authorName: string;
  authorRole: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  likedByMe: boolean;
  featured: boolean;
  comments: PostComment[];
  createdAt: string;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}

export interface CreateCommentRequest {
  content: string;
}

export const postsApi = {
  getFeed: (page: number = 0, size: number = 10) =>
    api.get<PageResponse<CommunityPost>>('/posts', { params: { page, size } }),

  getFeatured: () =>
    api.get<CommunityPost[]>('/posts/featured'),

  create: (data: CreatePostRequest) =>
    api.post<CommunityPost>('/posts', data),

  delete: (postId: number) =>
    api.delete<void>(`/posts/${postId}`),

  addComment: (postId: number, data: CreateCommentRequest) =>
    api.post<PostComment>(`/posts/${postId}/comments`, data),

  like: (postId: number) =>
    api.put<CommunityPost>(`/posts/${postId}/like`),

  toggleFeatured: (postId: number) =>
    api.put<CommunityPost>(`/posts/${postId}/featured`),
};

export default api;

