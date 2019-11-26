const PgBackup = require('pg-backup')
 
const backup = new PgBackup({
  accountId: 'xxx',
  applicationKey: 'xxx',
  bucketId: 'xxx'
})

backup.run({ name: 'database-name' })
  .then(console.log)  