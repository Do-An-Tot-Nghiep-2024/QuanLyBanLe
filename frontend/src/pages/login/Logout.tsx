import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Cookies.remove('accessToken');
        navigate('/login');
      
    }, []);

    return null; 
};

export default Logout;
