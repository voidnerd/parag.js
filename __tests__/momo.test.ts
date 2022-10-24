import { render } from '../src/momo';

test('should render template', () => {
  expect(render('<p>Hello {{name}}</p>', { name: 'Ndie' })).toBe('<p>Hello Ndie</p>');
});
