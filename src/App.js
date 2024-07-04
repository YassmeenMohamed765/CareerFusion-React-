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
/*import HiringPlan from './components/HiringPlan';*/
import UserProfileDisplay from './UserProfileDisplay';
import AdminPage from './components/AdminPage';
import DefineNeedsPage from './components/DefineNeeds';
/*import SetTimelinePage from './SetTimeline';*/
import AdminLogin from './components/adminLogin';
import OpenPositions from './components/OpenPositions';
import JobDetails from './components/JobDetails';
import HrProfileDisplay from './HrProfileDisplay';
import HRProfilePage from './HRProfilePage';
import UserHomeee from './components/UserHomeee';
import SetTimeline from './components/SetTimeline';
import HrProfile from './components/HrProfile';
import HrProfileView from './components/HrProfileView';
// import PostForm from './components/PostForm';
import Post from './components/Post';
import PostView from './components/PostView';
import PostDetail from './components/PostDetail'; 
import PostRecruitment from './components/PostRecruitment';
import SidebarLayout from './components/SidebarLayout';
import TelephoneInterview from './components/TelephoneInterview';
import AppraisalPage from './components/AppraisalPage';
import TelephoneForms from './components/TelphoneForms';
import AddTelQuestions from './components/AddTelQuestions';
import JobFormApplicants from './components/JobFormApplicants';
import SelectionProcess from './components/SelectionProcess';
import TelInterviewResults from './components/TelInterviewResults';
import TechSelProcess from './components/TechSelProcess';
import TechResults from './components/TechResults';
import ExistingCvs from './components/ExistingCvs';
import CVScreening from './components/CVScreeningJF';
import AdminView from './components/AdminView';



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
        <Route path='/define-needs' element={<DefineNeedsPage />} />
        <Route path='/setTimeline' element={<SetTimeline />} />
        <Route path='/openPositions' element={<OpenPositions />} />
        <Route path='/job/:userId/:jobId' element={<JobDetails />} />
        <Route path='/profileviewhr' element={<HrProfileDisplay/>}/>
        <Route path='/profilehr' element={<HRProfilePage/>}/>
        <Route path='/hrprofile' element={<HrProfile/>}/>
        <Route path='/hrprofileview' element={<HrProfileView/>}/>
        {/* <Route path='/postform'element={<PostForm/>}/> */}
        <Route path='/post'element={<Post/>}/>
        <Route path='/postview' element={<PostView/>}/>
        <Route path='/posts/:postId' element={<PostDetail />} /> {/* New Route for PostDetail */}
        <Route path='/Recruitment' element={<PostRecruitment/>}/>
        <Route path='/sidebar' element={<SidebarLayout/>}/>
        <Route path='/posts/:postId/sidebar' element={<SidebarLayout />} /> {/* New route for SidebarLayout */}
        <Route path='/TelephoneInterview' element={<TelephoneInterview/>}/>
        <Route path='/appraisal' element={<AppraisalPage/>}/>
        <Route path='/prepareForms' element={<TelephoneForms/>}/>
        <Route path='/add-questions/:userId/:jobId' element={<AddTelQuestions />} />
        <Route path='/applicants/:jobId' element={<JobFormApplicants />} />
        <Route path='/selecProcess' element={<SelectionProcess />} />
        <Route path='/telephone-interview-results' element={<TelInterviewResults />} />
        <Route path='/TechProcess' element={<TechSelProcess />} />
        <Route path='/techResults' element={<TechResults />} />
        <Route path='/existing-cvs' element={<ExistingCvs />} />
        <Route path='/cvScreening' element={<CVScreening />} />
        <Route path='/admin-view/:userId' element={<AdminView />} />
        

        



      </Routes>
    </Router>
  );
};

export default App;