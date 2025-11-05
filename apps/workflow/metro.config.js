const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Patch Metro's cache require to use the private export path
const originalResolver = config.resolver;
config.resolver = {
  ...originalResolver,
  unstable_enablePackageExports: false,
};

module.exports = config;
