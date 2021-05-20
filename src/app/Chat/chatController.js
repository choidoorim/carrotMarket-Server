const jwtMiddleware = require("../../../config/jwtMiddleware");
const chatProvider = require("../../app/Chat/chatProvider");
const chatService = require("../../app/Chat/chatService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.getChatRooms = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const selectChatRoomsResult = await chatProvider.retriveChatRooms(usrIdx);

    return res.send(response(baseResponse.CHATROOM_SELECT_SUCCESS, selectChatRoomsResult));
};

exports.getChats = async function (req, res) {
    const roomIdx = req.params.roomIdx;
    const selectChatsResult = await chatProvider.retriveChats(roomIdx);
    const selectProductSummary = await chatProvider.retriveSummaryProducts(roomIdx);

    const result = {
        "chat" : selectChatsResult,
        "product" : selectProductSummary
    }

    return res.send(response(baseResponse.CHAT_SELECT_SUCCESS, result));
};

// exports.getProductSummary = async function (req, res) {
//     const roomIdx = req.params.roomIdx;
//     const selectProductSummary = await chatProvider.retriveSummaryProducts(roomIdx);
//
//     return res.send(selectProductSummary);
// };

exports.postChatRooms = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const pdIdx = req.body.pdIdx;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!pdIdx) return res.send(errResponse(baseResponse.PRODUCT_ID_EMPTY));

    const insertChatRoomResult = await chatService.insertChatRooms(pdIdx, usrIdx);

    return res.send(insertChatRoomResult);

};

exports.postChats = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {roomIdx, contents} = req.body;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY));
    if(!contents || contents === "") return res.send(errResponse(baseResponse.CHAT_CONTENTS_EMPTY));

    const insertChatsResult = await chatService.insertChats(roomIdx, usrIdx, contents);

    return res.send(insertChatsResult);
};

exports.deleteChatRooms = async function (req, res) {
    const roomIdx = req.params.roomIdx;
    const usrIdx = req.verifiedToken.userId;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY));

    const deleteChatRoomsResult = await chatService.deleteChatRooms(roomIdx, usrIdx);

    return res.send(deleteChatRoomsResult);

};

exports.deleteChats = async function (req, res) {
    const chatIdx = req.params.chatIdx;
    const usrIdx = req.verifiedToken.userId;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!chatIdx) return res.send(errResponse(baseResponse.CHAT_ID_EMPTY));

    const deleteChatsResult = await chatService.deleteChats(usrIdx, chatIdx);

    return res.send(deleteChatsResult);

}