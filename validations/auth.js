import { body } from "express-validator";

export const registerValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 7 символов').isLength({ min: 7 }),
    body('fullName', 'Минимальная длинна 5 символа').isLength({ min: 5 })
]