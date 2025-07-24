import { Button } from '../index.js'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import {logout} from '../../store/authSlice.js'




const LogoutBtn = () => {
  const dispatch = useDispatch();

  const apiUrl = import.meta.env.VITE_API_URL;

  const logoutHandler = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/v1/users/logout`, {}, { withCredentials: true });
      if (response.status === 200) {
        dispatch(logout());
        console.log("Logout Successful");
      } else {
        console.log("Logout Failed");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <Button onClick={logoutHandler}>Logout</Button>
  );
}

export default LogoutBtn