import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CVEDetails from './pages/CVEDetails';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/cves/list" />} />
          <Route path="/cves/list" element={<Home />} />
          <Route path="/cves/:id" element={<CVEDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
