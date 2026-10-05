export function CreatePost()
{
    return(
        <div>
            <h2>Create a Post</h2>

            <textarea placeholder="Share a photo, text, or propose a meetup..." />

            <div>
                <button>Photo</button>
                <button>Meet Slot</button>
                <button>Post</button>
            </div>
        </div>
    );
}