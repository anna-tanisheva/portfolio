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

const videoPlayer = document.querySelector('.video-player');
const overlayPlayer = videoPlayer.querySelector('.overlay-player');
const playButton = videoPlayer.querySelector('.play-button');
const video = videoPlayer.querySelector('.main-video');
const playToggler = videoPlayer.querySelector('.play-toggle');
const volumeToggler = videoPlayer.querySelector('.volume-toggle');
const timeLine = videoPlayer.querySelector('.timeline');
const volumeControl = videoPlayer.querySelector('.volume-lvl');

let isPlayed = false;
let isMuted = false;

let dragTimeline;
let grabTimeline;

let dragVolume;
let grabVolume;

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

//player logic

const hideOverlayPlayer = function () {
	overlayPlayer.classList.add('overlay-player-hidden');
	setTimeout(overlayPlayer.classList.add("hidden-overlay"), 300);
}
const toggleButton = function () {
	playButton.classList.toggle('hidden-overlay');
}
const changeBgPlay = function () {
	playToggler.classList.toggle('paused');
	playToggler.classList.toggle('played');
}
const changeBgMute = function () {
	volumeToggler.classList.toggle('muted');
	volumeToggler.classList.toggle('unmuted');
}
////////////////////////////////////////////////////////////////////
const calcCoordinate = function (e) {
	let width = window.getComputedStyle(e.target).getPropertyValue('width');
	let offset = e.offsetX;
	let clickXPercent = offset * 100 / +(width.split('p')[0]);
	return clickXPercent;
}
const calcCoordinateTouch = function (e) {
	if (e.target.nodeName === 'INPUT') {
		let coordinate = e.changedTouches[0].clientX;
		let coordinatePercent = (coordinate - e.target.getBoundingClientRect().left) * 100 / window.getComputedStyle(e.target).getPropertyValue('width').split('p')[0];
		return coordinatePercent;
	}

}

// Timeline Logic
const changeTimeLineBg = function () {
	timeLine.style.background = `linear-gradient(
		to right,
		rgb(189, 174, 130) 0%,
		rgb(189, 174, 130) ${timeLine.value / 1.77}%,
		rgb(200, 200, 200) ${timeLine.value / 1.77}%,
		rgb(200, 200, 200) 100%
	 )`
}
const changeTimeLine = function () {
	timeLine.value = video.currentTime * 3;
	changeTimeLineBg();
}

//Video toggle
const toggleVideo = function () {
	window.setInterval(changeTimeLine, 200);
	if (isPlayed) {
		toggleButton();
		changeBgPlay();
		video.pause();
		isPlayed = false;
	} else {
		toggleButton();
		changeBgPlay();
		video.play();
		isPlayed = true;
	}
}
timeLine.addEventListener('mouseover', function () { dragTimeline = true });
timeLine.addEventListener('mouseout', function () { dragTimeline = false; grabTimeline = false });
timeLine.addEventListener('mousedown', function () { grabTimeline = dragTimeline });
timeLine.addEventListener('mouseup', function () { grabTimeline = false });
timeLine.addEventListener('mousemove', function (e) {
	if (dragTimeline && grabTimeline) {
		if (!isPlayed) {
			video.currentTime = timeLine.value / 3;
		} else {
			video.pause();
			video.currentTime = timeLine.value / 3;
			video.play();
		}
	}
});
timeLine.addEventListener('mousedown', (e) => {
	let timelineOffset = calcCoordinate(e);
	let currentTimeSec = video.duration * timelineOffset / 100;
	video.currentTime = currentTimeSec;
});

//Touch event logic timeline
timeLine.addEventListener('touchstart', function () { dragTimeline = true; grabTimeline = dragTimeline });
timeLine.addEventListener('touchend', function () { grabTimeline = false });
timeLine.addEventListener('touchmove', function (e) {
	if (dragTimeline && grabTimeline) {
		if (!isPlayed) {
			video.currentTime = timeLine.value / 3;
		} else {
			video.pause();
			video.currentTime = timeLine.value / 3;
			video.play();
		}
	}
});
timeLine.addEventListener('touchstart', (e) => {
	if (!isPlayed) {
		let timelineOffset = calcCoordinateTouch(e);
		let currentTimeSec = video.duration * timelineOffset / 100;
		video.currentTime = currentTimeSec
	} else {
		video.pause();
		let timelineOffset = calcCoordinateTouch(e);
		let currentTimeSec = video.duration * timelineOffset / 100;
		video.currentTime = currentTimeSec
		video.play();
	}
});


// Volume Logic
const changeVolumeBG = function (e) {
	if (e.type.indexOf('touch') !== -1) {
		let bgOffset = calcCoordinateTouch(e);
		volumeControl.style.background = `linear-gradient(
			to right,
			rgb(189, 174, 130) 0%,
			rgb(189, 174, 130) ${bgOffset + 0.1}%,
			rgb(200, 200, 200) ${bgOffset + 0.1}%,
			rgb(200, 200, 200) 100%
		 )`
	} else {
		let bgOffset = calcCoordinate(e);
		volumeControl.style.background = `linear-gradient(
			to right,
			rgb(189, 174, 130) 0%,
			rgb(189, 174, 130) ${bgOffset + 0.1}%,
			rgb(200, 200, 200) ${bgOffset + 0.1}%,
			rgb(200, 200, 200) 100%
		 )`
	}
}
const changeVolumeLvl = function (e) {
	if (e.type.indexOf('touch') !== -1) {
		let volumeLvl = calcCoordinateTouch(e) / 100;
		if (isMuted) {
			toggleMuteSound();
		}
		if (volumeLvl < 0.03) {
			volumeLvl = 0;
			toggleMuteSound();
			video.volume = volumeLvl;
			volumeControl.value = 0;
		} else if (volumeLvl > 0.99) {
			volumeLvl = 1;
			video.volume = volumeLvl;
		} else {
			video.volume = volumeLvl;
		}
	} else {
		let volumeLvl = calcCoordinate(e) / 100;
		if (isMuted) {
			toggleMuteSound();
		}
		if (volumeLvl < 0.03) {
			volumeLvl = 0;
			toggleMuteSound();
			video.volume = volumeLvl;
			volumeControl.value = 0;
		} else if (volumeLvl > 0.99) {
			volumeLvl = 1;
			video.volume = volumeLvl;
		} else {
			video.volume = volumeLvl;
		}
	}
}
//Volume toggle
const toggleMuteSound = function () {
	if (isMuted) {
		changeBgMute();
		if (!video.volume) {
			video.volume = 0.1;
			volumeControl.value = 1;
		}
		video.muted = false;
		isMuted = false;
	} else {
		changeBgMute();
		video.muted = true;
		isMuted = true;
	}
}

volumeControl.addEventListener('mouseover', function () { dragVolume = true });
volumeControl.addEventListener('mouseout', function () { dragVolume = false; grabVolume = false });
volumeControl.addEventListener('mousedown', function () { grabVolume = dragVolume });
volumeControl.addEventListener('mouseup', function () { grabVolume = false });
volumeControl.addEventListener('mousemove', function (e) {
	if (dragVolume && grabVolume) {
		changeVolumeBG(e);
		changeVolumeLvl(e);
	}
});
volumeControl.addEventListener('mousedown', changeVolumeLvl);
volumeControl.addEventListener('mousedown', changeVolumeBG);

//Touch event logic volume
volumeControl.addEventListener('touchstart', function () { dragTimeline = true; grabTimeline = dragTimeline });
volumeControl.addEventListener('touchend', function () { grabTimeline = false });
volumeControl.addEventListener('touchmove', function (e) {
	if (dragTimeline && grabTimeline) {
		changeVolumeBG(e);
		changeVolumeLvl(e);
	}
});
volumeControl.addEventListener('touchstart', (e) => {
	changeVolumeLvl(e);
	changeVolumeBG(e);
});


playButton.addEventListener('click', hideOverlayPlayer, { once: true });
playButton.addEventListener('click', toggleVideo);
overlayPlayer.addEventListener('click', toggleVideo, { once: true });
overlayPlayer.addEventListener('click', hideOverlayPlayer, { once: true });
video.addEventListener('click', toggleVideo);
playToggler.addEventListener('click', toggleVideo);
volumeToggler.addEventListener('click', toggleMuteSound);
