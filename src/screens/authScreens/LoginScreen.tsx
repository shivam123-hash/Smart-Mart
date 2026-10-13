import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Modal, FlatList, Animated, Easing, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePath from '../../units/ImagePath';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Icon from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const COUNTRIES = [
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
];

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [flag, setFlag] = useState('🇮🇳');
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // OTP Modal states
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const otpInputs = useRef<any>([]);

    const dot1Scale = useRef(new Animated.Value(1)).current;
    const dot2Scale = useRef(new Animated.Value(1)).current;
    const dot3Scale = useRef(new Animated.Value(1)).current;
    // Rain Animation setup
    const fallAnim1 = useRef(new Animated.Value(-100)).current;
    const fallAnim2 = useRef(new Animated.Value(-150)).current;
    const fallAnim3 = useRef(new Animated.Value(-200)).current;
    const fallAnim4 = useRef(new Animated.Value(-50)).current;
    const fallAnim5 = useRef(new Animated.Value(-120)).current;
    const fallAnim6 = useRef(new Animated.Value(-180)).current;

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const createFallAnimation = (animValue: Animated.Value, duration: number, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(animValue, {
                        toValue: height * 0.45 + 50, // Fall past the green section
                        duration: duration,
                        delay: delay,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animValue, {
                        toValue: -100, // Reset to top instantly
                        duration: 0,
                        useNativeDriver: true,
                    })
                ])
            );
        };

        createFallAnimation(fallAnim1, 4000, 0).start();
        createFallAnimation(fallAnim2, 5000, 1000).start();
        createFallAnimation(fallAnim3, 4500, 2000).start();
        createFallAnimation(fallAnim4, 6000, 500).start();
        createFallAnimation(fallAnim5, 5500, 1500).start();
        createFallAnimation(fallAnim6, 4200, 2500).start();

        // Pulsing background circles
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    useEffect(() => {
        if (isVerifying) {
            const animateDots = () => {
                Animated.loop(
                    Animated.stagger(150, [
                        Animated.sequence([
                            Animated.timing(dot1Scale, { toValue: 1.5, duration: 250, useNativeDriver: true }),
                            Animated.timing(dot1Scale, { toValue: 1, duration: 250, useNativeDriver: true }),
                        ]),
                        Animated.sequence([
                            Animated.timing(dot2Scale, { toValue: 2, duration: 250, useNativeDriver: true }),
                            Animated.timing(dot2Scale, { toValue: 1, duration: 250, useNativeDriver: true }),
                        ]),
                        Animated.sequence([
                            Animated.timing(dot3Scale, { toValue: 1.5, duration: 250, useNativeDriver: true }),
                            Animated.timing(dot3Scale, { toValue: 1, duration: 250, useNativeDriver: true }),
                        ])
                    ])
                ).start();
            };
            animateDots();
        } else {
            dot1Scale.setValue(1);
            dot2Scale.setValue(1);
            dot3Scale.setValue(1);
        }
    }, [isVerifying]);

    const toggleCountryPicker = () => {
        setIsPickerVisible(!isPickerVisible);
    };

    const selectCountry = (item: any) => {
        setFlag(item.flag);
        setCountryCode(item.code);
        setIsPickerVisible(false);
    };

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsOtpModalVisible(true);
        }, 1000);
    };

    const handleVerifyOTP = () => {
        setIsVerifying(true);
        // Simulate OTP verification and show animation
        setTimeout(() => {
            setIsVerifying(false);
            setIsOtpModalVisible(false);
            navigation.replace('MainNavigation');
        }, 3000);
    };

    const countryPrefix = (
        <TouchableOpacity style={styles.countryPickerContainer} onPress={toggleCountryPicker}>
            <Text style={styles.flagText}>{flag}</Text>
            <Text style={styles.countryCodeText}>{countryCode}</Text>
            <Icon name="chevron-down" size={16} color="#7a7a7a" />
            <View style={styles.verticalDivider} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

                    {/* Top Illustration/Background Section */}
                    <View style={styles.headerSection}>
                        <Animated.View style={[styles.decorativeCircle1, { transform: [{ scale: pulseAnim }] }]} />
                        <Animated.View style={[styles.decorativeCircle2, { transform: [{ scale: pulseAnim }] }]} />

                        {/* Falling Grocery Rain elements */}
                        <Animated.View style={[styles.fallingIcon, { left: '15%', transform: [{ translateY: fallAnim1 }, { rotate: '15deg' }] }]}>
                            <Image source={ImagePath.LoginImageOne} style={{ width: 65, height: 65 }} resizeMode="contain" />
                        </Animated.View>
                        <Animated.View style={[styles.fallingIcon, { left: '85%', transform: [{ translateY: fallAnim2 }, { rotate: '-20deg' }] }]}>
                            <Image source={ImagePath.LoginImageTwo} style={{ width: 75, height: 75 }} resizeMode="contain" />
                        </Animated.View>
                        <Animated.View style={[styles.fallingIcon, { left: '30%', transform: [{ translateY: fallAnim3 }, { rotate: '10deg' }] }]}>
                            <Image source={ImagePath.LoginImageThree} style={{ width: 80, height: 80 }} resizeMode="contain" />
                        </Animated.View>
                        <Animated.View style={[styles.fallingIcon, { left: '70%', transform: [{ translateY: fallAnim4 }, { rotate: '-10deg' }] }]}>
                            <Image source={ImagePath.LoginImageFourth} style={{ width: 65, height: 65 }} resizeMode="contain" />
                        </Animated.View>
                        <Animated.View style={[styles.fallingIcon, { left: '50%', transform: [{ translateY: fallAnim5 }, { rotate: '5deg' }] }]}>
                            <Image source={ImagePath.Snacks} style={{ width: 75, height: 75 }} resizeMode="contain" />
                        </Animated.View>
                        <Animated.View style={[styles.fallingIcon, { left: '10%', transform: [{ translateY: fallAnim6 }, { rotate: '-15deg' }] }]}>
                            <Image source={ImagePath.LoginImageSixth} style={{ width: 60, height: 60 }} resizeMode="contain" />
                        </Animated.View>

                        <View style={styles.iconWrapper}>
                            <Icon name="shopping-bag" size={50} color="#ffffff" />
                        </View>

                        <Text style={styles.welcomeTitle}>Welcome to Smart Mart</Text>
                        <Text style={styles.welcomeSubtitle}>Fresh groceries, snacks & daily needs at your door!</Text>
                    </View>

                    {/* Bottom Form Section */}
                    <View style={styles.bottomCard}>
                        <Text style={styles.formTitle}>Login</Text>

                        <CustomInput
                            label="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            leftComponent={countryPrefix}
                            labelLeftOffset={115}
                            maxLength={10}
                        />

                        {/* Submit Button placed right below input with Gradient */}
                        <CustomButton
                            title="Send Otp"
                            onPress={handleLogin}
                            isLoading={isLoading}
                            gradientColors={['#55cc70', '#2fa64c']} // Rich gradient
                            style={styles.loginButton}
                        />

                        {/* Terms Text placed directly under the button */}
                        <Text style={styles.termsText}>
                            By continuing, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Country Picker Modal */}
            <Modal visible={isPickerVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity onPress={toggleCountryPicker}>
                                <Icon name="x" size={24} color="#1a1a1a" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(item) => item.code + item.name}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.countryItem} onPress={() => selectCountry(item)}>
                                    <Text style={styles.countryItemFlag}>{item.flag}</Text>
                                    <Text style={styles.countryItemName}>{item.name}</Text>
                                    <Text style={styles.countryItemCode}>{item.code}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* OTP Modal */}
            <Modal visible={isOtpModalVisible} animationType="fade" transparent={true}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.otpModalOverlay}>
                    <View style={styles.otpModalContent}>
                        <Text style={styles.otpTitle}>Enter OTP</Text>
                        <Text style={styles.otpSubtitle}>
                            A verification codes has been sent to {countryCode} {phoneNumber || '(205) 555-0100'}
                        </Text>

                        <View style={styles.otpInputContainer}>
                            {[0, 1, 2, 3].map((index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref: any) => otpInputs.current[index] = ref}
                                    style={[
                                        styles.otpInput,
                                        otp[index] ? styles.otpInputFilled : null
                                    ]}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={otp[index]}
                                    onChangeText={(text) => {
                                        const newOtp = [...otp];
                                        newOtp[index] = text;
                                        setOtp(newOtp);

                                        if (text && index < 3) {
                                            otpInputs.current[index + 1].focus();
                                        }
                                    }}
                                    onKeyPress={({ nativeEvent }) => {
                                        if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                                            otpInputs.current[index - 1].focus();
                                            const newOtp = [...otp];
                                            newOtp[index - 1] = '';
                                            setOtp(newOtp);
                                        }
                                    }}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={handleVerifyOTP}
                            disabled={isVerifying}
                        >
                            {isVerifying ? (
                                <View style={styles.dotsContainer}>
                                    <Animated.View style={[styles.dot, { transform: [{ scale: dot1Scale }] }]} />
                                    <Animated.View style={[styles.dot, { transform: [{ scale: dot2Scale }] }]} />
                                    <Animated.View style={[styles.dot, { transform: [{ scale: dot3Scale }] }]} />
                                </View>
                            ) : (
                                <Text style={styles.verifyButtonText}>Verify</Text>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.resendText}>
                            Didn't receive the code? <Text style={styles.resendLink}>Resend (30s)</Text>
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ebf7ed',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    headerSection: {
        height: height * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -width * 0.2,
        right: -width * 0.1,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: 'rgba(85, 204, 112, 0.15)',
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: 20,
        left: -width * 0.2,
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        backgroundColor: 'rgba(85, 204, 112, 0.1)',
    },
    fallingIcon: {
        position: 'absolute',
        top: 0,
        opacity: 0.5,
    },
    iconWrapper: {
        width: 90,
        height: 90,
        backgroundColor: '#55cc70',
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#55cc70",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
        zIndex: 2,
    },
    welcomeTitle: {
        fontSize: 26,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
        zIndex: 2,
    },
    welcomeSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
        textAlign: 'center',
        paddingHorizontal: 30,
        zIndex: 2,
    },
    bottomCard: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 25,
        paddingTop: 40,
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
        // Removed minHeight to allow content to wrap nicely without empty space
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 15,
    },
    formTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
        marginBottom: 25,
    },
    countryPickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    flagText: {
        fontSize: 22,
        marginRight: 5,
    },
    countryCodeText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#1a1a1a',
        marginRight: 5,
    },
    verticalDivider: {
        width: 1,
        height: '70%',
        backgroundColor: '#d3d3d3',
        marginLeft: 10,
    },
    loginButton: {
        marginTop: 30,
        marginBottom: 20,
    },
    termsText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
        color: '#55cc70',
        fontFamily: 'Poppins-Medium',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '60%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    countryItemFlag: {
        fontSize: 24,
        marginRight: 15,
    },
    countryItemName: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#1a1a1a',
    },
    countryItemCode: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
    },
    otpModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpModalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    otpTitle: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    otpSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    otpInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderWidth: 1.5,
        borderColor: '#e8e8e8',
        borderRadius: 15,
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
    },
    otpInputFilled: {
        borderColor: '#55cc70',
        backgroundColor: '#f4fbf6',
    },
    verifyButton: {
        backgroundColor: '#55cc70',
        width: '100%',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#55cc70",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    verifyButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
    },
    resendText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
    },
    resendLink: {
        color: '#55cc70',
        fontFamily: 'Poppins-Medium',
    }
});

export default LoginScreen;
