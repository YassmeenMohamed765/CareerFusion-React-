import Navbar from "./Navbar";
import './styles.css';

const HrHomePage = () => {
    return ( 
    <div className="user-home">
        <Navbar userType="hr" />
        <div className="welcome">
            <h1>Welcome Home!</h1>
        </div>
</div> );
}
 
export default HrHomePage;