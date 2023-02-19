/*Récupérer la date actuelle pour donner attribut min (+1j) et max (+1mois) a input date*/
let date = new Date;
let dateMin = new Date(date.setDate(date.getDate() + 1)).toLocaleString('fr-FR')
let dateMax = new Date(date.setMonth(date.getMonth() + 1)).toLocaleString('fr-FR')

/*formater la date au même format que la value de l'input*/
function setFormat(str) {
  return str.substring(0, 10).split('/').reverse().join('-');
}

let inputs = document.querySelectorAll('input');
let cookieExp = document.getElementById('cookieExp');
let form = document.querySelector('form');
let cookieList = document.getElementById('cookieList');

inputs[2].min = setFormat(dateMin);
inputs[2].max = setFormat(dateMax);
cookieList.style.display = 'none'

/* fonction de création des éléments, pour liste et pour récupération depuis cookies*/
function addCookie(name, val, expire) {

  let line = document.createElement('tr');
  line.classList.add('newCookie');

  let tdName = document.createElement('td');
  let txtName = document.createElement('h3');
  txtName.innerHTML = name;
  tdName.append(txtName);

  let tdVal = document.createElement('td');
  tdVal.innerHTML = val;

  let tdExpire = document.createElement('td');
  let txtExpire = document.createElement('h5');
  txtExpire.innerHTML = expire;
  tdExpire.append(txtExpire)

  let tdBtn = document.createElement('td');
  let btn = document.createElement('button');
  btn.innerHTML = 'Effacer le cookie';
  tdBtn.append(btn)

  line.append(tdName, tdVal, tdExpire, tdBtn);
  cookieList.append(line);
}

/*submit form, vérification que le nom donné au cookie n'est pas déjà utilisé*/
form.addEventListener('submit', function (e) {
  e.preventDefault();
  let name = inputs[0].value;

  let auth = true;
  let actualCookies = document.querySelectorAll('.newCookie')
  actualCookies.forEach(cookie => {
    if (cookie.childNodes[0].childNodes[0].innerHTML == name) {
      alert('Vous avez déjà crée un cookie avec ce nom.');
      auth = false;
    }
  })
  if (auth) {
    let name = inputs[0].value;
    let val = inputs[1].value;
    let expire = inputs[2].value;
    addCookie(name, val, expire);
  }
})

/*afficher / masquer les éléments crées */
inputs[3].addEventListener('click', function () {
  if (inputs[3].value == 'Afficher les cookies') {
    cookieList.style.display = 'block';
    inputs[3].value = 'Masquer les cookies';
  }
  else if (inputs[3].value == 'Masquer les cookies') {
    cookieList.style.display = 'none';
    inputs[3].value = 'Afficher les cookies';
  }
})

/*MutationObserver, repère quand cookie crée ou supprimé, et enregistre liste cookies*/
const elementToObserve = document;
const observer = new MutationObserver(() => {
  let arrayOfCookies = document.querySelectorAll('.newCookie');
  arrayOfCookies.forEach(cookie => {
    let title = encodeURIComponent(cookie.childNodes[0].childNodes[0].innerText);
    let val = cookie.childNodes[1].innerText;
    let expire = cookie.childNodes[2].childNodes[0].innerText;
    expireDate = Date.parse(expire);
    let date = new Date(expireDate).toUTCString();

    document.cookie = `${title} = ${val}_${expire}; path=file://; expires=${date}`;
  })
})
observer.observe(elementToObserve, { subtree: true, childList: true })

/*récupération des cookies, et création des éléments*/
allCookies = document.cookie.split(';')
allCookies.forEach(cookie => {
  let retireName = cookie.split('=')[1]
  if (parseInt(retireName.split('_')[0]) >= 1 || parseInt(retireName.split('_')[0]) <= 1000) {
    let name = decodeURIComponent(cookie.split('=')[0]);
    let val = retireName.split('_')[0];
    let expire = retireName.split('_')[1];
    addCookie(name, val, expire);
  };
})