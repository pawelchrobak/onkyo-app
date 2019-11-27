const cp = require('child_process');

function onkyoDiscover() {
    // returns array of onkyo receivers objects
    let receiverList = [];

    let cmd = cp.spawn('onkyo',['--discover']);
    cmd.stdout.on('data', (data) => {
        data = data.toString('utf8');
        let rawList = data.split('\r\n');

        for (let i = 0 ; i < rawList.length ; ) {
            if ( rawList[i] == '' ) {
                rawList.splice(i,1);
            } else {
                i++;
            }
        }

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
                console.log(tmpObj.name);
            } else { valid = false; }

            if ( rawList[i][1][0].length == 4 &&
                 typeof rawList[i][1][0][0] === 'number' &&
                 typeof rawList[i][1][0][1] === 'number' &&
                 typeof rawList[i][1][0][2] === 'number' &&
                 typeof rawList[i][1][0][3] === 'number' ) {
                tmpObj.ip = rawList[i][1][0];
                console.log(tmpObj.ip)
            } else { valid = false; }

            if ( typeof rawList[i][1][1] === 'number' ) {
                tmpObj.port = rawList[i][1][1];
                console.log(tmpObj.port)
            } else { valid = false; }

            if ( typeof rawList[i][2] === 'string' && rawList[i][2].length == 12 ) {
                tmpObj.mac = rawList[i][2];
                console.log(tmpObj.mac)
            } else { valid = false; }

            console.log('tmpObj:');
            console.log(tmpObj)
        }

        

        console.log('rawList:');
        console.log(rawList);



        // for (let i = 0 ; i < rawList.length ; i++ ) {
        //     let tmpList = [];
        //     if ( list[i] == '' ) {
        //         list.splice(i,1);
        //     } else {
        //         i++;
        //     }
        // }



    });
}

function test() {
    let receiverList = [];

    let cmd = cp.spawn('test.bat',[]);
    cmd.stdout.on('data', (data) => {
        data = data.toString('utf8');
        let arr = data.split(' ');
        // for ()
        console.log(arr);
    });
    console.log('nic sie nie stalo');
}


class OnkyoReceiver {
    constructor(name, ip, port, mac) {
        this.name = name;
        this.ip = ip;
        this.port = port;
        this.mac = mac;
    }

    powerOn() {
        
        console.log('powering on ' + this.name);
    }

    powerOff() {
        console.log('powering off ' + this.name);
    }

    setVolume(vol) {
        console.log('powering off ' + this.name);
    }

}

module.exports.OnkyoReceiver = OnkyoReceiver;
module.exports.onkyoDiscover = onkyoDiscover;


onkyoDiscover();
