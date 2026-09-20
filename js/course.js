/* 마이크로비트 MicroPython 강좌 커리큘럼
 * 원본: BBC micro:bit MicroPython 공식 문서 (https://microbit-micropython.readthedocs.io/en/v2-docs/)
 * 각 챕터의 내용은 lessons/<id>.js 에서 MB_COURSE.addChapter({...}) 로 등록한다.
 */
window.MB_COURSE = {
  title: '마이크로비트 MicroPython',
  subtitle: '시뮬레이터로 배우는 피지컬 컴퓨팅',
  docBase: 'https://microbit-micropython.readthedocs.io/en/v2-docs/',
  order: [
    { id: 'ch01', no: '01', title: '마이크로비트 시작하기', icon: '📟', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/introduction.html' },
    { id: 'ch02', no: '02', title: 'Hello, World!', icon: '👋', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/hello.html' },
    { id: 'ch03', no: '03', title: '이미지 — LED 화면에 그림 그리기', icon: '🖼️', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/images.html' },
    { id: 'ch04', no: '04', title: '버튼 — 입력 받기', icon: '🔘', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/buttons.html' },
    { id: 'ch05', no: '05', title: '입출력 핀 — 바깥 세상과 연결', icon: '🔌', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/io.html' },
    { id: 'ch06', no: '06', title: '음악 — 소리를 내 보자', icon: '🎵', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/music.html' },
    { id: 'ch07', no: '07', title: '난수 — 예측할 수 없는 프로그램', icon: '🎲', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/random.html' },
    { id: 'ch08', no: '08', title: '움직임 — 가속도 센서', icon: '📐', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/movement.html' },
    { id: 'ch09', no: '09', title: '제스처 — 동작을 알아채기', icon: '🤸', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/gestures.html' },
    { id: 'ch10', no: '10', title: '방향 — 나침반', icon: '🧭', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/direction.html' },
    { id: 'ch11', no: '11', title: '저장 — 파일과 데이터 기록', icon: '💾', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/storage.html' },
    { id: 'ch12', no: '12', title: '말하기와 소리', icon: '🗣️', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/speech.html' },
    { id: 'ch13', no: '13', title: '통신 — 선과 무선', icon: '📡', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/radio.html' },
    { id: 'ch14', no: '14', title: '다음 단계 — 확장과 프로젝트', icon: '🚀', ref: 'https://microbit-micropython.readthedocs.io/en/v2-docs/tutorials/next.html' }
  ],
  chapters: {},
  addChapter: function (ch) { this.chapters[ch.id] = ch; }
};
