import { StyleSheet } from 'react-native';

export const colors = {
    primaryColor: '#3498db',
    secondaryColor: 'lightgray',
    accentColor: '#f39c12',
};

const styles = StyleSheet.create({
    body: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        color: '#333', 
    },
    h1: {
        fontSize: 32,
        color: colors.primaryColor,
    },
    h2: {
        fontSize: 24,
        color: colors.primaryColor,
    },
    h3: {
        fontSize: 20,
        color: colors.primaryColor,
        fontWeight: 'bold',
    },
    a: {
        color: colors.primaryColor,
        textDecorationLine: 'none',
    },
    p: {
        lineHeight: 1.5,
        fontWeight: 'bold',
    },
    footer: {
        fontSize: 14,
        color: '#666',
    },
    accentText: {
        color: colors.accentColor, 
        fontSize: 14,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: colors.primaryColor,
        color: '#fff',
        padding: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        borderWidth: 0,
        transition: 'background-color 0.3s',
        cursor: 'pointer',
        width: '100%',
        height: 50,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});

export default styles;
