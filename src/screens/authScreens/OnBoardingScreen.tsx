import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingCard from './components/OnboardingCard';
import ImagePath from '../../units/ImagePath';

const onboardingData = [
    {
        title: 'Buy Groceries Easily\nwith Us',
        description: 'It is a long established fact that a reader\nwill be distracted by the readable.',
        image: ImagePath.FirstBoardingImage,
    },
    {
        title: 'We Deliver Grocery\nat Your Doorstep',
        description: 'It is a long established fact that a reader\nwill be distracted by the readable.',
        image: ImagePath.SecondBoardingImage,
    },
    {
        title: 'All Your Kitchen Needs\nare Here',
        description: 'It is a long established fact that a reader\nwill be distracted by the readable.',
        image: ImagePath.ThirdBoardingImage,
    }
];

const OnBoardingScreen = ({ navigation }: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.replace('LoginScreen');
        }
    };

    const handleSkip = () => {
        navigation.replace('LoginScreen');
    };

    const currentData = onboardingData[currentIndex];

    return (
        <View style={styles.container}>
            <OnboardingCard
                title={currentData.title}
                description={currentData.description}
                image={currentData.image}
                currentIndex={currentIndex}
                onNext={handleNext}
                onSkip={handleSkip}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default OnBoardingScreen;
