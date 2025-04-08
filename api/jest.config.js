// jest.config.js
module.exports = {
    preset: 'ts-jest', // If you're using TypeScript
    testEnvironment: 'node',
    moduleNameMapper: {
        // If you have path aliases, configure them here
        '^@/(.*)$': '<rootDir>/$1',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore node_modules and dist folders
};
