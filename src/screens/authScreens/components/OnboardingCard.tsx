import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';
import Icon from '@react-native-vector-icons/feather';

const { width } = Dimensions.get('window');

interface OnboardingCardProps {
    title: string;
    description: string;
    image: any;
    currentIndex: number;
    onNext: () => void;
    onSkip: () => void;
}

const OnboardingCard = ({ title, description, image, currentIndex, onNext, onSkip }: OnboardingCardProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const arrowTranslateX = useRef(new Animated.Value(-60)).current;
    const arrowOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        arrowTranslateX.setValue(-60);
        arrowOpacity.setValue(0);
        
        Animated.parallel([
            Animated.spring(arrowTranslateX, {
                toValue: 0,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(arrowOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    }, [currentIndex, arrowTranslateX, arrowOpacity]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();

        Animated.parallel([
            Animated.timing(arrowTranslateX, {
                toValue: 60,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(arrowOpacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start(() => {
            onNext();
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                <View style={styles.skipIconCircle}>
                    <Icon name="arrow-right" size={14} color="white" />
                </View>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.bottomCard}>
                <View style={styles.paginationContainer}>
                    {[0, 1, 2].map((index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
                    <Animated.View style={[styles.nextButton, { transform: [{ scale: scaleAnim }] }]}>
                        <Animated.View style={{ transform: [{ translateX: arrowTranslateX }], opacity: arrowOpacity }}>
                            <Icon name="arrow-right" size={28} color="white" />
                        </Animated.View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebf7ed',
        justifyContent: 'space-between',
    },
    skipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 60,
        marginRight: 20,
    },
    skipText: {
        color: '#55cc70',
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        marginRight: 5,
    },
    skipIconCircle: {
        backgroundColor: '#55cc70',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipIconText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    image: {
        width: width * 0.9,
        height: '80%',
    },
    bottomCard: {
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 25,
        paddingTop: 30,
        paddingBottom: 40,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    paginationContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#55cc70',
    },
    inactiveDot: {
        backgroundColor: '#d3d3d3',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    nextButton: {
        backgroundColor: '#55cc70',
        width: 100,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#55cc70",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
    },
    nextIcon: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    }
});

export default OnboardingCard;
