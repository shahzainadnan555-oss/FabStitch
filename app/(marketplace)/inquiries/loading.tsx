import { Container } from "@/components/ui/layout";
import { LoadingRegion, Skeleton } from "@/components/ui/state";

export default function InquiriesLoading() {
  return (
    <LoadingRegion label="Loading your inquiries…">
      <Container className="py-10 sm:py-14">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        <div className="mt-10 space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Container>
    </LoadingRegion>
  );
}
