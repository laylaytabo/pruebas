var request = require("request");
var fs = require("fs")
const { exec } = require('child_process');
//console.log("Service online Check server")
setInterval(function(){
  console.log("make request ");
  createLog("BackUp created in ")
  backupDatabase();
}, 300*60*1000);


function createLog (msn) {

  if (!fs.existsSync('./databaselog.txt')) {

    fs.writeFile("./databaselog.txt", "backupcreated ");
  }
  fs.readFile('./log.txt', (err, data) => {
      if (err) throw err;
      var date = new Date();
      var info = data + "\n" + msn + " " + date;
      fs.writeFile("./log.txt", info);
  });

}
function backupDatabase () {
  //docker exec -t your-db-container pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
  exec('sudo docker exec -it 122f7bf1b887 mongodump --db moviedb -o /dump', (err, stdout, stderr) => {

    if (err) {
      // node couldn't execute the command
      return;
    }
  });
}