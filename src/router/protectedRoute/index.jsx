// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { jwtDecode } from "jwt-decode";

// // Function to check token validity
// const isTokenValid = (token) => {
//     if (!token) return false;

//     try {
//         const { exp } = jwtDecode(token); // Decode token to check expiration
//         return Date.now() < exp * 1000;    // Token is valid if not expired
//     } catch (error) {
//         console.error("Token validation error:", error);
//         return false;
//     }
// };

// const ProtectedRoute = () => {
//     return <Outlet />
//     const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');

//     // If token is not valid, redirect to login page
//     return isTokenValid(token) ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
