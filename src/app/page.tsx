import { HomeCategories } from "@/components/modules/homepage/home-categories";
import { HomeFeaturedMedicines } from "@/components/modules/homepage/home-featured-medicines";
import { HomeHero } from "@/components/modules/homepage/home-hero";
import { HomeReviews } from "@/components/modules/homepage/home-reviews";
import { HomeWhyChoose } from "@/components/modules/homepage/home-why-choose";
import { getCategories, getMedicines } from "@/services/medicines.service";

export default async function Home() {
  const [categoriesResult, featuredResult] = await Promise.allSettled([
    getCategories(),
    getMedicines({ page: 1, limit: 6, sort: "newest" }),
  ]);

  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  const medicines =
    featuredResult.status === "fulfilled" ? featuredResult.value.medicines : [];

  return (
    <main className="bg-background py-8 md:py-10">
      <div className="container space-y-12 md:space-y-14 px-8 md:px-5 lg:px-5 md:max-w-4xl lg:max-w-6xl mx-auto">
        <HomeHero />
        <HomeCategories categories={categories} />
        <HomeFeaturedMedicines medicines={medicines} />
        <HomeWhyChoose />
        <HomeReviews />
      </div>
    </main>
  );
}
