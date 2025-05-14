// LandingPage.jsx
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>Welcome to the Trip Planner</h1>
      <button onClick={() => navigate('/planner')}>Start Planning</button>
    </div>
  );
  
}

export default LandingPage;