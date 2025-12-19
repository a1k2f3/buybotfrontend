import { Suspense } from "react";
import SearchResultsClient from "../../components/Search/Searchpage";

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}