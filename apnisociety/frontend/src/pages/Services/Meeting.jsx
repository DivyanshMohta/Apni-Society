import React, { useState } from "react";
import { TimeInput } from "@nextui-org/date-input";
import "./meeting.css";

const MeetingScheduler = () => {
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: { hour: 0, minute: 0, ampm: "AM" },  // Time as an object
    location: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      time: { ...formData.time, [name]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMeetings([...meetings, formData]);
    setFormData({ title: "", description: "", date: "", time: { hour: 0, minute: 0, ampm: "AM" }, location: "" });
  };

  return (
    <div className="scheduler-container">
      <h2>Meeting Scheduler</h2>
      <form onSubmit={handleSubmit} className="scheduler-form">
        <input
          type="text"
          name="title"
          placeholder="Meeting Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <div className="time-input">
          <input
            type="time"
            name="hour"
            value={formData.time.hour}
            onChange={handleTimeChange}
            placeholder="Hour"
            min=""
            max="12"
            required
          />
          <input
            type="number"
            name="minute"
            value={formData.time.minute}
            onChange={handleTimeChange}
            placeholder="Minute"
            min=""
            max="59"
            required
          />
          <select
            name="ampm"
            value={formData.time.ampm}
            onChange={handleTimeChange}
            required
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Meeting</button>
      </form>

      <div className="meeting-list">
        <h3>Upcoming Meetings</h3>
        {meetings.map((meeting, index) => (
          <div key={index} className="meeting-card">
            <h4>{meeting.title}</h4>
            <p>{meeting.description}</p>
            <p>
              <strong>Date:</strong> {meeting.date}
            </p>
            <p>
              <strong>Time:</strong> {`${meeting.time.hour}:${meeting.time.minute} ${meeting.time.ampm}`}
            </p>
            <p>
              <strong>Location:</strong> {meeting.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingScheduler;
