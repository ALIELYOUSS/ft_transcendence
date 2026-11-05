


import { Feed } from "@/components/feed/feed";
import Sidebar from "@/components/leftbar";

export default function FeedPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1 pt-16">
        <Feed />
      </main>
    </div>
  );
}
// export default function FeedPage() {
//     return <Feed />
// }