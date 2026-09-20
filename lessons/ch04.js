/* Chapter 04. 버튼 — 입력 받기
 * 원본: MicroPython on the BBC micro:bit — Buttons
 */
(function () {
  const FIG_STATES = `<svg viewBox="0 0 1280 480" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="38" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--fg)">is_pressed() 와 was_pressed() 는 무엇이 다를까?</text>
  <!-- 시간축 -->
  <line x1="120" y1="150" x2="1180" y2="150" stroke="var(--line)" stroke-width="3"/>
  <text x="80" y="156" font-size="19" fill="var(--muted)">시간 →</text>
  <!-- 누름 구간 -->
  <rect x="380" y="118" width="230" height="64" rx="10" fill="var(--accent)" opacity=".25" stroke="var(--accent)" stroke-width="3"/>
  <text x="495" y="158" text-anchor="middle" font-size="21" font-weight="bold" fill="var(--accent)">버튼을 누르고 있음</text>
  <text x="380" y="106" text-anchor="middle" font-size="17" fill="var(--muted)">누르기 시작</text>
  <text x="610" y="106" text-anchor="middle" font-size="17" fill="var(--muted)">손을 뗌</text>
  <!-- is_pressed -->
  <text x="120" y="250" font-size="21" font-weight="bold" fill="var(--ok)">is_pressed()</text>
  <text x="120" y="278" font-size="17" fill="var(--muted)">지금 눌려 있나?</text>
  ${[180, 280, 420, 500, 580, 700, 820, 940, 1060].map((x) => {
      const on = x >= 380 && x <= 610;
      return `<circle cx="${x}" cy="252" r="16" fill="${on ? 'var(--ok)' : 'var(--card)'}" stroke="${on ? 'var(--ok)' : 'var(--line)'}" stroke-width="3"/>
  <text x="${x}" y="258" text-anchor="middle" font-size="13" font-weight="bold" fill="${on ? '#fff' : 'var(--muted)'}">${on ? 'T' : 'F'}</text>`;
    }).join('\n  ')}
  <text x="1120" y="258" font-size="17" fill="var(--muted)">눌린 동안 계속 True</text>
  <!-- was_pressed -->
  <text x="120" y="370" font-size="21" font-weight="bold" fill="var(--accent2)">was_pressed()</text>
  <text x="120" y="398" font-size="17" fill="var(--muted)">지난번 확인 이후<tspan x="120" dy="22">눌린 적 있나?</tspan></text>
  ${[180, 280, 420, 500, 580, 700, 820, 940, 1060].map((x) => {
      const on = x === 420;
      return `<circle cx="${x}" cy="372" r="16" fill="${on ? 'var(--accent2)' : 'var(--card)'}" stroke="${on ? 'var(--accent2)' : 'var(--line)'}" stroke-width="3"/>
  <text x="${x}" y="378" text-anchor="middle" font-size="13" font-weight="bold" fill="${on ? '#fff' : 'var(--muted)'}">${on ? 'T' : 'F'}</text>`;
    }).join('\n  ')}
  <text x="1120" y="378" font-size="17" fill="var(--muted)"><tspan font-weight="bold">한 번만</tspan> True (그 뒤 초기화)</text>
  <text x="120" y="455" font-size="20" fill="var(--fg)">→ 계속 반응해야 하면 <tspan font-weight="bold" fill="var(--ok)">is_pressed()</tspan>, 한 번만 세어야 하면 <tspan font-weight="bold" fill="var(--accent2)">was_pressed()</tspan></text>
</svg>`;

  const FIG_LOOP = `<svg viewBox="0 0 1100 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker id="c4a" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <text x="550" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">이벤트 루프 — micro:bit 프로그램의 기본 구조</text>
  <rect x="60" y="70" width="230" height="70" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="175" y="102" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--fg)">① 입력 확인</text>
  <text x="175" y="127" text-anchor="middle" font-size="16" fill="var(--muted)">버튼 · 센서 읽기</text>
  <line x1="290" y1="105" x2="345" y2="105" stroke="var(--accent)" stroke-width="4" marker-end="url(#c4a)"/>
  <rect x="355" y="70" width="230" height="70" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="470" y="102" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--fg)">② 판단</text>
  <text x="470" y="127" text-anchor="middle" font-size="16" fill="var(--muted)">if / elif / else</text>
  <line x1="585" y1="105" x2="640" y2="105" stroke="var(--accent)" stroke-width="4" marker-end="url(#c4a)"/>
  <rect x="650" y="70" width="230" height="70" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="765" y="102" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--fg)">③ 반응</text>
  <text x="765" y="127" text-anchor="middle" font-size="16" fill="var(--muted)">화면 · 소리 · 핀</text>
  <path d="M880 105 L950 105 L950 210 L175 210 L175 150" fill="none" stroke="var(--accent)" stroke-width="4" marker-end="url(#c4a)" stroke-dasharray="8 6"/>
  <text x="560" y="240" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--accent)">④ 잠깐 쉬고 다시 처음으로 (while True)</text>
  <rect x="220" y="265" width="660" height="52" rx="10" fill="var(--code-bg)" stroke="var(--line)" stroke-width="2"/>
  <text x="550" y="298" text-anchor="middle" font-size="19" font-family="monospace" fill="var(--fg)">while True:  →  if 버튼:  →  화면 바꾸기  →  sleep(50)</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch04',
    no: '04',
    title: '버튼 — 입력 받기',
    subtitle: 'is_pressed · was_pressed · get_presses · 조건문 · 이벤트 루프',
    summary: '사용자가 프로그램에 말을 거는 가장 간단한 방법인 버튼을 배웁니다. 지금 눌려 있는지 보는 is_pressed(), 눌린 적이 있는지 보는 was_pressed(), 몇 번 눌렀는지 세는 get_presses() 의 차이를 이해하고, 조건문(if / elif / else)과 이벤트 루프로 사용자에게 반응하는 프로그램을 만듭니다. 터치 로고와 핀 터치도 함께 다룹니다.',
    goals: [
      '<code>is_pressed()</code> · <code>was_pressed()</code> · <code>get_presses()</code> 의 차이를 설명하고 골라 쓸 수 있다',
      '<code>if</code> / <code>elif</code> / <code>else</code> 로 상황에 따라 다르게 동작하게 할 수 있다',
      '두 버튼을 동시에 누르는 것을 <code>and</code> 로 판단할 수 있다',
      '이벤트 루프 구조로 사용자 입력에 반응하는 프로그램을 만들 수 있다',
      '터치 로고와 핀 터치를 입력으로 쓸 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch04-1',
        title: '버튼 읽기 — 세 가지 방법',
        minutes: 45,
        goals: [
          '<code>button_a</code> · <code>button_b</code> 로 버튼 상태를 읽을 수 있다',
          '<code>is_pressed()</code> 와 <code>was_pressed()</code> 의 차이를 설명할 수 있다',
          '<code>get_presses()</code> 로 누른 횟수를 셀 수 있다',
          '<code>if</code> · <code>else</code> 로 눌렸을 때와 아닐 때를 다르게 처리할 수 있다'
        ],
        flow: [['입력이란?', 5], ['is_pressed', 12], ['was_pressed', 13], ['get_presses', 10], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: '입력 — 사용자가 프로그램에 말을 걸기' },
          { type: 'p', html: '지금까지 만든 프로그램은 한 방향이었습니다. micro:bit 가 정해진 대로 화면을 보여 주기만 했지요. 이제 <b>사용자가 프로그램에 무언가를 알려 주는</b> 방법을 배웁니다. 가장 간단한 방법이 <b>버튼</b>입니다.' },
          { type: 'p', html: 'micro:bit 앞면에는 화면 양옆에 <b>A</b> 와 <b>B</b> 두 개의 버튼이 있습니다. 파이썬에서는 각각 <code>button_a</code>, <code>button_b</code> 라는 이름으로 부릅니다.' },
          { type: 'callout', kind: 'tip', title: '시뮬레이터에서 버튼 누르기', html: '오른쪽 보드 그림의 <b>A · B 버튼을 마우스로 누르고 있으면</b> 눌린 상태가 됩니다. 키보드 <kbd>A</kbd> · <kbd>B</kbd> 키를 눌러도 같습니다.' },

          { type: 'h', text: '① is_pressed() — 지금 눌려 있나?' },
          {
            type: 'code', title: '예제 4-1. 누르고 있는 동안만 하트', code: `from microbit import *

while True:
    if button_a.is_pressed():
        display.show(Image.HEART)
    else:
        display.clear()
    sleep(50)`,
            desc: '<code>is_pressed()</code> 는 <b>지금 이 순간</b> 버튼이 눌려 있으면 <code>True</code>, 아니면 <code>False</code> 를 돌려줍니다. A 를 누르고 있는 동안만 하트가 보이고, 손을 떼면 사라집니다.',
            expect: 'A 를 누르고 있는 동안 하트가 보입니다.'
          },
          {
            type: 'code', repl: true, title: '셸에서 확인하기', code: `button_a.is_pressed()
button_b.is_pressed()`,
            desc: '<b>보드 그림의 A 를 마우스로 누른 채로</b> 위 줄을 입력하면 <code>True</code> 가 나옵니다. (시뮬레이터에서는 누르고 있기 어려우므로, 🔌 핀 탭에서 P5 를 0 으로 강제해도 같은 효과입니다)',
            expect: '>>> button_a.is_pressed()\nFalse'
          },
          { type: 'callout', kind: 'more', title: 'True 와 False — 불(bool) 값', html: '<p>파이썬에는 <b>참</b>과 <b>거짓</b> 두 가지 값만 갖는 자료형이 있습니다. <code>True</code>(참)와 <code>False</code>(거짓)이고, 이런 값을 <b>불(boolean)</b> 값이라고 합니다. 첫 글자가 <b>대문자</b>인 것에 주의하세요.</p><p><code>if</code> 는 조건이 <code>True</code> 일 때만 안쪽 블록을 실행합니다.</p>' },

          { type: 'h', text: '② was_pressed() — 눌린 적이 있나?' },
          { type: 'p', html: '“버튼을 누를 때마다 숫자를 1 올린다”를 <code>is_pressed()</code> 로 만들면 어떻게 될까요? 반복이 아주 빠르게 돌기 때문에 <b>한 번 눌렀는데 숫자가 수십 번 올라갑니다</b>. 이럴 때 <code>was_pressed()</code> 를 씁니다.' },
          { type: 'figure', html: FIG_STATES, caption: '그림 4-1. is_pressed() 는 눌린 동안 계속 True, was_pressed() 는 한 번만 True' },
          {
            type: 'code', title: '예제 4-2. 눌린 적이 있으면 한 번만', code: `from microbit import *

while True:
    if button_a.was_pressed():
        display.show(Image.HAPPY)
        sleep(500)
        display.clear()
    sleep(50)`,
            desc: '<code>was_pressed()</code> 는 “<b>지난번 확인한 뒤로</b> 버튼이 눌린 적 있나?” 를 묻습니다. <code>True</code> 를 한 번 돌려주면 기록이 <b>지워지므로</b>, 계속 누르고 있어도 한 번만 반응합니다.',
            expect: 'A 를 누를 때마다 웃는 얼굴이 0.5초 나타납니다.'
          },
          {
            type: 'code', title: '예제 4-3. 차이를 직접 비교하기', code: `from microbit import *

count_is = 0
count_was = 0

while True:
    if button_a.is_pressed():
        count_is = count_is + 1
    if button_b.was_pressed():
        count_was = count_was + 1
    print("is_pressed 누적:", count_is, "/ was_pressed 누적:", count_was)
    sleep(100)`,
            desc: 'A 와 B 를 각각 <b>1초쯤 눌러</b> 보세요. A(<code>is_pressed</code>)는 누른 시간만큼 계속 늘어나고, B(<code>was_pressed</code>)는 <b>1 만 늘어납니다</b>. 이 차이가 핵심입니다.',
            expect: 'is_pressed 누적: 9 / was_pressed 누적: 1',
            nondeterministic: true
          },
          {
            type: 'table', head: ['', '<code>is_pressed()</code>', '<code>was_pressed()</code>'], rows: [
              ['묻는 것', '<b>지금</b> 눌려 있나?', '지난 확인 이후 <b>눌린 적</b> 있나?'],
              ['누르고 있으면', '계속 <code>True</code>', '처음 <b>한 번만</b> <code>True</code>'],
              ['확인 후', '변화 없음', '기록이 <b>지워짐</b>'],
              ['어울리는 일', '누른 동안 불 켜기, 속도 올리기', '횟수 세기, 화면 넘기기, 모드 바꾸기']
            ], caption: '표 4-1. is_pressed 와 was_pressed'
          },

          { type: 'h', text: '③ get_presses() — 몇 번 눌렀나?' },
          {
            type: 'code', title: '예제 4-4. 3초 동안 몇 번 눌렀나', code: `from microbit import *

while True:
    display.scroll("GO", delay=60)
    button_a.get_presses()      # 지금까지의 기록을 비운다
    sleep(3000)                 # 3초 동안 마음껏 누르기
    n = button_a.get_presses()
    display.scroll(str(n) + " TIMES", delay=70)
    sleep(1000)`,
            desc: '<code>get_presses()</code> 는 <b>마지막으로 물어본 뒤 몇 번 눌렸는지</b> 세어 돌려주고, 그 기록을 비웁니다. 그래서 <b>5행</b>처럼 미리 한 번 불러 기록을 비워 두는 것이 중요합니다.',
            expect: 'GO 가 흐른 뒤 3초 동안 누른 횟수를 보여 줍니다. (예: 7 TIMES)',
            nondeterministic: true
          },
          { type: 'callout', kind: 'warn', title: 'get_presses() 도 기록을 지웁니다', html: '<code>get_presses()</code> 를 부르는 순간 누적 횟수는 <b>0 으로 초기화</b>됩니다. 같은 값을 두 번 쓰려면 <code>n = button_a.get_presses()</code> 처럼 <b>변수에 담아 두세요</b>.' },
          {
            type: 'code', title: '예제 4-5. 누른 횟수를 화면에 표시', code: `from microbit import *

count = 0
display.show(count)

while True:
    if button_a.was_pressed():
        count = count + 1
        if count > 9:
            count = 0          # 한 자리만 보여 주려고
        display.show(count)
    sleep(50)`,
            desc: '가장 기본적인 <b>카운터</b> 프로그램입니다. <code>count = count + 1</code> 은 “지금 값에 1 을 더해 다시 담아라”는 뜻입니다. <code>count += 1</code> 로 짧게 쓸 수도 있습니다.',
            expect: 'A 를 누를 때마다 숫자가 0 → 1 → 2 … 9 → 0 으로 올라갑니다.'
          },

          { type: 'h', text: 'if · elif · else — 여러 갈래로 나누기' },
          {
            type: 'code', title: '예제 4-6. 세 갈래 판단', code: `from microbit import *

while True:
    if button_a.is_pressed():
        display.show(Image.ARROW_W)
    elif button_b.is_pressed():
        display.show(Image.ARROW_E)
    else:
        display.show(Image.DIAMOND_SMALL)
    sleep(50)`,
            desc: '<code>if</code> → <code>elif</code>(else if) → <code>else</code> 순서로 <b>위에서부터</b> 확인합니다. 조건이 맞는 것을 하나 찾으면 <b>나머지는 건너뜁니다</b>. A 는 왼쪽 화살표, B 는 오른쪽 화살표, 아무것도 안 누르면 작은 마름모.',
            expect: 'A → 왼쪽 화살표, B → 오른쪽 화살표, 아무것도 안 누름 → 작은 마름모'
          },
          {
            type: 'code', title: '예제 4-7. 두 버튼을 동시에 (and)', code: `from microbit import *

while True:
    a = button_a.is_pressed()
    b = button_b.is_pressed()

    if a and b:
        display.show(Image.HEART)      # 둘 다
    elif a:
        display.show("A")
    elif b:
        display.show("B")
    else:
        display.clear()
    sleep(50)`,
            desc: '<code>and</code> 는 “<b>양쪽 다 참</b>일 때만 참”입니다. <b>순서가 중요합니다</b> — <code>if a and b</code> 를 맨 위에 두지 않으면, A 만 눌렀을 때의 조건에 먼저 걸려 동시 누름을 알아채지 못합니다.',
            expect: 'A → "A", B → "B", 둘 다 → 하트'
          },
          {
            type: 'table', head: ['연산자', '뜻', '예'], rows: [
              ['<code>and</code>', '둘 다 참이어야 참', '<code>if a and b:</code>'],
              ['<code>or</code>', '하나라도 참이면 참', '<code>if a or b:</code>'],
              ['<code>not</code>', '참/거짓 뒤집기', '<code>if not a:</code>']
            ]
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '버튼은 <code>button_a</code> · <code>button_b</code> 로 읽습니다.',
              '<code>is_pressed()</code> — <b>지금</b> 눌려 있나? (누른 동안 계속 <code>True</code>)',
              '<code>was_pressed()</code> — 지난 확인 이후 <b>눌린 적</b> 있나? (한 번만 <code>True</code>, 확인하면 기록 삭제)',
              '<code>get_presses()</code> — <b>몇 번</b> 눌렸나? (확인하면 0 으로 초기화)',
              '<code>if</code> / <code>elif</code> / <code>else</code> 로 갈래를 나누고, <code>and</code> · <code>or</code> · <code>not</code> 으로 조건을 조합합니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 4-1. 예/아니오 판단기',
            level: 1,
            desc: '<p>A 를 누르면 <code>Image.YES</code>(체크), B 를 누르면 <code>Image.NO</code>(엑스), 아무것도 안 누르면 <code>Image.CONFUSED</code> 를 보여 주세요.</p><p>버튼을 <b>누르고 있는 동안</b> 반응해야 합니다.</p>',
            hint: '<code>is_pressed()</code> 와 <code>if</code> / <code>elif</code> / <code>else</code> 를 씁니다.',
            starter: 'from microbit import *\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\n\nwhile True:\n    if button_a.is_pressed():\n        display.show(Image.YES)\n    elif button_b.is_pressed():\n        display.show(Image.NO)\n    else:\n        display.show(Image.CONFUSED)\n    sleep(50)\n'
          },
          {
            title: '실습 4-2. 0 ~ 99 카운터',
            level: 2,
            desc: '<p>A 를 누르면 <b>1 증가</b>, B 를 누르면 <b>1 감소</b>하는 카운터를 만드세요.</p><ul><li>범위는 0 ~ 99 (0 아래로 내려가거나 99 를 넘지 않게)</li><li>값이 바뀔 때마다 <code>display.scroll(str(count), delay=80)</code> 으로 보여 줍니다</li><li>A 와 B 를 <b>동시에</b> 누르면 0 으로 초기화하고 <code>Image.NO</code> 를 잠깐 보여 줍니다</li></ul>',
            hint: '동시 누름 조건(<code>and</code>)을 <b>맨 위</b>에 두어야 합니다. 값이 바뀌었을 때만 화면을 갱신하면 더 깔끔합니다.',
            starter: 'from microbit import *\n\ncount = 0\ndisplay.scroll(str(count), delay=80)\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\n\ncount = 0\ndisplay.scroll(str(count), delay=80)\n\nwhile True:\n    a = button_a.was_pressed()\n    b = button_b.was_pressed()\n\n    if a and b:\n        count = 0\n        display.show(Image.NO)\n        sleep(500)\n        display.scroll(str(count), delay=80)\n    elif a:\n        if count < 99:\n            count = count + 1\n        display.scroll(str(count), delay=80)\n    elif b:\n        if count > 0:\n            count = count - 1\n        display.scroll(str(count), delay=80)\n    sleep(50)\n'
          },
          {
            title: '실습 4-3. 도전! 연타 게임',
            level: 3,
            desc: '<p>5초 동안 A 버튼을 <b>최대한 많이</b> 누르는 게임을 만드세요.</p><ol><li><code>READY</code> 를 흘려보내고 3 · 2 · 1 카운트다운</li><li><code>GO!</code> 와 함께 5초 시작 (이 동안 화면에는 <code>Image.TARGET</code>)</li><li>5초 뒤 누른 횟수를 흘려보냅니다</li><li>30번 이상이면 <code>Image.HAPPY</code>, 아니면 <code>Image.SAD</code></li><li>B 를 누르면 다시 시작</li></ol>',
            hint: '5초 세기는 <code>sleep(5000)</code>, 횟수는 <code>get_presses()</code> 를 씁니다. 시작 전에 <code>button_a.get_presses()</code> 로 기록을 <b>비워 두는 것</b>을 잊지 마세요.',
            starter: 'from microbit import *\n\nwhile True:\n    display.scroll("READY", delay=70)\n    for i in [3, 2, 1]:\n        display.show(i)\n        sleep(700)\n    display.scroll("GO!", delay=60)\n\n    # TODO: 기록 비우기 → 5초 대기 → 횟수 읽기 → 결과 표시\n\n    # TODO: B 를 누를 때까지 기다리기\n',
            solution: 'from microbit import *\n\nwhile True:\n    display.scroll("READY", delay=70)\n    for i in [3, 2, 1]:\n        display.show(i)\n        sleep(700)\n    display.scroll("GO!", delay=60)\n\n    button_a.get_presses()      # 기록 비우기\n    display.show(Image.TARGET)\n    sleep(5000)\n    n = button_a.get_presses()\n\n    display.scroll(str(n), delay=80)\n    if n >= 30:\n        display.show(Image.HAPPY)\n    else:\n        display.show(Image.SAD)\n\n    # B 를 누르면 다시\n    while not button_b.was_pressed():\n        sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: '버튼을 3초 동안 누르고 있을 때, <code>while True:</code> 안의 <code>is_pressed()</code> 는?', options: ['한 번만 True', '3초 동안 계속 True', '3번 True', '항상 False'], answer: 1,
            explain: '<code>is_pressed()</code> 는 <b>지금 눌려 있는지</b>를 묻습니다. 누르고 있는 동안 반복마다 계속 <code>True</code> 입니다.'
          },
          {
            q: '버튼을 누를 때마다 숫자를 <b>1씩</b> 올리려면?', options: ['<code>is_pressed()</code>', '<code>was_pressed()</code>', '<code>get_presses()</code>', '어느 것이든 같다'], answer: 1,
            explain: '<code>was_pressed()</code> 는 확인하면 기록이 지워지므로 <b>한 번 누르면 한 번만</b> <code>True</code> 입니다. <code>is_pressed()</code> 를 쓰면 누른 시간만큼 올라갑니다.'
          },
          {
            q: '<code>get_presses()</code> 를 부르면?', options: ['횟수만 알려 준다', '횟수를 알려 주고 <b>0 으로 초기화</b>한다', '버튼을 누른다', '오류가 난다'], answer: 1,
            explain: '값을 돌려주면서 누적 횟수를 <b>0 으로 되돌립니다</b>. 같은 값을 여러 번 쓰려면 변수에 담아 두세요.'
          },
          {
            q: '두 버튼을 동시에 눌렀을 때만 반응하게 하려면?', options: ['<code>if button_a and button_b:</code>', '<code>if button_a.is_pressed() and button_b.is_pressed():</code>', '<code>if button_a.is_pressed() or button_b.is_pressed():</code>', '<code>if button_ab.is_pressed():</code>'], answer: 1,
            explain: '각각 <code>is_pressed()</code> 로 읽어 <code>and</code> 로 묶습니다. <code>button_a</code> 자체는 버튼 객체라서 조건으로 쓰면 항상 참이 됩니다.'
          },
          {
            q: '다음 코드에서 A 와 B 를 동시에 눌렀을 때 보이는 것은?<pre><code>if button_a.is_pressed():\n    display.show("A")\nelif button_a.is_pressed() and button_b.is_pressed():\n    display.show(Image.HEART)</code></pre>', options: ['하트', '"A"', '둘 다', '아무것도'], answer: 1,
            explain: '<code>if</code> 는 <b>위에서부터</b> 확인하고 맞는 것을 찾으면 나머지를 건너뜁니다. 첫 조건이 이미 참이므로 <code>"A"</code> 만 보입니다. <b>동시 누름 조건을 맨 위에 두어야 합니다.</b>'
          }
        ],
        slides: [
          {
            layout: 'title', title: '버튼 읽기 — 세 가지 방법', subtitle: 'Chapter 04 · 버튼', badge: '1교시',
            notes: '<p>이 시간부터 프로그램이 "사용자와 대화"하기 시작합니다. 학생들의 흥미가 크게 올라가는 지점입니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'code', title: 'is_pressed() — 지금 눌려 있나?', code: 'from microbit import *\n\nwhile True:\n    if button_a.is_pressed():\n        display.show(Image.HEART)\n    else:\n        display.clear()\n    sleep(50)',
            points: ['<code>button_a</code> · <code>button_b</code>', '눌려 있으면 <code>True</code>, 아니면 <code>False</code>', '누르고 있는 <b>동안</b> 계속 True', '시뮬레이터: 마우스 또는 키보드 <kbd>A</kbd>'],
            notes: '<p>학생들이 직접 눌러 보게 합니다. 손을 떼면 사라지는 것을 확인.</p><p>시간: 8분</p>'
          },
          {
            layout: 'diagram', title: 'is_pressed vs was_pressed', html: FIG_STATES, caption: '계속 반응 vs 한 번만 반응',
            notes: '<p>이 그림이 이 장의 핵심입니다. 충분히 시간을 쓰세요.</p><p><b>발문</b>: "버튼을 눌러 점수를 1 올리려면 어느 쪽을 써야 할까요?"</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '차이를 직접 비교', code: 'from microbit import *\n\ncount_is = 0\ncount_was = 0\n\nwhile True:\n    if button_a.is_pressed():\n        count_is += 1\n    if button_b.was_pressed():\n        count_was += 1\n    print("is:", count_is, "was:", count_was)\n    sleep(100)',
            points: ['A 와 B 를 각각 1초쯤 눌러 보기', 'A 는 계속 늘어남', 'B 는 <b>1 만</b> 늘어남', '콘솔에서 확인'],
            notes: '<p>직접 눌러 보며 숫자를 관찰하게 하는 것이 설명보다 효과적입니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'table', title: '세 가지 방법 정리', head: ['메서드', '묻는 것', '쓰임'], rows: [
              ['<code>is_pressed()</code>', '지금 눌려 있나?', '누른 동안 불 켜기'],
              ['<code>was_pressed()</code>', '눌린 적 있나?', '횟수 세기 · 화면 넘기기'],
              ['<code>get_presses()</code>', '몇 번 눌렸나?', '연타 게임 · 통계']],
            notes: '<p>"계속이면 is, 한 번이면 was, 여러 번이면 get" 으로 외우게 합니다.</p><p>시간: 5분</p>'
          },
          {
            layout: 'code', title: 'if · elif · else 와 and', code: 'from microbit import *\n\nwhile True:\n    a = button_a.is_pressed()\n    b = button_b.is_pressed()\n\n    if a and b:\n        display.show(Image.HEART)\n    elif a:\n        display.show("A")\n    elif b:\n        display.show("B")\n    else:\n        display.clear()\n    sleep(50)',
            points: ['위에서부터 확인, 맞으면 나머지 건너뜀', '<b>동시 누름 조건을 맨 위에</b>', '<code>and</code> · <code>or</code> · <code>not</code>', '변수에 담아 두면 읽기 쉬움'],
            notes: '<p>일부러 and 조건을 아래에 두고 실행해 보여 준 뒤, 왜 안 되는지 질문하면 좋습니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'practice', title: '실습 4-2. 0 ~ 99 카운터', desc: 'A 로 증가, B 로 감소, 동시에 누르면 0 으로 초기화',
            starter: 'from microbit import *\n\ncount = 0\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\n\ncount = 0\ndisplay.scroll(str(count), delay=80)\n\nwhile True:\n    a = button_a.was_pressed()\n    b = button_b.was_pressed()\n    if a and b:\n        count = 0\n        display.show(Image.NO)\n        sleep(500)\n        display.scroll(str(count), delay=80)\n    elif a:\n        if count < 99:\n            count += 1\n        display.scroll(str(count), delay=80)\n    elif b:\n        if count > 0:\n            count -= 1\n        display.scroll(str(count), delay=80)\n    sleep(50)\n',
            notes: '<p>범위 제한(0~99)을 빠뜨리는 학생이 많습니다. 음수가 나오면 어떻게 될지 물어보세요.</p><p>시간: 10분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['<code>button_a</code> · <code>button_b</code>', '<code>is_pressed()</code> — 지금 눌려 있나 (계속 True)', '<code>was_pressed()</code> — 눌린 적 있나 (한 번만 True)', '<code>get_presses()</code> — 몇 번 (확인하면 0으로)', '<code>if</code> / <code>elif</code> / <code>else</code> · <code>and</code> / <code>or</code> / <code>not</code>'],
            notes: '<p>다음 시간 예고: 이벤트 루프로 메뉴 · 게임 만들기.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch04-2',
        title: '이벤트 루프와 터치 — 반응하는 프로그램',
        minutes: 45,
        goals: [
          '이벤트 루프 구조를 이해하고 프로그램을 설계할 수 있다',
          '변수로 <b>상태(모드)</b>를 관리해 화면을 전환할 수 있다',
          '터치 로고와 핀 터치를 입력으로 쓸 수 있다',
          '버튼을 활용한 작은 프로젝트를 완성할 수 있다'
        ],
        flow: [['이벤트 루프', 8], ['상태 관리', 14], ['터치 입력', 10], ['프로젝트', 10], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '이벤트 루프 — micro:bit 프로그램의 심장' },
          { type: 'p', html: '버튼이 언제 눌릴지는 아무도 모릅니다. 그래서 micro:bit 프로그램은 <b>끝없이 돌면서 “혹시 눌렸나?” 를 계속 확인</b>합니다. 이 구조를 <b>이벤트 루프(event loop)</b> 라고 합니다.' },
          { type: 'figure', html: FIG_LOOP, caption: '그림 4-2. 이벤트 루프 — 입력 확인 → 판단 → 반응 → 잠깐 쉬기 → 반복' },
          {
            type: 'code', title: '예제 4-8. 이벤트 루프의 기본 틀', code: `from microbit import *

# ① 시작할 때 한 번만 하는 준비
display.scroll("READY", delay=60)
count = 0

# ② 끝없이 반복하는 부분
while True:
    # 입력 확인
    if button_a.was_pressed():
        count = count + 1        # 판단 + 반응
        display.show(count % 10)
    if button_b.was_pressed():
        count = 0
        display.show(Image.NO)
    sleep(50)                     # 잠깐 쉬기`,
            desc: '<b>준비 부분</b>은 <code>while True:</code> <b>바깥(위)</b>에 씁니다. 반복 안에 넣으면 계속 다시 실행되어 버립니다. 이 틀은 앞으로 만들 거의 모든 프로그램에 쓰입니다.',
            expect: 'READY 가 흐른 뒤, A 를 누를 때마다 숫자가 올라가고 B 를 누르면 0 으로 돌아갑니다.'
          },
          { type: 'callout', kind: 'warn', title: '준비 코드의 위치', html: '<code>display.scroll("READY")</code> 를 <code>while True:</code> 안에 넣으면 <b>반복할 때마다 계속 흘러갑니다</b>. 한 번만 해야 하는 일은 반드시 반복 <b>바깥 위쪽</b>에 쓰세요.' },

          { type: 'h', text: '상태(모드)를 변수로 관리하기' },
          { type: 'p', html: '버튼으로 <b>화면을 넘기는</b> 프로그램을 만들려면 “지금 몇 번째 화면인가”를 기억해야 합니다. 이런 정보를 <b>상태(state)</b> 라고 하고, 보통 변수에 담아 둡니다.' },
          {
            type: 'code', title: '예제 4-9. 버튼으로 넘기는 그림 앨범', code: `from microbit import *

pictures = [Image.HAPPY, Image.HEART, Image.DUCK,
            Image.GHOST, Image.UMBRELLA]
index = 0                      # 지금 보고 있는 번호 = 상태

display.show(pictures[index])

while True:
    if button_a.was_pressed():
        index = index - 1
        if index < 0:
            index = len(pictures) - 1     # 맨 앞에서 뒤로
        display.show(pictures[index])

    if button_b.was_pressed():
        index = index + 1
        if index >= len(pictures):
            index = 0                     # 맨 뒤에서 앞으로
        display.show(pictures[index])

    sleep(50)`,
            desc: 'A 는 이전 그림, B 는 다음 그림입니다. <code>index</code> 가 <b>상태</b>이고, 범위를 벗어나면 반대쪽 끝으로 돌아가게 처리했습니다. 이 “둥글게 순환” 처리는 아주 자주 쓰입니다.',
            expect: 'A · B 로 그림 5장을 앞뒤로 넘길 수 있습니다.'
          },
          { type: 'callout', kind: 'more', title: '나머지 연산으로 더 짧게', html: '<p>순환 처리는 <b>나머지 연산(<code>%</code>)</b> 으로 짧게 쓸 수 있습니다.</p><pre><code>index = (index + 1) % len(pictures)   # 다음\nindex = (index - 1) % len(pictures)   # 이전</code></pre><p>파이썬에서는 <code>(-1) % 5</code> 가 <code>4</code> 이므로 뒤로 갈 때도 그대로 동작합니다.</p>' },
          {
            type: 'code', title: '예제 4-10. 모드 전환 — 온도계 / 빛 측정기', code: `from microbit import *

mode = 0        # 0 = 온도, 1 = 빛

while True:
    if button_a.was_pressed():
        mode = (mode + 1) % 2
        display.scroll("TEMP" if mode == 0 else "LIGHT", delay=60)

    if mode == 0:
        display.show(str(temperature())[0])
    else:
        display.show(str(display.read_light_level() // 26))

    sleep(300)`,
            desc: 'A 를 누를 때마다 <b>모드</b>가 바뀝니다. 하나의 프로그램 안에서 여러 기능을 전환하는 흔한 방법입니다. <code>"TEMP" if mode == 0 else "LIGHT"</code> 는 “mode 가 0 이면 TEMP, 아니면 LIGHT” 라는 뜻입니다.',
            expect: 'A 를 누르면 TEMP ↔ LIGHT 모드가 바뀌며 값이 표시됩니다.',
            nondeterministic: true
          },

          { type: 'h', text: '터치 입력 — 로고와 핀' },
          { type: 'p', html: 'micro:bit V2 에는 앞면 위쪽에 <b>금색 로고</b>가 있습니다. 손가락을 대면 <b>터치 센서</b>처럼 반응합니다. 아래쪽 <code>0</code> · <code>1</code> · <code>2</code> 핀도 마찬가지입니다.' },
          {
            type: 'code', title: '예제 4-11. 로고 터치', code: `from microbit import *

while True:
    if pin_logo.is_touched():
        display.show(Image.HEART)
    else:
        display.show(Image.HEART_SMALL)
    sleep(50)`,
            desc: '오른쪽 보드 그림의 <b>금색 로고</b>를 마우스로 눌러 보세요. <code>pin_logo.is_touched()</code> 는 손가락이 닿아 있으면 <code>True</code> 입니다.',
            expect: '로고를 누르면 큰 하트, 떼면 작은 하트'
          },
          {
            type: 'code', title: '예제 4-12. 핀 터치로 과일 피아노', code: `from microbit import *
import music

while True:
    if pin0.is_touched():
        music.pitch(262, 200)      # 도
    elif pin1.is_touched():
        music.pitch(330, 200)      # 미
    elif pin2.is_touched():
        music.pitch(392, 200)      # 솔
    sleep(30)`,
            desc: '보드 그림 아래쪽의 <b>큰 단자 0 · 1 · 2</b> 를 눌러 보세요. 실제로는 한 손으로 <code>GND</code> 를 잡고 다른 손으로 핀을 만지면 소리가 납니다. 바나나나 사과에 악어클립을 물리면 <b>과일 피아노</b>가 됩니다!',
            expect: '0 · 1 · 2 핀을 누르면 각각 도 · 미 · 솔 소리가 납니다.'
          },
          { type: 'callout', kind: 'board', title: '실제 보드에서 터치하기', html: '<p>micro:bit 의 핀 터치는 <b>몸을 통해 전류가 흐르는 것</b>을 감지합니다. 그래서 실제 보드에서는:</p><ul><li>한 손으로 <b>GND</b> 단자를 잡고</li><li>다른 손으로 <code>0</code> · <code>1</code> · <code>2</code> 를 만집니다.</li></ul><p>V2 의 로고는 <b>정전식(capacitive)</b> 이라 GND 를 잡지 않아도 됩니다. 핀도 <code>pin0.set_touch_mode(pin0.CAPACITIVE)</code> 로 바꿀 수 있습니다.</p>' },

          { type: 'h', text: '작은 프로젝트 — 주사위와 가위바위보' },
          {
            type: 'code', title: '예제 4-13. 버튼 주사위', code: `from microbit import *
import random

DICE = [Image("00000:00000:00900:00000:00000"),   # 1
        Image("90000:00000:00000:00000:00009"),   # 2
        Image("90000:00000:00900:00000:00009"),   # 3
        Image("90009:00000:00000:00000:90009"),   # 4
        Image("90009:00000:00900:00000:90009"),   # 5
        Image("90009:00000:90009:00000:90009")]   # 6

display.show(Image.DIAMOND_SMALL)

while True:
    if button_a.was_pressed():
        # 굴리는 느낌
        for i in range(8):
            display.show(DICE[random.randint(0, 5)])
            sleep(80)
        display.show(DICE[random.randint(0, 5)])
    sleep(50)`,
            desc: '<code>random.randint(0, 5)</code> 는 0 부터 5 까지의 수를 <b>무작위로</b> 하나 고릅니다. 7장에서 자세히 배웁니다. 여기서는 “버튼 → 무작위 → 화면” 의 흐름을 봐 두세요.',
            expect: 'A 를 누르면 주사위가 굴러가다 멈춥니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 4-14. 가위바위보', code: `from microbit import *
import random

ROCK = Image("00000:09990:09990:09990:00000")
PAPER = Image("99999:90009:90009:90009:99999")
SCISSORS = Image("90009:09090:00900:09090:90009")
HANDS = [ROCK, PAPER, SCISSORS]

display.scroll("RPS", delay=70)

while True:
    if button_a.was_pressed():
        for i in range(6):
            display.show(HANDS[i % 3])
            sleep(100)
        display.show(HANDS[random.randint(0, 2)])
    sleep(50)`,
            desc: '리스트에 담아 두면 무작위로 고르기가 쉽습니다. <code>i % 3</code> 은 0, 1, 2, 0, 1, 2 … 로 순환해 “고민하는” 연출이 됩니다.',
            expect: 'A 를 누르면 바위 · 보 · 가위가 돌다가 하나로 멈춥니다.',
            nondeterministic: true
          },

          { type: 'h', text: '2교시 · 4장 요약' },
          {
            type: 'list', items: [
              '<b>이벤트 루프</b>: 준비(반복 바깥) → <code>while True:</code> 안에서 입력 확인 → 판단 → 반응 → <code>sleep()</code>.',
              '“지금 몇 번째 화면인가” 같은 정보를 <b>상태 변수</b>로 관리합니다.',
              '순환 처리는 <code>(index + 1) % len(리스트)</code> 로 간단히 씁니다.',
              '<code>pin_logo.is_touched()</code> · <code>pin0.is_touched()</code> 로 <b>터치</b>도 입력으로 쓸 수 있습니다.',
              '버튼 + 무작위 + 이미지 리스트 = 주사위, 가위바위보 같은 작은 게임.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 4-4. 4단계 신호등',
            level: 2,
            desc: '<p>A 를 누를 때마다 <b>빨강 → 노랑 → 초록 → 꺼짐 → 빨강</b> 순서로 바뀌는 신호등을 만드세요.</p><ul><li>각 색은 <code>Image("…")</code> 로 직접 만듭니다 (위 두 줄 / 가운데 줄 / 아래 두 줄)</li><li>상태를 <code>state</code> 변수로 관리하고 <code>%</code> 로 순환시키세요</li><li>B 를 누르면 바로 빨강으로 돌아갑니다</li></ul>',
            hint: '<code>lights = [RED, YELLOW, GREEN, OFF]</code> 리스트를 만들고 <code>state = (state + 1) % 4</code> 로 순환합니다.',
            starter: 'from microbit import *\n\nRED = Image("99999:99999:00000:00000:00000")\nYELLOW = Image("00000:00000:99999:00000:00000")\nGREEN = Image("00000:00000:00000:99999:99999")\nOFF = Image("00000:00000:00000:00000:00000")\nlights = [RED, YELLOW, GREEN, OFF]\n\nstate = 0\ndisplay.show(lights[state])\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\n\nRED = Image("99999:99999:00000:00000:00000")\nYELLOW = Image("00000:00000:99999:00000:00000")\nGREEN = Image("00000:00000:00000:99999:99999")\nOFF = Image("00000:00000:00000:00000:00000")\nlights = [RED, YELLOW, GREEN, OFF]\n\nstate = 0\ndisplay.show(lights[state])\n\nwhile True:\n    if button_a.was_pressed():\n        state = (state + 1) % len(lights)\n        display.show(lights[state])\n    if button_b.was_pressed():\n        state = 0\n        display.show(lights[state])\n    sleep(50)\n'
          },
          {
            title: '실습 4-5. 반응 속도 측정기',
            level: 3,
            desc: '<p>사람의 반응 속도를 재는 게임을 만드세요.</p><ol><li><code>WAIT</code> 를 보여 주고 <b>2~5초 사이 무작위 시간</b> 기다립니다. (<code>random.randint(2000, 5000)</code>)</li><li>화면 전체를 켭니다(<code>Image("99999:…")</code>). 이때부터 시간 측정 시작!</li><li>A 를 누르면 걸린 시간(ms)을 흘려보냅니다.</li><li>B 를 누르면 다시 시작합니다.</li></ol><p><b>도전</b>: 불이 켜지기 <b>전에</b> 눌렀다면 <code>CHEAT!</code> 를 보여 주세요.</p>',
            hint: '<code>running_time()</code> 이 현재 시각(ms)입니다. 불이 켜진 순간의 시각을 <code>start = running_time()</code> 로 저장하고, 누른 순간 <code>running_time() - start</code> 를 계산합니다.',
            starter: 'from microbit import *\nimport random\n\nfull = Image("99999:99999:99999:99999:99999")\n\nwhile True:\n    display.scroll("WAIT", delay=70)\n    sleep(random.randint(2000, 5000))\n\n    display.show(full)\n    start = running_time()\n\n    # TODO: A 를 누를 때까지 기다리고 걸린 시간 표시\n\n    # TODO: B 를 누르면 다시 시작\n',
            solution: 'from microbit import *\nimport random\n\nfull = Image("99999:99999:99999:99999:99999")\n\nwhile True:\n    display.scroll("WAIT", delay=70)\n    button_a.was_pressed()          # 기록 비우기\n    wait = random.randint(2000, 5000)\n    cheat = False\n    t0 = running_time()\n    while running_time() - t0 < wait:\n        if button_a.was_pressed():\n            cheat = True\n            break\n        sleep(20)\n\n    if cheat:\n        display.scroll("CHEAT!", delay=70)\n    else:\n        display.show(full)\n        start = running_time()\n        while not button_a.was_pressed():\n            sleep(10)\n        ms = running_time() - start\n        display.clear()\n        display.scroll(str(ms) + "MS", delay=70)\n\n    display.show(Image.ARROW_E)\n    while not button_b.was_pressed():\n        sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: '<code>display.scroll("READY")</code> 를 <code>while True:</code> <b>안</b>에 넣으면?', options: ['한 번만 흐른다', '반복할 때마다 계속 흐른다', '오류가 난다', '아무 일도 없다'], answer: 1,
            explain: '반복 안의 코드는 <b>매번</b> 실행됩니다. 한 번만 해야 하는 준비 코드는 반복 <b>바깥 위쪽</b>에 씁니다.'
          },
          {
            q: '<code>index = (index + 1) % 5</code> 의 효과는?', options: ['index 가 계속 커진다', 'index 가 0~4 사이를 순환한다', 'index 가 5 로 고정된다', '오류'], answer: 1,
            explain: '5 로 나눈 <b>나머지</b>는 항상 0~4 이므로, 4 다음에 0 으로 돌아가는 <b>순환</b>이 됩니다.'
          },
          {
            q: 'micro:bit 의 금색 로고를 손가락으로 만졌는지 확인하려면?', options: ['<code>logo.is_pressed()</code>', '<code>pin_logo.is_touched()</code>', '<code>button_logo.was_pressed()</code>', '<code>display.is_touched()</code>'], answer: 1,
            explain: '<code>pin_logo.is_touched()</code> 입니다. V2 부터 쓸 수 있습니다.'
          },
          {
            q: '실제 micro:bit 에서 <code>pin0.is_touched()</code> 가 반응하게 하려면?', options: ['핀만 만지면 된다', '한 손으로 GND 를 잡고 다른 손으로 핀을 만진다', 'USB 를 뽑아야 한다', '버튼 A 를 함께 눌러야 한다'], answer: 1,
            explain: '기본(저항식) 터치는 <b>몸을 통해 전류가 흐르는 것</b>을 감지하므로 GND 를 함께 잡아야 합니다. <code>set_touch_mode(pin0.CAPACITIVE)</code> 로 바꾸면 한 손으로도 됩니다.'
          },
          {
            q: '이벤트 루프의 <code>sleep(50)</code> 을 지우면?', options: ['더 빠르고 좋다', 'CPU 를 쉬지 않고 써서 전력 소모가 커지고 입력을 놓칠 수 있다', '오류가 난다', '버튼이 두 번 눌린다'], answer: 1,
            explain: '짧은 <code>sleep()</code> 은 CPU 에 숨 쉴 틈을 줍니다. 실제 보드에서는 전력 소모와 안정성 모두에 영향을 줍니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '이벤트 루프와 터치', subtitle: 'Chapter 04 · 반응하는 프로그램', badge: '2교시',
            notes: '<p>앞으로 만들 프로그램의 기본 뼈대를 배우는 시간입니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'diagram', title: '이벤트 루프', html: FIG_LOOP, caption: '입력 확인 → 판단 → 반응 → 잠깐 쉬기 → 반복',
            notes: '<p>"게임이든 앱이든 모든 프로그램이 이렇게 돈다"고 알려 주면 흥미를 보입니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: '준비 코드의 위치', code: 'from microbit import *\n\n# ① 준비 (한 번만)\ndisplay.scroll("READY", delay=60)\ncount = 0\n\n# ② 반복\nwhile True:\n    if button_a.was_pressed():\n        count += 1\n        display.show(count % 10)\n    sleep(50)',
            points: ['준비 코드는 <b>반복 바깥 위쪽</b>', '반복 안에 넣으면 계속 실행됨', '앞으로 모든 프로그램의 틀', '<code>sleep(50)</code> 잊지 않기'],
            notes: '<p>일부러 scroll 을 반복 안에 넣어 실행해 보여 주면 확실히 이해합니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: '상태 변수로 화면 넘기기', code: 'from microbit import *\n\npictures = [Image.HAPPY, Image.HEART, Image.DUCK]\nindex = 0\ndisplay.show(pictures[index])\n\nwhile True:\n    if button_b.was_pressed():\n        index = (index + 1) % len(pictures)\n        display.show(pictures[index])\n    sleep(50)',
            points: ['<code>index</code> = 지금 상태', '<code>% len(리스트)</code> 로 순환', '앨범 · 메뉴 · 모드 전환의 기본', '<code>was_pressed()</code> 를 쓰는 이유는?'],
            notes: '<p><b>발문</b>: "여기서 is_pressed 를 쓰면 어떻게 될까요?" → 너무 빨리 넘어감.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '터치 — 로고와 핀', code: 'from microbit import *\nimport music\n\nwhile True:\n    if pin_logo.is_touched():\n        display.show(Image.HEART)\n    elif pin0.is_touched():\n        music.pitch(262, 200)\n    elif pin1.is_touched():\n        music.pitch(330, 200)\n    sleep(30)',
            points: ['<code>pin_logo.is_touched()</code> (V2)', '<code>pin0/1/2.is_touched()</code>', '실제 보드: 한 손으로 GND 잡기', '바나나 · 사과로 <b>과일 피아노</b>!'],
            notes: '<p>실물 보드와 악어클립, 과일이 있으면 최고의 시연 소재입니다. 미리 준비해 두세요.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '버튼 주사위', code: 'from microbit import *\nimport random\n\nDICE = [Image("00000:00000:00900:00000:00000"),\n        Image("90000:00000:00000:00000:00009"),\n        Image("90000:00000:00900:00000:00009"),\n        Image("90009:00000:00000:00000:90009"),\n        Image("90009:00000:00900:00000:90009"),\n        Image("90009:00000:90009:00000:90009")]\n\nwhile True:\n    if button_a.was_pressed():\n        for i in range(8):\n            display.show(DICE[random.randint(0, 5)])\n            sleep(80)\n    sleep(50)',
            points: ['버튼 → 무작위 → 화면', '굴리는 연출 = 짧은 반복', '<code>random</code> 은 7장에서 자세히', '주사위 눈 6개를 직접 그림'],
            notes: '<p>학생들이 아주 좋아하는 예제입니다. 주사위 눈 그림을 직접 고쳐 보게 하세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'practice', title: '실습 4-5. 반응 속도 측정기', desc: '무작위 시간 뒤 불이 켜지면 A 를 눌러 반응 시간을 잽니다.',
            starter: 'from microbit import *\nimport random\n\nfull = Image("99999:99999:99999:99999:99999")\n\nwhile True:\n    display.scroll("WAIT", delay=70)\n    sleep(random.randint(2000, 5000))\n    display.show(full)\n    start = running_time()\n    # TODO\n',
            solution: 'from microbit import *\nimport random\n\nfull = Image("99999:99999:99999:99999:99999")\n\nwhile True:\n    display.scroll("WAIT", delay=70)\n    sleep(random.randint(2000, 5000))\n    display.show(full)\n    start = running_time()\n    while not button_a.was_pressed():\n        sleep(10)\n    ms = running_time() - start\n    display.clear()\n    display.scroll(str(ms) + "MS", delay=70)\n    while not button_b.was_pressed():\n        sleep(50)\n',
            notes: '<p>반 전체의 기록을 칠판에 적어 순위를 매기면 분위기가 아주 좋아집니다. 보통 200~350ms 가 나옵니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '4장 정리', bullets: ['<code>is_pressed</code> / <code>was_pressed</code> / <code>get_presses</code>', '<code>if</code> · <code>elif</code> · <code>else</code> · <code>and</code> / <code>or</code> / <code>not</code>', '이벤트 루프: 준비(바깥) → 확인 → 판단 → 반응 → sleep', '상태 변수 + <code>%</code> 로 순환', '<code>pin_logo</code> · <code>pin0~2</code> 터치 입력'],
            notes: '<p>4장 전체 정리. 다음 장 예고: 핀으로 바깥 세상과 연결하기 — LED · 버튼 · 센서 직접 달기.</p><p>과제: 실습 4-5 반응 속도 기록 재 보기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
