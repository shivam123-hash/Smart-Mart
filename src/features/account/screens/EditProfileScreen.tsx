import React, { useState, useRef, useEffect } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import LocalizedTextInput from '../../../shared/i18n/LocalizedTextInput';
import { View, StyleSheet, ScrollView, StatusBar, Animated, Platform, KeyboardAvoidingView, Image } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EditProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('+1 202 555 0147');
  const [email, setEmail] = useState('john.doe@email.com');
  const [gender, setGender] = useState('Male');

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(80, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(avatarAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSave = () => {
    // Save logic here
    navigation.goBack();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-16, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Icon name="chevron-left" size={26} color="#1a1a1a" />
        </TouchableOpacity>
        <LocalizedText style={styles.headerTitle}>Edit Profile</LocalizedText>
        <View style={{ width: 40 }} />
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <Animated.View
            style={[
              styles.avatarSection,
              {
                opacity: avatarAnim,
                transform: [
                  {
                    scale: avatarAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Icon name="user" size={42} color="#55cc70" />
              </View>
              <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.85}>
                <Icon name="camera" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <LocalizedText style={styles.changePhotoText}>Change Profile Photo</LocalizedText>
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={{
              opacity: formAnim,
              transform: [
                {
                  translateY: formAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            }}
          >
            {/* Full Name */}
            <LocalizedText style={styles.label}>Full Name</LocalizedText>
            <View style={styles.inputWrapper}>
              <Icon name="user" size={18} color="#9e9e9e" style={styles.inputIcon} />
              <LocalizedTextInput
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor="#9e9e9e"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Phone */}
            <LocalizedText style={styles.label}>Phone Number</LocalizedText>
            <View style={styles.inputWrapper}>
              <Icon name="phone" size={18} color="#9e9e9e" style={styles.inputIcon} />
              <LocalizedTextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#9e9e9e"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Email */}
            <LocalizedText style={styles.label}>Email Address</LocalizedText>
            <View style={styles.inputWrapper}>
              <Icon name="mail" size={18} color="#9e9e9e" style={styles.inputIcon} />
              <LocalizedTextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor="#9e9e9e"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Gender */}
            <LocalizedText style={styles.label}>Gender</LocalizedText>
            <View style={styles.genderRow}>
              {['Male', 'Female', 'Other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderChip, gender === g && styles.genderChipActive]}
                  onPress={() => setGender(g)}
                  activeOpacity={0.8}
                >
                  <LocalizedText
                    style={[
                      styles.genderChipText,
                      gender === g && styles.genderChipTextActive,
                    ]}
                  >
                    {g}
                  </LocalizedText>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Save Button */}
        <Animated.View
          style={[
            styles.bottomBar,
            {
              paddingBottom: Platform.OS === 'ios' ? insets.bottom || 20 : 16,
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [80, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
            <LocalizedText style={styles.saveBtnText}>Save Changes</LocalizedText>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#55cc70',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  changePhotoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#55cc70',
  },

  // Form
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
    marginBottom: 10,
    marginTop: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#1a1a1a',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderChip: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#f5f6f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f5f6f8',
  },
  genderChipActive: {
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    borderColor: '#55cc70',
  },
  genderChipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#7a7a7a',
  },
  genderChipTextActive: {
    color: '#55cc70',
    fontFamily: 'Poppins-SemiBold',
  },

  // Bottom
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveBtn: {
    backgroundColor: '#55cc70',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#55cc70',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
});

export default EditProfileScreen;