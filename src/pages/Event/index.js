import React, { useState,useEffect } from 'react'
import Navbar from '../../nav/Navbar'
import { Link } from 'react-router-dom'; 
import './index.css'
import axios from 'axios'

const Event = () => {
  const [activities, setActivities] = useState([])
  const [heartIcon, setHeartIcon] = useState({})

  useEffect(() => {
    const savedHearts = JSON.parse(localStorage.getItem('heartIconStates')) || {};
    setHeartIcon(savedHearts);
  }, []);

  const handleClickHeart = async (activity) => {
    const newHeartIconState = !heartIcon[activity.id];
    
    setHeartIcon((prevState) => {
      const newState = {
        ...prevState,
        [activity.id]: newHeartIconState
      };

      localStorage.setItem('heartIconStates', JSON.stringify(newState));
      return newState;
    });

    const eventImageUrl = `/assets/activity${activity.id}.png`;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("You must be logged in to add event.");
      return;
    }
    if (newHeartIconState) {
      try {
        const response = await axios.post('http://localhost:5050/user/event', {
          userId, 
          eventImageUrl
        });
        console.log("event added:",response.data); 
      } catch (error) {
        console.error("Error adding event:", error.response ? error.response.data : error.message);
      }
    } else {
      try {
        const response = await axios.delete('http://localhost:5050/user/event', {
          data: { userId, eventImageUrl }
        });
        console.log("event removed:", response.data);
      } catch (error) {
        console.error("Error removing event:", error.response ? error.response.data : error.message);
      }
    }
  }

  useEffect(() => {
    const fetchActivities = async() => {
      try {
        const response = await axios.get('http://localhost:5050/event')
        setActivities(response.data)
      } catch(error){
        console.error("Error fetching activities:", error);
      }
    }
    fetchActivities()
  },[])

  return (
    <div className='event-container'>
      <div className='container-scroll-event'>
        <div className='title-event'>
          <div className='line-event'>--</div>
          <div className='event'>Event</div>
          <div className='line-event'>--</div>
        </div>
        <div className='event-items'>
        {activities.map((activity)=>(
          <div className='event-item' key={activity.id}>
            <div className='img-container'>
            <img src= {`/assets/activity${activity.id}.png`}alt='' className='event-img'/>
            </div>
            <div className={`act-info act-info-${activity.id}`}>
            <div className='act-title-1'>{activity.title}</div>
            <div className='act-title-2'>{activity.sub_title}</div>
            <div className='location'>
                <img src='/assets/vector.png' alt='' className='act-icon'/>
                <div className='act-location'>{activity.location}</div>
            </div>
            <div className='act-bottom'>
            <div className='act-time'>
                {activity.time}
            </div>
            <div className='act-friends'>
                <div className='friends-photo'></div>
            </div>
            </div>
            <div className='end-section'>
              <Link to={`/event/details/${activity._id}`} className={`act-button button-${activity.id}`}>
                <img src='/assets/ok.png' alt='' />
                <div className='button-text'>Joining</div>
              </Link>
              <div className='heart-button' onClick={() => handleClickHeart(activity)}>
                {heartIcon[activity.id] ? 
                  <img src='/assets/heart-2.png' alt='' className='heart-icon'/>
                :
                  <img src='/assets/heart-1.png' alt='' className='heart-icon'/>
                }
              </div>
            </div>
          </div>
          </div>
        ))}
        </div>
    </div>
      <Navbar />
    </div>
  )
}

export default Event