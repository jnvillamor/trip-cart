module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['inline-import', { extensions: ['.sql'] }],
      // Must be last; required for react-native-reanimated 4.x
      'react-native-worklets/plugin',
    ],
  };
};
