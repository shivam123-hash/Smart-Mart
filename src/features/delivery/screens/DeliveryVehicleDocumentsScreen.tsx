import React, { useEffect, useRef, useState } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { Animated, Easing, Modal, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const DOCUMENTS = [
  {
    id: 'license',
    title: 'Driving licence',
    detail: 'Verified · Valid through Dec 2026',
    icon: 'credit-card' as const,
    reference: 'DL-••••-2048',
    holder: 'Delivery Partner',
    issuer: 'Regional Transport Office',
    validUntil: 'December 2026',
  },
  {
    id: 'registration',
    title: 'Vehicle registration',
    detail: 'Verified · Valid through Mar 2027',
    icon: 'file-text' as const,
    reference: 'DL 8S AB 2048',
    holder: 'Delivery Partner',
    issuer: 'Regional Transport Office',
    validUntil: 'March 2027',
  },
  {
    id: 'insurance',
    title: 'Vehicle insurance',
    detail: 'Verified · Valid through Jun 2027',
    icon: 'shield' as const,
    reference: 'POL-••••-4821',
    holder: 'Delivery Partner',
    issuer: 'Smart Cover Insurance',
    validUntil: 'June 2027',
  },
];

const DeliveryVehicleDocumentsScreen = ({ navigation }: { navigation: any }) => {
  const [selectedDocument, setSelectedDocument] = useState<(typeof DOCUMENTS)[number] | null>(null);
  const insets = useSafeAreaInsets();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const vehicleAnim = useRef(new Animated.Value(0)).current;
  const documentAnims = useRef(DOCUMENTS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const entrance = Animated.stagger(100, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(vehicleAnim, {
        toValue: 1,
        friction: 8,
        tension: 48,
        useNativeDriver: true,
      }),
    ]);
    entrance.start();

    const documentEntries = documentAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 350,
        delay: index * 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    );
    Animated.stagger(45, documentEntries).start();

    return () => {
      entrance.stop();
      documentEntries.forEach((animation) => animation.stop());
    };
  }, [documentAnims, headerAnim, vehicleAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-12, 0],
                }),
              }],
            },
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back to profile"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={19} color="#253329" />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <LocalizedText style={styles.eyebrow}>DELIVERY PARTNER</LocalizedText>
            <LocalizedText style={styles.title}>Vehicle & documents</LocalizedText>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.vehicleCard,
            {
              opacity: vehicleAnim,
              transform: [{
                translateY: vehicleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [22, 0],
                }),
              }, {
                scale: vehicleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.97, 1],
                }),
              }],
            },
          ]}
        >
          <View style={styles.vehicleCardTop}>
            <View style={styles.vehicleIcon}>
              <Icon name="truck" size={25} color="#ffffff" />
            </View>
            <View style={styles.vehicleStatus}>
              <View style={styles.statusDot} />
              <LocalizedText style={styles.vehicleStatusText}>ACTIVE VEHICLE</LocalizedText>
            </View>
          </View>
          <LocalizedText style={styles.vehicleType}>Scooter</LocalizedText>
          <LocalizedText style={styles.vehicleModel}>Honda Activa · Petrol</LocalizedText>
          <View style={styles.plate}>
            <Icon name="hash" size={13} color="#62736a" />
            <LocalizedText style={styles.plateText}>DL 8S AB 2048</LocalizedText>
          </View>
          <View style={styles.vehicleDivider} />
          <View style={styles.vehicleMeta}>
            <View style={styles.vehicleMetaItem}>
              <LocalizedText style={styles.metaLabel}>VEHICLE TYPE</LocalizedText>
              <LocalizedText style={styles.metaValue}>Two-wheeler</LocalizedText>
            </View>
            <View style={styles.metaSeparator} />
            <View style={styles.vehicleMetaItem}>
              <LocalizedText style={styles.metaLabel}>DELIVERY STATUS</LocalizedText>
              <LocalizedText style={styles.metaValue}>Approved</LocalizedText>
            </View>
          </View>
        </Animated.View>

        <View style={styles.sectionHeading}>
          <View>
            <LocalizedText style={styles.sectionTitle}>Required documents</LocalizedText>
            <LocalizedText style={styles.sectionSubtitle}>
              Keep these up to date to stay ready for deliveries
            </LocalizedText>
          </View>
          <View style={styles.verifiedCount}>
            <Icon name="check" size={11} color="#258e43" />
            <LocalizedText style={styles.verifiedCountText}>3 / 3</LocalizedText>
          </View>
        </View>

        {DOCUMENTS.map((document, index) => {
          const anim = documentAnims[index];
          return (
            <Animated.View
              key={document.id}
              style={{
                opacity: anim,
                transform: [{
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                }],
              }}
            >
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`View ${document.title}`}
                activeOpacity={0.8}
                onPress={() => setSelectedDocument(document)}
                style={styles.documentCard}
              >
                <View style={styles.documentIcon}>
                  <Icon name={document.icon} size={18} color="#4a78ad" />
                </View>
                <View style={styles.documentCopy}>
                  <LocalizedText style={styles.documentTitle}>{document.title}</LocalizedText>
                  <LocalizedText style={styles.documentDetail}>{document.detail}</LocalizedText>
                </View>
                <View style={styles.verifiedBadge}>
                  <Icon name="check-circle" size={15} color="#258e43" />
                </View>
                <Icon name="chevron-right" size={16} color="#a0aaa2" />
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Icon name="info" size={16} color="#5278a8" />
          </View>
          <LocalizedText style={styles.infoText}>
            Tap any document to view its details.
          </LocalizedText>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        onRequestClose={() => setSelectedDocument(null)}
        transparent
        visible={selectedDocument !== null}
      >
        <View
          style={[
            styles.previewSafeArea,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <View style={styles.previewHeader}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close document preview"
              onPress={() => setSelectedDocument(null)}
              style={styles.previewCloseButton}
            >
              <Icon name="x" size={20} color="#253329" />
            </TouchableOpacity>
            <LocalizedText style={styles.previewHeaderTitle}>Document preview</LocalizedText>
            <View style={styles.previewHeaderSpacer} />
          </View>
          {selectedDocument && (
            <ScrollView
              contentContainerStyle={styles.previewContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.previewLabel}>
                <Icon name="eye" size={13} color="#258e43" />
                <LocalizedText style={styles.previewLabelText}>DOCUMENT PREVIEW</LocalizedText>
              </View>
              <View style={styles.documentPreview}>
                <View style={styles.previewDocumentTop}>
                  <View style={styles.previewIssuerMark}>
                    <Icon
                      name={selectedDocument.icon}
                      size={20}
                      color="#258e43"
                    />
                  </View>
                  <View style={styles.previewIssuerCopy}>
                    <LocalizedText style={styles.previewIssuer}>{selectedDocument.issuer}</LocalizedText>
                    <LocalizedText style={styles.previewDocumentType}>{selectedDocument.title}</LocalizedText>
                  </View>
                  <View style={styles.previewVerified}>
                    <Icon name="check-circle" size={17} color="#258e43" />
                  </View>
                </View>

                <View style={styles.previewDivider} />
                <LocalizedText style={styles.previewHolderLabel}>DOCUMENT HOLDER</LocalizedText>
                <LocalizedText style={styles.previewHolder}>{selectedDocument.holder}</LocalizedText>
                <View style={styles.previewFields}>
                  <View style={styles.previewField}>
                    <LocalizedText style={styles.previewFieldLabel}>REFERENCE NUMBER</LocalizedText>
                    <LocalizedText style={styles.previewFieldValue}>{selectedDocument.reference}</LocalizedText>
                  </View>
                  <View style={styles.previewField}>
                    <LocalizedText style={styles.previewFieldLabel}>VALID THROUGH</LocalizedText>
                    <LocalizedText style={styles.previewFieldValue}>{selectedDocument.validUntil}</LocalizedText>
                  </View>
                </View>
                <View style={styles.previewStamp}>
                  <Icon name="check" size={13} color="#258e43" />
                  <LocalizedText style={styles.previewStampText}>VERIFIED</LocalizedText>
                </View>
                <LocalizedText style={styles.previewDisclaimer}>
                  Preview only. This is not an official document.
                </LocalizedText>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 18, paddingBottom: 30 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 19,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#f3f7f3',
    borderRadius: 13,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  headerCopy: { flex: 1, marginLeft: 12 },
  eyebrow: {
    color: '#2fa64c',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    letterSpacing: 1,
  },
  title: { color: '#202820', fontFamily: 'Poppins-Bold', fontSize: 17 },
  vehicleCard: {
    backgroundColor: '#258e43',
    borderRadius: 22,
    marginBottom: 25,
    overflow: 'hidden',
    padding: 19,
  },
  vehicleCardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.17)',
    borderRadius: 15,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  vehicleStatus: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  statusDot: {
    backgroundColor: '#b8f0c4',
    borderRadius: 3,
    height: 6,
    marginRight: 6,
    width: 6,
  },
  vehicleStatusText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  vehicleType: {
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    marginTop: 15,
  },
  vehicleModel: {
    color: 'rgba(255,255,255,0.78)',
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    marginTop: 1,
  },
  plate: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    flexDirection: 'row',
    marginTop: 13,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  plateText: {
    color: '#33453a',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    letterSpacing: 0.8,
    marginLeft: 5,
  },
  vehicleDivider: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: StyleSheet.hairlineWidth,
    marginVertical: 16,
  },
  vehicleMeta: { alignItems: 'center', flexDirection: 'row' },
  vehicleMetaItem: { flex: 1 },
  metaSeparator: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    height: 29,
    marginHorizontal: 12,
    width: StyleSheet.hairlineWidth,
  },
  metaLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  metaValue: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    marginTop: 3,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: '#202820', fontFamily: 'Poppins-SemiBold', fontSize: 14 },
  sectionSubtitle: {
    color: '#89918a',
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    marginTop: 3,
  },
  verifiedCount: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 9,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  verifiedCountText: {
    color: '#258e43',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    marginLeft: 4,
  },
  documentCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#edf1ed',
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 12,
  },
  documentIcon: {
    alignItems: 'center',
    backgroundColor: '#f0f5fc',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    marginRight: 11,
    width: 42,
  },
  documentCopy: { flex: 1 },
  documentTitle: { color: '#29342c', fontFamily: 'Poppins-SemiBold', fontSize: 11 },
  documentDetail: {
    color: '#89918a',
    fontFamily: 'Poppins-Regular',
    fontSize: 8,
    marginTop: 3,
  },
  verifiedBadge: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 10,
    height: 30,
    justifyContent: 'center',
    marginLeft: 7,
    width: 30,
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: '#f3f7fc',
    borderRadius: 13,
    flexDirection: 'row',
    marginTop: 8,
    padding: 12,
  },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: '#e6eef9',
    borderRadius: 9,
    height: 30,
    justifyContent: 'center',
    marginRight: 9,
    width: 30,
  },
  infoText: {
    color: '#6c7c91',
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    lineHeight: 15,
  },
  previewSafeArea: {
    backgroundColor: '#f5f7f5',
    flex: 1,
  },
  previewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  previewCloseButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 13,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  previewHeaderTitle: {
    color: '#202820',
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    marginLeft: 12,
  },
  previewHeaderSpacer: { width: 42 },
  previewContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  previewLabel: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  previewLabelText: {
    color: '#258e43',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    letterSpacing: 0.6,
    marginLeft: 6,
  },
  documentPreview: {
    backgroundColor: '#ffffff',
    borderColor: '#e4eae4',
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 440,
    overflow: 'hidden',
    padding: 20,
    width: '100%',
  },
  previewDocumentTop: { alignItems: 'center', flexDirection: 'row' },
  previewIssuerMark: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 13,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  previewIssuerCopy: { flex: 1, marginHorizontal: 11 },
  previewIssuer: { color: '#6d7a70', fontFamily: 'Poppins-Medium', fontSize: 8 },
  previewDocumentType: {
    color: '#253329',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    marginTop: 2,
  },
  previewVerified: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 11,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  previewDivider: {
    backgroundColor: '#edf1ed',
    height: StyleSheet.hairlineWidth,
    marginVertical: 21,
  },
  previewHolderLabel: {
    color: '#89918a',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    letterSpacing: 0.7,
  },
  previewHolder: {
    color: '#253329',
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    marginTop: 5,
  },
  previewFields: {
    backgroundColor: '#f7f9f7',
    borderRadius: 13,
    marginTop: 18,
    paddingHorizontal: 13,
  },
  previewField: {
    borderBottomColor: '#e8ede8',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
  },
  previewFieldLabel: {
    color: '#89918a',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  previewFieldValue: {
    color: '#33453a',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    marginTop: 4,
  },
  previewStamp: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#eaf8ed',
    borderRadius: 9,
    flexDirection: 'row',
    marginTop: 17,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  previewStampText: {
    color: '#258e43',
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    letterSpacing: 0.6,
    marginLeft: 5,
  },
  previewDisclaimer: {
    color: '#89918a',
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    lineHeight: 15,
    marginTop: 18,
    textAlign: 'center',
  },
});

export default DeliveryVehicleDocumentsScreen;
