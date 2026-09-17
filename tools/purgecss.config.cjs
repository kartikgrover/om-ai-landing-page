// Builds styles/bootstrap-subset.min.css; run command is in CLAUDE.md.
module.exports = {
  content: ['**/*.html', '*.js', 'assets/js/*.js'],
  skippedContentGlobs: ['node_modules/**', 'docs/**'],
  safelist: {
    // added at runtime by bootstrap.bundle.js
    standard: ['show', 'collapsing', 'collapsed', 'active', 'disabled'],
    greedy: [/data-bs-popper/],
  },
  keyframes: true,
  fontFace: true,
  variables: true,
};
