const topicProvider = require("../../app/Topic/topicProvider");
const topicService = require("../../app/Topic/topicService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

exports.getTopic = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const selectTopicResponse = await topicProvider.retrieveTopicList(usrIdx);
    console.log(selectTopicResponse.length);
    if(selectTopicResponse.length === 0 ) return res.send(errResponse(baseResponse.TOPIC_SELECT_FAIL));

    return res.send(response(baseResponse.TOPIC_SELECT_SUCCESS, selectTopicResponse));
};

exports.postTopic = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    if(!usrIdx) return res.send(baseResponse.USER_USERID_EMPTY);

    const createTopicResponse = await topicService.createTopic(usrIdx);

    return res.send(createTopicResponse);
};

exports.patchTopic = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userIdx = req.params.usrIdx;
    //const topicName = req.query.topicName;
    //const status = req.query.status;
    const {status, topicName} = req.body;

    let regStatus = /^([Y|N])?$/; //status 정규식
    let regStatusResult = regStatus.exec(status);

    if (userIdFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        if(!status || status === "") return res.send(errResponse(baseResponse.TOPIC_STATUS_EMPTY));
        if(regStatusResult === null) return res.send(errResponse(baseResponse.STATUS_FORM_DIFFERENT));
        if(!topicName || topicName === "") return res.send(errResponse(baseResponse.TOPICNAME_EMPTY));

        const updateTopicResponse = await topicService.editTopic(status, topicName, userIdx);

        return res.send(updateTopicResponse);
    }
};
