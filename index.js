const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const onkyo = require('./src/onkyo/onkyo');

let tray = null;
let window = null;
let timeoutCloseWindow = null;

function createWindow() {
    window = new BrowserWindow({
        show: false,
        // width: 386,
        // height: 240,
        // x: 1500,
        // y: 800,
        transparent: true,
        // frame: false,
        skipTaskbar: true,
        useContentSize: true,
        // resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadFile('./src/main/main.html');
    window.on('blur', () => {
        clearTimeout(timeoutCloseWindow);
        timeoutCloseWindow = setTimeout( () => {
            window.hide()
        }, 500)
    })


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

app.on('ready', () => {
    tray = new Tray('./src/img/tray_16.png');

    const contextMenu = Menu.buildFromTemplate([
        {label: "Visit github page", type: "normal"},
        {label: "Quit app", role: "quit", type: "normal"}
    ])
    
    tray.setToolTip("Onkyo App");
    tray.setContextMenu(contextMenu);

    createWindow();

    tray.on('click', () => {
        if ( window.isVisible() ) {
            clearTimeout(timeoutCloseWindow);
            console.log('Window was visible, hiding...');
            window.hide();
        } else {
            console.log('Window was hidden, showing...');
            clearTimeout(timeoutCloseWindow);
            window.show();
        }
    })


});

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