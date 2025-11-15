//const getString = window.location.search;
//console.log(getString);

const myInfo = new URLSearchParams(window.location.search);//la linea 1 y 2 la dejo incluida en la 4
//console.log(myInfo);

//uso get method
//console.log(myInfo.get('first'));
//console.log(myInfo.get('last'));
//console.log(myInfo.get('ordinance'));
//console.log(myInfo.get('date'));
//console.log(myInfo.get('location'));
//console.log(myInfo.get('phone'));
//console.log(myInfo.get('email'));

// capturo el id result de thanks.html
document.querySelector('#results').innerHTML = `
<p>Appointment for ${myInfo.get('first')} ${myInfo.get('last')}</p>
<p>Proxy ${myInfo.get('ordinance')} on ${myInfo.get('date')} in the location ${myInfo.get('location')}</p>
<p>your phone : ${myInfo.get('phone')} </p>
<p>Your email is :  ${myInfo.get('email')}</p>`;
