const {app, BrowserWindow} = require('electron');

function createWindow () {
    window = new BrowserWindow({width: 800, height: 600});
    window.loadFile('index.html');
    
    var params = ["--discover"];

    var cmd = require('child_process').spawn('onkyo', params);

    cmd.stdout.on('data',function(data){
        console.log(data.toString('utf8'));
    });

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