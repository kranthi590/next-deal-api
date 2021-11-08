const Sequelize = require('sequelize');
const { FILE_TYPE } = require('../constants');
const { getConnection } = require('../mysql');

const Files = getConnection().define(
  'roles',
  {
    entityId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'entity_id',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mimeType: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'mime_type',
    },
    fileLocation: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'file_location',
    },
    bucketName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'bucket_name',
    },
    entityType: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'entity_type',
      isIn: Object.values(FILE_TYPE),
    },
    uploadedBy: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'uploaded_by',
    },
    comments: {
      type: Sequelize.STRING,
      field: 'comments',
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
    isPublic: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false,
      field: 'is_public',
    },
    fileSize: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'file_size',
    },
  },
  {
    timestamps: true,
    tableName: 'files',
  },
);

module.exports = {
  Files,
};
