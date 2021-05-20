module.exports = function(app) {
    const topic = require('./topicController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //유저별 관심주제 상태 조회 API
    app.get('/app/topics', jwtMiddleware, topic.getTopic);

    //유저별 관심주제 추가 API
    // app.post('/app/topics', jwtMiddleware, topic.postTopic);

    //유저별 관심주제 변경 API
    app.patch('/app/topics/status', jwtMiddleware, topic.patchTopic);

};