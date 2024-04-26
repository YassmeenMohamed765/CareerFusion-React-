import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios at the top
import './styles.css';
import Navbar from "./Navbar";
import { Link } from 'react-router-dom';
// const BACKEND_BASE_URL = "https://careerfus.azurewebsites.net";
const ProfilePage = () => {
  const [profile, setProfile] = useState({
    title: '',
     photo:'',
     fullName: '', 
    Projects: [{ name: '', url: '' , projectLinkId: null }] ,
    // Include other profile state fields as necessary
    Courses: [{  name: '',courseId: null }], // Initialize Courses with one empty course
    Skills: [{  SkillName: '', SkillLevel: '',skillId: null }],
    SiteLinks: [{  LinkUrl: '',linkId: null }],
  });
  const [showProjects, setShowProjects] = useState(false); // State to toggle projects visibility
  const [showCourses, setShowCourses] = useState(false);
const [showSkills, setShowSkills] = useState(false);
const [showSiteLinks, setShowSiteLinks] = useState(false);


  
  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.get(`/api/UserProfile/${userId}`);
      const {
        title,
        projectLinks,
        fullName, 
        courses,
        skills,
        siteLinks
      } = response.data;
  
      setProfile(prevState => ({
        ...prevState,
        title: title || '',
        fullName: fullName || '',
        Projects: projectLinks.length > 0 ? projectLinks.map(pl => ({ name: pl.projectName, url: pl.projectUrl,
          projectLinkId: pl.projectLinkId })) : [{ name: '', url: '' , projectLinkId: null}],
        Courses: courses.length > 0 ? courses.map(course => ({ name: course.courseName,courseId: course.courseId,  })) : [{ name: '', courseId: null }],
        Skills: skills.length > 0 ? skills.map(skill => ({ SkillName: skill.skillName, SkillLevel: skill.skillLevel,skillId: skill.skillId, })) : [{ SkillName: '', SkillLevel: '', skillId: null }],
        SiteLinks: siteLinks.length > 0 ? siteLinks.map(link => ({  LinkUrl: link.linkUrl , linkId: link.linkId,})) : [{ LinkName: '', LinkUrl: '', linkId: null }],
      }));
      // Fetch profile picture
      const photoResponse = await axios.get(`/api/UserProfile/${userId}/profile-picture`);
      if (photoResponse.status === 200 && photoResponse.data.profilePictureUrl) {
        setProfile(prevState => ({
          ...prevState,
          photo: photoResponse.data.profilePictureUrl
        }));
        console.log(`Retrieved image URL: ${photoResponse.data.profilePictureUrl}`);
      }
    } catch (error) {
      console.error('Failed to fetch user profile or profile picture:', error);
    }
  };
  

  useEffect(() => {
    fetchUserProfile();
  }, []); // Empty dependency array ensures this runs once on mount

 
  
  
 

  

  return (
    <div>
      <Navbar userType="candidate" />
      <div className="display-profile-container">
      <div className="display-profile-photo">
  {profile.photo ? (
    <img src={profile.photo} alt="Profile" />
  ) : (
    <div className="default-profile-pic">
      <i className="fa-solid fa-user"></i> {/* FontAwesome user icon */}
      {/* Or use text like the user's initials (if available) */}
    </div>
  )}
</div>
        <div className="display-profile-info">
          <h2>{profile.fullName}</h2>
          {profile.title ? <p>Job/Career: {profile.title}</p> : <p></p>}

          <div className="section">
  <div className="section-title" onClick={() => setShowProjects(!showProjects)}>
    <i className="fa-solid fa-briefcase"></i> {/* Icon for Projects */}
    <span>Projects</span>
    <i className={`arrow ${showProjects ? 'up' : 'down'}`}></i>
  </div>
  {showProjects && (
  <div className="section-content">
     {(profile.Projects.length === 0 || profile.Projects.every(p => !p.name && !p.url)) ? (
      <p>No projects yet</p>
    ) : (
      <ul className="projects-list">
        {profile.Projects.map((project, index) => (
          <li key={index}>
           <p>{project.name}: <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a></p>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

</div>

         {/* Courses Section */}
<div className="section">
  <div className="section-title" onClick={() => setShowCourses(!showCourses)}>
    <i className="fa-solid fa-book"></i> {/* Adjust icon as needed */}
    <span>Courses</span>
    <i className={`arrow ${showCourses ? 'up' : 'down'}`}></i>
  </div>
  {showCourses && (
    <div className="section-content">
     {profile.Courses.length === 0 || profile.Courses.every(course => !course.name) ? (
        <p>No courses yet</p>
      ) : (
        profile.Courses.map((course, index) => (
          <p key={index}>{course.name}</p>
        ))
      )}
    </div>
  )}
</div>

{/* Skills Section */}
<div className="section">
  <div className="section-title" onClick={() => setShowSkills(!showSkills)}>
    <i className="fa-solid fa-star"></i> {/* Adjust icon as needed */}
    <span>Skills</span>
    <i className={`arrow ${showSkills ? 'up' : 'down'}`}></i>
  </div>
  {showSkills && (
    <div className="section-content">
      {profile.Skills.length === 0 || profile.Skills.every(skill => !skill.SkillName) ? (
        <p>No skills yet</p>
      ) : (
        profile.Skills.map((skill, index) => (
          <p key={index}>{`${skill.SkillName} (Level: ${skill.SkillLevel})`}</p>
        ))
      )}
    </div>
  )}
</div>

{/* SiteLinks Section */}
<div className="section">
  <div className="section-title" onClick={() => setShowSiteLinks(!showSiteLinks)}>
    <i className="fa-solid fa-link"></i> {/* Adjust icon as needed */}
    <span>Site Links</span>
    <i className={`arrow ${showSiteLinks ? 'up' : 'down'}`}></i>
  </div>
  {showSiteLinks && (
    <div className="section-content">
      {profile.SiteLinks.length === 0 || profile.SiteLinks.every(link => !link.LinkUrl) ? (
        <p>No site links yet</p>
      ) : (
        profile.SiteLinks.map((link, index) => (
          <a key={index} href={link.LinkUrl} target="_blank" rel="noopener noreferrer">{link.LinkUrl}</a>
        ))
      )}
    </div>
  )}
</div>

          <Link to="/profile" className="display-edit-profile-link">Edit Profile</Link>
        </div>
      </div>
    </div>
  )};
  
export default ProfilePage;