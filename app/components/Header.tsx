"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginState = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkLoginState(); // ✅ Run on mount
    window.addEventListener("storage", checkLoginState); // ✅ Listen for login/logout updates

    return () => window.removeEventListener("storage", checkLoginState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage")); // ✅ Force UI update
    router.push("/");
  };

  return (
    <header className="flex justify-between p-4 bg-gray-100 shadow-md">
      <h1 className="text-2xl font-bold">Sanjay&apos;s Personal Blogs</h1>
      <div className="flex space-x-4">
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded-lg">
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth" className="bg-green-500 text-white p-2 rounded-lg">
            Login / Signup
          </Link>
        )}
      </div>
    </header>
  );
}
