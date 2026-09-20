/* Chapter 01. 마이크로비트 시작하기
 * 원본: MicroPython on the BBC micro:bit — Introduction / Flashing
 */
(function () {
  /* ───────────── 공용 그림 ───────────── */
  const FIG_BOARD = `<svg viewBox="0 0 1280 620" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker id="c1a" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <rect x="330" y="90" width="620" height="380" rx="34" fill="#0e6b64" stroke="#0a4f4a" stroke-width="4"/>
  <!-- 로고 -->
  <circle cx="612" cy="146" r="14" fill="#d4a017"/><circle cx="668" cy="146" r="14" fill="#d4a017"/>
  <rect x="598" y="160" width="84" height="14" rx="7" fill="#d4a017" opacity=".5"/>
  <!-- LED -->
  ${Array.from({ length: 25 }, (_, i) => `<rect x="${556 + (i % 5) * 34}" y="${218 + Math.floor(i / 5) * 30}" width="13" height="20" rx="3" fill="${[0, 2, 6, 8, 12, 16, 18, 22, 24].includes(i) ? '#ff2d1a' : '#4a1a16'}"/>`).join('')}
  <!-- 버튼 -->
  <rect x="404" y="252" width="64" height="64" rx="10" fill="#101418"/><circle cx="436" cy="284" r="17" fill="#2b3138"/>
  <text x="436" y="342" text-anchor="middle" font-size="24" font-weight="bold" fill="#cfe9e6">A</text>
  <rect x="812" y="252" width="64" height="64" rx="10" fill="#101418"/><circle cx="844" cy="284" r="17" fill="#2b3138"/>
  <text x="844" y="342" text-anchor="middle" font-size="24" font-weight="bold" fill="#cfe9e6">B</text>
  <!-- 엣지 커넥터 -->
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="${360 + i * 140}" y="440" width="34" height="58" rx="3" fill="#e0b526"/>`).join('')}
  ${Array.from({ length: 16 }, (_, i) => `<rect x="${406 + i * 34}" y="440" width="9" height="34" rx="2" fill="#c9a227"/>`).join('')}
  <text x="377" y="478" text-anchor="middle" font-size="18" font-weight="bold" fill="#2b2205">0</text>
  <text x="517" y="478" text-anchor="middle" font-size="18" font-weight="bold" fill="#2b2205">1</text>
  <text x="657" y="478" text-anchor="middle" font-size="18" font-weight="bold" fill="#2b2205">2</text>
  <text x="797" y="478" text-anchor="middle" font-size="16" font-weight="bold" fill="#2b2205">3V</text>
  <text x="937" y="478" text-anchor="middle" font-size="16" font-weight="bold" fill="#2b2205">G</text>
  <!-- 설명선 -->
  ${[
      [640, 130, 640, 60, '터치 로고 (V2)', 'middle'],
      [640, 250, 1130, 200, 'LED 화면 5 × 5', 'start'],
      [436, 284, 150, 240, '버튼 A', 'end'],
      [844, 284, 1130, 300, '버튼 B', 'start'],
      [640, 466, 640, 560, '엣지 커넥터 (핀)', 'middle'],
      [420, 420, 150, 400, '스피커 · 마이크 (V2)', 'end'],
      [880, 400, 1130, 420, '가속도 · 나침반 센서', 'start']
    ].map(([x1, y1, x2, y2, label, anchor]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="2.5" marker-end="url(#c1a)" stroke-dasharray="6 5"/>
  <text x="${x2 + (anchor === 'start' ? 10 : anchor === 'end' ? -10 : 0)}" y="${y2 + (anchor === 'middle' ? (y2 > y1 ? 26 : -10) : 6)}" text-anchor="${anchor}" font-size="22" font-weight="bold" fill="var(--fg)">${label}</text>`).join('\n  ')}
  <circle cx="420" cy="420" r="13" fill="#11171c"/><circle cx="880" cy="400" r="13" fill="#11171c"/>
</svg>`;

  const FIG_FLOW = `<svg viewBox="0 0 1280 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker id="c1b" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker></defs>
  ${[['① 코드 작성', '이 사이트의 편집기', '#0c8b8d'], ['② 시뮬레이터 실행', '오른쪽 보드 그림', '#b4530a'], ['③ 실제 보드 전송', 'USB 로 main.py 업로드', '#1f9d55'], ['④ 보드 단독 실행', '건전지만으로 동작', '#7b4fd1']]
      .map(([t, s, c], i) => {
        const x = 40 + i * 310;
        return `<rect x="${x}" y="70" width="270" height="150" rx="18" fill="var(--card)" stroke="${c}" stroke-width="4"/>
  <text x="${x + 135}" y="130" text-anchor="middle" font-size="26" font-weight="bold" fill="${c}">${t}</text>
  <text x="${x + 135}" y="172" text-anchor="middle" font-size="19" fill="var(--muted)">${s}</text>` +
          (i < 3 ? `<line x1="${x + 275}" y1="145" x2="${x + 305}" y2="145" stroke="var(--ok)" stroke-width="5" marker-end="url(#c1b)"/>` : '');
      }).join('\n  ')}
  <text x="640" y="285" text-anchor="middle" font-size="21" fill="var(--muted)">①②번만으로도 모든 실습이 가능합니다. 보드가 있으면 ③④로 진짜 장치를 만듭니다.</text>
</svg>`;

  const FIG_SCREEN = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="30" y="30" width="330" height="360" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="4"/>
  <rect x="30" y="30" width="330" height="48" rx="14" fill="var(--accent)" opacity=".16"/>
  <text x="55" y="63" font-size="22" font-weight="bold" fill="var(--accent)">① 왼쪽 · 목차</text>
  ${['🏠 강좌 소개', '01 마이크로비트 시작', '02 Hello, World!', '03 이미지', '04 버튼', '…'].map((t, i) => `<text x="58" y="${118 + i * 42}" font-size="20" fill="var(--fg)">${t}</text>`).join('\n  ')}
  <rect x="380" y="30" width="480" height="230" rx="14" fill="var(--card)" stroke="var(--accent2)" stroke-width="4"/>
  <rect x="380" y="30" width="480" height="48" rx="14" fill="var(--accent2)" opacity=".16"/>
  <text x="405" y="63" font-size="22" font-weight="bold" fill="var(--accent2)">② 가운데 위 · 강좌 문서</text>
  <text x="405" y="120" font-size="20" fill="var(--muted)">개념 설명 · 그림 · 예제 코드</text>
  <text x="405" y="160" font-size="20" fill="var(--muted)">실습 과제 · 확인 퀴즈</text>
  <text x="405" y="215" font-size="19" fill="var(--ok)">예제의 ▶ 실행을 누르면 아래 편집기로!</text>
  <rect x="380" y="272" width="480" height="118" rx="14" fill="var(--card)" stroke="var(--ok)" stroke-width="4"/>
  <text x="405" y="304" font-size="22" font-weight="bold" fill="var(--ok)">③ 가운데 아래 · 코드 편집기 (main.py)</text>
  <text x="405" y="342" font-size="19" font-family="monospace" fill="var(--fg)">from microbit import *</text>
  <text x="405" y="372" font-size="19" font-family="monospace" fill="var(--fg)">display.scroll("Hello!")</text>
  <rect x="880" y="30" width="370" height="250" rx="14" fill="var(--card)" stroke="var(--more)" stroke-width="4"/>
  <rect x="880" y="30" width="370" height="48" rx="14" fill="var(--more)" opacity=".16"/>
  <text x="905" y="63" font-size="22" font-weight="bold" fill="var(--more)">④ 오른쪽 위 · 시뮬레이터</text>
  <rect x="960" y="100" width="210" height="130" rx="14" fill="#0e6b64"/>
  ${Array.from({ length: 25 }, (_, i) => `<rect x="${1000 + (i % 5) * 26}" y="${120 + Math.floor(i / 5) * 20}" width="9" height="13" rx="2" fill="${[6, 8, 16, 17, 18].includes(i) ? '#ff2d1a' : '#4a1a16'}"/>`).join('')}
  <text x="1065" y="262" text-anchor="middle" font-size="19" fill="var(--muted)">LED · 버튼 · 센서 · 핀</text>
  <rect x="880" y="292" width="370" height="98" rx="14" fill="#0f1419" stroke="var(--line)" stroke-width="3"/>
  <text x="905" y="322" font-size="20" font-weight="bold" fill="#4cc983">⑤ 오른쪽 아래 · 콘솔 + 파이썬 셸</text>
  <text x="905" y="356" font-size="18" font-family="monospace" fill="#d7dde8">Hello!</text>
  <text x="905" y="380" font-size="18" font-family="monospace" fill="#ff7b72">&gt;&gt;&gt; <tspan fill="#7ee787">display.show(Image.HEART)</tspan></text>
</svg>`;

  const FIG_FLASH = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker id="c1c" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--fg)"/></marker></defs>
  ${[['①', 'USB 케이블 연결', 'micro:bit ↔ PC', 'MICROBIT 드라이브가 보임'],
      ['②', 'MicroPython 설치', 'python.microbit.org', '한 번만 하면 됩니다'],
      ['③', '🔌 보드 누르기', '이 사이트 오른쪽 위', '포트 목록에서 선택'],
      ['④', '⬆ main.py 전송', '코드가 보드에 저장', 'USB 를 빼도 동작']]
      .map(([n, a, b, c], i) => {
        const x = 30 + i * 312;
        return `<rect x="${x}" y="70" width="272" height="230" rx="18" fill="var(--card)" stroke="${i === 1 ? 'var(--danger)' : 'var(--accent)'}" stroke-width="4"/>
  <text x="${x + 136}" y="128" text-anchor="middle" font-size="38" font-weight="bold" fill="${i === 1 ? 'var(--danger)' : 'var(--accent)'}">${n}</text>
  <text x="${x + 136}" y="180" text-anchor="middle" font-size="23" font-weight="bold" fill="var(--fg)">${a}</text>
  <text x="${x + 136}" y="220" text-anchor="middle" font-size="19" fill="var(--muted)">${b}</text>
  <text x="${x + 136}" y="252" text-anchor="middle" font-size="18" fill="var(--muted)">${c}</text>` +
          (i < 3 ? `<line x1="${x + 277}" y1="185" x2="${x + 307}" y2="185" stroke="var(--fg)" stroke-width="4" marker-end="url(#c1c)"/>` : '');
      }).join('\n  ')}
  <text x="640" y="360" text-anchor="middle" font-size="21" fill="var(--danger)">②번(MicroPython 펌웨어)을 빠뜨리면 보드가 파이썬 코드를 알아듣지 못합니다</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch01',
    no: '01',
    title: '마이크로비트 시작하기',
    subtitle: 'micro:bit 둘러보기 · MicroPython · 강좌 사용법 · 보드에 올리기',
    summary: '손바닥만 한 컴퓨터 BBC micro:bit 가 어떤 부품으로 이루어져 있는지 살펴보고, 그 위에서 돌아가는 파이썬인 MicroPython 을 소개합니다. 이 강좌의 화면 구성(문서 · 편집기 · 시뮬레이터 · 파이썬 셸)을 익히고, 실제 보드에 MicroPython 을 설치해 내 프로그램을 올리는 방법까지 배웁니다.',
    goals: [
      'micro:bit 의 주요 부품(LED 화면, 버튼, 센서, 엣지 커넥터)의 이름과 역할을 말할 수 있다',
      'MicroPython 이 무엇이고 일반 파이썬과 어떻게 다른지 설명할 수 있다',
      '이 강좌의 편집기 · 시뮬레이터 · 파이썬 셸을 사용해 코드를 실행할 수 있다',
      '실제 micro:bit 에 MicroPython 을 설치하고 main.py 를 올릴 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch01-1',
        title: 'micro:bit 와 MicroPython 만나기',
        minutes: 45,
        goals: [
          'micro:bit 가 어떤 장치인지, 어디에 쓰는지 설명할 수 있다',
          'LED 화면 · 버튼 · 센서 · 핀의 위치와 역할을 찾을 수 있다',
          'MicroPython 과 일반 파이썬(CPython)의 차이를 설명할 수 있다'
        ],
        flow: [['도입: 피지컬 컴퓨팅이란', 6], ['micro:bit 둘러보기', 14], ['MicroPython 소개', 12], ['첫 코드 맛보기', 8], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '컴퓨터가 세상과 만날 때 — 피지컬 컴퓨팅' },
          { type: 'p', html: '지금까지 배운 프로그래밍은 대부분 <b>화면 안</b>에서 일어났습니다. <code>print()</code> 로 글자를 찍고, 계산 결과를 보여 주는 식이었지요. 그런데 우리 주변의 컴퓨터들은 화면 밖에서도 일합니다. 엘리베이터는 버튼을 누르면 움직이고, 자동문은 사람이 다가오면 열리고, 스마트워치는 손목의 움직임을 읽어 걸음 수를 셉니다.' },
          { type: 'p', html: '이렇게 <b>센서로 현실을 읽고, 모터 · LED · 소리로 현실에 반응하는</b> 프로그래밍을 <b>피지컬 컴퓨팅(physical computing)</b> 이라고 합니다. 이 강좌에서 쓸 <b>BBC micro:bit</b> 는 피지컬 컴퓨팅을 배우기 위해 영국 BBC 가 만들어 전 세계 학교에 보급한 작은 컴퓨터입니다.' },
          { type: 'callout', kind: 'info', title: 'BBC micro:bit 는?', html: '<p>2015년 영국 BBC 가 “모든 11살 아이에게 컴퓨터를”이라는 목표로 만든 손바닥만 한 교육용 보드입니다. 지금은 60개국이 넘는 나라의 학교에서 쓰이고 있습니다. 이 강좌는 <b>V2</b>(스피커 · 마이크 · 터치 로고가 있는 모델) 기준으로 설명하며, V1 에서도 대부분 그대로 동작합니다.</p>' },

          { type: 'h', text: 'micro:bit 둘러보기' },
          { type: 'p', html: '아래 그림에서 각 부품의 위치를 확인해 보세요. <b>오른쪽 시뮬레이터의 보드 그림</b>과 똑같습니다. 보드 그림의 버튼과 핀은 <b>마우스로 직접 누를 수 있습니다</b>.' },
          { type: 'figure', html: FIG_BOARD, caption: '그림 1-1. micro:bit V2 앞면의 주요 부품' },
          {
            type: 'table', head: ['부품', '무엇인가', '파이썬에서 쓰는 이름'], rows: [
              ['LED 화면', '빨간 LED 25개(5 × 5). 글자 · 그림 · 애니메이션을 보여 줍니다. 밝기도 조절됩니다.', '<code>display</code>'],
              ['버튼 A · B', '화면 양옆의 누름 버튼 2개', '<code>button_a</code>, <code>button_b</code>'],
              ['터치 로고 <span class="muted">(V2)</span>', '보드 위쪽 금색 로고. 손가락을 대면 반응합니다.', '<code>pin_logo</code>'],
              ['가속도 센서', '보드가 어느 쪽으로 기울었는지, 흔들렸는지 알아냅니다.', '<code>accelerometer</code>'],
              ['나침반(지자기) 센서', '어느 쪽이 북쪽인지 알아냅니다.', '<code>compass</code>'],
              ['온도 센서', '칩의 온도를 잽니다(대략적인 실내 온도).', '<code>temperature()</code>'],
              ['빛 센서', 'LED 화면 자체를 빛 센서로 씁니다.', '<code>display.read_light_level()</code>'],
              ['마이크 <span class="muted">(V2)</span>', '주변 소리의 크기를 잽니다.', '<code>microphone</code>'],
              ['스피커 <span class="muted">(V2)</span>', '보드만으로 소리를 냅니다(V1 은 부저 연결 필요).', '<code>speaker</code>, <code>music</code>'],
              ['엣지 커넥터', '아래쪽 금색 단자. 바깥 부품(LED · 버튼 · 센서 · 모터)을 연결합니다.', '<code>pin0</code> ~ <code>pin20</code>'],
              ['USB 단자', 'PC 와 연결해 프로그램을 올리고 전원을 공급합니다.', '—'],
              ['리셋 버튼', '뒷면의 작은 버튼. 프로그램을 처음부터 다시 실행합니다.', '<code>reset()</code>']
            ], caption: '표 1-1. micro:bit 의 주요 부품과 파이썬 이름'
          },
          { type: 'callout', kind: 'tip', title: '엣지 커넥터의 큰 단자 5개', html: '아래쪽 단자 중 <b>넓은 것 5개</b>(<code>0</code>, <code>1</code>, <code>2</code>, <code>3V</code>, <code>GND</code>)는 구멍이 뚫려 있어 <b>악어클립</b>으로 집을 수 있습니다. 수업에서 부품을 연결할 때는 주로 이 5개를 씁니다. 나머지 좁은 단자는 확장 보드(브레이크아웃 보드)를 끼워야 쓸 수 있습니다.' },

          { type: 'h', text: 'MicroPython — 작은 컴퓨터를 위한 파이썬' },
          { type: 'p', html: '파이썬은 원래 PC 나 서버처럼 <b>메모리가 넉넉한 컴퓨터</b>에서 돌아가도록 만들어졌습니다. 그런데 micro:bit 의 메모리는 약 <b>128KB</b> 밖에 되지 않습니다. 요즘 스마트폰 사진 한 장보다도 작지요.' },
          { type: 'p', html: '이렇게 작은 장치에서도 파이썬을 쓸 수 있게 다시 만든 것이 <b>MicroPython</b> 입니다. 데이미언 조지(Damien George)가 2013년에 시작했고, 파이썬 3 의 문법을 거의 그대로 따르면서 크기를 아주 작게 줄였습니다. micro:bit 의 MicroPython 에는 <code>microbit</code> · <code>music</code> · <code>radio</code> 같은 <b>보드 전용 모듈</b>이 함께 들어 있습니다.' },
          {
            type: 'table', head: ['', '일반 파이썬 (CPython)', 'MicroPython (micro:bit)'], rows: [
              ['돌아가는 곳', 'PC · 서버 · 노트북', 'micro:bit 같은 작은 보드'],
              ['메모리', '수 GB', '약 128KB (실제로 쓸 수 있는 건 더 적음)'],
              ['문법', '파이썬 3', '파이썬 3 과 거의 같음'],
              ['표준 라이브러리', '아주 많음 (수백 개 모듈)', '꼭 필요한 것만 (<code>random</code>, <code>math</code>, <code>os</code> 등)'],
              ['특별한 모듈', '—', '<code>microbit</code>, <code>music</code>, <code>radio</code>, <code>speech</code>, <code>neopixel</code>, <code>log</code>'],
              ['실행 방법', '<code>python hello.py</code>', '보드에 <code>main.py</code> 를 올리면 전원이 켜질 때 자동 실행']
            ]
          },
          { type: 'callout', kind: 'more', title: '왜 하필 파이썬일까?', html: '<p>micro:bit 는 블록 코딩(MakeCode)으로도 프로그래밍할 수 있습니다. 블록은 처음 배우기 쉽지만, 프로그램이 길어지면 화면이 복잡해지고 실제 개발 현장에서 쓰는 언어와 거리가 있습니다.</p><p>파이썬은 <b>읽기 쉬운 문법</b>을 가진 진짜 프로그래밍 언어이면서, 인공지능 · 데이터 분석 · 웹 개발 등 어디서나 쓰입니다. micro:bit 에서 배운 파이썬 문법은 그대로 PC 파이썬으로 이어집니다.</p>' },

          { type: 'h', text: '첫 코드 맛보기' },
          { type: 'p', html: '문법은 아직 몰라도 괜찮습니다. 아래 코드의 <b>▶ 실행</b>을 눌러 오른쪽 보드가 어떻게 움직이는지 보세요.' },
          {
            type: 'code', title: '예제 1-1. 인사하는 micro:bit', code: `from microbit import *

display.scroll("Hello, micro:bit!")
display.show(Image.HAPPY)`,
            desc: '<code>1행</code>은 “micro:bit 의 모든 기능을 가져와라”는 뜻입니다. micro:bit 프로그램은 거의 항상 이 줄로 시작합니다. <code>3행</code>은 글자를 오른쪽에서 왼쪽으로 흘려보내고, <code>4행</code>은 웃는 얼굴 그림을 보여 줍니다.',
            expect: 'LED 화면에 Hello, micro:bit! 가 흐른 뒤 웃는 얼굴이 남습니다.'
          },
          {
            type: 'code', title: '예제 1-2. 버튼을 누르면 반응하기', code: `from microbit import *

while True:
    if button_a.is_pressed():
        display.show(Image.HEART)
    elif button_b.is_pressed():
        display.show(Image.SAD)
    else:
        display.show(Image.ASLEEP)`,
            desc: '실행한 뒤 오른쪽 보드 그림의 <b>A · B 버튼을 마우스로 눌러 보세요</b>(키보드 <kbd>A</kbd> · <kbd>B</kbd> 도 됩니다). <code>while True:</code> 는 “계속 반복하라”는 뜻으로, micro:bit 프로그램의 가장 흔한 모습입니다. 멈추려면 오른쪽의 <b>■ 정지</b>를 누르세요.',
            expect: '아무것도 안 누르면 자는 얼굴, A 를 누르면 하트, B 를 누르면 슬픈 얼굴'
          },
          { type: 'callout', kind: 'warn', title: '끝나지 않는 프로그램', html: '<code>while True:</code> 로 시작하는 프로그램은 <b>스스로 끝나지 않습니다</b>. 실제 micro:bit 에서는 전원을 뽑을 때까지 계속 돌아가는 것이 정상이고, 이 강좌에서는 오른쪽 위의 <b>■</b> 또는 콘솔의 <b>■ 중지</b> 버튼으로 멈춥니다.' },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '<b>피지컬 컴퓨팅</b>은 센서로 현실을 읽고 LED · 소리 · 모터로 현실에 반응하는 프로그래밍입니다.',
              '<b>micro:bit</b> 에는 LED 화면(5 × 5), 버튼 A · B, 터치 로고, 가속도 · 나침반 · 온도 · 빛 · 소리 센서, 스피커, 엣지 커넥터가 있습니다.',
              '<b>MicroPython</b> 은 작은 장치를 위해 다시 만든 파이썬 3 입니다. 문법은 같고 라이브러리가 적으며, <code>microbit</code> 같은 보드 전용 모듈이 있습니다.',
              'micro:bit 파이썬 프로그램은 거의 항상 <code>from microbit import *</code> 로 시작합니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 1-1. 내 이름을 보여 주는 micro:bit',
            level: 1,
            desc: '<p>LED 화면에 <b>내 이름</b>을 흘려보낸 다음, 마음에 드는 그림을 하나 띄우세요.</p><p>쓸 수 있는 그림 예: <code>Image.HEART</code>, <code>Image.HAPPY</code>, <code>Image.DUCK</code>, <code>Image.GHOST</code>, <code>Image.MUSIC_QUAVER</code>, <code>Image.UMBRELLA</code></p>',
            hint: '<code>display.scroll("…")</code> 다음 줄에 <code>display.show(Image.…)</code> 를 씁니다. 한글은 micro:bit 폰트에 없으므로 <b>영문</b>으로 쓰세요.',
            starter: 'from microbit import *\n\n# TODO: 내 이름을 흘려보내기\n\n# TODO: 마음에 드는 그림 보여 주기\n',
            solution: 'from microbit import *\n\ndisplay.scroll("MINJUN")\ndisplay.show(Image.DUCK)\n'
          },
          {
            title: '실습 1-2. 부품 찾기',
            level: 1,
            desc: '<p>오른쪽 시뮬레이터의 보드 그림에서 다음을 찾아 마우스로 눌러 보고, 어떤 일이 일어나는지 관찰하세요.</p><ol><li>버튼 A, 버튼 B</li><li>금색 터치 로고</li><li>아래쪽의 큰 단자 <code>0</code>, <code>1</code>, <code>2</code></li></ol><p>그리고 아래 코드를 실행한 뒤, 각각을 눌렀을 때 화면이 어떻게 바뀌는지 확인하세요.</p>',
            hint: '단자(핀)에 마우스를 올리면 그 핀의 설명이 뜹니다. <code>pin_logo.is_touched()</code> 는 로고를 만졌는지 알려 줍니다.',
            starter: 'from microbit import *\n\nwhile True:\n    if button_a.is_pressed():\n        display.show("A")\n    elif button_b.is_pressed():\n        display.show("B")\n    elif pin_logo.is_touched():\n        display.show(Image.HEART)\n    elif pin0.is_touched():\n        display.show("0")\n    else:\n        display.clear()\n',
            solution: 'from microbit import *\n\nwhile True:\n    if button_a.is_pressed():\n        display.show("A")\n    elif button_b.is_pressed():\n        display.show("B")\n    elif pin_logo.is_touched():\n        display.show(Image.HEART)\n    elif pin0.is_touched():\n        display.show("0")\n    elif pin1.is_touched():\n        display.show("1")\n    elif pin2.is_touched():\n        display.show("2")\n    else:\n        display.clear()\n'
          }
        ],
        quiz: [
          {
            q: 'micro:bit 의 LED 화면은 몇 개의 LED 로 이루어져 있나요?', options: ['5 × 5 = 25개', '8 × 8 = 64개', '10 × 10 = 100개', '4 × 4 = 16개'], answer: 0,
            explain: '가로 5개, 세로 5개로 모두 <b>25개</b> 입니다. 빨간색 한 가지 색만 나오지만 밝기는 0 ~ 9 로 조절됩니다.'
          },
          {
            q: 'MicroPython 에 대한 설명으로 <b>틀린</b> 것은?', options: ['작은 장치에서 돌아가도록 만든 파이썬 3 이다', '문법은 일반 파이썬과 거의 같다', 'PC 파이썬의 모든 라이브러리를 그대로 쓸 수 있다', '<code>microbit</code> 같은 보드 전용 모듈이 들어 있다'], answer: 2,
            explain: 'MicroPython 은 메모리가 작은 장치용이라 <b>표준 라이브러리 중 꼭 필요한 것만</b> 들어 있습니다. <code>numpy</code>, <code>requests</code> 같은 큰 라이브러리는 쓸 수 없습니다.'
          },
          {
            q: 'micro:bit 파이썬 프로그램의 첫 줄로 가장 알맞은 것은?', options: ['<code>import microbit</code> 만 쓰면 된다', '<code>from microbit import *</code>', '<code>#include &lt;microbit.h&gt;</code>', '아무것도 쓰지 않아도 된다'], answer: 1,
            explain: '<code>from microbit import *</code> 를 쓰면 <code>display</code>, <code>button_a</code>, <code>Image</code> 등을 <b>이름 그대로</b> 쓸 수 있습니다. <code>import microbit</code> 만 하면 <code>microbit.display</code> 처럼 길게 써야 합니다.'
          },
          {
            q: '엣지 커넥터의 큰 단자 5개에 해당하지 <b>않는</b> 것은?', options: ['0', '1', '2', '13'], answer: 3,
            explain: '넓은 단자는 <code>0</code>, <code>1</code>, <code>2</code>, <code>3V</code>, <code>GND</code> 5개입니다. <code>13</code> 번은 좁은 단자라 확장 보드가 필요합니다.'
          },
          {
            q: '<code>while True:</code> 로 시작하는 프로그램의 특징은?', options: ['한 번만 실행되고 끝난다', '오류가 난다', '전원이 꺼질 때까지 계속 반복한다', '버튼을 눌러야만 실행된다'], answer: 2,
            explain: '<code>True</code> 는 항상 참이므로 <b>끝없이 반복</b>합니다. 센서를 계속 살펴야 하는 micro:bit 프로그램에서 가장 많이 쓰는 형태입니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: 'micro:bit 와 MicroPython 만나기', subtitle: 'Chapter 01 · 마이크로비트 시작하기', badge: '1교시',
            notes: '<p>첫 시간입니다. 실물 micro:bit 를 한 대씩 나눠 주거나 교사 화면으로 보여 주면서 시작하면 좋습니다.</p><p>시간: 2분</p>'
          },
          {
            layout: 'bullets', title: '피지컬 컴퓨팅이란?',
            bullets: ['화면 <b>안</b>이 아니라 <b>현실</b>을 다루는 프로그래밍', '<b>센서</b>로 읽고 → 판단하고 → <b>LED · 소리 · 모터</b>로 반응', '엘리베이터, 자동문, 스마트워치, 로봇청소기…', 'micro:bit = 피지컬 컴퓨팅 학습용 작은 컴퓨터'],
            notes: '<p><b>발문</b>: "교실 안에서 센서가 들어간 물건을 찾아볼까요?" → 자동문, 형광등 센서, 에어컨, 스마트폰.</p><p>시간: 6분</p>'
          },
          {
            layout: 'diagram', title: 'micro:bit V2 둘러보기', html: FIG_BOARD, caption: '부품 이름과 위치를 함께 짚어 봅니다',
            notes: '<p>실물을 들고 앞면 → 뒷면 순으로 짚어 줍니다. 뒷면에는 리셋 버튼, 전원 단자, 마이크로컨트롤러(nRF52833)가 있습니다.</p><p><b>발문</b>: "LED 가 몇 개일까요?" → 25개.</p><p>시간: 10분</p>'
          },
          {
            layout: 'table', title: '부품과 파이썬 이름', head: ['부품', '파이썬 이름'], rows: [
              ['LED 화면', '<code>display</code>'], ['버튼 A · B', '<code>button_a</code>, <code>button_b</code>'],
              ['가속도 센서', '<code>accelerometer</code>'], ['나침반', '<code>compass</code>'],
              ['온도', '<code>temperature()</code>'], ['핀', '<code>pin0</code> ~ <code>pin20</code>']],
            notes: '<p>이름을 외우게 하기보다 "부품마다 파이썬 이름이 하나씩 있다"는 것만 인식시킵니다. 챕터가 진행되며 자연스럽게 익힙니다.</p><p>시간: 4분</p>'
          },
          {
            layout: 'bullets', title: 'MicroPython 이란?',
            bullets: ['작은 장치를 위해 다시 만든 <b>파이썬 3</b>', 'micro:bit 메모리는 약 <b>128KB</b> (스마트폰 사진 1장보다 작음)', '문법은 파이썬과 <b>같음</b>, 라이브러리는 <b>적음</b>', '<code>microbit</code> · <code>music</code> · <code>radio</code> 등 보드 전용 모듈 포함'],
            notes: '<p>"여기서 배운 파이썬 문법은 PC 파이썬에서도 그대로 쓸 수 있다"는 점을 강조합니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '첫 코드', code: 'from microbit import *\n\ndisplay.scroll("Hello, micro:bit!")\ndisplay.show(Image.HAPPY)',
            points: ['<code>from microbit import *</code> 로 시작', '<code>scroll</code> = 글자 흘려보내기', '<code>show</code> = 그림 · 글자 하나 보여 주기', '▶ 실행 → 오른쪽 보드 확인'],
            notes: '<p>교사 화면에서 실행해 보여 준 뒤, 학생들이 따라 입력하게 합니다. 따옴표 안의 문장을 각자 바꿔 보게 하면 반응이 좋습니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: '버튼에 반응하기', code: 'from microbit import *\n\nwhile True:\n    if button_a.is_pressed():\n        display.show(Image.HEART)\n    elif button_b.is_pressed():\n        display.show(Image.SAD)\n    else:\n        display.show(Image.ASLEEP)',
            points: ['<code>while True:</code> = 계속 반복', '센서를 <b>계속 살펴보는</b> 것이 핵심', '시뮬레이터의 A · B 를 눌러 확인', '멈추려면 ■ 정지'],
            notes: '<p>문법 설명은 뒤 챕터에서 합니다. 지금은 "계속 반복하며 버튼을 확인한다"는 흐름만 보여 줍니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'quiz', title: '확인 퀴즈', q: 'micro:bit 의 LED 화면 개수는?', options: ['25개 (5×5)', '64개 (8×8)', '100개', '16개'], answer: 0,
            explain: '가로 5 × 세로 5 = 25개입니다.',
            notes: '<p>손을 들어 답하게 합니다.</p><p>시간: 2분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['피지컬 컴퓨팅 = 센서로 읽고 현실에 반응하는 프로그래밍', 'micro:bit: LED 25개 · 버튼 2개 · 센서 여러 개 · 핀 25개', 'MicroPython = 작은 장치용 파이썬 3', '모든 프로그램은 <code>from microbit import *</code> 로 시작'],
            notes: '<p>다음 시간 예고: 이 강좌 화면 사용법과 파이썬 셸(REPL).</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch01-2',
        title: '강좌 사용법 — 편집기 · 시뮬레이터 · 파이썬 셸',
        minutes: 45,
        goals: [
          '강좌 화면의 다섯 영역이 각각 무엇을 하는지 설명할 수 있다',
          '예제를 편집기로 불러와 실행하고, 코드를 고쳐 다시 실행할 수 있다',
          '시뮬레이터의 버튼 · 센서 · 핀을 조작해 프로그램의 반응을 확인할 수 있다',
          '파이썬 셸(&gt;&gt;&gt;)에서 한 줄씩 실행해 결과를 바로 볼 수 있다'
        ],
        flow: [['화면 구성 살펴보기', 8], ['편집기와 실행', 10], ['시뮬레이터 조작', 12], ['파이썬 셸(REPL)', 10], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '화면은 다섯 부분으로 되어 있습니다' },
          { type: 'figure', html: FIG_SCREEN, caption: '그림 1-2. 강좌 화면의 구성' },
          {
            type: 'table', head: ['영역', '하는 일'], rows: [
              ['① 왼쪽 · 목차', '챕터와 교시를 고릅니다. 위쪽 검색창으로 내용을 찾을 수 있고, 아래 막대가 학습 진도를 보여 줍니다.'],
              ['② 가운데 위 · 강좌 문서', '개념 설명, 그림, 예제 코드, 실습 과제, 퀴즈가 있습니다.'],
              ['③ 가운데 아래 · 코드 편집기', '실제로 코드를 쓰고 고치는 곳입니다. 실제 보드에 올라가는 <code>main.py</code> 에 해당합니다.'],
              ['④ 오른쪽 위 · 시뮬레이터', 'micro:bit 보드 그림. LED · 버튼 · 센서 · 핀 · 부품을 직접 조작합니다.'],
              ['⑤ 오른쪽 아래 · 콘솔 + 파이썬 셸', '<code>print()</code> 출력과 오류가 보이고, <code>&gt;&gt;&gt;</code> 칸에서 한 줄씩 실행할 수 있습니다.']
            ]
          },
          { type: 'callout', kind: 'tip', title: '경계선을 끌어 크기를 조절하세요', html: '영역 사이의 회색 선을 마우스로 끌면 넓이 · 높이를 바꿀 수 있습니다. 왼쪽 위의 <b>⟨</b> 버튼으로 목차를 접으면 화면이 넓어집니다.' },

          { type: 'h', text: '예제 실행하기 — ▶ 실행' },
          { type: 'p', html: '강좌 문서의 예제 상자에는 버튼이 세 개 있습니다.' },
          {
            type: 'table', head: ['버튼', '하는 일'], rows: [
              ['<b>▶ 실행</b>', '코드를 아래 편집기로 불러온 다음 <b>바로 실행</b>합니다.'],
              ['<b>✎ 편집기로</b>', '실행하지 않고 편집기로만 불러옵니다. 먼저 코드를 고쳐 보고 싶을 때 씁니다.'],
              ['<b>⧉</b>', '코드를 클립보드에 복사합니다.']
            ]
          },
          { type: 'p', html: '편집기에서 직접 실행하려면 <kbd>Ctrl</kbd> + <kbd>Enter</kbd> 를 누르거나 편집기 오른쪽 위의 <b>▶ 실행</b>을 누릅니다. 편집기 내용은 <b>교시별로 자동 저장</b>되므로, 다른 교시를 보고 돌아와도 그대로 남아 있습니다. 처음 코드로 되돌리려면 <b>↺ 초기화</b>를 누르세요.' },
          {
            type: 'code', title: '예제 1-3. 코드를 고쳐 보기', code: `from microbit import *

display.show(Image.HEART)
sleep(1000)
display.show(Image.HEART_SMALL)
sleep(1000)
display.clear()`,
            desc: '<code>sleep(1000)</code> 은 <b>1000밀리초(=1초)</b> 동안 기다리라는 뜻입니다. 실행해 본 다음, <code>1000</code> 을 <code>200</code> 으로 바꿔서 다시 실행해 보세요. 얼마나 달라지나요?',
            expect: '큰 하트 1초 → 작은 하트 1초 → 화면 꺼짐'
          },
          { type: 'callout', kind: 'warn', title: 'micro:bit 의 시간 단위는 밀리초(ms)', html: 'PC 파이썬의 <code>time.sleep(1)</code> 은 <b>1초</b>지만, micro:bit 의 <code>sleep(1)</code> 은 <b>0.001초</b>입니다. 1초를 쉬려면 <code>sleep(1000)</code> 이라고 써야 합니다. 처음에 가장 많이 하는 실수입니다.' },

          { type: 'h', text: '시뮬레이터 조작하기' },
          { type: 'p', html: '오른쪽 보드 그림은 그냥 그림이 아닙니다. <b>실제 micro:bit 처럼 조작할 수 있습니다.</b>' },
          {
            type: 'list', items: [
              '<b>버튼 A · B</b> — 마우스로 누르고 있는 동안 눌린 상태가 됩니다. 키보드 <kbd>A</kbd> · <kbd>B</kbd> 도 같습니다.',
              '<b>금색 로고</b> — 누르면 <code>pin_logo.is_touched()</code> 가 <code>True</code> 가 됩니다.',
              '<b>아래쪽 큰 단자 0 · 1 · 2</b> — 누르면 <code>pin0.is_touched()</code> 처럼 터치로 읽힙니다.',
              '<b>🧭 센서 탭</b> — 기울기 판을 끌어 가속도 값을 바꾸고, 온도 · 빛 · 소리 · 방위각 슬라이더를 움직입니다.',
              '<b>🔌 핀 탭</b> — 프로그램이 각 핀을 어떻게 쓰고 있는지 보고, 입력 값을 0 · 1 로 강제할 수 있습니다.',
              '<b>🧩 부품 탭</b> — LED · 버튼 · 가변저항 · 부저 · 서보 · NeoPixel 을 핀에 연결합니다.',
              '<b>📡 무선 · 💾 파일 · 📊 로그 탭</b> — 뒤쪽 챕터에서 씁니다.'
            ]
          },
          {
            type: 'code', title: '예제 1-4. 센서 값을 콘솔에 찍어 보기', code: `from microbit import *

while True:
    print("온도:", temperature(), "도")
    print("빛:", display.read_light_level())
    print("기울기 x:", accelerometer.get_x())
    print("---")
    sleep(1000)`,
            desc: '실행한 뒤 오른쪽 <b>🧭 센서</b> 탭에서 온도 · 빛 슬라이더를 움직이고 기울기 판을 끌어 보세요. 아래 콘솔의 숫자가 따라 바뀝니다. <code>print()</code> 는 화면(LED)이 아니라 <b>콘솔</b>에 출력합니다.',
            expect: '온도: 24 도\n빛: 128\n기울기 x: 0\n---\n온도: 24 도\n…',
            nondeterministic: true
          },
          { type: 'callout', kind: 'board', html: '실제 micro:bit 에서 <code>print()</code> 는 <b>USB 시리얼</b>로 보내집니다. 보드를 연결한 뒤 이 강좌의 콘솔에서 그 내용을 그대로 볼 수 있습니다. LED 화면에는 아무것도 나오지 않으니 주의하세요.' },

          { type: 'h', text: '파이썬 셸 (&gt;&gt;&gt;) — 한 줄씩 실험하기' },
          { type: 'p', html: '콘솔 아래 <code>&gt;&gt;&gt;</code> 라고 쓰인 칸이 <b>파이썬 셸</b>(REPL) 입니다. 한 줄을 입력하고 <kbd>Enter</kbd> 를 누르면 <b>바로 실행되고 결과가 보입니다</b>. 프로그램 전체를 실행하지 않고 “이 명령이 뭘 하는지” 빠르게 확인할 때 아주 좋습니다.' },
          {
            type: 'code', repl: true, title: '셸에서 해 보기 — 화면 조작', code: `display.show(Image.HEART)
display.set_pixel(0, 0, 9)
display.get_pixel(2, 2)
display.clear()`,
            desc: '▶ 셸에서 실행을 누르면 한 줄씩 차례로 들어갑니다. <code>display.get_pixel(2, 2)</code> 처럼 <b>값을 돌려주는</b> 명령은 결과가 바로 아래 표시됩니다.',
            expect: '>>> display.get_pixel(2, 2)\n9'
          },
          {
            type: 'code', repl: true, title: '셸에서 해 보기 — 센서와 계산', code: `temperature()
button_a.is_pressed()
2 ** 10
name = "micro:bit"
len(name)`,
            desc: '<code>button_a.is_pressed()</code> 는 <b>보드 그림의 A 를 누른 채</b> 입력하면 <code>True</code> 가 나옵니다. 셸은 계산기처럼 쓸 수도 있고, 변수를 만들어 둘 수도 있습니다.',
            expect: '>>> temperature()\n24\n>>> button_a.is_pressed()\nFalse\n>>> 2 ** 10\n1024\n>>> len(name)\n9'
          },
          { type: 'callout', kind: 'tip', title: '셸 사용 요령', html: '<ul><li><kbd>↑</kbd> <kbd>↓</kbd> 로 전에 입력한 줄을 다시 불러옵니다.</li><li><code>if</code> · <code>for</code> 처럼 <b>콜론(:)</b> 으로 끝나면 <code>...</code> 로 바뀝니다. 블록을 다 쓴 뒤 <b>빈 줄에서 Enter</b> 를 누르면 실행됩니다.</li><li><code>dir(display)</code> 를 입력하면 <code>display</code> 로 할 수 있는 일의 목록이 나옵니다.</li><li>셸에서 만든 변수는 ▶ 실행(main.py) 과 <b>따로</b> 관리됩니다.</li></ul>' },
          { type: 'callout', kind: 'board', html: '실제 micro:bit 에도 똑같은 셸이 들어 있습니다. USB 로 연결하고 <b>🔌 보드</b> 에서 연결한 뒤 같은 칸에 입력하면 <b>진짜 보드</b>가 대답합니다. 이것을 <b>REPL</b>(Read-Eval-Print Loop, 읽고 · 계산하고 · 출력하고 · 반복) 이라고 부릅니다.' },

          { type: 'h', text: '2교시 요약' },
          {
            type: 'list', items: [
              '화면은 <b>목차 · 문서 · 편집기 · 시뮬레이터 · 콘솔(셸)</b> 다섯 부분입니다.',
              '예제의 <b>▶ 실행</b>은 편집기로 불러와 실행하고, 편집기에서는 <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 로 실행합니다.',
              '시뮬레이터의 버튼 · 로고 · 핀은 <b>마우스로 직접 조작</b>할 수 있고, 탭에서 센서 값을 바꿀 수 있습니다.',
              '<code>print()</code> 는 LED 가 아니라 <b>콘솔</b>에 출력합니다.',
              '<b>파이썬 셸(&gt;&gt;&gt;)</b> 은 한 줄씩 실행해 바로 결과를 보는 곳입니다. 실제 보드의 REPL 과 같습니다.',
              'micro:bit 의 <code>sleep()</code> 단위는 <b>밀리초</b>입니다. 1초 = <code>sleep(1000)</code>.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 1-3. 깜빡이는 하트',
            level: 1,
            desc: '<p>하트가 <b>0.3초 간격으로 깜빡이는</b> 프로그램을 만드세요. (하트 보이기 → 잠깐 기다리기 → 화면 지우기 → 잠깐 기다리기 → 반복)</p>',
            hint: '<code>while True:</code> 안에 <code>display.show(Image.HEART)</code>, <code>sleep(300)</code>, <code>display.clear()</code>, <code>sleep(300)</code> 을 넣습니다. 0.3초 = 300밀리초입니다.',
            starter: 'from microbit import *\n\nwhile True:\n    # TODO: 하트 보이기\n    # TODO: 300ms 기다리기\n    # TODO: 화면 지우기\n    # TODO: 300ms 기다리기\n    pass\n',
            solution: 'from microbit import *\n\nwhile True:\n    display.show(Image.HEART)\n    sleep(300)\n    display.clear()\n    sleep(300)\n'
          },
          {
            title: '실습 1-4. 셸 탐험하기',
            level: 2,
            desc: '<p>오른쪽 아래 <code>&gt;&gt;&gt;</code> 칸에 다음을 하나씩 입력하고, 결과를 관찰하세요.</p><ol><li><code>dir(display)</code> — <code>display</code> 로 할 수 있는 일 목록</li><li><code>dir(button_a)</code> — 버튼으로 할 수 있는 일 목록</li><li><code>Image.HEART</code> — 하트 그림이 어떻게 표현되는지</li><li><code>running_time()</code> — 프로그램이 시작된 뒤 지난 시간(ms)</li><li><code>help(display.scroll)</code> — 도움말 (되는 항목만)</li></ol><p><b>질문</b>: <code>dir(display)</code> 목록에서 아직 배우지 않은 기능 중 이름만 보고 무엇을 할지 짐작되는 것을 3개 찾아 적어 보세요.</p>',
            hint: '<code>Image.HEART</code> 를 입력하면 <code>Image(\'09090:99999:99999:09990:00900:\')</code> 처럼 <b>숫자로 된 그림</b>이 나옵니다. 숫자는 각 LED 의 밝기입니다. 3장에서 자세히 배웁니다.',
            starter: '# 이 실습은 편집기가 아니라 오른쪽 아래 >>> 셸에서 합니다.\n# 아래 줄들을 한 줄씩 셸에 입력해 보세요.\n#   dir(display)\n#   dir(button_a)\n#   Image.HEART\n#   running_time()\n',
            solution: '# 셸 실습이므로 정답 코드는 없습니다.\n# dir(display) 결과 예: show, scroll, clear, set_pixel, get_pixel, on, off, is_on, read_light_level\n'
          }
        ],
        quiz: [
          {
            q: 'micro:bit 에서 <b>1초</b> 동안 기다리려면?', options: ['<code>sleep(1)</code>', '<code>sleep(1000)</code>', '<code>wait(1)</code>', '<code>time.sleep(1)</code>'], answer: 1,
            explain: 'micro:bit 의 <code>sleep()</code> 단위는 <b>밀리초(ms)</b> 입니다. 1초 = 1000ms 이므로 <code>sleep(1000)</code>.'
          },
          {
            q: '<code>print("안녕")</code> 을 실행하면 어디에 나타나나요?', options: ['LED 화면에 글자가 흐른다', '오른쪽 아래 콘솔에 나타난다', '아무 일도 일어나지 않는다', '오류가 난다'], answer: 1,
            explain: '<code>print()</code> 는 <b>콘솔</b>(실제 보드에서는 USB 시리얼)로 출력합니다. LED 화면에 보이게 하려면 <code>display.scroll()</code> 이나 <code>display.show()</code> 를 씁니다.'
          },
          {
            q: '파이썬 셸(&gt;&gt;&gt;)의 특징으로 <b>틀린</b> 것은?', options: ['한 줄을 입력하면 바로 실행된다', '값을 돌려주는 명령은 결과가 바로 보인다', '실제 micro:bit 에도 같은 기능이 있다', '여러 줄짜리 <code>if</code> 문은 절대 쓸 수 없다'], answer: 3,
            explain: '콜론(:)으로 끝나면 <code>...</code> 로 바뀌어 블록을 계속 입력할 수 있습니다. <b>빈 줄</b>에서 Enter 를 누르면 실행됩니다.'
          },
          {
            q: '편집기의 <b>↺ 초기화</b> 버튼은 무엇을 하나요?', options: ['시뮬레이터 보드를 리셋한다', '불러온 원래 코드로 되돌린다', '콘솔을 지운다', '학습 진도를 초기화한다'], answer: 1,
            explain: '편집기에서 코드를 이것저것 고쳤을 때 <b>처음 불러온 예제 코드</b>로 되돌립니다. 보드 리셋은 시뮬레이터 위쪽의 <b>↺</b> 입니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '강좌 사용법', subtitle: 'Chapter 01 · 편집기 · 시뮬레이터 · 파이썬 셸', badge: '2교시',
            notes: '<p>학생들이 직접 손으로 조작해 보는 시간입니다. 모두 화면을 열었는지 먼저 확인합니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'diagram', title: '화면 구성 다섯 영역', html: FIG_SCREEN, caption: '목차 · 문서 · 편집기 · 시뮬레이터 · 콘솔(셸)',
            notes: '<p>교사 화면에서 각 영역을 마우스로 짚어 주며 설명합니다. 경계선을 끌어 크기가 바뀌는 것도 보여 주세요.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: '예제 실행 · 코드 고치기', code: 'from microbit import *\n\ndisplay.show(Image.HEART)\nsleep(1000)\ndisplay.show(Image.HEART_SMALL)\nsleep(1000)\ndisplay.clear()',
            points: ['▶ 실행 → 편집기로 불러와 실행', '<kbd>Ctrl</kbd>+<kbd>Enter</kbd> 로도 실행', '<code>sleep(1000)</code> = <b>1초</b>', '1000 → 200 으로 바꿔 보기'],
            notes: '<p>학생들이 숫자를 바꿔 실행해 보게 합니다. "숫자를 100으로 하면?" "5000으로 하면?"</p><p>시간: 8분</p>'
          },
          {
            layout: 'bullets', title: '⚠ 가장 흔한 실수: 시간 단위',
            bullets: ['PC 파이썬 <code>time.sleep(1)</code> = <b>1초</b>', 'micro:bit <code>sleep(1)</code> = <b>0.001초</b>', '1초를 쉬려면 → <code>sleep(1000)</code>', '단위는 <b>밀리초(ms)</b>'],
            notes: '<p>칠판에 크게 써 두면 좋습니다. 1초 = 1000ms.</p><p>시간: 3분</p>'
          },
          {
            layout: 'bullets', title: '시뮬레이터 조작하기',
            bullets: ['보드 그림의 <b>A · B 버튼</b>을 마우스로 누르기 (키보드 A · B 도 가능)', '금색 <b>로고</b>, 아래쪽 <b>0 · 1 · 2 단자</b> 터치', '🧭 센서 탭: 기울기 판 · 온도 · 빛 · 소리 슬라이더', '🔌 핀 탭 / 🧩 부품 탭'],
            notes: '<p>학생들에게 1~2분 자유롭게 눌러 보게 한 뒤 다음 예제로 넘어갑니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: '센서 값 콘솔로 보기', code: 'from microbit import *\n\nwhile True:\n    print("온도:", temperature(), "도")\n    print("빛:", display.read_light_level())\n    print("기울기 x:", accelerometer.get_x())\n    print("---")\n    sleep(1000)',
            points: ['<code>print()</code> → <b>콘솔</b>에 출력 (LED 아님)', '센서 탭 슬라이더를 움직이며 확인', '실제 보드에서는 USB 시리얼로 전송', '■ 정지로 멈춤'],
            notes: '<p>실행 후 슬라이더를 움직이면서 콘솔 숫자가 바뀌는 것을 보여 줍니다. 디버깅의 기본이 print 라는 점을 강조합니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: '파이썬 셸 (&gt;&gt;&gt;)', repl: true, code: 'display.show(Image.HEART)\ntemperature()\n2 ** 10\ndir(display)',
            points: ['한 줄 입력 → <b>바로 실행</b>', '값을 돌려주면 결과가 바로 보임', '<kbd>↑</kbd> 로 이전 줄 다시 불러오기', '실제 보드의 <b>REPL</b> 과 같음'],
            notes: '<p>교사가 먼저 시연한 뒤 학생들이 따라 하게 합니다. <code>dir()</code> 은 "무엇을 할 수 있는지 물어보는 명령"이라고 설명하면 이해가 빠릅니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'practice', title: '실습 1-3. 깜빡이는 하트', desc: '하트가 0.3초 간격으로 깜빡이게 만드세요.',
            starter: 'from microbit import *\n\nwhile True:\n    # TODO\n    pass\n',
            solution: 'from microbit import *\n\nwhile True:\n    display.show(Image.HEART)\n    sleep(300)\n    display.clear()\n    sleep(300)\n',
            notes: '<p>들여쓰기를 어려워하는 학생이 있는지 돌아보며 확인합니다. <code>pass</code> 는 지워야 한다는 점을 안내합니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'summary', title: '2교시 정리', bullets: ['다섯 영역: 목차 · 문서 · 편집기 · 시뮬레이터 · 콘솔(셸)', '▶ 실행 / <kbd>Ctrl</kbd>+<kbd>Enter</kbd> / ■ 정지', '시뮬레이터의 버튼 · 로고 · 핀 · 센서를 직접 조작', '<code>print()</code> → 콘솔, <code>display</code> → LED', '셸(&gt;&gt;&gt;)로 한 줄씩 실험하기'],
            notes: '<p>다음 시간 예고: 진짜 micro:bit 에 프로그램 올리기.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 3교시 ═══════════════════════ */
      {
        id: 'ch01-3',
        title: '실제 보드에 올리기 — 펌웨어와 main.py',
        minutes: 45,
        goals: [
          'micro:bit 에 MicroPython 펌웨어를 설치하는 과정을 설명할 수 있다',
          '이 강좌에서 USB 로 보드를 연결하고 코드를 올릴 수 있다',
          'main.py 의 의미와 보드가 프로그램을 실행하는 순서를 설명할 수 있다',
          '자주 생기는 문제(연결 안 됨 · 화면에 오류 표시)의 원인을 찾을 수 있다'
        ],
        flow: [['시뮬레이터 vs 실제 보드', 6], ['MicroPython 설치(플래싱)', 12], ['보드 연결과 전송', 14], ['문제 해결', 8], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '시뮬레이터에서 실제 보드까지' },
          { type: 'p', html: '지금까지 쓴 시뮬레이터는 실제 micro:bit 를 아주 비슷하게 흉내 냅니다. <b>여기서 만든 코드는 한 글자도 고치지 않고 실제 보드에서 그대로 동작합니다.</b> 보드가 없어도 모든 실습을 할 수 있고, 보드가 있다면 아래 과정을 거쳐 진짜 장치를 만들 수 있습니다.' },
          { type: 'figure', html: FIG_FLOW, caption: '그림 1-3. 코드 작성에서 보드 단독 실행까지' },
          {
            type: 'table', head: ['', '시뮬레이터', '실제 보드'], rows: [
              ['준비물', '없음 (브라우저만)', 'micro:bit + USB 케이블 + Chrome · Edge'],
              ['메모리', '넉넉함', '약 128KB — 긴 프로그램은 <code>MemoryError</code>'],
              ['속도', '빠름', '보드 속도 그대로 (조금 느림)'],
              ['센서 값', '내가 슬라이더로 정함', '진짜 온도 · 빛 · 기울기'],
              ['소리', '컴퓨터 스피커', '보드의 작은 스피커'],
              ['무선(radio)', '가상 짝 보드 한 대', '진짜 여러 대끼리 통신'],
              ['전원을 빼면', '—', '<code>main.py</code> 로 저장했으면 건전지만으로 동작']
            ]
          },

          { type: 'h', text: '1단계 — MicroPython 펌웨어 설치 (플래싱)' },
          { type: 'p', html: '갓 산 micro:bit 는 파이썬을 알아듣지 못합니다. 보드 안에 <b>MicroPython 펌웨어</b>를 한 번 넣어 주어야 합니다. 이 과정을 <b>플래싱(flashing)</b> 이라고 합니다. 한 번만 하면 됩니다.' },
          { type: 'figure', html: FIG_FLASH, caption: '그림 1-4. 실제 보드에 프로그램을 올리기까지의 네 단계' },
          {
            type: 'list', ordered: true, items: [
              'micro:bit 를 USB 케이블로 컴퓨터에 연결합니다. 파일 탐색기에 <b>MICROBIT</b> 라는 USB 드라이브가 나타납니다.',
              '브라우저에서 <a href="https://python.microbit.org" target="_blank" rel="noopener">python.microbit.org</a> 를 엽니다.',
              '오른쪽 아래 <b>Send to micro:bit</b>(또는 <b>Download</b>) 를 눌러 아무 프로그램이나 한 번 보냅니다.',
              '보드 뒷면의 노란 LED 가 깜빡이다가 멈추면 완료입니다. 이때 MicroPython 펌웨어가 함께 설치됩니다.'
            ]
          },
          { type: 'callout', kind: 'tip', title: 'Download 로 내려받았다면', html: '<code>.hex</code> 파일이 내려받아집니다. 그 파일을 <b>MICROBIT 드라이브에 끌어다 놓으면</b> 설치됩니다. 복사가 끝나면 드라이브가 잠깐 사라졌다 다시 나타납니다 — 정상입니다.' },
          { type: 'callout', kind: 'warn', title: 'USB 케이블을 확인하세요', html: '휴대폰 충전용 케이블 중에는 <b>전원만 통하고 데이터는 통하지 않는</b> 것이 있습니다. 보드에 불은 들어오는데 MICROBIT 드라이브가 보이지 않으면 케이블을 바꿔 보세요.' },

          { type: 'h', text: '2단계 — 이 강좌에서 보드 연결하기' },
          { type: 'p', html: '오른쪽 시뮬레이터 위쪽의 <b>🔌 보드</b> 버튼을 누르면 브라우저가 연결할 장치를 묻습니다. 목록에서 <b>micro:bit</b> 를 골라 “연결”을 누르세요.' },
          {
            type: 'table', head: ['조건', '설명'], rows: [
              ['브라우저', '<b>Chrome</b> 또는 <b>Edge</b> (데스크톱). Firefox · Safari 는 Web Serial 을 지원하지 않습니다.'],
              ['주소', '<b>https://</b> 또는 <b>localhost</b> 로 열어야 합니다. GitHub Pages 주소는 https 이므로 괜찮습니다.'],
              ['펌웨어', '위 1단계를 마쳐야 합니다.'],
              ['다른 프로그램', '같은 보드를 쓰는 다른 프로그램(다른 탭의 편집기, 시리얼 모니터)은 먼저 닫아야 합니다.']
            ]
          },
          { type: 'p', html: '연결되면 버튼이 <b>🔌 연결됨</b> 으로 바뀌고, 실행 대상 표시가 <b>실제 보드</b> 로 바뀝니다. 다시 <b>🔌 연결됨</b> 을 누르면 아래 메뉴가 열립니다.' },
          {
            type: 'table', head: ['메뉴', '하는 일', '언제 쓰나'], rows: [
              ['<b>⬆ main.py 로 저장하고 실행</b>', '코드를 보드의 <code>main.py</code> 파일로 저장하고 재시작합니다.', '완성한 프로그램. USB 를 빼도 건전지로 동작합니다.'],
              ['<b>▶ 저장하지 않고 실행</b>', '파일로 남기지 않고 지금 한 번만 실행합니다.', '빠르게 시험해 볼 때'],
              ['<b>📁 보드의 파일 목록</b>', '보드 안에 어떤 파일이 있는지 봅니다.', '저장이 잘 됐는지 확인'],
              ['<b>■ 보드 프로그램 정지</b>', '실행 중인 프로그램을 멈춥니다. (Ctrl+C)', '무한 반복을 멈출 때'],
              ['<b>연결 끊기</b>', '연결을 해제합니다.', '다른 프로그램에서 보드를 쓸 때']
            ]
          },
          { type: 'p', html: '<b>실행 대상</b> 표시(시뮬레이터 / 실제 보드)를 클릭하면 언제든 바꿀 수 있습니다. 연결한 상태에서도 <b>시뮬레이터</b> 로 돌려놓고 실습할 수 있습니다.' },

          { type: 'h', text: 'main.py — 보드가 실행하는 파일' },
          { type: 'p', html: 'micro:bit 는 전원이 켜지면 저장된 파일 중 <b><code>main.py</code></b> 를 찾아서 실행합니다. 이름이 정확히 <code>main.py</code> 여야 하며, 다른 이름(<code>hello.py</code> 등)은 자동으로 실행되지 않고 <code>import</code> 로 불러와 쓰는 <b>모듈</b>이 됩니다.' },
          {
            type: 'code', title: '예제 1-5. 보드에 올려 볼 프로그램', code: `from microbit import *

display.scroll("READY")
while True:
    if button_a.was_pressed():
        display.show(Image.HAPPY)
        sleep(500)
        display.clear()
    if button_b.was_pressed():
        display.show(Image.SAD)
        sleep(500)
        display.clear()`,
            desc: '시뮬레이터에서 먼저 확인한 뒤, 보드를 연결하고 <b>⬆ main.py 로 저장하고 실행</b>을 눌러 보세요. USB 를 뽑고 건전지를 연결해도 같은 동작을 합니다.',
            expect: 'READY 가 흐른 뒤, A 를 누를 때마다 웃는 얼굴 · B 를 누를 때마다 슬픈 얼굴이 0.5초 나타납니다.'
          },
          { type: 'callout', kind: 'board', title: '보드의 파일 시스템', html: 'micro:bit 안에는 아주 작은 파일 시스템이 있습니다(약 30KB). <b>폴더는 없고 파일 이름만</b> 있습니다. <code>os.listdir()</code> 로 목록을 보고 <code>os.remove("이름")</code> 으로 지울 수 있습니다. 11장에서 자세히 배웁니다.' },

          { type: 'h', text: '문제가 생겼을 때' },
          {
            type: 'table', head: ['증상', '원인', '해결'], rows: [
              ['MICROBIT 드라이브가 안 보임', '데이터가 통하지 않는 USB 케이블', '다른 케이블로 교체'],
              ['🔌 보드를 눌러도 목록이 비어 있음', '펌웨어 미설치 · 다른 프로그램이 포트 사용 중', 'python.microbit.org 에서 한 번 전송 / 다른 탭 · 프로그램 닫기'],
              ['“Web Serial 을 지원하지 않습니다”', 'Firefox · Safari · 모바일 브라우저', 'Chrome 또는 Edge(데스크톱) 사용'],
              ['“REPL 이 응답하지 않습니다”', '펌웨어가 MicroPython 이 아님(MakeCode 프로그램이 올라가 있음)', 'python.microbit.org 에서 파이썬 프로그램을 한 번 전송'],
              ['LED 에 슬픈 얼굴과 글자가 흐름', '프로그램에 오류가 있음', '흐르는 글자가 오류 메시지입니다. 줄 번호를 확인하세요'],
              ['<code>MemoryError</code>', '프로그램이 너무 큼', '주석 · 긴 변수 이름을 줄이거나 코드를 나눕니다'],
              ['보드가 멈춘 것 같음', '무한 반복 중', '뒷면 <b>리셋 버튼</b>을 누르거나 ■ 정지']
            ]
          },
          { type: 'callout', kind: 'warn', title: 'LED 화면에 나타나는 오류 메시지', html: '실제 micro:bit 에서 프로그램에 오류가 있으면 <b>슬픈 얼굴</b>이 뜬 뒤 오류 내용이 글자로 흘러갑니다. 예: <code>NameError: name \'displey\' isn\'t defined</code>. 짧게 줄여서 보여 주므로, 자세한 내용은 이 강좌의 콘솔에서 확인하는 편이 훨씬 편합니다.' },

          { type: 'h', text: '3교시 요약' },
          {
            type: 'list', items: [
              '실제 보드에는 <b>MicroPython 펌웨어</b>를 한 번 설치해야 합니다 (python.microbit.org).',
              '이 강좌에서 <b>🔌 보드</b> → 연결 → <b>⬆ main.py 로 저장하고 실행</b> 으로 코드를 올립니다. Chrome · Edge, https 또는 localhost 필요.',
              '보드는 전원이 켜지면 <b><code>main.py</code></b> 를 자동으로 실행합니다.',
              '오류가 나면 LED 에 <b>슬픈 얼굴 + 오류 메시지</b>가 흐릅니다.',
              '시뮬레이터와 실제 보드는 <b>같은 코드</b>를 씁니다. 메모리와 속도만 다릅니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 1-5. 나만의 이름표 만들기',
            level: 2,
            desc: '<p>전원을 켜면 <b>내 이름</b>을 한 번 흘려보내고, 그 뒤로는 A 버튼을 누를 때마다 다른 그림이 나오는 “이름표” 프로그램을 만드세요.</p><ul><li>시작할 때 이름 한 번 흘려보내기</li><li>A 를 누르면 그림 1, B 를 누르면 그림 2</li><li>아무것도 안 누르면 작은 하트</li></ul><p>완성했다면 보드가 있는 경우 <b>⬆ main.py 로 저장</b>하고, USB 를 빼도 동작하는지 확인하세요.</p>',
            hint: '시작 인사는 <code>while True:</code> <b>바깥</b>(위쪽)에 한 번만 씁니다. 반복 안에 넣으면 계속 흘러갑니다.',
            starter: 'from microbit import *\n\n# TODO: 시작할 때 이름 한 번 흘려보내기\n\nwhile True:\n    # TODO: A / B / 아무것도 안 누름\n    pass\n',
            solution: 'from microbit import *\n\ndisplay.scroll("MINJUN")\n\nwhile True:\n    if button_a.is_pressed():\n        display.show(Image.DUCK)\n    elif button_b.is_pressed():\n        display.show(Image.RABBIT)\n    else:\n        display.show(Image.HEART_SMALL)\n'
          },
          {
            title: '실습 1-6. 오류 메시지 읽기',
            level: 2,
            desc: '<p>아래 시작 코드에는 오류가 <b>세 군데</b> 있습니다. 실행해서 콘솔의 오류 메시지를 읽고 하나씩 고치세요. (한 번에 하나씩 나타납니다)</p><p>고치고 나면 <code>HI</code> 가 흐른 뒤 하트가 깜빡여야 합니다.</p>',
            hint: '① 첫 줄의 모듈 이름 철자 ② <code>display</code> 의 철자 ③ <code>sleep</code> 의 시간 단위(1초). 오류 메시지의 <b>마지막 줄</b>과 <b>line 번호</b>를 먼저 읽으세요.',
            starter: 'from microbits import *\n\ndisplay.scroll("HI")\nwhile True:\n    displey.show(Image.HEART)\n    sleep(1)\n    display.clear()\n    sleep(1)\n',
            solution: 'from microbit import *\n\ndisplay.scroll("HI")\nwhile True:\n    display.show(Image.HEART)\n    sleep(1000)\n    display.clear()\n    sleep(1000)\n'
          }
        ],
        quiz: [
          {
            q: 'micro:bit 가 전원이 켜질 때 자동으로 실행하는 파일 이름은?', options: ['<code>start.py</code>', '<code>main.py</code>', '<code>microbit.py</code>', '<code>index.py</code>'], answer: 1,
            explain: '보드는 <code>main.py</code> 를 찾아 실행합니다. 다른 이름의 파일은 <code>import</code> 해서 쓰는 모듈이 됩니다.'
          },
          {
            q: '실제 보드에 프로그램을 올리기 전에 반드시 해야 하는 일은?', options: ['MicroPython 펌웨어 설치', '건전지 교체', '보드 포맷', '인터넷 연결 끊기'], answer: 0,
            explain: '갓 산 보드는 파이썬을 모릅니다. <a href="https://python.microbit.org" target="_blank" rel="noopener">python.microbit.org</a> 에서 한 번 전송하면 MicroPython 펌웨어가 함께 설치됩니다.'
          },
          {
            q: '보드 연결(Web Serial)이 되지 <b>않는</b> 환경은?', options: ['Chrome + https 주소', 'Edge + localhost', 'Firefox + https 주소', 'Chrome + localhost'], answer: 2,
            explain: 'Web Serial 은 <b>Chrome · Edge 계열(데스크톱)</b>에서만 동작합니다. Firefox · Safari 에서는 시뮬레이터로만 실습합니다.'
          },
          {
            q: '실제 micro:bit 에서 프로그램에 오류가 있으면?', options: ['아무 일도 일어나지 않는다', '슬픈 얼굴이 뜨고 오류 메시지가 흐른다', '보드가 고장 난다', 'LED 가 모두 켜진다'], answer: 1,
            explain: '슬픈 얼굴 뒤에 <code>NameError: …</code> 같은 메시지가 흘러갑니다. 자세한 내용은 USB 로 연결해 콘솔에서 보는 것이 편합니다.'
          },
          {
            q: '<b>⬆ main.py 로 저장하고 실행</b> 과 <b>▶ 저장하지 않고 실행</b> 의 차이는?', options: ['속도만 다르다', '저장하면 USB 를 빼도 동작한다', '저장하면 시뮬레이터에서도 돌아간다', '차이가 없다'], answer: 1,
            explain: '<code>main.py</code> 로 저장하면 보드 안에 남아 <b>전원만 있으면 자동 실행</b>됩니다. 저장하지 않고 실행하면 USB 가 연결된 동안만 동작합니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '실제 보드에 올리기', subtitle: 'Chapter 01 · 펌웨어와 main.py', badge: '3교시',
            notes: '<p>보드가 있는 교실이라면 실물로 함께 진행합니다. 보드가 없으면 시연만 보고 넘어가도 이후 수업에 지장이 없습니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'diagram', title: '코드 → 시뮬레이터 → 보드', html: FIG_FLOW, caption: '같은 코드가 그대로 실제 보드에서 동작합니다',
            notes: '<p>"우리가 쓰는 코드는 장난감이 아니라 진짜"라는 점을 강조합니다.</p><p>시간: 4분</p>'
          },
          {
            layout: 'diagram', title: '보드에 올리는 네 단계', html: FIG_FLASH, caption: '②번(펌웨어 설치)은 처음 한 번만',
            notes: '<p>USB 케이블 문제가 가장 흔합니다. 미리 데이터 케이블을 준비해 두세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'table', title: '🔌 보드 메뉴', head: ['메뉴', '하는 일'], rows: [
              ['⬆ main.py 로 저장하고 실행', '보드에 저장 → USB 를 빼도 동작'],
              ['▶ 저장하지 않고 실행', '지금 한 번만 실행'],
              ['📁 보드의 파일 목록', '저장된 파일 확인'],
              ['■ 보드 프로그램 정지', '무한 반복 멈추기']],
            notes: '<p>교사 화면에서 실제로 ⬆ 를 눌러 보여 주고, USB 를 뽑았다가 건전지를 연결해 보면 효과가 큽니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '보드에 올려 볼 프로그램', code: 'from microbit import *\n\ndisplay.scroll("READY")\nwhile True:\n    if button_a.was_pressed():\n        display.show(Image.HAPPY)\n        sleep(500)\n        display.clear()\n    if button_b.was_pressed():\n        display.show(Image.SAD)\n        sleep(500)\n        display.clear()',
            points: ['시뮬레이터에서 먼저 확인', '보드 연결 → ⬆ 저장', 'USB 를 빼도 동작', '<code>main.py</code> 가 자동 실행됨'],
            notes: '<p>was_pressed 와 is_pressed 의 차이는 4장에서 배웁니다. 지금은 "눌렀다 뗐는지 확인" 정도로만 말합니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'table', title: '문제가 생겼을 때', head: ['증상', '해결'], rows: [
              ['MICROBIT 드라이브 안 보임', '데이터 통하는 USB 케이블로 교체'],
              ['목록이 비어 있음', 'python.microbit.org 에서 한 번 전송'],
              ['Web Serial 미지원', 'Chrome · Edge 사용'],
              ['슬픈 얼굴 + 글자', '코드 오류 — 메시지를 읽자'],
              ['멈춘 것 같음', '뒷면 리셋 버튼']],
            notes: '<p>학생들이 스스로 해결할 수 있도록 이 표를 인쇄해 나눠 주면 좋습니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'quiz', title: '확인 퀴즈', q: '보드가 전원이 켜질 때 자동 실행하는 파일은?', options: ['start.py', 'main.py', 'microbit.py', 'index.py'], answer: 1,
            explain: '<code>main.py</code> 입니다.',
            notes: '<p>시간: 2분</p>'
          },
          {
            layout: 'summary', title: '1장 정리', bullets: ['micro:bit: LED 25개 · 버튼 · 센서 · 핀 25개', 'MicroPython = 작은 장치용 파이썬 3', '강좌 화면: 목차 · 문서 · 편집기 · 시뮬레이터 · 셸', '보드: 펌웨어 설치 → 🔌 연결 → ⬆ main.py 전송', '<code>sleep()</code> 단위는 밀리초!'],
            notes: '<p>1장 전체를 정리합니다. 다음 장 예고: Hello, World! — LED 화면에 글자 보내기.</p><p>과제: 실습 1-5 이름표 완성하기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
