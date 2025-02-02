"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ✅ Check login state on component mount
    setIsLoggedIn(!!localStorage.getItem("token"));

    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // ✅ Listen for login/logout changes
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage")); // ✅ Force re-render of Header
    router.push("/");
  };

  return (
    <header className="flex justify-between p-4 bg-gray-100 shadow-md">
      <h1 className="text-2xl font-bold">Blog</h1>
      <div className="flex space-x-4">
        {/* {isLoggedIn && (
          <Link href="/create-post" className="bg-blue-500 text-white p-2 rounded-lg">
            + Create Post
          </Link>
        )} */}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded-lg">
            Logout
          </button>
        ) : (
          <Link href="/auth" className="bg-green-500 text-white p-2 rounded-lg">
            Login / Signup
          </Link>
        )}
      </div>
    </header>
  );
}
