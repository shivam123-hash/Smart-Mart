import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingCard from '../components/OnboardingCard';
import ImagePath from '../../../shared/constants/ImagePath';

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
    const insets = useSafeAreaInsets();

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
        <View style={[styles.container, { paddingTop: insets.top }]}>
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
        backgroundColor: '#ebf7ed',
    }
});

export default OnBoardingScreen;
