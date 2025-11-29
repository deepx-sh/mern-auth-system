
import { useContext, useEffect } from 'react';
import LandingPage from './LandingPage';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';



const Home = () => {

  const { isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) return;

    const hasSeenLanding = sessionStorage.getItem("landingSeen");

    if (!hasSeenLanding) {
      navigate("/dashboard", { replace: true });
    }
  },[isLoggedIn,navigate])
  return (
    <LandingPage />
  );
}

export default Home