window.addEventListener('DOMContentLoaded', () => {
    //TABS

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    
    function tabsContenthidden() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => item.classList.remove('tabheader__item_active'));
    } 

    function showtabsContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    tabsContenthidden();
    showtabsContent();

    tabsParent.addEventListener('click', event => {
        const target = event.target;
       
        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item) {
                    tabsContenthidden();
                    showtabsContent(i);
                }

            });
        }
        
    });

    //TIMER

    const deadline = '2022-07-31';
    let days, hours, minutes, seconds;
    function getTimeRemaining (endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
              // НИЖЕ МЫ ПОЛУЧАЕМ КОЛ-ВО МИЛЛИСЕК В СУТКАХ
              // 1000 МИЛЛИСЕК * 60 СЕК * 60 МИНУТ * 24 ЧАСОВ В СУТКАХ
              days = Math.floor(t / (1000 * 60 * 60 * 24));
              // ЗДЕСЬ ПОЛУЧАЕМ КОЛ-ВО ЧАСОВ БЕЗ ОСТАТКА СУТОК
              // ЧТОБЫ ОИ НЕ ПЕРЕНОСИЛИСЬ НА ДНИ
              hours = Math.floor((t / (1000 * 60 *60) % 24)); 
              minutes = Math.floor((t / 1000 / 60) % 60);
              seconds = Math.floor((t / 1000) % 60);
        }


        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock (selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
              
        // ЧТОБЫ НЕ МИГАЛ ТАЙМЕР ПРИ ОБНОВЛ-И СРАЗУ ИНИЦИАЛИЗ-ЕМ ФУНКЦИЮ
        updateClock();  

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <=0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //MODAL

    const modal = document.querySelector('.modal'),
          modalTrigger = document.querySelectorAll('[data-modal]');


    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; // СТР ЗА МОДАЛ ОКНОМ ПЕРЕСТАЕТ СКРОЛЛИТЬСЯ 
        clearInterval(modalTimerId); // ОЧИЩ-ЕМ ТАЙМЕР, ЕСЛИ ПОЛЬЗ-ЛЬ САМ ОТКРЫЛ МОДАЛ ОКНО
    } 
    
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);

    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // ВОЗВР-ЕМ СКРОЛЛ НА СТР
    }



    // modalCloseBtn.addEventListener('click', closeModal); // В ОБР СОБЫТИЙ ФУНК НЕ ВЫЗ-СЯ СО СКОБКАМИ

    // ЗАКРЫТИЕ МОДАЛ ОКНА ПРИ КЛИКЕ ЗА ЕГО РАМКИ
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    // ЗАКРЫТИЕ МОДАЛ ОКНА ПРИ НАЖАТИИ ESCAPE
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // УСТАНОВКА ТАЙМЕРА ДЛЯ ПОЯВЛ-Я МОДАЛ ОКНА
    const modalTimerId = setTimeout(openModal, 50000);

    // ФОРМУЛА ОПРЕД-Я ПОЛНОЙ ПРОКРУТКИ СОДЕРЖИМОГО САЙТА И САМОГО СКРОЛЛА
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal();
            // УДАЛ-Е ПРОИСХ-Т ТОЛЬКО ТАК: ВНУТРИ ФУНК, КОТОР ВЫЗЫВ-СЬ В НАЗНАЧ-И ОБРАБ СОБЫТИЙ
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //MENU CARD

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes; // ПРИДЕТ КАК МАССИВ КЛАССОВ 
            this.transfer = 2.6;
            this.changeToUSD();
        }

        changeToUSD() {
            this.price = Math.floor(this.price / this.transfer);
        }

        render() {
            const elem = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                elem.classList.add(this.classes);
            } else {
            // МЫ ПЕРЕБЕР-М МАССИВ КЛАССОВ И ДОБАВЛ-М КАЖДЫЙ КЛАСС НАШЕМУ DIV ELEM
            this.classes.forEach(className => elem.classList.add(className));
            }

            elem.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> $/день</div>
                    </div>
            `;

            this.parent.append(elem);
        }

    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        229,
        '.menu .container',
        "menu__item", // пишем без точки птму что раб-ем через CLASSLIST ADD
        "big"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        550,
        ".menu .container",
        // "menu__item"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        430,
        ".menu .container",
        "menu__item"
    ).render();

    //FORMS

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
        
            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.success);
                    statusMessage.remove();
                    form.reset();
                } else {
                    showThanksModal(message.failure);
                }
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
    
});