# Parag

Parag is a fast and lightweight template engine for nodejs with zero dependencies.

## Installation

```
npm install parag
```

## Usage

Below is an example of how to use parag

```js
const Parag = require('parag');

const data = {
  title: 'The matrix',
  year: '1999',
};

const result = Parag.render('<p>{{title}} was released in {{year}}</p>', data);
console.log(result); // => <p>The matrix was released in 1999</p>
```

Same code with typescript

```ts
import * as Parag from 'parag';

const data: Record<string, string> = {
  title: 'The matrix',
  year: '1999',
};

const result: string = Parag.render('<p>{{title}} was released in {{year}}</p>', data);
console.log(result); // => <p>The matrix was released in 1999</p>
```

#### Usage with express

```js
const express = require('express');
const app = express();
const port = 3000;

app.set('views', './view');
app.set('view engine', 'parag');

app.get('/', (req, res) => {
  res.render('hello', { name: 'void' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

#### Make vscode treat parag file extensions as html

1. Go to Code > Preferences > Settings
2. Search "File associations"
3. Click on "Add Item"
4. Add (`*.parag`) as extension(item) and `html` as associated language(value).

# Features

### Interpolation

All results are escaped by default.

```html
<p>Hello {{name}}</p>
```

If it's javascript, parag will interpolate the result.

```html
<div>
  <p>{{["rice", "beans"].join(",")}}</p>
  <p>{{new Date()}}</p>
</div>
```

You can also render unescaped results

```html
<div>{{! article.body !}}</div>
```

### Conditionals

Simple if statement

```html
@if(user)
<p>{{user.name}}</p>
@endif
```

if, else if and else chain.

```html
@if(user.age > 21)
  <p>Proper adult</p>
@elseif(user.age > 18 && user.age < 21)
  <p>Early adult</p>
@else
  <p>Kid</p>
@endif
```

### Loops and Iteration

To keep things simple, parag only supports javascript `for` loop statements

- For..of loop statement

```html
<ul>
  @for(let user of users)
  <li>{{user.name}}</li>
  @endfor
</ul>
```

- For...in loop statement

```html
<ul>
  @for(let prop in user)
  <li>{{user[prop]}}</li>
  @endfor
</ul>
```

- for loop statement

```html
<ul>
  @for(let i = 0; i < 5; i++)
  <li>{{ "count: " + i }}</li>
  @endfor
</ul>
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
