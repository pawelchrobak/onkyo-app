const { ipcRenderer } = require('electron');

const btnReceiverSearch = document.getElementById('btn-receiver-search');
const searchResult = document.getElementById('search-result');



btnReceiverSearch.addEventListener('click', () => {
    ipcRenderer.send('asynchronous-message', 'search');
});

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    // console.log(arg);
    searchResult.innerText = arg;
});