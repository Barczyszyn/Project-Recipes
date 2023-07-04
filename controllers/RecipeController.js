import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

const error = console.error;

class RecipeController {
    static startPage(req, res) {
        res.render('recipes/home', {customBackground: true});

        return;
    };

    static async dashboard(req, res) {
        const userId = req.session.userid;

        if (!userId) {
            if (res.headersSent !== true) {
                res.redirect('/login');
            }
        } else {
            const user = await User.findOne({
                where: { id: userId, },
                include: Recipe,
                plain: true
            });

            const recipes = user.Recipes.map((resul) => resul.dataValues);

            let emptyRecipes = false;

            if (recipes.length === 0) {
                emptyRecipes = true;
            }

            if (res.headersSent !== true) {
                if ((req.cookies.type) && (req.cookies.msg)) {
                    req.flash(req.cookies.type, req.cookies.msg);
                    res.clearCookie('type', { path: '/' });
                    res.clearCookie('msg', { path: '/' });
                }

                res.render('recipes/dashboard', { recipes, emptyRecipes });
            }

            return;
        }
    };

    static createRecipe(req, res) {
        res.render('recipes/create');

        return;
    };

    static async createRecipeSave(req, res) {
        const minutos = req.body.time.replace(/[:]/g, '').substr(2, 2);
        if (minutos > 59) {
            req.flash('messageErr', 'Tempo inválido, tente novamente!');

            res.render('recipes/create');
        } else {
            const time = req.body.time.replace(/[:]/g, '').substr(0, 4);
            let tempo = "";
            if (time == '1') {
                tempo = "01 hora";
            } else {
                if (time.length == 1) {
                    tempo = `0${time} horas`;
                } else if (time.length == 2) {
                    tempo = `${time} horas`;
                } else if (time.length == 3) {
                    tempo = `${time.substr(0, 2)} horas e 0${time.substr(2, 1)} minutos`;
                } else {
                    tempo = `${time.substr(0, 2)} horas e ${time.substr(2, 2)} minutos`;
                }
            }

            const recipe = {
                title: req.body.title.substr(0, 100),
                description: req.body.description.substr(0, 100),
                time: tempo,
                UserId: req.session.userid
            };

            await Recipe.create(recipe);

            try {
                res.cookie('type', 'messageOk', {
                    maxAge: 3000,
                    path: '/'
                });
                res.cookie('msg', 'Receita cadastrada com sucesso!', {
                    maxAge: 3000,
                    path: '/'
                });

                req.session.save(() => {
                    res.redirect('/recipes/dashboard');
                });
            } catch (err) {
                error(err);
            };
        }
    };

    static async removeRecipe(req, res) {
        const id = req.body.id;
        const UserId = req.session.userid

        try {
            await Recipe.destroy({ where: { id: id, UserId: UserId } });

            res.cookie('type', 'messageOk', {
                maxAge: 3000,
                path: '/'
            });
            res.cookie('msg', 'Receita removida com sucesso!', {
                maxAge: 3000,
                path: '/'
            });

            req.session.save(() => {
                res.redirect('/recipes/dashboard');
            });
        } catch (err) {
            error(err);
        };
    };

    static async updateRecipe(req, res) {
        const id = req.params.id;

        const recipe = await Recipe.findOne({ where: { id: id }, raw: true });

        res.render('recipes/update', { recipe });
    };

    static async updateRecipeSave(req, res) {
        const minutos = req.body.time.replace(/[:]/g, '').substr(2, 2);
        if (minutos > 59) {
            req.flash('messageErr', 'Tempo inválido, tente novamente!');

            res.render('recipes/create');
        } else {
            const id = req.body.id;

            const time = req.body.time.replace(/[:]/g, '').substr(0, 4);
            let tempo = "";
            if (time == '1') {
                tempo = "01 hora";
            } else {
                if (time.length == 1) {
                    tempo = `0${time} horas`;
                } else if (time.length == 2) {
                    tempo = `${time} horas`;
                } else if (time.length == 3) {
                    tempo = `${time.substr(0, 2)} horas e 0${time.substr(2, 1)} minutos`;
                    if (time.substr(2, 1) == "1") {
                        tempo = `${time.substr(0, 2)} horas e 0${time.substr(2, 1)} minuto`;
                    }
                } else {
                    tempo = `${time.substr(0, 2)} horas e ${time.substr(2, 2)} minutos`;
                    if (time.substr(2, 2) == "01") {
                        tempo = `${time.substr(0, 2)} horas e ${time.substr(2, 2)} minuto`;
                    }
                }
            }

            const recipe = {
                title: req.body.title.substr(0, 100),
                description: req.body.description.substr(0, 100),
                time: tempo
            };

            try {
                await Recipe.update(recipe, { where: { id: id } });

                res.cookie('type', 'messageOk', {
                    maxAge: 3000,
                    path: '/'
                });
                res.cookie('msg', 'Receita atualizada com sucesso!', {
                    maxAge: 3000,
                    path: '/'
                });

                req.session.save(() => {
                    res.redirect('/recipes/dashboard');
                });
            } catch (err) {
                error(err);
            };
        }
    };
};

export default RecipeController;