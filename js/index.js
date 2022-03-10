'use strict';
import i18Obj from './translate.js';
const langToggle = document.querySelector('.lang-toggle');
const enLang = document.querySelector('.en-lang');
const ruLang = document.querySelector('.ru-lang');
const hamburgerIcon = document.getElementById('hamburger');
const overlay = document.querySelector('.overlay');
const mainNav = document.querySelector('.main-nav');
const portfolioBtnWrapper = document.querySelector('.btn-wrapper');
const gallery = document.querySelector('.gallery');
const toggleThemeButton = document.querySelector('.theme-toggle');
const contactsTitle = document.querySelector('.contacts h2');
const headerSkills = document.querySelector('.skills');
const headerPortfolio = document.querySelector('.portfolio');

const storage = window.localStorage;

window.addEventListener('load', () => {
	//preloader
	document.body.classList.add('loaded_hiding');
	window.setTimeout(function () {
		document.body.classList.add('loaded');
		document.body.classList.remove('loaded_hiding');
	}, 500);
	//lang
	if (storage.lang && storage.lang === 'ru') {
		getTranslate(storage.lang);
		storage.setItem('lang', 'ru');
		ruLang.classList.add('active-lang');
		if (enLang.classList.contains('active-lang')) {
			enLang.classList.remove('active-lang');
		}
		headerSkills.classList.add('ru');
		headerPortfolio.classList.add('ru');
		contactsTitle.classList.add('ru');
	} else if (storage.lang && storage.lang === 'eng') {
		getTranslate(storage.lang);
		enLang.classList.add('active-lang');
		if (ruLang.classList.contains('active-lang')) {
			enLang.classList.remove('active-lang');
		}
		headerSkills.classList.remove('ru');
		contactsTitle.classList.remove('ru');
		headerPortfolio.classList.remove('ru');
	} else {
		enLang.classList.add('active-lang');
	}
	//theme
	if (storage.theme && storage.theme === 'white') {
		document.body.classList.add('white-theme');
	}
})

//logic for hamburger menu
const closeMenu = () => {
	hamburgerIcon.classList.remove('is-active');
	mainNav.classList.remove('active-nav');
	overlay.classList.remove('overlay-active');
}

hamburgerIcon.addEventListener('click', () => {
	hamburgerIcon.classList.toggle('is-active');
	mainNav.classList.toggle('active-nav');
	overlay.classList.toggle('overlay-active');
})

mainNav.addEventListener('click', closeMenu);

//logic for changing seasons in portfolio.
portfolioBtnWrapper.addEventListener('click', (e) => {
	e.preventDefault();
	if (e.target.nodeName === 'BUTTON') {
		portfolioBtnWrapper.childNodes.forEach((node) => {
			if (node.classList) {
				node.classList.remove('active-portfolio');
			}
		})
		e.target.classList.add('active-portfolio');
		let season = e.target.classList[1];
		let galleryChildren = gallery.children;
		for (let i = 0; i < galleryChildren.length; i++) {
			galleryChildren[i].childNodes[0].src = `assets/img/${season}/${i + 1}.jpg`
		}
	}
})

//logic for translation
function getTranslate(lang) {
	let matchingElements = [];
	const allNodes = document.getElementsByTagName('*');
	for (var i = 0, n = allNodes.length; i < n; i++) {
		if (allNodes[i].getAttribute('data-i18') !== null) {
			matchingElements.push(allNodes[i]);
		}
	}
	matchingElements.forEach((node) => {
		let value = node.getAttribute('data-i18');

		if (node.classList.contains('form-field')) {
			node.setAttribute('placeholder', i18Obj[lang][value]);
		} else {
			node.innerText = i18Obj[lang][value];
		}
	})
}

langToggle.addEventListener('click', (e) => {
	e.preventDefault();
	let language = e.target.getAttribute('data-lang');
	getTranslate(language);
	if (language === 'ru') {
		storage.setItem('lang', 'ru');
		headerSkills.classList.add('ru');
		headerPortfolio.classList.add('ru');
		contactsTitle.classList.add('ru');
	} else {
		storage.setItem('lang', 'en');
		headerSkills.classList.remove('ru');
		contactsTitle.classList.remove('ru');
		headerPortfolio.classList.remove('ru');
	}
	for (let i = 0; i < langToggle.children.length; i++) {
		if (langToggle.children[i].classList && langToggle.children[i].classList.contains('active-lang')) {
			langToggle.children[i].classList.remove('active-lang');
		}
	}
	e.target.classList.add('active-lang');
})

//change theme
toggleThemeButton.addEventListener('click', () => {
	document.body.classList.toggle('white-theme');
	if (document.body.classList.contains('white-theme')) {
		storage.setItem('theme', 'white');
	} else {
		storage.removeItem('theme');
	}
})

//buttons effect
const buttons = document.querySelectorAll('.btn-click')
const clickEffect = function (e) {
	e.preventDefault();
	console.log('prevent default for buttons to see the buttons effect')
	const effect = document.createElement('span')
	effect.classList.add('effect')
	effect.style.top = e.offsetY + 'px'
	effect.style.left = e.offsetX + 'px'

	this.appendChild(effect)

	setTimeout(() => effect.remove(), 500)
}
buttons.forEach((node) => {
	node.addEventListener('click', clickEffect)
})

console.log('Смена изображений в секции portfolio +25\n-при кликах по кнопкам Winter, Spring, Summer, Autumn в секции portfolio отображаются изображения из папки с соответствующим названием +20\n-кнопка, по которой кликнули, становится активной т.е. выделяется стилем. Другие кнопки при этом будут неактивными +5\n 2.Перевод страницы на два языка +25\n-при клике по надписи ru англоязычная страница переводится на русский язык +10\n-при клике по надписи en русскоязычная страница переводится на английский язык +10\n-надписи en или ru, соответствующие текущему языку страницы, становятся активными т.е. выделяются стилем +5\n3.Переключение светлой и тёмной темы +25\n-На страницу добавлен переключатель при клике по которому:\n-тёмная тема приложения сменяется светлой +10\n-светлая тема приложения сменяется тёмной +10\n-после смены светлой и тёмной темы интерактивные элементы по-прежнему изменяют внешний вид при наведении и клике и при этом остаются видимыми на странице (нет ситуации с белым шрифтом на белом фоне) +5\n4.Дополнительный функционал: выбранный пользователем язык отображения страницы и светлая или тёмная тема сохраняются при перезагрузке страницы +5\n5.Дополнительный функционал: сложные эффекты для кнопок при наведении и / или клике + 5')