import React from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { StyleSheet, View } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';

export type UserRole = 'customer' | 'delivery';

interface Props {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const ROLES: { role: UserRole; title: string; description: string }[] = [
  {
    role: 'customer',
    title: 'Customer',
    description: 'Shop for groceries',
  },
  {
    role: 'delivery',
    title: 'Delivery partner',
    description: 'Deliver customer orders',
  },
];

const RoleSelector = ({ selectedRole, onRoleChange }: Props) => (
  <View style={styles.container}>
    <LocalizedText style={styles.label}>Continue as</LocalizedText>
    <View style={styles.options}>
      {ROLES.map(({ role, title, description }) => {
        const selected = role === selectedRole;

        return (
          <TouchableOpacity
            key={role}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onRoleChange(role)}
            activeOpacity={0.8}
            style={[styles.option, selected && styles.selectedOption]}
          >
            <View style={styles.optionHeader}>
              <LocalizedText style={[styles.title, selected && styles.selectedText]}>
                {title}
              </LocalizedText>
              <View style={[styles.radio, selected && styles.selectedRadio]}>
                {selected && <View style={styles.radioDot} />}
              </View>
            </View>
            <LocalizedText style={styles.description}>{description}</LocalizedText>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    flex: 1,
    minHeight: 68,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    backgroundColor: '#ffffff',
  },
  selectedOption: {
    borderColor: '#55cc70',
    backgroundColor: '#f4fbf6',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  title: {
    flexShrink: 1,
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  selectedText: {
    color: '#2fa64c',
  },
  description: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#bdbdbd',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  selectedRadio: {
    borderColor: '#55cc70',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#55cc70',
  },
});

export default RoleSelector;
