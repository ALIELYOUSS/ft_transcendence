
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Calendar, Play, User, X } from "lucide-react";

interface CreatePostProps {
  onCreatePost: (post: {
    caption: string;
    image: File | null;
  }) => void | Promise<void>;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  onCreatePost,
}) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [image]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    setImage(selectedFile);
  };

  const handleRemoveImage = () => {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!caption.trim() && !image) {
      alert("Please write something or select an image.");
      return;
    }

    try {
      setIsSubmitting(true);

      await onCreatePost({
        caption: caption.trim(),
        image,
      });

      setCaption("");
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Could not create your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#6B3F00] flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-white stroke-[2.5]" />
        </div>

        <textarea
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="Share a photo, text, or propose a meetup..."
          rows={2}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 text-xs sm:text-sm font-medium bg-[#F8F7F4] border border-stone-200/50 text-[#54483B] placeholder-[#A09383] rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition resize-none"
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {preview && (
        <div className="relative w-full">
          <img
            src={preview}
            alt="Selected post image"
            className="w-full max-h-80 object-cover rounded-xl"
          />

          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isSubmitting}
            aria-label="Remove image"
            className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <hr className="border-gray-100" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePhotoClick}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-[#F5F3EE] hover:bg-stone-200/60 transition"
          >
            <Camera className="w-3.5 h-3.5 text-stone-600" />
            <span>Photo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              alert("Meet Slot page will be connected later.");
            }}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-[#F5F3EE] hover:bg-stone-200/60 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>Meet Slot</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 transition shadow-xs"
        >
          <span>{isSubmitting ? "Posting..." : "Post"}</span>
          <Play className="w-3 h-3 fill-current" />
        </button>
      </div>
    </div>
  );
};
// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Camera, Calendar, Play, User, X } from "lucide-react";

// interface CreatePostProps {
//   onCreatePost: (post: {
//     caption: string;
//     image: File | null;
//   }) => void;
// }

// export const CreatePost: React.FC<CreatePostProps> = ({
//   onCreatePost,
// }) => {
//   const [caption, setCaption] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (!image) {
//       setPreview(null);
//       return;
//     }

//     const imageUrl = URL.createObjectURL(image);
//     setPreview(imageUrl);

//     return () => {
//       URL.revokeObjectURL(imageUrl);
//     };
//   }, [image]);

//   const handlePhotoClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const selectedFile = event.target.files?.[0];

//     if (!selectedFile) return;

//     if (!selectedFile.type.startsWith("image/")) {
//       alert("Please select an image file.");
//       event.target.value = "";
//       return;
//     }

//     if (selectedFile.size > 5 * 1024 * 1024) {
//       alert("Image size must be less than 5MB.");
//       event.target.value = "";
//       return;
//     }

//     setImage(selectedFile);
//   };

//   const handleRemoveImage = () => {
//     setImage(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleSubmit = () => {
//     if (!caption.trim() && !image) {
//       alert("Please write something or select an image.");
//       return;
//     }

//     onCreatePost({
//       caption: caption.trim(),
//       image,
//     });

//     setCaption("");
//     setImage(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col gap-3">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-full bg-[#6B3F00] flex items-center justify-center shrink-0">
//           <User className="w-5 h-5 text-white stroke-[2.5]" />
//         </div>

//         <textarea
//           value={caption}
//           onChange={(event) => setCaption(event.target.value)}
//           placeholder="Share a photo, text, or propose a meetup..."
//           rows={2}
//           className="w-full py-2.5 px-4 text-xs sm:text-sm font-medium bg-[#F8F7F4] border border-stone-200/50 text-[#54483B] placeholder-[#A09383] rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition resize-none"
//         />
//       </div>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="hidden"
//       />

//       {preview && (
//         <div className="relative w-full">
//           <img
//             src={preview}
//             alt="Selected post image"
//             className="w-full max-h-80 object-cover rounded-xl"
//           />

//           <button
//             type="button"
//             onClick={handleRemoveImage}
//             aria-label="Remove image"
//             className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       <hr className="border-gray-100" />

//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={handlePhotoClick}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-[#F5F3EE] hover:bg-stone-200/60 transition"
//           >
//             <Camera className="w-3.5 h-3.5 text-stone-600" />
//             <span>Photo</span>
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               alert("Meet Slot page will be connected later.");
//             }}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-[#F5F3EE] hover:bg-stone-200/60 transition"
//           >
//             <Calendar className="w-3.5 h-3.5 text-amber-700" />
//             <span>Meet Slot</span>
//           </button>
//         </div>

//         <button
//           type="button"
//           onClick={handleSubmit}
//           className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 active:bg-amber-700 transition shadow-xs"
//         >
//           <span>Post</span>
//           <Play className="w-3 h-3 fill-current" />
//         </button>
//       </div>
//     </div>
//   );
// };
// // import React from 'react';
// // import { Camera, Calendar, Play, User } from 'lucide-react';

// // export const CreatePost: React.FC = () => {
// //   return (
// //     <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col gap-3">
// //       {/* share a photo, text, or propose a meetup area and avatar */}
// //       <div className="flex items-center gap-3">
// //         <div className="w-10 h-10 rounded-full bg-[#6B3F00] flex items-center justify-center shrink-0">
// //           <User className="w-5 h-5 text-white stroke-[2.5]" />
// //         </div>
// //         <input
// //           type="text"
// //           placeholder="Share a photo, text, or propose a meetup..."
// //           className="w-full py-2.5 px-4 text-xs sm:text-sm font-medium bg-[#F8F7F4] border border-stone-200/50 text-[#54483B] placeholder-[#A09383] rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition"
// //         />
// //       </div>

// //       <hr className="border-gray-100" />

// //       {/* photo, meet slot, post button */}
// //       <div className="flex items-center justify-between">
// //         <div className="flex items-center gap-2">
// //         {/* photo button */}
// //           <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-[#F5F3EE] hover:bg-stone-200/60 transition">
// //             <Camera className="w-3.5 h-3.5 text-stone-600" />
// //             <span>Photo</span>
// //           </button>

// //           {/* meet slot button */}
// //           <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-[#F5F3EE] hover:bg-stone-200/60 transition">
// //             <Calendar className="w-3.5 h-3.5 text-amber-700" />
// //             <span>Meet Slot</span>
// //           </button>
// //         </div>

// //         {/* post button */}
// //         <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 active:bg-amber-700 transition shadow-xs">
// //           <span>Post</span>
// //           <Play className="w-3 h-3 fill-current" />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };
