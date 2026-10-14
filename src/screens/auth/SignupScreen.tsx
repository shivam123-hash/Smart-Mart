import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
    Modal, 
    FlatList, 
    Animated, 
    Easing, 
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import FloatingItems from './FloatingItems';

const { width, height } = Dimensions.get('window');

const COUNTRIES = [
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
];

const SignupScreen = () => {
    const navigation = useNavigation<any>();
    const [fullName, setFullName] = useState('');
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
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const headerEntrance = useRef(new Animated.Value(0)).current;
    const formEntrance = useRef(new Animated.Value(0)).current;
    const iconEntrance = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulseAnimation = Animated.loop(
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
        );
        pulseAnimation.start();

        const entranceAnimation = Animated.stagger(120, [
            Animated.timing(headerEntrance, {
                toValue: 1,
                duration: 450,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(formEntrance, {
                toValue: 1,
                duration: 450,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]);
        entranceAnimation.start();
        const iconAnimation = Animated.spring(iconEntrance, {
            toValue: 1,
            friction: 6,
            tension: 55,
            useNativeDriver: true,
        });
        iconAnimation.start();

        return () => {
            pulseAnimation.stop();
            entranceAnimation.stop();
            iconAnimation.stop();
        };
    }, [
        pulseAnim,
        headerEntrance,
        formEntrance,
        iconEntrance,
    ]);

    useEffect(() => {
        let dotsAnimation: Animated.CompositeAnimation | undefined;
        if (isVerifying) {
            dotsAnimation = Animated.loop(
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
            );
            dotsAnimation.start();
        } else {
            dot1Scale.setValue(1);
            dot2Scale.setValue(1);
            dot3Scale.setValue(1);
        }

        return () => dotsAnimation?.stop();
    }, [isVerifying, dot1Scale, dot2Scale, dot3Scale]);

    const toggleCountryPicker = () => {
        setIsPickerVisible(!isPickerVisible);
    };

    const selectCountry = (item: any) => {
        setFlag(item.flag);
        setCountryCode(item.code);
        setIsPickerVisible(false);
    };

    const handleSignup = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsOtpModalVisible(true);
        }, 1000);
    };

    const handleVerifyOTP = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setIsOtpModalVisible(false);
            navigation.replace('MainNavigation');
        }, 3000);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

                    {/* Top Illustration/Background Section */}
                    <Animated.View
                        style={[
                            styles.headerSection,
                            {
                                opacity: headerEntrance,
                                transform: [
                                    {
                                        translateY: headerEntrance.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Animated.View style={[styles.decorativeCircle1, { transform: [{ scale: pulseAnim }] }]} />
                        <Animated.View style={[styles.decorativeCircle2, { transform: [{ scale: pulseAnim }] }]} />

                        <FloatingItems layer="back" />
                        <View style={styles.headerContent}>
                            <Animated.View
                                style={[
                                    styles.iconWrapper,
                                    {
                                        transform: [
                                            {
                                                scale: iconEntrance.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.65, 1],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <Icon name="user-plus" size={45} color="#ffffff" />
                            </Animated.View>

                            <Text style={styles.welcomeTitle}>Create Account</Text>
                            <Text style={styles.welcomeSubtitle}>Join Smart Mart for fast grocery deliveries!</Text>
                        </View>
                        <FloatingItems layer="front" />
                    </Animated.View>

                    {/* Bottom Form Section */}
                    <Animated.View
                        style={[
                            styles.bottomCard,
                            {
                                opacity: formEntrance,
                                transform: [
                                    {
                                        translateY: formEntrance.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [32, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Text style={styles.formTitle}>Sign Up</Text>

                        {/* Full Name Field */}
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="user" size={18} color="#7a7a7a" style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter your full name"
                                placeholderTextColor="#9e9e9e"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        {/* Phone Number Field */}
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.countryPickerContainer} onPress={toggleCountryPicker}>
                                <Text style={styles.flagText}>{flag}</Text>
                                <Text style={styles.countryCodeText}>{countryCode}</Text>
                                <Icon name="chevron-down" size={16} color="#7a7a7a" />
                                <View style={styles.verticalDivider} />
                            </TouchableOpacity>
                            <TextInput
                                style={[styles.textInput, styles.phoneInput]}
                                placeholder="Enter phone number"
                                placeholderTextColor="#9e9e9e"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>

                        {/* Sign Up Button */}
                        <CustomButton
                            title="Send Otp"
                            onPress={handleSignup}
                            isLoading={isLoading}
                            gradientColors={['#55cc70', '#2fa64c']}
                            style={styles.signupButton}
                        />

                        <Text style={styles.termsText}>
                            By continuing, you agree to our{' '}
                            <Text
                                style={styles.termsLink}
                                onPress={() => navigation.navigate('TermsOfServiceScreen')}
                            >
                                Terms of Service
                            </Text>
                            {' '}and{' '}
                            <Text
                                style={styles.termsLink}
                                onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                            >
                                Privacy Policy
                            </Text>
                        </Text>
                        <Text style={styles.loginPrompt}>
                            Already have an account?{' '}
                            <Text
                                style={styles.termsLink}
                                onPress={() => navigation.goBack()}
                            >
                                Log in
                            </Text>
                        </Text>
                    </Animated.View>

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
                        <Text style={styles.otpTitle}>Verify Phone</Text>
                        <Text style={styles.otpSubtitle}>
                            Enter the code sent to {countryCode} {phoneNumber || 'your phone number'}
                        </Text>

                        <View style={styles.otpInputContainer}>
                            {[0, 1, 2, 3].map((index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref: any) => {
                                        otpInputs.current[index] = ref;
                                    }}
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
                                <Text style={styles.verifyButtonText}>Verify & Register</Text>
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
        height: height * 0.35,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 0,
        elevation: 0,
    },
    headerContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        elevation: 1,
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
        bottom: 10,
        left: -width * 0.2,
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        backgroundColor: 'rgba(85, 204, 112, 0.1)',
    },
    iconWrapper: {
        width: 85,
        height: 85,
        backgroundColor: '#55cc70',
        borderRadius: 42.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: "#55cc70",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
        zIndex: 2,
    },
    welcomeTitle: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 6,
        zIndex: 2,
    },
    welcomeSubtitle: {
        fontSize: 13,
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
        paddingTop: 30,
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
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
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontFamily: 'Poppins-Medium',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f6f8',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#eee',
        paddingHorizontal: 14,
        height: 52,
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#1a1a1a',
        height: '100%',
    },
    phoneInput: {
        paddingLeft: 10,
    },
    countryPickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    flagText: {
        fontSize: 20,
        marginRight: 5,
    },
    countryCodeText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#1a1a1a',
        marginRight: 5,
    },
    verticalDivider: {
        width: 1,
        height: '60%',
        backgroundColor: '#d3d3d3',
        marginLeft: 10,
    },
    signupButton: {
        marginTop: 10,
        marginBottom: 16,
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
    loginPrompt: {
        marginTop: 14,
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
        textAlign: 'center',
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

export default SignupScreen;