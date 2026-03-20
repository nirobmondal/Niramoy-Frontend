export type ReviewUser = {
  id: string;
  name: string;
  image?: string | null;
};

export type MedicineReview = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt?: string;
  userId?: string;
  user?: ReviewUser | null;
};

export type MedicineReviewsData = {
  reviews: MedicineReview[];
  averageRating: number;
  totalReviews: number;
};
