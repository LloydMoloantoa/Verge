const mysql = require('mysql2')
const express = require('express');
const fileUpload = require('express-fileupload');
const multer = require('multer');
const session = require('express-session');
//({ dest: 'uploads/' })

const app = express();

// default option
app.use(fileUpload());

// Static Files
app.use(express.static('public'));
app.use(express.static('upload'));

const upload = multer({ storage: multer.memoryStorage() });


/* let connection = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'bdd6fb4933bf33',
  password: '7c233549',
  database: 'heroku_a0a7ca8120cf707'
 });  */


 let db_config = {
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'bdd6fb4933bf33',
  password: '7c233549',
  database: 'heroku_a0a7ca8120cf707'
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


// Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

var idglobe = 0; 

exports.home = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM classes', (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      res.render('home', { rows });
    } else {
      console.log(err);
    }
    //console.log('The data from orderman table: \n', rows);
  });
}

exports.log = (req, res) => {
  res.render('login');
}

exports.reg = (req, res) => {
  res.render('register');
}

exports.register = (req, res) => {
  var post = req.body;
  var name = post.name;
  var email = post.email;
  var password = post.password;

  // User the connection
  connection.query('INSERT INTO users SET name = ?, email = ?, password = ?', [name, email, password], (err, rows) => {
    if (!err) {
      connection.query('SELECT * FROM classes', (err, rows) => {
        // When done with the connection, release it
        if (!err) {
          res.render('login', { rows });
        } else {
          console.log(err);
        }
        //console.log('The data from orderman table: \n', rows);
      });
    } else {
      console.log(err);
    }
    //console.log('The data from orderuser table: \n', rows);
  });
}

exports.login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  connection.query('select password , email from users where email = ? AND password = ?', [email, password], (err, rows) => {

    var ret;
    ret = JSON.stringify(rows);
    var a = ret.replaceAll("[", "");
    var b = a.replaceAll("]", "");
    var c = b.replaceAll("{", "");
    var d = c.replaceAll("}", "");
    var e = d.replaceAll("password", "");
    var f = e.replace(/"/g, "");
    var g = f.replace("email", "");
    var h = g.replaceAll(":", "");
    var i = h.split(",");

    var dpassword = i[0];
    var demail = i[1];

    if (email == demail && password == dpassword) {
      connection.query('SELECT * FROM classes', (err, rows) => {
        if (!err) {
          res.render('classes', { rows });
        } else {
          res.render('login', { alert: `Incorrect information.` });
          // console.log(err);
        }
        //console.log('The data from orderman table: \n', rows);
      });
    } else {
      res.render('classes', { alert: `Incorrect information.` });
      // console.log(err);
    }
    //console.log('The data from orderman table: \n', rows);
  });
}

exports.classes= (req, res) => {
  // User the connection
  connection.query('SELECT * FROM classes', (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      res.render('classes', { rows });
    } else {
      console.log(err);
    }
    //console.log('The data from orderman table: \n', rows);
  });
}

exports.message = (req, res) => {
  var post = req.body;
  var name = post.name;
  var email = post.email;
  var message = post.message;

  // User the connection
  connection.query('INSERT INTO messages SET name = ?, email = ?, message = ?', [name, email, message], (err, rows) => {
    if (!err) {
     
        // When done with the connection, release it
        if (!err) {
          res.render('home');
        } else {
          console.log(err);
        }
      
    } else {
      console.log(err);
    }
    //console.log('The data from orderuser table: \n', rows);
  });
}

exports.messageview = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM messages', (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      res.render('messageview', { rows });
    } else {
      console.log(err);
    }
    //console.log('The data from orderman table: \n', rows);
  });
}

exports.deletemassges = (req, res) => {
  // Delete a record
  // User the connection
  connection.query('DELETE FROM messages WHERE id = ?', [req.params.id], (err, rows) => {

    if (!err) {
      connection.query('SELECT * FROM messages', (err, rows) => {
        // When done with the connection, release it
        if (!err) {
          res.render('messageview', { rows });
        } else {
          console.log(err);
        }
        //console.log('The data from orderman table: \n', rows);
      });

    } else {
      console.log(err);
    }
    //console.log('The data from orderman table: \n', rows);

  });
}

exports.addClassesRoute = (req, res) => {
  res.render('addClasses');
}

exports.addClasses = (req, res) => {
  var post = req.body
  var name = post.name;
  var title = post.title;
  var picture = req.file.buffer.toString('base64');

  let searchTerm = req.body.search;

 

  // User the connection
  connection.query('INSERT INTO classes SET name = ?, title = ?, picture = ?', [name, title, picture], (err, rows) => {
    if (!err) {
      res.render('addClasses', { alert: 'Class added successfully.' });
    } else {
      console.log(err);
    }
    // console.log('The data from orderman table: \n', rows);
  });
}

exports.viewLessons = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM lessons WHERE id = ?', [req.params.id], (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      res.render('viewLessons', { rows });
      idglobe = req.params.id;
     // console.log(idglobe);
    } else {
      console.log(err);
    }
    //console.log('The data from orderman table: \n', rows);
  });
}

exports.addLessonsRoute = (req, res) => {
  res.render('addLessons');
}


exports.addLessons = (req, res) => {
  var post = req.body
  var chapter = post.chapter;
  var description = post.description
  var lesson = post.lesson;

 
  let searchTerm = req.body.search;
  // User the connection
  connection.query('INSERT INTO lessons SET chapter = ?, description = ?, lesson = ?, id = ?', [chapter ,description ,lesson, idglobe], (err, rows) => {
    if (!err) {
      res.render('addLessons', { alert: 'lesson added successfully.' });
    } else {
      console.log(err);
    }
    // console.log('The data from orderman table: \n', rows);
  });
}


exports.lessons = (req, res) => {
  // User the connection
  connection.query('SELECT * FROM lessons WHERE id = ?', [req.params.id], (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      res.render('lessons', { rows });
    } else {
      console.log(err);
    }
    //console.log('The data from orderman table: \n', rows);
  });
}
