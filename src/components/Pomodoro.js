import React, { useState, useEffect, useRef } from 'react';

function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showStopButton, setShowStopButton] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const sessionConfig = {
    work: { time: 25 * 60, label: 'Work Session' },
    shortBreak: { time: 5 * 60, label: 'Short Break' },
    longBreak: { time: 15 * 60, label: 'Long Break' }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            playAlarmSound();
            setShowStopButton(true);
            handleSessionComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const startSession = (type) => {
    setSessionType(type);
    setTimeLeft(sessionConfig[type].time);
    setIsRunning(true);
    setShowStopButton(false);
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resetSession = () => {
    setIsRunning(false);
    setTimeLeft(sessionConfig[sessionType].time);
    setShowStopButton(false);
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowStopButton(false);
  };

  const playAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleSessionComplete = () => {
    if (sessionType === 'work') {
      setSessionsCompleted(prev => prev + 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getNextSessionType = () => {
    if (sessionType === 'work') {
      return sessionsCompleted % 4 === 3 ? 'longBreak' : 'shortBreak';
    }
    return 'work';
  };

  const startNextSession = () => {
    const nextType = getNextSessionType();
    startSession(nextType);
  };

  return (
    <div id="pomodoro-container" className="section">
      <h1>Pomodoro Timer</h1>
      
      <div className="pomodoro-display">
        <div className="session-info">
          <h2>{sessionConfig[sessionType].label}</h2>
          <div className="sessions-completed">
            Sessions completed: {sessionsCompleted}
          </div>
        </div>
        
        <div className="timer-display">{formatTime(timeLeft)}</div>
        
        <div className="pomodoro-controls">
          {!isRunning ? (
            <button onClick={() => startSession(sessionType)} className="start-btn">
              Start {sessionConfig[sessionType].label}
            </button>
          ) : (
            <button onClick={pauseSession} className="pause-btn">
              Pause
            </button>
          )}
          
          <button onClick={resetSession} className="reset-btn">
            Reset
          </button>
        </div>
      </div>

      <div className="session-buttons">
        <button 
          onClick={() => startSession('work')}
          className={`session-btn ${sessionType === 'work' ? 'active' : ''}`}
        >
          Work (25min)
        </button>
        <button 
          onClick={() => startSession('shortBreak')}
          className={`session-btn ${sessionType === 'shortBreak' ? 'active' : ''}`}
        >
          Short Break (5min)
        </button>
        <button 
          onClick={() => startSession('longBreak')}
          className={`session-btn ${sessionType === 'longBreak' ? 'active' : ''}`}
        >
          Long Break (15min)
        </button>
      </div>

      {timeLeft === 0 && (
        <div className="session-complete">
          <h3>Session Complete!</h3>
          <button onClick={startNextSession} className="next-session-btn">
            Start Next Session
          </button>
        </div>
      )}

      {showStopButton && (
        <button id="stop-pomodoro-sound" onClick={stopSound}>
          Stop Sound
        </button>
      )}
      
      <audio ref={audioRef} loop>
        <source src="/MUSIC_Intaha_ho_gai.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
}

export default Pomodoro; 