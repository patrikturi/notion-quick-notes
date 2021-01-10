const content = require('./content');

test('adds 1 + 2 to equal 3', () => {
  expect(content.getPageTitles(1)).toBe('hello');
});
