import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/loginAuth/authThunks";

export default function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await dispatch(logoutUser()).unwrap();
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        navigate("/login", { replace: true });
      }
    };

    doLogout();
  }, [dispatch, navigate]);

  return <p className="text-center mt-10">Logging out...</p>;
}
