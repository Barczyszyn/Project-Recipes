import User from '../models/User.js';

import bcrypt from 'bcrypt';

const error = console.error;

class AuthController {
    static login(req, res) {
        if ((req.cookies.type) && (req.cookies.msg)) {
            req.flash(req.cookies.type, req.cookies.msg);
            res.clearCookie('type', { path: '/' });
            res.clearCookie('msg', { path: '/' });
        }

        res.render('auth/login');

        return;
    };

    static async loginPost(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            req.flash('messageErr', 'Usuário não encontrado!');
            res.render('auth/login');

            return;
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            req.flash('messageErr', 'Senha inválida!');
            res.render('auth/login');

            return;
        }

        req.session.userid = user.id;

        res.cookie('type', 'messageLog', {
            maxAge: 3000,
            path: '/'
        });
        res.cookie('msg', 'Login realizado com sucesso!', {
            maxAge: 3000,
            path: '/'
        });

        req.session.save(() => {
            res.redirect('/recipes/dashboard');
        });
    };

    static register(req, res) {
        res.render('auth/register');

        return;
    };

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body;

        if (password != confirmpassword) {
            req.flash('messageErr', 'As senhas não conferem, tente novamente!');
            res.render('auth/register');

            return;
        }

        const checkIfUserExists = await User.findOne({ where: { email: email } });

        if (checkIfUserExists) {
            req.flash('messageDef', 'E-mail já em uso!');
            res.render('auth/register');

            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword
        };

        try {
            const createUser = await User.create(user);

            req.session.userid = createUser.id;

            res.cookie('type', 'messageOk', {
                maxAge: 3000,
                path: '/'
            });
            res.cookie('msg', 'Cadastro realizado com sucesso!', {
                maxAge: 3000,
                path: '/'
            });

            req.session.save(() => {
                res.redirect('/recipes/dashboard');
            });

            return;
        } catch (err) {
            error(err);
        };
    };

    static logout(req, res) {
        req.session.destroy();
        res.cookie('type', 'messageLog', {
            maxAge: 3000,
            path: '/'
        });
        res.cookie('msg', 'Logout realizado com sucesso!', {
            maxAge: 3000,
            path: '/'
        });
        res.redirect('/login');
    };

};

export default AuthController;