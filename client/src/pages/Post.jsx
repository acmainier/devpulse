import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github-dark.css";
import rehypeHighlight from "rehype-highlight";
import "./Post.css";

function Post() {
  const { user } = useAuth();
  const token = user ? localStorage.getItem("token") : null;
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(
    token
      ? { state: "loading" }
      : { state: "error", error: new Error("User not authenticated") },
  );
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to get post ${id}`);
        }
        return response.json();
      })
      .then((post) => {
        setResult({ state: "success", post });
      })
      .catch((error) => {
        setResult({ state: "error", error });
      });
  }, [id, token]);

  useEffect(() => {
    if (result.state !== "success") {
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setComments(data));
  }, [id, result.state, token]);

  function handleDelete() {
    if (!token) {
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete post ${id}`);
        }
        alert("Post deleted successfully");
        navigate("/feed"); // Redirect to feed after deletion
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      });
  }

  function handleAddComment(e) {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newComment }),
    }).then(() => {
      setNewComment("");
      fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setComments(data));
    });
  }

  function handleAddReply(e, parentId) {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: replyText, parentId }),
    }).then(() => {
      setReplyText("");
      setReplyingTo(null);
      fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setComments(data));
    });
  }

  if (result.state === "loading") {
    return <div>Loading...</div>;
  }

  if (result.state === "error") {
    return <div>Error: {result.error.message}</div>;
  }

  if (!result.post) {
    return <div>Post not found!</div>;
  }

  const isUserPostOwner = user && result.post.user.id === user.id;

  return (
    <div className="post-container">
      <h2>{result.post.title}</h2>
      <p>
        by {result.post.user.username} category:{" "}
        {result.post.category.category_name} on{" "}
        {new Date(result.post.createdAt).toLocaleDateString()}
      </p>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {result.post.content}
      </ReactMarkdown>
      {isUserPostOwner && (
        <button className="post-action-btn" onClick={handleDelete}>
          Delete Post
        </button>
      )}
      {isUserPostOwner && (
        <button
          className="post-action-btn"
          onClick={() => navigate(`/posts/edit/${id}`)}
        >
          Update Post
        </button>
      )}

      <div className="comments-form-container">
        <h3 className="comments-h3">Comments</h3>

        {token && (
          <form onSubmit={handleAddComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit">Post Comment</button>
          </form>
        )}

        {comments.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>{comment.user.username}</strong>: {comment.content}
            </p>

            {token && (
              <button onClick={() => setReplyingTo(comment.id)}>Reply</button>
            )}

            {replyingTo === comment.id && (
              <form onSubmit={(e) => handleAddReply(e, comment.id)}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                />
                <button type="submit">Post Reply</button>
              </form>
            )}

            {comment.replies.map((reply) => (
              <div key={reply.id}>
                <p>
                  <strong>{reply.user.username}</strong>: {reply.content}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
