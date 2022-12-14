# Parag.js

Parag.js is a fast and lightweight template engine for nodejs with zero dependencies. It offers you tags that make interpolating javascript into your `HTML` look clean and readable, even with nested conditionals and loops.

## Installation

```bash
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

We recommend that you use the `renderFile` function as it is cached on first render.

```js
const Parag = require('parag');

const user = {
  name: 'Void',
};

const result = Parag.renderFile('./example/hello.parag', user);
console.log(result); // => <p>Hello Void</p>
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

### Comments
Comments are not included in rendered result
```
{# This is a comment #}
```

### Partials

You can render partials in your template with the `@include` tag.

```js
@include("partials/header")
```

A partial inherits all data properties of its parent template. You can also pass extra data to partials with an object.

```js
@include("partials/footer", {year: "2022"})
```

### Parag with Frontend Libraries
For libraries that conflict with this template engine, you can use the `@` symbol to render content as is.

```js
const result = Parag.render('<p>Count: @{{ count }}</p>');
console.log(result); // <p> Count: {{ count }} </p>
```


## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
