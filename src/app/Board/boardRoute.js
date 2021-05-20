module.exports = function (app) {
    const board = require('./boardController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //게시글 조회
    app.get('/app/boards', jwtMiddleware, board.getBoards);

    //게시글 내역 조회
    app.get('/app/boards/:boardIdx/details', board.getDetailBoards);

    //게시글 등록
    app.post('/app/boards', jwtMiddleware, board.postBoards);

    //게시글 삭제, 삭제 시 게시글 + 연관 된 사진, 공감, 댓글, 대댓글 모두 삭제
    app.patch('/app/boards/:boardIdx/status', jwtMiddleware, board.deleteBoards);

    //게시글 이미지 조회
    app.get('/app/boards/:boardIdx/Images', board.getBoardImages);

    //게시글 사진 등록
    app.post('/app/boards/images', jwtMiddleware, board.postBoardImages);

    //사진 삭제
    app.delete('/app/boards/images/:imageIdx', jwtMiddleware, board.deleteBoardImage);

    //게시판 공감 누름 API , status 'N' 값 전송 시 공감 취소
    app.post('/app/boards/boardEmoji', jwtMiddleware, board.postBoardEmoji);

    //댓글 공감 누름 API , status 'N' 값 전송 시 공감 취소
    app.post('/app/comments/commentEmoji', jwtMiddleware, board.postCommentEmoji);

    //댓글 등록
    app.post('/app/boards/comments', jwtMiddleware, board.postBoardComments);

    //대댓글 등록
    app.post('/app/boards/subComments', jwtMiddleware, board.postBoardSubComments);

    //댓글 삭제
    app.patch('/app/comments/:cmIdx/status', jwtMiddleware, board.deleteBoardComments);


    //게시판 이모지 종류 조회
    // app.get('/app/boardEmoji-kinds/boards/:boardIdx', board.getBoardEmojis);

    //댓글 공감 이모지 종류 조회
    // app.get('/app/board-CommentEmoji-kinds/comments/:cmIdx', board.getCommentEmojis);

    //댓글 조회
    // app.get('/app/board-Comments/boards/:boardIdx', board.getBoardComments);
};