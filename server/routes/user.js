const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const fileUpload = require('express-fileupload');
const multer = require('multer')
//const bcrypt = require('bcryptjs');


const app = express();


// default option
app.use(fileUpload());

// Static Files
app.use(express.static('public'));
app.use(express.static('upload'));

const upload = multer({ storage: multer.memoryStorage() });

// Routes

router.get('/', userController.home);
router.post('/', userController.home);
router.get('/home', userController.home);
router.post('/home', userController.home);

router.get('/log', userController.log);
router.post('/log', userController.log);

router.get('/login', userController.login);
router.post('/login', userController.login);

router.get('/reg', userController.reg);
router.post('/reg', userController.reg);

router.get('/register', userController.register);
router.post('/register', userController.register);

router.get('/classes', userController.classes);
router.post('/classes', userController.classes);

router.get('/message', userController.message);
router.post('/message', userController.message);

router.get('/messageview', userController.messageview);
router.post('/messageview', userController.messageview);
router.get('/messageview/:id', userController.deletemassges)

router.get('/addClassesRoute', userController.addClassesRoute);
router.post('/addClassesRoute', userController.addClassesRoute);

router.post('/addClasses', upload.single('picture'), userController.addClasses);

router.get('/viewLessons/:id', userController.viewLessons);

router.get('/addLessonsRoute', userController.addLessonsRoute);
router.post('/addLessonsRoute', userController.addLessonsRoute);

router.post('/addLessons', userController.addLessons);

router.get('/lessons/:id', userController.lessons);
router.post('/lessons', userController.lessons);


module.exports = router;

