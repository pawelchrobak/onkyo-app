const { ipcRenderer } = require('electron');
const onkyo = require('../onkyo/onkyo');
const eiscp = require('eiscp');
const util = require('util');

const infoBox = document.getElementById('info-box');

const receiverSelector = document.getElementById('receiver-selector');
const controlHeader = document.getElementById('control-header');
const controlPanel = document.getElementById('control-panel');
const btnPower = document.getElementById('btn-power');
const volumeVal = document.getElementById('volume-val');
const virtualReceiver = {
    power: 'off'
};

var receiverList = [],
    selectedReceiver,
    broadcastAddress = '192.168.1.255';

infoBox.innerText = 'Searching for receivers...';

eiscp.discover({address: broadcastAddress}, (err,res) => {
    if (err) {
        infoBox.innerText = err;
        return;
    } else {
        receiverList = res;
        selectedReceiver = receiverList[0];

        for ( let i = 0 ; i<receiverList.length ; i++ ) {
            let receiver = document.createElement('option');
            receiver.value = i;
            receiver.innerText = receiverList[i].model;
            receiverSelector.appendChild(receiver);
        }

        infoBox.classList = 'hidden';
        controlHeader.classList = '';
        controlPanel.classList = '';
    }
})

// onkyo.onkyoDiscover( (err,list) => {
//     if (err) {
//         infoBox.innerText = err;
//         return;
//     }
    
//     infoBox.classList = 'hidden';
//     controlHeader.classList = '';
//     controlPanel.classList = '';

    
//     receiverList = list;
//     selectedReceiver = receiverList[0];
    
//     for ( let i = 0 ; i<list.length ; i++ ) {
//         let option = document.createElement('option');
//         option.value = i;
//         option.innerText = list[i].name;
//         receiverSelector.appendChild(option);
//     }

//     receiverSelector.addEventListener('change', (event) => {
//         selectedReceiver = receiverList[event.target.value];
//         // console.log(selectedReceiver);
//     })

//     btnPower.addEventListener('click', (event) => {
//         if ( virtualReceiver.power == 'off' ) {

//             selectedReceiver.powerOn( (err,status) => {
//                 if (status) {
//                     virtualReceiver.power = 'on';
//                     btnPower.classList = 'btn status-on';
//                 }
//             });

//         } else {
//             selectedReceiver.powerOff( (err,status) => {
//                 if (status) {
//                     virtualReceiver.power = 'off';
//                     btnPower.classList = 'btn status-off';
//                 }
//             });
//         }
//     });

    
    
// });



// btnReceiverSearch.addEventListener('click', () => {
//     ipcRenderer.send('asynchronous-message', 'search');
// });

ipcRenderer.on('asynchronous-reply', (event, receiver) => {
    // console.log(arg);
    searchResult.innerText = receiver.name;
});

