const cp = require('child_process');
const EventEmitter = require('events');

function onkyoDiscover(callback) {
    // gets array of onkyo receivers objects and passes them into callback function
    let receiverList = [];
    let errors;
    let cmd = cp.spawn('onkyo',['--discover']);

    cmd.stdout.on('data', (data) => {

        data = data.toString('utf8');

        let rawList = data.split('\n');

        // fix for \r\n
        for (let i = 0 ; i < rawList.length ; i++ ) {
            rawList[i] = rawList[i].split('\r')[0];
        }

        //deleting empty strings 
        for (let i = 0 ; i < rawList.length ; ) {
            if ( rawList[i] == '' ) {
                rawList.splice(i,1);
            } else {
                i++;
            }
        }

        //parsing every string from rawList array
        for (let i = 0 ; i<rawList.length ; i++) {
            rawList[i] = rawList[i].split('\t');
            rawList[i][1] = rawList[i][1].split(':');
            rawList[i][1][0] = rawList[i][1][0].split('.');
            
            for (let j = 0 ; j<rawList[i][1][0].length ; j++) {
                rawList[i][1][0][j] = parseInt(rawList[i][1][0][j]);
            }
                
            rawList[i][1][1] = parseInt(rawList[i][1][1]);

            let tmpObj = {};
            let valid = true;

            if ( (typeof rawList[i][0] === 'string') && (rawList[i][0].length > 0) ) {
                tmpObj.name = rawList[i][0];
            } else { valid = false; }

            if ( rawList[i][1][0].length == 4 &&
                 typeof rawList[i][1][0][0] === 'number' &&
                 typeof rawList[i][1][0][1] === 'number' &&
                 typeof rawList[i][1][0][2] === 'number' &&
                 typeof rawList[i][1][0][3] === 'number' ) {
                tmpObj.ip = rawList[i][1][0];
            } else { valid = false; }

            if ( typeof rawList[i][1][1] === 'number' ) {
                tmpObj.port = rawList[i][1][1];
            } else { valid = false; }

            if ( typeof rawList[i][2] === 'string' && rawList[i][2].length == 12 ) {
                tmpObj.mac = rawList[i][2];
            } else { valid = false; }

            if (valid) {
                receiverList.push(new OnkyoReceiver(tmpObj.name,tmpObj.ip,tmpObj.port,tmpObj.mac));
            }
        }
        
    });

    cmd.on('close', (code) => {

        if (receiverList.length == 0) {
            if (!errors) {
                errors = '';
            }
            errors += "Nie odnaleziono odbiorników Onkyo.\r\n"
        }

        callback(errors,receiverList);

    });
}

function makeParams(receiverObj, param) {
    //return params table to use in cp.spawn() command

    let params = ['--host',
                    receiverObj.ip[0]+'.'+receiverObj.ip[1]+'.'+receiverObj.ip[2]+'.'+receiverObj.ip[3],
                    '--port',
                    receiverObj.port,
                    param,
                    '-q',
                    '-q'];

    return params;
}

class OnkyoReceiver {
    
    constructor(name, ip, port, mac) {
        this.name = name;
        this.ip = ip;
        this.port = port;
        this.mac = mac;

        this.updateLoop = null;
        this.updateInterval = 500;

        this.virtualStatus = {
            power: null,
            volume: null,
            src: null
        }
    }

    setUpdateInterval(miliseconds) {
        this.updateInterval = miliseconds;
    }

    startUpdateLoop(callback) {
        // let
        if (this.updateLoop) { updateLoop.clearInterval() }

        this.updateLoop = setInterval( () => {
            this.statusQuery('power', (err,status) => { if (status) { this.virtualStatus.power = status } });
            this.statusQuery('volume', (err,status) => { if (status) { this.virtualStatus.volume = status } });
            this.statusQuery('source', (err,status) => { if (status) { this.virtualStatus.src = status } });
            console.log(`ONKYO POWER:${this.virtualStatus.power} SOURCE:${this.virtualStatus.src} VOLUME:${this.virtualStatus.volume}`);
        }, this.updateInterval)

    }

    powerOn(callback) {
        // run callback function after getting an answer, passing errors and status. status is true if receiver turned on or was on
        let errors;
        let status = false;
        let params = makeParams(this,'power.on');

        let cmd = cp.spawn('onkyo',params);

        cmd.stdout.on('data', (data) => {
            data = data.toString('utf8').split('\n')[0].split('\r')[0];

            if ( data != 'on') {
                errors = 'Failed to turn on receiver.'
            } else {
                status = true;
            }

        });

        cmd.on('close', (code) => {
            callback(errors,status);
        });

    }

    powerOff(callback) {
        let errors;
        let status = false;
        let params = makeParams(this,'power.off');

        let cmd = cp.spawn('onkyo',params);

        cmd.stdout.on('data', (data) => {
            data = data.toString('utf8').split('\n')[0].split('\r')[0];

            if ( data != 'standby,off' ) {
                errors = 'Failed to turn off a receiver.'
            } else {
                status = true;
            }
        });

        cmd.on('close', (code) => {
            callback(errors,status);
        })
    }

    statusQuery(param,callback) {
        let errors;
        let status;
        let params = makeParams(this,param+'.query');

        let cmd = cp.spawn('onkyo',params);

        cmd.stdout.on('data', (data) => {
            data = data.toString('utf8').split('\n')[0].split('\r')[0];
            status = data;
        });

        cmd.on('close', (code) => {
            if (code == 1) {
                errors = 'Could not complete query.'
            }
            callback(errors,status);
        })
    }

    setVolume(vol) {
        console.log('powering off ' + this.name);
    }

}

// for node testing
onkyoDiscover( (err,list) => {
    if (err) {
        console.log(err);
    } else {
        rec = list[0];
        // console.log(rec);

        rec.setUpdateInterval(200);
        rec.startUpdateLoop();
    }
})


module.exports.OnkyoReceiver = OnkyoReceiver;
module.exports.onkyoDiscover = onkyoDiscover;