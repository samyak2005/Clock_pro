import React, { useState, useEffect, useRef } from 'react';

function Alarm() {
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmMessage, setAlarmMessage] = useState('');
  const [showStopButton, setShowStopButton] = useState(false);
  const [alarmSet, setAlarmSet] = useState(null);
  const [selectedSound, setSelectedSound] = useState('gentle');
  const [snoozeTime, setSnoozeTime] = useState(5);
  const [showSnoozeButton, setShowSnoozeButton] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const alarmSounds = [
    { id: 'gentle', name: 'Gentle Wake', file: '/MUSIC_Intaha_ho_gai.mp3' },
    { id: 'nature', name: 'Nature Sounds', file: '/MUSIC_Intaha_ho_gai.mp3' },
    { id: 'digital', name: 'Digital Beep', file: '/MUSIC_Intaha_ho_gai.mp3' },
    { id: 'classic', name: 'Classic Alarm', file: '/MUSIC_Intaha_ho_gai.mp3' }
  ];

  const snoozeOptions = [
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' }
  ];

  useEffect(() => {
    if (alarmSet) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        if (now >= alarmSet) {
          clearInterval(intervalRef.current);
          playAlarmSound();
          setShowStopButton(true);
          setShowSnoozeButton(true);
          setAlarmSet(null);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [alarmSet]);

  const setAlarm = () => {
    if (!alarmTime) {
      alert("Please set a valid time.");
      return;
    }

    const [hours, minutes] = alarmTime.split(':').map(Number);
    const alarm = new Date();
    alarm.setHours(hours);
    alarm.setMinutes(minutes);
    alarm.setSeconds(0);

    // If the time has already passed today, set it for tomorrow
    if (alarm <= new Date()) {
      alarm.setDate(alarm.getDate() + 1);
    }

    setAlarmSet(alarm);
    setAlarmMessage(`Alarm set for ${alarm.toLocaleString()}`);
    setShowStopButton(false);
    setShowSnoozeButton(false);
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowStopButton(false);
    setShowSnoozeButton(false);
  };

  const snoozeAlarm = () => {
    const snoozeDate = new Date();
    snoozeDate.setMinutes(snoozeDate.getMinutes() + snoozeTime);
    
    setAlarmSet(snoozeDate);
    setAlarmMessage(`Alarm snoozed for ${snoozeTime} minutes`);
    setShowStopButton(false);
    setShowSnoozeButton(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const cancelAlarm = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setAlarmSet(null);
    setAlarmMessage('');
    setShowStopButton(false);
    setShowSnoozeButton(false);
  };

  return (
    <div id="alarm-container" className="section">
      <h1>Alarm</h1>
      
      <div className="alarm-setup">
        <div className="time-input-section">
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="alarm-time-input"
          />
          <button onClick={setAlarm} className="set-alarm-btn">Set Alarm</button>
        </div>

        <div className="alarm-options">
          <div className="sound-selection">
            <label>Alarm Sound:</label>
            <select 
              value={selectedSound} 
              onChange={(e) => setSelectedSound(e.target.value)}
              className="sound-select"
            >
              {alarmSounds.map(sound => (
                <option key={sound.id} value={sound.id}>
                  {sound.name}
                </option>
              ))}
            </select>
          </div>

          <div className="snooze-selection">
            <label>Snooze Time:</label>
            <select 
              value={snoozeTime} 
              onChange={(e) => setSnoozeTime(parseInt(e.target.value))}
              className="snooze-select"
            >
              {snoozeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="alarm-status">
        <div id="alarm-message">{alarmMessage}</div>
        {alarmSet && (
          <button onClick={cancelAlarm} className="cancel-alarm-btn">
            Cancel Alarm
          </button>
        )}
      </div>

      <div className="alarm-actions">
        {showStopButton && (
          <button id="stop-alarm-sound" onClick={stopSound}>
            Stop Sound
          </button>
        )}
        
        {showSnoozeButton && (
          <button onClick={snoozeAlarm} className="snooze-btn">
            Snooze ({snoozeTime} min)
          </button>
        )}
      </div>

      <audio ref={audioRef} loop>
        <source src="/MUSIC_Intaha_ho_gai.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
}

export default Alarm; 