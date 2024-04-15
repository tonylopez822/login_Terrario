import React, { useState, useContext } from 'react';
import { StyleSheet, View, TextInput, Button, ImageBackground, Image, Text, TouchableOpacity, Modal } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext';

const image = {
    uri: 'https://pcfb.gumlet.io/images/articles/terrarium-with-succulents.png?w=640&h=426&mode=crop&crop=smart&s=53d9e9271eb2192ceb8e29c3ce518170',
};

export const LoginScreen = ({ navigation }) => {
    const [usuario, setUsuario] = useState(null);
    const [password, setPassword] = useState(null);
    const { isLoading, login, register } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [registroUsuario, setRegistroUsuario] = useState('');
    const [registroPassword, setRegistroPassword] = useState('');
    const [registroCorreo, setRegistroCorreo] = useState('');

    return (
        <View style={styles.container}>
            <Spinner visible={isLoading} />
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <View style={styles.container2}>
                    <View style={styles.wrapper}>
                        <View style={styles.wrapper2}>
                            <Image
                                source={require('../../../assets/logo.png')}
                                style={{ maxWidth: 230, height: 118 }}
                            />
                        </View>
                        <Text>Usuario</Text>
                        <TextInput
                            style={styles.input}
                            value={usuario}
                            placeholder="Ingresa tu usuario"
                            onChangeText={text => setUsuario(text)}
                        />
                        <Text>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            placeholder="Ingresa tu Contraseña"
                            onChangeText={text => setPassword(text)}
                            secureTextEntry
                        />

                        <Button color="green" title="Ingresar" onPress={() => { login(usuario, password) }} />
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate aquí</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Formulario de Registro</Text>
                        <Text>Usuario</Text>
                        <TextInput
                            style={styles.input}
                            value={registroUsuario}
                            placeholder="Ingresa tu usuario"
                            onChangeText={text => setRegistroUsuario(text)}
                        />
                        <Text>Correo</Text>
                        <TextInput
                            style={styles.input}
                            value={registroCorreo}
                            placeholder="Ingresa tu usuario"
                            onChangeText={text => setRegistroCorreo(text)}
                        />
                        <Text>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            value={registroPassword}
                            placeholder="Ingresa tu Contraseña"
                            onChangeText={text => setRegistroPassword(text)}
                            secureTextEntry
                        />
                        <Button color="green" title="Registrar" onPress={() => { register(registroUsuario, registroCorreo, registroPassword) }} />
                        <Button color="green" title="Cerrar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container2: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    wrapper: {
        width: '70%',
        paddingVertical: 20,
        backgroundColor: 'white',
        paddingRight: 20,
        paddingLeft: 20,
    },
    wrapper2: {
        paddingLeft: 5,
    },
    input: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 5,
        paddingHorizontal: 14,
    },
    linkText: {
        marginTop: 20,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: '80%', // Ancho del contenido del modal
        maxHeight: '80%', // Altura máxima del contenido del modal
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default LoginScreen;
