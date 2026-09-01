module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    'Conversations',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      blackList1: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      blackList2: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      favoriteList1: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      favoriteList2: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Conversation;
};
