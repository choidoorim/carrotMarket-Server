module.exports = function(app){
    const notice = require('./noticeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    // 공지사항 전체조회
    app.get('/app/notices', notice.getNotice);

    // 공지사항 조회
    app.get('/app/notices/:noticeIdx', notice.getDetailNotice);

    // 공지사항 추가
    app.post('/app/notices', jwtMiddleware, notice.postNotice);
    
    // 공지사항 수정
    app.patch('/app/notices/:noticeIdx', jwtMiddleware, notice.patchNotice);

    // 공지사항 삭제
    app.patch('/app/notices/:noticeIdx/status', jwtMiddleware, notice.patchDeleteNotice);
};
