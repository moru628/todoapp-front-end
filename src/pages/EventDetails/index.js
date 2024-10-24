import React,  { useEffect, useState } from 'react'
import './index.css'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../nav/Navbar';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  const navigate = useNavigate();

  const url = process.env.REACT_APP_BACKEND_URL;

  const handleBackClick = () => {
        navigate('/event');
  };

  const handleConfirmClick = () => {
    navigate(`/booking/${eventId}`);
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${url}/event/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    fetchEventDetails();
  }, [eventId, url]);

  return (
    <div className='event-details-container'>
      <div className='top-event-details'>
        <div onClick={handleBackClick}>
          <img src='/assets/back.png' alt='' />
        </div>
        <div className='title'>Event Details</div>
      </div>
      {event ? (
          <div className='details-content'>
            <div className='event-details-img'>
              <img src= {`/assets/activity${event.id}.png`}alt='' className='each-event-image'/>
            </div>
            <div className='box'>
              <div className='text'>Event Name :</div>
              <input value={event.title} readOnly />
            </div>
            <div className='box'>
              <div className='text'>Category Event :</div>
              <input value={event.category} readOnly /> 
            </div>
            <div className='box'>
              <div className='text'>Location :</div>
              <input value={event.location} readOnly />
            </div>
            <div className='box'>
              <div className='text'>Date :</div>
              <input value={event.time} readOnly />
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      <div className='confirm-btn'>
        {event?(
          <button className={`confirm-different-${event.id}`} onClick={handleConfirmClick}>Confirm</button>
        ):(
          <div></div>
        )}
      </div>
      <Navbar />
    </div>
  )
}

export default EventDetails 