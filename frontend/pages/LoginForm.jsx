import { useState, useCallback } from "react";
import { validateLogin } from "../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import axios from 'axios';
import { API_PATHS, BASE_URL } from "../utils/Apipath";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

const handleSubmit = useCallback(
  async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await axios.post(
        `${BASE_URL}${API_PATHS.AUTH.LOGIN}`,
        formData,
        { withCredentials: true }
      );

      console.log(response.data); 
      if(response.data.success===true){
         navigate("/");
      }
      
    } catch (error) {
      console.log(error.response?.data || error.message);
      setErrors({
        api: error.response?.data?.message || "Login failed",
      });
    }
  },
  [formData,navigate]
);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl text-gray-800 text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {errors.api && (
            <p className="text-red-500 text-sm text-center mb-3">
              {errors.api}
            </p>
          )}
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
            Login
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-5">
          Dont have an account?{" "}
          <span className="text-gray-800 font-medium">
            <Link to={"/sign"}>Sign up</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
