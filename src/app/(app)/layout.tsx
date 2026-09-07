import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-6 pt-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
