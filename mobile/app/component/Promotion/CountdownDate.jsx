import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const CountdownDate = ({ endDate }) => {
    const [daysLeft, setDaysLeft] = useState(0);
    const animatedValue = new Animated.Value(1);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            const endTime = new Date(endDate);
            const difference = endTime - currentTime;
            const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
            setDaysLeft(days);

            // Trigger the highlight animation
            Animated.sequence([
                Animated.timing(animatedValue, { toValue: 1.2, duration: 500, easing: Easing.linear, useNativeDriver: false }),
                Animated.timing(animatedValue, { toValue: 1, duration: 500, easing: Easing.linear, useNativeDriver: false }),
            ]).start();
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    const animatedStyle = {
        transform: [{ scale: animatedValue }],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Promotion Ends In</Text>
            <View style={styles.countdownContainer}>
                <Animated.Text style={[styles.daysNumber, animatedStyle]}>{daysLeft}</Animated.Text>
                <Text style={styles.daysText}>Days</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,

    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    countdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    daysNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        marginRight: 10,
    },
    daysText: {
        fontSize: 20,
    },
});

export default CountdownDate;