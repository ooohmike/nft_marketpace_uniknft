import { useState, useEffect } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    console.log(userToken);
    return userToken
  };

  const [token, setToken] = useState();

  const saveToken = userToken => {
    sessionStorage.setItem('auth', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}