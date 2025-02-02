"use client";
import { useState } from "react";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  return (
    <div className="flex justify-center mt-4">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`mx-1 px-4 py-2 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-black"}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
