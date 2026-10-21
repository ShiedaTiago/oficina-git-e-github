module.exports = {
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js', 'tests/integration/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['app/**/*.js', 'features/**/*.js'],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 },
    },
  },
};
