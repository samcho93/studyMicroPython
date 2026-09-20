/* Chapter 09. 제스처 — 동작을 알아채기
 * 원본: MicroPython on the BBC micro:bit — Gestures
 */
(function () {
  const GEST = [
    ['up', '위로 기울임', '보드 위쪽을 들어 올림', 'ARROW_N'],
    ['down', '아래로 기울임', '보드 아래쪽을 들어 올림', 'ARROW_S'],
    ['left', '왼쪽으로 기울임', '왼쪽으로 눕힘', 'ARROW_W'],
    ['right', '오른쪽으로 기울임', '오른쪽으로 눕힘', 'ARROW_E'],
    ['face up', '앞면이 위', '책상에 화면이 보이게 놓음', 'HAPPY'],
    ['face down', '앞면이 아래', '엎어 놓음', 'ASLEEP'],
    ['freefall', '자유 낙하', '손에서 놓아 떨어짐', 'SKULL'],
    ['shake', '흔들기', '좌우로 흔듦', 'CONFUSED'],
    ['3g', '3g 충격', '조금 세게 흔듦', 'SURPRISED'],
    ['6g', '6g 충격', '세게 흔듦', 'ANGRY'],
    ['8g', '8g 충격', '아주 세게 흔듦', 'SKULL']
  ];

  const FIG_GEST = `<svg viewBox="0 0 1280 480" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="36" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--fg)">micro:bit 가 알아채는 11가지 제스처</text>
  ${GEST.map(([name, ko, desc], i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = 60 + col * 600, y = 70 + row * 68;
      return `<rect x="${x}" y="${y}" width="560" height="54" rx="10" fill="var(--card)" stroke="var(--line)" stroke-width="2"/>
  <text x="${x + 18}" y="${y + 34}" font-size="20" font-family="monospace" font-weight="bold" fill="var(--accent)">'${name}'</text>
  <text x="${x + 180}" y="${y + 34}" font-size="19" font-weight="bold" fill="var(--fg)">${ko}</text>
  <text x="${x + 320}" y="${y + 34}" font-size="16" fill="var(--muted)">${desc}</text>`;
    }).join('\n  ')}
  <text x="640" y="462" text-anchor="middle" font-size="18" fill="var(--muted)">가속도 값을 직접 비교하지 않아도 <tspan font-weight="bold" fill="var(--fg)">이름 하나</tspan>로 동작을 알 수 있습니다</text>
</svg>`;

  const FIG_COMPARE = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">세 가지 확인 방법</text>
  ${[
      ['current_gesture()', '지금 이 순간의 제스처', '계속 반응해야 할 때\n(기울기로 조종하기)', 'var(--ok)'],
      ['is_gesture(이름)', '지금 그 제스처인가? (True/False)', '특정 동작 하나만 볼 때\n(엎어 놓으면 잠자기)', 'var(--accent)'],
      ['was_gesture(이름)', '지난 확인 이후 그 동작이 있었나?', '한 번만 반응할 때\n(흔들면 주사위)', 'var(--accent2)']
    ].map(([fn, what, when, color], i) => {
      const x = 50 + i * 400;
      return `<rect x="${x}" y="70" width="360" height="250" rx="16" fill="var(--card)" stroke="${color}" stroke-width="3.5"/>
  <text x="${x + 180}" y="112" text-anchor="middle" font-size="20" font-family="monospace" font-weight="bold" fill="${color}">${fn}</text>
  <line x1="${x + 30}" y1="132" x2="${x + 330}" y2="132" stroke="var(--line)" stroke-width="2"/>
  <text x="${x + 180}" y="168" text-anchor="middle" font-size="17" fill="var(--fg)">${what}</text>
  ${when.split('\n').map((t, k) => `<text x="${x + 180}" y="${226 + k * 30}" text-anchor="middle" font-size="17" fill="var(--muted)">${t}</text>`).join('\n  ')}`;
    }).join('\n  ')}
  <text x="640" y="370" text-anchor="middle" font-size="19" fill="var(--fg)">4장의 <tspan font-family="monospace">is_pressed</tspan> / <tspan font-family="monospace">was_pressed</tspan> 와 똑같은 관계입니다</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch09',
    no: '09',
    title: '제스처 — 동작을 알아채기',
    subtitle: 'current_gesture · is_gesture · was_gesture · 마술의 8번 공',
    summary: '가속도 값을 직접 비교하지 않아도, micro:bit 는 흔들기 · 기울이기 · 엎어 놓기 같은 동작을 이름으로 알려 줍니다. 11가지 제스처를 익히고, current_gesture / is_gesture / was_gesture 의 차이를 이해해 흔들어 굴리는 주사위, 마술의 8번 공, 제스처 기록기를 만듭니다.',
    goals: [
      'micro:bit 가 알아채는 11가지 제스처를 말할 수 있다',
      '<code>current_gesture()</code> · <code>is_gesture()</code> · <code>was_gesture()</code> 의 차이를 설명할 수 있다',
      '<code>get_gestures()</code> 로 제스처 기록을 다룰 수 있다',
      '흔들기로 반응하는 프로그램을 만들 수 있다',
      '제스처를 조합한 작은 프로젝트를 완성할 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch09-1',
        title: '제스처 인식하기',
        minutes: 45,
        goals: [
          '제스처가 무엇이고 왜 편리한지 설명할 수 있다',
          '11가지 제스처 이름을 찾아 쓸 수 있다',
          '세 가지 확인 방법의 차이를 이해하고 골라 쓸 수 있다',
          '제스처로 화면을 바꾸는 프로그램을 만들 수 있다'
        ],
        flow: [['제스처란', 8], ['11가지 제스처', 12], ['세 가지 확인 방법', 14], ['실습', 8], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '제스처 — 값 대신 이름으로' },
          { type: 'p', html: '8장에서는 가속도 값을 직접 읽어 <code>if x &gt; 400:</code> 처럼 비교했습니다. 그런데 “흔들었는지”를 판단하려면 세 축을 합쳐 계산하고, 임계값을 정하고, 연속으로 세지 않도록 처리해야 합니다 — 꽤 번거롭지요.' },
          { type: 'p', html: 'micro:bit 는 이런 계산을 <b>대신 해 주고 동작의 이름</b>을 알려 줍니다. 이것을 <b>제스처(gesture)</b> 라고 합니다.' },
          {
            type: 'code', repl: true, title: '셸에서 제스처 확인', code: `accelerometer.current_gesture()
accelerometer.is_gesture("face up")`,
            desc: '🧭 <b>센서 탭</b>에서 <b>흔들기</b>나 <b>앞면 아래</b> 버튼을 누른 뒤 실행해 보세요. 평평하게 두면 <code>\'face up\'</code> 이 나옵니다.',
            expect: ">>> accelerometer.current_gesture()\n'face up'"
          },

          { type: 'h', text: '11가지 제스처' },
          { type: 'figure', html: FIG_GEST, caption: '그림 9-1. micro:bit 가 알아채는 제스처' },
          {
            type: 'table', head: ['이름', '언제 나오나'], rows: GEST.map(([n, ko, desc]) => [`<code>"${n}"</code>`, `<b>${ko}</b> — ${desc}`]),
            caption: '표 9-1. 제스처 이름과 뜻 (문자열이므로 따옴표를 씁니다)'
          },
          { type: 'callout', kind: 'warn', title: '이름은 정확하게', html: '제스처 이름은 <b>문자열</b>이고 <b>모두 소문자</b>입니다. <code>"face up"</code> 처럼 <b>띄어쓰기가 포함된</b> 것도 있습니다. <code>"faceup"</code> 이나 <code>"FACE UP"</code> 은 인식되지 않습니다 — 오류도 나지 않고 그냥 반응하지 않으니 특히 조심하세요.' },
          { type: 'callout', kind: 'more', title: '3g · 6g · 8g 는 무엇일까?', html: '<p><b>g</b> 는 중력가속도의 단위입니다. 1g = 지구 중력, 즉 가만히 있을 때 받는 힘입니다.</p><ul><li><b>3g</b> — 꽤 빠르게 흔들 때</li><li><b>6g</b> — 세게 흔들거나 가볍게 칠 때</li><li><b>8g</b> — 아주 세게 흔들거나 떨어뜨릴 때</li></ul><p>롤러코스터가 4~5g, 전투기 조종사가 견디는 한계가 9g 정도입니다. <code>freefall</code> 은 반대로 <b>0g</b>(무중력) 에 가까울 때 나옵니다 — 떨어지는 동안에는 중력을 느끼지 못하기 때문입니다.</p>' },

          { type: 'h', text: '세 가지 확인 방법' },
          { type: 'figure', html: FIG_COMPARE, caption: '그림 9-2. current_gesture · is_gesture · was_gesture' },
          {
            type: 'code', title: '예제 9-1. current_gesture() — 지금 무슨 동작?', code: `from microbit import *

while True:
    g = accelerometer.current_gesture()
    print("지금:", g)

    if g == "face up":
        display.show(Image.HAPPY)
    elif g == "face down":
        display.show(Image.ASLEEP)
    elif g == "shake":
        display.show(Image.CONFUSED)
    elif g == "left":
        display.show(Image.ARROW_W)
    elif g == "right":
        display.show(Image.ARROW_E)
    else:
        display.show(Image.DIAMOND_SMALL)
    sleep(100)`,
            hint: '🧭 센서 탭의 제스처 버튼들(위로 · 아래로 · 왼쪽 · 오른쪽 · 앞면 위 · 앞면 아래 · 흔들기)을 차례로 눌러 보세요.',
            desc: '<code>current_gesture()</code> 는 <b>지금 이 순간</b>의 제스처 이름을 <b>문자열</b>로 돌려줍니다. 아무 동작도 없으면 빈 문자열(<code>""</code>) 입니다.',
            expect: '지금: face up\n지금: shake …',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 9-2. is_gesture() — 지금 그 동작인가?', code: `from microbit import *

while True:
    if accelerometer.is_gesture("face down"):
        display.off()                  # 엎어 놓으면 화면 끄기(절전)
    else:
        display.on()
        display.show(Image.HEART)
    sleep(200)`,
            hint: '🧭 센서 탭의 <b>앞면 아래</b> 와 <b>앞면 위</b> 버튼을 번갈아 눌러 보세요.',
            desc: '<code>is_gesture(이름)</code> 은 “지금 그 동작인가?” 를 <code>True</code> / <code>False</code> 로 알려 줍니다. 스마트폰을 엎어 놓으면 화면이 꺼지는 것과 같은 기능입니다.',
            expect: '엎어 놓으면 화면이 꺼지고, 바로 놓으면 하트가 보입니다.'
          },
          {
            type: 'code', title: '예제 9-3. was_gesture() — 그 동작이 있었나?', code: `from microbit import *
import random

display.show(Image.DIAMOND_SMALL)

while True:
    if accelerometer.was_gesture("shake"):
        n = random.randint(1, 6)
        display.show(n)
        print("흔들어서 뽑은 수:", n)
    sleep(50)`,
            hint: '🧭 센서 탭의 <b>흔들기</b> 버튼을 눌러 보세요.',
            desc: '<code>was_gesture(이름)</code> 은 4장의 <code>was_pressed()</code> 와 같습니다. 한 번 확인하면 기록이 <b>지워지므로</b>, 계속 흔들어도 <b>한 번만</b> 반응합니다.',
            expect: '흔들 때마다 1~6 중 하나가 나옵니다.',
            nondeterministic: true
          },
          {
            type: 'table', head: ['메서드', '돌려주는 것', '언제 쓰나'], rows: [
              ['<code>current_gesture()</code>', '제스처 <b>이름</b> (문자열)', '여러 동작을 한꺼번에 구분할 때'],
              ['<code>is_gesture(이름)</code>', '<code>True</code> / <code>False</code>', '특정 동작 하나를 계속 감시할 때'],
              ['<code>was_gesture(이름)</code>', '<code>True</code> / <code>False</code> (확인하면 초기화)', '동작 한 번에 한 번만 반응할 때'],
              ['<code>get_gestures()</code>', '지금까지의 제스처 <b>기록 전체</b> (튜플, 확인하면 초기화)', '동작 순서를 분석할 때']
            ]
          },
          {
            type: 'code', title: '예제 9-4. get_gestures() — 기록 보기', code: `from microbit import *

display.show(Image.ARROW_E)

while True:
    if button_a.was_pressed():
        history = accelerometer.get_gestures()
        print("지금까지의 동작:", history)
        display.scroll(str(len(history)), delay=80)
        display.show(Image.ARROW_E)
    sleep(50)`,
            hint: '🧭 센서 탭에서 여러 제스처 버튼을 눌러 동작을 쌓은 뒤, A 를 눌러 기록을 확인하세요.',
            desc: '<code>get_gestures()</code> 는 마지막으로 확인한 뒤 일어난 <b>모든 동작을 순서대로</b> 돌려주고 기록을 비웁니다. 동작의 <b>순서</b>를 봐야 할 때 유용합니다.',
            expect: "지금까지의 동작: ('shake', 'left', 'face down')",
            nondeterministic: true
          },

          { type: 'h', text: '흔들어서 굴리는 주사위' },
          {
            type: 'code', title: '예제 9-5. 흔들어 굴리는 주사위', code: `from microbit import *
import random
import music

DICE = [
    Image("00000:00000:00900:00000:00000"),
    Image("90000:00000:00000:00000:00009"),
    Image("90000:00000:00900:00000:00009"),
    Image("90009:00000:00000:00000:90009"),
    Image("90009:00000:00900:00000:90009"),
    Image("90009:00000:90009:00000:90009"),
]

display.show(Image.DIAMOND_SMALL)

while True:
    if accelerometer.was_gesture("shake"):
        # 굴리는 연출
        for i in range(8):
            display.show(random.choice(DICE))
            music.pitch(random.randint(400, 900), 30)
            sleep(60)
        n = random.randint(1, 6)
        display.show(DICE[n - 1])
        print("주사위:", n)
    sleep(50)`,
            hint: '🧭 센서 탭의 <b>흔들기</b> 버튼을 눌러 보세요.',
            desc: '7장의 버튼 주사위를 <b>흔들어서</b> 굴리도록 바꿨습니다. 실제 주사위처럼 손에 쥐고 흔들면 되니 훨씬 자연스럽습니다.',
            expect: '흔들면 주사위가 굴러가다 멈춥니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'board', title: '실제 보드에서 흔들기', html: '실제 micro:bit 를 손에 쥐고 <b>좌우로 빠르게</b> 흔들면 <code>shake</code> 가 인식됩니다. 너무 살살 흔들면 인식되지 않고, 너무 세게 흔들면 <code>3g</code> · <code>6g</code> 로 인식될 수 있습니다. 건전지 팩을 연결해 USB 없이 흔들어 보면 더 재미있습니다.' },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '<b>제스처</b>는 가속도 값을 micro:bit 가 대신 계산해 <b>동작의 이름</b>으로 알려 주는 것입니다.',
              '11가지: <code>"up"</code> <code>"down"</code> <code>"left"</code> <code>"right"</code> <code>"face up"</code> <code>"face down"</code> <code>"freefall"</code> <code>"shake"</code> <code>"3g"</code> <code>"6g"</code> <code>"8g"</code>',
              '<code>current_gesture()</code> — 지금 무슨 동작인지 <b>이름</b>으로',
              '<code>is_gesture(이름)</code> — 지금 그 동작인가? (계속 감시)',
              '<code>was_gesture(이름)</code> — 그 동작이 있었나? (한 번만 반응, 확인하면 초기화)',
              '<code>get_gestures()</code> — 동작 <b>기록 전체</b>를 순서대로'
            ]
          }
        ],
        practice: [
          {
            title: '실습 9-1. 동작 감지기',
            level: 1,
            desc: '<p>현재 제스처에 따라 <b>다른 그림</b>을 보여 주는 프로그램을 만드세요.</p><ul><li>흔들기 → <code>Image.CONFUSED</code></li><li>위/아래/왼쪽/오른쪽 → 해당 방향 화살표</li><li>앞면 위 → <code>Image.HAPPY</code>, 앞면 아래 → <code>Image.ASLEEP</code></li><li>그 밖 → <code>Image.DIAMOND_SMALL</code></li><li>동시에 콘솔에도 제스처 이름을 출력합니다</li></ul>',
            hint: '<b>딕셔너리</b>를 쓰면 <code>if</code> 를 여러 번 쓰지 않아도 됩니다: <code>FACES = {"shake": Image.CONFUSED, "up": Image.ARROW_N, …}</code> 그리고 <code>FACES.get(g, Image.DIAMOND_SMALL)</code>',
            starter: 'from microbit import *\n\nwhile True:\n    g = accelerometer.current_gesture()\n    print(g)\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\n\nFACES = {\n    "shake": Image.CONFUSED,\n    "up": Image.ARROW_N,\n    "down": Image.ARROW_S,\n    "left": Image.ARROW_W,\n    "right": Image.ARROW_E,\n    "face up": Image.HAPPY,\n    "face down": Image.ASLEEP,\n}\n\nwhile True:\n    g = accelerometer.current_gesture()\n    print(g)\n    display.show(FACES.get(g, Image.DIAMOND_SMALL))\n    sleep(100)\n'
          },
          {
            title: '실습 9-2. 흔들어 뽑는 이름',
            level: 2,
            desc: '<p>흔들면 <b>반 친구 이름</b>을 무작위로 뽑는 프로그램을 만드세요.</p><ul><li>이름은 리스트에 담습니다 (영문 5개 이상)</li><li>흔들면 시계 애니메이션 → 이름 흘려보내기</li><li><b>중복 없이</b> 뽑고, 모두 나오면 <code>DONE</code> 후 다시 채웁니다 (7장 참고)</li><li>엎어 놓으면(<code>face down</code>) 기록이 초기화됩니다</li></ul>',
            hint: '<code>pool = list(names)</code> 로 복사본을 만들고 <code>random.shuffle(pool)</code>, <code>pool.pop()</code> 으로 꺼냅니다.',
            starter: 'from microbit import *\nimport random\n\nnames = ["MIN", "SUA", "JUN", "HA", "YUL"]\npool = []\n\ndisplay.show(Image.DIAMOND_SMALL)\n\nwhile True:\n    if accelerometer.was_gesture("shake"):\n        # TODO\n        pass\n    sleep(50)\n',
            solution: 'from microbit import *\nimport random\n\nnames = ["MIN", "SUA", "JUN", "HA", "YUL"]\npool = []\n\ndisplay.show(Image.DIAMOND_SMALL)\n\nwhile True:\n    if accelerometer.was_gesture("shake"):\n        if not pool:\n            pool = list(names)\n            random.shuffle(pool)\n            display.scroll("NEW", delay=60)\n        display.show(Image.ALL_CLOCKS, delay=50)\n        display.scroll(pool.pop(), delay=80)\n        display.show(Image.DIAMOND_SMALL)\n\n    if accelerometer.is_gesture("face down"):\n        pool = []\n        display.show(Image.NO)\n        sleep(600)\n        display.show(Image.DIAMOND_SMALL)\n\n    sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: '<code>accelerometer.current_gesture()</code> 가 돌려주는 것은?', options: ['숫자', '제스처 이름(문자열)', 'True/False', '세 축의 값'], answer: 1,
            explain: '<code>"shake"</code>, <code>"face up"</code> 같은 <b>문자열</b>을 돌려줍니다. 아무 동작도 없으면 빈 문자열입니다.'
          },
          {
            q: '흔들 때마다 <b>한 번씩만</b> 반응하게 하려면?', options: ['<code>current_gesture()</code>', '<code>is_gesture("shake")</code>', '<code>was_gesture("shake")</code>', '<code>get_gestures()</code>'], answer: 2,
            explain: '<code>was_gesture()</code> 는 확인하면 기록이 지워지므로 한 동작에 한 번만 반응합니다. <code>is_gesture()</code> 를 쓰면 흔드는 동안 계속 반응합니다.'
          },
          {
            q: '보드를 책상에 <b>엎어 놓았을 때</b> 나오는 제스처는?', options: ['<code>"face up"</code>', '<code>"face down"</code>', '<code>"down"</code>', '<code>"freefall"</code>'], answer: 1,
            explain: '화면이 아래를 향하면 <code>"face down"</code> 입니다. <code>"down"</code> 은 보드 아래쪽을 내리는 기울기입니다.'
          },
          {
            q: '<code>accelerometer.is_gesture("FACE UP")</code> 을 실행하면?', options: ['정상 동작한다', '오류가 난다', '오류는 없지만 <b>항상 False</b> 다', '보드가 멈춘다'], answer: 2,
            explain: '제스처 이름은 <b>모두 소문자</b>입니다. 틀린 이름을 주면 오류 없이 그냥 <code>False</code> 가 나와 원인을 찾기 어렵습니다.'
          },
          {
            q: '<code>"freefall"</code> 은 언제 감지되나요?', options: ['세게 흔들 때', '보드가 떨어질 때(무중력에 가까울 때)', '엎어 놓을 때', '버튼을 누를 때'], answer: 1,
            explain: '떨어지는 동안에는 중력을 느끼지 못해 세 축의 합이 <b>0g 에 가까워집니다</b>. 그때 <code>freefall</code> 이 나옵니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '제스처 인식하기', subtitle: 'Chapter 09 · 제스처', badge: '1교시',
            notes: '<p>8장의 가속도 값 비교와 비교하면 얼마나 편리한지 확 드러납니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'bullets', title: '값 비교 vs 제스처',
            bullets: ['8장: <code>if x &gt; 400:</code> — 직접 계산 · 임계값 조절 필요', '9장: <code>was_gesture("shake")</code> — <b>이름 하나</b>로 끝', 'micro:bit 가 대신 계산해 줌', '11가지 동작을 알아챕니다'],
            notes: '<p>8장의 만보기 코드(임계값 · 직전 상태 기억)를 다시 보여 주고 비교하면 효과가 큽니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'diagram', title: '11가지 제스처', html: FIG_GEST, caption: '모두 소문자 문자열 · "face up" 은 띄어쓰기 포함',
            notes: '<p>이름 표기 실수가 가장 흔한 오류입니다. 오류도 나지 않고 그냥 동작하지 않는다는 점을 꼭 경고하세요.</p><p>시간: 9분</p>'
          },
          {
            layout: 'diagram', title: '세 가지 확인 방법', html: FIG_COMPARE, caption: '4장의 is_pressed / was_pressed 와 같은 관계',
            notes: '<p>4장 버튼과 대응시켜 설명하면 금방 이해합니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: 'current_gesture() 로 구분하기', code: 'from microbit import *\n\nwhile True:\n    g = accelerometer.current_gesture()\n\n    if g == "face up":\n        display.show(Image.HAPPY)\n    elif g == "face down":\n        display.show(Image.ASLEEP)\n    elif g == "shake":\n        display.show(Image.CONFUSED)\n    else:\n        display.show(Image.DIAMOND_SMALL)\n    sleep(100)',
            points: ['이름을 문자열로 비교', '빈 문자열 = 아무 동작 없음', '여러 동작을 한꺼번에 구분', '딕셔너리를 쓰면 더 짧게'],
            notes: '<p>센서 탭의 제스처 버튼을 차례로 눌러 보여 주세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '흔들어 굴리는 주사위', code: 'from microbit import *\nimport random\nimport music\n\nwhile True:\n    if accelerometer.was_gesture("shake"):\n        for i in range(8):\n            display.show(random.choice(DICE))\n            music.pitch(random.randint(400, 900), 30)\n            sleep(60)\n        n = random.randint(1, 6)\n        display.show(DICE[n - 1])\n    sleep(50)',
            points: ['7장의 버튼 주사위를 <b>흔들기</b>로', '실제 주사위처럼 자연스러움', '<code>was_gesture</code> 라서 한 번만', '굴리는 소리까지 추가'],
            notes: '<p>실물 보드가 있으면 직접 흔들어 보게 하세요. 가장 반응이 좋은 예제입니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'practice', title: '실습 9-2. 흔들어 뽑는 이름', desc: '흔들면 중복 없이 이름을 하나씩 뽑습니다.',
            starter: 'from microbit import *\nimport random\n\nnames = ["MIN", "SUA", "JUN", "HA", "YUL"]\npool = []\n\nwhile True:\n    if accelerometer.was_gesture("shake"):\n        # TODO\n        pass\n    sleep(50)\n',
            solution: 'from microbit import *\nimport random\n\nnames = ["MIN", "SUA", "JUN", "HA", "YUL"]\npool = []\n\nwhile True:\n    if accelerometer.was_gesture("shake"):\n        if not pool:\n            pool = list(names)\n            random.shuffle(pool)\n        display.show(Image.ALL_CLOCKS, delay=50)\n        display.scroll(pool.pop(), delay=80)\n    sleep(50)\n',
            notes: '<p>실제 반 학생 이름을 넣어 발표자 뽑기에 써 보면 실용적입니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['제스처 = 동작을 <b>이름</b>으로 알려 주는 것', '11가지 · 모두 소문자 문자열', '<code>current_gesture()</code> 이름으로', '<code>is_gesture()</code> 계속 / <code>was_gesture()</code> 한 번만', '<code>get_gestures()</code> 기록 전체'],
            notes: '<p>다음 시간 예고: 제스처로 만드는 마술의 8번 공과 동작 기록기.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch09-2',
        title: '마술의 8번 공과 동작 프로젝트',
        minutes: 45,
        goals: [
          '제스처와 난수를 결합한 프로그램을 만들 수 있다',
          '딕셔너리로 제스처별 동작을 깔끔하게 정리할 수 있다',
          '제스처 순서를 이용한 암호 · 기록 프로그램을 만들 수 있다',
          '여러 기능을 하나의 프로그램에 모을 수 있다'
        ],
        flow: [['마술의 8번 공', 14], ['딕셔너리 활용', 10], ['제스처 암호', 12], ['자유 제작', 6], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '마술의 8번 공 (Magic 8-Ball)' },
          { type: 'p', html: '<b>마술의 8번 공</b>은 미국에서 유래한 장난감입니다. 질문을 한 뒤 공을 흔들면 “그렇다”, “아니다”, “다시 물어보라” 같은 답이 떠오릅니다. micro:bit 로 만들기에 딱 좋은 소재입니다.' },
          {
            type: 'code', title: '예제 9-6. 마술의 8번 공 (기본)', code: `from microbit import *
import random

ANSWERS = [
    "YES",
    "NO",
    "MAYBE",
    "ASK AGAIN",
    "SURE",
    "NO WAY",
    "OF COURSE",
    "I DONT KNOW",
]

display.show(Image.ASLEEP)

while True:
    if accelerometer.was_gesture("shake"):
        display.show(Image.ALL_CLOCKS, delay=60)
        display.scroll(random.choice(ANSWERS), delay=80)
        display.show(Image.ASLEEP)
    sleep(50)`,
            hint: '🧭 센서 탭의 <b>흔들기</b> 버튼을 누르고, 속으로 질문을 해 보세요.',
            desc: '질문을 마음속으로 하고 흔들면 답이 나옵니다. 8장의 복잡한 계산 없이 <code>was_gesture("shake")</code> 한 줄로 끝납니다.',
            expect: '흔들면 무작위 답이 흘러갑니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 9-7. 표정과 소리를 더한 8번 공', code: `from microbit import *
import random
import music

# (답, 그림, 소리) 세 쌍
ANSWERS = [
    ("YES", Image.HAPPY, music.POWER_UP),
    ("SURE", Image.YES, music.BA_DING),
    ("OF COURSE", Image.FABULOUS, music.POWER_UP),
    ("NO", Image.SAD, music.WAWAWAWAA),
    ("NO WAY", Image.NO, music.POWER_DOWN),
    ("MAYBE", Image.CONFUSED, music.BA_DING),
    ("ASK AGAIN", Image.MEH, music.PUNCHLINE),
]

display.show(Image.ASLEEP)

while True:
    if accelerometer.was_gesture("shake"):
        # 생각하는 연출
        for i in range(3):
            display.show(Image.ALL_CLOCKS, delay=50)

        text, face, tune = random.choice(ANSWERS)
        display.show(face)
        music.play(tune)
        sleep(300)
        display.scroll(text, delay=80)
        display.show(Image.ASLEEP)
    sleep(50)`,
            desc: '리스트 안에 <b>세 값을 묶은 튜플</b>을 담았습니다. <code>text, face, tune = random.choice(ANSWERS)</code> 로 한 번에 꺼냅니다. 글자 · 그림 · 소리가 함께 나오니 훨씬 그럴듯합니다.',
            expect: '흔들면 그림 → 소리 → 글자 순서로 답이 나옵니다.',
            nondeterministic: true
          },

          { type: 'h', text: '딕셔너리로 깔끔하게' },
          { type: 'p', html: '<code>if</code> · <code>elif</code> 를 열 번 넘게 쓰다 보면 코드가 길어집니다. <b>딕셔너리(dictionary)</b> 를 쓰면 “이름 → 값” 을 표처럼 적어 둘 수 있습니다.' },
          {
            type: 'code', repl: true, title: '셸에서 딕셔너리 써 보기', code: `d = {"a": 1, "b": 2, "c": 3}
d["b"]
d.get("z", 0)
"a" in d
len(d)`,
            desc: '<b>중괄호</b> <code>{ }</code> 안에 <code>키: 값</code> 을 쉼표로 나열합니다. <code>d["b"]</code> 로 꺼내고, 없는 키를 꺼내면 오류가 나므로 <code>d.get(키, 기본값)</code> 을 쓰면 안전합니다.',
            expect: '>>> d["b"]\n2\n>>> d.get("z", 0)\n0\n>>> "a" in d\nTrue'
          },
          {
            type: 'code', title: '예제 9-8. 제스처 → 그림 딕셔너리', code: `from microbit import *

ACTIONS = {
    "shake": Image.CONFUSED,
    "up": Image.ARROW_N,
    "down": Image.ARROW_S,
    "left": Image.ARROW_W,
    "right": Image.ARROW_E,
    "face up": Image.HAPPY,
    "face down": Image.ASLEEP,
    "freefall": Image.SKULL,
}

while True:
    g = accelerometer.current_gesture()
    display.show(ACTIONS.get(g, Image.DIAMOND_SMALL))
    sleep(100)`,
            hint: '🧭 센서 탭의 제스처 버튼들을 눌러 보세요.',
            desc: '<code>if</code> 여덟 개가 <b>딕셔너리 한 개</b>로 줄었습니다. 새 제스처를 추가할 때도 표에 한 줄만 더하면 됩니다. <code>.get(g, 기본값)</code> 덕분에 목록에 없는 제스처도 안전합니다.',
            expect: '제스처에 맞는 그림이 나타납니다.'
          },
          { type: 'callout', kind: 'more', title: '딕셔너리가 좋은 이유', html: '<ul><li><b>읽기 쉽다</b> — “무엇이 무엇에 대응하는지” 가 표처럼 한눈에 보입니다.</li><li><b>고치기 쉽다</b> — 한 줄 추가 · 삭제로 끝납니다.</li><li><b>빠르다</b> — 항목이 많아져도 찾는 속도가 거의 같습니다.</li></ul><p>“이름 → 값” 관계가 여러 개일 때는 <code>if</code> 대신 딕셔너리를 떠올리세요.</p>' },

          { type: 'h', text: '제스처 암호 — 동작 순서 맞히기' },
          {
            type: 'code', title: '예제 9-9. 제스처 자물쇠', code: `from microbit import *
import music

SECRET = ["left", "right", "shake"]     # 암호: 왼쪽 → 오른쪽 → 흔들기
entered = []

display.show(Image.SQUARE)


def clear_input():
    """입력을 비우고 잠금 표시로"""
    display.show(Image.NO)
    music.pitch(200, 300)
    sleep(500)
    display.show(Image.SQUARE)


while True:
    g = accelerometer.current_gesture()

    if g in SECRET:
        # 같은 동작이 연속으로 쌓이지 않게
        if not entered or entered[-1] != g:
            entered.append(g)
            display.show(len(entered))
            music.pitch(600 + len(entered) * 150, 100)
            sleep(400)
            display.show(Image.SQUARE)

            if len(entered) == len(SECRET):
                if entered == SECRET:
                    display.show(Image.YES)
                    music.play(music.POWER_UP)
                    display.scroll("OPEN", delay=70)
                    display.show(Image.SQUARE)
                else:
                    clear_input()
                entered = []
    sleep(80)`,
            hint: '🧭 센서 탭에서 <b>왼쪽</b> → <b>오른쪽</b> → <b>흔들기</b> 순서로 눌러 보세요.',
            desc: '입력한 동작을 <code>entered</code> 리스트에 쌓고, 길이가 암호와 같아지면 비교합니다. <code>entered[-1]</code> 은 <b>마지막 항목</b>입니다. 리스트끼리는 <code>==</code> 로 통째로 비교할 수 있습니다.',
            expect: '왼쪽 → 오른쪽 → 흔들기 순서를 맞히면 OPEN 이 나옵니다.'
          },
          { type: 'callout', kind: 'tip', title: '리스트의 음수 번호', html: '<code>entered[-1]</code> 은 <b>마지막</b> 항목, <code>entered[-2]</code> 는 뒤에서 두 번째입니다. 길이를 몰라도 뒤에서부터 꺼낼 수 있어 아주 편리합니다.' },
          {
            type: 'code', title: '예제 9-10. 동작 기록기', code: `from microbit import *

log = []

display.show(Image.ARROW_E)

while True:
    g = accelerometer.current_gesture()

    # 동작이 바뀔 때만 기록
    if g and (not log or log[-1] != g):
        log.append(g)
        if len(log) > 20:
            log.pop(0)            # 20개만 유지
        print(len(log), g)

    if button_a.was_pressed():
        display.scroll(str(len(log)), delay=80)
        for g in log:
            print(g)
        display.show(Image.ARROW_E)

    if button_b.was_pressed():
        log = []
        display.show(Image.NO)
        sleep(400)
        display.show(Image.ARROW_E)

    sleep(80)`,
            desc: '동작이 <b>바뀔 때만</b> 기록해 같은 동작이 여러 번 쌓이는 것을 막았습니다. <code>log.pop(0)</code> 은 <b>맨 앞</b>을 꺼내 지웁니다 — 최근 20개만 남기는 방법입니다.',
            expect: '동작이 바뀔 때마다 콘솔에 기록되고, A 로 전체 기록을 봅니다.',
            nondeterministic: true
          },

          { type: 'h', text: '2교시 · 9장 요약' },
          {
            type: 'list', items: [
              '제스처 + 난수 = <b>마술의 8번 공</b> 같은 재미있는 프로그램.',
              '리스트에 <b>여러 값을 묶은 튜플</b>을 담으면 글자 · 그림 · 소리를 한 번에 다룰 수 있습니다.',
              '“이름 → 값” 관계가 많을 때는 <code>if</code> 대신 <b>딕셔너리</b>를 씁니다. <code>.get(키, 기본값)</code> 이 안전합니다.',
              '<code>리스트[-1]</code> 은 마지막 항목, <code>리스트.pop(0)</code> 은 맨 앞을 꺼냅니다.',
              '리스트끼리 <code>==</code> 로 <b>통째로 비교</b>할 수 있어 순서 암호를 쉽게 만들 수 있습니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 9-3. 나만의 운세 공',
            level: 2,
            desc: '<p>마술의 8번 공을 <b>나만의 버전</b>으로 만드세요.</p><ul><li>답을 8개 이상 직접 만듭니다 (영문)</li><li>각 답에 어울리는 그림과 소리를 짝지어 리스트에 담습니다</li><li>엎어 놓으면(<code>face down</code>) 화면을 끄고, 다시 놓으면 켜집니다</li><li>도전: 같은 답이 <b>연속으로</b> 나오지 않게 해 보세요</li></ul>',
            hint: '연속 방지: 직전 답을 <code>last</code> 변수에 기억해 두고, <code>while</code> 로 다른 답이 나올 때까지 다시 뽑습니다.',
            starter: 'from microbit import *\nimport random\nimport music\n\nANSWERS = [\n    ("YES", Image.HAPPY, music.POWER_UP),\n    # TODO: 더 추가\n]\n\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    if accelerometer.was_gesture("shake"):\n        # TODO\n        pass\n    sleep(50)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\nANSWERS = [\n    ("YES", Image.HAPPY, music.POWER_UP),\n    ("SURE", Image.YES, music.BA_DING),\n    ("OF COURSE", Image.FABULOUS, music.POWER_UP),\n    ("GO FOR IT", Image.ARROW_E, music.JUMP_UP),\n    ("NO", Image.SAD, music.WAWAWAWAA),\n    ("NO WAY", Image.NO, music.POWER_DOWN),\n    ("MAYBE", Image.CONFUSED, music.BA_DING),\n    ("ASK AGAIN", Image.MEH, music.PUNCHLINE),\n]\n\nlast = None\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    if accelerometer.is_gesture("face down"):\n        display.off()\n        sleep(200)\n        continue\n    display.on()\n\n    if accelerometer.was_gesture("shake"):\n        for i in range(3):\n            display.show(Image.ALL_CLOCKS, delay=50)\n\n        pick = random.choice(ANSWERS)\n        while pick is last and len(ANSWERS) > 1:\n            pick = random.choice(ANSWERS)\n        last = pick\n\n        text, face, tune = pick\n        display.show(face)\n        music.play(tune)\n        sleep(300)\n        display.scroll(text, delay=80)\n        display.show(Image.ASLEEP)\n    sleep(50)\n'
          },
          {
            title: '실습 9-4. 도전! 흔들어 켜는 만능 도구',
            level: 3,
            desc: '<p>여러 기능을 하나로 모은 <b>만능 도구</b>를 만드세요. 제스처로 기능을 고릅니다.</p><ul><li><code>"left"</code> → <b>주사위</b> 모드: 흔들면 1~6</li><li><code>"right"</code> → <b>동전</b> 모드: 흔들면 앞/뒤 (<code>Image.YES</code> / <code>Image.NO</code>)</li><li><code>"up"</code> → <b>온도계</b> 모드: 온도를 계속 표시</li><li><code>"face down"</code> → <b>절전</b>: 화면 끄기</li><li>모드를 바꿀 때마다 이름을 짧게 흘려보냅니다</li></ul>',
            hint: '<code>mode</code> 변수로 현재 모드를 기억하고, 각 모드의 동작을 <code>def</code> 함수로 나누면 깔끔합니다. 제스처 → 모드 이름은 딕셔너리로.',
            starter: 'from microbit import *\nimport random\n\nMODES = {"left": "DICE", "right": "COIN", "up": "TEMP"}\nmode = "DICE"\n\ndisplay.scroll(mode, delay=60)\n\nwhile True:\n    g = accelerometer.current_gesture()\n    # TODO: 모드 바꾸기 + 모드별 동작\n    sleep(60)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\nMODES = {"left": "DICE", "right": "COIN", "up": "TEMP"}\nDICE = [Image("00000:00000:00900:00000:00000"),\n        Image("90000:00000:00000:00000:00009"),\n        Image("90000:00000:00900:00000:00009"),\n        Image("90009:00000:00000:00000:90009"),\n        Image("90009:00000:00900:00000:90009"),\n        Image("90009:00000:90009:00000:90009")]\n\nmode = "DICE"\ndisplay.scroll(mode, delay=60)\n\nwhile True:\n    g = accelerometer.current_gesture()\n\n    if g == "face down":\n        display.off()\n        sleep(200)\n        continue\n    display.on()\n\n    if g in MODES and MODES[g] != mode:\n        mode = MODES[g]\n        display.scroll(mode, delay=60)\n        music.pitch(880, 80)\n\n    if mode == "TEMP":\n        display.show(str(temperature())[0])\n        sleep(400)\n    elif accelerometer.was_gesture("shake"):\n        if mode == "DICE":\n            for i in range(6):\n                display.show(random.choice(DICE))\n                sleep(70)\n            display.show(DICE[random.randint(0, 5)])\n        elif mode == "COIN":\n            for i in range(6):\n                display.show(random.choice([Image.YES, Image.NO]))\n                sleep(70)\n            display.show(random.choice([Image.YES, Image.NO]))\n        music.pitch(700, 60)\n\n    sleep(60)\n'
          }
        ],
        quiz: [
          {
            q: '<code>d = {"a": 1, "b": 2}</code> 일 때 <code>d.get("z", 0)</code> 의 결과는?', options: ['오류', '<code>0</code>', '<code>None</code>', '<code>"z"</code>'], answer: 1,
            explain: '<code>.get(키, 기본값)</code> 은 키가 없으면 <b>기본값</b>을 돌려줍니다. <code>d["z"]</code> 는 오류가 납니다.'
          },
          {
            q: '<code>entered[-1]</code> 은 무엇인가요?', options: ['첫 번째 항목', '마지막 항목', '오류', '리스트 길이'], answer: 1,
            explain: '음수 번호는 <b>뒤에서부터</b> 셉니다. <code>-1</code> 이 마지막, <code>-2</code> 가 뒤에서 두 번째입니다.'
          },
          {
            q: '<code>log.pop(0)</code> 은?', options: ['맨 앞 항목을 꺼내 지운다', '마지막 항목을 꺼낸다', '0 을 추가한다', '리스트를 비운다'], answer: 0,
            explain: '<code>pop(번호)</code> 는 그 번호의 항목을 <b>꺼내면서 지웁니다</b>. <code>pop(0)</code> 은 맨 앞, <code>pop()</code> 은 마지막입니다.'
          },
          {
            q: '<code>["left", "right"] == ["left", "right"]</code> 의 결과는?', options: ['<code>True</code>', '<code>False</code>', '오류', '알 수 없다'], answer: 0,
            explain: '리스트는 <b>내용과 순서</b>가 모두 같으면 <code>==</code> 가 참입니다. 그래서 순서 암호를 쉽게 비교할 수 있습니다.'
          },
          {
            q: '<code>if</code> · <code>elif</code> 를 10개 넘게 쓰게 될 때 더 나은 방법은?', options: ['그대로 쓴다', '딕셔너리로 “이름 → 값” 표를 만든다', '반복문을 쓴다', '함수로 나눈다'], answer: 1,
            explain: '“이름 → 값” 대응이 많을 때는 <b>딕셔너리</b>가 훨씬 읽기 쉽고 고치기도 편합니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '마술의 8번 공과 동작 프로젝트', subtitle: 'Chapter 09 · 제스처', badge: '2교시',
            notes: '<p>완성도 높은 작품을 만들 수 있는 시간입니다. 발표 시간을 남겨 두세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'code', title: '마술의 8번 공', code: 'from microbit import *\nimport random\n\nANSWERS = ["YES", "NO", "MAYBE", "ASK AGAIN",\n           "SURE", "NO WAY", "OF COURSE"]\n\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    if accelerometer.was_gesture("shake"):\n        display.show(Image.ALL_CLOCKS, delay=60)\n        display.scroll(random.choice(ANSWERS), delay=80)\n        display.show(Image.ASLEEP)\n    sleep(50)',
            points: ['질문 → 흔들기 → 답', '<code>was_gesture</code> + <code>random.choice</code>', '시계 애니메이션으로 <b>연출</b>', '답을 자유롭게 바꾸기'],
            notes: '<p>교사가 먼저 질문하고 흔들어 답을 보여 주면 분위기가 좋아집니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '그림 · 소리를 함께', code: 'ANSWERS = [\n    ("YES", Image.HAPPY, music.POWER_UP),\n    ("NO", Image.SAD, music.WAWAWAWAA),\n    ("MAYBE", Image.CONFUSED, music.BA_DING),\n]\n\ntext, face, tune = random.choice(ANSWERS)\ndisplay.show(face)\nmusic.play(tune)\ndisplay.scroll(text, delay=80)',
            points: ['리스트에 <b>튜플</b>(세 값 묶음)', '한 줄로 세 값 꺼내기', '글자 + 그림 + 소리 = 완성도', '항목을 늘리기도 쉬움'],
            notes: '<p>튜플은 "괄호로 묶은 값들" 정도로 가볍게 소개하면 충분합니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '딕셔너리로 깔끔하게', code: 'ACTIONS = {\n    "shake": Image.CONFUSED,\n    "up": Image.ARROW_N,\n    "down": Image.ARROW_S,\n    "left": Image.ARROW_W,\n    "right": Image.ARROW_E,\n    "face up": Image.HAPPY,\n}\n\nwhile True:\n    g = accelerometer.current_gesture()\n    display.show(ACTIONS.get(g, Image.DIAMOND_SMALL))\n    sleep(100)',
            points: ['<code>{키: 값}</code> = “표”', '<code>if</code> 8개 → 딕셔너리 1개', '<code>.get(키, 기본값)</code> 이 안전', '항목 추가는 한 줄만'],
            notes: '<p>if 버전과 딕셔너리 버전을 나란히 보여 주면 차이가 극명합니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '제스처 자물쇠', code: 'SECRET = ["left", "right", "shake"]\nentered = []\n\nif g in SECRET:\n    if not entered or entered[-1] != g:\n        entered.append(g)\n        if len(entered) == len(SECRET):\n            if entered == SECRET:\n                display.scroll("OPEN")\n            entered = []',
            points: ['입력을 리스트에 <b>쌓기</b>', '<code>entered[-1]</code> = 마지막 항목', '리스트끼리 <code>==</code> 로 통째 비교', '길이가 같아지면 판정'],
            notes: '<p>각자 자기만의 암호를 정해 친구에게 맞혀 보게 하면 재미있습니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'practice', title: '실습 9-3. 나만의 운세 공', desc: '답 8개 이상 · 그림과 소리 · 엎으면 절전 · 연속 답 방지',
            starter: 'from microbit import *\nimport random\nimport music\n\nANSWERS = [("YES", Image.HAPPY, music.POWER_UP)]\n\nwhile True:\n    if accelerometer.was_gesture("shake"):\n        # TODO\n        pass\n    sleep(50)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\nANSWERS = [\n    ("YES", Image.HAPPY, music.POWER_UP),\n    ("SURE", Image.YES, music.BA_DING),\n    ("NO", Image.SAD, music.WAWAWAWAA),\n    ("NO WAY", Image.NO, music.POWER_DOWN),\n    ("MAYBE", Image.CONFUSED, music.BA_DING),\n    ("ASK AGAIN", Image.MEH, music.PUNCHLINE),\n]\nlast = None\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    if accelerometer.is_gesture("face down"):\n        display.off()\n        sleep(200)\n        continue\n    display.on()\n\n    if accelerometer.was_gesture("shake"):\n        pick = random.choice(ANSWERS)\n        while pick is last and len(ANSWERS) > 1:\n            pick = random.choice(ANSWERS)\n        last = pick\n        text, face, tune = pick\n        display.show(face)\n        music.play(tune)\n        display.scroll(text, delay=80)\n        display.show(Image.ASLEEP)\n    sleep(50)\n',
            notes: '<p>완성한 학생들이 서로 질문하며 놀게 하면 자연스럽게 서로의 코드를 보게 됩니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '9장 정리', bullets: ['제스처 11가지 · 소문자 문자열', '<code>current</code> / <code>is</code> / <code>was</code> / <code>get_gestures</code>', '리스트 + 튜플로 글자·그림·소리 묶기', '딕셔너리로 “이름 → 값” 표 만들기', '<code>[-1]</code> · <code>pop(0)</code> · 리스트 <code>==</code> 비교'],
            notes: '<p>9장 정리. 다음 장 예고: 나침반 — 어느 쪽이 북쪽일까?</p><p>과제: 나만의 제스처 프로젝트 만들어 오기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
