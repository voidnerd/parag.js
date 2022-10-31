import { render } from '../src/momo';

test('should render template', () => {
  expect(render('<p>Hello {{name}}</p>', { name: 'Ndie' })).toBe('<p>Hello Ndie</p>');
});

describe('Test if statement', () => {

  test('test truthy if statement', () => {
    expect(
      render(
        `@if(user.age > 19)
    <p>{{user.age}} is old enough</p>
    @endif`,
        {
          user: {
            age: 20,
          },
        },
      ),
    ).toMatch('<p>20 is old enough</p>');
  });

  test('test falsy if statement', () => {
    expect(
      render(
        `@if(user.age > 19)
    <p>{{user.age}} is old enough</p>
    @endif`,
        {
          user: {
            age: 10,
          },
        },
      ),
    ).not.toMatch('<p>20 is old enough</p>');
  });
});
