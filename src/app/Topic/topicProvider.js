const { pool } = require("../../../config/database");

const topicDao = require("./topicDao");

exports.retrieveTopicList = async function (usrIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const topicListResult = await topicDao.selectTopic(connection, usrIdx);
    connection.release();

    return topicListResult;
};

exports.checkChangeTopic = async function (status, topicName ,usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const topicResult = await topicDao.selectCheckTopic(connection, status, topicName, usrIdx);
    connection.release();

    return topicResult;
};