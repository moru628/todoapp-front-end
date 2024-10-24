import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Navbar from '../../nav/Navbar'
import './index.css'
import feather from 'feather-icons';
import { Link, useNavigate  } from 'react-router-dom';
import InfoChange from '../../component/InfoChange/InfoChange';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [showDropdown, setShowDropdown] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [description, setDescription] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(localStorage.getItem("userName")); 
  const [eventImages, setEventImages] = useState([]);
  const [posts, setPosts] = useState([])
  const [followedFriends, setFollowedFriends] = useState([])

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const url = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    feather.replace();
    console.log('Feather replace running');
  }, []);

useEffect(() => {
  const fetchUserData = async () => {
    if (!userId) return; 
    try {
      const response = await axios.get(`${url}/user/${userId}`);
      const userData = response.data;

      setUser(userData);
      setDescription(response.data.description); 
      setUserName(userData.name);

      if (userData.profileImg && userData.profileImg !== '') {
        setProfileImg(`${url}/upload/${userData.profileImg}`);
      } else {
        setProfileImg('/assets/profile-blank.png');
      }

      localStorage.setItem('profileImg', response.data.profileImg);
      localStorage.setItem('userName', userData.name)
      
      const eventImgUrls = userData.topic
        .filter(img => img ? `${url}${img}` : '')
        .map(img => img ? img : '');
      setEventImages(eventImgUrls);

      const postsResponse = await axios.get(`${url}/post/${userId}`)
      setPosts(postsResponse.data); 
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchUserData();
}, [userId, url]);


useEffect(() => {
  const fetchFollowedFriends = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return; 
    try {
      const response = await axios.get(`${url}/${userId}/followedFriends`);
      setFollowedFriends(response.data.followedFriends);
    } catch (error) {
      console.error('Error fetching followed friends:', error);
    }
  };

  fetchFollowedFriends();
}, [url]);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("profileImg"); 
    localStorage.removeItem("userId")
    navigate('/login'); 

    setUser(null);
    setProfileImg('/assets/profile-blank.png');
    setDescription('');
    setUserName('');
    setFollowedFriends([]); 
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = async() => {
    setOpenDialog(false);
  };

  const handleDeletePost = async (postId) => {
    try {
    const response = await axios.delete(`${url}/post/${postId}`);
    if (response.status === 200) {
      setPosts(posts.filter(post => post._id.toString() !== postId.toString()));
    }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
  return (
    <div>
      <div className='container-profile'>
        <div className='top-container' >
          <img src='/assets/profile-background.png' alt='' className='background-image'/>
          {userName && 
            <div className='settings-icon' onClick={toggleDropdown}>
              <img src="/assets/settings.png" alt='Settings' />
              {showDropdown && (
                <div className='dropdown-menu'>
                  <ul>
                    <li onClick={handleDialogOpen}>Profile info</li>
                    <li onClick={handleLogout}>Log Out</li>
                  </ul>
                </div>
              )}
            </div>
          }
          {userId ? (
            <img src={profileImg} alt='' className='profile'/>
          ):(
            <img src='/assets/profile-blank.png' alt='' className='profile'/>
          )}
          {userName ? (
            <>
            <h2 className="user-name">{userName}</h2>
            <div className='profile-description'>{description}</div>
            </>
          ) : (
            <div className='logout-container'>
              <Link to="/login">
                <button className='button-log'>Login</button>
              </Link>
              <Link to="/register">
                <div className='signup'>
                  <div className='line'></div>
                  Sign up
                  <div className='line'></div>
                </div>
              </Link>
            </div>
          )}
        </div>

           {/* Dialog for editing profile info */}
           <InfoChange 
          open={openDialog} 
          onClose={handleDialogClose} 
          user={user} 
          setUser={setUser} 
          description={description} 
          setDescription={setDescription}
          setProfileImg={setProfileImg}
          setUserName={setUserName}
          userId={userId}  
        />

        <div className='tabs-container'>
          <div className='tabs'>
            <div className='btn-photo'>
              <div
                className={`tab ${activeTab === 'photos' ? 'active' : ''}`} 
                onClick={() => setActiveTab('photos')}
              >
                Photos
              </div>
              <div className={`line-1 ${activeTab === 'photos' ? 'active' : ''}`}></div>
            </div>
            <div className='btn-contact'>
              <div 
                className={`tab ${activeTab === 'contacts' ? 'active' : ''}`} 
                onClick={() => setActiveTab('contacts')}
              >
                Contacts
              </div>
              <div className={`line-2 ${activeTab === 'contacts' ? 'active' : ''}`}></div>
            </div>
          </div>
        <div className='tab-content'>
          {activeTab === 'photos' && (
            <div className='section'>
              <div className='favourite'>
                <div className='profile-title'>
                  Favourite topic
                </div>
                <img src='/assets/arrow-right.png' alt='' />
              </div>
              <div className='favourite-items'>
                {eventImages.length > 0 ? (
                  eventImages.map((url, index) => {
                    return (
                      <div className='favourite-item' key={index}>
                        <img src={url} alt={`Favorite ${index + 1}`}className='favorite-img' />
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className='favourite-item empty'></div>
                    <div className='favourite-item empty'></div>
                    <div className='favourite-item empty'></div>
                  </>
                )}
              </div>

              <div className='posts'>
                <div className='post'>
                  <div className='profile-title'>
                      Posts
                  </div>
                  <img src='/assets/arrow-right.png' alt='' />
                </div>
                <div className='swipe-section'>
                  {posts.length > 0 ? (
                    posts.map((post, index) => (
                      <div className='post-item box' key={index}>
                        <img src={`${url}/upload/${post.imageUrl}`} alt={`Post ${index + 1}`} className='post-img' />
                        <div className='post-cancel'  onClick={() => handleDeletePost(post._id)}>
                          <img src='/assets/Cancel.png' alt='' className='icon'/>
                        </div>
                      </div>
                  ))
                  ) : (
                    <>
                     <div className='favourite-item empty'></div>
                    <div className='favourite-item empty'></div>
                    <div className='favourite-item empty'></div>
                    </>
                  )}
                </div>
              </div>
            </div>  
          )}
          
          {activeTab === 'contacts' && (
            <div className='section'>
              <div className='info-container'>
                {followedFriends.length > 0 ? (
                  followedFriends.map((info)=>(
                    <div className='info' key={info._id}>
                      <div className='user-info'>
                        <img src={`${url}/upload/${info.profileImg}`} alt='' className='info-img'/>
                        <div className='info-name'>{info.name}</div>
                      </div>
                      <img src='/assets/envelope.png' alt='' className='envelope-icon'/>
                    </div>
                  ))
                ): (
                  <div className='empty-container'>
                    <div>
                      <img src='/assets/friends.png' alt='' className='friends-empty-image'/>
                    </div>
                    <div className='friends-empty-notes'>Add your friends</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
      <Navbar />
    </div>
  )
}

export default Profile
