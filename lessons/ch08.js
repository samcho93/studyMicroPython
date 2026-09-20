/* Chapter 08. 움직임 — 가속도 센서
 * 원본: MicroPython on the BBC micro:bit — Movement
 */
(function () {
  const FIG_AXES = `<svg viewBox="0 0 1280 520" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="36" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--fg)">가속도 센서의 세 축 — x · y · z</text>
  <!-- 보드 -->
  <rect x="440" y="150" width="400" height="250" rx="26" fill="#0e6b64" stroke="#0a4f4a" stroke-width="3"/>
  ${Array.from({ length: 25 }, (_, i) => `<rect x="${560 + (i % 5) * 34}" y="${215 + Math.floor(i / 5) * 28}" width="12" height="18" rx="3" fill="#4a1a16"/>`).join('')}
  <circle cx="620" cy="185" r="8" fill="#d4a017"/><circle cx="660" cy="185" r="8" fill="#d4a017"/>
  <rect x="470" y="250" width="44" height="44" rx="8" fill="#101418"/><text x="492" y="318" text-anchor="middle" font-size="17" fill="#cfe9e6">A</text>
  <rect x="766" y="250" width="44" height="44" rx="8" fill="#101418"/><text x="788" y="318" text-anchor="middle" font-size="17" fill="#cfe9e6">B</text>
  <!-- x 축 -->
  <defs>
    <marker id="c8x" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--danger)"/></marker>
    <marker id="c8y" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--ok)"/></marker>
    <marker id="c8z" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker>
  </defs>
  <line x1="640" y1="275" x2="1030" y2="275" stroke="var(--danger)" stroke-width="4" marker-end="url(#c8x)"/>
  <text x="1050" y="282" font-size="24" font-weight="bold" fill="var(--danger)">+x</text>
  <text x="1050" y="310" font-size="17" fill="var(--muted)">오른쪽으로 기울임</text>
  <line x1="640" y1="275" x2="250" y2="275" stroke="var(--danger)" stroke-width="4" marker-end="url(#c8x)" opacity=".5"/>
  <text x="200" y="282" font-size="22" font-weight="bold" fill="var(--danger)" opacity=".7">−x</text>
  <text x="200" y="310" font-size="17" fill="var(--muted)">왼쪽으로</text>
  <!-- y 축 -->
  <line x1="640" y1="275" x2="640" y2="470" stroke="var(--ok)" stroke-width="4" marker-end="url(#c8y)"/>
  <text x="662" y="466" font-size="24" font-weight="bold" fill="var(--ok)">+y</text>
  <text x="662" y="494" font-size="17" fill="var(--muted)">앞으로(아래로) 기울임</text>
  <line x1="640" y1="275" x2="640" y2="80" stroke="var(--ok)" stroke-width="4" marker-end="url(#c8y)" opacity=".5"/>
  <text x="662" y="86" font-size="22" font-weight="bold" fill="var(--ok)" opacity=".7">−y</text>
  <text x="662" y="114" font-size="17" fill="var(--muted)">뒤로(위로) 기울임</text>
  <!-- z 축 -->
  <line x1="640" y1="275" x2="900" y2="120" stroke="var(--accent)" stroke-width="4" marker-end="url(#c8z)" stroke-dasharray="9 5"/>
  <text x="915" y="118" font-size="22" font-weight="bold" fill="var(--accent)">−z</text>
  <text x="915" y="146" font-size="17" fill="var(--muted)">앞면이 위 (책상에 놓음)</text>
  <line x1="640" y1="275" x2="380" y2="430" stroke="var(--accent)" stroke-width="4" marker-end="url(#c8z)" stroke-dasharray="9 5" opacity=".5"/>
  <text x="250" y="450" font-size="22" font-weight="bold" fill="var(--accent)" opacity=".7">+z</text>
  <text x="180" y="478" font-size="17" fill="var(--muted)">앞면이 아래</text>
</svg>`;

  const FIG_VALUES = `<svg viewBox="0 0 1280 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">값의 범위 — 1024 = 중력 1g</text>
  <line x1="150" y1="150" x2="1130" y2="150" stroke="var(--line)" stroke-width="4"/>
  ${[[-1024, '왼쪽 · 위로 완전히 세움'], [-512, '살짝 기울임'], [0, '평평 (중립)'], [512, '살짝 기울임'], [1024, '오른쪽 · 아래로 완전히 세움']]
      .map(([v, label], i) => {
        const x = 150 + i * 245;
        return `<line x1="${x}" y1="135" x2="${x}" y2="165" stroke="var(--fg)" stroke-width="3"/>
  <text x="${x}" y="122" text-anchor="middle" font-size="22" font-weight="bold" fill="${v === 0 ? 'var(--ok)' : 'var(--accent)'}">${v}</text>
  <text x="${x}" y="196" text-anchor="middle" font-size="16" fill="var(--muted)">${label}</text>`;
      }).join('\n  ')}
  <rect x="150" y="230" width="980" height="52" rx="10" fill="var(--warn)" opacity=".15" stroke="var(--warn)" stroke-width="2"/>
  <text x="640" y="262" text-anchor="middle" font-size="19" fill="var(--fg)">흔들거나 부딪히면 <tspan font-weight="bold">2000 이상</tspan> 의 값도 나옵니다 (기본 범위 ±2g)</text>
  <text x="640" y="312" text-anchor="middle" font-size="18" fill="var(--muted)">평평하게 놓으면 x = 0, y = 0, z = −1024 (중력이 아래로 당기는 중)</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch08',
    no: '08',
    title: '움직임 — 가속도 센서',
    subtitle: 'accelerometer · 기울기 · 수평계 · 기울기 게임',
    summary: 'micro:bit 안에는 보드가 어느 쪽으로 기울었는지, 얼마나 세게 흔들렸는지 알아내는 가속도 센서가 들어 있습니다. x · y · z 세 축의 의미를 이해하고 값을 읽어, 기울기를 화면에 표시하는 수평계와 공을 굴리는 게임을 만듭니다. 스마트폰의 화면 회전도 같은 원리입니다.',
    goals: [
      '가속도 센서의 x · y · z 축이 각각 무엇을 재는지 설명할 수 있다',
      '<code>get_x()</code> · <code>get_y()</code> · <code>get_z()</code> · <code>get_values()</code> 로 값을 읽을 수 있다',
      '기울기 값을 화면 좌표로 바꿔 표시할 수 있다',
      '<code>get_strength()</code> 로 흔들림의 세기를 잴 수 있다',
      '가속도 값을 이용한 간단한 게임을 만들 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch08-1',
        title: '가속도 센서 읽기 — x · y · z',
        minutes: 45,
        goals: [
          '가속도 센서가 무엇을 재는지 설명할 수 있다',
          'x · y · z 축의 방향과 값의 범위를 이해한다',
          '<code>get_x()</code> 등으로 값을 읽고 화면 · 콘솔에 표시할 수 있다',
          '<code>get_strength()</code> 로 흔들림 세기를 잴 수 있다'
        ],
        flow: [['가속도 센서란', 8], ['세 축의 의미', 14], ['값 읽기', 12], ['세기 재기', 8], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '가속도 센서 — 기울기와 움직임을 느끼는 눈' },
          { type: 'p', html: '스마트폰을 옆으로 눕히면 화면이 저절로 돌아갑니다. 만보기는 주머니 안에서 걸음을 셉니다. 게임 컨트롤러는 손목을 움직이면 캐릭터가 따라 움직이지요. 이 모든 것이 <b>가속도 센서(accelerometer)</b> 덕분입니다.' },
          { type: 'p', html: 'micro:bit 뒷면에도 아주 작은 가속도 센서 칩이 들어 있습니다. 이 센서는 <b>중력</b>과 <b>움직임</b>을 세 방향으로 나누어 잽니다.' },
          { type: 'callout', kind: 'more', title: '가속도 센서는 어떻게 작동할까?', html: '<p>센서 안에는 아주 작은(머리카락 굵기보다 가는) <b>추와 스프링</b> 구조가 들어 있습니다. 보드를 기울이거나 움직이면 이 추가 밀리고, 그 밀린 정도를 전기 신호로 바꿔 읽습니다.</p><p>이렇게 기계 구조와 전자 회로를 하나의 칩에 넣은 기술을 <b>MEMS</b>(미세 전자 기계 시스템) 라고 합니다. 스마트폰, 자동차 에어백, 드론 모두 이 기술을 씁니다.</p>' },

          { type: 'h', text: '세 개의 축' },
          { type: 'figure', html: FIG_AXES, caption: '그림 8-1. 가속도 센서의 세 축' },
          {
            type: 'table', head: ['축', '읽는 함수', '언제 값이 커지나', '언제 작아지나'], rows: [
              ['<b>x</b> (좌우)', '<code>accelerometer.get_x()</code>', '보드를 <b>오른쪽</b>으로 기울일 때 (+)', '<b>왼쪽</b>으로 기울일 때 (−)'],
              ['<b>y</b> (앞뒤)', '<code>accelerometer.get_y()</code>', '보드 <b>아래쪽</b>을 내릴 때 (+)', '<b>위쪽</b>을 내릴 때 (−)'],
              ['<b>z</b> (위아래)', '<code>accelerometer.get_z()</code>', '앞면이 <b>아래</b>를 볼 때 (+)', '앞면이 <b>위</b>를 볼 때 (−)']
            ], caption: '표 8-1. 세 축의 의미'
          },
          { type: 'figure', html: FIG_VALUES, caption: '그림 8-2. 값의 범위 — 1024 가 중력 1g' },
          { type: 'callout', kind: 'tip', title: '평평하게 놓으면?', html: '책상에 앞면이 위를 향하도록 평평하게 놓으면 <b>x = 0, y = 0, z ≈ −1024</b> 입니다. 중력이 보드를 아래로 당기고 있기 때문입니다. “가만히 있는데 왜 z 가 0 이 아니지?” 하는 의문은 이 때문입니다.' },
          {
            type: 'code', repl: true, title: '셸에서 값 읽어 보기', code: `accelerometer.get_x()
accelerometer.get_y()
accelerometer.get_z()
accelerometer.get_values()`,
            desc: '🧭 <b>센서 탭</b>의 기울기 판을 끌어 값을 바꾼 뒤 다시 실행해 보세요. <code>get_values()</code> 는 세 값을 <b>한 번에</b> 튜플로 돌려줍니다.',
            expect: '>>> accelerometer.get_values()\n(0, 0, -1024)'
          },

          { type: 'h', text: '값 읽고 표시하기' },
          {
            type: 'code', title: '예제 8-1. 세 축 값 확인하기', code: `from microbit import *

while True:
    x, y, z = accelerometer.get_values()
    print("x =", x, " y =", y, " z =", z)
    sleep(300)`,
            hint: '🧭 <b>센서 탭</b>의 기울기 판을 끌고, “앞면 아래” 버튼도 눌러 보세요.',
            desc: '<code>x, y, z = accelerometer.get_values()</code> 는 세 값을 <b>한 번에</b> 받는 파이썬 문법입니다. 보드를 이리저리 기울이며 값이 어떻게 바뀌는지 관찰하세요.',
            expect: 'x = 0  y = 0  z = -1024\nx = 512  y = -200  z = -850 …',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 8-2. 기울기를 화살표로', code: `from microbit import *

while True:
    x = accelerometer.get_x()
    y = accelerometer.get_y()

    if y < -400:
        display.show(Image.ARROW_N)       # 위로 기울임
    elif y > 400:
        display.show(Image.ARROW_S)       # 아래로
    elif x < -400:
        display.show(Image.ARROW_W)       # 왼쪽
    elif x > 400:
        display.show(Image.ARROW_E)       # 오른쪽
    else:
        display.show(Image.DIAMOND_SMALL) # 평평
    sleep(100)`,
            hint: '🧭 센서 탭의 기울기 판을 상하좌우로 끌어 보세요.',
            desc: '기울기 값을 <b>임계값(400)</b> 과 비교해 방향을 판단합니다. 임계값을 바꾸면 반응이 얼마나 민감해지는지도 실험해 보세요.',
            expect: '기울이는 방향으로 화살표가 나타납니다.'
          },
          {
            type: 'code', title: '예제 8-3. 기울기 막대그래프', code: `from microbit import *

while True:
    x = accelerometer.get_x()
    # -1024 ~ 1024 를 0 ~ 4 열로
    col = scale(x, from_=(-1024, 1024), to=(0, 4))
    display.clear()
    for y in range(5):
        display.set_pixel(col, y, 9)
    sleep(50)`,
            hint: '🧭 기울기 판을 좌우로 천천히 끌어 보세요.',
            desc: '5장에서 배운 <code>scale()</code> 로 기울기 값을 화면의 열 번호(0~4)로 바꿨습니다. 세로줄이 기울기를 따라 움직입니다.',
            expect: '좌우로 기울이면 세로줄이 따라 움직입니다.'
          },

          { type: 'h', text: '수평계 만들기' },
          {
            type: 'code', title: '예제 8-4. 2축 수평계', code: `from microbit import *

while True:
    x = accelerometer.get_x()
    y = accelerometer.get_y()

    # 기울기를 화면 좌표(0~4)로 바꾼다
    col = scale(x, from_=(-1024, 1024), to=(0, 4))
    row = scale(y, from_=(-1024, 1024), to=(0, 4))

    display.clear()
    display.set_pixel(2, 2, 2)      # 중심 표시(희미하게)
    display.set_pixel(col, row, 9)  # 기포
    sleep(50)`,
            hint: '🧭 기울기 판을 이리저리 끌어 점이 따라 움직이는지 보세요.',
            desc: '점 하나가 기울인 방향으로 굴러갑니다. 건축에서 쓰는 <b>수평계(수평 확인 도구)</b> 와 같은 원리입니다. 평평하면 점이 한가운데 옵니다.',
            expect: '기울인 방향으로 점이 이동합니다. 평평하면 가운데.'
          },
          {
            type: 'code', title: '예제 8-5. 완전히 평평할 때만 알려 주기', code: `from microbit import *
import music

flat_before = False

while True:
    x = accelerometer.get_x()
    y = accelerometer.get_y()

    flat = abs(x) < 60 and abs(y) < 60      # 거의 평평한가?

    if flat:
        display.show(Image.YES)
        if not flat_before:                  # 방금 평평해졌으면
            music.pitch(880, 150)
    else:
        col = scale(x, from_=(-1024, 1024), to=(0, 4))
        row = scale(y, from_=(-1024, 1024), to=(0, 4))
        display.clear()
        display.set_pixel(col, row, 9)

    flat_before = flat
    sleep(50)`,
            hint: '🧭 기울기 판을 끌었다가 “평평하게” 버튼을 눌러 보세요.',
            desc: '<code>abs()</code> 는 <b>절댓값</b>입니다. <code>abs(x) &lt; 60</code> 은 “x 가 −60 ~ 60 사이” 라는 뜻입니다. <code>flat_before</code> 로 <b>상태가 바뀌는 순간</b>만 소리를 냅니다(5장의 채터링 방지와 같은 방법).',
            expect: '기울이면 점, 평평하면 체크 표시와 함께 짧은 소리'
          },

          { type: 'h', text: '흔들림의 세기 — get_strength()' },
          { type: 'p', html: '세 축을 따로 보지 않고 <b>전체적으로 얼마나 큰 힘이 걸렸는지</b> 알고 싶을 때가 있습니다. <code>get_strength()</code> 는 세 축을 합친 크기를 돌려줍니다.' },
          {
            type: 'code', title: '예제 8-6. 흔들림 세기 재기', code: `from microbit import *

while True:
    s = accelerometer.get_strength()
    print("세기:", s)

    # 0~4096 을 0~4 단계로
    level = min(4, s // 800)
    display.clear()
    for y in range(level + 1):
        for x in range(5):
            display.set_pixel(x, 4 - y, 9)
    sleep(100)`,
            hint: '🧭 센서 탭의 <b>흔들기</b> 버튼을 눌러 보세요.',
            desc: '가만히 있어도 <b>중력 때문에 약 1024</b> 가 나옵니다. 흔들면 2000, 3000 까지 올라갑니다. 막대의 높이로 세기를 표시했습니다.',
            expect: '가만히 두면 막대 1칸, 흔들면 막대가 높아집니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'more', title: 'get_strength() 는 어떻게 계산할까?', html: '<p>세 축의 값을 <b>피타고라스 정리</b>로 합칩니다.</p><pre><code>strength = √(x² + y² + z²)</code></pre><p>그래서 어느 방향으로 기울이든 가만히 있으면 항상 약 1024(중력 1g) 가 나옵니다. 직접 계산해도 같습니다.</p><pre><code>import math\nx, y, z = accelerometer.get_values()\ns = math.sqrt(x*x + y*y + z*z)</code></pre>' },
          {
            type: 'code', title: '예제 8-7. 충격 감지기', code: `from microbit import *
import music

display.show(Image.ASLEEP)
hits = 0

while True:
    s = accelerometer.get_strength()
    if s > 2500:                     # 세게 흔들리거나 부딪힘
        hits = hits + 1
        display.show(Image.ANGRY)
        music.pitch(1200, 200)
        print("충격!", hits, "회 / 세기", s)
        sleep(500)
        display.show(Image.ASLEEP)
    sleep(30)`,
            hint: '🧭 센서 탭의 <b>흔들기</b> 버튼을 눌러 보세요.',
            desc: '임계값을 넘으면 충격으로 판단합니다. 택배 상자의 충격 기록 장치, 자동차 에어백이 같은 원리로 동작합니다.',
            expect: '세게 흔들면 화난 얼굴과 경고음이 나고 횟수가 기록됩니다.',
            nondeterministic: true
          },
          {
            type: 'table', head: ['메서드', '하는 일'], rows: [
              ['<code>accelerometer.get_x()</code>', 'x 축 값 (좌우 기울기)'],
              ['<code>accelerometer.get_y()</code>', 'y 축 값 (앞뒤 기울기)'],
              ['<code>accelerometer.get_z()</code>', 'z 축 값 (앞면 방향)'],
              ['<code>accelerometer.get_values()</code>', '세 값을 한 번에 <code>(x, y, z)</code> 로'],
              ['<code>accelerometer.get_strength()</code>', '세 축을 합친 크기 (가만히 있으면 ≈ 1024)'],
              ['<code>accelerometer.set_range(g)</code>', '측정 범위를 ±1g · 2g · 4g · 8g 로 (기본 2g)']
            ]
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '가속도 센서는 <b>중력과 움직임</b>을 세 방향(x · y · z)으로 나누어 잽니다.',
              '<b>x</b> = 좌우, <b>y</b> = 앞뒤, <b>z</b> = 앞면 방향. 값은 대략 <b>−1024 ~ 1024</b>, 1024 가 중력 1g.',
              '평평하게 놓으면 <code>(0, 0, −1024)</code> 입니다.',
              '<code>get_values()</code> 로 세 값을 한 번에 받고, <code>scale()</code> 로 화면 좌표로 바꿉니다.',
              '<code>get_strength()</code> 는 세 축을 합친 크기로, <b>흔들림 · 충격</b>을 판단할 때 씁니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 8-1. 기울기 방향 알림판',
            level: 1,
            desc: '<p>보드를 기울인 방향을 <b>글자</b>로 알려 주는 프로그램을 만드세요.</p><ul><li>왼쪽 → <code>L</code>, 오른쪽 → <code>R</code>, 위 → <code>U</code>, 아래 → <code>D</code>, 평평 → <code>-</code></li><li>임계값은 400 으로 하고, 위아래를 먼저 판단합니다</li><li>도전: 대각선도 판단해 보세요 (예: 오른쪽 아래 → <code>Image.ARROW_SE</code>)</li></ul>',
            hint: '<code>if y &lt; -400: … elif y &gt; 400: … elif x &lt; -400: …</code> 순서로 씁니다.',
            starter: 'from microbit import *\n\nwhile True:\n    x = accelerometer.get_x()\n    y = accelerometer.get_y()\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\n\nwhile True:\n    x = accelerometer.get_x()\n    y = accelerometer.get_y()\n\n    if y < -400 and x > 400:\n        display.show(Image.ARROW_NE)\n    elif y < -400 and x < -400:\n        display.show(Image.ARROW_NW)\n    elif y > 400 and x > 400:\n        display.show(Image.ARROW_SE)\n    elif y > 400 and x < -400:\n        display.show(Image.ARROW_SW)\n    elif y < -400:\n        display.show("U")\n    elif y > 400:\n        display.show("D")\n    elif x < -400:\n        display.show("L")\n    elif x > 400:\n        display.show("R")\n    else:\n        display.show("-")\n    sleep(100)\n'
          },
          {
            title: '실습 8-2. 기울기 음량계',
            level: 2,
            desc: '<p>보드를 좌우로 기울이면 <b>소리의 높이</b>가, 앞뒤로 기울이면 <b>소리의 길이</b>가 바뀌는 악기를 만드세요.</p><ul><li>x 축 → 200Hz ~ 1500Hz</li><li>y 축 → 30ms ~ 200ms</li><li>로고를 터치하는 동안만 소리가 납니다</li><li>화면에는 기울기 위치를 점으로 표시합니다</li></ul>',
            hint: '<code>scale()</code> 을 두 번 씁니다. 소리는 <code>music.pitch(hz, ms)</code>.',
            starter: 'from microbit import *\nimport music\n\nwhile True:\n    x = accelerometer.get_x()\n    y = accelerometer.get_y()\n    # TODO\n    sleep(20)\n',
            solution: 'from microbit import *\nimport music\n\nwhile True:\n    x = accelerometer.get_x()\n    y = accelerometer.get_y()\n\n    col = scale(x, from_=(-1024, 1024), to=(0, 4))\n    row = scale(y, from_=(-1024, 1024), to=(0, 4))\n    display.clear()\n    display.set_pixel(col, row, 9)\n\n    if pin_logo.is_touched():\n        hz = scale(x, from_=(-1024, 1024), to=(200, 1500))\n        ms = scale(y, from_=(-1024, 1024), to=(30, 200))\n        music.pitch(hz, ms)\n    sleep(20)\n'
          }
        ],
        quiz: [
          {
            q: 'micro:bit 를 책상에 평평하게(앞면이 위로) 놓으면 값은?', options: ['(0, 0, 0)', '(0, 0, −1024)', '(1024, 1024, 1024)', '(0, −1024, 0)'], answer: 1,
            explain: '중력이 아래로 당기므로 <b>z ≈ −1024</b> 입니다. x 와 y 는 0 에 가깝습니다.'
          },
          {
            q: '보드를 <b>오른쪽</b>으로 기울이면?', options: ['x 가 양수로 커진다', 'x 가 음수로 작아진다', 'y 가 커진다', 'z 가 커진다'], answer: 0,
            explain: '<b>x</b> 축이 좌우를 담당하고, 오른쪽이 <b>+</b> 방향입니다.'
          },
          {
            q: '<code>accelerometer.get_values()</code> 가 돌려주는 것은?', options: ['x 값 하나', '세 값을 담은 <code>(x, y, z)</code>', '흔들림 세기', '제스처 이름'], answer: 1,
            explain: '세 축을 <b>한 번에</b> 튜플로 돌려줍니다. <code>x, y, z = accelerometer.get_values()</code> 처럼 받습니다.'
          },
          {
            q: '가만히 놓아 두었을 때 <code>get_strength()</code> 의 값은 대략?', options: ['0', '약 1024', '약 2048', '약 4096'], answer: 1,
            explain: '중력 1g 가 항상 걸리므로 약 <b>1024</b> 입니다. 흔들면 그보다 커집니다.'
          },
          {
            q: '<code>abs(x) &lt; 60</code> 의 뜻은?', options: ['x 가 60 보다 작다', 'x 가 −60 과 60 사이다', 'x 가 60 이다', '오류'], answer: 1,
            explain: '<code>abs()</code> 는 <b>절댓값</b>입니다. 부호를 떼고 크기만 보므로 “거의 0 에 가깝다” 를 판단할 때 씁니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '가속도 센서 읽기', subtitle: 'Chapter 08 · 움직임', badge: '1교시',
            notes: '<p>실물 보드가 있으면 이 시간이 훨씬 즐겁습니다. 시뮬레이터의 기울기 판으로도 충분히 실습할 수 있습니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'bullets', title: '가속도 센서는 어디에 쓰일까?',
            bullets: ['스마트폰 화면 자동 회전', '만보기 · 스마트워치의 걸음 수', '게임 컨트롤러 · 드론 · 자동차 에어백', 'micro:bit 뒷면의 작은 칩 (MEMS)'],
            notes: '<p><b>발문</b>: "스마트폰을 눕히면 화면이 도는 건 어떻게 알까요?"</p><p>시간: 6분</p>'
          },
          {
            layout: 'diagram', title: '세 개의 축', html: FIG_AXES, caption: 'x = 좌우, y = 앞뒤, z = 앞면 방향',
            notes: '<p>실물 보드를 들고 직접 기울이면서 설명하면 가장 좋습니다. 학생들도 함께 손으로 따라 하게 하세요.</p><p>시간: 10분</p>'
          },
          {
            layout: 'diagram', title: '값의 범위', html: FIG_VALUES, caption: '1024 = 중력 1g · 평평하면 (0, 0, −1024)',
            notes: '<p>"가만히 있는데 왜 z 가 0 이 아닐까?" 라고 물어보면 중력을 자연스럽게 설명할 수 있습니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: '값 읽기', code: 'from microbit import *\n\nwhile True:\n    x, y, z = accelerometer.get_values()\n    print("x =", x, " y =", y, " z =", z)\n    sleep(300)',
            points: ['<code>get_x()</code> · <code>get_y()</code> · <code>get_z()</code>', '<code>get_values()</code> 로 한 번에', '세 값을 한 줄로 받는 문법', '🧭 센서 탭에서 기울여 확인'],
            notes: '<p>학생들이 기울기 판을 끌면서 어떤 축이 어떻게 바뀌는지 스스로 발견하게 하세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '수평계 만들기', code: 'from microbit import *\n\nwhile True:\n    x = accelerometer.get_x()\n    y = accelerometer.get_y()\n\n    col = scale(x, from_=(-1024, 1024), to=(0, 4))\n    row = scale(y, from_=(-1024, 1024), to=(0, 4))\n\n    display.clear()\n    display.set_pixel(2, 2, 2)\n    display.set_pixel(col, row, 9)\n    sleep(50)',
            points: ['기울기 → <code>scale()</code> → 화면 좌표', '건축용 수평계와 같은 원리', '평평하면 점이 가운데', '5장의 scale 을 활용'],
            notes: '<p>실물 수평계(또는 스마트폰 수평계 앱)를 보여 주면 이해가 빠릅니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: 'get_strength() — 흔들림 세기', code: 'from microbit import *\nimport music\n\nwhile True:\n    s = accelerometer.get_strength()\n    if s > 2500:\n        display.show(Image.ANGRY)\n        music.pitch(1200, 200)\n        sleep(500)\n        display.show(Image.ASLEEP)\n    sleep(30)',
            points: ['√(x² + y² + z²)', '가만히 있으면 ≈ <b>1024</b>', '흔들면 2000 ~ 4000', '충격 감지 · 에어백 원리'],
            notes: '<p>피타고라스 정리와 연결하면 수학 시간과 이어집니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'practice', title: '실습 8-1. 기울기 방향 알림판', desc: '기울인 방향을 글자와 화살표로 표시하세요.',
            starter: 'from microbit import *\n\nwhile True:\n    x = accelerometer.get_x()\n    y = accelerometer.get_y()\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\n\nwhile True:\n    x = accelerometer.get_x()\n    y = accelerometer.get_y()\n    if y < -400:\n        display.show(Image.ARROW_N)\n    elif y > 400:\n        display.show(Image.ARROW_S)\n    elif x < -400:\n        display.show(Image.ARROW_W)\n    elif x > 400:\n        display.show(Image.ARROW_E)\n    else:\n        display.show(Image.DIAMOND_SMALL)\n    sleep(100)\n',
            notes: '<p>임계값 400 을 100 이나 800 으로 바꿔 민감도를 비교해 보게 하세요.</p><p>시간: 9분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['x = 좌우, y = 앞뒤, z = 앞면 방향', '범위 −1024 ~ 1024 (1024 = 중력 1g)', '평평 = (0, 0, −1024)', '<code>get_values()</code> · <code>scale()</code> 로 화면에 표시', '<code>get_strength()</code> = 세 축 합친 크기'],
            notes: '<p>다음 시간 예고: 기울기로 조작하는 게임 만들기.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch08-2',
        title: '기울기로 만드는 게임',
        minutes: 45,
        goals: [
          '기울기 값으로 화면 속 물체를 움직일 수 있다',
          '속도와 위치를 변수로 관리해 자연스러운 움직임을 만들 수 있다',
          '벽에 부딪혔을 때의 처리를 구현할 수 있다',
          '목표 · 점수 · 게임 오버가 있는 완성된 게임을 만들 수 있다'
        ],
        flow: [['공 굴리기', 12], ['속도 개념', 12], ['목표와 점수', 12], ['완성하기', 6], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '기울여서 공 굴리기' },
          {
            type: 'code', title: '예제 8-8. 굴러가는 공 (기본)', code: `from microbit import *

x = 2
y = 2

while True:
    # 기울기에 따라 한 칸씩 이동
    ax = accelerometer.get_x()
    ay = accelerometer.get_y()

    if ax > 400:
        x = min(4, x + 1)
    elif ax < -400:
        x = max(0, x - 1)

    if ay > 400:
        y = min(4, y + 1)
    elif ay < -400:
        y = max(0, y - 1)

    display.clear()
    display.set_pixel(x, y, 9)
    sleep(200)`,
            hint: '🧭 센서 탭의 기울기 판을 끌어 공을 움직여 보세요.',
            desc: '기울이면 공이 그 방향으로 <b>한 칸씩</b> 움직입니다. <code>min()</code> · <code>max()</code> 로 화면 밖으로 나가지 않게 막았습니다. 다만 움직임이 뚝뚝 끊어지는 느낌입니다.',
            expect: '기울인 방향으로 점이 한 칸씩 이동합니다.'
          },

          { type: 'h', text: '속도를 넣어 자연스럽게' },
          { type: 'p', html: '진짜 공은 기울이면 <b>점점 빨라집니다</b>. 위치를 직접 바꾸는 대신 <b>속도</b>를 바꾸고, 속도만큼 위치를 옮기면 훨씬 자연스러워집니다.' },
          {
            type: 'figure', html: `<svg viewBox="0 0 1100 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker id="c8m" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="50" y="60" width="240" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="170" y="92" text-anchor="middle" font-size="19" font-weight="bold" fill="var(--fg)">기울기 (가속도)</text>
  <text x="170" y="117" text-anchor="middle" font-size="16" fill="var(--muted)">accelerometer.get_x()</text>
  <line x1="290" y1="95" x2="345" y2="95" stroke="var(--accent)" stroke-width="4" marker-end="url(#c8m)"/>
  <rect x="355" y="60" width="240" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="475" y="92" text-anchor="middle" font-size="19" font-weight="bold" fill="var(--fg)">속도 (vx)</text>
  <text x="475" y="117" text-anchor="middle" font-size="16" fill="var(--muted)">vx = vx + 기울기 / 400</text>
  <line x1="595" y1="95" x2="650" y2="95" stroke="var(--accent)" stroke-width="4" marker-end="url(#c8m)"/>
  <rect x="660" y="60" width="240" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="780" y="92" text-anchor="middle" font-size="19" font-weight="bold" fill="var(--fg)">위치 (px)</text>
  <text x="780" y="117" text-anchor="middle" font-size="16" fill="var(--muted)">px = px + vx</text>
  <text x="550" y="190" text-anchor="middle" font-size="19" fill="var(--fg)">기울이면 <tspan font-weight="bold">속도</tspan>가 쌓이고, 속도만큼 <tspan font-weight="bold">위치</tspan>가 바뀝니다</text>
  <text x="550" y="228" text-anchor="middle" font-size="18" fill="var(--muted)">→ 기울일수록 점점 빨라지는 자연스러운 움직임 (실제 물리와 같은 방식)</text>
</svg>`, caption: '그림 8-3. 가속도 → 속도 → 위치'
          },
          {
            type: 'code', title: '예제 8-9. 굴러가는 공 (속도 적용)', code: `from microbit import *

px = 2.0      # 위치 (소수로)
vx = 0.0      # 속도

while True:
    # 기울기가 속도를 바꾼다
    vx = vx + accelerometer.get_x() / 500
    vx = vx * 0.9                  # 마찰 (조금씩 느려짐)
    px = px + vx                   # 속도만큼 이동

    # 벽에 부딪히면 튕기기
    if px < 0:
        px = 0
        vx = -vx * 0.5
    if px > 4:
        px = 4
        vx = -vx * 0.5

    display.clear()
    display.set_pixel(int(px + 0.5), 2, 9)
    sleep(50)`,
            hint: '🧭 기울기 판을 좌우로 끌면 공이 굴러가고, 평평하게 두면 서서히 멈춥니다.',
            desc: '<b>마찰</b>(<code>vx * 0.9</code>)을 넣어 점점 느려지게 하고, 벽에 부딪히면 <b>반대 방향으로 절반 속도</b>(<code>-vx * 0.5</code>)로 튕기게 했습니다. <code>int(px + 0.5)</code> 는 소수를 <b>반올림</b>해 정수 좌표로 바꾸는 방법입니다.',
            expect: '기울이면 공이 점점 빨라지고, 벽에 튕기며, 평평하면 서서히 멈춥니다.'
          },
          { type: 'callout', kind: 'more', title: '숫자 조절이 게임의 느낌을 만듭니다', html: '<ul><li><code>/ 500</code> — 나누는 수가 <b>작을수록 민감</b>해집니다</li><li><code>* 0.9</code> — 1에 가까울수록 <b>미끄럽고</b>, 작을수록 <b>끈적</b>합니다 (0.98 = 얼음, 0.7 = 모래)</li><li><code>-vx * 0.5</code> — 1에 가까울수록 <b>잘 튀는</b> 공 (0.9 = 고무공, 0.1 = 찰흙)</li></ul><p>게임 개발자들은 이런 숫자를 수십 번 바꿔 가며 “느낌”을 맞춥니다. 직접 바꿔 보세요!</p>' },

          { type: 'h', text: '2차원으로 넓히기' },
          {
            type: 'code', title: '예제 8-10. 2차원 공 굴리기', code: `from microbit import *

px, py = 2.0, 2.0
vx, vy = 0.0, 0.0

while True:
    vx = (vx + accelerometer.get_x() / 500) * 0.9
    vy = (vy + accelerometer.get_y() / 500) * 0.9
    px = px + vx
    py = py + vy

    if px < 0:
        px, vx = 0, -vx * 0.5
    if px > 4:
        px, vx = 4, -vx * 0.5
    if py < 0:
        py, vy = 0, -vy * 0.5
    if py > 4:
        py, vy = 4, -vy * 0.5

    display.clear()
    display.set_pixel(int(px + 0.5), int(py + 0.5), 9)
    sleep(50)`,
            hint: '🧭 기울기 판을 자유롭게 끌어 보세요.',
            desc: 'x 와 y 를 똑같은 방법으로 처리하면 2차원 움직임이 됩니다. <code>px, py = 2.0, 2.0</code> 처럼 <b>두 변수를 한 줄에</b> 만들 수 있습니다.',
            expect: '기울인 방향으로 공이 화면 안을 굴러다닙니다.'
          },

          { type: 'h', text: '목표와 점수 — 게임 완성하기' },
          {
            type: 'code', title: '예제 8-11. 목표 잡기 게임', code: `from microbit import *
import random
import music

px, py = 2.0, 2.0
vx, vy = 0.0, 0.0
gx, gy = random.randint(0, 4), random.randint(0, 4)
score = 0

display.scroll("GO", delay=60)

while True:
    vx = (vx + accelerometer.get_x() / 500) * 0.9
    vy = (vy + accelerometer.get_y() / 500) * 0.9
    px = max(0, min(4, px + vx))
    py = max(0, min(4, py + vy))

    bx, by = int(px + 0.5), int(py + 0.5)

    # 목표에 닿았나?
    if bx == gx and by == gy:
        score = score + 1
        music.pitch(880, 80)
        # 새 목표 (공과 다른 자리에)
        while True:
            gx, gy = random.randint(0, 4), random.randint(0, 4)
            if gx != bx or gy != by:
                break

    display.clear()
    display.set_pixel(gx, gy, 4)     # 목표 (희미하게)
    display.set_pixel(bx, by, 9)     # 공 (밝게)

    if button_a.was_pressed():
        display.scroll("SCORE " + str(score), delay=80)
        score = 0

    sleep(50)`,
            hint: '🧭 기울기 판으로 밝은 점을 희미한 점 위로 옮겨 보세요.',
            desc: '<b>밝기 차이</b>(9 와 4)로 공과 목표를 구분했습니다. 새 목표를 고를 때 공과 겹치지 않도록 <code>while True: … break</code> 로 다시 뽑습니다. A 를 누르면 점수를 보여 주고 다시 시작합니다.',
            expect: '기울여 밝은 점을 희미한 점으로 옮기면 소리가 나고 새 목표가 나타납니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 8-12. 제한 시간 추가', code: `from microbit import *
import random
import music

TIME_LIMIT = 30000        # 30초


def new_goal(bx, by):
    while True:
        gx, gy = random.randint(0, 4), random.randint(0, 4)
        if gx != bx or gy != by:
            return gx, gy


while True:
    display.scroll("30S", delay=60)
    px, py, vx, vy = 2.0, 2.0, 0.0, 0.0
    gx, gy = new_goal(2, 2)
    score = 0
    start = running_time()

    while running_time() - start < TIME_LIMIT:
        vx = (vx + accelerometer.get_x() / 500) * 0.9
        vy = (vy + accelerometer.get_y() / 500) * 0.9
        px = max(0, min(4, px + vx))
        py = max(0, min(4, py + vy))
        bx, by = int(px + 0.5), int(py + 0.5)

        if bx == gx and by == gy:
            score = score + 1
            music.pitch(880, 60)
            gx, gy = new_goal(bx, by)

        display.clear()
        display.set_pixel(gx, gy, 4)
        display.set_pixel(bx, by, 9)
        sleep(50)

    music.play(music.WAWAWAWAA)
    display.scroll("SCORE " + str(score), delay=80)
    display.show(Image.ARROW_E)
    while not button_a.was_pressed():
        sleep(50)`,
            desc: '<code>running_time() - start &lt; TIME_LIMIT</code> 으로 30초 동안만 반복합니다. 목표를 고르는 부분은 <code>new_goal()</code> 함수로 묶어 코드를 정리했습니다. A 를 누르면 새 게임이 시작됩니다.',
            expect: '30초 동안 점수를 쌓고, 끝나면 점수가 흘러갑니다.',
            nondeterministic: true
          },

          { type: 'h', text: '2교시 · 8장 요약' },
          {
            type: 'list', items: [
              '기울기 값으로 화면 속 물체를 움직입니다. <code>min()</code> · <code>max()</code> 로 화면 밖으로 나가지 않게 막습니다.',
              '위치를 직접 바꾸는 대신 <b>가속도 → 속도 → 위치</b> 순서로 처리하면 자연스러운 움직임이 됩니다.',
              '<b>마찰</b>(<code>* 0.9</code>)과 <b>튕김</b>(<code>-vx * 0.5</code>)의 숫자가 게임의 “느낌”을 만듭니다.',
              '밝기 차이(9 와 4)로 여러 물체를 구분해 표시할 수 있습니다.',
              '<code>running_time()</code> 으로 제한 시간을, 변수로 점수를 관리하면 <b>완성된 게임</b>이 됩니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 8-3. 미로 탈출',
            level: 2,
            desc: '<p>벽이 있는 <b>미로</b>를 기울기로 빠져나가는 게임을 만드세요.</p><ul><li>미로는 문자열 리스트로 만듭니다 (아래 시작 코드 참고, <code>1</code> = 벽)</li><li>공은 벽으로는 <b>지나갈 수 없습니다</b></li><li>오른쪽 아래(4, 4)에 도착하면 <code>CLEAR!</code> 와 함께 축하 소리</li><li>벽은 밝기 3, 공은 9 로 표시합니다</li></ul>',
            hint: '이동하기 <b>전에</b> 갈 자리가 벽인지 확인합니다. <code>if MAZE[new_y][new_x] == "0":</code> 일 때만 이동하세요.',
            starter: 'from microbit import *\nimport music\n\nMAZE = ["00100",\n        "00100",\n        "01100",\n        "00000",\n        "01110"]\n\nx, y = 0, 0\n\n\ndef draw():\n    display.clear()\n    for j in range(5):\n        for i in range(5):\n            if MAZE[j][i] == "1":\n                display.set_pixel(i, j, 3)\n    display.set_pixel(x, y, 9)\n\n\nwhile True:\n    draw()\n    # TODO: 기울기로 이동 (벽 확인!)\n    sleep(250)\n',
            solution: 'from microbit import *\nimport music\n\nMAZE = ["00100",\n        "00100",\n        "01100",\n        "00000",\n        "01110"]\n\nx, y = 0, 0\n\n\ndef draw():\n    display.clear()\n    for j in range(5):\n        for i in range(5):\n            if MAZE[j][i] == "1":\n                display.set_pixel(i, j, 3)\n    display.set_pixel(x, y, 9)\n\n\ndef can_go(nx, ny):\n    if nx < 0 or nx > 4 or ny < 0 or ny > 4:\n        return False\n    return MAZE[ny][nx] == "0"\n\n\nwhile True:\n    draw()\n\n    ax = accelerometer.get_x()\n    ay = accelerometer.get_y()\n    nx, ny = x, y\n\n    if ax > 400:\n        nx = x + 1\n    elif ax < -400:\n        nx = x - 1\n    elif ay > 400:\n        ny = y + 1\n    elif ay < -400:\n        ny = y - 1\n\n    if can_go(nx, ny):\n        x, y = nx, ny\n\n    if x == 4 and y == 4:\n        draw()\n        sleep(300)\n        music.play(music.POWER_UP)\n        display.scroll("CLEAR!", delay=70)\n        x, y = 0, 0\n\n    sleep(250)\n'
          },
          {
            title: '실습 8-4. 도전! 걸음 수 세기 (만보기)',
            level: 3,
            desc: '<p>가속도 센서로 <b>걸음 수를 세는 만보기</b>를 만드세요.</p><ol><li><code>get_strength()</code> 를 계속 읽습니다.</li><li>세기가 임계값(예: 1400)을 <b>넘는 순간</b>에만 1 걸음으로 셉니다. (넘어 있는 동안 계속 세면 안 됩니다)</li><li>너무 빨리 반복되지 않도록 한 번 센 뒤 <b>0.3초</b> 쉽니다.</li><li>A 를 누르면 지금까지의 걸음 수를 흘려보냅니다.</li><li>B 를 누르면 0 으로 초기화합니다.</li><li>100 걸음마다 축하 소리를 냅니다.</li></ol>',
            hint: '5장의 채터링 방지와 같은 방법입니다. <code>above</code> 변수로 “직전에 임계값을 넘어 있었는지” 를 기억하세요.',
            starter: 'from microbit import *\nimport music\n\nsteps = 0\nabove = False\nTHRESHOLD = 1400\n\ndisplay.show(Image.STICKFIGURE)\n\nwhile True:\n    s = accelerometer.get_strength()\n    # TODO\n    sleep(30)\n',
            solution: 'from microbit import *\nimport music\n\nsteps = 0\nabove = False\nTHRESHOLD = 1400\n\ndisplay.show(Image.STICKFIGURE)\n\nwhile True:\n    s = accelerometer.get_strength()\n\n    if s > THRESHOLD:\n        if not above:              # 방금 넘었을 때만\n            steps = steps + 1\n            above = True\n            print("걸음:", steps)\n            if steps % 100 == 0:\n                music.play(music.BA_DING)\n            sleep(300)             # 연속 카운트 방지\n    else:\n        above = False\n\n    if button_a.was_pressed():\n        display.scroll(str(steps), delay=80)\n        display.show(Image.STICKFIGURE)\n\n    if button_b.was_pressed():\n        steps = 0\n        display.show(Image.NO)\n        sleep(400)\n        display.show(Image.STICKFIGURE)\n\n    sleep(30)\n'
          }
        ],
        quiz: [
          {
            q: '공이 화면 밖으로 나가지 않게 하려면?', options: ['<code>x = max(0, min(4, x))</code>', '<code>x = x + 1</code>', '<code>x = abs(x)</code>', '막을 수 없다'], answer: 0,
            explain: '<code>min(4, x)</code> 로 4 를 넘지 않게, <code>max(0, …)</code> 로 0 아래로 내려가지 않게 합니다.'
          },
          {
            q: '<code>vx = vx * 0.9</code> 는 무엇을 흉내 낸 것인가요?', options: ['중력', '마찰 (점점 느려짐)', '튕김', '가속'], answer: 1,
            explain: '매번 속도를 90% 로 줄이므로 점점 느려집니다. <b>마찰</b>을 흉내 낸 것입니다. 1 에 가까울수록 미끄럽습니다.'
          },
          {
            q: '<code>vx = -vx * 0.5</code> 는 언제 쓰나요?', options: ['공이 멈출 때', '벽에 부딪혀 튕길 때', '게임이 시작될 때', '점수를 올릴 때'], answer: 1,
            explain: '부호를 뒤집어 <b>반대 방향</b>으로 가게 하고, 0.5 를 곱해 속도를 절반으로 줄입니다 — 튕기면서 힘이 줄어드는 모습입니다.'
          },
          {
            q: '<code>int(px + 0.5)</code> 는 왜 쓰나요?', options: ['소수를 버리려고', '소수를 <b>반올림</b>해 정수 좌표로 바꾸려고', '속도를 계산하려고', '필요 없다'], answer: 1,
            explain: '<code>int()</code> 는 소수점을 <b>버립니다</b>(2.9 → 2). 0.5 를 더한 뒤 버리면 <b>반올림</b>과 같은 효과가 납니다(2.9 → 3).'
          },
          {
            q: '만보기에서 임계값을 넘는 <b>순간</b>에만 세려면?', options: ['<code>if s &gt; 1400:</code> 만 쓰면 된다', '직전 상태를 변수에 기억해 두고 비교한다', '<code>sleep()</code> 을 길게 준다', '불가능하다'], answer: 1,
            explain: '“직전에 넘어 있었는지”를 <code>above</code> 같은 변수에 기억해 두고, <b>아니었다가 넘었을 때</b>만 셉니다. 5장의 채터링 방지와 같은 방법입니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '기울기로 만드는 게임', subtitle: 'Chapter 08 · 움직임', badge: '2교시',
            notes: '<p>게임 제작 시간입니다. 숫자를 바꿔 가며 느낌을 조절하는 경험이 핵심입니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'code', title: '굴러가는 공 (기본)', code: 'from microbit import *\n\nx, y = 2, 2\n\nwhile True:\n    ax = accelerometer.get_x()\n    if ax > 400:\n        x = min(4, x + 1)\n    elif ax < -400:\n        x = max(0, x - 1)\n\n    display.clear()\n    display.set_pixel(x, y, 9)\n    sleep(200)',
            points: ['기울기 → 한 칸씩 이동', '<code>min()</code> · <code>max()</code> 로 화면 안에 가두기', '움직임이 <b>뚝뚝 끊김</b>', '어떻게 부드럽게 만들까?'],
            notes: '<p>일부러 이 어색한 버전을 먼저 보여 준 뒤 속도 개념을 도입하면 효과가 큽니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'diagram', title: '가속도 → 속도 → 위치', html: `<svg viewBox="0 0 1100 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker id="s8m" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  <rect x="50" y="50" width="240" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="170" y="82" text-anchor="middle" font-size="19" font-weight="bold" fill="var(--fg)">기울기 (가속도)</text>
  <text x="170" y="107" text-anchor="middle" font-size="15" fill="var(--muted)">get_x()</text>
  <line x1="290" y1="85" x2="345" y2="85" stroke="var(--accent)" stroke-width="4" marker-end="url(#s8m)"/>
  <rect x="355" y="50" width="240" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="475" y="82" text-anchor="middle" font-size="19" font-weight="bold" fill="var(--fg)">속도 vx</text>
  <text x="475" y="107" text-anchor="middle" font-size="15" fill="var(--muted)">vx += 기울기 / 500</text>
  <line x1="595" y1="85" x2="650" y2="85" stroke="var(--accent)" stroke-width="4" marker-end="url(#s8m)"/>
  <rect x="660" y="50" width="240" height="70" rx="12" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="780" y="82" text-anchor="middle" font-size="19" font-weight="bold" fill="var(--fg)">위치 px</text>
  <text x="780" y="107" text-anchor="middle" font-size="15" fill="var(--muted)">px += vx</text>
  <text x="550" y="170" text-anchor="middle" font-size="19" fill="var(--fg)">기울일수록 속도가 <tspan font-weight="bold">쌓여</tspan> 점점 빨라집니다 — 실제 물리와 같은 방식</text>
</svg>`, caption: '이 구조가 거의 모든 게임 물리의 기본입니다',
            notes: '<p>과학 시간의 "가속도 = 속도의 변화" 와 연결하면 좋습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '속도와 마찰, 튕김', code: 'px, vx = 2.0, 0.0\n\nwhile True:\n    vx = vx + accelerometer.get_x() / 500\n    vx = vx * 0.9              # 마찰\n    px = px + vx\n\n    if px < 0:\n        px, vx = 0, -vx * 0.5  # 튕김\n    if px > 4:\n        px, vx = 4, -vx * 0.5\n\n    display.clear()\n    display.set_pixel(int(px + 0.5), 2, 9)\n    sleep(50)',
            points: ['<code>/ 500</code> — 작을수록 민감', '<code>* 0.9</code> — 1 에 가까울수록 미끄럼', '<code>-vx * 0.5</code> — 1 에 가까울수록 잘 튐', '<code>int(px + 0.5)</code> = 반올림'],
            notes: '<p>세 숫자를 각각 바꿔 보게 하는 것이 이 시간의 핵심 활동입니다. 0.98 (얼음), 0.5 (모래) 등을 시켜 보세요.</p><p>시간: 12분</p>'
          },
          {
            layout: 'code', title: '목표 잡기 게임', code: 'gx, gy = random.randint(0, 4), random.randint(0, 4)\nscore = 0\n\nif bx == gx and by == gy:\n    score += 1\n    music.pitch(880, 80)\n    gx, gy = new_goal(bx, by)\n\ndisplay.clear()\ndisplay.set_pixel(gx, gy, 4)   # 목표 (희미)\ndisplay.set_pixel(bx, by, 9)   # 공 (밝게)',
            points: ['<b>밝기 차이</b>로 물체 구분', '닿으면 점수 + 새 목표', '새 목표는 공과 겹치지 않게', '제한 시간은 <code>running_time()</code>'],
            notes: '<p>밝기를 같게 하면 뭐가 공인지 알 수 없다는 점을 실험으로 보여 주세요.</p><p>시간: 10분</p>'
          },
          {
            layout: 'practice', title: '실습 8-3. 미로 탈출', desc: '벽이 있는 미로를 기울기로 빠져나가세요.',
            starter: 'from microbit import *\n\nMAZE = ["00100", "00100", "01100", "00000", "01110"]\nx, y = 0, 0\n\nwhile True:\n    # TODO\n    sleep(250)\n',
            solution: 'from microbit import *\nimport music\n\nMAZE = ["00100", "00100", "01100", "00000", "01110"]\nx, y = 0, 0\n\n\ndef draw():\n    display.clear()\n    for j in range(5):\n        for i in range(5):\n            if MAZE[j][i] == "1":\n                display.set_pixel(i, j, 3)\n    display.set_pixel(x, y, 9)\n\n\ndef can_go(nx, ny):\n    if nx < 0 or nx > 4 or ny < 0 or ny > 4:\n        return False\n    return MAZE[ny][nx] == "0"\n\n\nwhile True:\n    draw()\n    ax, ay = accelerometer.get_x(), accelerometer.get_y()\n    nx, ny = x, y\n    if ax > 400:\n        nx = x + 1\n    elif ax < -400:\n        nx = x - 1\n    elif ay > 400:\n        ny = y + 1\n    elif ay < -400:\n        ny = y - 1\n    if can_go(nx, ny):\n        x, y = nx, ny\n    if x == 4 and y == 4:\n        music.play(music.POWER_UP)\n        display.scroll("CLEAR!", delay=70)\n        x, y = 0, 0\n    sleep(250)\n',
            notes: '<p>"이동하기 전에 확인한다" 는 순서가 핵심입니다. 학생들이 각자 미로를 설계해 서로 풀어 보게 하면 좋습니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '8장 정리', bullets: ['x = 좌우, y = 앞뒤, z = 앞면 · 1024 = 1g', '<code>get_values()</code> · <code>get_strength()</code>', '가속도 → 속도 → 위치 순서로 처리', '마찰 · 튕김 숫자가 게임의 느낌', '<code>running_time()</code> 으로 제한 시간'],
            notes: '<p>8장 정리. 다음 장 예고: 제스처 — 흔들기 · 뒤집기를 한 줄로 알아내기.</p><p>과제: 미로를 직접 설계해 오기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
