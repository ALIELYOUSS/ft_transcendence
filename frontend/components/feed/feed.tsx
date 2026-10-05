import { FeedHeader } from '@/components/feed/header';
import { DiscoverPeople } from "./discover_people";
import { CreatePost } from "./create_post";
export function Feed()
{
    return(
        <div  className="min-h-screen bg-gray-50 flex flex-col">
            <FeedHeader />
        <main className="max-w-2xl mx-auto w-full p-4 flex flex-col gap-4">
            <DiscoverPeople />
            <CreatePost />
        </main>
            
        </div>
    );
}