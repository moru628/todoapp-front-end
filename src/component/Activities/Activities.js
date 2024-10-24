import React, { useEffect, useState } from 'react'
import './activities.css'
import axios from 'axios'
import { Link } from 'react-router-dom';

const Activity = () => {
const [activities, setActivities] = useState([])
const url = process.env.REACT_APP_BACKEND_URL;

    useEffect(()=>{
        const fetchEventData = async(req, res) => {
            try{
                const response = await axios.get(`${url}/event`)
                setActivities(response.data)
            }catch(error){
                console.error("Error fetching activities:", error);
            }
        }
        fetchEventData()
    }, [url])
  return (
        <div className='container-scroll'>
        <div className='subtitle'>Events</div>
        <div className='acts'>
        {activities.map((activity)=>(
            <Link to={`/event/details/${activity._id}`} className='item-acts' key={activity.id}>
            <div className='img-container'>
            <img src= {`/assets/activity${activity.id}.png`}alt='' className='acts-img'/>
            </div>
            <div className={`acts-info act-info-${activity.id}`}>
                <div className='acts-title-1'>{activity.title}</div>
                <div className='acts-title-2'>{activity.sub_title}</div>
                <div className='location'>
                    <img src='/assets/vector.png' alt='' className='location-icon'/>
                    <div className='location-text'>{activity.location}</div>
                </div>
                <div className='act-bottom'>
                <div className='act-time'>
                    {activity.time}
                </div>
                <div className='act-friends'>
                    <div className='friends-photo'></div>
                </div>
                </div>
            </div>
        </Link>
        ))}
        </div>
    </div>
  )
}

export default Activity