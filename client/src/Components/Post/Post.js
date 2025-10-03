
import './Post.css';
import Comment from '../../Img/comment.png';
import Share from '../../Img/share.png';
import Like from '../../Img/like.png';
import Notlike from '../../Img/notlike.png';
import { useSelector } from 'react-redux';
import { likePost } from '../../api/PostRequest';
import prof from '../../assets/h.jpeg'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// ...other imports

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const serverPublic = "http://localhost:4000/images/";

  useEffect(() => {
    axios.get(`http://localhost:4000/post/${data._id}/comments`).then((res) => setComments(res.data));
  }, [data._id]);

  const handleLike = () => {
    setLiked((prev) => !prev);
    likePost(data._id, user._id);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      userId: user._id,
      username: user.username,
      text: commentText
    };
    const res = await axios.post(`http://localhost:4000/post/${data._id}/comment`, newComment);
    setComments(res.data);
    setCommentText('');
  };

  return (
    <div className='Post'>
      {data.image && <img src={serverPublic + data.image} alt="" />}
      <div className="postReact">
        <img src={liked ? Like : Notlike} alt="" onClick={handleLike} style={{ cursor: "pointer" }} />
        {/* //<img src={Comment} alt="" /> */}
        <img src={Share} alt="" />
      </div>
      <span style={{ color: "var(--gray)", fontSize: '14px' }}>{likes} likes</span>
      <div className="detail">
        <span><b>{data.name}</b></span>
        <span>{data.desc}</span>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
        <div className="comments">
          {comments.map((c, index) => (
            <p key={index}><b>{c.username}</b>: {c.text}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
