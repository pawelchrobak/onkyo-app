const { ipcRenderer } = require('electron');
const onkyo = require('../onkyo/onkyo');


const infoSearching = document.getElementById('info-searching');
const infoErrors = document.getElementById('info-errors');

const receiverSelector = document.getElementById('receiver-selector');
const controlPanel = document.getElementById('control-panel');
const controlHeader = document.getElementById('control-header');
const btnPower = document.getElementById('btn-power');
const statusPower = document.getElementById('status-power');

var receiverList = [];
var selectedReceiver;

onkyo.onkyoDiscover( (err,list) => {
    if (err) {
        infoErrors.innerText = err;

        infoSearching.classList = ['hidden'];
        infoErrors.classList = [];

        return;
    }
    
    infoSearching.classList = ['hidden'];
    controlHeader.classList = [];
    controlPanel.classList = [];

    
    receiverList = list;
    selectedReceiver = receiverList[0];
    
    for ( let i = 0 ; i<list.length ; i++ ) {
        let option = document.createElement('option');
        option.value = i;
        option.innerText = list[i].name;
        receiverSelector.appendChild(option);
    }

    receiverSelector.addEventListener('change', (event) => {
        selectedReceiver = receiverList[event.target.value];
        // console.log(selectedReceiver);
    })

    btnPower.addEventListener('click', (event) => {
        selectedReceiver.powerOn( (err,status) => {
            if (status) {
                statusPower.innerText = 'ON';
            }
        });
    })

    
    
});



// btnReceiverSearch.addEventListener('click', () => {
//     ipcRenderer.send('asynchronous-message', 'search');
// });

ipcRenderer.on('asynchronous-reply', (event, receiver) => {
    // console.log(arg);
    searchResult.innerText = receiver.name;
});

