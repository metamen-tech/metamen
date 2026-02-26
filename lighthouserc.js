module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/login',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/tasks',
        'http://localhost:3000/store',
      ],
      startServerCommand: '',
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 204800 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci-report',
    },
  },
};
