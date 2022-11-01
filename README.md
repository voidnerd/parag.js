# Parag

Parag is a nodejs templating engine inpired by the beautiful syntax of laravel blade.


## Interpolation

- Escaped
```html
<p> Hello {{name}} </p>
```

- Unescaped

```html
<div>{! article.body !} </div>
```

## Conditionals 

```php
@if(user.age > 21)
  <p>Proper adult</p>
@elseif(user.age > 18 && user.age < 21)
  <p>Early adult</p>
@else
  <p>Kid</p>
@endif
```


# Loop
Sopports all javascript `for` loop

```php
<ul>
  @for(user of users)
    <li> {{user.name}}</li>
  @endfor
</ul>
```

