import React, { useState, useEffect } from 'react';
import './setTimeline.css';

function MessageBox({ message, onClose }) {
    return (
        <div className="message-box">
            <p>{message}</p>
            <button onClick={onClose}>OK</button>
        </div>
    );
}

function SetTimeline() {
    const [Description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timelines, setTimelines] = useState([]);
    const [timelinesVisible, setTimelinesVisible] = useState(true);
    const [editableTimelineId, setEditableTimelineId] = useState(null);
    const [updatedTimeline, setUpdatedTimeline] = useState({ description: '', startDate: '', endDate: '' });
    const [showMessage, setShowMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchTimelines();
    }, []);

    const fetchTimelines = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`/api/HiringTimeline/GetTimelinesForUser/${userId}`);
            const timelinesData = await response.json();
            setTimelines(timelinesData);
        } catch (error) {
            console.error('Error fetching timelines:', error);
        }
    };

    const addTimeline = async () => {
        const userId = localStorage.getItem('userId');
        const requestBody = {
            "Stages": [
                {
                    "Description": Description,
                    "StartTime": startTime,
                    "EndTime": endTime
                }
            ]
        };

        try {
            const response = await fetch(`/api/HiringTimeline/SetTimeline/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to add timeline');
            }
            setDescription('');
            setStartTime('');
            setEndTime('');

            // Show success message
            setSuccessMessage('Timeline added successfully');
            setShowMessage(true);

            // Refresh timelines after adding
            fetchTimelines();
        } catch (error) {
            console.error('Error adding timeline:', error);
        }
    };

    const handleMessageBoxClose = () => {
        setShowMessage(false);
        setSuccessMessage('');
    };

    const updateTimeline = async (stageId) => {
        const userId = localStorage.getItem('userId');
        // Implement updating timeline logic here
        try {
            const response = await fetch(`/api/HiringTimeline/UpdateTimelineStage/${userId}/${stageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Description: updatedTimeline.description,
                    StartTime: updatedTimeline.startDate, // Ensure this matches the expected format
                    EndTime: updatedTimeline.endDate // Ensure this matches the expected format
                  })
                  
            });

            if (!response.ok) {
                throw new Error('Failed to update timeline');
            }

            // Refresh timelines after updating
            fetchTimelines();
        } catch (error) {
            console.error('Error updating timeline:', error);
        }
    };

    const deleteTimeline = async (stageId) => {
        const userId = localStorage.getItem('userId');
        // Implement deleting timeline logic here
        try {
            const response = await fetch(`/api/HiringTimeline/DeleteTimelineStage/${userId}/${stageId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete timeline');
            }
            alert("Deleted Successfully!!");

            // Refresh timelines after deleting
            fetchTimelines();
        } catch (error) {
            console.error('Error deleting timeline:', error);
        }
    };

    const toggleTimelinesVisibility = () => {
        setTimelinesVisible(!timelinesVisible);
    };

    const handleEditClick = (timelineId) => {
        setEditableTimelineId(timelineId);
        const timelineToEdit = timelines.find(timeline => timeline.stageId === timelineId);
        // Convert the date format to "yyyy-MM-dd"
        const formattedStartDate = new Date(timelineToEdit.startTime).toISOString().split('T')[0];
        const formattedEndDate = new Date(timelineToEdit.endTime).toISOString().split('T')[0];

        setUpdatedTimeline({
            description: timelineToEdit.description,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        });
        
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTimeline(prevTimeline => ({
            ...prevTimeline,
            [name]: value,
          }));
          
    };

    return (
        <div className="admin-page">
            <div className="header">
                <h1>Set Timeline</h1>
                <div className="input-container">
                    <input type="text" value={Description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                    <div className="date-inputs">
                    <div className="input-group">
                        <label>Start Date:</label>
                        <input type="date" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>End Date:</label>
                        <input type="date" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                </div>
                </div>
                <button onClick={addTimeline}>Add Timeline</button>
                {showMessage && <MessageBox message={successMessage} onClose={handleMessageBoxClose} />}
            </div>
            <div className="section">
                <div className="section-title" onClick={toggleTimelinesVisibility}>
                    <span>Timelines</span>
                    <i className={`arrow ${timelinesVisible ? 'down' : 'up'}`}></i>
                </div>
                <div className={`section-content ${timelinesVisible ? '' : 'hidden-arrow'}`}>
                    {/* Render timelines here */}
                    {timelines.map(timeline => (
                          <div key={timeline.stageId} className="user-item">
                              {editableTimelineId === timeline.stageId ? (
                                  <>
                                      <input
                                          type="text"
                                          name="description"
                                          value={updatedTimeline.description}
                                          onChange={handleInputChange}
                                      />
                                      <input
                                            type="date"
                                            name="startTime"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            placeholder="Start Date"
                                        />
                                        <input
                                            type="date"
                                            name="endTime"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            placeholder="End Date"
                                        />
                                  </>
                              ) : (
                                  <>
                                      <div>{timeline.description}</div>
                                      <div>{new Date(timeline.startTime).toLocaleDateString()}</div>
                                      <div>{new Date(timeline.endTime).toLocaleDateString()}</div>
                                  </>
                              )}
                              <button onClick={() => {
                                  if (editableTimelineId === timeline.stageId) {
                                      updateTimeline(timeline.stageId);
                                      setEditableTimelineId(null);
                                  } else {
                                      handleEditClick(timeline.stageId);
                                  }
                              }}>
                                  {editableTimelineId === timeline.stageId ? 'Save' : 'Edit'}
                              </button>
                              <button onClick={() => deleteTimeline(timeline.stageId)}>Delete</button>
                          </div>
                      ))}

                </div>
            </div>
        </div>
    );
}

export default SetTimeline;
