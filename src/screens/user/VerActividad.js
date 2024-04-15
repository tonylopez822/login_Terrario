import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import { AuthContext } from '../../context/AuthContext';

export const VerActividad = () => {
    const [data, setData] = useState({ temperatura: 0, humedad: 0 });
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        fetchData(); // Llamar a fetchData inmediatamente al cargar el componente
        const intervalId = setInterval(fetchData, 5000); // Llamar a fetchData cada 5 segundos

        return () => {
            clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
        };
    }, []); // Usar un array vacío como dependencia para que se ejecute solo una vez al cargar el componente

    const fetchData = () => {
        axios.get(`${BASE_URL}/peticiones/terrario/${userInfo.nombre}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los datos del terrario:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Card>
                <Card.Title>Actividad del Terrario</Card.Title>
                <Card.Divider />
                <View style={styles.chartContainer}>
                    <BarChart
                        data={{
                            labels: ['Temperatura', 'Humedad'],
                            datasets: [{
                                data: [
                                    data.temperatura || 0, // Suponiendo que obtienes la temperatura del objeto de datos
                                    data.humedad || 0, // Suponiendo que obtienes la humedad del objeto de datos
                                ]
                            }]
                        }}
                        width={350}
                        height={220}
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: '#FFFFFF',
                            backgroundGradientFrom: '#FFFFFF',
                            backgroundGradientTo: '#FFFFFF',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Color de la barra
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color del texto de las etiquetas
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '4',
                                strokeWidth: '2',
                                stroke: '#ffa726',
                            },
                        }}
                    />
                </View>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    chartContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
});
