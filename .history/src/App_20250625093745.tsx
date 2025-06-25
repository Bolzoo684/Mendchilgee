import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateGreeting from './components/CreateGreeting';
import ViewGreeting from './components/ViewGreeting';
import QRDisplay from './components/QRDisplay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateGreeting />} />
        <Route path="/qr/:id" element={<QRDisplay />} />
        <Route path="/greeting/:id" element={<ViewGreeting />} />
      </Routes>
    </Router>
  );
}

export default App;