import {MenuComponent, RENDER_TYPE} from './components/Menu/Menu.js';
import {safe} from './utils/safe.js';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js', {scope: '/'})
		.then((registration) => {
			console.log('sw registration on scope:', registration.scope);
		})
		.catch((err) => {
			console.error(err);
		});
}

const root = document.getElementById('root');

const configApp = {
	menu: {
		href: '/menu',
		openMethod: menuPage,
	},
	signup: {
		href: '/sighup',
		text: 'Зарегистрироваться',
		openMethod: signupPage,
	},
	login: {
		href: '/login',
		text: 'Войти',
		openMethod: loginPage,
	},
	profile: {
		href: '/profile',
		text: 'Профиль',
		openMethod: profilePage,
	},
	about: {
		href: '/about',
		text: safe('<iframe src="https://example.com" onload="alert(1);"></iframe>')
	}
};

const menuItems = Object.entries(configApp).map(([key, {href, text}]) => ({key, href, text}));

function createInput(type, text, name) {
	const input = document.createElement('input');
	input.type = type;
	input.name = name;
	input.placeholder = text;

	return input;
}

function menuPage() {
	const menu = new MenuComponent(root);
	menu.items = menuItems;
	menu.render(RENDER_TYPE.STRING);
}

function signupPage() {
	root.innerHTML = '';

	const form = document.createElement('form');

	const emailInput = createInput('email', 'Емайл', 'email');
	const passwordInput = createInput('password', 'Пароль', 'password');
	const ageInput = createInput('number', 'Возраст', 'age');

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Зарегистрироваться!';

	const back = document.createElement('a');
	back.textContent = 'назад';
	back.href = 'back';
	back.dataset.section = 'menu';


	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(ageInput);
	form.appendChild(submitBtn);
	form.appendChild(back);

	root.appendChild(form);
}

function loginPage() {
	root.innerHTML = '';

	const form = document.createElement('form');

	const emailInput = createInput('email', 'Емайл', 'email');
	const passwordInput = createInput('password', 'Пароль', 'password');

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Войти!';

	const back = document.createElement('a');
	back.textContent = 'назад';
	back.href = 'back';
	back.dataset.section = 'menu';

	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(submitBtn);
	form.appendChild(back);

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const email = emailInput.value.trim();
		const password = passwordInput.value;


		Ajax.post({
			url: '/login',
			body: {
				email,
				password
			},
			callback: (status => {
				if (status === 200) {
					profilePage();
					return;
				}

				alert('АХТУНГ! НЕТ АВТОРИЗАЦИИ');
				signupPage();
			})
		});
	});



	root.appendChild(form);
}

function profilePage() {
	root.innerHTML = '';

	// Ajax.get({
	// 	url: '/me',
	// 	callback: (status, responseText) => {
	// 		let isAuthorized = false;
	// 		if (status === 200) {
	// 			isAuthorized = true;
	// 		}


	// 		if (isAuthorized) {
	// 			const {age, score, images} = JSON.parse(responseText);

	// 			const span = document.createElement('span');
	// 			span.textContent = `Мне ${age} лет и я крутой на ${score} очков`;

	// 			root.appendChild(span);

	// 			const back = document.createElement('a');
	// 			back.textContent = 'назад';
	// 			back.href = 'back';
	// 			back.dataset.section = 'menu';

	// 			root.appendChild(back);

	// 			if (images && Array.isArray(images)) {
	// 				const div = document.createElement('div');
	// 				root.appendChild(div);

	// 				images.forEach((imageSrc) => {
	// 					div.innerHTML += `<img src="${imageSrc}" width="200"/>`
	// 				});
	// 			}

	// 			return;
	// 		}

	// 		alert('АХТУНГ, НЕТ АВТОРИЗАЦИИ');
	// 		loginPage();
	// 	}
	// });

	Ajax.getUsingFetch({
		url: '/me',
	})
	.then(({status, responseText}) => {
			const {age, score, images} = responseText;

			const span = document.createElement('span');
			span.textContent = `Мне ${age} лет и я крутой на ${score} очков`;

			root.appendChild(span);

			const back = document.createElement('a');
			back.textContent = 'назад';
			back.href = 'back';
			back.dataset.section = 'menu';

			root.appendChild(back);

			if (images && Array.isArray(images)) {
				const div = document.createElement('div');
				root.appendChild(div);

				images.forEach((imageSrc) => {
					div.innerHTML += `<img src="${imageSrc}" width="200"/>`
				});
			}

			return;

			
	})
	.catch(({status, responseText}) => {
		alert(`АХТУНГ, НЕТ АВТОРИЗАЦИИ ${status} && ${responseText}`);
		loginPage();
	});
}

menuPage();

root.addEventListener('click', (e) => {
	const {target} = e;

	if (target instanceof HTMLAnchorElement) {
		e.preventDefault();

		const {section} = target.dataset;
		if (section) {
			configApp[section].openMethod();
		}
	}

});
