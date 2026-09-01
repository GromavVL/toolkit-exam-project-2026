module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user1Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user2Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      blackList1: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      blackList2: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      favoriteList1: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      favoriteList2: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('Conversations', {
      fields: ['user1Id', 'user2Id'],
      type: 'unique',
      name: 'conversations_pair_unique',
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE "Conversations" ADD CONSTRAINT conversations_user_order CHECK ("user1Id" < "user2Id")'
    );
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Conversations');
  },
};
