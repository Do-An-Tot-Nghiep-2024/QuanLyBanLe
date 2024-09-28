import { StyleSheet } from 'react-native';

export const colors = {
    primaryColor: '#3498db',   /* Blue */
    secondaryColor: 'lightgray', /* Light Gray */
    accentColor: '#f39c12',    /* Orange */
};

const styles = StyleSheet.create({
    body: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        color: '#333', /* Dark gray text color for body text */
    },
    h1: {
        fontSize: 32,
        color: colors.primaryColor, /* Blue for H1 headings */
    },
    h2: {
        fontSize: 24,
        color: colors.primaryColor, /* Blue for H2 headings */
    },
    h3: {
        fontSize: 20,
        color: colors.primaryColor, /* Blue for H3 headings */
        fontWeight: 'bold',
    },
    a: {
        color: colors.primaryColor, /* Blue for links */
        textDecorationLine: 'none', /* Remove underline from links */
    },
    p: {
        lineHeight: 1.5, /* Set line height for better readability */
        fontWeight: 'bold'
    },
    footer: {
        fontSize: 14, /* Smaller font size for footer text */
        color: '#666', /* Gray text color for footer */
    },
    accentText: {
        color: colors.accentColor, /* Orange text color */
        fontSize: 14,
    },
    button: {
        backgroundColor: colors.primaryColor, /* Default button background color */
        color: '#fff', /* Button text color */
        padding: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        borderWidth: 0,
        transition: 'background-color 0.3s', /* Add a smooth transition effect */
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