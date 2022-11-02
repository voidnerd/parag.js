# Parag

Parag is a nodejs templating engine inpired by the beautiful syntax of laravel blade.

## Interpolation

- Escaped

```html
<p>Hello {{name}}</p>
```

If it's javascript, parag will interpolate the result.

```html
<p>{{["rice", "beans"].join(",")}}</p>
```

or

```html
<p>{{new Date()}}</p>
```

- Unescaped

```html
<div>{{! article.body !}}</div>
```

## Conditionals

Simple if statement

```html
@if(user)
  <p>{{user.name}}<p>
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

# Loops and Iteration

To keep things simple, parag only supports javascript `for` loop statments

- For..of loop statement

```html
<ul>
  @for(let user of users)
  <li>{{user.name}}</li>
  @endfor
</ul>
```

- For...of loop statement
```html
<ul>
  @for(let prop in user)
    <li> {{user[prop]}}</li>
  @endfor
</ul>
```

- for loop statement
```html
<ul>
  @for(let i = 0; i < 5; i++)
    <li> {{ "count: "  + i }}</li>
  @endfor
</ul>
```



## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.