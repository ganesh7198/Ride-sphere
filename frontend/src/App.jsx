import { Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginForm from "../pages/LoginForm";
import SignupForm from "../pages/SignupForm";
import HomePage from "../pages/HomePage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../components/MainLayout";
import DetailedRideCard from "../cards/detailedRideCard";
import Profile from "../components/Profile";
import MyProfile from "../pages/MyProfile";
import AllPost from "../components/AllPost";
import PostSection from "../components/PostSection";

function App() {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  const PublicRoute = ({ children }) => {
    return user ? <Navigate to="/home" /> : children;
  };  
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />

      <Route
        path="/sign"
        element={
          <PublicRoute>
            <SignupForm />
          </PublicRoute>
        }
      />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MainLayout></MainLayout>
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage></HomePage>}></Route>
        <Route path="ride/:id" element={<DetailedRideCard></DetailedRideCard>}></Route>
        <Route path="profile/:id" element={<Profile></Profile>}></Route>
        <Route path="myprofile" element={<MyProfile></MyProfile>}></Route>
        <Route path="post/:id" element={<PostSection></PostSection>}></Route>
        
      </Route>
    </Routes>
  );
}

export default App;
