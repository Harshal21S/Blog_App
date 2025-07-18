import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import './Post.css';

const Post = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [editPostEnable, setEditPostEnable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/user');
        setUserDetails(userRes.data);

        const postsRes = await axios.get('/api/user/posts');
        setPosts(postsRes.data.posts);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  const handleCreatePost = async () => {
    try {
      const res = await axios.post('/api/post', { content: postContent });
      setPosts(prev => [res.data.post, ...prev]);
      setPostContent('');
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/api/logout');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleLikePost = async (postId) => {
    try {
      const res = await axios.post(`/api/post/${postId}/like`);
      const updated = res.data.post;
      setPosts(prev => prev.map(p => (p._id === postId ? updated : p)));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleEditPost = async (postId) => {
    try {
      const res = await axios.put(`/api/post/${postId}`, { content: postContent });
      setPosts(prev =>
        prev.map(p => (p._id === postId ? { ...p, content: res.data.post.content } : p))
      );
      setEditPostEnable(false);
      setEditPostId(null);
      setPostContent('');
    } catch (err) {
      console.error('Failed to edit post:', err);
    }
  };

  return (
    <div className="post-page">
      <div className="top-bar">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="greeting">
        <h2>Hello, {userDetails.name || 'User'} 👋</h2>
        <p>Create a new post</p>
      </div>

      <div className="post-form">
        <textarea
          placeholder="What’s on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>

        <div className="post-buttons">
          {editPostEnable ? (
            <>
              <button onClick={() => handleEditPost(editPostId)} className="btn primary">Save</button>
              <button onClick={() => setEditPostEnable(false)} className="btn secondary">Cancel</button>
            </>
          ) : (
            <button onClick={handleCreatePost} className="btn primary">Create Post</button>
          )}
        </div>
      </div>

      <div className="posts-section">
        <h3>Your Posts 📑</h3>
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="post-card">
              <p className="username">@{userDetails.username}</p>
              <p className="post-content">{post.content}</p>
              <div className="post-meta">
                <span>{post.likes.length} Like</span>
                <span>{new Date(post.date).toLocaleString()}</span>
              </div>
              <div className="post-actions">
                <button onClick={() => toggleLikePost(post._id)}>
                  {post.likes.includes(userDetails._id) ? 'Unlike' : 'Like'}
                </button>
                <button onClick={() => {
                  setEditPostId(post._id);
                  setPostContent(post.content);
                  setEditPostEnable(true);
                }}>Edit</button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Post;
