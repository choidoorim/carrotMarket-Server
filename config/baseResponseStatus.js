module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // 공지사항 Success
    NOTICE_SELECT_SUCCESS : { "isSuccess": true, "code": 1002, "message":"공지사항 조회 성공" },
    NOTICEDETAIL_SELECT_SUCCESS : { "isSuccess": true, "code": 1003, "message":"공지사항 내역 조회 성공" },
    NOTICE_ENROLL_SUCCESS : { "isSuccess": true, "code": 1004, "message":"공지사항 등록 성공" },
    NOTICE_UPDATE_SUCCESS : { "isSuccess": true, "code": 1005, "message":"공지사항 수정 성공" },
    NOTICE_DELETE_SUCCESS : { "isSuccess": true, "code": 1006, "message":"공지사항 삭제 성공" },

    // 관심주제 Success
    TOPIC_SELECT_SUCCESS : { "isSuccess": true, "code": 1010, "message":"관심주제 조회 성공" },
    TOPIC_UPDATE_SUCCESS : { "isSuccess": true, "code": 1011, "message":"관심주제 수정 성공" },
    TOPIC_CREATE_SUCCESS : { "isSuccess": true, "code": 1012, "message":"유저 관심주제 생성 성공" },
    
    // 키워드 Success
    KEYWORD_SELECT_SUCCESS : { "isSuccess": true, "code": 1013, "message":"키워드 조회 성공" },
    KEYWORD_INSERT_SUCCESS : { "isSuccess": true, "code": 1014, "message":"키워드 추가 성공" },
    KEYWORD_DELETE_SUCCESS : { "isSuccess": true, "code": 1015, "message":"키워드 삭제 성공" },
    REGION_NOTICE_SUCCESS : { "isSuccess": true, "code": 1016, "message":"알림 동네 설정 성공" },

    // 지역 Success
    REGION_SELECT_SUCCESS : { "isSuccess": true, "code": 1020, "message":"내 동네 조회 성공" },
    NEARREGION_SELECT_SUCCESS : { "isSuccess": true, "code": 1021, "message":"내 근처동네 조회 성공" },
    AUTHREGION_UPDATE_SUCCESS : { "isSuccess": true, "code": 1022, "message":"인증 횟수 증가 성공" },
    REGIONRANGE_UPDATE_SUCCESS : { "isSuccess": true, "code": 1023, "message":"동네 조회 범위 수정 성공" },
    LEADREGION_UPDATE_SUCCESS : { "isSuccess": true, "code": 1024, "message":"대표동네 변경 성공" },
    REGION_INSERT_SUCCESS : { "isSuccess": true, "code": 1025, "message":"동네 추가 성공" },
    REGION_DELETE_SUCCESS : { "isSuccess": true, "code": 1026, "message":"동네 삭제 성공" },

    // 유저 Success
    LOGIN_SUCCESS : { "isSuccess": true, "code": 1030, "message":"로그인 성공" },
    PROFILE_SELECT_SUCCESS : { "isSuccess": true, "code": 1031, "message":"프로필 조회 성공" },
    DETAILPROFILE_SELECT_SUCCESS : { "isSuccess": true, "code": 1032, "message":"상세 프로필 조회 성공" },
    USERNICKNAME_UPDATE_SUCCESS : { "isSuccess": true, "code": 1033, "message":"유저 닉네임 수정 성공" },
    USER_SIGNUP_SUCCESS : { "isSuccess": true, "code": 1034, "message":"회원가입 성공" },
    USER_DELETE_SUCCESS : { "isSuccess": true, "code": 1035, "message":"유저 삭제 성공" },
    USER_IMAGE_UPDATE_SUCCESS : { "isSuccess": true, "code": 1036, "message":"유저 이미지 수정 성공" },

    // 게시판 Success
    BOARD_SELECT_SUCCESS : { "isSuccess": true, "code": 1040, "message":"동네 생활 게시글 조회 성공" },
    BOARDIMAGE_SELECT_SUCCESS : { "isSuccess": true, "code": 1041, "message":"게시글 이미지 조회 성공" },
    BOARDIMAGE_DELETE_SUCCESS : { "isSuccess": true, "code": 1042, "message":"게시글 이미지 삭제 성공" },
    BOARDIMAGE_INSERT_SUCCESS : { "isSuccess": true, "code": 1043, "message":"게시글 이미지 등록 성공" },
    BOARDDETAIL_SELECT_SUCCESS : { "isSuccess": true, "code": 1044, "message":"동네 생활 게시글 내역 조회 성공" },
    BOARD_INSERT_SUCCESS : { "isSuccess": true, "code": 1045, "message":"게시글 등록 성공" },
    BOARD_DELETE_SUCCESS : { "isSuccess": true, "code": 1046, "message":"게시글 삭제 성공" },
    BOARD_COMMENT_INSERT_SUCCESS : { "isSuccess": true, "code": 1047, "message":"게시글 댓글 등록 성공" },
    BOARD_SUBCOMMENT_INSERT_SUCCESS : { "isSuccess": true, "code": 1048, "message":"게시글 대댓글 등록 성공" },
    BOARD_COMMENT_DELETE_SUCCESS : { "isSuccess": true, "code": 1049, "message":"게시글 댓글 삭제 성공" },
    BOARD_EMOJI_ENROLL_SUCCESS : { "isSuccess": true, "code": 1050, "message":"게시글 공감 버튼 등록 성공" },
    COMMENT_EMOJI_ENROLL_SUCCESS : { "isSuccess": true, "code": 1051, "message":"댓글 공감 버튼 등록 성공" },

    //상품 Success
    PRODUCT_SELECT_SUCCESS : { "isSuccess": true, "code": 1060, "message":"상품 조회 성공" },
    PRODUCT_DETAIL_SELECT_SUCCESS : { "isSuccess": true, "code": 1061, "message":"상품 내역 조회 성공" },
    PRODUCT_IMAGE__SELECT_SUCCESS : { "isSuccess": true, "code": 1062, "message":"상품 이미지 조회 성공" },
    PRODUCT_INSERT_SUCCESS : { "isSuccess": true, "code": 1063, "message":"상품 등록 성공" },
    PRODUCT_IMAGE_INSERT_SUCCESS : { "isSuccess": true, "code": 1064, "message":"상품 사진 등록 성공" },
    PRODUCT_DELETE_SUCCESS : { "isSuccess": true, "code": 1065, "message":"상품 삭제 성공" },
    PRODUCT_IMAGE_DELETE_SUCCESS : { "isSuccess": true, "code": 1066, "message":"상품 이미지 삭제 성공" },
    PRODUCT_HIDE_STATUS_UPDATE_SUCCESS : { "isSuccess": true, "code": 1067, "message":"상품 숨김 상태 변경 성공" },
    PRODUCT_STATUS_UPDATE_SUCCESS : { "isSuccess": true, "code": 1068, "message":"상품 상태 변경 성공" },
    PRODUCT_PICK_SUCCESS : { "isSuccess": true, "code": 1069, "message":"상품 찜하기 성공" },
    PRODUCT_PICK_DELETE_SUCCESS : { "isSuccess": true, "code": 1070, "message":"상품 찜해제 성공" },

    //채팅 Success
    CHATROOM_SELECT_SUCCESS : { "isSuccess": true, "code": 1080, "message":"채팅방 조회 성공" },
    CHAT_SELECT_SUCCESS : { "isSuccess": true, "code": 1081, "message":"채팅 내역 조회 성공" },
    CHATROOM_INSERT_SUCCESS : { "isSuccess": true, "code": 1082, "message":"채팅방 생성 성공" },
    CHAT_INSERT_SUCCESS : { "isSuccess": true, "code": 1083, "message":"채팅 등록 성공" },
    CHATROOM_DELETE_SUCCESS : { "isSuccess": true, "code": 1084, "message":"채팅방 삭제 성공" },
    CHAT_DELETE_SUCCESS : { "isSuccess": true, "code": 1085, "message":"채팅 삭제 성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" },

    //Request error
    STATUS_EMPTY : { "isSuccess": false, "code": 2001, "message": "상태 값을 입력해주세요." },
    STATUS_FORM_DIFFERENT : { "isSuccess": false, "code": 2002, "message": "상태 값 형식(Y,N,C..)을 확인해주세요" },

    //공지사항 error
    NOTICETITLE_EMPTY : { "isSuccess": false, "code": 2010, "message": "공지사항 제목을 입력해주세요." },
    NOTICECONTENTS_EMPTY : { "isSuccess": false, "code": 2011, "message": "공지사항 내용을 입력해주세요." },
    NOTICEID_EMPTY : { "isSuccess": false, "code": 2013, "message": "noticeId를 입력해주세요." },

    //관심주제 error
    TOPICNAME_EMPTY : { "isSuccess": false, "code": 2020, "message": "TopicName를 입력해주세요." },
    TOPIC_STATUS_EMPTY : { "isSuccess": false, "code": 2021, "message": "TOPIC 상태값을 입력해주세요" },

    //키워드 error
    KIYWORD_EMPTY : { "isSuccess": false, "code": 2030, "message": "키워드를 입력해주세요." },

    //지역 error
    SIGNUP_REGION_EMPTY : { "isSuccess": false,"code": 2040,"message":"지역을 입력해주세요." },
    SIGNUP_REGIONLATITUEE_EMPTY : { "isSuccess": false,"code": 2041,"message":"위도를 입력해주세요." },
    SIGNUP_REGIONLONGITUDE_EMPTY : { "isSuccess": false,"code": 2042,"message":"경도를 입력해주세요." },
    SIGNUP_REGION_MAXRANGE : { "isSuccess": false,"code": 2044,"message":"maxRange는 1 ~ 15 까지 등록 가능합니다." },
    REGION_LEAD_STATUS_EMPTY : { "isSuccess": false, "code": 2045, "message": " 대표 지역 상태값을 입력해주세요" },

    //유저 error
    SIGNUP_USERIMAGE_EMPTY : { "isSuccess": false,"code": 2050,"message":"이미지를 입력해주세요." },
    USER_USERID_EMPTY : { "isSuccess": false, "code": 2051, "message": "userId를 입력해주세요." },

    //게시판 error
    USER_BOARDSUBJECT_EMPTY : { "isSuccess": false, "code": 2061, "message": "게시판 주제를 입력해주세요." },
    USER_BOARDCONTENTS_EMPTY : { "isSuccess": false, "code": 2062, "message": "게시판 내용를 입력해주세요." },
    USER_BOARDCOMMENTCONTENTS_EMPTY : { "isSuccess": false, "code": 2063, "message": "댓글 내용를 입력해주세요." },
    USER_BOARDID_EMPTY : { "isSuccess": false, "code": 2064, "message": "Board Id를 입력해주세요." },
    USER_BOARDIMG_EMPTY : { "isSuccess": false, "code": 2065, "message": "Board 이미지를 입력해주세요." },
    USER_COMMENTLAYERID_EMPTY : { "isSuccess": false, "code": 2066, "message": "Board Id를 입력해주세요." },
    USER_COMMENTID_EMPTY : { "isSuccess": false, "code": 2067, "message": "Comment Id를 입력해주세요." },
    BOARD_EMOJI_EMPTY : { "isSuccess": false, "code": 2068, "message": "이모지 Status를 입력해주세요." },
    COMMENT_EMOJI_EMPTY : { "isSuccess": false, "code": 2068, "message": "이모지 Status를 입력해주세요." },

    //상품 error
    PRODUCT_TITLE_EMPTY : { "isSuccess": false, "code": 2070, "message": "PRODUCT TITLE을 입력해주세요." },
    PRODUCT_CONTENTS_EMPTY : { "isSuccess": false, "code": 2071, "message": "PRODUCT Contents를 입력해주세요." },
    PRODUCT_PRICEPROPOSAL_EMPTY : { "isSuccess": false, "code": 2072, "message": "priceProposal를 입력해주세요." },
    PRODUCT_CATEGORY_EMPTY : { "isSuccess": false, "code": 2073, "message": "카테고리를 입력해주세요." },
    PRODUCT_PRICE_EMPTY : { "isSuccess": false, "code": 2074, "message": "가격을 입력해주세요." },
    PRODUCT_IMAGE_EMPTY : { "isSuccess": false, "code": 2075, "message": "img url을 입력해주세요." },
    PRODUCT_ID_EMPTY : { "isSuccess": false, "code": 2076, "message": "pdIdx를 입력해주세요." },
    USER_PRODUCTID_EMPTY : { "isSuccess": false, "code": 2077, "message": "productId를 입력해주세요." },
    HIDE_PRODUCT_STATUS_EMPTY : { "isSuccess": false, "code": 2078, "message": " Hide Product 상태값을 입력해주세요" },


    // 채팅 error
    ROOM_ID_EMPTY : { "isSuccess": false, "code": 2080, "message": "room id를 입력해주세요." },
    CHAT_CONTENTS_EMPTY : { "isSuccess": false, "code": 2081, "message": "채팅 내용을 입력해주세요." },
    CHAT_ID_EMPTY : { "isSuccess": false, "code": 2082, "message": "chat id를 입력해주세요." },

    //유저 error
    CHECK_PARMETER_LENGTH : { "isSuccess": false,"code": 2090,"message":"파라미터 개수가 맞지 않습니다." },
    SIGNUP_PHONENUMBER_LENGTH : { "isSuccess": false,"code": 2091,"message":"휴대폰 형식(000-0000-0000)이 맞지 않습니다." },
    SIGNUP_PHONENUMBER_EMPTY : {"isSuccess": false, "code": 2092, "message":"휴대폰번호를 입력해주세요."},
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2093, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2094,"message":"닉네임은 최대 20자리를 입력해주세요." },
    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2095, "message": "회원 상태값을 입력해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2096, "message": "닉네임을 입력해주세요." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2097, "message": "Token ID값과  유저 ID값이 다릅니다." },

    KAKAO_TOKEN_EMPTY : { "isSuccess": false, "code": 2098, "message": "카카오 토큰을 입력해주세요,." },


    // Response error
    NOT_CHANGE : { "isSuccess": false, "code": 3001, "message": "변경된 내용이 없습니다." },

    // User
    SIGNUP_REDUNDANT_PHONENUMBER : { "isSuccess": false, "code": 3010, "message":"중복된 번호입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3011, "message":"중복된 닉네임입니다." },
    PHONENUM_NOT_EXIST : { "isSuccess": false, "code": 3012, "message": "존재하지 않는 번호입니다." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 3013, "message": "존재하지 않은 유저입니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3014, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3015, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },
    PROFILE_SELECT_FAIL : { "isSuccess": false, "code": 3016, "message":"프로필 조회 실패" },
    DETAILPROFILE_SELECT_FAIL : { "isSuccess": false, "code": 3017, "message":"상세 프로필 조회 실패" },
    SAME_NICKNAME : { "isSuccess": false, "code": 3018, "message": "동일한 닉네임 입니다." },

    // topic
    TOPIC_SELECT_FAIL : { "isSuccess": false, "code": 3020, "message":"관심주제 조회 실패" },
    SIGNUP_REDUNDANT_USERID : { "isSuccess": false, "code": 3021, "message":"관심 주제가 등록되어 있는 유저입니다." },
    USER_TOPIC_NOT_EXIST : { "isSuccess": false, "code": 3022, "message": "회원의 관심주제가 등록되어 있지 않습니다." },

    // region
    REGION_SELECT_FAIL : { "isSuccess": false, "code": 3030, "message":"내 동네 조회 실패" },
    REGIONS_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3031, "message": "지역이 등록되어 있지 않습니다." },
    LEAD_REGION_NOT_EXIST : { "isSuccess": false, "code": 3032, "message": "대표 동네가 존재하지 않습니다." },
    SIGNUP_LEADREGION_COUNT : { "isSuccess": false,"code": 3033,"message":" 대표 동네는 최대 1개까지만 등록 가능합니다." },
    REGION_NOT_EXIST : { "isSuccess": false, "code": 3034, "message": "동네가 존재하지 않습니다." },
    SIGNUP_REDUNDANT_REGION : { "isSuccess": false, "code": 3035, "message":"중복된 지역입니다." },
    SIGNUP_REGION_COUNT : { "isSuccess": false,"code": 3036,"message":" 동네는 최대 2개까지만 등록 가능합니다. 1개의 동네 삭제 후 진행해주세요." },

    //product
    DIFFERENT_PRODUCT_IMAGE_USER : { "isSuccess": false,"code": 3040,"message":"상품을 등록한 유저가 아닙니다." },
    SIGNUP_PRODUCT_IMAGE_COUNT : { "isSuccess": false,"code": 3041,"message":" 상품사진은 최대 10개까지만 등록 가능합니다." },
    PRODUCT_ALREADY_PICK : { "isSuccess": false, "code": 3042, "message": "이미 찜한 상품 입니다." },
    USER_SELECTPRODUCT_NOT_EXIST : { "isSuccess": false, "code": 3043, "message": "찜 한 내역이 존재하지 않습니다." },
    PRODUCT_NOT_PICK_USER : { "isSuccess": false, "code": 3044, "message": "상품을 찜한 유저가 아닙니다." },
    USER_PRODUCTIMAGE_NOT_EXIST : { "isSuccess": false, "code": 3045, "message": "존재하지 않은 상품사진 입니다." },
    PRODUCT_NOT_ENROLL_USER : { "isSuccess": false, "code": 3046, "message": "상품을 등록한 유저가 아닙니다." },
    PRODUCT_ALREADY_DELETE : { "isSuccess": false, "code": 3047, "message": "이미 삭제 된 상품입니다." },
    PRODUCT_NOT_EXIST : { "isSuccess": false, "code": 3048, "message": "등록 된 상품이 없습니다." },

    //notice
    NOTICE_NOT_EXIST : { "isSuccess": false, "code": 3050, "message": "공지사항이 존재하지 않습니다." },

    //keyword
    SIGNUP_NOTICEREGION_COUNT : { "isSuccess": false,"code": 3060,"message":"알림받을 동네는 최대 2개까지만 등록 가능합니다." },
    SIGNUP_KEYWORD_COUNT : { "isSuccess": false,"code": 3061,"message":"키워드는 최대 30개까지만 등록 가능합니다." },
    SIGNUP_REDUNDANT_KEYWORD : { "isSuccess": false, "code": 3062, "message":"중복된 키워드 입니다." },
    DELETE_KIYWORD_NOT_EXIST : { "isSuccess": false, "code": 3063, "message": "삭제할 키워드가 존재하지 않습니다." },

    //chat
    PRODUCT_MEMBER : { "isSuccess": false, "code": 3070, "message": "상품을 등록한 유저입니다." },
    CHATROOM_ALREADY_EXIST : { "isSuccess": false, "code": 3071, "message": "채팅 방이 이미 존재합니다." },
    CHATROOM_NOT_EXIST : { "isSuccess": false, "code": 3072, "message": "채팅방이 존재하지 않습니다." },
    NOT_CHATROOM_MEMBER : { "isSuccess": false, "code": 3073, "message": "채팅방에 속한 유저가 아닙니다." },
    NOT_CHAT_MEMBER : { "isSuccess": false, "code": 3074, "message": "채팅을 작성한 유저가 아닙니다." },

    //board
    BOARD_NOT_EXIST : { "isSuccess": false, "code": 3080, "message": "게시글이 없습니다." },
    SIGNUP_BOARDIMAGE_COUNT : { "isSuccess": false,"code": 3081,"message":"게시글 이미지는 최대 10개까지만 등록 가능합니다. 삭제 후 등록해주세요." },
    BOARD_COMMNET_NOT_EXIST : { "isSuccess": false, "code": 3082, "message": "게시글 댓글이 없습니다." },
    USER_BOARD_NOT_EXIST : { "isSuccess": false, "code": 3083, "message": "게시판이 존재하지 않습니다." },
    BOARD_USER_DIFFERENT : { "isSuccess": false, "code": 3084, "message": "게시판을 등록한 유저가 아닙니다." },
    USER_BOARDIMAGE_NOT_EXIST : { "isSuccess": false, "code": 3085, "message": "해당 게시글 사진이 존재하지 않습니다." },
    USER_COMMENT_NOT_EXIST : { "isSuccess": false, "code": 3086, "message": "댓글이 존재하지 않습니다." },
    COMMENT_USER_DIFFERENT : { "isSuccess": false, "code": 3087, "message": "댓글을 등록한 유저가 아닙니다." },
    COMMENT_ALREADY_DELETE : { "isSuccess": false, "code": 3088, "message": "이미 삭제된 댓글입니다." },
    BOARD_IMAGE_NOT_EXIST : { "isSuccess": false, "code": 3089, "message": "조회 할 이미지가 없습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},

}
