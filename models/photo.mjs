export default function initPhotoModel(sequelize, DataTypes) {
  return sequelize.define('photo', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    photoName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    comment: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    mood: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    categoryId: {
      type: DataTypes.INTEGER,
    },
    timePrint: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, { underscored: true });
}
