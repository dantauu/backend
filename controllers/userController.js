import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';


export const register = async (req, res) => {
	//try-выполнение определенного кода, cath-отлавливаем ошибку
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		//Salt - соль, алгоритм шифровки данных
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		//Описание документа для создания юзера
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			passwordHash: hash,
		})

		//Создание и сохранение самого пользователя в MongoDB
		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json([{
				path: 'general',
				msg: 'Не удалось зарегистрироваться',
		}])
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(404).json([{
				path: 'email',
				message: 'Пользователь не существует',
			}])
		}

		const validPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)

		if (!validPass) {
			return res.status(400).json([{
				path: 'password',
				message: 'Неверный логин или пароль',
			}])
		}
		//Если все хорошо, создается токен
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json([{
			path: 'general',
			message: 'Не удалось авторизоваться',
		}])
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден ',
			})
		}
		const { passwordHash, ...userData } = user._doc
		res.json(userData)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Нет доступа',
		})
	}
}
