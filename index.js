import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import { registerValidator, loginValidator, postCreateValidation } from './validations.js';
import { userController, postController, commentController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js'

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('db ok'))
  .catch((err) => console.log('db error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidator, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, userController.register);
app.get('/auth/me', checkAuth, userController.getMe);

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  });
});

app.get('/tags', postController.getLastTags);
app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, postController.update);

app.get('/comments', postController.getLastComments);
app.post('/posts/:id/comments', checkAuth, commentController.addComment);
app.delete('/comments/:id', checkAuth, commentController.removeComment);
app.patch('/comments/:id', checkAuth, commentController.updateComment);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('server ok');
});