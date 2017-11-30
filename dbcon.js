var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_lees6',
  password        : '2185',
  database        : 'cs290_lees6'
});

module.exports.pool = pool;