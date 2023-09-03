const { DataTypes, Model} = require("sequelize");
const sequelize = require("./db");

class Users extends Model {};
Users.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false, 
        autoIncrement: true, 
        primaryKey:true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }, 
    surname: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false 
      // allowNull defaults to true 
    }, 
    password:{ 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    idRole:{ 
        type: DataTypes.INTEGER, 
        allowNull: true,
    },
    id_dispositivos:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    registerDate:{ 
        type: DataTypes.DATE, 
        allowNull: true 
    },
    modificationDate:{ 
        type: DataTypes.DATE, 
        allowNull: true 
    },
},{
    sequelize,
    modelName: 'Users',
    timestamps: false,
    freezeTableName: true
});

class Role extends Model {}
Role.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    codigo:{
        type: DataTypes.STRING,
        allowNull:false
    },
},{
    sequelize,
    modelName: 'Role',
    timestamps: false,
    freezeTableName: true
});

class Prices_control extends Model {};
Prices_control.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    date:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    hour:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    price:{
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
},{
    sequelize,
    modelName: 'Prices_control',
    timestamps: false,
    freezeTableName: true
});

class Devices extends Model {};
Devices.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull: false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    reference:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    last_on:{
        type:DataTypes.DATE,
        allowNull:true,
    },
    last_off:{
        type: DataTypes.DATE,
        allowNull: true
    },
    id_user:{
        type: DataTypes.INTEGER,
        allowNull:true,
    },
    register_date:{
        type: DataTypes.DATE,
        allowNull: true
    },
    modification_date:{
        type: DataTypes.DATE,
        allowNull: true
    }
    
},{
    sequelize,
    modelName: 'Devices',
    timestamps: false,
    freezeTableName: true
});

class Devices_consumption extends Model {}
Devices_consumption.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull: false,
    },
    id_devices:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    fecha:{
        type: DataTypes.DATEONLY,
        allowNull:false,
    },
    hora:{
        type: DataTypes.DATE,
        allowNull: false,
    }
},{
    sequelize,
    modelName: 'Devices_consumption',
    timestamps: false,
    freezeTableName: true
})


Role.hasMany(Users, {as:'user', foreignKey:'idRole'});
Users.belongsTo(Role,{foreignKey:'idRole'});

Users.hasMany(Devices, {as:'devices', foreignKey: 'id_user'})
Devices.belongsTo(Users,{foreignKey:'id_user'});

Devices.hasMany(Devices_consumption, {as: 'devices_consumption', foreignKey: 'id_devices'})
Devices_consumption.belongsTo(Devices, {foreignKey:'id_devices'});


module.exports = {Users, Role, Prices_control, Devices, Devices_consumption};