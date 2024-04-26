import React, { useRef ,useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios at the top
import './styles.css';
import Navbar from "./Navbar";
const BACKEND_BASE_URL = "https://jobcareer.azurewebsites.net";
const ProfilePage = () => {
  const [profile, setProfile] = useState({
    title: '',
    description: '',
    address: '',
     photo:'',
     fullName: '', 
    Projects: [{ name: '', url: '' , projectLinkId: null }] ,
    // Include other profile state fields as necessary
    Courses: [{  name: '',courseId: null }], // Initialize Courses with one empty course
    Skills: [{  SkillName: '', SkillLevel: '',skillId: null }],
    SiteLinks: [{  LinkUrl: '',linkId: null }],
    
  });
  const fileInputRef = useRef(null); // Step 1: Create a ref for the file input

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Step 3: Simulate click on file input
};
  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.get(`/api/UserProfile/${userId}`);
      const {
        title,
        projectLinks,
        description,
        address,
        fullName, 
        courses,
        skills,
        siteLinks
      } = response.data;
  
      setProfile(prevState => ({
        ...prevState,
        title: title || '',
        description:description || '',
        address: address ||'',
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

  const handleTextChange = (field) => (event) => {
    setProfile({ ...profile, [field]: event.target.value });
  };
  function isFullyQualifiedUrl(url) {
    return url.startsWith('http://') || url.startsWith('https://');
  }
  
  const handlePhotoChange = async (event) => {
    if (event.target.files[0]) {
        const file = event.target.files[0];
        const userId = localStorage.getItem('userId');
        const uploadUrl = `/api/UserProfile/upload-profile-picture/${userId}`;
        
        // Create FormData object and append the file
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            // Make the POST request to upload the profile picture
            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

                    if (response.status === 200) {
                      alert('Profile picture uploaded successfully!');
                      const imagePath = isFullyQualifiedUrl(response.data.imagePath)
                        ? response.data.imagePath
                        : BACKEND_BASE_URL + response.data.imagePath;
                      setProfile(prevState => ({
                        ...prevState,
                        photo: imagePath
                }));
            } else {
                alert('Failed to upload profile picture.');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Error uploading profile picture. Check the console for more details.');
        }
    }
};

  const handleProjectChange = (index, key, value) => {
    const newProjects = profile.Projects.map((project, idx) => 
      idx === index ? { ...project, [key]: value } : project
    );
    setProfile({ ...profile, Projects: newProjects });
  };
  const handleAddSkill = () => {
    const newSkill = {
        SkillName: '',
        SkillLevel: '',
        skillId: null, // Explicitly set to null for new skills
    };
    setProfile({
        ...profile,
        Skills: [...profile.Skills, newSkill]
    });
};

  const handleSkillChange = (index, key, value) => {
    const newSkills = profile.Skills.map((skill, i) => 
      i === index ? { ...skill, [key]: value } : skill
    );
    setProfile({ ...profile, Skills: newSkills });
  };

  const handleAddSiteLink = () => {
    const newSiteLink = {
       
        LinkUrl: '',
        linkId: null, // Explicitly set to null for new site links
    };
    setProfile({
        ...profile,
        SiteLinks: [...profile.SiteLinks, newSiteLink]
    });
};


  const handleSiteLinkChange = (index, key, value) => {
    const newSiteLinks = profile.SiteLinks.map((link, i) => 
      i === index ? { ...link, [key]: value } : link
    );
    setProfile({ ...profile, SiteLinks: newSiteLinks });
  };

  const handleAddProject = () => {
    const newProject = {
        name: '',
        url: '',
        projectLinkId: null, // Correctly set for new projects
    };
    setProfile({
        ...profile,
        Projects: [...profile.Projects, newProject]
    });
};

  const handleCourseChange = (index, value) => {
    const newCourses = profile.Courses.map((course, i) => 
      i === index ? { ...course, name: value } : course
    );
    setProfile({ ...profile, Courses: newCourses });
  };

  const handleAddCourse = () => {
    const newCourse = {
      name: '',
      courseId: null,
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
   // Initialize requestBody with dynamic construction for simple fields
  let requestBody = {
    ...(profile.title && { Title: profile.title }), // Include Title only if it's provided
    ...(profile.description && { Description: profile.description }), // Include Title only if it's provided
    ...(profile.address && { Address: profile.address }), // Include Title only if it's provided
  };

  if (profile.Projects.some(project => (project.name || project.url) && project.projectLinkId === null)) {
    requestBody.ProjectLinks = profile.Projects
      .filter(project => (project.name || project.url) && project.projectLinkId === null) // Include only new projects with entered data
      .map(project => ({
        ProjectName: project.name,
        ProjectUrl: project.url,
      }));
}

  // Include only new courses (those with courseId === null)
  if (profile.Courses.some(course => course.name && course.courseId === null)) {
    requestBody.Courses = profile.Courses
        .filter(course => course.name && course.courseId === null)
        .map(course => ({
            CourseName: course.name,
        }));
}

  // New Skills
  if (profile.Skills.some(skill => (skill.SkillName || skill.SkillLevel) && skill.skillId === null)) {
    requestBody.Skills = profile.Skills
        .filter(skill => (skill.SkillName || skill.SkillLevel) && skill.skillId === null)
        .map(skill => ({
            SkillName: skill.SkillName,
            SkillLevel: skill.SkillLevel,
        }));
}

  // New SiteLinks
  if (profile.SiteLinks.some(link => (link.LinkName || link.LinkUrl) && link.linkId === null)) {
    requestBody.SiteLinks = profile.SiteLinks
        .filter(link => (link.LinkName || link.LinkUrl) && link.linkId === null)
        .map(link => ({
            LinkName: link.LinkName,
            LinkUrl: link.LinkUrl,
        }));
}
    console.log("Sending data:",requestBody);

    try {

      const response = await axios.put(updateUrl, requestBody);
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
  const handleDeleteProject = async (projectLinkId) => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.delete(`/api/UserProfile/${userId}/projectlinks/${projectLinkId}`);
      alert('Project deleted successfully!');
      // Remove the project from the local state to update the UI
      setProfile(prevState => {
        const updatedProjects = prevState.Projects.filter(project => project.projectLinkId !== projectLinkId);
  
        // If all projects are deleted, add an empty project field
        if (updatedProjects.length === 0) {
          updatedProjects.push({ name: '', url: '', projectLinkId: null });
        }
  
        return { ...prevState, Projects: updatedProjects };
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Check the console for more details.');
    }
  };
  const handleDeleteCourse = async (courseId) => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.delete(`/api/UserProfile/${userId}/courses/${courseId}`);
      alert('Course deleted successfully!');
      setProfile(prevState => {
        const updatedCourses = prevState.Courses.filter(course => course.courseId !== courseId);
    
        // If all courses are deleted, add an empty course field
        if (updatedCourses.length === 0) {
          updatedCourses.push({ name: '', courseId: null });
        }
    
        return { ...prevState, Courses: updatedCourses };
      });
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course. Check the console for more details.');
    }
  };
  const handleDeleteSkill = async (skillId) => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.delete(`/api/UserProfile/${userId}/skills/${skillId}`);
      alert('Skill deleted successfully!');
      setProfile(prevState => {
        const updatedSkills = prevState.Skills.filter(skill => skill.skillId !== skillId);
  
        // If all skills are deleted, add an empty skill field
        if (updatedSkills.length === 0) {
          updatedSkills.push({ SkillName: '', SkillLevel: '', skillId: null });
        }
  
        return { ...prevState, Skills: updatedSkills };
      });
    } catch (error) {
      console.error('Failed to delete skill:', error);
      alert('Failed to delete skill. Check the console for more details.');
    }
  };
  const handleDeleteSiteLink = async (LinkId) => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.delete(`/api/UserProfile/${userId}/sitelinks/${LinkId}`);
      alert('Site link deleted successfully!');
      setProfile(prevState => {
        const updatedSiteLinks = prevState.SiteLinks.filter(siteLink => siteLink.linkId !== LinkId);
  
        // If all site links are deleted, add an empty site link field
        if (updatedSiteLinks.length === 0) {
          updatedSiteLinks.push({ LinkUrl: '', linkId: null });
        }
  
        return { ...prevState, SiteLinks: updatedSiteLinks };
      });
    } catch (error) {
      console.error('Failed to delete site link:', error);
      alert('Failed to delete site link. Check the console for more details.');
    }
  };
  

  return (
    <div>
        <Navbar userType="hr" />
    <div className="profile-container">
    
      <div className="profile-photo">
      
        {profile.photo ? <img src={`${profile.photo}?${new Date().getTime()}`} alt="Profile" />: 'Click to upload photo'}
        
        <input type="file" id="photo-upload" ref={fileInputRef} onChange={handlePhotoChange} />
      </div>
     
       {/* Display fullName under the profile photo */}
       {profile.fullName && <div className="profile-fullName">{profile.fullName}</div>}
       <div>
        <button onClick={handleButtonClick} className="display-edit-profile-link">Upload Photo</button>
      </div>
      <div className="profile-info">
      
         <label htmlFor=" title">Job/Career</label>
        <input 
          type="text" 
          value={profile.title} 
          onChange={handleTextChange('title')} 
          placeholder="Enter Your Job/Career"
        />
        <label htmlFor=" description">Description</label>
        <input 
          type="text" 
          value={profile.description} 
          onChange={handleTextChange('description')} 
          placeholder="Enter Your Description"
        />
        <label htmlFor=" address">Address</label>
        <input 
          type="text" 
          value={profile.address} 
          onChange={handleTextChange('address')} 
          placeholder="Enter Your address"
        />
      
        {profile.Projects.map((project, index) => (
            <div className="section-content" key={index}>

              <label htmlFor={`projectName-${index}`}>Project{index + 1} Name :</label>
              <div className="input-icon-container">
              <input
                type="text"
                className="project-name-input"
                id={`projectName-${index}`}
                value={project.name}
                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                placeholder={`Enter project name`}
              />
              {project.projectLinkId && (
                    <i 
                      className="fas fa-trash delete-icon" 
                      onClick={() => handleDeleteProject(project.projectLinkId)}
               ></i>)}
               </div>
              <label htmlFor={`projectUrl-${index}`}>Project{index + 1} URL :</label>
              <input
                type="text"
                id={`projectUrl-${index}`}
                value={project.url}
                onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                placeholder={`Enter project URL`}
              />
              {index === profile.Projects.length - 1 && (
                <button type="button" onClick={handleAddProject}>Add Another Project</button>
              )}
              
            
            </div>
          ))}

          
          {profile.Courses.map((course, index) => (
            <div className="section-content" key={index}>
              <label htmlFor={`courseName-${index}`}>Course{index + 1} Name :</label>
              <div className="input-icon-container">
              <input
                type="text"
                id={`courseName-${index}`}
                className="project-name-input"
                value={course.name}
                onChange={(e) => handleCourseChange(index, e.target.value)}
                placeholder={`Enter course name`}
              />
              {course.courseId && (
                    <i 
                      className="fas fa-trash delete-icon" 
                      onClick={() => handleDeleteCourse(course.courseId)}
                    ></i>
                  )}
                </div>
              {index === profile.Courses.length - 1 && (
                <button type="button" onClick={handleAddCourse}>Add Another Course</button>
              )}
            </div>
          ))}
          {/* Skills Inputs */}
          {profile.Skills.map((skill, index) => (
            <div className="section-content" key={index}>
              <label htmlFor={`skillName-${index}`}>Skill{index + 1} Name :</label>
              <div className="input-icon-container">
              <input
                type="text"
                id={`skillName-${index}`}
                className="project-name-input"
                value={skill.SkillName}
                onChange={(e) => handleSkillChange(index, 'SkillName', e.target.value)}
                placeholder={`Enter skill name`}
              />
               {skill.skillId && (
                <i
                  className="fas fa-trash delete-icon"
                  onClick={() => handleDeleteSkill(skill.skillId)}
                ></i>
              )}
              </div>
              <label htmlFor={`skillLevel-${index}`}>Skill{index + 1} Level :</label>
              <input
                type="text"
                id={`skillLevel-${index}`}
                value={skill.SkillLevel}
                onChange={(e) => handleSkillChange(index, 'SkillLevel', e.target.value)}
                placeholder={`Enter skill level`}
              />
              {index === profile.Skills.length - 1 && (
                <button type="button" onClick={handleAddSkill}>Add Another Skill</button>
              )}
            </div>
          ))}
          {/* SiteLinks Inputs */}
          {profile.SiteLinks.map((link, index) => (
            <div className="section-content" key={index}>
              <label htmlFor={`linkUrl-${index}`}>Link{index + 1} URL :</label>
              <div className="input-icon-container">
              <input
                type="text"
                id={`linkUrl-${index}`}
                value={link.LinkUrl}
                className="project-name-input"
                onChange={(e) => handleSiteLinkChange(index, 'LinkUrl', e.target.value)}
                placeholder={`Enter link URL`}
              />
              {link.linkId && (
        <i
          className="fas fa-trash delete-icon"
          onClick={() => handleDeleteSiteLink(link.linkId)}
        ></i>
      )}
      </div>
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

export default ProfilePage;