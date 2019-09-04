import React from 'react';
import logo from './Lotus.png';
import './css/App.css';
import Head from './components/Head.js';

function App() {
  return (
    <div className="App">
      <Head></Head>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
