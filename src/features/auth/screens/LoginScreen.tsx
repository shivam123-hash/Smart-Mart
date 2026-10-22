import React, { useState, useRef, useEffect } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import LocalizedTextInput from '../../../shared/i18n/LocalizedTextInput';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Modal, FlatList, Animated } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../../shared/components/CustomInput';
import CustomButton from '../../../shared/components/CustomButton';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingItems from './FloatingItems';
import RoleSelector, { UserRole } from '../components/RoleSelector';
import { DEMO_OTP, isValidDemoOtp, isValidPhoneNumber } from '../utils/authValidation';
import { useFeedback } from '../../../shared/components/feedback/FeedbackProvider';

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
    const { showDialog } = useFeedback();
    const insets = useSafeAreaInsets();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
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

        return () => {
            pulseAnimation.stop();
        };
    }, [pulseAnim]);

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

    const handleLogin = () => {
        if (!isValidPhoneNumber(phoneNumber)) {
            showDialog('Check phone number', 'Enter 7 to 10 digits for the selected country.');
            return;
        }
        setOtp(['', '', '', '']);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsOtpModalVisible(true);
        }, 1000);
    };

    const handleVerifyOTP = () => {
        if (!isValidDemoOtp(otp.join(''))) {
            showDialog('Invalid demo code', `Enter ${DEMO_OTP} to continue. No SMS is sent in demo mode.`);
            return;
        }
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setIsOtpModalVisible(false);
            navigation.replace(
                selectedRole === 'customer' ? 'MainNavigation' : 'DeliveryNavigation',
            );
        }, 3000);
    };

    const countryPrefix = (
        <TouchableOpacity style={styles.countryPickerContainer} onPress={toggleCountryPicker}>
            <LocalizedText style={styles.flagText}>{flag}</LocalizedText>
            <LocalizedText style={styles.countryCodeText}>{countryCode}</LocalizedText>
            <Icon name="chevron-down" size={16} color="#7a7a7a" />
            <View style={styles.verticalDivider} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >

                    {/* Top Illustration/Background Section */}
                    <View style={styles.headerSection}>
                        <Animated.View style={[styles.decorativeCircle1, { transform: [{ scale: pulseAnim }] }]} />
                        <Animated.View style={[styles.decorativeCircle2, { transform: [{ scale: pulseAnim }] }]} />

                        <FloatingItems layer="back" travelHeight={height * 0.5} />
                        <View style={styles.headerContent}>
                            <View style={styles.iconWrapper}>
                                <Icon name="shopping-bag" size={50} color="#ffffff" />
                            </View>

                            <LocalizedText style={styles.welcomeTitle}>Welcome to Smart Mart</LocalizedText>
                            <LocalizedText style={styles.welcomeSubtitle}>Fresh groceries, snacks & daily needs at your door!</LocalizedText>
                        </View>
                        <FloatingItems layer="front" travelHeight={height * 0.5} />
                    </View>

                    {/* Bottom Form Section */}
                    <View style={styles.bottomCard}>
                        <LocalizedText style={styles.formTitle}>Login</LocalizedText>

                        <RoleSelector
                            selectedRole={selectedRole}
                            onRoleChange={setSelectedRole}
                        />

                        <CustomInput
                            label="Phone Number"
                            value={phoneNumber}
                            onChangeText={(value) => setPhoneNumber(value.replace(/\D/g, '').slice(0, 10))}
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
                        <LocalizedText style={styles.termsText}>
                            By continuing, you agree to our{' '}
                            <LocalizedText
                                style={styles.termsLink}
                                onPress={() => navigation.navigate('TermsOfServiceScreen')}
                            >
                                Terms of Service
                            </LocalizedText>
                            {' '}and{' '}
                            <LocalizedText
                                style={styles.termsLink}
                                onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                            >
                                Privacy Policy
                            </LocalizedText>
                        </LocalizedText>
                        <LocalizedText style={styles.signupPrompt}>
                            Don’t have an account?{' '}
                            <LocalizedText
                                style={styles.termsLink}
                                onPress={() => navigation.navigate('SignupScreen')}
                            >
                                Sign up
                            </LocalizedText>
                        </LocalizedText>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Country Picker Modal */}
            <Modal visible={isPickerVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <LocalizedText style={styles.modalTitle}>Select Country</LocalizedText>
                            <TouchableOpacity onPress={toggleCountryPicker}>
                                <Icon name="x" size={24} color="#1a1a1a" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(item) => item.code + item.name}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.countryItem} onPress={() => selectCountry(item)}>
                                    <LocalizedText style={styles.countryItemFlag}>{item.flag}</LocalizedText>
                                    <LocalizedText style={styles.countryItemName}>{item.name}</LocalizedText>
                                    <LocalizedText style={styles.countryItemCode}>{item.code}</LocalizedText>
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
                        <LocalizedText style={styles.otpTitle}>Enter OTP</LocalizedText>
                        <LocalizedText style={styles.otpSubtitle}>
                            {`Demo only: no SMS is sent. Use ${DEMO_OTP} to continue; this does not verify identity or create an account.`}
                        </LocalizedText>
                        <LocalizedText style={styles.otpSubtitle}>{countryCode} {phoneNumber}</LocalizedText>

                        <View style={styles.otpInputContainer}>
                            {[0, 1, 2, 3].map((index) => (
                                <LocalizedTextInput
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
                                        newOtp[index] = text.replace(/\D/g, '').slice(0, 1);
                                        setOtp(newOtp);

                                        if (newOtp[index] && index < 3) {
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
                                <LocalizedText style={styles.verifyButtonText}>Verify</LocalizedText>
                            )}
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#ebf7ed',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 8,
    },
    headerSection: {
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 0,
        elevation: 0,
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
    headerContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        elevation: 1,
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
        position: 'relative',
        zIndex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 25,
        paddingTop: 24,
        paddingBottom: 22,
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
        marginBottom: 16,
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
        marginTop: 16,
        marginBottom: 12,
    },
    termsText: {
        fontSize: 11,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
        textAlign: 'center',
        lineHeight: 16,
    },
    termsLink: {
        color: '#55cc70',
        fontFamily: 'Poppins-Medium',
    },
    signupPrompt: {
        marginTop: 10,
        fontSize: 12,
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

export default LoginScreen;
