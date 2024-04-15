import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, Image, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import s from '../../assets/css/styles';

import { AuthContext } from '../context/AuthContext';
//Screens
//Auth
import { LoginScreen } from '../screens/Auth/LoginScreen';
//Usuario
import { HomeScreen } from '../screens/user/HomeScreen';
import { VerActividad } from '../screens/user/VerActividad';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const DrawerNavigation = () => {
  const { userInfo, splashLoading, logout } = useContext(AuthContext);

  function DrawerMenu(props) {
    return (
      <TouchableOpacity onPress={props.navigation}>
        <View style={s.menuContainer}>
          <View style={s.iconoContainer}>
            {/* Aquí deberías importar 'Icon' desde react-native o alguna otra librería que lo provea */}
            {/* <Icon size={17} name={props.iconName} /> */}
          </View>
          <View style={s.tituloContainer}>
            <Text>{props.titleName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const Menu = (props) => {
    return (
      <View style={s.container}>
        <View style={s.bgContainer}>
          <TouchableOpacity>
            <View style={s.userContainer}>
              {/* Aquí podrías agregar una imagen de perfil si lo deseas */}
              {/* <Image /> */}
            </View>
            <View style={s.userNombre}>
              <Text style={s.userTitulo} >{userInfo.nombre} {userInfo.apellidopaterno}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {splashLoading ? (
          <DrawerMenu titleName="Splash Screen" navigation={() => props.navigation.navigate('splashScreen')} options={{ headerShown: false }} />
        ) : userInfo.status === 1 ? (
          <>
            <DrawerMenu titleName="Home" navigation={() => props.navigation.navigate('HomeScreen')} options={{ headerShown: false }} />
            <DrawerMenu titleName="Ver actvidad" navigation={() => props.navigation.navigate('VerActividad')} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <DrawerMenu titleName="Login" navigation={() => props.navigation.navigate('login')} options={{ headerShown: false }} />
          </>
        )}

        <View style={s.bgContainer}>
        </View>
        <View style={s.footer}>
          <TouchableOpacity>
            <Pressable onPress={logout}>
              <Text style={s.boton} >Salir</Text>
            </Pressable>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (splashLoading) {
    return <SplashScreen />;
  }

  return (
    <Drawer.Navigator drawerLabel={() => null} drawerContent={(props) => <Menu {...props} />}>
      {splashLoading ? (
        <Stack.Screen name="splashScreen" component={SplashScreen} options={{ headerShown: false }} />
      ) : userInfo.status === 1 ? (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true, headerTitle: 'Panel Inicial' }} />
          <Stack.Screen name="VerActividad" component={VerActividad} options={{ headerShown: true, headerTitle: 'Atividad' }} />
        </>
      ) : (
        <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Drawer.Navigator>
  );
};

export const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {splashLoading ? (
          <Stack.Screen name="splashScreen" component={SplashScreen} options={{ headerShown: false }} />
        ) : userInfo.status ? (
          <Stack.Screen name="Home" component={DrawerNavigation} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
