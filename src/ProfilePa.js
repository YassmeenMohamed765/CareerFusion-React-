import React, { useState } from 'react';
import axios from 'axios'; // Import Axios at the top
import './styles.css';
import Navbar from "./Navbar";
const ProfilePag = () => {
  const [profile, setProfile] = useState({
    name: '',
    // Title: '',
    // photo:'',
    Projects: [{ id: Date.now(), name: '', url: '' }] ,// Initial project with a unique ID
    // Include other profile state fields as necessary
    Courses: [{ id: Date.now(), name: '' }], // Initialize Courses with one empty course
    Skills: [{ SkillId: Date.now(), SkillName: '', SkillLevel: '' }],
    SiteLinks: [{ SiteLinkId: Date.now(), LinkName: '', LinkUrl: '' }],
  });
  const [title, setTitle] = useState('');
  // const handleTextChange = (field) => (event) => {
  //   setProfile({ ...profile, [field]: event.target.value });
  // };
  const handlePhotoChange = (event) => {
    if (event.target.files[0]) {
      setProfile({ ...profile, photo: URL.createObjectURL(event.target.files[0]) });
    }
  };
  const handleProjectChange = (projectId, key, value) => {
    const newProjects = profile.Projects.map(project => 
      project.id === projectId ? { ...project, [key]: value } : project
    );
    setProfile({ ...profile, Projects: newProjects });
  };
  const handleAddSkill = () => {
    setProfile({
      ...profile,
      Skills: [...profile.Skills, { SkillId: Date.now() + Math.random(), SkillName: '', SkillLevel: '' }]
    });
  };

  const handleSkillChange = (SkillId, key, value) => {
    const newSkills = profile.Skills.map(skill => 
      skill.SkillId === SkillId ? { ...skill, [key]: value } : skill
    );
    setProfile({ ...profile, Skills: newSkills });
  };

  const handleAddSiteLink = () => {
    setProfile({
      ...profile,
      SiteLinks: [...profile.SiteLinks, { SiteLinkId: Date.now() + Math.random(), LinkName: '', LinkUrl: '' }]
    });
  };

  const handleSiteLinkChange = (SiteLinkId, key, value) => {
    const newSiteLinks = profile.SiteLinks.map(link => 
      link.SiteLinkId === SiteLinkId ? { ...link, [key]: value } : link
    );
    setProfile({ ...profile, SiteLinks: newSiteLinks });
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(), // Simple way to generate a unique ID; consider UUID for real applications
      name: '',
      url: ''
    };
    setProfile({
      ...profile,
      Projects: [...profile.Projects, newProject]
    });
  };

  const handleCourseChange = (courseId, value) => {
    const newCourses = profile.Courses.map(course => 
      course.id === courseId ? { ...course, name: value } : course
    );
    setProfile({ ...profile, Courses: newCourses });
  };

  const handleAddCourse = () => {
    const newCourse = {
      id: Date.now() + Math.random(), // Slightly improved uniqueness
      name: ''
    };
    setProfile({
      ...profile,
      Courses: [...profile.Courses, newCourse]
    });
  };
 

  const handleSaveProfile = async () => {
    const userId = localStorage.getItem('userId');
    const updateUrl = `/api/UserProfile/${userId}`;
  
    // Construct the request payload
    const payload = {
      Title: title,
      // ProjectLinks: profile.Projects.map(project => ({
      //   ProjectLinkId: project.id, // Assuming project.id in the frontend matches ProjectLinkId expected by the backend
      //   ProjectName: project.name,
      //   ProjectUrl: project.url,
      // })),
      // Courses: profile.Courses.map(course => ({
      //   CourseId: course.id, // Similar adjustment for course IDs
      //   CourseName: course.name,
      // })),
      // Skills: profile.Skills.map(skill => ({
      //   SkillId: skill.SkillId, // Ensure this matches the backend expectation
      //   SkillName: skill.SkillName,
      //   SkillLevel: skill.SkillLevel,
      // })),
      // SiteLinks: profile.SiteLinks.map(link => ({
      //   SiteLinkId: link.SiteLinkId, // Adjusting site link IDs
      //   LinkName: link.LinkName,
      //   LinkUrl: link.LinkUrl,
      // })),
    };
    console.log("Sending payload:", payload);

    try {

      const response = await axios.put(updateUrl, payload);
      if (response.status === 200) {
        alert('Profile updated successfully!');
        // Additional success handling here
      } else {
        console.error('Failed to update profile:', response.data);
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error);
      alert('Error updating profile. Check the console for more details.');
    }
  };
  
  
   

  return (
    <div>
        <Navbar userType="candidate" />
    <div className="profile-container">
        
      <div className="profile-photo">
      {/* <div className="profile-photo" onClick={() => document.getElementById('photo-upload').click()}> */}
        {profile.photo ? <img src={profile.photo} alt="Profile" /> : 'Click to upload photo'}
        <input type="file" id="photo-upload" onChange={handlePhotoChange} />
      </div>
      <div className="profile-info">
      
         <label htmlFor=" title">Job/Career</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job/Career"
        />
        
       {profile.Projects.map((project, index) => (
            <div className="section-content" key={project.id}>
              <label htmlFor={`projectName-${project.id}`}>Project Name{index + 1}:</label>
              <input
                type="text"
                id={`projectName-${project.id}`}
                value={project.name}
                onChange={(e) => handleProjectChange(project.id, 'name', e.target.value)}
                placeholder={`Enter project name`}
              />
              <label htmlFor={`projectUrl-${project.id}`}>Project URL {index + 1}:</label>
              <input
                type="text"
                id={`projectUrl-${project.id}`}
                value={project.url}
                onChange={(e) => handleProjectChange(project.id, 'url', e.target.value)}
                placeholder={`Enter project URL`}
              />
              {index === profile.Projects.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddProject}
                >
                  Add Another Project
                </button>
              )}
            </div>
          ))}
          {profile.Courses.map((course, index) => (
            <div className="section-content" key={course.id}>
              <label htmlFor={`courseName-${course.id}`}>Course Name {index + 1}:</label>
              <input
                type="text"
                id={`courseName-${course.id}`}
                value={course.name}
                onChange={(e) => handleCourseChange(course.id, e.target.value)}
                placeholder={`Enter course name`}
              />
              {index === profile.Courses.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddCourse}
                >
                  Add Another Course
                </button>
              )}
            </div>
          ))}
          {/* Skills Inputs */}
          {profile.Skills.map((skill, index) => (
            <div className="section-content" key={skill.SkillId}>
              <label htmlFor={`skillName-${skill.SkillId}`}>Skill Name {index + 1}:</label>
              <input
                type="text"
                id={`skillName-${skill.SkillId}`}
                value={skill.SkillName}
                onChange={(e) => handleSkillChange(skill.SkillId, 'SkillName', e.target.value)}
                placeholder={`Enter skill name`}
              />
              <label htmlFor={`skillLevel-${skill.SkillId}`}>Skill Level {index + 1}:</label>
              <input
                type="text"
                id={`skillLevel-${skill.SkillId}`}
                value={skill.SkillLevel}
                onChange={(e) => handleSkillChange(skill.SkillId, 'SkillLevel', e.target.value)}
                placeholder={`Enter skill level`}
              />
              {index === profile.Skills.length - 1 && (
                <button type="button" onClick={handleAddSkill}>Add Another Skill</button>
              )}
            </div>
          ))}

          {/* SiteLinks Inputs */}
          {profile.SiteLinks.map((link, index) => (
            <div className="section-content" key={link.SiteLinkId}>
              <label htmlFor={`linkName-${link.SiteLinkId}`}>Link Name {index + 1}:</label>
              <input
                type="text"
                id={`linkName-${link.SiteLinkId}`}
                value={link.LinkName}
                onChange={(e) => handleSiteLinkChange(link.SiteLinkId, 'LinkName', e.target.value)}
                placeholder={`Enter link name`}
              />
              <label htmlFor={`linkUrl-${link.SiteLinkId}`}>Link URL {index + 1}:</label>
              <input
                type="text"
                id={`linkUrl-${link.SiteLinkId}`}
                value={link.LinkUrl}
                onChange={(e) => handleSiteLinkChange(link.SiteLinkId, 'LinkUrl', e.target.value)}
                placeholder={`Enter link URL`}
              />
              {index === profile.SiteLinks.length - 1 && (
                <button type="button" onClick={handleAddSiteLink}>Add Another Link</button>
              )}
            </div>
          ))}
           {/* Save Button */}
        <div className="save-button-container">
          <button type="button" onClick={handleSaveProfile} className="save-profile-button">
            Save Changes
          </button>
        </div>
       
      </div>
    </div>
    </div>
  );
};

export default ProfilePag;
