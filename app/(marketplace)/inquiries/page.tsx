import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/marketplace/page-header";
import { Container } from "@/components/ui/layout";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Alert, EmptyState } from "@/components/ui/state";
import { inquiryDate, inquiryStatus } from "@/features/inquiries/presentation";
import { requireCustomer } from "@/features/auth/server-session";
import { listCustomerInquiries } from "@/repositories/customer-commerce";

export const metadata: Metadata = {
  title: "My Inquiries",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function pageNumber(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const query = await searchParams;
  const page = pageNumber(query.page);
  await requireCustomer(page > 1 ? `/inquiries/?page=${page}` : "/inquiries/");

  const result = await listCustomerInquiries({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Account", href: "/account/" },
          { label: "Inquiries" },
        ]}
        title="My Inquiries"
        intro="View and manage the fabric inquiries you have submitted to FabStitch."
      />
      <Container className="py-8 sm:py-10">
        {!result.ok ? (
          <div>
            <Alert tone="alert" title="We couldn't load your inquiries">
              <p>Please try again.</p>
            </Alert>
            <ButtonLink
              href={page > 1 ? `/inquiries/?page=${page}` : "/inquiries/"}
              variant="secondary"
              className="mt-5"
            >
              Try again
            </ButtonLink>
          </div>
        ) : result.data.items.length === 0 ? (
          <EmptyState
            eyebrow="Inquiries"
            title="No inquiries yet"
            description="When you submit a fabric inquiry, it will appear here."
            action={
              <ButtonLink href="/marketplace/" variant="primary">
                Explore Fabrics
              </ButtonLink>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <thead>
                  <tr className="border-y border-rule">
                    {[
                      "Inquiry",
                      "Fabric",
                      "Quantity",
                      "Status",
                      "Submitted",
                      "Action",
                    ].map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="py-3 font-mono text-label tracking-[0.09em] text-ink-4 uppercase"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.data.items.map((inquiry) => {
                    const status = inquiryStatus(inquiry.status);
                    return (
                      <tr key={inquiry.id} className="border-b border-rule">
                        <td className="py-4 font-mono text-sm text-ink">
                          {inquiry.inquiry_number}
                        </td>
                        <td className="py-4 text-sm font-semibold text-ink">
                          {inquiry.fabric.name}
                        </td>
                        <td className="py-4 text-sm text-ink-2">
                          {inquiry.quantity} {inquiry.quantity_unit}
                        </td>
                        <td className="py-4">
                          <Badge tone={status.tone}>{status.label}</Badge>
                        </td>
                        <td className="py-4 text-sm text-ink-3">
                          {inquiryDate(inquiry.created_at)}
                        </td>
                        <td className="py-4">
                          <Link
                            href={`/inquiries/${inquiry.id}/`}
                            className="text-sm font-semibold text-indigo hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <InquiryPager
              page={page}
              offset={result.data.offset}
              count={result.data.items.length}
              total={result.data.total}
            />
          </>
        )}
      </Container>
    </>
  );
}

function InquiryPager({
  page,
  offset,
  count,
  total,
}: {
  page: number;
  offset: number;
  count: number;
  total: number;
}) {
  const hasPrevious = page > 1;
  const hasNext = offset + count < total;
  if (!hasPrevious && !hasNext) return null;

  return (
    <nav
      aria-label="Inquiry pages"
      className="mt-8 flex items-center justify-between gap-4"
    >
      {hasPrevious ? (
        <Link
          href={page === 2 ? "/inquiries/" : `/inquiries/?page=${page - 1}`}
          className="inline-flex h-10 items-center text-sm text-ink-2 hover:text-ink"
        >
          ‹ Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="font-mono text-label text-ink-4 uppercase">
        Page {page}
      </span>
      {hasNext ? (
        <Link
          href={`/inquiries/?page=${page + 1}`}
          className="inline-flex h-10 items-center text-sm text-ink hover:text-indigo"
        >
          Next ›
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
