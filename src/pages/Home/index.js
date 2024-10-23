import React, {useEffect, useState, useCallback}from 'react'
import Navbar from '../../nav/Navbar';
import './index.css'
import { AiFillHeart } from "react-icons/ai";
import Category from '../../component/Category/Category';
import Activity from '../../component/Activities/Activities'
import axios from 'axios';

const Home = () => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Guest");
  const [profileImg, setProfileImg] = useState(localStorage.getItem("profileImg") || '/assets/profile-black.png');
  const [posts, setPosts] = useState([])
  const [taskCounts, setTaskCounts] = useState({});


  const userId = localStorage.getItem("userId");
  const categories = [
    { id: 1, name: 'Work', tasks: taskCounts['Work'] || 0 },
    { id: 2, name: 'Study', tasks: taskCounts['Study'] || 0 },
    { id: 3, name: 'Pet', tasks: taskCounts['Pet'] || 0 },
    { id: 4, name: 'Family', tasks: taskCounts['Family'] || 0 },
    { id: 5, name: 'Play', tasks: taskCounts['Play'] || 0 }
  ];

  useEffect(() => {
   const fetchUserData = async () => {
     if (!userId) return; 
     try {
       const response = await axios.get(`http://localhost:5050/user/${userId}`);
       const userData = response.data;
 
       setUserName(userData.name);
       localStorage.setItem('userName', userData.name)

       if (userData.profileImg && userData.profileImg !== '') {
        setProfileImg(`http://localhost:5050/upload/${userData.profileImg}`);
      } else {
        setProfileImg('/assets/profile-blank.png');
      }

      localStorage.setItem('profileImg', userData.profileImg || '/assets/profile-blank.png');
     } catch (error) {
       console.error("Error fetching user data:", error);
     }
   };
 
   fetchUserData();
 }, [userId]);
  
 useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5050/post');
      const posts = response.data;

      const selectedPosts = posts
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      setPosts(selectedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  fetchPosts();
}, []);

const fetchTaskCounts = useCallback(async () => {
  if (!userId) return;
  try {
    const response = await axios.get(`http://localhost:5050/task/count?userId=${userId}`);
    const counts = response.data.count;
    setTaskCounts(counts);
  } catch (error) {
    console.error('Error fetching task counts:', error);
  }
}, [userId]);

useEffect(() => {
  fetchTaskCounts();
}, [fetchTaskCounts]);

const handleNewTask = async (taskData) => {
  try {
    await axios.post('http://localhost:5050/task', taskData);
    fetchTaskCounts();
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

  return (
    <div>
        <div className='container'>
            <div className='container-title'>
                <div className='user-info'>
                    <div className='user'>
                        <div className='user-welcome'>Hello!</div>
                        <div className='user-name'>{userName}</div> 
                    </div>
                    {userId ? (
                      <img src={profileImg} alt='' className='user-photo'></img>
                    ) : (
                      <img src={'/assets/profile-blank.png'} alt='' className='user-photo'></img>
                    )}
                </div>
                <div className="search-container">
                    <input type='text' placeholder='Search...' className='search-input' />
                    <img src='/assets/search.png' alt='' className="search-icon" />
                </div>
            </div>
            <Category categories={categories} userId={userId}  onNewTask={handleNewTask} />
            <Activity />
            <div className='container-scroll'>
              <div className='subtitle'>
                Moment
              </div>
              <div className='momemnt-contain'>
                {posts.map((post) => (
                <div key={post._id} className= 'moment-item'
                  style={{
                  backgroundImage: `url(http://localhost:5050/upload/${post.imageUrl})`,
                }}
                >
                  <div className='moment-content'>
                    <div className='profile-circle'>
                    <img
                      src={`http://localhost:5050/upload/${post.profileImg}`}
                      alt=''
                      className='profile-image'
                    />
                    </div>
                  </div>
                  <div className='moment-info'>
                    <div className='name'>{post.name}</div>
                    <div className='like'>
                      <AiFillHeart className='like-icon' />
                      <div className='like-number'>1.2 k</div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
        </div>
        <Navbar />
    </div>
  )
}

export default Home