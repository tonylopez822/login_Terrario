import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import { AuthContext } from '../../context/AuthContext';

export const HomeScreen = () => {
    const { userInfo } = useContext(AuthContext);
    const [nombreTerrario, setNombreTerrario] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [nombreRegistrado, setNombreRegistrado] = useState('');
    const [terrarioData, setTerrarioData] = useState({});
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        if (!intervalId) {
            const id = setInterval(fetchTerrarioData, 20000); // Actualizar cada 20 segundos
            setIntervalId(id);
        }
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Si userInfo.terrarioId tiene un valor, significa que ya tiene un terrario registrado
        if (userInfo.terrarioId) {
            fetchTerrarioData(); // Obtener y mostrar los datos del terrario existente
        }
    }, [userInfo.terrarioId]);

    const fetchTerrarioData = () => {
        // Llama a la API para obtener los datos del terrario
        axios.get(`${BASE_URL}/peticiones/terrario/${userInfo.nombre}`)
            .then(response => {
                setTerrarioData(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los datos del terrario:', error);
            });
    };

    const handleRegisterTerrario = () => {
        setIsLoading(true);
        axios.post(`${BASE_URL}/peticiones/registro/terrario`, { nombreTerrario, usuario: userInfo.nombre })
            .then(response => {
                console.log(response.data);
                if (response.data.status === 200) {
                    setNombreRegistrado(nombreTerrario);
                    setIsModalVisible(true);
                    setNombreTerrario(''); // Limpiar el campo de texto después de registrar
                }
            })
            .catch(error => {
                console.error('Error al registrar el terrario:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {!terrarioData.nuevoTerrario ? (
                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del Terrario"
                        value={nombreTerrario}
                        onChangeText={text => setNombreTerrario(text)}
                    />
                    <Button
                        title="Registrar Terrario"
                        onPress={handleRegisterTerrario}
                        disabled={isLoading}
                    />
                </View>
            ) : (
                <View style={styles.card}>
                    {/* Mostrar los datos del terrario */}
                    <Text>Nombre del Terrario: {terrarioData.nuevoTerrario.nombreTerrario}</Text>
                    <Text>Temperatura: {terrarioData.temperatura}</Text>
                    <Text>Humedad: {terrarioData.humedad}</Text>
                </View>
            )}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>¡Terrario registrado con éxito!</Text>
                        <Text style={styles.modalText}>Nombre del Terrario: {nombreRegistrado}</Text>
                        <Button title="Ver Actividad" onPress={closeModal} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 3,
    },
    input: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#66bb6a',
        borderRadius: 5,
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#66bb6a',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
});
