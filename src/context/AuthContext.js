import { Text, StyleSheet, View, Alert } from 'react-native';
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const register = (usuario, email, password) => {
        console.log(usuario, email, password)
        setIsLoading(true)
        axios.post(`${BASE_URL}/auth/registro`, {
            headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
            usuario: usuario,
            password: password,
            email: email
        })
        .then(response => {
            if (response.data.status === 200) {
                showSuccessAlert();
            } else {
                showErrorAlert();
            }
        })
        .catch(error => {
            showErrorAlert();
        })
        .finally(() => {
            setIsLoading(false);
        });
    };
    
    const showSuccessAlert = () => {
        Alert.alert(
            '¡Registro Exitoso!',
            'Tu usuario ha sido registrado exitosamente.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Acciones adicionales si es necesario
                    }
                }
            ],
            { cancelable: false }
        );
    };
    
    const showErrorAlert = () => {
        Alert.alert(
            'Error',
            'Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo más tarde.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Acciones adicionales si es necesario
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const login = (usuario, password) => {
        setIsLoading(true);
        axios
            .post(`${BASE_URL}/auth/login`, {
                headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
                usuario: usuario,
                password: password
            })
            .then(res => {
                let userInfo = res.data.UsuarioDBUpdated;
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                setIsLoading(false);
                if (userInfo.tokensession != "") {
                    Alert.alert("Has iniciado correctamente session");
                } else {
                    Alert.alert(userInfo.error)
                }
            })
            .catch(e => {
                console.log(`login error ${e}`);
                setIsLoading(false);
            });
    };


    const logout = () => {
        setIsLoading(true);
        // axios
        //     .post(
        //         `${BASE_URL}/auth/logout`,
        //         {
        //             headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
        //             tokensession: userInfo.tokensession,
        //         },
        //         // {
        //         //     headers: { Authorization: `Bearer ${userInfo.msg}` },
        //         // },
        //     )
        //     .then(res => {
        //         // console.log(res.data.message);
        //         if (res.status === 200) {
        //             Alert.alert(res.data.message);
        //         } else {
        //             Alert.alert(res.data.content)
        //         }
        //         AsyncStorage.removeItem('userInfo');
        //         setUserInfo({});
        //         setIsLoading(false);
        //     })
        //     .catch(e => {
        //         console.log(`logout error ${e}`);
        //         setIsLoading(false);
        //     });
          AsyncStorage.removeItem('userInfo');
            setUserInfo({});
    };

    const isLoggedIn = async () => {
        try {
            setSplashLoading(true);

            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);

            if (userInfo) {
                setUserInfo(userInfo);
            }

            setSplashLoading(false);
        } catch (e) {
            setSplashLoading(false);
            console.log(`is logged in error ${e}`);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                splashLoading,
                login,
                logout,
                register,
            }}>
            {children}
        </AuthContext.Provider>
    );
}