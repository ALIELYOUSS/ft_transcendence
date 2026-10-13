
import { FeedHeader } from "./header";
import { DiscoverPeople } from "./discover_people";
import { CreatePost } from "./create_post";
import { PostCard } from './post_card';
import { MeetSlotCard } from './MeetSlotCard';

export function Feed() {
    return (
        <div>
            
            <main className="max-w-2xl mx-auto w-full p-4 flex flex-col gap-4">
                <FeedHeader />
                <DiscoverPeople />
                <CreatePost />
                <PostCard />
                <MeetSlotCard/>
            </main>
        </div>
    );
}
