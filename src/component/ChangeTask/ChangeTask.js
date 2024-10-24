import React from 'react'
import { useState, useEffect } from 'react'
import './ChangeTask.css'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ChangeTask = ({selectedCategory,handleClose,taskToEdit, onTaskUpdate}) => {
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [dateStart, setDateStart] = useState('')
    const [dateEnd, setDateEnd] = useState('')
    const [description, setDescription] = useState('')
    const [formattedDateStart, setFormattedDateStart] = useState('');
    const [formattedDateEnd, setFormattedDateEnd] = useState('');
    const [showDropDown, setShowDropDown] = useState(false)
    const [showDropDownStatus, setShowDropDownStatus] = useState(false)
    const [selectedPriority, setSelectedPriority] = useState('Low')
    const [selectedStatus, setSelectedStatus] = useState('On track')

    const url = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        if (taskToEdit) {
          setName(taskToEdit.name || '');
          setTitle(taskToEdit.title || '');
          setDateStart(taskToEdit.dateStart || '');
          setDateEnd(taskToEdit.dateEnd || '');
          setDescription(taskToEdit.description || '');
          setSelectedPriority(taskToEdit.priority || 'Low');
          setSelectedStatus(taskToEdit.status || 'On track');
          setFormattedDateStart(taskToEdit.dateStart || '');
          setFormattedDateEnd(taskToEdit.dateEnd || '');
        }
      }, [taskToEdit]);

  const handleSubmit =  async(e) => {
    e.preventDefault()
    if (!name || !title || !dateStart || !selectedPriority) {
      alert("Please fill in all required fields.");
      return;
    }
    const userId = localStorage.getItem("userId");

    const formattedDateStart = new Date(dateStart).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const formattedDateEnd = dateEnd ? new Date(dateEnd).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '';

    const newTask = {
      name,
      category: selectedCategory.category,
      title,
      dateStart:formattedDateStart,
      dateEnd:formattedDateEnd,
      priority: selectedPriority,
      status: selectedStatus,
      description,
      userId
    }
    console.log("new task information", newTask)
    try{
        const response = await axios.put(`${url}/task/${taskToEdit._id}`,newTask)
        console.log("Task updated:", response.data);
        onTaskUpdate(response.data); 
        handleClose();
    }catch(error){
        console.error("Error updating task:", error);
        alert("There was an error updating the task.");
    }
  }

  const handleSelectedStatus = (status) => {
    setSelectedStatus(status)
    setShowDropDownStatus(false)
  }

  const handleSelectedPriority = (priority) => {
    setSelectedPriority(priority)
    setShowDropDown(false)
  }

  const handleDropDown = () => {
    setShowDropDown(!showDropDown)
  }

  const handleDropDownStatus = () => {
    setShowDropDownStatus(!showDropDownStatus)
  }

  const handleDateStartChange = (e) => {
      const selectedDate = e.target.value;
      setDateStart(selectedDate);

        // Format the date
        const date = new Date(selectedDate);
        const options = { day: 'numeric', month: 'short' };
        const formatted = date.toLocaleDateString('en-US', options);
        setFormattedDateStart(formatted);
  };

  const handleDateEndChange = (e) => {
    const selectedDate = e.target.value;
    setDateEnd(selectedDate);

      // Format the date
      const date = new Date(selectedDate);
      const options = { day: 'numeric', month: 'short' };
      const formatted = date.toLocaleDateString('en-US', options);
      setFormattedDateEnd(formatted);
};

    return(
            <Dialog
              open={!!selectedCategory}
              onClose={handleClose}
              fullWidth
              maxWidth='sm'
              scroll='body'
              PaperProps={{
                style: {
                  borderRadius: '10px 10px 0 0',
                  position: 'fixed',
                  bottom: 0,
                  transform: 'translateX(-50%)', 
                  margin: 0,
                  width: '100%',
                  height: '50vh',
                  overflowY: 'auto', 
                },
              }}
            >
              <DialogTitle>
                {selectedCategory ? selectedCategory.category : "Task Details"}
                <IconButton
                  aria-label='close'
                  onClick={handleClose}
                  style={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <div className='draft-title'>Draft plan brief</div>
                <form className="info-category" onSubmit={handleSubmit}>
                  <div className='info-content'>
                    <div className='title'>
                      Assignee
                    </div>
                    <div className='content'>
                      <input 
                        type="text"
                        name="name"
                        value={name}
                        placeholder="type your name"
                        onChange={(e) => setName(e.target.value)}/>
                    </div>
                  </div>
                  <div className='date-title'>
                      Due date
                    </div>
                  <div className='info-content'>
                    <div className='date-content'>
                     from {!formattedDateStart ? (
                        <input type="date" value={dateStart} onChange={handleDateStartChange} />
                      ) : (
                        <div onClick={() => setFormattedDateStart('')}>{formattedDateStart}</div>
                      )} 
                    </div>
                    <div className='date-content'>
                     to {!formattedDateEnd ? (
                        <input type="date" value={dateEnd} onChange={handleDateEndChange} />
                      ) : (
                        <div onClick={() => setFormattedDateEnd('')}>{formattedDateEnd}</div>
                      )} 
                    </div>
                  </div>
                  <div className='info-content'>
                    <div className='project-title'>
                      Title
                    </div>
                    <div className='content'>
                      <input
                        type='text' 
                        name='title'
                        placeholder="type brief project"
                        value={title}
                        onChange={(e) => {setTitle(e.target.value)}}
                      />
                    </div>
                  </div>
                  <div className='info-content'>
                    <div className='title'>
                      Fields
                    </div>
                    <div className='content'>
                      <table className="simple-table">
                        <tbody>
                          <tr>
                            <td className='fields-container'>
                              <img src='/assets/right-arrow.png' alt='' className='arrow-right-icon'/>
                              Priority
                            </td>
                            <td onClick={handleDropDown} className='priority-container'>
                              {!showDropDown && 
                              <div className='priority'>
                                <div className='priority-name'>
                                 {selectedPriority}
                                </div>
                                 <img src='/assets/chevron-down.png' alt='' className='chevron-down'/>
                              </div>
                              }
                       
                              {showDropDown && (
                                <div className='drop-down'>
                                  <ul>
                                    <li onClick={()=>handleSelectedPriority('Low')}>Low</li>
                                    <li onClick={()=>handleSelectedPriority('Medium')}>Medium</li>
                                    <li onClick={()=>handleSelectedPriority('High')}>High</li>
                                  </ul>
                                </div>
                              )}
                            </td>
                          </tr>
                          <tr>
                          <td className='fields-container'>
                              <img src='/assets/right-arrow.png' alt='' className='arrow-right-icon'/>
                              Status
                            </td>
                            <td onClick={handleDropDownStatus} className='status-container'>
                              {!showDropDownStatus && 
                              <div className='priority'>
                                <div className='priority-name'>
                                 {selectedStatus}
                                </div>
                                 <img src='/assets/chevron-down.png' alt='' className='chevron-down'/>
                              </div>
                              }
                       
                              {showDropDownStatus && (
                                <div className='drop-down'>
                                  <ul>
                                    <li onClick={()=>handleSelectedStatus ('On track')}>On track</li>
                                    <li onClick={()=>handleSelectedStatus('At risk')}>At risk</li>
                                    <li onClick={()=>handleSelectedStatus('Off track')}>Off track</li>
                                  </ul>
                                </div>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className='info-content-description'>
                    <div className='title'>
                      Description
                    </div>
                    <div className='content'>
                      <textarea 
                        type = "text"
                        name = "description"
                        value={description}
                        onChange={(e)=> setDescription(e.target.value)}
                        className='description-text'
                      />
                    </div>
                  </div>
                  <div className='info-content'>
                    <button className='btn-task-submit'>submit</button>
                  </div>
                </form>
    
              </DialogContent>
            </Dialog>
        )}

export default ChangeTask