//                                                          BUTTONS

// Обробник для кнопки "Гра 1"
document.getElementById('game1-btn').addEventListener('click', function() {
    window.location.href = 'game1/game1/game_memory_card.html';  // Переходить на сторінку Гра 1
});

// Обробник для кнопки "Гра 2"
document.getElementById('game2-btn').addEventListener('click', function() {
    window.location.href = 'game2/game2/game_maze.html';  // Переходить на сторінку Гра 2
});

// Обробник для кнопки "Гра 1"
document.getElementById('game1-btn-1').addEventListener('click', function() {
    window.location.href = 'game1/game1/game_memory_card.html';  // Переходить на сторінку Гра 1
});

// Обробник для кнопки "Гра 2"
document.getElementById('game2-btn-2').addEventListener('click', function() {
    window.location.href = 'game2/game2/game_maze.html';  // Переходить на сторінку Гра 2
});


let lastScrollY = 0;
let initialButtonPosition = null;
let initialMountainPosition = null;
let maxHeight = 15; // Максимальна висота кнопок у vh
let minHeight = 9; // Мінімальна висота кнопок у vh

window.addEventListener('scroll', () => {
    const buttonContainer = document.querySelector('.hero__buttons');
    const mountainContainer = document.querySelector('.eyewitness--stories__mountains');
    const yetiContainer = document.querySelector('.under--mountain--yeti');

    // Ініціалізація початкових позицій
    if (initialButtonPosition === null) {
        initialButtonPosition = buttonContainer.getBoundingClientRect().top + window.scrollY;
    }

    if (initialMountainPosition === null) {
        initialMountainPosition = mountainContainer.getBoundingClientRect().top + window.scrollY;
    }

    const buttonContainerPosition = buttonContainer.getBoundingClientRect().top;
    const mountainContainerPosition = mountainContainer.getBoundingClientRect().top;

    // Додаємо/знімаємо фіксований клас для кнопок
    if (buttonContainerPosition <= 10 && window.scrollY > lastScrollY) {
        buttonContainer.classList.add('hero__buttons--fixed');
        buttonContainer.classList.add('hero__buttons--shrink');
    } 
    else if (window.scrollY <= initialButtonPosition && window.scrollY < lastScrollY) {
        buttonContainer.classList.remove('hero__buttons--fixed');
    }

    // Додаємо/знімаємо фіксований клас для гір
    if (mountainContainerPosition <= 0 && window.scrollY > lastScrollY) {
        mountainContainer.classList.add('eyewitness--stories__mountains--fixed');
        yetiContainer.classList.add('under--mountain--yeti--fixed');
    } 
    else if (window.scrollY <= initialMountainPosition && window.scrollY < lastScrollY) {
        mountainContainer.classList.remove('eyewitness--stories__mountains--fixed');
        yetiContainer.classList.remove('under--mountain--yeti--fixed');
    }

    // Додаткове зменшення кнопок
    if (buttonContainerPosition <= 0) {
        const buttons = document.querySelectorAll('.hero__buttons .button');
        const shrinkStart = initialButtonPosition; // Початкова точка зменшення
        const shrinkEnd = shrinkStart + 70; // Точка, коли кнопки досягають мінімального розміру

        if (window.scrollY > shrinkStart && window.scrollY < shrinkEnd) {
            const scrollProgress = window.scrollY - shrinkStart;
            const newHeight = Math.max(
                minHeight,
                maxHeight - (scrollProgress / (shrinkEnd - shrinkStart)) * (maxHeight - minHeight)
            );

            buttons.forEach(button => {
                button.style.height = `${newHeight}vh`;
            });

            if (newHeight >= 9 && window.scrollY < lastScrollY) {
                buttonContainer.classList.remove('hero__buttons--shrink');
            }


        } else if (window.scrollY >= shrinkEnd) {
            // Встановлюємо мінімальний розмір, якщо прокрутка перевищує кінець
            buttons.forEach(button => {
                button.style.height = `${minHeight}vh`;
            });
        } else if (window.scrollY <= shrinkStart) {
            // Встановлюємо максимальний розмір, якщо прокрутка повертається до початку
            buttons.forEach(button => {
                button.style.height = `${maxHeight}vh`;
            });
        }
    }

    lastScrollY = window.scrollY;
});






//                                                          yeti-count

// Ініціалізуємо змінну для підрахунку
let yetiCount = 0;

// Створюємо набір ID для зображень єті
const yetiIds = ["hidden--yeti--1", "hidden--yeti--2", "hidden--yeti--3", "hidden--yeti--4"];

// Функція для показу спливаючого вікна
function showPopup() {
    const popup = document.getElementById("popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");

    // Закриваємо автоматично через 5 секунд
    setTimeout(() => {
        popup.classList.remove("active");
        popup.classList.add("hidden");
    }, 15000);
}

// Додаємо подію на кнопку закриття
document.getElementById("close-popup").addEventListener("click", () => {
    const popup = document.getElementById("popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
});

// Оновлення функції для перевірки завершення
function updateCounter() {
    const counterButton = document.getElementById("mountain--mover");
    const counterButton1 = document.getElementById("mountain--mover-1");
    if (counterButton) {
        yetiCount++;
        counterButton.querySelector("h3").textContent = `Лічильник: ${yetiCount}/4`;
        counterButton1.querySelector("h3").textContent = `Лічильник: ${yetiCount}/4`;
        counterButton.style.border = '10px solid #A69911';
        counterButton1.style.border = '5px solid #A69911';
        setTimeout(() => {
            counterButton.style.border = '5px solid #0b163b';
            counterButton1.style.border = '0px solid #0b163b';
        }, 1000);

        // Якщо всі єті знайдені, показуємо вітання
        if (yetiCount === 4) {
            showPopup();
        }
    }
}

// Набір для відстеження вже оброблених єті
const observedYetis = new Set();

// Функція для перевірки основних умов
function checkPrimaryConditions(element) {
    const id = element.id;

    if (id === "hidden--yeti--1" || id === "hidden--yeti--2" || id === "hidden--yeti--4") {
        // Перевіряємо, чи opacity = 1
        const opacity = parseFloat(getComputedStyle(element).opacity);
        return opacity === 1;
    }

    if (id === "hidden--yeti--3") {
        // Перевіряємо, чи mountain-3 має клас mountain--move
        const mountain3 = document.getElementById("mountain-3");
        return mountain3 && mountain3.classList.contains("mountain--move");
    }

    return false;
}

// Функція для перевірки видимості
function isVisible(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < windowHeight &&
        rect.left < windowWidth
    );

}

// Спостереження за основними умовами
function observeConditions() {
    yetiIds.forEach((id) => {
        const element = document.getElementById(id);

        if (element && !observedYetis.has(id)) {
            // Перевіряємо основні умови
            if (checkPrimaryConditions(element)) {
                // Якщо основні умови виконуються, перевіряємо видимість
                if (isVisible(element)) {
                    observedYetis.add(id); // Додаємо в оброблені
                    updateCounter(); // Оновлюємо лічильник
                }
            }
        }
    });
}

// Функція для постійного спостереження
function startObserving() {
    observeConditions(); // Викликаємо перевірку умов
    requestAnimationFrame(startObserving); // Плануємо наступну перевірку
}

// Викликаємо початок спостереження
startObserving();











//                                                          mountain--move
const mountainMover = document.getElementById('mountain--mover');
const mountainMover1 = document.getElementById('mountain--mover-1');
const mountain = document.getElementById('mountain-3'); // Один елемент

mountainMover.addEventListener('mouseover', () => {
    mountain.classList.add('mountain--move'); // Додаємо клас
});

mountainMover.addEventListener('mouseout', () => {
    mountain.classList.remove('mountain--move'); // Видаляємо клас
});

mountainMover1.addEventListener('mouseover', () => {
    mountain.classList.add('mountain--move'); // Додаємо клас
});

mountainMover1.addEventListener('mouseout', () => {
    mountain.classList.remove('mountain--move'); // Видаляємо клас
});





//                                                          mountain--animation
document.addEventListener('scroll', () => {
    const mountain1 = document.getElementById('mountain-1');
    const mountain2 = document.getElementById('mountain-2');
    const mountain3 = document.getElementById('mountain-3');
    const yeti = document.querySelector('.under--mountain--yeti');
    const eyewitnessContent = document.querySelector('.eyewitness--stories__content');
    const eyewitnessSection = document.querySelector('.eyewitness--stories');
    const nextSection = document.querySelector('.in--cave');

    // Отримуємо положення секції
    const eyewitnessBottom = eyewitnessSection.getBoundingClientRect().bottom;
    const viewportHeight = window.innerHeight;

    // Перевіряємо, чи пройшов низ секції нижню грань екрана
    if (eyewitnessBottom <= viewportHeight && window.scrollY > lastScrollY) {
        mountain1.classList.add('mountain-expand');
        mountain2.classList.add('mountain-slide-right');
        mountain3.classList.add('mountain-slide-right');
        yeti.classList.remove('yeti-slide-right');
        eyewitnessContent.classList.add('text-slide-right');
        nextSection.style.opacity = '1';
    } else if (eyewitnessBottom > viewportHeight * 0.7 && window.scrollY < lastScrollY) {
        mountain1.classList.remove('mountain-expand');
        mountain2.classList.remove('mountain-slide-right');
        mountain3.classList.remove('mountain-slide-right');
        yeti.classList.add('yeti-slide-right');
        eyewitnessContent.classList.remove('text-slide-right');
        nextSection.style.opacity = '';
    }

});







//                                                          lightning--button
// Вибираємо всі параграфи у секції
const paragraphs = document.querySelectorAll('.content--container');
const button = document.getElementById('change-color-button');
const imgInsideButton = button.querySelector('img'); // Зображення всередині кнопки
const yeti = document.getElementById('hidden--yeti--4');

// Визначений градієнт
const fixedGradient = 'radial-gradient(ellipse at 20% 0, #A69911, #a6d6e0)';

// Додаємо слухач події на кнопку
button.addEventListener('click', () => {
    // Перевіряємо поточний стан градієнта першого параграфа
    const currentBackground = window.getComputedStyle(paragraphs[0]).backgroundImage;
    const isGradientApplied = currentBackground.includes('radial-gradient');

    // Перемикаємо градієнти
    paragraphs.forEach(paragraph => {
        if (isGradientApplied) {
            paragraph.style.backgroundImage = ''; // Скидаємо фон
        } else {
            paragraph.style.backgroundImage = fixedGradient; // Встановлюємо градієнт
            paragraph.style.backgroundClip = 'text'; // Градієнт тільки на тексті
            paragraph.style.webkitBackgroundClip = 'text'; // Для підтримки в браузерах WebKit
        }
    });

    // Перемикаємо зображення на кнопці
    if (isGradientApplied) {
        imgInsideButton.src = 'lightning-off.png'; // Шлях до початкового зображення
        yeti.style.opacity = '';

    } else {
        imgInsideButton.src = 'lightning.png'; // Шлях до зміненого зображення
        yeti.style.opacity = '1';

    }
});







//                                                          adaptive
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menu = document.querySelector('.menu');
const counter = document.getElementById('mountain--mover-1');

menuToggle.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
    counter.style.opacity = counter.style.opacity === '0' ? '1' : '0';
    menuToggle.classList.toggle('open');

});

window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        menu.style.background = '#0b163b'; // Непрозорий фон
    } else {
        menu.style.background = '#0b163b00'; // Прозорий фон
    }
});

//                                                          music
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundMusic');
    let hasInteracted = false;
    // Function to play audio
    function playAudio() {
        if (!hasInteracted) {
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playback started successfully
                    hasInteracted = true;
                    removeEventListeners();
                })
                .catch(error => {
                    // Auto-play was prevented
                    console.log("Playback prevented:", error);
                });
            }
        }
    }
    // Function to remove event listeners
    function removeEventListeners() {
        document.removeEventListener('scroll', playAudio);
        document.removeEventListener('click', playAudio);
        document.removeEventListener('keydown', playAudio);
    }
    // Add event listeners for common user interactions
    document.addEventListener('scroll', playAudio);
    document.addEventListener('click', playAudio);
    document.addEventListener('keydown', playAudio);
});