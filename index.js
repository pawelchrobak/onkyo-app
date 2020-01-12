const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const onkyo = require('./src/onkyo/onkyo');

let tray = null;
let window = null;
let timeoutCloseWindow = null;

function createWindow() {
    window = new BrowserWindow({
        show: false,
        width: 330,
        height: 170,
        x: 1590,
        y: 998,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        useContentSize: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadFile('./src/main/main.html');

    window.on('blur', () => {
        clearTimeout(timeoutCloseWindow);
        timeoutCloseWindow = setTimeout( () => {
            window.hide()
        }, 100)
    });


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

// ipcMain.on('asynchronous-message', (event, arg) => {
//     // console.log(event);

//     console.log(arg);

//     onkyo.onkyoDiscover( (list) => {
//         event.reply('asynchronous-reply', list[0]);
//     });

// });