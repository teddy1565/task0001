/**
 * module declear
 */
const { app, BrowserWindow, Menu, MenuItem, shell ,ipcMain,ipcRenderer, webContents} = require('electron');
const path = require('path');
const mongo = require('mongodb');
const fs = require('fs');
const { error } = require('console');
/**
 * table declear
 */
const DBlist = (()=>{
    return JSON.parse(fs.readFileSync(`${__dirname}/DBlist.json`));
})();
/**
 * menuTemplate
 */
let menuBuild = [
    {
        label: 'About',
        submenu: [
            { label: 'author', click() { interduce(); } },
            {
                label: 'PoweredBy', submenu: [
                    { label: 'electron', click() { shell.openExternal("https://www.electronjs.org/") } },
                    { label: 'conerstone' },
                    { label: 'OpenJS', click() { shell.openExternal("https://openjsf.org/") } },
                    {
                        label: 'NoSQL', submenu: [
                            { label: 'MongoDB', click() { shell.openExternal("https://www.mongodb.com/cloud/atlas") } }
                        ]
                    },
                    { label: 'GitHub', click() { shell.openExternal("https://github.com/") } },
                    { label: 'HospitalRun', click() { shell.openExternal("https://hospitalrun.io/features/") } }
                ]
            },
            { label: 'zfp', click() { ZFP() } },
            { label: 'quit', click() { app.quit() } }
        ]
    },
    {
        label: 'Control',
        submenu: [
            { label: 'Mongo_DEMO', click() { Mon_Board(); } },
            { label: 'Docker_DEMO', click() { Docker_Board(); } }
        ]
    },
    {
        role: 'help',
        label: 'CopyRight@TeddyXiong',
        submenu: [
            {
                label: 'Learn More', click() {
                    shell.openExternal("https://github.com/teddy1565");
                }
            }
        ]
    }
];
let menu = Menu.buildFromTemplate(menuBuild);
Menu.setApplicationMenu(menu);
/**
 * window
 * s
 */
function Mon_Board() {
    let MON_control = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    MON_control.loadFile(path.join(__dirname,"./src/Mongo.html"));
    MON_control.webContents.on('did-finish-load',()=>{
        /** */
        /*(()=>{
            let DBL = fs.readFileSync(`${__dirname}/ButtonLIST.json`);
            for(let i in DBL){
                MON_control.webContents.send('ButtonListRefresh',)
            }
            
        })();*/
        /** */
        for(let i in DBlist){
            mongo.MongoClient.connect(`${DBlist[i].IP}`,{useUnifiedTopology: true },(err,db)=>{
                if(err){
                    err = null;
                    DBlist[i].status = "connection lost";
                    DBlist[i].statusCode = "0";
                    return 0;
                }
                DBlist[i].status = "online";
                DBlist[i].statusCode = "1";
                MON_control.webContents.send('RefreshDBstatus',`${JSON.stringify(DBlist[i])}`);
                db.close();
            });
        }
    });
}
function Docker_Board() {
    let Docker_control = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
}
function ZFP() {
    let w = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: false,
            webgl: true,
            plugins: true,
            enableBlinkFeatures: true,
            enableWebSQL: true,
            enableRemoteModule: true
        }
    });
    w.loadURL("http://aspzfp.tpech.gov.tw/zfp");
}
function interduce() {
    let inter_window = new BrowserWindow(
        {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false
            }
        }
    );
    inter_window.loadFile(path.join(__dirname, './src/interduce.html'));
    
}
function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false
        }
    });
    mainWindow.loadURL("https://cornerstonejs.org/");
}
app.whenReady().then(createWindow);
/**
 * ipcCommunication
 */
ipcMain.on('DBtest',(Event,args)=>{
    mongo.MongoClient.connect("mongodb://localhost:27017/",(err,db)=>{
        if(err)throw err;
        console.log("running");
        db.close();
    });
    Event.reply("B");
});
/**
 * app end
 */
app.on('window-all-closed', () => {
    if (process.platform === 'win32') {
        app.quit();
    }
});
