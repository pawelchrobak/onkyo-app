const { ipcRenderer } = require('electron');
const onkyo = require('../onkyo/onkyo');


const infoSearching = document.getElementById('info-searching');
const receiverSelector = document.getElementById('receiver-selector');

var receiverList = [];

if ( receiverList.length == 0 ) {
    onkyo.onkyoDiscover( (list) => {
        infoSearching.classList = ['hidden'];
        receiverSelector.classList = [];
        
        receiverList = list;


        for ( let i = 0 ; i<list.length ; i++ ) {
            let option = document.createElement('option');
            option.innerText = list[i].name + ' ' + list[i].ip;
            receiverSelector.appendChild(option);
        }
    });
}

btnReceiverSearch.addEventListener('click', () => {
    ipcRenderer.send('asynchronous-message', 'search');
});

ipcRenderer.on('asynchronous-reply', (event, receiver) => {
    // console.log(arg);
    searchResult.innerText = receiver.name;
});

