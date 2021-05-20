const jwtMiddleware = require("../../../config/jwtMiddleware");
const regionProvider = require("../../app/Region/regionProvider");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const request = require('request');

const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

//유저 생성 2021.05.03 CDR
exports.postUsers = async function (req, res) {
    const {phoneNumber, usrNickName} = req.body;

    let regPhoneNum = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    let regPhoneNumResult = regPhoneNum.exec(phoneNumber);

    if(!phoneNumber || phoneNumber === "")
        return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_EMPTY));

    if(!usrNickName || usrNickName === "")
        return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));

    if(regPhoneNumResult === null)
        return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_LENGTH));

    const signUpResponse = await userService.createUser(
        phoneNumber,
        usrNickName
    );

    return res.send(signUpResponse);
};

// 유저 프로필 조회
exports.getUserProfilesByIdx = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    if (!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserIdx = await userProvider.retrieveUserProfile(usrIdx);

    return res.send(userByUserIdx);
};

// 유저 상세 프로필 조회
exports.getUserDetailProfilesByIdx = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    if (!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    const selectUserByUserIdx = await userProvider.retrieveUserDetailProfile(usrIdx);
    if(selectUserByUserIdx.length === 0 ) return errResponse(baseResponse.DETAILPROFILE_SELECT_FAIL);
    const selectRegionResponse = await regionProvider.retrieveRegionList(usrIdx);
    if(selectRegionResponse.length === 0 ) return errResponse(baseResponse.DETAILPROFILE_SELECT_FAIL);

    const result = {
        "userProfile" : selectUserByUserIdx,
        "userRegion" : selectRegionResponse
    }

    return res.send(response(baseResponse.DETAILPROFILE_SELECT_SUCCESS, result));

};

// 유저 닉네임 조회
exports.getUsersByIdx = async function (req, res) {

    const usrIdx = req.verifiedToken.userId;

    if (!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserIdx = await userProvider.retrieveUser(usrIdx);
    if(userByUserIdx.length === 0) return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));

    return res.send(response(baseResponse.SUCCESS, userByUserIdx));

};

// 로그인 + JWT 발급
exports.logins = async function (req, res) {
    const {phoneNumber} = req.body;

    let regPhoneNum = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    let regPhoneNumResult = regPhoneNum.exec(phoneNumber);

    if(!phoneNumber || phoneNumber === "")
        return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_EMPTY));

    if(regPhoneNumResult === null)
        return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_LENGTH));

    const signInResponse = await userService.postSignIn(phoneNumber);

    return res.send(signInResponse);
};

// 유저 닉네임 수정
exports.patchUserNickName = async function (req, res) {

    const userIdx = req.verifiedToken.userId;
    const usrNickName = req.body.usrNickName; //변경 할 닉네임

    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!usrNickName) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    const editUserNickName = await userService.editUserNickName(userIdx, usrNickName)
    return res.send(editUserNickName);

};

//유저 삭제
exports.patchDeleteUser = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const usrIdx = req.params.usrIdx;

    if (!usrIdx || usrIdx === "") return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != usrIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const editUserStatus = await userService.editUserStatus(usrIdx);
        return res.send(editUserStatus);
    }

};

//프로필 이미지 수정
exports.patchUserImage = async function (req, res) {
    const userIdx = req.verifiedToken.userId;
    const imgUrl = req.body.imgUrl;
    if (!userIdx || userIdx === "") return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (imgUrl === "") return res.send(errResponse(baseResponse.SIGNUP_USERIMAGE_EMPTY));

    const editUserImageResult = await userService.editUserImage(imgUrl, userIdx);
    return res.send(editUserImageResult);

};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS,`usrIdx: ${userIdResult}` ));
};

exports.loginKakao = async function (req, res) {
    const kakaoToken = req.headers['kakao-token'];

    request({
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
            Authorization: `Bearer ${kakaoToken}`
        }
    }, async function (err, Res, body) {
        let result = JSON.parse(body);
        if(!kakaoToken) return res.send(errResponse(baseResponse.KAKAO_TOKEN_EMPTY));
        if(result.code === -401){
            return res.send(errResponse(baseResponse.SERVER_ERROR));
        }else{
            const phoneNumber = req.body.phoneNumber;
            const nickName = result.properties.nickname;

            if(!phoneNumber || phoneNumber === "")
                return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_EMPTY));

            if(!nickName || nickName === "")
                return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));

            let regPhoneNum = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
            let regPhoneNumResult = regPhoneNum.exec(phoneNumber);

            if(regPhoneNumResult === null)
                return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_LENGTH));

            const createUser = await userService.createUser(phoneNumber, nickName);

            return res.send(createUser);
        }
    });
};

// exports.postUsers = async function (req, res) {
//
//     /**
//      * Body: email, password, nickname
//      */
//     const {email, password, nickname} = req.body;
//
//     // 빈 값 체크
//     if (!email)
//         return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
//
//     // 길이 체크
//     if (email.length > 30)
//         return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
//
//     // 형식 체크 (by 정규표현식)
//     if (!regexEmail.test(email))
//         return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
//
//     // 기타 등등 - 추가하기
//
//
//     const signUpResponse = await userService.createUser(
//         email,
//         password,
//         nickname
//     );
//
//     return res.send(signUpResponse);
// };

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
// exports.getUsers = async function (req, res) {
//
//     /**
//      * Query String: email
//      */
//     const email = req.query.email;
//
//     if (!email) {
//         // 유저 전체 조회
//         const userListResult = await userProvider.retrieveUserList();
//         return res.send(response(baseResponse.SUCCESS, userListResult));
//     } else {
//         // 유저 검색 조회
//         const userListByEmail = await userProvider.retrieveUserList(email);
//         return res.send(response(baseResponse.SUCCESS, userListByEmail));
//     }
// };

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */

// exports.getUserById = async function (req, res) {
//
//     /**
//      * Path Variable: userId
//      */
//     const userId = req.params.userId;
//
//     if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
//
//     const userByUserId = await userProvider.retrieveUser(userId);
//     return res.send(response(baseResponse.SUCCESS, userByUserId));
// };

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
// exports.login = async function (req, res) {
//
//     const {email, password} = req.body;
//
//     // TODO: email, password 형식적 Validation
//
//     const signInResponse = await userService.postSignIn(email, password);
//
//     return res.send(signInResponse);
// };


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */

// exports.patchUsers = async function (req, res) {
//
//     // jwt - userId, path variable :userId
//
//     const userIdFromJWT = req.verifiedToken.userId
//
//     const userId = req.params.userId;
//     const nickname = req.body.nickname;
//
//     if (userIdFromJWT != userId) {
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//     } else {
//         if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
//
//         const editUserInfo = await userService.editUser(userId, nickname)
//         return res.send(editUserInfo);
//     }
// };


// exports.patchUsersTest = async function (req, res) {
//     // jwt - userId, path variable :userId
//
//     const userIdFromJWT = req.verifiedToken.userId;
//
//     const userIdx = req.params.usrIdx;
//     const nickName = req.body.nickName;
//
//     console.log(nickName);
//     if (userIdFromJWT != userIdx) {
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//     } else {
//         if (!nickName) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
//
//         const editUserTestInfo = await userService.editUserTest(userIdx, nickName);
//         return res.send(editUserTestInfo);
//     }
// };
