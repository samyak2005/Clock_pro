import React, { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    date: ''
  });

  useEffect(() => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const date = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

      setTime({ hours, minutes, seconds, date });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="clock-container" className="section">
      <h1 className="day">{time.date}</h1>
      <div className="box">
        <div className="clock">
          <div className="front-clock">
            <div>{time.hours}</div>
            <p>hour</p>
          </div>
        </div>
        <div className="clock">
          <div className="front-clock">
            <div>{time.minutes}</div>
            <p>minute</p>
          </div>
        </div>
        <div className="clock">
          <div className="front-clock">
            <div>{time.seconds}</div>
            <p>seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clock; 