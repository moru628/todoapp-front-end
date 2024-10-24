import React from 'react'
import { useState,useEffect } from 'react'
import './category.css'
import TaskDialog from '../TaskDialog/TaskDialog';
import axios from 'axios'

const Category = ({categories, userId}) => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [taskCounts, setTaskCounts] = useState({});
  const url = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchTaskCounts = async () => {
      if (!userId) return; 
      try {
        const response = await axios.get(`${url}/task/count?userId=${userId}`);
        console.log("Fetched task counts:", response.data);
        setTaskCounts(response.data.count);
      } catch (error) {
        console.error("Error fetching task count", error);
      }
    };
    fetchTaskCounts();
  }, [userId, url]);

  const handleClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleClose = () => {
    setSelectedCategory(null);
  };

  return (
<div className='container-scroll'>
    <div className='subtitle'>Plan Category</div>
    <div className='category-items'>
      {categories.map((category) => (
        <div key={category.id} onClick={() => handleClick(category)} className='click'>
          <div className={`item item-${category.name.toLowerCase()}`}>
            <img src={`/assets/${category.name.toLowerCase()}.png`}alt='' className='category-icon' />
            <div className='category-name'>{category.name}</div>
            <div className='category-task'>
              <img src='/assets/arrow.png' alt='' className='arrow-icon' />
              <div className='task-number'>{taskCounts[category.name] || 0} Tasks</div>
            </div>
            <div className='plus'>
              <img src='/assets/plus.png' alt='' className='plus-icon' />
            </div>
          </div>
        </div>
      ))}
    </div>
    {selectedCategory && (
      <TaskDialog selectedCategory={selectedCategory} handleClose={handleClose} />
    )}
</div>
  )
}

export default Category