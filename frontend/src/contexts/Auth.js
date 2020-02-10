import React, { useEffect, useState } from 'react';
import useReactRouter from 'use-react-router';

import { getToken, setToken, removeToken, gotoLogin } from '@/utils/auth';
import request from '@/utils/request';

export const AuthContext = React.createContext({});

export const AuthProvider = ({
    children
}) => {
    const { location: { pathname } } = useReactRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userid, setUserid] = useState(null);

    const checkAuth = () => {
        return request.post('/user/info', {});
    };

    useEffect(() => {
        setIsLoggedIn(false);

        if (pathname === '/login') {
            return;
        }

        const token = getToken();

        if (token) {
            checkAuth().then(({
                token,
                userid
            }) => {
                setToken(token);
                setIsLoggedIn(true);
                setUserid(userid);
            }).catch(() => {
                removeToken();
                gotoLogin();
            });
        } else {
            gotoLogin();
        }
    }, [pathname]);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                userid
            }}
        >
            {(isLoggedIn || pathname === '/login') && children}
        </AuthContext.Provider>
    );
};
