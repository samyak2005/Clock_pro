import React, { useState } from 'react';
import './App.css';
import Clock from './components/Clock';
import Timer from './components/Timer';
import Alarm from './components/Alarm';
import Stopwatch from './components/Stopwatch';
import WorldClock from './components/WorldClock';
import Pomodoro from './components/Pomodoro';

function App() {
  const [activeSection, setActiveSection] = useState('clock');

  const sections = {
    clock: <Clock />,
    timer: <Timer />,
    alarm: <Alarm />,
    stopwatch: <Stopwatch />,
    worldClock: <WorldClock />,
    pomodoro: <Pomodoro />
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li><button onClick={() => setActiveSection('clock')} className={activeSection === 'clock' ? 'active' : ''}>Clock</button></li>
          <li><button onClick={() => setActiveSection('timer')} className={activeSection === 'timer' ? 'active' : ''}>Timer</button></li>
          <li><button onClick={() => setActiveSection('alarm')} className={activeSection === 'alarm' ? 'active' : ''}>Alarm</button></li>
          <li><button onClick={() => setActiveSection('stopwatch')} className={activeSection === 'stopwatch' ? 'active' : ''}>Stopwatch</button></li>
          <li><button onClick={() => setActiveSection('worldClock')} className={activeSection === 'worldClock' ? 'active' : ''}>World Clock</button></li>
          <li><button onClick={() => setActiveSection('pomodoro')} className={activeSection === 'pomodoro' ? 'active' : ''}>Pomodoro</button></li>
        </ul>
      </nav>
      
      <main>
        {sections[activeSection]}
      </main>
    </div>
  );
}

export default App; 