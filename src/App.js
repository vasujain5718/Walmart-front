import Home from './pages/Home'
import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ML from './pages/ML';
import Prod from './pages/Prod';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ml" element={<ML />} />
        <Route path="/prod" element={<Prod />} />
      </Routes>
    </Router>
  )
}

export default App