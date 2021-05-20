module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 로그인 API (+JWT 발급)
    app.post('/app/logins', user.logins);

    // 2. 특정 유저 조회
    app.get('/app/users', jwtMiddleware, user.getUsersByIdx);

    // 3. 유저 프로필 조회
    app.get('/app/users/profiles', jwtMiddleware, user.getUserProfilesByIdx);

    // 4. 유저 상세프로필 조회
    app.get('/app/users/profiles/detail', jwtMiddleware, user.getUserDetailProfilesByIdx);

    // 5. 유저 닉네임 수정 API (+JWT)
    app.patch('/app/users/nickNames', jwtMiddleware, user.patchUserNickName);

    // 6. 유저 탈퇴 API (+JWT)
    app.patch('/app/users/:usrIdx/status', jwtMiddleware, user.patchDeleteUser);

    // 프로필 이미지 수정
    app.patch('/app/users/images', jwtMiddleware, user.patchUserImage);

    // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
    // JWT 검증 API
    app.get('/app/auto-login', jwtMiddleware, user.check);

    // 카카오 닉네임을 통해 회원가입
    app.post('/app/users/login/kakao', user.loginKakao);


    // 2. 유저 조회 API (+ 검색)
    //  app.get('/app/users',user.getUsers);

    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    // app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
//app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API