import { VisitorAccessForm } from "@/components/visitor-access-form";

type HomePageProps = {
  searchParams?: Promise<{
    code?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;
  const initialCode = Array.isArray(params?.code) ? params.code[0] : params?.code;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,240,232,0.9),_transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(245,240,232,0.35))]" />
      <div className="relative animate-page-enter">
        <VisitorAccessForm initialCode={initialCode} />
      </div>
    </main>
  );
}
