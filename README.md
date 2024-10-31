## 체크리스트
- [x] 입력 글자가 정답과 같은위치+같은 글자일 경우 초록색
- [x] 입력 글자가 정답에 포함시 노란색
- [x] 입력 글자가 정답에 존재하지 않을시 회색
- [x] 첫 페이지에 두가지 버튼
- [x] URL 접속시 이전 히스토리 기억
- [x] URL 해시화
- [x] 5글자만 입력 가능
- [x] 실제로 존재하는 단어만 입력 가능
- [x] 6번 시도 초과시 게임 종료
- [x] 결과창 표시 (플레이 시간, 승리횟수, 승률, 추측 시도 분포도)

## 미리보기
[배포링크 바로가기](https://d2zh2dpqpd41pp.cloudfront.net/)
: s3 버킷을 배포한 후 CloudFront로 CDN을 적용했습니다.

## 기술 스택
- **React**: 익숙하게 사용할 줄 아는 프레임워크/라이브러리인 React와 Next중에서, 사용자 인터렉션이 많은 게임 프로젝트에서는 SSR의 장점을 활용할 수 없을거같아서 React로 제작했습니다.
- **SCSS**: 이번에 처음으로 css 전처리기를 사용해봤습니다. 게임페이지에 Row와 키보드를 설계할때 반복적으로 사용되는 스타일이 많을거같아서 약간의 러닝커브를 극복하고 도입했습니다.


## 트러블 슈팅
### 🔨 완료된 줄의 색상이 다음 줄에 따라 업데이트 되는 이슈
**문제 상황** <br />
Row 컴포넌트에서 이미 완료된 줄의 동일 알파벳이 다음줄에서 색상이 바뀔때 (정답과 같은 위치에 재배치되는 경우) 이에 영향을 받아 완료된 줄의 특정 알파벳의 색상이 업데이트되는 이슈가 있었습니다.

**해결 방법** <br />
각 줄의 status 상태를 추가해서 `complete`일때만 색상을 계산하도록 했으며, 이후에는 변경되지 않도록 메모이제이션했습니다. useEffect 대신 `useMemo`를 필요한 시점에만 색상을 계산하고, 이후에는 해당 값을 재사용할 수 있도록 리팩토링했습니다.


useMemo를 통해 이미 완료된 줄의 경우 색상을 한 번 고정되어, 한 줄이 끝난 후 불필요한 색상 변경 문제가 해결되었습니다.


### 🔨 객체 활용으로 helpModal 코드 개선
**문제 상황** <br />
기존의 helpModal에서 "Example" 단어에 해당하는 알파벳들이 각각의 `<div>`태그로 직접 하드코딩해서 작성했습니다. 예제 데이터가 (TABLE, FLASH, FLAME)으로 세개가 되면서 반복되는 구조를 로직으로 재사용하지 못하고 있었습니다.

**해결 방법** <br />
예제 데이터를 객체 배열로 관리해서, 예제 알파벳 수정시 객체 배열만 수정하면 되서 유지보수성과 가독성이 좋아졌습니다.


### 🔨 게임 종료 후 타이머 관리
**문제 상황** <br />
Wordle 게임 진행시 시작되는 타이머를 멈추게 하는 버튼이 없어서 게임이 종료된 이후에도 계속 실행되고 있었습니다.

**해결 방법** <br />
게임이 종료되고 나서 등장하는 gameOverModal에서 갈 수 있는 경로는 '게임 다시하기'와 '랜딩 페이지'였습니다. 그래서 각 두 경로에 최초 입장시 useEffect로 로컬스토리지의 history가 초기화되어 게임 재실행시 타이머를 처음부터 실행할 수 있게 했습니다.

useEffect의 두번째 인자로 빈배열을 넣어서 컴포넌트가 마운트될 때 한 번만 실행되도록 했습니다.

## 회고
### 아쉬운 점
- SCSS 스타일을 처음 다뤄봐서 초반에 스타일 코드를 미숙하게 작성했고, 많은 기능을 다뤄보지 못한거같습니다. (특히 모달 스타일부분)

### 잘한 점
- 타입 정의를 별도의 파일로 리팩토링해서 겹치는 타입을 재사용할 수 있었습니다.
- 사용자 경험 향상을 위해 주어진 구현사항에서 몇가지 기능을 더 추가했습니다.
    - 다크모드
    - 게임 도움말
    - 모바일뷰 지원
    - 알파벳 입력시 bounce 애니메이션