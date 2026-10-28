import { BookACallSection } from "../../features/home/components/BookACallSection";
import { Footer } from "../../features/home/components/Footer";

export default function BookACallPage() {
  return (
    <main className="relative w-full overflow-hidden">
      <div className="min-h-screen">
        <BookACallSection />
      </div>
      <Footer />
    </main>
  );
}
