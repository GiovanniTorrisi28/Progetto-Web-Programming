const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const CryptoJS = require('crypto-js');
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
   secret: 'il tuo_segreto',
   resave: false,
   saveUninitialized: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

/*const auth = (req,res,next) => {
   if (!req.session.isLoggedIn) {
      return res.redirect('/login');
  }
  next();
};
*/

const storage = multer.diskStorage({
   destination: (req, file, callBack) => {
     callBack(null, './public/images/') // './public/images/' directory name where to save the file
   },
   filename: (req, file, callBack) => {
     callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
   },
 });

const fileFilter = (req, file, callBack) => {
   const allowedExtensions = ['.jpg', '.png'];
   const fileExt = path.extname(file.originalname).toLowerCase();
   if (allowedExtensions.includes(fileExt)) {
     callBack(null, true); // Accept the file
   } else {
     callBack(null,false);
   }
 };

const upload = multer({
   storage: storage,
   fileFilter: fileFilter
});

const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'piscina',
});

connection.connect((err) => {
   if (err)
      throw err;
   console.log("connected");
});

function deleteOldPhoto(fieldName, tableName, id) {
   connection.query("select ?? from ?? where id = ?", [fieldName, tableName, id], (err, results) => {
      if (results.length > 0) {
         if (results[0].photo) {
            const fileName = results[0].photo.split('/').pop(); // Extract the filename from the URL
            const filePath = './public/images/' + fileName;
            fs.unlink(filePath, (unlinkError) => { });
         }
      }
   })
}

app.get("/isAdminLoggedIn", (req, res) => {
   if (req.session.isLoggedIn)
      res.json({ value: true });
   else
      res.json({ value: false });
});

app.get("/isUserLoggedIn", (req, res) => {
   if (req.session.isUserLoggedIn)
      res.json({ value: true });
   else
      res.json({ value: false });
});


// Route per ottenere e inviare l'immagine al client
app.get('/immagine', (req, res) => {

   const query = 'SELECT photo FROM immagini';

   connection.query(query, (error, results) => {
      if (error) {
         console.error('Errore durante la query:', error);
         res.sendStatus(500);
         return;
      }

      if (results.length === 0) {
         res.sendStatus(404);
         return;
      }
      const images = results.map((row) => ({
         image: Buffer.from(row.photo).toString('base64'),
      }));

      res.send(images);
   });
});

app.post('/registration', (req, res) => {
   const { name, surname, email, password, username } = req.body;
   const queryCheckUsername = "SELECT * FROM users WHERE username = ?";
   const queryInsertUser = "INSERT INTO users (name, surname, username, email, password) VALUES (?, ?, ?, ?, ?)";

   connection.query(queryCheckUsername, [username], (err, results) => {
      if (err) {
         res.status(500).send("errore durante la registrazione");
         return;
      }

      if (results.length > 0) {
         res.sendStatus(409); // Nome utente duplicato
         return;
      }

      //controllo su admin username
      let adminUsername;
      connection.query("select * from admin_users", (err, results) => {
         adminUsername = results[0].username;
         if (adminUsername == username) {
            res.sendStatus(409);
            return;
         }
      });

      const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      connection.query(queryInsertUser, [name, surname, username, email, hash], (err, results) => {
         if (err) {
            res.status(500).send("errore durante la registrazione");
            return;
         }

         res.status(200).send("registrazione avvenuta con successo");
      });
   });
});



app.post("/login", (req, res) => {
   const { username, password } = req.body;

   connection.query("select * from admin_users", (err, results) => {
      if (results[0].username == username && results[0].password == password) {
         req.session.isLoggedIn = true;
         res.sendStatus(201);
         return;
      }

      const query = "select * from users where username=? and password=?";
      connection.query(query, [username, CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex)], (err, results) => {

         if (results.length === 0)
            res.status(404).send("utente non trovato");
         else {
            req.session.userId = results[0].id;
            req.session.name = results[0].name;
            req.session.surname = results[0].surname;
            req.session.username = results[0].username;
            req.session.email = results[0].email;
            req.session.password = results[0].password;
            req.session.photo = results[0].photo;
            req.session.isUserLoggedIn = true;
            res.status(200).send("utente trovato");
         }
      });

   });


});

app.get("/personalArea", (req, res) => {
   // res.json({id: req.session.userId,name: req.session.name,surname: req.session.surname,username: req.session.username,email: req.session.email,password: req.session.password});
   res.status(200).json({ id: req.session.userId, name: req.session.name, surname: req.session.surname, username: req.session.username, email: req.session.email, password: req.session.password, photo: req.session.photo });
});

app.get("/getUserData", (req, res) => {
   connection.query("select * from users where id=?", [req.session.userId], (err, results) => {
      if (err)
         res.sendStatus(500);
      res.status(200).json({ id: results[0].id, name: results[0].name, surname: results[0].surname, username: results[0].username, email: results[0].email, password: results[0].password, photo: results[0].photo })
   });
});

app.get("/getUsersData", (req, res) => {
   connection.query("select * from users", (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results)
   });
});

app.get('/logout', (req, res) => {
   req.session.destroy((err) => {
      if (err)
         res.sendStatus(500);
      else
         res.sendStatus(200);
   });
});

app.post("/upload", upload.single('file'), (req, res) => {
   if (!req.file) {
      console.log("No file upload");
   } else {

      //elimino la vecchia foto
      deleteOldPhoto("photo", "users", req.session.userId);

      //carico riferimento a nuova foto
      var imgsrc = 'http://127.0.0.1:3001/images/' + req.file.filename;
      var insertData = 'UPDATE users SET photo = ? WHERE id = ?';
      connection.query(insertData, [imgsrc, req.session.userId], (err, result) => {
         if (err) console.log("errore: " + err);
         console.log("file uploaded");
         res.sendStatus(200);
      })
   }
});

app.get("/getUserPhoto", (req, res) => {
   const query = "select photo from users where id=?";
   connection.query(query, [req.session.userId], (err, results) => {
      if (err)
         res.sendStatus(500);
      else if (results.length == 0)
         res.sendStatus(100);
      else res.status(200).json({ photo: results[0].photo });
   });
});

app.post("/updateUserData", (req, res) => {
   const field = req.body.field.toLowerCase();
   const value = req.body.value;
   let params = [];
   if (field == 'username') {
      params = [value, req.session.userId];
      connection.query("select * from users where username = ? and id <> ?", params, (err, results) => {
         if (results.length > 0)
            return res.sendStatus(501);
      });
   }
   params = [field, value, req.session.userId];
   connection.query('update users set ?? = ? where id = ?', params, (err, results) => {
      if (err) {
         res.sendStatus(500);
         console.log("errore: " + err);
      }
      else res.sendStatus(200);
   });
});

app.get("/getPastEvents", (req, res) => {
   let query = 'select distinct events.name,events.id,events.location,events.startDate,events.endDate from events,users,users_challenges where events.id = users_challenges.event_id and users.id = users_challenges.user_id and users.id =  ? and startDate <= curdate()';
   connection.query(query, [req.session.userId], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.get("/getPastEvents/:id", (req, res) => {
   const { id } = req.params;
   let query = 'select challenges.style,challenges.distance,users_challenges.time from events,users,challenges,users_challenges where events.id = users_challenges.event_id and users.id = users_challenges.user_id and challenges.id = users_challenges.challenge_id and users.id = ? and users_challenges.event_id = ? ';
   connection.query(query, [req.session.userId, id], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.post("/test", (req, res) => {
   const { title, body } = req.body;
   let query = 'insert into notes (title,body,user_id,last_edit) values (?,?,?,?)';
   connection.query(query, [title, body, req.session.userId, new Date()], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

app.get("/getNotes", (req, res) => {
   const query = 'select id,title,body from notes where user_id = ? order by last_edit desc';
   connection.query(query, [req.session.userId], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.post("/updateNote", (req, res) => {
   const { title, body, id } = req.body;
   const query = 'update notes set title = ?, body = ?, last_edit = ? where id = ?';
   connection.query(query, [title, body, new Date(), id], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);

   });
});

app.get("/getUserSubscriptions", (req, res) => {
   const query = 'select endDate,activities.name, case when endDate > curdate()  then true else false end as state from subscriptions,activities where subscriptions.activity_id = activities.id and user_id = ?';
   connection.query(query, [req.session.userId], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   })
});

app.post("/deleteNote", (req, res) => {
   const { id } = req.body;
   const query = 'delete from notes where id = ?';
   connection.query(query, [id], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

//gare che l'utente vuole fare a quell'evento
app.get("/getActiveChallenges", (req, res) => {
   const { event_id } = req.query;
   const query = 'select challenges.id,challenges.distance,challenges.style from challenges,users_challenges where challenges.id = users_challenges.challenge_id and users_challenges.event_id = ? and users_challenges.user_id = ?';
   connection.query(query, [event_id, req.session.userId], (error, results) => {
      if (error)
         res.sendStatus(500);
      else {
         res.status(200).json(results);
      }
   });
});

//gare che l'utente non fa a quell'evento
app.get("/getOtherChallenges", (req, res) => {
   const { event_id } = req.query;
   const query = 'select challenges.id,challenges.distance,challenges.style from challenges where not EXISTS ( select * from users_challenges where users_challenges.user_id = ? and users_challenges.event_id = ? and users_challenges.challenge_id = challenges.id)';
   connection.query(query, [req.session.userId, event_id], (error, results) => {
      if (error)
         res.sendStatus(500);
      else {
         res.status(200).json(results);
      }
   });
});

app.get("/getFutureEvents", (req, res) => {
   const query = 'select * from events where startDate > curdate()';
   connection.query(query, (error, results) => {
      if (error)
         res.sendStatus(500);
      else {
         res.status(200).json(results);
      }
   })
});

app.post("/saveUserChallenges", (req, res) => {
   const { event_id } = req.body;
   const query = 'delete  from users_challenges where users_challenges.user_id = ? and users_challenges.event_id = ?';
   let err = false;
   connection.query(query, [req.session.userId, event_id], (error, results) => {
      if (!error) {
         for (let i = 0; i < req.body.selectedItems.length; i++)
            connection.query("insert into users_challenges(user_id,event_id,challenge_id) values (?,?,?)", [req.session.userId, event_id, req.body.selectedItems[i].id], (error, results) => {
               if (error)
                  err = true;
            });
      }
   })
   if (!err)
      res.sendStatus(200);
});

app.post("/deleteUserChallenge", (req, res) => {
   const { userId, eventId, challengeId } = req.body;
   connection.query("delete from users_challenges where user_id = ? and event_id = ? and challenge_id = ?", [userId, eventId, challengeId], (error, results) => {
      if (error)
         res.sendStatus(500);
      else
         res.sendStatus(200);
   });
});

app.get("/getCompanyData", (req, res) => {
   connection.query("select * from company", (error, results) => {
      if (!error)
         res.status(200).json(results);
      else res.sendStatus(500);
   });
});

app.post("/updateCompanyData", (req, res) => {
   const field = req.body.field.toLowerCase();
   const value = req.body.value;
   let params = [];
   params = [field, value, req.session.userId];
   connection.query('update company set ?? = ? where id = 1', params, (err, results) => {
      if (err) {
         res.sendStatus(500);
         console.log("errore: " + err);
      }
      else res.sendStatus(200);
   });
});

app.post("/uploadPhotoLogo", upload.single('file'), (req, res) => {
   if (!req.file) {
      console.log("No file upload");
   } else {

      deleteOldPhoto("photo", "company", 1);

      var imgsrc = 'http://127.0.0.1:3001/images/' + req.file.filename;
      var insertData = 'UPDATE company SET photo = ? WHERE id = 1';
      connection.query(insertData, [imgsrc], (err, result) => {
         if (err) console.log("errore: " + err);
         console.log("file uploaded");
         res.sendStatus(200);
      })
   }
});

app.get("/getStaffData", (req, res) => {
   connection.query("select * from staff", (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.post("/updateStaffData", (req, res) => {
   const { id, name, surname, instagram, linkedin } = req.body;
   const query = "update staff set name = ?, surname = ?, instagram = ?, linkedin = ? where id = ?";
   connection.query(query, [name, surname, instagram, linkedin, id], (error, result) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   })
});

app.post("/deleteStaffData", (req, res) => {
   const { id } = req.body;
   const query = "delete from staff where id = ?";
   deleteOldPhoto("photo", "staff", id);
   connection.query(query, [id], (error, result) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   })
});

app.post("/insertStaffData", upload.single('file'), (req, res) => {
   const { name, surname, instagram, linkedin } = req.body;
   if (!name | !surname) {
      res.sendStatus(501);
      return;
   }
   let imgsrc = null;
   if (req.file) {
      imgsrc = 'http://127.0.0.1:3001/images/' + req.file.filename;
   }
   const query = "insert into staff(name,surname,instagram,linkedin,photo) values(?,?,?,?,?)";
   connection.query(query, [name, surname, instagram, linkedin, imgsrc], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

app.post("/uploadStaffPhoto", upload.single("file"), (req, res) => {
   if (!req.file)
      console.log("No file upload");
   else {
      const { id } = req.query;
      deleteOldPhoto("photo", "staff", id);  //elimino la vecchia foto
      var imgsrc = 'http://127.0.0.1:3001/images/' + req.file.filename;
      var insertData = 'UPDATE staff SET photo = ? WHERE id = ?';
      connection.query(insertData, [imgsrc, id], (err, result) => {
         if (err) console.log("errore: " + err);
         console.log("file uploaded");
         res.sendStatus(200);
      })
   }
});

app.get("/getActivitiesData", (req, res) => {
   connection.query("select * from activities", (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.post("/updateActivitiesData", (req, res) => {
   const { id, name, description } = req.body;
   const query = "update activities set name = ?, description = ? where id = ?";
   connection.query(query, [name, description, id], (error, result) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   })
});

app.post("/insertActivitiesData", upload.single('file'), (req, res) => {
   const { name, description } = req.body;
   var imgsrc = 'http://127.0.0.1:3001/images/' + req.file.filename;
   const query = "insert into activities(name,description,photo) values(?,?,?)";
   connection.query(query, [name, description, imgsrc], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

app.post("/deleteActivity", (req, res) => {
   const { id } = req.body;
   deleteOldPhoto("photo", "activities", id);
   connection.query("delete from activities where id = ?", [id], (error, result) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

app.post("/uploadActivitiesPhoto", upload.single("file"), (req, res) => {
   if (!req.file)
      console.log("No file upload");
   else {
      const { id } = req.query;
      deleteOldPhoto("photo", "activities", id);  //elimino la vecchia foto
      var imgsrc = 'http://127.0.0.1:3001/images/' + req.file.filename;
      var insertData = 'UPDATE activities SET photo = ? WHERE id = ?';
      connection.query(insertData, [imgsrc, id], (err, result) => {
         if (err) console.log("errore: " + err);
         console.log("file uploaded");
         res.sendStatus(200);
      })
   }
});

app.get("/getSubscriptionsData", (req, res) => {
   const query = "select s.user_id,s.activity_id,s.endDate,u.name as user_name,u.surname,a.name as activity_name from subscriptions as s,users as u,activities as a where s.user_id = u.id and s.activity_id = a.id";
   connection.query(query, (error, results) => {
      if (error)
         res.sendStatus(500);
      else
         res.status(200).json(results);
   });
});

app.post("/updateSubscriptionData", (req, res) => {
   const { newEndDate, user_id, activity_id } = req.body;
   const query = "update subscriptions set endDate = ? where user_id = ? and activity_id = ?";
   connection.query(query, [newEndDate, user_id, activity_id], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   })
});

app.post("/insertSubscriptionData", (req, res) => {
   const { user, activity, endDate } = req.body;
   connection.query("insert into subscriptions(user_id,activity_id,endDate) values (?,?,?)", [user, activity, endDate], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

app.post("/deleteSubscription", (req, res) => {
   const { user, activity } = req.body;
   connection.query("delete from subscriptions where user_id = ? and activity_id = ?", [user, activity], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   })
});

app.post("/deleteEvent", (req, res) => {
   const { id } = req.body;
   connection.query("delete from events where id = ?", [id], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

app.post("/insertEvent", (req, res) => {
   const { name, location, startDate, endDate } = req.body;

   if (!name | !location | !startDate | !endDate) {
      res.sendStatus(400);
      return;
   }

   const query = "insert into events(name,location,startDate,endDate) values (?,?,?,?)";
   connection.query(query, [name, location, startDate, endDate], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

app.post("/editEvent", (req, res) => {
   const { name, location, startDate, endDate, id } = req.body;
   const query = "update events set name = ?, location = ?, startDate = ?, endDate = ? where id = ?";
   connection.query(query, [name, location, startDate, endDate, id], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

app.post("/getEventChallenges", (req, res) => {
   const { id } = req.body;
   const query = "select users.name,users.surname,challenges.style,challenges.distance from users_challenges,users,challenges where users.id = users_challenges.user_id and challenges.id = users_challenges.challenge_id and users_challenges.event_id = ?";
   connection.query(query, [id], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.get("/getUsersAtEvent", (req, res) => {
   const { id } = req.query;
   const query = "select * from users where id in (select user_id from users_challenges where event_id = ?)";
   connection.query(query, [id], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
   ;
});

app.get("/getUserChallenges", (req, res) => {
   const { eventId, userId } = req.query;
   const query = "select DISTINCT challenges.id,challenges.style,challenges.distance,users_challenges.time from challenges,users_challenges where challenges.id = users_challenges.challenge_id and users_challenges.user_id = ? and users_challenges.event_id = ?";
   connection.query(query, [userId, eventId], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
})

app.get("/getAllPastEvents", (req, res) => {
   const query = "select * from events where startDate < CURDATE()";
   connection.query(query, (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.post("/updateChallengeTime", (req, res) => {
   const { userId, eventId, challengeId, time } = req.body;
   const query = "update users_challenges set time = ? where user_id = ? and event_id = ? and challenge_id = ?";
   connection.query(query, [time, userId, eventId, challengeId], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
})

app.get("/getChallenges", (req, res) => {
   const query = "select * from challenges";
   connection.query(query, (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.post("/insertUserChallenge", (req, res) => {
   const { userId, eventId, challengeId, time } = req.body;
   const query = "insert into users_challenges(user_id,event_id,challenge_id,time) values (?,?,?,?)";
   connection.query(query, [userId, eventId, challengeId, time], (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.sendStatus(200);
   });
});

app.get("/getUsersCount", (req, res) => {
   const query = "select count(*) as count from users";
   connection.query(query, (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.get("/getStaffCount", (req, res) => {
   const query = "select count(*) as count from staff";
   connection.query(query, (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.get("/getActivitiesCount", (req, res) => {
   const query = "select count(*) as count from activities";
   connection.query(query, (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.get("/getEventsCount", (req, res) => {
   const query = "select count(*) as count from events";
   connection.query(query, (error, results) => {
      if (error)
         res.sendStatus(500);
      else res.status(200).json(results);
   });
});

app.listen(3001, () => {
   console.log('Server avviato sulla porta 3001.');
});
