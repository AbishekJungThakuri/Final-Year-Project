// src/pages/GoogleCallbackPage.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { googleCallback } from "../../features/auth/loginAuth/authThunks";

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      // Notify parent and close
      if (window.opener) {
        window.opener.postMessage({ type: "OAUTH_ERROR", error }, "*");
        window.close();
      }
      return;
    }

    if (code) {
      if (sessionStorage.getItem("google_callback_done")) return;
      sessionStorage.setItem("google_callback_done", "true");

      dispatch(googleCallback(code))
        .unwrap()
        .then(() => {
          if (window.opener) {
            window.opener.postMessage({ type: "OAUTH_SUCCESS" }, "*");
            window.close();
          }
        })
        .catch((err) => {
          console.error("Login failed:", err);
          if (window.opener) {
            window.opener.postMessage({ type: "OAUTH_ERROR", error: err }, "*");
            window.close();
          }
        });
    } else {
      if (window.opener) {
        window.opener.postMessage({ type: "OAUTH_ERROR", error: "NO_CODE" }, "*");
        window.close();
      }
    }
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Processing login...</p>
    </div>
  );
};

export default GoogleCallbackPage;
  