import './style.css'

import './style.css';

// IMAGE SLIDER //
const slideBtns = document.querySelectorAll('[data-slideBtn]'); // get slide buttons
const slideContainer = document.querySelector('[data-slideContainer]'); // get slide container
const slides = [...document.querySelectorAll('[data-slide]')]; // get slides
let currentIndex = 0; // current slide index
let isMoving = false; // is slider moving

// btn handle function
function handleSlideBtnClick(e){ // handle btn click
  if(isMoving) return; // if slider is moving, return
  isMoving = true; // set isMoving to true
  e.currentTarget.id === "prev" // if prev btn clicked
    ? currentIndex-- // decrement index
    : currentIndex++; // else increment index
  slideContainer.dispatchEvent(new Event("sliderMove")); // dispatch event
}

// remove/add attribute function
const removeDisabledAttribute = (els) => els.forEach(el => el.removeAttribute('disabled')); // remove disabled attribute
const addDisabledAttribute = (els) => els.forEach(el => el.setAttribute('disabled', 'true')); // add disabled attribute

// event listeners
slideBtns.forEach(btn => btn.addEventListener('click', handleSlideBtnClick)); // btn click event

slideContainer.addEventListener('sliderMove', () => { // slider move event
  // 1. translate the container to the right/left
  slideContainer.style.transform = `translateX(-${currentIndex * slides[0].clientWidth}px)`; // 100% = 1 slide
  // 2. remove disabled attributes
  removeDisabledAttribute(slideBtns); // remove disabled attribute from all btns
  // 3. reenable disabled attribute if needed
  currentIndex === 0 && addDisabledAttribute([slideBtns[0]]); // prev
})

// transition end event
slideContainer.addEventListener('transitionend', () => isMoving = false); // reset isMoving

// disable image drag events
document.querySelectorAll('[data-slide] img').forEach(img => img.ondragstart = () => false); // disable drag

// intersection observer for slider
const slideObserver = new IntersectionObserver((slide) => {
  if(slide[0].isIntersecting){
    addDisabledAttribute([slideBtns[1]]); // disable next btn
  }
}, {threshold: .75}); // 75% of slide must be visible

slideObserver.observe(slides[slides.length - 1]); // observe last slide

// FORM HANDLE //
const contactForm = document.querySelector('#contact-form');
const contactBtn = document.querySelector('#contact-btn');
const contactInput = document.querySelector('#email');

// fake sending email to api endpoint
function postEmailToDatabase(email){
  console.info(`Your email is ${email}`);
  return new Promise(resolve => setTimeout(resolve, 2000));
}

// options for submit button
const contactBtnOptions = {
  pending: `
    <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>
    <span class="uppercase tracking-wide animate-pulse">
    Sending...
    </span>
  `,
  success: `
  <span class="uppercase tracking-wide">
    Thank you!
    </span>
    <span class="uppercase tracking-wide">
    ✌️
    </span>`,
};


async function handleFormSubmit(e){
  e.preventDefault();
  addDisabledAttribute([contactForm, contactBtn]); // disable form and button
  contactBtn.innerHTML = contactBtnOptions.pending; // change button text
  const userEmail = contactInput.value; // get email
  contactInput.style.display = "none"; // hide input
  await postEmailToDatabase(userEmail); // fake sending email
  contactBtn.innerHTML = contactBtnOptions.success; // change button text
}

// event listener form submit
contactForm.addEventListener('submit', handleFormSubmit); // form submit event

// FADE UP OBSERVER //
function fadeUpObserverCallback(elsToWatch){ // callback function
  elsToWatch.forEach((el) => { // loop through elements
    if(el.isIntersecting){ // if element is intersecting
      el.target.classList.add('faded'); // add faded class
      fadeUpObserver.unobserve(el.target); // unobserve element
      el.target.addEventListener("transitionend", () => { // remove faded class after transition
        el.target.classList.remove('fade-up', 'faded'); // remove classes
      }, { once: true }) // only run once
    } 
  }) // end loop
}

const fadeUpObserverOptions = { 
  threshold: .6, // 60% of element must be visible
}

const fadeUpObserver = new IntersectionObserver( // create observer
  fadeUpObserverCallback, // callback function
  fadeUpObserverOptions // options
);

document.querySelectorAll('.fade-up').forEach((item) => { // loop through elements
  fadeUpObserver.observe(item); // observe element
})
