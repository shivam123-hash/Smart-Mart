import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Text } from 'react-native';
import ImagePath from '../../units/ImagePath';

const SplashScreen = ({ navigation }: any) => {
    const moveAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(500), // wait half a second before starting
            Animated.parallel([
                Animated.timing(moveAnim, {
                    toValue: -90, // Move the image to the left
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1, // Fade in the text
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        const timer = setTimeout(() => {
            navigation.replace('OnBoardingScreen');
        }, 3500);

        return () => clearTimeout(timer);
    }, [navigation, moveAnim, fadeAnim]);

    return (
        <View style={styles.container}>
            <Image
                source={ImagePath.DownImage}
                style={styles.topLeftImage}
                resizeMode="contain"
            />

            <Animated.View style={[styles.logoWrapper, { transform: [{ translateX: moveAnim }] }]}>
                <Image
                    source={ImagePath.AppIcon}
                    style={styles.centerImage}
                    resizeMode="contain"
                />
                <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.logoText}>mart Mart</Text>
                </Animated.View>
            </Animated.View>

            <Image
                source={ImagePath.Snacks}
                style={styles.bottomRightImage}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topLeftImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 200,
        height: 280,
    },
    logoWrapper: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    centerImage: {
        width: 150,
        height: 150,
    },
    textContainer: {
        position: 'absolute',
        left: 130,
        width: 250,
        top: 105
    },
    logoText: {
        fontSize: 35,
        fontFamily: 'Poppins-Bold',
        color: '#08540eff',
    },
    bottomRightImage: {
        position: 'absolute',
        bottom: 20,
        width: 200,
        height: 250,
    },
});

export default SplashScreen;
