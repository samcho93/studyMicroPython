# 📟 마이크로비트 MicroPython 웹 실습 강좌

**BBC micro:bit** 와 **MicroPython** 을 브라우저에서 바로 실습하는 **한글 강좌 사이트**입니다.
BBC micro:bit 공식 MicroPython 문서([microbit-micropython.readthedocs.io](https://microbit-micropython.readthedocs.io/en/v2-docs/))의
튜토리얼과 API 레퍼런스를 바탕으로 우리말로 다시 쓰고, 학교 수업에 맞게 재구성했습니다.

**▶ 실행: <https://samcho93.github.io/studyMicroPython/>**

설치할 것이 없습니다. 파이썬은 브라우저 안(Pyodide · WebAssembly)에서 실행되고,
오른쪽 **micro:bit 시뮬레이터**에서 LED 화면 · 버튼 · 센서 · 핀이 실제처럼 움직입니다.
USB 로 **진짜 보드를 연결**하면 같은 코드를 그대로 올려 실행할 수 있습니다.

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| **학생용 / 교사용** | 학생용은 문서형 강좌(개념 → 예제 → 실습 → 퀴즈), 교사용은 16:9 슬라이드 + 교사 노트 · 수업 흐름 · 퀴즈 정답 · 실습 정답 · 수업 타이머 · 발표자 창 · 전체 화면 |
| **micro:bit 시뮬레이터** | 5×5 LED 화면(밝기 0~9), 버튼 A·B, 터치 로고, 엣지 커넥터 25핀. 마우스·키보드로 직접 조작 |
| **센서 조작** | 기울기 패드로 가속도 3축, 제스처 버튼, 나침반 다이얼, 온도·빛·소리 슬라이더 |
| **핀 입출력** | 디지털 입출력, 아날로그 입력(0~1023), PWM 출력, 터치. 핀별 모드·값 표와 입력 강제(0/1) |
| **부품 연결** | LED · 버튼 · 토글 스위치 · 가변저항 · 조도 센서 · 부저 · 서보 모터 · NeoPixel 띠 · DC 모터를 원하는 핀에 연결하고 동작 확인 |
| **파이썬 셸 (REPL)** | 콘솔 아래 `>>>` 칸에서 한 줄씩 실행. 실제 보드의 REPL 과 같은 방식(블록 입력·히스토리 지원) |
| **코드 편집기** | CodeMirror 기반. 교시별 자동 저장, 오류 줄 표시, `main.py` 로 내려받기 |
| **실제 보드 연결** | Web Serial(Chrome · Edge)로 micro:bit 에 연결 → `main.py` 업로드 · 즉시 실행 · 파일 목록 · REPL |
| **무선 · 파일 · 로깅** | `radio`(가상 짝 보드), micro:bit 파일 시스템, `log` 모듈 데이터 로깅 + CSV 내려받기 |
| **진도 관리** | 교시별 학습 완료 표시, 진도 막대, 전체 검색 |

### 지원하는 MicroPython 모듈

`microbit`(display · button_a/b · pin0~pin20 · accelerometer · compass · microphone · speaker · i2c · spi · uart · Image · temperature · running_time · scale),
`music`, `radio`, `speech`, `audio`, `neopixel`, `log`, `machine`, `power`, `micropython`,
그리고 `random` · `math` · `time` · `os` 등 표준 모듈.

> 여기서 만든 코드는 **한 글자도 고치지 않고 실제 micro:bit 에서 그대로 동작**합니다.

---

## 강좌 구성 (14챕터 · 32교시)

| # | 챕터 | 내용 |
|---|---|---|
| 01 | 마이크로비트 시작하기 | 보드 둘러보기 · MicroPython · 강좌 사용법 · 보드에 올리기 |
| 02 | Hello, World! | `display.scroll` · `show` · `sleep` · 주석 · 오류 읽기 |
| 03 | 이미지 | 내장 이미지 · 직접 만들기 · 픽셀 · 애니메이션 |
| 04 | 버튼 | `is_pressed` · `was_pressed` · `get_presses` · 이벤트 루프 |
| 05 | 입출력 핀 | 디지털 · 아날로그 · PWM · 터치 · 부품 연결 |
| 06 | 음악 | `music` 모듈 · 내장 멜로디 · 직접 작곡 · `pitch` |
| 07 | 난수 | `random` · 주사위 · 운세 · 가위바위보 |
| 08 | 움직임 | 가속도 센서 · 수평계 · 기울기 게임 |
| 09 | 제스처 | `current_gesture` · `was_gesture` · 마술의 8번 공 |
| 10 | 방향 | 나침반 · 보정 · 나침반 만들기 |
| 11 | 저장 | 파일 시스템 · `open` · `os` · `log` 데이터 로깅 |
| 12 | 말하기와 소리 | `speech` · `audio` · 마이크 · 스피커 |
| 13 | 통신 | 핀으로 통신(UART) · `radio` 무선 |
| 14 | 다음 단계 | NeoPixel · 서보 · 종합 프로젝트 |

각 교시마다 **개념 설명 · 그림 · 실행 가능한 예제 · 실습 과제(난이도 ★) · 확인 퀴즈 · 수업용 슬라이드**가 들어 있습니다.

예제는 세 종류로 나뉘며 모두 바로 실행할 수 있습니다.

- `예제` — 본문에서 설명한 개념을 그대로 확인하는 기본 코드
- `추가` — 교시 끝의 **더 해 보기**. 배운 것을 조금씩 바꿔 보는 연습용 코드
- `응용` — 챕터 끝의 **🚀 응용 예제**. 챕터 내용을 모아 하나의 작품으로 완성하는 코드(챕터마다 5개)

전체 분량은 14챕터 · 32교시 · 실행 예제 364개 · 실습 과제 69개 · 확인 퀴즈 156개입니다.

---

## 사용법

1. 왼쪽 목차에서 챕터와 교시를 고릅니다.
2. 예제의 **▶ 실행**을 누르면 아래 편집기로 코드가 들어가고 오른쪽 시뮬레이터가 움직입니다.
3. 보드 그림의 **버튼 A · B**(키보드 <kbd>A</kbd> · <kbd>B</kbd>), **로고**, **핀 0·1·2** 를 눌러 보고,
   아래 탭에서 센서 값을 바꾸거나 부품을 연결합니다.
4. 콘솔 아래 `>>>` 칸에서 한 줄씩 실험해 봅니다.
5. 실제 보드가 있으면 **🔌 보드** → 연결 → **⬆ main.py 로 저장하고 실행**.

**단축키**

| 키 | 동작 |
|---|---|
| Ctrl + Enter | 편집기 코드 실행 |
| Ctrl + C | 실행 중지 (셸 입력칸에서) |
| A / B | 시뮬레이터 버튼 A · B 누르기 |
| Alt + ← / → | 이전 · 다음 교시 |
| ← → Space / Home End | (슬라이드) 이전·다음 · 첫·마지막 쪽 |
| F / G / R / N / B / T | (슬라이드) 전체 화면 · 목록 · 결과 창 · 노트 · 가리기 · 타이머 |
| Ctrl + Z | (교사용 슬라이드) 판서 되돌리기 |

교사용 슬라이드 화면에는 이동·타이머·발표자 창이 있는 첫째 줄과
**✏️ 판서 도구**(펜 · 형광펜 · 지우개 · 지시봉 · 색 6가지 · 굵기 3단계 · 되돌리기)가 있는 둘째 줄이 있습니다.
슬라이드 좌우 가장자리를 클릭하면 쪽이 넘어가고, 가운데를 끌면 판서가 됩니다.
자세한 내용은 [교사용 수업 운영 안내](docs/LESSON_GUIDE.md)를 보세요.

> 교사용 화면은 처음 들어갈 때 비밀번호를 한 번 묻습니다(기본값 `microbit`).
> 정답·노트를 가리는 용도이며, `js/app.js` 의 `TEACHER_PASS` 에서 바꿀 수 있습니다.

---

## 실제 micro:bit 연결하기

1. micro:bit 를 USB 케이블(**데이터가 통하는 것**)로 컴퓨터에 연결합니다.
2. <https://python.microbit.org> 에서 아무 프로그램이나 한 번 전송해 **MicroPython 펌웨어**를 설치합니다. (처음 한 번만)
3. 이 사이트를 **Chrome 또는 Edge**(데스크톱)에서 **https** 또는 **localhost** 주소로 엽니다.
4. 오른쪽 위 **🔌 보드** → 목록에서 micro:bit 선택.

> Firefox · Safari · 모바일 브라우저는 Web Serial 을 지원하지 않습니다. 시뮬레이터로는 모든 실습이 가능합니다.

---

## 로컬에서 실행

빌드 과정이 없는 **정적 웹앱**입니다. 파일을 그대로 열어도 되지만,
브라우저 보안 정책(모듈 · 보드 연결) 때문에 간단한 웹 서버로 여는 것을 권합니다.

```bash
python server/serve.py
```

- Windows 는 `start.bat` 을 더블클릭해도 됩니다.
- 교실에서 학생 PC 가 교사 PC 에 접속하게 하려면 `python server/serve.py --lan`
- 파이썬 코드는 서버가 아니라 **각 학생의 브라우저 안에서** 실행됩니다.

---

## GitHub Pages 배포

이 저장소는 **정적 파일만** 사용하므로 GitHub Pages 에 그대로 올라갑니다.

1. GitHub 저장소 → **Settings** → **Pages**
2. **Source** 를 `Deploy from a branch`, **Branch** 를 `main` / `/ (root)` 로 지정하고 저장
3. 1~2분 뒤 `https://<사용자>.github.io/<저장소>/` 에서 열립니다.

`.nojekyll` 파일이 들어 있어 Jekyll 처리 없이 그대로 서빙됩니다. 빌드 과정이 없으므로
별도의 Actions 워크플로 없이 브랜치 배포만으로 충분합니다.

> GitHub Pages 는 https 이므로 **실제 보드 연결(Web Serial)** 도 그대로 동작합니다.

---

## 구조

```
studyMpython/
├─ index.html            # 강좌 본체 (학생/교사 공용)
├─ student.html          # 학생용으로 열기
├─ teacher.html          # 교사용으로 열기
├─ presenter.html        # 발표자 창 (교사용 슬라이드)
├─ css/
│  ├─ style.css          # 전체 스타일 (라이트/다크)
│  ├─ slides.css         # 슬라이드
│  └─ sim.css            # 시뮬레이터 패널
├─ js/
│  ├─ course.js          # 커리큘럼 목록
│  ├─ app.js             # 메인 앱 (목차 · 문서 · 편집기 · 진도 · 보드 연결)
│  ├─ slides.js          # 슬라이드 · 발표자 모드 · 전체 화면 · 가장자리 이동
│  ├─ ink.js             # 슬라이드 판서(펜 · 형광펜 · 지우개 · 되돌리기)
│  ├─ console.js         # 콘솔 + 파이썬 셸(REPL) + 오류 도움말
│  ├─ runtime.js         # Pyodide 로더 · 실행 엔진
│  ├─ pylib.js           # 런타임(_mbrt: 비동기 변환) · time · micropython
│  ├─ pylib_mb.js        # microbit · music · audio · speech · radio · neopixel · log · power · machine
│  ├─ sim.js             # 시뮬레이터 상태 모델 + 하드웨어 API(mbhw)
│  ├─ simview.js         # 보드 그림 · 센서 · 핀 · 부품 · 무선 · 파일 · 로그 패널
│  ├─ serial.js          # Web Serial 로 실제 보드 연결
│  └─ highlight.js       # 코드 강조 · 편집기
├─ lessons/ch01.js ~ ch14.js   # 챕터별 강의 내용 (문서 · 예제 · 실습 · 퀴즈 · 슬라이드)
├─ server/serve.py       # 로컬 · 교실용 정적 서버
└─ docs/LESSON_GUIDE.md  # 교사용 수업 운영 안내
```

---

## 참고 · 라이선스

- 원본 문서: [MicroPython on the BBC micro:bit](https://microbit-micropython.readthedocs.io/en/v2-docs/) (MIT)
- micro:bit 는 [Micro:bit Educational Foundation](https://microbit.org) 의 상표입니다.
- 이 강좌 자료는 교육 목적으로 자유롭게 사용할 수 있습니다.
