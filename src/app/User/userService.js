const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const topicDao = require("../Topic/topicDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 유저 생성 2021.05.03 CDR
exports.createUser = async function (phoneNumber, usrNickName) {
    try {
        //핸드폰 번호 중복검사
        const phoneNumRows = await userProvider.phonenumberCheck(phoneNumber);
        if(phoneNumRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER);

        //닉네임 중복검사
        const nickNameRows = await userProvider.nickNameCheck(usrNickName);
        if(nickNameRows.length > 0){
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
        }

        const checkUsers = await userProvider.checkUsers(phoneNumber);

        const insertUserInfoParams = [phoneNumber, usrNickName];
        const connection = await pool.getConnection(async (conn) => conn);

        await connection.beginTransaction();

        const userInsertResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        const userTopicInsert = await topicDao.insertTopic(connection, userInsertResult[0].insertId);

        await connection.commit()
        connection.release();
        return response(baseResponse.USER_SIGNUP_SUCCESS, userInsertResult[0].insertId);

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 유저 삭제
exports.editUserStatus = async function (usrIdx) {
    try {
        const userStatusRows = await userProvider.retrieveUser(usrIdx);
        if(userStatusRows.length === 0)
            return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const editUserImageResult = await userDao.updateUserStatus(connection, usrIdx);
        connection.release();

        return response(baseResponse.USER_DELETE_SUCCESS, editUserImageResult.info);

    } catch (err) {
        logger.error(`App - editUserStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUserImage = async function (imgUrl, usrIdx) {
    try {
        const userStatusRows = await userProvider.retrieveUser(usrIdx);
        if(userStatusRows.length === 0) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const editUserNickNameResult = await userDao.updateUserImage(connection, imgUrl, usrIdx);
        connection.release();

        return response(baseResponse.USER_IMAGE_UPDATE_SUCCESS, editUserNickNameResult.info);
    } catch (err){
        logger.error(`App - editUserImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.postSignIn = async function (phoneNumber) {
    try {
        // 핸드폰 번호 여부 확인
        const phoneNumberRows = await userProvider.phonenumberCheck(phoneNumber);
        if (phoneNumberRows.length < 1) return errResponse(baseResponse.PHONENUM_NOT_EXIST);

        const userIdx = phoneNumberRows[0].idx;
        console.log(userIdx);

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(phoneNumber, userIdx);
        if (userInfoRows.length === 0) return errResponse(baseResponse.USER_USERID_NOT_EXIST);
        if (userInfoRows[0].status == "N") return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);

        console.log(userInfoRows[0].idx); // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].idx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.LOGIN_SUCCESS, {'userId': userInfoRows[0].idx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignInTest Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 유저 닉네임 수정
exports.editUserNickName = async function (usrIdx, usrNickName) {
    try {
        const userStatusRows = await userProvider.retrieveUser(usrIdx);
        if(userStatusRows.length === 0) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        const userNickNameRows = await userProvider.retrieveUserNickName(usrIdx, usrNickName);
        if(userNickNameRows[0].length > 0 ) return errResponse(baseResponse.SAME_NICKNAME);

        const connection = await pool.getConnection(async (conn) => conn);
        const editUserNickNameResult = await userDao.updateUserNickName(connection, usrIdx, usrNickName);
        connection.release();

        return response(baseResponse.USERNICKNAME_UPDATE_SUCCESS, editUserNickNameResult.info);
    } catch (err) {
        logger.error(`App - editUserNickName Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// exports.editUserTest = async function (userIdx, nickName) {
//     try {
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editUserTestResult = await userDao.updateUserInfoTest(connection, userIdx, nickName);
//         connection.release();
//
//         console.log(editUserTestResult);
//         return response(baseResponse.SUCCESS, editUserTestResult.idx);
//     } catch (err) {
//         logger.error(`App - editUserTest Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };

// exports.editUser = async function (id, nickname) {
//     try {
//         console.log(id)
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
//         connection.release();
//
//         return response(baseResponse.SUCCESS);
//
//     } catch (err) {
//         logger.error(`App - editUser Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };

// // TODO: After 로그인 인증 방법 (JWT)
// exports.postSignIn = async function (email, password) {
//     try {
//         // 이메일 여부 확인
//         const emailRows = await userProvider.emailCheck(email);
//         if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
//
//         const selectEmail = emailRows[0].email
//
//         // 비밀번호 확인
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");
//
//         const selectUserPasswordParams = [selectEmail, hashedPassword];
//         const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
//
//         if (passwordRows[0].password !== hashedPassword) {
//             return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
//         }
//
//         // 계정 상태 확인
//         const userInfoRows = await userProvider.accountCheck(email);
//
//         if (userInfoRows[0].status === "INACTIVE") {
//             return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
//         } else if (userInfoRows[0].status === "DELETED") {
//             return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
//         }
//
//         console.log(userInfoRows[0].id) // DB의 userId
//
//         //토큰 생성 Service
//         let token = await jwt.sign(
//             {
//                 userId: userInfoRows[0].id,
//             }, // 토큰의 내용(payload)
//             secret_config.jwtsecret, // 비밀키
//             {
//                 expiresIn: "365d",
//                 subject: "userInfo",
//             } // 유효 기간 365일
//         );
//
//         return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});
//
//     } catch (err) {
//         logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };