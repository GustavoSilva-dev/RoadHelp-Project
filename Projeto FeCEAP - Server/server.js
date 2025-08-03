import express from 'express'
import session from 'express-session'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
dotenv.config()

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors('http://192.168.1.242:5173'))


// Registrar usuários
app.post('/users', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            v_name: req.body.v_name,
            v_height: req.body.v_height,
            v_width: req.body.v_width,
            v_length: req.body.v_length
        }
    })

    res.status(201).json(req.body);
})

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()

    res.status(200).send(users);
})

// Rota privada
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    })

    if (!user) {
        return res.status(404).json({
            msg: "Usuário não encontrado :("
        })
    }

    res.status(200).json({ user })
})


function checkToken(req, res, next) {
    const authH = req.headers['authorization']
    const token = authH.split(" ")[1].trim()

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado!" })
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    } catch (err) {
        res.status(404).json({
            msg: "Token inválido!"
        })

        console.log("Authorization Header:", req.headers['authorization']);
        console.log("Token extraído:", token);
        console.log(err)
    }
}

// Logar Usuários
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const userExist = await prisma.user.findUnique({
        where: {
            email: email
        },
    });

    if (!userExist) {
        return res.json({
            exists: false,
            existsP: false,
            sucess: false,
            token: false
        });
    }

    const passwordExist = await bcrypt.compare(password, userExist.password);

    if (!passwordExist) {
        return res.json({
            exists: true,
            existsP: false,
            sucess: false,
            token: false
        })
    };

    try {
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: userExist.id,
        }, secret,)

        res.status(200).json({
            exists: true,
            existsP: true,
            name: userExist.name,
            v_name: userExist.v_name,
            v_height: Number(userExist.v_height),
            v_width: Number(userExist.v_width),
            v_length: Number(userExist.v_length), 
            token: token
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            msg: "Error",
        })
    }
})

app.listen(3050);