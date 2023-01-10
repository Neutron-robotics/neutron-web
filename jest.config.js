/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve("uuid"),
  },
  // transformIgnorePatterns: ["node_modules/(?!neutron-core)/"],
};

module.exports = config;
