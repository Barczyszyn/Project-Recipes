import { DataTypes } from 'sequelize';
import { default as db } from '../db/conn.js';

import User from './User.js';

const Recipe = db.define('Recipe', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    }
});

Recipe.belongsTo(User);
User.hasMany(Recipe);

export default Recipe;