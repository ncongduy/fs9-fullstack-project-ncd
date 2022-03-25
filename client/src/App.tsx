import { Routes, Route } from 'react-router-dom';

import Topbar from './components/Topbar';
import HomePage from './pages/HomePage';

function App() {
  return (
    <>
      <Topbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
