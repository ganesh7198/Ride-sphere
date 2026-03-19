import { useState, useCallback, useRef } from "react";
import { validateSignup } from "../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../utils/Apipath";

function SignupForm() {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    profileImg: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;

    if (name === "profileImg") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        profileImg: file,
      }));

      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

 const handleSubmit = useCallback(
   async (e) => {
     e.preventDefault();

     const validationErrors = validateSignup(formData);

     if (Object.keys(validationErrors).length > 0) {
       setErrors(validationErrors);
       return;
     }

     setErrors({});

     try {
      
       const data = new FormData();
       data.append("username", formData.username);
       data.append("fullname", formData.fullname);
       data.append("email", formData.email);
       data.append("password", formData.password);
       data.append("profileImg", formData.profileImg); 

       const response = await axios.post(
         `${BASE_URL}${API_PATHS.AUTH.SIGNUP}`,
         data,
         {
           withCredentials: true,
           headers: {
             "Content-Type": "multipart/form-data",
           },
         }
       );

       console.log(response.data);

       if (response.data.success) {
         navigate("/");
       }
     } catch (error) {
       console.log(error);
       setErrors({
         api: error.response?.data?.message || "Signup failed",
       });
     }
   },
   [formData, navigate]
 );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl text-gray-800 text-center mb-2">
          Create account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Join RideSphere today
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-2">
              <div
                onClick={handlePhotoClick}
                className="w-28 h-28 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-all duration-200 bg-gray-50 flex items-center justify-center group"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-xs">Add photo</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                name="profileImg"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>

            <button
              type="button"
              onClick={handlePhotoClick}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {previewUrl ? "Change photo" : "Upload profile photo"}
            </button>

            {errors.profileImg && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.profileImg}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-gray-400"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-gray-400"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-gray-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-gray-800 text-white py-3 rounded-md text-base hover:bg-gray-700 transition mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-5">
          Already have an account?{" "}
          <span className="text-gray-800 font-medium">
            <Link to={"/login"}>Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;
