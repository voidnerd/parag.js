import { render, renderFile } from '../src/parag';

describe('Test interpolation', () => {
  test('should render template', () => {
    expect(renderFile(process.cwd() + '/examples/hello.html', { name: 'Void' })).toBe('<p>Hello Void</p>');
  });

  test('should escape values', () => {
    expect(renderFile(process.cwd() + '/examples/hello.html', { name: '<span>Void</span>' })).toBe(
      '<p>Hello &lt;span&gt;Void&lt;/span&gt;</p>',
    );
  });

  test('should not escape values', () => {
    expect(renderFile(process.cwd() + '/examples/hello_raw.html', { name: '<span>Void</span>' })).toBe(
      '<p>Hello <span>Void</span></p>',
    );
  });
});

describe('Test conditional statements', () => {
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

  test('test else if statement', () => {
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
    ).toMatch('<p>Not old enough</p>');
  });
});

describe('Test loop', () => {
  test('test for of loop', () => {
    expect(
      render(`<div>@for(let fruit of fruits)<span>{{fruit}}</span>@endfor</div>`, {
        fruits: ['mango', 'orange'],
      }),
    ).toMatch('<div><span>mango</span><span>orange</span></div>');
  });
});
