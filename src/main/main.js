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
const volumeRange = document.getElementById('volume-range');
const srcBtnPC = document.getElementById('src-pc');
const srcBtnChromecast = document.getElementById('src-chromecast');

const SRC_PC = ["video3","game/tv","game","game1"];
const SRC_CHROMECAST = ["cd","tv/cd"];

var receiverList = [],
    selectedReceiver = null,
    broadcastAddress = '192.168.1.255';

infoBox.innerText = 'Searching for receivers...';

function mangeUI(status) {

    function setVol(vol) {
        status['master-volume'] = vol;

        volumeVal.innerText = vol;
        volumeRange.value = vol;
    }

    function setPwr(pwr) {
        status['system-power'] = pwr;

        if ( pwr == 'on' ) {
            btnPower.classList = 'btn status-on';
        } else {
            btnPower.classList = 'btn status-off';
        }
    }

    function setSrc(src) {
        status['input-selector'] = src;

        switch (JSON.stringify(src)) {
            case JSON.stringify(SRC_PC):
                srcBtnPC.classList = 'btn status-on';
                srcBtnChromecast.classList = 'btn';
                break;
            case JSON.stringify(SRC_CHROMECAST):
                srcBtnPC.classList = 'btn';
                srcBtnChromecast.classList = 'btn status-on';
                break;
            default:
                srcBtnPC.classList = 'btn';
                srcBtnChromecast.classList = 'btn';
        }
    }

    setVol(status['master-volume']);
    setPwr(status['system-power']);
    setSrc(status['input-selector']);

    eiscp.connect({host: selectedReceiver.host});

    eiscp.on('master-volume' , (vol) => { setVol(vol) });
    eiscp.on('system-power'  , (pwr) => { setPwr(pwr) });
    eiscp.on('input-selector', (src) => { setSrc(src) });

    btnPower.addEventListener('click', () => {
        if ( status["system-power"] == "on" ) {
            eiscp.command('main.system-power=off');
        } else {
            eiscp.command('main.system-power=on');
        }
    });

    volumeRange.addEventListener('input', () => {
        volumeVal.innerText = volumeRange.value;
    });
    volumeRange.addEventListener('change', () => {
        eiscp.command('main.master-volume='+volumeRange.value);
    });

    srcBtnPC.addEventListener('click', () => { eiscp.command('main.input-selector='+SRC_PC[0]) });
    srcBtnChromecast.addEventListener('click', () => { eiscp.command('main.input-selector='+SRC_CHROMECAST[0]) });

    infoBox.classList = 'hidden';
    controlHeader.classList = '';
    controlPanel.classList = '';
}


function getAllStatusInfo() {
    eiscp.close();
    let status = {
        'system-power': undefined,
        'input-selector': undefined,
        'master-volume': undefined
    }

    function checkQueries() {
        let gotAllData = true;
        for ( let stat in status ) {
            console.log(stat);
            if ( status[stat] == undefined ) { gotAllData = false }
        }

        if (gotAllData == true) {
            eiscp.close();
            eiscp.removeAllListeners();
            mangeUI(status);
        }
    }

    eiscp.connect({host: selectedReceiver.host, reconnect: false});
    eiscp.on('connect', () => {
        eiscp.command('main.system-power=query');
        eiscp.command('main.input-selector=query');
        eiscp.command('main.master-volume=query');
    })

    eiscp.on('system-power', (pwr) => {
        status["system-power"] = pwr;
        checkQueries();
    })

    eiscp.on('input-selector', (src) => {
        status["input-selector"] = src;
        checkQueries();
    })

    eiscp.on('master-volume', (vol) => {
        status["master-volume"] = vol;
        checkQueries();
    })

}

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

        getAllStatusInfo();

    }
});