import './../css/style.css'
import '../css/style.sass'
import icono from './../images/logo.svg';
import imgWorking from './../images/illustration-working.svg';

const logo = document.querySelector('.logo').src = `${icono}`;
const working = document.querySelector('.working').src = `${imgWorking}`;
const iconNav = document.querySelector('.icon-nav');
const nav = document.querySelector('.container-nav');
const closeNav = document.querySelectorAll('.close_nav');

iconNav.addEventListener('click', function(e){
    nav.style.transition = "all .8s";
    nav.classList.toggle('vista');
});

closeNav.forEach(function(element){
    element.addEventListener('click', function(e){
        nav.classList.remove('vista');
    });
});

let altoPantalla = window.screen.height;
let anchoPantalla = window.screen.width;

let anchoImagen = 733; 
let altoImagen = 482; 

let anchoActual;
let altoActual;


const btnUrl = document.querySelector('.url-button');
const inputUrl = document.querySelector('.url-input');
const inputMessage = document.querySelector('.url-message');
const containerLinks = document.querySelector('.container-links');

let itemsUrls = [];

let miArray = localStorage.getItem('myArray');
let nuevoArray2 = []
nuevoArray2 = JSON.parse(miArray);

const ulrInicio = function(){
   

    if(nuevoArray2){
        nuevoArray2.map(function(i){
            let item = document.createElement('div');
                item.classList.add('link');
                item.innerHTML =  `
                    <p class="link-user">${i.long}</p>
                    <p class="link-short">${i.short}</p>
                    <input type="text" class="link-short___input" value="${i.short}">
                    <button class="link-copy">Copy</button>
                `;
            containerLinks.appendChild(item);
        })
        return 
    }else{
        return 
    }
}

ulrInicio()



btnUrl.addEventListener('click', function(e){
    e.preventDefault();

    if(!inputUrl.value){
        inputUrl.classList.add("url-input-active");
        inputMessage.textContent = 'Pleasse add link';
        return inputMessage.classList.add('active');
    }
   
    this.innerText = '';
    let loading = `<div class="lds-dual-ring"></div>`;
    this.innerHTML = loading;



    let urlUser = inputUrl.value;
    const peticion =  fetch(`https://api.shrtco.de/v2/shorten?url=${urlUser}`);

    peticion
        .then( resp => {
            resp.json().then( data => {
              

                if( data.ok === false){
                    inputUrl.value = '';
                    inputUrl.classList.add("url-input-active");
                    inputMessage.textContent = 'This is not a valid URL';
                    this.innerHTML = '';
                    this.innerText = 'Shorten it!';

                    return inputMessage.classList.add('active');
                }
                
                let itemObj = {
                    short: data.result.full_short_link2,
                    long: urlUser
                };
                
                itemsUrls.push(itemObj);

                let arrayCombinacion ;
             

                if(nuevoArray2){
                    arrayCombinacion = [...nuevoArray2,  ...itemsUrls]
                }else{
                    arrayCombinacion = [ ...itemsUrls]
                }

                
                
                localStorage.setItem('myArray', JSON.stringify(arrayCombinacion));
            
                let miArray = localStorage.getItem('myArray');
                let nuevoArray = JSON.parse(miArray);

              


                inputUrl.value = '';
                this.innerHTML = '';
                this.innerText = 'Shorten it!';

                let item = document.createElement('div');
                item.classList.add('link');
                item.innerHTML =  `
                    <p class="link-user">${urlUser}</p>
                    <p class="link-short">${data.result.full_short_link2}</p>
                    <input type="text" class="link-short___input" value="${data.result.full_short_link2}">
                    <button class="link-copy">Copy</button>
                `;
               
                containerLinks.appendChild(item);

                const itemsLinks = document.querySelectorAll('.link')
                itemsLinks.forEach( (element) => {
                    
                    element.childNodes[7].addEventListener('click', function(e){
                        const itemsCopy = document.querySelectorAll('.link .link-copy')
                        
                        itemsCopy.forEach( (element) => {
                            element.textContent = 'Copy';
                            element.classList.remove('active')
                        })
                        
                        let elemento2 = element.childNodes[5];
                        elemento2.select();
                        document.execCommand('copy');
                        this.textContent = 'Copied!';
                        this.classList.add('active');
                    })
                    
                
                });
                
            })
        })
        .catch( data => {
            this.innerHTML = '';
            this.innerText = 'Shorten it!';
        })
});



inputUrl.addEventListener('keydown', function(){
    inputUrl.classList.remove("url-input-active");
    inputMessage.classList.remove('active');
    return inputMessage.textContent = '';
})





