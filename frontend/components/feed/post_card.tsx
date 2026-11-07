"use client";

import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  User,
  Pencil,
  EyeOff,
  Flag,
  Trash2,
  X,
  Copy,
} from "lucide-react";
import { Comment } from "./comment";

interface CommentData {
  id: string;
  username: string;
  text: string;
}

interface BackendComment {
  id: string;
  content: string;
  user: {
    username: string;
  };
}

interface LikesResponse {
  count: number;
  isLiked: boolean;
}

interface PostCardProps {
  postId: string;
  caption: string;
  imageUrl: string | null;
  username: string;
  initialLikes: number;
  onDelete: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  postId,
  caption,
  imageUrl,
  username,
  initialLikes,
  onDelete,
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [likeState, setLikeState] = useState({
    liked: false,
    count: initialLikes,
  });
  const [likesLoading, setLikesLoading] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [currentCaption, setCurrentCaption] = useState(caption);
  const [editedCaption, setEditedCaption] = useState(caption);

  const displayedImage = imageUrl
    ? `${API_URL}${imageUrl}`
    : null;

  // Get the current user's token.
  const getToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Get the real likes count and current user's like status.
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const token = getToken();

        if (!token) {
          console.error("No access token found. Please login.");
          return;
        }

        const response = await fetch(
          `${API_URL}/posts/${postId}/likes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load likes");
        }

        const data: LikesResponse = await response.json();

        setLikeState({
          liked: data.isLiked,
          count: data.count,
        });
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [API_URL, postId]);

  // Get comments from the backend.
  const fetchComments = async () => {
    setCommentsLoading(true);
    setCommentsError("");

    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/comments`
      );

      if (!response.ok) {
        throw new Error("Failed to load comments");
      }

      const data: BackendComment[] = await response.json();

      setComments(
        data.map((comment) => ({
          id: comment.id,
          username: comment.user.username,
          text: comment.content,
        }))
      );
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentsError("Could not load comments.");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleToggleComments = () => {
    const willOpen = !showComments;
    setShowComments(willOpen);

    if (willOpen) {
      fetchComments();
    }
  };

  // Create or remove a like in the database.
  const handleLike = async () => {
    if (likesLoading) return;

    const token = getToken();

    if (!token) {
      console.error("No access token found. Please login.");
      return;
    }

    setLikesLoading(true);

    try {
      const method = likeState.liked ? "DELETE" : "POST";

      const response = await fetch(
        `${API_URL}/posts/${postId}/likes`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const likesResponse = await fetch(
        `${API_URL}/posts/${postId}/likes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!likesResponse.ok) {
        throw new Error("Failed to refresh likes");
      }

      const data: LikesResponse = await likesResponse.json();

      setLikeState({
        liked: data.isLiked,
        count: data.count,
      });
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setLikesLoading(false);
    }
  };

  // Create a comment in the database.
  const handleAddComment = async () => {
    const content = newComment.trim();

    if (!content || commentSubmitting) return;

    const token = getToken();

    if (!token) {
      setCommentsError("Please login before commenting.");
      return;
    }

    setCommentSubmitting(true);
    setCommentsError("");

    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      const data: BackendComment = await response.json();

      setComments((previous) => [
        ...previous,
        {
          id: data.id,
          username: data.user.username,
          text: data.content,
        },
      ]);

      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
      setCommentsError("Could not post your comment. Please try again.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleSave = () => {
    setIsSaved((previous) => !previous);
  };

  const handleShare = () => {
    setLinkCopied(false);
    setShowShareModal(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
    } catch (error) {
      console.error("Could not copy link:", error);
      alert("Could not copy the link. Please copy the URL from your browser.");
    }
  };

  const handleEdit = () => {
    setEditedCaption(currentCaption);
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    setCurrentCaption(editedCaption);
    setShowEditModal(false);
  };

  const handleHide = () => {
    setIsHidden(true);
    setShowMenu(false);
  };

  // Delete the post from the backend.
  const handleDelete = async () => {
    if (deleting) return;

    const token = getToken();

    if (!token) {
      setDeleteError("Please login before deleting a post.");
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      onDelete(postId);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteError("Could not delete this post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleReport = () => {
    setShowReportModal(false);
    setReportSubmitted(true);
  };

  if (isHidden) return null;

  return (
    <div className="w-full bg-white text-gray-900 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="w-5 h-5 text-amber-700" />
          </div>

          <div>
            <p className="font-bold text-sm">{username}</p>
          </div>
        </div>

        {/* More options */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4" />
                Edit post
              </button>

              <button
                onClick={handleHide}
                className="w-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-gray-50"
              >
                <EyeOff className="w-4 h-4" />
                Hide post
              </button>

              <button
                onClick={() => {
                  setShowReportModal(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-gray-50"
              >
                <Flag className="w-4 h-4" />
                Report post
              </button>

              <div className="border-t border-gray-100 my-1" />

              <button
                onClick={() => {
                  setDeleteError("");
                  setShowDeleteConfirm(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 flex items-center gap-3 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post image */}
      {displayedImage && (
        <div className="relative">
          <img
            src={displayedImage}
            alt="Post content"
            className="w-full h-80 object-cover"
          />
        </div>
      )}

      {/* Caption when there is no image */}
      {!displayedImage && currentCaption && (
        <div className="px-4 pt-4">
          <p className="text-sm text-gray-800">
            <span className="font-bold mr-2">{username}</span>
            {currentCaption}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={handleLike}
            disabled={likesLoading}
            aria-label="Like post"
            className={`transition-colors ${
              likeState.liked
                ? "text-red-500"
                : "text-gray-700 hover:text-red-500"
            } disabled:opacity-50`}
          >
            <Heart
              className="w-6 h-6"
              fill={likeState.liked ? "currentColor" : "none"}
            />
          </button>

          <button
            onClick={handleToggleComments}
            aria-label="Show comments"
            className="text-gray-700 hover:text-blue-600"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share post"
            className="text-gray-700 hover:text-blue-600 cursor-pointer"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={handleSave}
          aria-label="Save post"
          className={`transition-colors ${
            isSaved ? "text-amber-500" : "text-gray-700 hover:text-amber-500"
          }`}
        >
          <Bookmark
            className="w-6 h-6"
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Likes count */}
      <div className="px-4 pt-2">
        <p className="text-xs font-bold text-gray-900">
          {likeState.count.toLocaleString()} likes
        </p>
      </div>

      {/* Caption when post has image */}
      {displayedImage && currentCaption && (
        <div className="px-4 pt-2">
          <p className="text-sm text-gray-800">
            <span className="font-bold mr-2">{username}</span>
            {currentCaption}
          </p>
        </div>
      )}

      {/* Comments */}
      <div className="px-4 pt-3 pb-4">
        <button
          onClick={handleToggleComments}
          className="text-xs text-gray-500 hover:text-gray-800"
        >
          {showComments
            ? "Hide comments"
            : `View all ${comments.length} comments`}
        </button>

        {showComments && (
          <div className="mt-3 space-y-3">
            {commentsLoading && (
              <p className="text-sm text-gray-500">
                Loading comments...
              </p>
            )}

            {commentsError && (
              <p className="text-sm text-red-500">
                {commentsError}
              </p>
            )}

            {!commentsLoading && comments.length === 0 && !commentsError && (
              <p className="text-sm text-gray-500">
                No comments yet.
              </p>
            )}

            {comments.map((comment) => (
              <Comment
                key={comment.id}
                username={comment.username}
                text={comment.text}
              />
            ))}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAddComment();
                  }
                }}
                placeholder="Write a comment..."
                className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-amber-400"
              />

              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || commentSubmitting}
                className="text-sm font-bold text-amber-600 disabled:opacity-40"
              >
                {commentSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Share post</h3>

              <button onClick={() => setShowShareModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
            >
              <Copy className="w-4 h-4" />
              {linkCopied ? "Link copied!" : "Copy link"}
            </button>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-3 p-3 rounded-xl text-sm text-gray-500 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Edit post</h3>

              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={editedCaption}
              onChange={(event) => setEditedCaption(event.target.value)}
              className="w-full min-h-28 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-amber-400"
            />

            <button
              onClick={handleSaveEdit}
              className="w-full mt-3 bg-amber-400 hover:bg-amber-500 rounded-xl p-3 font-bold text-sm"
            >
              Save changes
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5">
            <h3 className="font-bold text-lg">Delete post?</h3>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this post?
            </p>

            {deleteError && (
              <p className="text-sm text-red-500 mt-3">
                {deleteError}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 p-3 rounded-xl bg-gray-100 text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 p-3 rounded-xl bg-red-500 text-white text-sm font-semibold disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Report post</h3>

              <button onClick={() => setShowReportModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-3">
              Why are you reporting this post?
            </p>

            {["Spam", "Harassment", "False information", "Other"].map(
              (reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 py-2 text-sm"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                  />
                  {reason}
                </label>
              )
            )}

            <button
              onClick={handleReport}
              className="w-full mt-4 p-3 rounded-xl bg-red-500 text-white text-sm font-bold"
            >
              Submit report
            </button>
          </div>
        </div>
      )}

      {/* Report confirmation */}
      {reportSubmitted && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 text-center">
            <h3 className="font-bold">Report submitted</h3>

            <p className="text-sm text-gray-500 mt-2">
              Thank you for helping keep the community safe.
            </p>

            <button
              onClick={() => setReportSubmitted(false)}
              className="mt-4 px-6 py-2 rounded-xl bg-amber-400 font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

