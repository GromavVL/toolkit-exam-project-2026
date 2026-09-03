module.exports = (sequelize, DataTypes) => {
  const CatalogChat = sequelize.define(
    'CatalogChats',
    {
      catalogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return CatalogChat;
};
