module.exports = function(app){
    const region = require('./regionController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 내 동네 조회 API
    app.get('/app/regions', jwtMiddleware, region.getRegions);

    // 유저별 게시물 조회하는 지역범위 조회 API
    // app.get('/app/users/:usrIdx/regionRanges', region.getRegionRange);

    // 내 동네 등록 API
    app.post('/app/regions', jwtMiddleware, region.postRegions);

    // 내 동네 삭제 API
    app.patch('/app/regions/status', jwtMiddleware, region.deleteRegions);

    // 대표 지역 설정 API
    app.patch('/app/regions/main', jwtMiddleware, region.patchLeadRegions);

    // 유저별 게시물 조회하는 지역범위 설정 API
    app.patch('/app/regions/ranges', jwtMiddleware, region.patchRegionRange);
    
    // 인증 횟수 추가 API
    app.patch('/app/regions/authCount', jwtMiddleware, region.patchCountAuthRegion);

    // 대표 지역 조회 API
    // app.get('/app/users/:usrIdx/leadRegions', region.getLeadRegions);

    // 대표 지역 취소 API
    // app.patch('/app/delete-leadRegions/:usrIdx', region.deleteLeadRegions);
};
