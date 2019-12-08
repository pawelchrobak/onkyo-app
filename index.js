const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const onkyo = require('./src/onkyo/onkyo');

let tray = null;

function createWindow() {

    tray = new Tray('./src/power.ico');

    const contextMenu = Menu.buildFromTemplate([
        {label: "Item1", type:"radio"}
    ])

    tray.setToolTip("onkyo app");
    tray.setContextMenu(contextMenu);

    const window = new BrowserWindow({
        width: 400,
        height: 400,
        transparent: true,
        // frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadFile('./src/main-tmp/main.html');
    // window.webContents.openDevTools();

    // window.getElementById("poweron").onclick = function() {myFunction()};

    // function myFunction() {
    //     window.getElementById("poweron").innerHTML = "ON YAY!";
    // }

    // var pyshell =  require('python-shell');

    // pyshell.run('hello.py',  function  (err, results)  {
    //     if  (err)  throw err;
    //     console.log('hello.py finished.');
    //     console.log('results', results);
    // });
}

app.on('ready', createWindow);

ipcMain.on('asynchronous-message', (event, arg) => {
    // console.log(event);

    console.log(arg);

    onkyo.onkyoDiscover( (list) => {
        event.reply('asynchronous-reply', list[0]);
    });




    // let params = ["--discover"];
    // let cmd = require('child_process').spawn('onkyo', params);

    // cmd.stdout.on('data', ( data ) => {
    //     console.log('receivers found: ' + data.toString('utf8') );
    //     event.reply('asynchronous-reply', data.toString('utf8') );
    // })


});

// ipcMain.on('put-in-tray', (event) )