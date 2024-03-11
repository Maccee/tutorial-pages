import {
  HandleLogin,
  HandleRegister,
  decodeTokenName,
} from "@/utils/LoginUtils";
import React, { useState, useEffect } from "react";

export const Login = ({ setToken, setIsModalVisible, token }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Check for token in local storage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Муляж авторизации
    const dummyToken = "dummy-token";
    setToken(dummyToken); // Здесь мы "устанавливаем токен" (для муляжа)
    setIsModalVisible(false); // Сразу закрываем модальное окно
  };

  const toggleMode = () => setIsRegistering(!isRegistering);
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <div>
      <div className="w-full flex items-center justify-center pb-4 px-2 bg-white">
        {!token && (
          <form
            onSubmit={handleSubmit}
            className="space-y-2 w-full sm:w-full md:w-full lg:w-96 mx-auto"
          >
            <h2 className="text-3xl">{isRegistering ? "Register" : "Login"}</h2>
            {/* Username and Password Fields */}
            <div>
              <label htmlFor="username" className="block">
                Username
              </label>
              <div className="border-2 rounded-full px-3 py-2 flex items-center mt-2">
                <input
                  className="w-full outline-none"
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block">
                Password
              </label>
              <div className="border-2 rounded-full px-3 py-2 flex items-center mt-2">
                <input
                  className="w-full outline-none"
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Always rendered but visually hidden when not registering */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                isRegistering
                  ? "opacity-100 max-h-[500px]"
                  : "opacity-0 max-h-0"
              } overflow-hidden`}
            >
              <div>
                <label htmlFor="confirmPassword" className="block">
                  Confirm Password
                </label>
                <div className="mt-2 flex items-center px-3 py-2 border-2 rounded-3xl">
                  <input
                    className="w-full outline-none"
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={isRegistering}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-2">
              <button
                className="defaultButton"
                type="button"
                onClick={toggleMode}
              >
                {isRegistering ? "Back to Login" : "New User?"}
              </button>

              <button className="defaultButton" type="submit">
                {isRegistering ? "Register" : "Login"}
              </button>
            </div>
          </form>
        )}

        {token && (
          <div className="flex flex-col gap-2  items-center w-full">
            <div>Logged in as: User</div>
            <div>{decodeTokenName(token)}</div>
            <button className="defaultButton" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
