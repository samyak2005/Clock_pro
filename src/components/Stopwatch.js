import React, { useState, useEffect, useRef } from 'react';

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const startStopwatch = () => {
    setIsRunning(true);
  };

  const stopStopwatch = () => {
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setSeconds(0);
    setLaps([]);
  };

  const recordLap = () => {
    if (isRunning) {
      const lapTime = formatTime(seconds);
      setLaps(prevLaps => [...prevLaps, lapTime]);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div id="stopwatch-container" className="section">
      <h1>Stopwatch</h1>
      <div id="stopwatch-display">{formatTime(seconds)}</div>
      <div>
        <button onClick={startStopwatch}>Start</button>
        <button onClick={stopStopwatch}>Stop</button>
        <button onClick={recordLap}>Lap</button>
        <button onClick={resetStopwatch}>Reset</button>
      </div>
      <div id="lap-times">
        {laps.length > 0 && (
          <ul>
            {laps.map((lap, index) => (
              <li key={index}>Lap {index + 1}: {lap}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Stopwatch; 