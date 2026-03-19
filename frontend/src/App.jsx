import  {Route, Routes }from 'react-router-dom'
import LandingPage from '../pages/LandingPage';
import LoginForm from '../pages/LoginForm';
import SignupForm from '../pages/SignupForm';
import HomePage from '../pages/HomePage';
function App() {

  return (
    <>
   
     <Routes>
   <Route path='/*/' element={<LandingPage/>}></Route>
   <Route path='/login' element={<LoginForm></LoginForm>}></Route>
   <Route path='/sign' element={<SignupForm></SignupForm>}></Route>
   <Route path="/" element={<HomePage></HomePage>}></Route>

     </Routes>
    
    </>
  );
}

export default App;