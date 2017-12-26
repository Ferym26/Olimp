# Olimp

###
 - [land](http://namneks.pe.hu/olimp/)
 - [requests](http://namneks.pe.hu/olimp/requests.html)
 - [profile](http://namneks.pe.hu/olimp/profile.html)

### Подготовка к запуску:
 - Установить [NodeJs](https://nodejs.org)

### Для запуска выполните в корне проекта:
```sh
$ npm i
$ npm i -g gulp (*)
$ gulp
открыть в браузере http://localhost:3000/
(*) Для чистой системы
```

### Состав и технологии
 - pug, sass
 - botstap4.beta.2

### Структура
 - **app** - итоговые файлы
 - **core** - общие файлы
 - **frontend** - сами страницы и их стили

### Работа анимаций
 - используются animate.scss и waypoints.js
 - в **common.js** задаются параметры для функции
 ```
 $(".block").animated("block--anim", "n%");
 ```
 - **.block** элемент, или группа элементов, которые анимируем
 - **block--anim** класс, на котором висят стили анимации. задается в _animations.sass
 - **n%** точка срабатывания анимации. процент высоты экрана сверзу вниз
 - в **_animations.sass** задаются название анимации и тайминги
 - одиночный элемент
```
 .block--anim
	@include fadeIn($duration: 0.5s, $delay: 6.0s, $iterations: 1)
```
 - группа элементов
```
$item-number1:				3
$delay-all:					1s
$delay-item:				0.5s
@for $i from 1 through $item-number1
	.block--anim:nth-child(#{$i})
		@include fadeIn($duration: 0.5s, $delay: $delay-all + ($delay-item * $i) - $delay-item, $iterations: 1)
		opacity: 1
		transition: opacity 0.5s ease
```
 - **item-number** - кол-во элементов в группе
 - **$delay-all** - задержка перед началом анимации группы
 - **$delay-item** - задержка между анимациям элементов в группе
 - **fadeIn** - название анимации