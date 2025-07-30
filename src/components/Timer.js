import React, { useState, useEffect, useRef } from 'react';

function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputSeconds, setInputSeconds] = useState('');
  const [showStopButton, setShowStopButton] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const presetTimes = [
    { label: '5 min', seconds: 5 * 60 },
    { label: '10 min', seconds: 10 * 60 },
    { label: '15 min', seconds: 15 * 60 },
    { label: '30 min', seconds: 30 * 60 },
    { label: '1 hour', seconds: 60 * 60 },
    { label: '2 hours', seconds: 2 * 60 * 60 }
  ];

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            playAlarmSound();
            setShowStopButton(true);
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
  }, [isRunning, time]);

  const startTimer = () => {
    const seconds = parseInt(inputSeconds);
    if (isNaN(seconds) || seconds <= 0) {
      alert("Please enter a valid number.");
      return;
    }
    setTime(seconds);
    setIsRunning(true);
    setShowStopButton(false);
  };

  const startPresetTimer = (seconds) => {
    setTime(seconds);
    setIsRunning(true);
    setShowStopButton(false);
    setInputSeconds(seconds.toString());
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setInputSeconds('');
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

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div id="timer-container" className="section">
      <h1>Timer</h1>
      
      <div className="timer-display">{formatTime(time)}</div>
      
      <div className="timer-input-section">
        <input
          type="number"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(e.target.value)}
          placeholder="Enter seconds"
          className="timer-input"
        />
        <button onClick={startTimer} className="start-timer-btn">Start Timer</button>
      </div>

      <div className="preset-timers">
        <h3>Quick Start</h3>
        <div className="preset-buttons">
          {presetTimes.map((preset, index) => (
            <button
              key={index}
              onClick={() => startPresetTimer(preset.seconds)}
              className="preset-btn"
              disabled={isRunning}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="timer-controls">
        {isRunning ? (
          <button onClick={pauseTimer} className="pause-btn">Pause</button>
        ) : (
          <button onClick={startTimer} className="start-btn" disabled={!inputSeconds}>
            Start
          </button>
        )}
        <button onClick={resetTimer} className="reset-btn">Reset</button>
      </div>

      {showStopButton && (
        <button id="stop-timer-sound" onClick={stopSound}>
          Stop Sound
        </button>
      )}
      <audio ref={audioRef} loop>
        <source src="/MUSIC_Intaha_ho_gai.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
}

export default Timer; 