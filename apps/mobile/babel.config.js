module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // Must stay last: Reanimated/Worklets rewrites function bodies.
    plugins: ["react-native-worklets/plugin"],
  };
};
