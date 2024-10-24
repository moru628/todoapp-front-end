import React,  { useEffect, useState } from 'react'
import './index.css'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../nav/Navbar';

const Booking = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
  
    const navigate = useNavigate();

    const url = process.env.REACT_APP_BACKEND_URL;
  
    const handleBackClick = () => {
          navigate(`/event/details/${eventId}`);
    };

    const handleTimeSelection = (time) => {
      setSelectedTime(time);
    };


  const handleBookingClick = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert("You must be logged in to book your ticket.");
      return;
    }
    try {
      const response = await axios.post(`${url}/booking`, {
        eventId: event.id,
        eventName: event.title,
        category: event.category,
        location: event.location,
        date: event.time,
        userName: userName,
        email: email,
        time: selectedTime,
      });
      console.log(response.data.message);
      navigate('/event');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
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
        <div className='title'>Details Order</div>
      </div>
        {event && 
          <div className='details-content'>
          <div className='event-details-img'>
            <img src= {`/assets/activity${event.id}.png`}alt='' className='each-event-image'/>
          </div>
          <div className='box'>
            <div className='text'>Name <span>*</span></div>
            <input 
              name='name'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className='box'>
            <div className='text'>Email <span>*</span></div>
            <input 
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> 
          </div>
          <div className='box'>
            <div className='text'>Choose Time<span>*</span></div>
          </div>
          <div className={`time-container time-${event.id}`}>
            {['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'].map((time) => (
              <div 
              key={time} 
              onClick={() => handleTimeSelection(time)} 
              className={selectedTime === time ? 'selected' : ''}
            >
              {time}
            </div>
          ))}
          </div>
        </div>
        }
      <div className='booking-btn'>
        {event?(
          <button className={`booking-different-${event.id}`} onClick={handleBookingClick}>Booking</button>
        ):(
          <div></div>
        )}
      </div>
      <Navbar />
    </div>
  )
}

export default Booking