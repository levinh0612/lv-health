import BottomNav from "@/components/BottomNav";
import { getReminders } from "@/lib/reminders";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const reminders = await getReminders();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-6 pt-8">
        {children}
      </main>
      <BottomNav reminders={reminders} />
    </div>
  );
}
