# :fire:당근마켓 클론 코딩 프로젝트
- 소프트스퀘어드 교육 5 ~ 6주차 과제로 진행하였습니다.
### :file_folder:디렉토리 구조
```bash
📂 config
 ├── 📄baseResponseStatus.js 
 ├── 📄database.js
 ├── 📄express.js
 ├── 📄jwtMiddleware.js
 ├── 📄response.js
 ├── 📄winston.js
📂 src
 └── 📂 Board 
      ├── 📄boardController.js
      ├── 📄boardDao.js
      ├── 📄boardProvider.js
      ├── 📄boardRoute.js
      ├── 📄boardService.js
 └── 📂 Chat 
      ├── 📄chatController.js
      ├── 📄chatDao.js
      ├── 📄chatProvider.js
      ├── 📄chatRoute.js
      ├── 📄chatService.js
 └── 📂 Keyword 
      ├── 📄keywordController.js
      ├── 📄keywordDao.js
      ├── 📄keywordProvider.js
      ├── 📄keywordRoute.js
      ├── 📄keywordService.js
 └── 📂 Notice
      ├── 📄noticeController.js
      ├── 📄noticeDao.js
      ├── 📄noticeProvider.js
      ├── 📄noticeRoute.js
      ├── 📄noticeService.js
 └── 📂 Product 
      ├── 📄productController.js
      ├── 📄productDao.js
      ├── 📄productProvider.js
      ├── 📄productRoute.js
      ├── 📄productService.js
 └── 📂 Region 
      ├── 📄regionController.js
      ├── 📄regionDao.js
      ├── 📄regionProvider.js
      ├── 📄regionRoute.js
      ├── 📄regionService.js
 └── 📂 Topic 
      ├── 📄topicController.js
      ├── 📄topicDao.js
      ├── 📄topicProvider.js
      ├── 📄topicRoute.js
      ├── 📄topicService.js
 └── 📂 User 
      ├── 📄userController.js
      ├── 📄userDao.js
      ├── 📄userProvider.js
      ├── 📄userRoute.js
      ├── 📄userService.js
📄 .gitignore
📄 CREATE-TABLES.txt
📄 README.md
📄 index.js
📄 package.json
```
### :bar_chart: ERD 설계
- AqueryTool Link: https://aquerytool.com/aquerymain/index/?rurl=ec4feeac-56e3-4d3e-9a46-9231c7387ab0&
- AqueryTool Password : no03gy
- 본 ERD 설계는 실제 당근마켓과는 무관합니다.
- 어떻게 고민하며 ERD 를 설계했는지는 [기술블로그](https://choidr.tistory.com/entry/%EB%8B%B9%EA%B7%BC-%EB%A7%88%EC%BC%93-ERD-%EC%84%A4%EA%B3%84?category=1029182)에 정리했습니다. 

![ss](https://user-images.githubusercontent.com/63203480/121928216-e5cc2e80-cd7a-11eb-90d5-8794a02e98b0.PNG)

### :clipboard: Architecture

![아키텍처](https://user-images.githubusercontent.com/63203480/122328563-df040e00-cf6a-11eb-83d5-284297766523.PNG)

