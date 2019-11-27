const {app, BrowserWindow, ipcMain} = require('electron');
// const { PythonShell } = require('python-shell');

// PythonShell.runString('x=1+1;print(x)', null, function (err, results) {
//     if (err) throw err;
//     console.log('results: %j', results);
//   });

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadFile('./src/main/main.html');
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
    let params = ["--discover"];
    let cmd = require('child_process').spawn('onkyo', params);

    cmd.stdout.on('data', ( data ) => {
        console.log('receivers found: ' + data.toString('utf8') );
        event.reply('asynchronous-reply', data.toString('utf8') );
    })


});
