import { DataTypes } from "sequelize";
import { default as db } from '../db/conn.js';

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    }
});

export default User;