// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from "./components/WelcomePage";
import RegisterPage from './components/RegisterPage';
import VerificationPage from './components/VerificationPage';
import LoginPage from './components/LoginPage';
import ForgotPassowrd from './components/ForgotPassword';
import NewPassPage from './components/NewPassPage';
import UserHomePage from './UserHomePage';
import HrHomePage from './HrHomePage';
import RoleSelectionPage from './components/RoleSelectionPage';
import ApplicationPage from './ApplicationPage';
import ProfilePage from './ProfilePage';
import HiringPlanPage from './hiringPlan';
import UserProfileDisplay from './UserProfileDisplay';
import AdminPage from './admin';
import DefineNeedsPage from './components/DefineNeeds';
/*import SetTimelinePage from './SetTimeline';*/
import AdminLogin from './components/adminLogin';
import OpenPositionsPage from './openPositions';
import JobDetails from './jobDetails';
import HrProfileDisplay from './HrProfileDisplay';
import HRProfilePage from './HRProfilePage';
import UserHomeee from './components/UserHomeee';
import SetTimeline from './components/SetTimeline';
import HrProfile from './components/HrProfile';





const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/forgot-pass" element={<ForgotPassowrd />} />
        <Route path="/new-pass" element={<NewPassPage />} />
        <Route path='/userHome' element={<UserHomePage />} />
        <Route path='/userr' element={<UserHomeee/>}/>
        <Route path='/hrHome' element={<HrHomePage />} />
        <Route path='/role' element={<RoleSelectionPage/>}/>
        <Route path='/apply' element={<ApplicationPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/profileview' element={<UserProfileDisplay/>}/>
        <Route path='/adminP' element={<AdminPage />} />
        <Route path='/hiringPlan' element={<HiringPlanPage />} />
        <Route path='/define-needs' element={<DefineNeedsPage />} />
        <Route path='/setTimeline' element={<SetTimeline />} />
        <Route path='/openPositions' element={<OpenPositionsPage />} />
        <Route path='/job/:userId/:jobId' element={<JobDetails />} />
        <Route path='/profileviewhr' element={<HrProfileDisplay/>}/>
        <Route path='/profilehr' element={<HRProfilePage/>}/>
        <Route path='/hrprofile' element={<HrProfile/>}/>



      </Routes>
    </Router>
  );
};

export default App;