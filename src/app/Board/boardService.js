const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const boardProvider = require("./boardProvider");
const boardDao = require("./boardDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.insertBoard = async function (usrIdx, subject, contents) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const insertBoardResult = await boardDao.insertBoard(connection, usrIdx, subject, contents);
        connection.release();

        return response(baseResponse.BOARD_INSERT_SUCCESS, insertBoardResult[0].insertId);

    } catch (err) {
        logger.error(`App - insertBoard Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.insertBoardImage = async function (usrIdx, boardIdx, imgUrl) {
    try {
        const checkBoard = await boardProvider.checkBoard(boardIdx);
        if(checkBoard.length === 0) return errResponse(baseResponse.BOARD_NOT_EXIST);
        if(usrIdx != checkBoard[0].usrIdx){ //게시판을 등록한 유저가 아닐 경우
            return errResponse(baseResponse.BOARD_USER_DIFFERENT);
        }

        const checkBoardImageRows = await boardProvider.checkBoardImage(boardIdx);
        if(checkBoardImageRows.length > 10) return errResponse(baseResponse.SIGNUP_BOARDIMAGE_COUNT);


        const connection = await pool.getConnection(async (conn) => conn);
        const insertBoardImageResult = await boardDao.insertBoardImage(connection, boardIdx, imgUrl);
        connection.release();
        return response(baseResponse.BOARDIMAGE_INSERT_SUCCESS, insertBoardImageResult[0].insertId);
    } catch (err) {
        logger.error(`App - insertBoardImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

exports.insertBoardComment = async function (boardIdx, usrIdx, cmContent) {
    try {
        const checkBoard = await boardProvider.checkBoard(boardIdx);
        if(checkBoard.length === 0) return errResponse(baseResponse.BOARD_NOT_EXIST);

        const checkCommentRows = await boardProvider.checkComment(boardIdx);
        console.log(checkCommentRows[0].checkCommentRows);
        let commentGroup = checkCommentRows.length;

        const insertBoardCommentInfoParams = [cmContent, boardIdx, usrIdx, commentGroup];
        const connection = await pool.getConnection(async (conn) => conn);
        const insertBoardCommentResult = await boardDao.insertBoardComment(connection, insertBoardCommentInfoParams);
        connection.release();

        return response(baseResponse.BOARD_COMMENT_INSERT_SUCCESS, insertBoardCommentResult[0].insertId);

    } catch (err) {
        logger.error(`App - insertBoardComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.insertBoardSubComment = async function (boardIdx, usrIdx, cmContent, cmIdx) {
    try {
        const checkBoard = await boardProvider.checkBoard(boardIdx);
        if(checkBoard.length === 0) return errResponse(baseResponse.BOARD_NOT_EXIST);

        const checkBoardComment = await boardProvider.checkCommentIdx(cmIdx);
        if(checkBoardComment.length === 0) return errResponse(baseResponse.BOARD_COMMNET_NOT_EXIST);
        let cmGroup = checkBoardComment[0].commentGroup;

        const insertBoardSubCommentInfoParams = [cmContent, boardIdx, usrIdx, cmGroup];
        const connection = await pool.getConnection(async (conn) => conn);
        const insertBoardSubCommentResult = await boardDao.insertBoardSubComment(connection, insertBoardSubCommentInfoParams);
        connection.release();
        console.log(insertBoardSubCommentResult[0]);

        return response(baseResponse.BOARD_SUBCOMMENT_INSERT_SUCCESS, insertBoardSubCommentResult[0].insertId);
    } catch (err) {
        logger.error(`App - insertBoardSubComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editBoardEmoji = async function (boardIdx, usrIdx, emojiStatus) {
    try {
        const checkBoard = await boardProvider.checkBoard(boardIdx);
        if(checkBoard.length === 0) return errResponse(baseResponse.BOARD_NOT_EXIST);

        const checkBoardEmojiRows = await boardProvider.checkBoardEmoji(boardIdx, usrIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        let resultInfo;
        if(checkBoardEmojiRows.length === 0){ //처음 누르는 경우
            const insertBoardEmojiResult = await boardDao.insertBoardEmoji(connection, boardIdx, usrIdx, emojiStatus);
            resultInfo = insertBoardEmojiResult[0].insertId;
        }
        else { //이전에 눌렀을 경우
            const updateBoardEmojiResult = await boardDao.updateBoardEmoji(connection, boardIdx, usrIdx, emojiStatus);
            resultInfo = updateBoardEmojiResult[0].info;
        }
        connection.release();

        return response(baseResponse.BOARD_EMOJI_ENROLL_SUCCESS, resultInfo);

    } catch (err) {
        logger.error(`App - editBoardEmoji Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editCommentEmoji = async function (emojiStatus, cmIdx, usrIdx) {
    try {
        const checkCommentEmojiRows = await boardProvider.checkCommentEmoji(cmIdx, usrIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        let resultInfo;
        if(checkCommentEmojiRows.length === 0){
            console.log('first');
            const insertCommentEmojiResult = await boardDao.insertCommentEmoji(connection, emojiStatus, cmIdx, usrIdx);
            resultInfo = insertCommentEmojiResult[0].insertId;
        }
        else {
            console.log('already');
            const updateCommentEmojiResult = await boardDao.updateCommentEmoji(connection, emojiStatus, cmIdx, usrIdx);
            resultInfo = updateCommentEmojiResult[0].info;
        }
        connection.release();

        return response(baseResponse.COMMENT_EMOJI_ENROLL_SUCCESS, resultInfo);

    } catch (err) {
        logger.error(`App - editCommentEmoji Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteBoard = async function (boardIdx, usrIdx) {
    try {

        const checkBoardRows = await boardProvider.checkBoard(boardIdx);
        if(checkBoardRows.length === 0) return errResponse(baseResponse.USER_BOARD_NOT_EXIST);
        if(usrIdx != checkBoardRows[0].usrIdx){ //게시판을 등록한 유저가 아닐 경우
            return errResponse(baseResponse.BOARD_USER_DIFFERENT);
        }
        const checkBoardImageRows = await boardProvider.checkBoardImage(boardIdx);
        const checkBoardCommentRows = await boardProvider.checkBoardComment(boardIdx);
        const checkBoardEmojiRows = await boardProvider.checkBoardEmojis(boardIdx);
        const checkCommentEmojiRows = await boardProvider.checkCommentEmojis(boardIdx);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteBoardResult = await boardDao.deleteBoard(connection, boardIdx, usrIdx);

        if(checkBoardImageRows.length > 0) {
            const deleteBoardImage = await boardDao.deleteBoardImages(connection, boardIdx);
        }
        else console.log('board image empty');

        if(checkBoardCommentRows.length > 0) {
            const deleteBoardCommentRows = await boardDao.deleteBoardComments(connection, boardIdx);
        }
        else console.log('board comments empty');

        if(checkBoardEmojiRows.length > 0) {
            const deleteBoardEmojiRows = await boardDao.deleteBoardEmoji(connection, boardIdx);
        }
        else console.log('board emoji empty');

        if(checkCommentEmojiRows.length > 0) {
            const deleteCommentEmojiRows = await boardDao.deleteCommentEmoji(connection, boardIdx);
        }
        else console.log('board comments emoji empty');

        connection.release();

        return response(baseResponse.BOARD_DELETE_SUCCESS, deleteBoardResult[0].info);
    } catch (err) {
        logger.error(`App - deleteBoard Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteBoardImage = async function (usrIdx, boardImgIdx) {
    try {
        const checkBoardImageRows = await boardProvider.checkBoardImage(boardImgIdx);
        if(checkBoardImageRows.length === 0) return errResponse(baseResponse.USER_BOARDIMAGE_NOT_EXIST);

        let boardIdx = checkBoardImageRows[0].boardIdx;
        const checkBoard = await boardProvider.checkBoard(boardIdx);
        if(checkBoard.length === 0) return errResponse(baseResponse.BOARD_NOT_EXIST);
        if(usrIdx != checkBoard[0].usrIdx){ //게시판을 등록한 유저가 아닐 경우
            return errResponse(baseResponse.BOARD_USER_DIFFERENT);
        }

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteBoardImageResult = await boardDao.deleteBoardImage(connection, boardImgIdx);
        connection.release();

        return response(baseResponse.BOARDIMAGE_DELETE_SUCCESS, deleteBoardImageResult[0].affectedRows);

    } catch (err) {
        logger.error(`App - deleteBoardImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteBoardComment = async function (usrIdx, cmIdx) {
    try {
        const checkCommentRows = await boardProvider.checkCommentIdx(cmIdx);
        if(checkCommentRows.length === 0) return errResponse(baseResponse.USER_COMMENT_NOT_EXIST);
        if(checkCommentRows[0].usrIdx != usrIdx) return errResponse(baseResponse.COMMENT_USER_DIFFERENT);
        if(checkCommentRows[0].status === 'N') return errResponse(baseResponse.COMMENT_ALREADY_DELETE);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteBoardCommentResult = await boardDao.deleteBoardComment(connection, cmIdx);
        connection.release();

        return response(baseResponse.BOARD_COMMENT_DELETE_SUCCESS, deleteBoardCommentResult[0].info);

    } catch (err) {
        logger.error(`App - deleteBoardComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};