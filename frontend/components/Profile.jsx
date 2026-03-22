import ProfileHeader from '../cards/ProfileHeader'
import { useParams } from "react-router-dom";
function Profile (){
	const { id } = useParams();
	return <>
	<ProfileHeader userId={id}></ProfileHeader>
	
	</>
}

export default Profile;