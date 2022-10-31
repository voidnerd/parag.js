import { render } from '../src/momo';

test('should render template', () => {
  expect(render('<p>Hello {{name}}</p>', { name: 'Ndie' })).toBe('<p>Hello Ndie</p>');
});

describe('Test if statements', () => {
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

  test('test truthy if statement', () => {
    expect(
      render(
        `@if(user.age > 19)
    <p>{{user.age}} is old enough</p>
    @elseif(user.age === 18)
    <p>Maybe you can drink</p>
    @endif`,
        {
          user: {
            age: 18,
          },
        },
      ),
    ).toMatch('<p>Maybe you can drink</p>');
  });

  test('test falsy if statement', () => {
    expect(
      render(
        `@if(user.age > 19)
    <p>{{user.age}} is old enough</p>
    @else
    <p>Not old enough</p>
    @endif`,
        {
          user: {
            age: 10,
          },
        },
      ),
    ).not.toMatch('<p>Not old enough</p>');
  });
});
