import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocalizedText from '../../i18n/LocalizedText';
import TouchableOpacity from '../AnimatedTouchableOpacity';

type FeedbackKind = 'success' | 'error' | 'info';

interface DialogState {
  title: string;
  message: string;
  actionLabel: string;
}

interface FeedbackContextValue {
  showDialog: (title: string, message: string, actionLabel?: string) => void;
  showToast: (message: string, kind?: FeedbackKind) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const TOAST_DURATION_MS = 2800;

export const FeedbackProvider = ({ children }: React.PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [toast, setToast] = useState<{ message: string; kind: FeedbackKind } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-12)).current;

  const showDialog = useCallback((title: string, message: string, actionLabel = 'OK') => {
    setDialog({ title, message, actionLabel });
  }, []);

  const showToast = useCallback((message: string, kind: FeedbackKind = 'info') => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    setToast({ message, kind });
    toastOpacity.setValue(0);
    toastTranslateY.setValue(-12);
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(toastTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
    toastTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: -12,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setToast(null);
        }
      });
      toastTimer.current = null;
    }, TOAST_DURATION_MS);
  }, [toastOpacity, toastTranslateY]);

  useEffect(() => () => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
  }, []);

  const value = useMemo(() => ({ showDialog, showToast }), [showDialog, showToast]);
  const toastColor = toast?.kind === 'error'
    ? '#d64545'
    : toast?.kind === 'success'
      ? '#258e43'
      : '#2f6f49';
  const toastIcon = toast?.kind === 'error'
    ? 'alert-circle'
    : toast?.kind === 'success'
      ? 'check-circle'
      : 'info';

  return (
    <FeedbackContext.Provider value={value}>
      <View style={styles.root}>
        {children}
        {toast && (
          <Animated.View
            pointerEvents="none"
            accessibilityRole="alert"
            style={[
              styles.toast,
              {
                top: insets.top + 12,
                opacity: toastOpacity,
                transform: [{ translateY: toastTranslateY }],
                borderLeftColor: toastColor,
              },
            ]}
          >
            <Icon name={toastIcon} size={20} color={toastColor} />
            <LocalizedText style={styles.toastText}>{toast.message}</LocalizedText>
          </Animated.View>
        )}
      </View>
      <Modal
        transparent
        visible={dialog !== null}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setDialog(null)}
      >
        <View style={styles.dialogRoot}>
          <TouchableWithoutFeedback onPress={() => setDialog(null)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          {dialog && (
            <View
              accessibilityRole="alert"
              accessibilityViewIsModal
              style={styles.dialog}
            >
              <View style={styles.dialogIcon}>
                <Icon name="info" size={23} color="#258e43" />
              </View>
              <LocalizedText style={styles.dialogTitle}>{dialog.title}</LocalizedText>
              <LocalizedText style={styles.dialogMessage}>{dialog.message}</LocalizedText>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.dialogButton}
                activeOpacity={0.85}
                onPress={() => setDialog(null)}
              >
                <LocalizedText style={styles.dialogButtonText}>{dialog.actionLabel}</LocalizedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextValue => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider.');
  }
  return context;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderLeftWidth: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#183323',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 10,
  },
  toastText: {
    flex: 1,
    marginLeft: 12,
    color: '#24352a',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'Poppins-Medium',
  },
  dialogRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 28, 19, 0.52)',
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#102516',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
  dialogIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#eaf7ed',
  },
  dialogTitle: {
    color: '#18261c',
    fontSize: 18,
    lineHeight: 25,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  dialogMessage: {
    marginTop: 8,
    color: '#68756b',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  dialogButton: {
    minWidth: 112,
    marginTop: 22,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#258e43',
  },
  dialogButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
});
