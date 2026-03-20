import { notFound } from "next/navigation";

import { getAuthStateAction } from "@/actions/user.actions";
import { MedicineDetails } from "@/components/modules/medicine/medicine-details";
import { getMedicineById, getMedicines } from "@/services/medicines.service";
import { reviewsService } from "@/services/reviews.service";
import type { Medicine } from "@/types/medicine";
import type { MedicineReviewsData } from "@/types/review";

type MedicineDetailsPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function MedicineDetailsPage({
  params,
}: MedicineDetailsPageProps) {
  const { id } = await params;
  const emptyReviewsData: MedicineReviewsData = {
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
  };

  try {
    const medicine = await getMedicineById(id);

    if (!medicine.id) {
      notFound();
    }

    let relatedMedicines: Medicine[] = [];
    let reviewsData = emptyReviewsData;

    try {
      const [relatedResult, reviewResult] = await Promise.all([
        getMedicines({
          page: 1,
          limit: 8,
          category: medicine.category?.id,
          sort: "newest",
        }),
        reviewsService.getMedicineReviews(medicine.id),
      ]);

      relatedMedicines = relatedResult.medicines
        .filter((relatedMedicine) => relatedMedicine.id !== medicine.id)
        .slice(0, 4);

      reviewsData = reviewResult;
    } catch {
      relatedMedicines = [];
      reviewsData = emptyReviewsData;
    }

    const authState = await getAuthStateAction();

    return (
      <MedicineDetails
        medicine={medicine}
        relatedMedicines={relatedMedicines}
        reviewsData={reviewsData}
        currentUser={authState.user ? { id: authState.user.id } : null}
        currentUserRole={authState.role}
      />
    );
  } catch {
    notFound();
  }
}
