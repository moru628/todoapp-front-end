import React, { useState, useEffect} from 'react';
import Navbar from '../../nav/Navbar';
import './index.css'
import axios from 'axios';
import ChangeTask from '../../component/ChangeTask/ChangeTask';

const List = () => {
const [tasks, setTasks] = useState([])
const [profileImg, setProfileImg] = useState('')
const [selectedTask, setSelectedTask] = useState(null)
const [changeIcon, setChangeIcon] = useState(false)
const [selectedCategory, setSelectedCategory]= useState('')

const handleDropDown = ()=> {
  setChangeIcon(!changeIcon)
}

const handleTaskClick = (taskItem) => {
  setSelectedTask(taskItem)
}

const handleClose = () => {
  setSelectedTask(null);
};

const handleTaskUpdate = (updatedTask) => {
  setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
};

const fetchTaskData = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return; 
  try {
    const response = await axios.get(`http://localhost:5050/task?userId=${userId}`);
    setTasks(response.data);

    if (Array.isArray(response.data)) {
        setTasks(response.data);
    } else if (response.data.data) {
        setTasks(response.data.data);
    } else {
        console.error("Unexpected response format:", response.data);
        setTasks([]);
    }

    const user = await axios.get(`http://localhost:5050/user/${userId}`);
    setProfileImg(`http://localhost:5050/upload/${user.data.profileImg}`);
    localStorage.setItem('profileImg', user.data.profileImg);

  } catch (error) {
    console.error("Error fetching task data:", error);
  }
};

const deleteTask = async (taskId) => {
  try {
    await axios.delete(`http://localhost:5050/task/${taskId}`);
    setTasks(tasks.filter((task) => task._id !== taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setChangeIcon(false);
}

const filteredTasks = selectedCategory ? tasks.filter((task)=> task.category === selectedCategory) : tasks


useEffect(() => {
  fetchTaskData();
}, []);

const getDayAndMonth = (dateEnd) => {
  if (!dateEnd) return { day: '', month: '' };
  const [month, day] = dateEnd.split(' ');
  return { day, month };
}; 

  return (
   <div className='container-list'>
    <div className='title-task' onClick={handleDropDown}>
      <div className='line-task'>--</div>
      <div className='task'>TASK</div>
      <div className='line-task'>--</div>
      <div className="chevron-icon">
        {changeIcon ? (
            <img src='/assets/chevron-up.png' alt='' />
        ) : (
            <img src='/assets/chevron-down.png' alt='' />
        )}
      </div>
    </div>
    {changeIcon &&(
      <div className='drop-down-list'>
        <ul className='list-container'>
          <li onClick={() => handleCategoryClick('Work')}>Work</li>
          <li onClick={() => handleCategoryClick('Study')}>Study</li>
          <li onClick={() => handleCategoryClick('Pet')}>Pet</li>
          <li onClick={() => handleCategoryClick('Family')}>Family</li>
          <li onClick={() => handleCategoryClick('Play')}>Play</li>
          <li onClick={() => handleCategoryClick('')}>All</li>
        </ul>
      </div>
    )}
    <div className="box-container">
      {filteredTasks.length > 0 ? (
        filteredTasks.map((taskItem)=>{
        const { day, month } = getDayAndMonth(taskItem.dateEnd); 
        return(
          <div className='box-task' key={taskItem._id}>
          <div className='box-top'>
            <img src='/assets/check-circle.png' alt="" className='check-circle'/>
            <div className='box-title'>{taskItem.title}</div>
            <img
            src='/assets/x.png'
            alt=''
            className='x-icon'
            onClick={() => deleteTask(taskItem._id)} 
            />
          </div>
          <div onClick={() => handleTaskClick(taskItem)}>
            <div className='box-medium'>
              <div className='box-tag'>
                  <div className={`tag-1 ${taskItem.priority.toLowerCase()}`}>
                    {taskItem.priority}
                  </div>
                  <div className={`tag-2 ${taskItem.status.replace(/\s+/g, '-').toLowerCase()}`}>
                    {taskItem.status}
                  </div>
                </div>
            </div>
            <div className='box-bottom'>
                  <div className='profile-img'>
                    <img src={profileImg || '/assets/profile-blank.png'} alt='' className='profile-photo'/>
                  </div>
                  <div className='due-date'>
                    <div className='date-start'>{taskItem.dateStart}</div>
                    <div className='date-line'>-</div>
                    <div className='date-end'>{taskItem.dateEnd}</div>
                  </div>
            </div>
            <div className='box-date-day'>
              <div className='date-text-day'>{day}th</div>
            </div>
            <div className='box-date-month'>
              <div className='date-text-month'>{month.toUpperCase()}</div>
            </div>
          </div>
        </div>
        )}
      )
      ):(
        <div className='empty-task-container'>
        <img src='/assets/task-blank.png' alt='No tasks available' className='empty-task-image'/>
        <div className='empty-task-text'>Create your new task!</div>
      </div>
      )}
    </div>
    {selectedTask && (
      <ChangeTask 
      selectedCategory={selectedTask} 
      handleClose={handleClose}  
      taskToEdit={selectedTask} 
      onTaskUpdate={handleTaskUpdate} 
      />
    )}
    <Navbar />
   </div>
  );
}

export default List;
