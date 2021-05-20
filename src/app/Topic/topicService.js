const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const topicProvider = require("./topicProvider");
const userProvider = require("../User/userProvider");
const topicDao = require("./topicDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

exports.editTopic = async function (status, topicName, usrIdx) {
    try {
        const userRows = await userProvider.retrieveUser(usrIdx);
        if(userRows.length === 0) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        const topicRows = await topicProvider.retrieveTopicList(usrIdx);
        if(topicRows.length === 0) return errResponse(baseResponse.USER_TOPIC_NOT_EXIST);

        const checkChangeTopicRow = await topicProvider.checkChangeTopic(status, topicName ,usrIdx);
        if(checkChangeTopicRow[0].length > 0 ) return errResponse(baseResponse.NOT_CHANGE);

        const connection = await pool.getConnection(async (conn) => conn);
        const editTopicResult = await topicDao.updateTopic(connection, status, topicName, usrIdx);

        return response(baseResponse.TOPIC_UPDATE_SUCCESS, editTopicResult.info);
    }catch (err) {
        logger.error(`App - editTopic Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.createTopic = async function (usrIdx) {
    try {
        const userRows = await userProvider.retrieveUser(usrIdx); //UserTB에 유저가 존재하지 않는 경우
        if(userRows.length === 0) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        const topicRows = await topicProvider.retrieveTopicList(usrIdx); //InterestTopicTB에 유저가 이미 존재하는 경우
        if(topicRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_USERID);

        const connection = await pool.getConnection(async (conn) => conn);
        const createTopicResult = await topicDao.insertTopic(connection, usrIdx);

        connection.release();
        return response(baseResponse.TOPIC_CREATE_SUCCESS, `추가된 유저 : ${userRows[0].idx}`);

    }catch (err) {
        logger.error(`App - createTopic Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};