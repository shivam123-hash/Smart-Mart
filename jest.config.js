module.exports = {
  preset: '@react-native/jest-preset',
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/server/'],
  moduleNameMapper: {
    '\\.(ttf|otf)$': '<rootDir>/__mocks__/fontMock.js',
    '^react-native-razorpay$': '<rootDir>/__mocks__/razorpayMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|react-native-.*|@react-native(-community|-async-storage|-vector-icons)?|@react-navigation)/)',
  ],
};
