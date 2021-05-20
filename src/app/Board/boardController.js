const jwtMiddleware = require("../../../config/jwtMiddleware");
const boardProvider = require("../../app/Board/boardProvider");
const boardService = require("../../app/Board/boardService");
const regionProvider = require("../../app/Region/regionProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.getBoards = async function(req, res) {
    const usrIdx = req.verifiedToken.userId;
    const regionName = req.query.regionName;
    let selectBoardEmojiResult = [];
    let selectBoardImageResult = [];

    if(!usrIdx || usrIdx === "") return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!regionName || regionName === "") return res.send(errResponse(baseResponse.SIGNUP_REGION_EMPTY));

    const selectUserLeadRegionResult = await regionProvider.retrievesLeadRegionList(usrIdx);
    const selectUserTopicsResult = await boardProvider.selectUsersTopic(usrIdx);
    const selectBoardsResult = await boardProvider.selectBoards(usrIdx, regionName);
    for(let i = 0; i < selectBoardsResult.length; i++){ //공감 종류 조회
        selectBoardEmojiResult.push(await boardProvider.selectBoardEmoji(selectBoardsResult[i].idx));
        selectBoardImageResult.push(await boardProvider.selectBoardImages(selectBoardsResult[i].idx));
    }


    const result = {
        "leadRegion" : selectUserLeadRegionResult,
        "topic" : selectUserTopicsResult,
        "board" : {
            "boardImage" : selectBoardImageResult,
            "boardContents" : selectBoardsResult
        },
        "emoji" : selectBoardEmojiResult
    }


    return res.send(response(baseResponse.BOARD_SELECT_SUCCESS, result));
};

exports.getDetailBoards = async function (req, res) {
    const boardIdx = req.params.boardIdx;
    let selectCommentEmoji = [];

    if(!boardIdx) return res.send(errResponse(baseResponse.USER_BOARDID_EMPTY));

    const checkBoard = await boardProvider.checkBoard(boardIdx);
    if(checkBoard.length === 0) return res.send(errResponse(baseResponse.BOARD_NOT_EXIST));

    const selectBoardImagesResult = await boardProvider.selectBoardImages(boardIdx);
    const selectDetailBoardsResult = await boardProvider.selectDetailBoard(boardIdx);
    const selectBoardEmojiResult =  await boardProvider.selectBoardEmoji(boardIdx);
    const selectBoardCommentResult = await boardProvider.selectBoardComment(boardIdx);
    for(let i = 0; i < selectBoardCommentResult.length; i++){ //공감 종류 조회
        selectCommentEmoji.push(await boardProvider.selectCommentEmoji(selectBoardCommentResult[i].cmIdx));
    }

    const result = {
        "board" : {
            "boardImage" : selectBoardImagesResult,
            "boardContents" : selectDetailBoardsResult,
            "boardEmoji" : selectBoardEmojiResult
        },
        "comment" : {
            "comment" : selectBoardCommentResult,
            "commentEmoji" : selectCommentEmoji
        }
    }

    return res.send(response(baseResponse.BOARDDETAIL_SELECT_SUCCESS, result));

};

exports.getBoardImages = async function (req, res) {
    const boardIdx = req.params.boardIdx;
    if(!boardIdx) return res.send(errResponse(baseResponse.USER_BOARDID_EMPTY));

    const checkBoard = await boardProvider.checkBoard(boardIdx);
    if(checkBoard.length === 0) return res.send(errResponse(baseResponse.BOARD_NOT_EXIST));

    const selectBoardImagesResult = await boardProvider.selectBoardImages(boardIdx);
    if(selectBoardImagesResult.length === 0) return res.send(errResponse(baseResponse.BOARD_IMAGE_NOT_EXIST));

    return res.send(response(baseResponse.BOARDIMAGE_SELECT_SUCCESS, selectBoardImagesResult));
};

exports.getBoardEmojis = async function (req, res) {
    const boardIdx = req.params.boardIdx;
    if(!boardIdx) return res.send(errResponse(baseResponse.USER_BOARDID_EMPTY));

    const selectBoardEmojiResult = await boardProvider.selectBoardEmoji(boardIdx);

    return res.send(selectBoardEmojiResult);
};

exports.getBoardComments = async function (req, res) {
    const boardIdx = req.params.boardIdx;
    if(!boardIdx) return res.send(errResponse(baseResponse.USER_BOARDID_EMPTY));

    const selectBoardCommentResult = await boardProvider.selectBoardComment(boardIdx);

    return res.send(selectBoardCommentResult);
};

exports.getCommentEmojis = async function (req, res) {
    const cmIdx = req.params.cmIdx;

    if(!cmIdx) return res.send(errResponse(baseResponse.USER_COMMENTID_EMPTY));

    const selectCommentEmojiResult = await boardProvider.selectCommentEmoji(cmIdx);

    return res.send(selectCommentEmojiResult);

};

exports.postBoards = async function (req, res){
    const usrIdx = req.verifiedToken.userId;
    const {subject, contents} = req.body;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!subject || subject === "") return res.send(errResponse(baseResponse.USER_BOARDSUBJECT_EMPTY));
    if(!contents || contents === "") return res.send(errResponse(baseResponse.USER_BOARDCONTENTS_EMPTY));

    const insertBoardResult = await boardService.insertBoard(usrIdx, subject, contents);

    return res.send(insertBoardResult);
}

exports.postBoardImages = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const boardImageInfo = req.body;
    let insertBoardImageResult;

    for(let i = 0; i < boardImageInfo.length; i++) { //데이터 검사하는 로직
        if (!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        if (!boardImageInfo[i].boardIdx || boardImageInfo[i].boardIdx === "") return res.send(errResponse(baseResponse.USER_BOARDID_EMPTY));
        if (!boardImageInfo[i].imgUrl || boardImageInfo[i].imgUrl === "") return res.send(errResponse(baseResponse.USER_BOARDIMG_EMPTY));
    }

    for(let i = 0; i < boardImageInfo.length; i++){ //검사 후 데이터 넣는 로직
        insertBoardImageResult = await boardService.insertBoardImage(usrIdx, boardImageInfo[i].boardIdx, boardImageInfo[i].imgUrl);
    }

    return res.send(insertBoardImageResult);
};

exports.postBoardEmoji = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {boardIdx, emojiStatus} = req.body;

    if(!boardIdx) return res.send(errResponse(baseResponse.USER_BOARDID_EMPTY));
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!emojiStatus) return res.send(errResponse(baseResponse.BOARD_EMOJI_EMPTY));

    const editBoardEmojiResult = await boardService.editBoardEmoji(boardIdx, usrIdx, emojiStatus);

    return res.send(editBoardEmojiResult);
};

exports.postCommentEmoji = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {cmIdx, emojiStatus} = req.body;

    if(!cmIdx || cmIdx === "") return res.send(errResponse(baseResponse.USER_COMMENTID_EMPTY));
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!emojiStatus || emojiStatus === "") return res.send(errResponse(baseResponse.COMMENT_EMOJI_EMPTY));

    const editCommentEmojiResult = await boardService.editCommentEmoji(emojiStatus, cmIdx, usrIdx);

    return res.send(editCommentEmojiResult);
};

exports.postBoardComments = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {boardIdx, cmContent} = req.body;

    if(!boardIdx || boardIdx === "") return res.send(errResponse(baseResponse.USER_BOARDID_EMPTY));
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!cmContent || cmContent === "") return res.send(errResponse(baseResponse.USER_BOARDCOMMENTCONTENTS_EMPTY));

    const insertBoardCommentResult = await boardService.insertBoardComment(boardIdx, usrIdx, cmContent);

    return res.send(insertBoardCommentResult);
};

exports.postBoardSubComments = async function (req, res) {
    const {boardIdx, cmIdx, cmContent} = req.body;
    const usrIdx = req.verifiedToken.userId;

    if(!boardIdx) return res.send(errResponse(baseResponse.USER_BOARDID_EMPTY));
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!cmContent || cmContent === "") return res.send(errResponse(baseResponse.USER_BOARDCOMMENTCONTENTS_EMPTY));
    if(!cmIdx) return res.send(errResponse(baseResponse.USER_COMMENTID_EMPTY));

    const insertBoardSubCommentResult = await boardService.insertBoardSubComment(boardIdx, usrIdx, cmContent, cmIdx);

    return res.send(insertBoardSubCommentResult);
};

exports.deleteBoards = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const boardIdx = req.params.boardIdx;

    if(!boardIdx) return res.send(errResponse(baseResponse.USER_BOARDID_EMPTY));
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    const deleteBoardResult = await boardService.deleteBoard(boardIdx, usrIdx);

    return res.send(deleteBoardResult);
};

exports.deleteBoardImage = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const boardImgIdx = req.params.imageIdx;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!boardImgIdx) return res.send(errResponse(baseResponse.USER_BOARDIMG_EMPTY));

    const deleteBoardImageResult = await boardService.deleteBoardImage(usrIdx, boardImgIdx);

    return res.send(deleteBoardImageResult);
};

exports.deleteBoardComments = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const cmIdx = req.params.cmIdx;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!cmIdx) return res.send(errResponse(baseResponse.USER_COMMENTID_EMPTY));

    const deleteBoardCommentResult = await boardService.deleteBoardComment(usrIdx, cmIdx);

    return res.send(deleteBoardCommentResult);
};