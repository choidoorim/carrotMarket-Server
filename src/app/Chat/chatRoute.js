module.exports = function (app){
    const chat = require('./chatController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 채팅 방 조회 API
    app.get('/app/chatRooms', jwtMiddleware, chat.getChatRooms);

    // 채팅 조회 API
    app.get('/app/chatRooms/:roomIdx/chats', chat.getChats);

    // 채팅 방 생성 API
    app.post('/app/chatRooms', jwtMiddleware, chat.postChatRooms);

    // 채팅 등록 API
    app.post('/app/chats', jwtMiddleware, chat.postChats);

    // 채팅 방 나가기 API
    app.patch('/app/chatRooms/:roomIdx/status', jwtMiddleware, chat.deleteChatRooms);

    // 채팅 삭제
    app.patch('/app/chats/:chatIdx/status', jwtMiddleware, chat.deleteChats);
}