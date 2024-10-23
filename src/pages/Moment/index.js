import React, {useEffect, useState} from 'react'
import Navbar from '../../nav/Navbar'
import './index.css'
import PostDialog from '../../component/PostDialog/PostDialog'
import axios from 'axios'
const Moment = () => {
  const [open, setOpen] = useState(false)
  const [posts, setPosts] = useState([])
  const [followedFriends, setFollowedFriends] = useState([])

  useEffect(()=>{
    const fetchPosts = async() => {
      try{
        const response = await axios.get('http://localhost:5050/post')

        const updatedPosts = response.data.map(post => ({
          ...post,
          profileImg: post.profileImg ? `http://localhost:5050/upload/${post.profileImg}` : '/assets/profile-blank.png'
        }));
        setPosts(updatedPosts)
      }catch(error){
        console.error('Error fetching posts:', error);
      }
    }
    fetchPosts()
  }, [])

useEffect(() => {
  const fetchFollowedFriends = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return; 
    try {
      const response = await axios.get(`http://localhost:5050/${userId}/followedFriends`);
      setFollowedFriends(response.data.followedFriends);
    } catch (error) {
      console.error('Error fetching followed friends:', error);
    }
  };

  fetchFollowedFriends();
}, []);
  
useEffect(() => {

})
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePostUpload = (newPost) => {
    const updatedPost = {
      ...newPost,
      profileImg: newPost.profileImg ? `http://localhost:5050/upload/${newPost.profileImg}` : '/assets/profile-blank.png',
    };
  
    setPosts((prevPosts) => [updatedPost, ...prevPosts]);
  };
  

  const handleFollow = async (friendId) => {
    const userId = localStorage.getItem('userId');
  
    try {
      const response = await axios.post('http://localhost:5050/follow', {
        userId, 
        friendId
      });
      
      setFollowedFriends((prev) => [
          ...prev,
          { _id: friendId, name: response.data.name, profileImg: response.data.profileImg }
      ]);

      console.log('Followed:', response.data);
    } catch (error) {
      console.error('Error following friend:', error);
    }
  };
  
  const handleUnfollow = async (friendId) => {
    const userId = localStorage.getItem('userId');
  
    try {
      await axios.post('http://localhost:5050/unfollow', {
        userId, 
        friendId
      });

      setFollowedFriends((prev) => prev.filter(friend => friend._id !== friendId));
  
      console.log('Unfollowed:', friendId);
    } catch (error) {
      console.error('Error unfollowing friend:', error);
    }
  };
  
  return (
    <div className='moment-container'>
      <div className='container-scroll-moment'>
        <div className='title-moment'>
            <div className='line-moment'>--</div>
            <div className='moment'>Moment</div>
            <div className='line-moment'>--</div>
        </div>
        <div className='friends-Image-container'>
        {followedFriends.length === 0 ? (
          <>
            <img src='/assets/dot.png' alt='No followed friends' className='dot-image' />
            <img src='/assets/dot.png' alt='No followed friends' className='dot-image' />
          </>
          ) : (
          followedFriends.map((friend) => (
            <div className='each-profile' key={friend._id}>
              <img src={`http://localhost:5050/upload/${friend.profileImg}`} alt='' className='top-image' />
              <div className='name'>{friend.name}</div>
            </div>
          ))
        )}
        </div>
        <div className='post-container'>
          <div className='title'>Posts</div>
          <div className='all-posts'>
            {posts.map((post)=>(
              <div className='each-post' key={post._id}>
                <div className='post-top'>
                  <img src={post.profileImg} alt='' className='post-image'/>
                  <div className='name'>{post.name}</div>
                  <div className='follow-btn' onClick={() => {
                      if (followedFriends.some(friend => friend._id === post.user)) {
                        handleUnfollow(post.user);
                      } else {
                        handleFollow(post.user);
                      }
                    }}>
                    <div className={followedFriends.some(friend => friend._id === post.user) ? 'following' : 'follow'}>
                      {followedFriends.some(friend => friend._id === post.user) ? "Followed" : "Follow"}
                    </div>
                  </div>
                </div>
                <div className='post-medium'>
                  <img src={`http://localhost:5050/upload/${post.imageUrl}`} alt='' className='image'/>
                </div>
                <div className='post-bottom'>
                  <div className='description'>
                    {post.title}
                  </div>
                  <img src='/assets/comment.png' alt='' className='comment-icon'/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='add-icon' onClick={handleClickOpen}>
          <img src='/assets/Add.png' alt='' className='add-icon'/>
        </div>
        <PostDialog open={open} handleClose={handleClose} onPostUpload={handlePostUpload} />
      </div>
      <Navbar />
    </div>
  )
}

export default Moment