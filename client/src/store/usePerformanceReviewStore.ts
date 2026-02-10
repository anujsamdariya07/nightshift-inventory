import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { showErrorToast, showSuccessToast } from '@/components/ToastComponent';

export enum Rating {
  I = 'I',
  II = 'II',
  III = 'III',
  IV = 'IV',
  V = 'V',
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  rating: Rating;
  comments: string;
  reviewDate: string;
}

interface ReviewResponse {
  message: string;
  performanceReview: PerformanceReview | null;
}

interface PerformanceReviewState {
  reviews: PerformanceReview[];
  reviewsReceived: PerformanceReview[];
  reviewsGiven: PerformanceReview[];
  loading: boolean;
  error: string | null;

  addReview: (reviewData: {
    employeeId: string;
    rating: Rating;
    comments: string;
  }) => Promise<{ success: boolean; message?: string; error?: string }>;

  getReviewsReceived: (
    employeeId: string,
  ) => Promise<{ success: boolean; error?: string }>;

  getReviewsGiven: (
    reviewerId: string,
  ) => Promise<{ success: boolean; error?: string }>;

  updateReview: (
    reviewId: string,
    reviewData: {
      employeeId: string;
      rating: Rating;
      comments: string;
    },
  ) => Promise<{ success: boolean; message?: string; error?: string }>;

  deleteReview: (
    reviewId: string,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;

  clearReviews: () => void;
}

const usePerformanceReviewStore = create<PerformanceReviewState>()(
  persist(
    (set) => ({
      reviews: [],
      reviewsReceived: [],
      reviewsGiven: [],
      loading: false,
      error: null,

      addReview: async (reviewData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post<ReviewResponse>(
            '/reviews',
            reviewData,
            { withCredentials: true },
          );

          if (response.data.performanceReview) {
            set((state) => ({
              reviews: [...state.reviews, response.data.performanceReview!],
              loading: false,
            }));
          }

          showSuccessToast({
            message: response.data.message || 'Review created successfully!',
          });

          return { success: true, message: response.data.message };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const errorMessage =
            err.response?.data?.message || 'Failed to create review';

          set({ loading: false, error: errorMessage });

          showErrorToast({
            message: 'Error creating review!',
            description: errorMessage,
          });

          return { success: false, error: errorMessage };
        }
      },

      getReviewsReceived: async (employeeId) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get<PerformanceReview[]>(
            `/reviews/received/${employeeId}`,
            { withCredentials: true },
          );

          set({
            reviewsReceived: response.data,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const errorMessage =
            err.response?.data?.message || 'Failed to fetch reviews received';

          set({ loading: false, error: errorMessage });

          showErrorToast({
            message: 'Error fetching reviews!',
            description: errorMessage,
          });

          return { success: false, error: errorMessage };
        }
      },

      getReviewsGiven: async (reviewerId) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get<PerformanceReview[]>(
            `/reviews/given/${reviewerId}`,
            { withCredentials: true },
          );

          set({
            reviewsGiven: response.data,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const errorMessage =
            err.response?.data?.message || 'Failed to fetch reviews given';

          set({ loading: false, error: errorMessage });

          showErrorToast({
            message: 'Error fetching reviews!',
            description: errorMessage,
          });

          return { success: false, error: errorMessage };
        }
      },

      updateReview: async (reviewId, reviewData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put<ReviewResponse>(
            `/reviews/${reviewId}`,
            reviewData,
            { withCredentials: true },
          );

          if (response.data.performanceReview) {
            set((state) => ({
              reviews: state.reviews.map((review) =>
                review.id === reviewId
                  ? response.data.performanceReview!
                  : review,
              ),
              reviewsReceived: state.reviewsReceived.map((review) =>
                review.id === reviewId
                  ? response.data.performanceReview!
                  : review,
              ),
              reviewsGiven: state.reviewsGiven.map((review) =>
                review.id === reviewId
                  ? response.data.performanceReview!
                  : review,
              ),
              loading: false,
            }));
          }

          showSuccessToast({
            message: response.data.message || 'Review updated successfully!',
          });

          return { success: true, message: response.data.message };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const errorMessage =
            err.response?.data?.message || 'Failed to update review';

          set({ loading: false, error: errorMessage });

          showErrorToast({
            message: 'Error updating review!',
            description: errorMessage,
          });

          return { success: false, error: errorMessage };
        }
      },

      deleteReview: async (reviewId) => {
        set({ loading: true, error: null });
        try {
          await axiosInstance.delete(`/reviews/${reviewId}`, {
            withCredentials: true,
          });

          set((state) => ({
            reviews: state.reviews.filter((review) => review.id !== reviewId),
            reviewsReceived: state.reviewsReceived.filter(
              (review) => review.id !== reviewId,
            ),
            reviewsGiven: state.reviewsGiven.filter(
              (review) => review.id !== reviewId,
            ),
            loading: false,
          }));

          showSuccessToast({
            message: 'Review deleted successfully!',
          });

          return { success: true, message: 'Review deleted successfully!' };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const errorMessage =
            err.response?.data?.message || 'Failed to delete review';

          set({ loading: false, error: errorMessage });

          showErrorToast({
            message: 'Error deleting review!',
            description: errorMessage,
          });

          return { success: false, error: errorMessage };
        }
      },

      clearReviews: () => {
        set({
          reviews: [],
          reviewsReceived: [],
          reviewsGiven: [],
          error: null,
        });
      },
    }),
    {
      name: 'performance-review-storage',
      partialize: (state) => ({
        reviews: state.reviews,
        reviewsReceived: state.reviewsReceived,
        reviewsGiven: state.reviewsGiven,
      }),
    },
  ),
);

export default usePerformanceReviewStore;
