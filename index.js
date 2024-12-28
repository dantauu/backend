import express from 'express';
import mongoose from 'mongoose';
import { registerValidator } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/userController.js';
import cors from 'cors'


//Подкючении к серверу 
mongoose
	.connect(
		'mongodb+srv://user:55555@backcluster.p0ind.mongodb.net/blog?retryWrites=true&w=majority&appName=backCluster'
	)
	.then(() => console.log('DB Ok'))
	.catch(err => console.log('error888', err))
    
    
const app = express() 
app.use(cors())
app.use(express.json())

//Авторизация, проверка на существования user'a
app.post('/auth/login', login)

//Сама регтсрация
app.post('/auth/register', registerValidator, register)

//Если нет user'a - нет доступа 
app.get('/auth/me', checkAuth, getMe)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server OK')
})