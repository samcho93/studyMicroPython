/* Chapter 07. 난수 — 예측할 수 없는 프로그램
 * 원본: MicroPython on the BBC micro:bit — Random
 */
(function () {
  const FIG_RANDOM = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="36" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">난수 함수 한눈에 보기</text>
  ${[
      ['randint(1, 6)', '1 이상 6 이하의 정수', '3', 'var(--accent)'],
      ['randrange(6)', '0 이상 6 미만의 정수', '4', 'var(--accent2)'],
      ['choice([…])', '목록에서 하나 고르기', "'가위'", 'var(--ok)'],
      ['random()', '0.0 이상 1.0 미만 실수', '0.7261…', 'var(--more)'],
      ['shuffle(리스트)', '목록의 순서를 섞기', '[3,1,2]', 'var(--danger)']
    ].map(([fn, desc, ex, color], i) => {
      const y = 76 + i * 60;
      return `<rect x="80" y="${y}" width="330" height="46" rx="10" fill="var(--code-bg)" stroke="${color}" stroke-width="2.5"/>
  <text x="100" y="${y + 30}" font-size="20" font-family="monospace" fill="${color}">random.${fn}</text>
  <text x="440" y="${y + 30}" font-size="19" fill="var(--fg)">${desc}</text>
  <text x="900" y="${y + 30}" font-size="19" font-family="monospace" fill="var(--muted)">→ ${ex}</text>`;
    }).join('\n  ')}
  <text x="640" y="392" text-anchor="middle" font-size="19" fill="var(--muted)"><tspan font-weight="bold" fill="var(--danger)">주의</tspan>: randint 는 끝 값을 <tspan font-weight="bold">포함</tspan>, randrange 는 <tspan font-weight="bold">포함하지 않습니다</tspan></text>
</svg>`;

  const DICE_SVG = (n) => {
    const dots = { 1: [[2, 2]], 2: [[0, 0], [4, 4]], 3: [[0, 0], [2, 2], [4, 4]], 4: [[0, 0], [4, 0], [0, 4], [4, 4]], 5: [[0, 0], [4, 0], [2, 2], [0, 4], [4, 4]], 6: [[0, 0], [4, 0], [0, 2], [4, 2], [0, 4], [4, 4]] }[n];
    return `<div style="display:inline-block;text-align:center;margin:5px 8px">
    <svg viewBox="0 0 150 150" width="92" height="92"><rect x="0" y="0" width="150" height="150" rx="12" fill="#0e6b64"/>
    ${Array.from({ length: 25 }, (_, i) => {
      const x = i % 5, y = Math.floor(i / 5);
      const on = dots.some(([dx, dy]) => dx === x && dy === y);
      return `<rect x="${18 + x * 26}" y="${16 + y * 26}" width="14" height="20" rx="3" fill="${on ? '#ff2d1a' : '#4a1a16'}"/>`;
    }).join('')}</svg>
    <div style="font-size:13px;color:var(--muted)">${n}</div></div>`;
  };

  MB_COURSE.addChapter({
    id: 'ch07',
    no: '07',
    title: '난수 — 예측할 수 없는 프로그램',
    subtitle: 'random 모듈 · 주사위 · 운세 · 가위바위보',
    summary: '똑같은 결과만 나오는 프로그램은 재미가 없습니다. random 모듈로 무작위 수를 만들어 주사위, 운세, 가위바위보처럼 매번 다른 결과가 나오는 프로그램을 만듭니다. randint · choice · shuffle 의 차이를 익히고, 컴퓨터가 만드는 난수가 사실은 완전한 무작위가 아니라는 점도 알아봅니다.',
    goals: [
      '<code>random.randint()</code> 로 범위 안의 정수를 무작위로 얻을 수 있다',
      '<code>random.choice()</code> 로 목록에서 하나를 무작위로 고를 수 있다',
      '<code>random.shuffle()</code> · <code>random.random()</code> 을 활용할 수 있다',
      '의사난수(pseudo-random)의 개념을 설명할 수 있다',
      '난수를 이용한 작은 게임을 만들 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch07-1',
        title: 'random 모듈 — 무작위 수 만들기',
        minutes: 45,
        goals: [
          '<code>randint</code> · <code>randrange</code> · <code>choice</code> 의 차이를 설명할 수 있다',
          '무작위 수를 이용한 주사위를 만들 수 있다',
          '<code>shuffle</code> 과 <code>random()</code> 을 쓸 수 있다',
          '의사난수와 <code>seed</code> 의 의미를 이해한다'
        ],
        flow: [['난수가 왜 필요할까', 6], ['randint · randrange', 12], ['choice · shuffle', 12], ['주사위 만들기', 12], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '예측할 수 없어야 재미있다' },
          { type: 'p', html: '지금까지 만든 프로그램은 <b>언제나 똑같이</b> 동작했습니다. 같은 코드를 실행하면 같은 결과가 나오지요. 그런데 게임, 주사위, 운세, 뽑기 같은 것은 <b>매번 달라야</b> 재미있습니다.' },
          { type: 'p', html: '이럴 때 쓰는 것이 <b>난수(random number)</b> — 무작위로 만들어지는 수입니다. 파이썬에서는 <code>random</code> 모듈이 담당합니다.' },
          { type: 'figure', html: FIG_RANDOM, caption: '그림 7-1. random 모듈의 주요 함수' },

          { type: 'h', text: 'randint — 범위 안의 정수' },
          {
            type: 'code', repl: true, title: '셸에서 난수 만들어 보기', code: `import random
random.randint(1, 6)
random.randint(1, 6)
random.randint(1, 6)
random.randint(1, 100)`,
            desc: '같은 줄을 여러 번 실행해 보세요. <b>매번 다른 값</b>이 나옵니다. <code>randint(a, b)</code> 는 <b>a 이상 b 이하</b>의 정수를 하나 고릅니다. <b>b 를 포함합니다.</b>',
            expect: '>>> random.randint(1, 6)\n4\n>>> random.randint(1, 6)\n2\n>>> random.randint(1, 6)\n6'
          },
          {
            type: 'code', title: '예제 7-1. 무작위 숫자 보여 주기', code: `from microbit import *
import random

while True:
    if button_a.was_pressed():
        n = random.randint(1, 9)
        display.show(n)
        print("뽑은 수:", n)
    sleep(50)`,
            desc: 'A 를 누를 때마다 1~9 중 하나가 나옵니다. <code>import random</code> 을 잊지 마세요.',
            expect: 'A 를 누를 때마다 다른 숫자가 나타납니다.',
            nondeterministic: true
          },
          {
            type: 'table', head: ['함수', '범위', '예'], rows: [
              ['<code>random.randint(1, 6)</code>', '1, 2, 3, 4, 5, <b>6</b> (끝 포함)', '주사위'],
              ['<code>random.randrange(6)</code>', '0, 1, 2, 3, 4, 5 (<b>6 제외</b>)', '리스트 번호 고르기'],
              ['<code>random.randrange(1, 7)</code>', '1 ~ 6 (7 제외)', '주사위와 같음'],
              ['<code>random.randrange(0, 20, 5)</code>', '0, 5, 10, 15 (5씩 건너뜀)', '단계별 값']
            ], caption: '표 7-1. randint 와 randrange'
          },
          { type: 'callout', kind: 'warn', title: 'randint 와 randrange 의 끝 값', html: '<code>randint(1, 6)</code> 은 <b>6 을 포함</b>하지만, <code>randrange(1, 6)</code> 은 <b>6 을 포함하지 않아</b> 1~5 만 나옵니다. <code>range()</code> 와 같은 규칙이라고 기억하면 쉽습니다. 헷갈리기 쉬운 부분이니 주의하세요.' },

          { type: 'h', text: 'choice — 목록에서 하나 고르기' },
          {
            type: 'code', repl: true, title: '셸에서 choice 써 보기', code: `import random
random.choice([1, 2, 3, 4, 5])
random.choice(["가위", "바위", "보"])
random.choice("ABCDEF")`,
            desc: '<code>choice()</code> 는 리스트나 문자열에서 <b>하나를 무작위로</b> 골라 줍니다. 숫자가 아니어도 됩니다.',
            expect: ">>> random.choice([\"가위\", \"바위\", \"보\"])\n'바위'"
          },
          {
            type: 'code', title: '예제 7-2. 무작위 표정', code: `from microbit import *
import random

faces = [Image.HAPPY, Image.SAD, Image.ANGRY,
         Image.CONFUSED, Image.SURPRISED, Image.ASLEEP,
         Image.SILLY, Image.FABULOUS]

while True:
    display.show(random.choice(faces))
    sleep(600)`,
            desc: '<code>random.choice(faces)</code> 가 8개 표정 중 하나를 골라 줍니다. 리스트에 담아 두면 무작위로 고르기가 아주 쉽습니다.',
            expect: '표정이 0.6초마다 무작위로 바뀝니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 7-3. 무작위 픽셀 반짝임', code: `from microbit import *
import random

display.clear()
while True:
    x = random.randint(0, 4)
    y = random.randint(0, 4)
    b = random.randint(0, 9)
    display.set_pixel(x, y, b)
    sleep(60)`,
            desc: '좌표와 밝기를 모두 무작위로 정하면 별이 반짝이는 듯한 효과가 됩니다. 3장에서 배운 <code>set_pixel</code> 과 난수의 조합입니다.',
            expect: 'LED 가 무작위로 반짝입니다.',
            nondeterministic: true
          },

          { type: 'h', text: 'shuffle 과 random()' },
          {
            type: 'code', repl: true, title: '셸에서 shuffle · random', code: `import random
cards = [1, 2, 3, 4, 5]
random.shuffle(cards)
cards
random.random()
random.random()`,
            desc: '<code>shuffle()</code> 은 리스트의 <b>순서를 뒤섞습니다</b>. 새 리스트를 돌려주는 것이 아니라 <b>원래 리스트 자체를 바꿉니다</b>. <code>random()</code> 은 0.0 이상 1.0 미만의 실수를 돌려줍니다.',
            expect: '>>> cards\n[3, 5, 1, 4, 2]\n>>> random.random()\n0.7261848'
          },
          {
            type: 'code', title: '예제 7-4. 카드 섞어 뽑기', code: `from microbit import *
import random

cards = [Image.HEART, Image.DIAMOND, Image.SQUARE,
         Image.TRIANGLE, Image.TARGET]

while True:
    if button_a.was_pressed():
        random.shuffle(cards)          # 섞기
        for c in cards:                # 순서대로 보여 주기
            display.show(c)
            sleep(500)
        display.clear()
    sleep(50)`,
            desc: '카드를 섞어 차례로 보여 줍니다. 실행할 때마다 순서가 다릅니다.',
            expect: 'A 를 누르면 5장의 카드가 무작위 순서로 나타납니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 7-5. 확률로 판단하기', code: `from microbit import *
import random

# 30% 확률로 별똥별이 떨어지는 밤하늘
display.clear()
while True:
    if random.random() < 0.3:          # 30% 확률
        # 별똥별
        for i in range(5):
            display.clear()
            display.set_pixel(4 - i, i, 9)
            sleep(60)
        display.clear()
    else:
        # 그냥 별 하나 반짝
        display.set_pixel(random.randint(0, 4), random.randint(0, 4), 5)
        sleep(200)
        display.clear()
    sleep(400)`,
            desc: '<code>random.random()</code> 은 0.0 ~ 1.0 사이의 실수를 돌려줍니다. <code>&lt; 0.3</code> 이면 대략 <b>30% 확률</b>이 됩니다. 확률을 다룰 때 아주 유용합니다.',
            expect: '가끔 별똥별이 떨어지는 밤하늘',
            nondeterministic: true
          },

          { type: 'h', text: '주사위 만들기' },
          { type: 'p', html: '주사위 눈 6개를 직접 그려 보겠습니다. 3장에서 배운 <code>Image("…")</code> 를 씁니다.' },
          { type: 'figure', html: `<div style="text-align:center">${[1, 2, 3, 4, 5, 6].map(DICE_SVG).join('')}</div>`, caption: '그림 7-2. 5×5 로 그린 주사위 눈' },
          {
            type: 'code', title: '예제 7-6. 흔드는 주사위', code: `from microbit import *
import random

DICE = [
    Image("00000:00000:00900:00000:00000"),   # 1
    Image("90000:00000:00000:00000:00009"),   # 2
    Image("90000:00000:00900:00000:00009"),   # 3
    Image("90009:00000:00000:00000:90009"),   # 4
    Image("90009:00000:00900:00000:90009"),   # 5
    Image("90009:00000:90009:00000:90009"),   # 6
]

display.show(Image.DIAMOND_SMALL)

while True:
    if button_a.was_pressed():
        # 굴리는 연출
        for i in range(10):
            display.show(random.choice(DICE))
            sleep(70)
        n = random.randint(1, 6)
        display.show(DICE[n - 1])
        print("주사위:", n)
    sleep(50)`,
            desc: '리스트의 번호는 <b>0부터</b> 시작하므로 <code>DICE[n - 1]</code> 로 접근합니다. 굴리는 연출을 넣으면 훨씬 그럴듯합니다.',
            expect: 'A 를 누르면 주사위가 굴러가다 멈춥니다.',
            nondeterministic: true
          },

          { type: 'h', text: '컴퓨터의 난수는 진짜 무작위일까?' },
          { type: 'p', html: '컴퓨터는 사실 <b>완전한 무작위</b>를 만들지 못합니다. 정해진 계산식으로 “무작위처럼 보이는” 수열을 만들 뿐이지요. 이것을 <b>의사난수(pseudo-random)</b> 라고 합니다.' },
          {
            type: 'code', repl: true, title: '셸에서 seed 확인하기', code: `import random
random.seed(42)
random.randint(1, 100)
random.randint(1, 100)
random.seed(42)
random.randint(1, 100)`,
            desc: '<code>seed()</code> 로 <b>시작점</b>을 정하면, 그 뒤 나오는 난수가 <b>언제나 같습니다</b>. 같은 seed 를 주면 같은 수열이 나옵니다.',
            expect: '>>> random.seed(42)\n>>> random.randint(1, 100)\n82\n>>> random.seed(42)\n>>> random.randint(1, 100)\n82'
          },
          { type: 'callout', kind: 'more', title: 'seed 는 어디에 쓸까?', html: '<p>“무작위인데 똑같이 재현되는” 성질은 <b>디버깅</b>과 <b>테스트</b>에 아주 유용합니다. 게임의 버그를 찾을 때 같은 seed 로 같은 상황을 다시 만들 수 있으니까요.</p><p>seed 를 주지 않으면 micro:bit 는 시작할 때의 상태(전원이 켜진 시각 등)를 seed 로 씁니다. 그래서 실행할 때마다 다른 결과가 나옵니다.</p><p>진짜 무작위가 필요한 암호 같은 분야에서는 전자 잡음, 방사성 붕괴 등 <b>물리 현상</b>을 이용한 난수 발생기를 씁니다.</p>' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 정말 고르게 나올까? (분포 확인)', code: `from microbit import *
import random

N = 600
counts = [0, 0, 0, 0, 0, 0]

display.show(Image.ALL_CLOCKS, delay=40)

for i in range(N):
    n = random.randint(1, 6)
    counts[n - 1] = counts[n - 1] + 1

print(N, "번 굴린 결과")
for i in range(6):
    print(" ", i + 1, "→", counts[i], "번 (", counts[i] * 100 // N, "% )")

# 화면에도 막대로 (가장 많이 나온 눈을 기준으로)
top = max(counts)
display.clear()
for i in range(5):
    h = counts[i] * 5 // top
    for y in range(h):
        display.set_pixel(i, 4 - y, 9)`,
            desc: '600번 굴리면 각 눈이 대략 100번씩(약 16%) 나옵니다. 딱 맞지는 않지만 <b>많이 굴릴수록 고르게</b> 가까워집니다 — 이것이 확률의 성질입니다. 숫자를 60으로 줄여 다시 해 보세요.',
            expect: '600 번 굴린 결과\n  1 → 98 번 ( 16 % )\n  2 → 107 번 ( 17 % ) …',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ②. 잘 나오는 것과 드문 것 (가중치)', code: `from microbit import *
import random

# 리스트에 여러 번 넣으면 그만큼 자주 뽑힌다
BAG = ["COMMON"] * 7 + ["RARE"] * 2 + ["LEGEND"] * 1
FACE = {"COMMON": Image.MEH, "RARE": Image.HAPPY, "LEGEND": Image.FABULOUS}

print("주머니:", BAG)
display.show(Image.SQUARE_SMALL)

while True:
    if button_a.was_pressed():
        item = random.choice(BAG)
        display.show(FACE[item])
        display.scroll(item, delay=70)
        print("뽑힘:", item)
        display.show(Image.SQUARE_SMALL)
    sleep(50)`,
            desc: '같은 값을 <b>여러 번 넣어 두면</b> 그만큼 자주 뽑힙니다. 게임의 아이템 뽑기가 이런 식으로 동작합니다. 이 주머니에서 LEGEND 가 나올 확률은 10% 입니다.',
            expect: 'A 를 누를 때마다 COMMON 이 자주, LEGEND 가 드물게 나옵니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. choice 와 shuffle 의 차이', code: `from microbit import *
import random

names = ["A", "B", "C", "D", "E"]

# choice: 같은 것이 또 나올 수 있다
picked = [random.choice(names) for i in range(5)]
print("choice 5번:", picked)

# shuffle: 순서만 섞이고 하나씩 모두 나온다
pool = list(names)
random.shuffle(pool)
print("shuffle 결과:", pool)

display.scroll("".join(pool), delay=90)`,
            desc: '<code>choice</code> 를 5번 하면 <code>[&quot;A&quot;, &quot;C&quot;, &quot;C&quot;, &quot;E&quot;, &quot;A&quot;]</code> 처럼 <b>겹칠 수 있습니다</b>. 제비뽑기처럼 <b>한 번씩만</b> 나와야 한다면 <code>shuffle</code> 을 써야 합니다. <code>"".join(리스트)</code> 는 글자들을 하나의 문자열로 붙입니다.',
            expect: "choice 5번: ['C', 'A', 'C', 'E', 'B']\nshuffle 결과: ['D', 'A', 'E', 'C', 'B']",
            nondeterministic: true
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '<code>import random</code> 이 필요합니다.',
              '<code>random.randint(a, b)</code> — a 이상 <b>b 이하</b>의 정수 (끝 포함)',
              '<code>random.randrange(n)</code> — 0 이상 <b>n 미만</b> (끝 제외)',
              '<code>random.choice(리스트)</code> — 목록에서 하나 고르기',
              '<code>random.shuffle(리스트)</code> — 순서 섞기 (원래 리스트를 바꿈)',
              '<code>random.random()</code> — 0.0 이상 1.0 미만 실수 (확률에 활용)',
              '컴퓨터의 난수는 <b>의사난수</b>입니다. <code>seed()</code> 로 같은 수열을 재현할 수 있습니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 7-1. 랜덤 칭찬 기계',
            level: 1,
            desc: '<p>A 를 누르면 <b>칭찬 메시지</b>를 무작위로 하나 골라 흘려보내는 프로그램을 만드세요.</p><ul><li>메시지 5개 이상을 리스트에 담습니다 (영문)</li><li>메시지와 함께 어울리는 그림도 보여 줍니다</li></ul>',
            hint: '<code>messages = ["GREAT!", "NICE!", "WOW!", "COOL!", "AWESOME!"]</code> 를 만들고 <code>random.choice(messages)</code>.',
            starter: 'from microbit import *\nimport random\n\nmessages = ["GREAT!", "NICE!"]   # TODO: 더 추가\n\nwhile True:\n    if button_a.was_pressed():\n        # TODO\n        pass\n    sleep(50)\n',
            solution: 'from microbit import *\nimport random\n\nmessages = ["GREAT!", "NICE!", "WOW!", "COOL!", "AWESOME!", "SUPER!"]\nfaces = [Image.HAPPY, Image.FABULOUS, Image.SMILE, Image.YES]\n\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    if button_a.was_pressed():\n        display.show(random.choice(faces))\n        sleep(400)\n        display.scroll(random.choice(messages), delay=70)\n        display.show(Image.ASLEEP)\n    sleep(50)\n'
          },
          {
            title: '실습 7-2. 두 개의 주사위',
            level: 2,
            desc: '<p>주사위 <b>두 개</b>를 동시에 굴리는 프로그램을 만드세요.</p><ul><li>A 를 누르면 두 주사위를 굴립니다</li><li>첫 번째 눈 → 1초 → 두 번째 눈 → 1초 → <b>합계</b>를 흘려보냅니다</li><li>합이 7 이면 <code>LUCKY!</code> 와 함께 <code>music.play(music.POWER_UP)</code></li><li>두 눈이 같으면(더블) <code>DOUBLE!</code></li></ul>',
            hint: '<code>a = random.randint(1, 6)</code>, <code>b = random.randint(1, 6)</code> 로 각각 뽑고 <code>a + b</code> 를 계산합니다.',
            starter: 'from microbit import *\nimport random\nimport music\n\nDICE = [\n    Image("00000:00000:00900:00000:00000"),\n    Image("90000:00000:00000:00000:00009"),\n    Image("90000:00000:00900:00000:00009"),\n    Image("90009:00000:00000:00000:90009"),\n    Image("90009:00000:00900:00000:90009"),\n    Image("90009:00000:90009:00000:90009"),\n]\n\nwhile True:\n    if button_a.was_pressed():\n        # TODO\n        pass\n    sleep(50)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\nDICE = [\n    Image("00000:00000:00900:00000:00000"),\n    Image("90000:00000:00000:00000:00009"),\n    Image("90000:00000:00900:00000:00009"),\n    Image("90009:00000:00000:00000:90009"),\n    Image("90009:00000:00900:00000:90009"),\n    Image("90009:00000:90009:00000:90009"),\n]\n\ndisplay.show(Image.DIAMOND_SMALL)\n\nwhile True:\n    if button_a.was_pressed():\n        for i in range(8):\n            display.show(random.choice(DICE))\n            sleep(70)\n\n        a = random.randint(1, 6)\n        b = random.randint(1, 6)\n        display.show(DICE[a - 1])\n        sleep(1000)\n        display.show(DICE[b - 1])\n        sleep(1000)\n\n        total = a + b\n        display.scroll(str(total), delay=80)\n\n        if total == 7:\n            display.scroll("LUCKY!", delay=70)\n            music.play(music.POWER_UP)\n        if a == b:\n            display.scroll("DOUBLE!", delay=70)\n            music.play(music.BA_DING)\n\n        display.show(Image.DIAMOND_SMALL)\n    sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: '<code>random.randint(1, 6)</code> 이 만들 수 있는 값은?', options: ['1 ~ 5', '1 ~ 6', '0 ~ 6', '0 ~ 5'], answer: 1,
            explain: '<code>randint(a, b)</code> 는 <b>b 를 포함</b>해 a 이상 b 이하입니다. 주사위에 딱 맞습니다.'
          },
          {
            q: '<code>random.randrange(6)</code> 이 만들 수 있는 값은?', options: ['1 ~ 6', '0 ~ 6', '0 ~ 5', '1 ~ 5'], answer: 2,
            explain: '<code>randrange(n)</code> 은 <b>n 을 포함하지 않습니다</b>. <code>range()</code> 와 같은 규칙으로 0 ~ 5 입니다.'
          },
          {
            q: '<code>random.shuffle(cards)</code> 를 실행하면?', options: ['섞인 새 리스트를 돌려준다', '<code>cards</code> 자체의 순서가 바뀐다', '리스트에서 하나를 고른다', '오류'], answer: 1,
            explain: '<code>shuffle()</code> 은 <b>원래 리스트 자체</b>를 섞습니다. 돌려주는 값은 없습니다(<code>None</code>).'
          },
          {
            q: '20% 확률로 어떤 일을 하려면?', options: ['<code>if random.random() &lt; 0.2:</code>', '<code>if random.randint(0, 20):</code>', '<code>if random.choice(20):</code>', '<code>if random.random() == 0.2:</code>'], answer: 0,
            explain: '<code>random()</code> 은 0.0~1.0 사이 실수를 고르게 만듭니다. 0.2 보다 작을 확률이 곧 <b>20%</b> 입니다.'
          },
          {
            q: '<code>random.seed(42)</code> 를 실행한 뒤 난수를 뽑으면?', options: ['항상 42 가 나온다', '더 무작위해진다', '같은 seed 를 주면 <b>같은 수열</b>이 나온다', '오류'], answer: 2,
            explain: '컴퓨터 난수는 <b>의사난수</b>라서 시작점(seed)이 같으면 같은 수열이 나옵니다. 디버깅과 테스트에 유용합니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: 'random 모듈 — 무작위 수 만들기', subtitle: 'Chapter 07 · 난수', badge: '1교시',
            notes: '<p>짧고 재미있는 장입니다. 실습 시간을 넉넉히 주세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'bullets', title: '난수가 왜 필요할까?',
            bullets: ['같은 코드 = 같은 결과 → 재미없음', '게임 · 주사위 · 운세 · 뽑기 · 추천', '시뮬레이션 · 암호 · 통계에도 필수', '파이썬: <code>import random</code>'],
            notes: '<p><b>발문</b>: "주변에서 무작위가 쓰이는 곳은?" → 음악 셔플, 게임 아이템, 추첨.</p><p>시간: 5분</p>'
          },
          {
            layout: 'diagram', title: 'random 모듈 함수', html: FIG_RANDOM, caption: 'randint 는 끝 포함, randrange 는 끝 제외',
            notes: '<p>randint 와 randrange 의 차이를 꼭 짚으세요. 시험에도 자주 나오고 실수도 잦습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: 'randint — 범위 안의 정수', code: 'from microbit import *\nimport random\n\nwhile True:\n    if button_a.was_pressed():\n        n = random.randint(1, 9)\n        display.show(n)\n        print("뽑은 수:", n)\n    sleep(50)',
            points: ['<code>randint(1, 6)</code> = 1 ~ <b>6</b> (끝 포함)', '<code>randrange(6)</code> = 0 ~ 5 (끝 제외)', '<code>import random</code> 필수', 'A 를 누를 때마다 다른 값'],
            notes: '<p>학생들에게 여러 번 눌러 보게 하고 같은 수가 연속으로 나올 수도 있다는 점을 짚어 주세요.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: 'choice — 목록에서 고르기', code: 'from microbit import *\nimport random\n\nfaces = [Image.HAPPY, Image.SAD, Image.ANGRY,\n         Image.CONFUSED, Image.SURPRISED, Image.SILLY]\n\nwhile True:\n    display.show(random.choice(faces))\n    sleep(600)',
            points: ['리스트 · 문자열에서 하나 고르기', '숫자가 아니어도 됨', '<code>shuffle()</code> 은 순서 섞기', '<code>random()</code> 은 0.0~1.0 실수'],
            notes: '<p>3장에서 배운 이미지 리스트가 여기서 유용하게 쓰입니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'diagram', title: '주사위 눈 그리기', html: `<div style="text-align:center">${[1, 2, 3, 4, 5, 6].map(DICE_SVG).join('')}</div>`, caption: '3장의 Image("…") 로 직접 그립니다',
            notes: '<p>학생들이 종이에 먼저 그려 보게 한 뒤 코드로 옮기면 좋습니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: '흔드는 주사위', code: 'from microbit import *\nimport random\n\nDICE = [Image("00000:00000:00900:00000:00000"), ...]\n\nwhile True:\n    if button_a.was_pressed():\n        for i in range(10):\n            display.show(random.choice(DICE))\n            sleep(70)\n        n = random.randint(1, 6)\n        display.show(DICE[n - 1])\n    sleep(50)',
            points: ['굴리는 <b>연출</b>이 재미를 만든다', '리스트 번호는 <b>0부터</b> → <code>DICE[n-1]</code>', '9장에서 <b>흔들어</b> 굴리게 바꿀 예정', '두 개로 늘리면 보드게임용'],
            notes: '<p>연출(굴러가는 애니메이션)의 유무를 비교해 보여 주면 "사용자 경험" 이라는 개념을 자연스럽게 배웁니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'bullets', title: '컴퓨터의 난수는 가짜?',
            bullets: ['정해진 계산식으로 만드는 <b>의사난수</b>', '<code>random.seed(42)</code> → 같은 수열 재현', '디버깅 · 테스트에 유용', '진짜 무작위는 물리 현상(잡음)을 이용'],
            notes: '<p>셸에서 seed 를 두 번 주고 같은 값이 나오는 것을 직접 보여 주면 놀라워합니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'practice', title: '실습 7-2. 두 개의 주사위', desc: '두 주사위를 굴려 합계를 보여 주고, 7 이면 LUCKY!',
            starter: 'from microbit import *\nimport random\n\nwhile True:\n    if button_a.was_pressed():\n        # TODO\n        pass\n    sleep(50)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\nDICE = [Image("00000:00000:00900:00000:00000"),\n        Image("90000:00000:00000:00000:00009"),\n        Image("90000:00000:00900:00000:00009"),\n        Image("90009:00000:00000:00000:90009"),\n        Image("90009:00000:00900:00000:90009"),\n        Image("90009:00000:90009:00000:90009")]\n\nwhile True:\n    if button_a.was_pressed():\n        a = random.randint(1, 6)\n        b = random.randint(1, 6)\n        display.show(DICE[a - 1])\n        sleep(1000)\n        display.show(DICE[b - 1])\n        sleep(1000)\n        total = a + b\n        display.scroll(str(total), delay=80)\n        if total == 7:\n            display.scroll("LUCKY!", delay=70)\n            music.play(music.POWER_UP)\n    sleep(50)\n',
            notes: '<p>여유가 있으면 반 전체가 굴려 합계 분포(7 이 가장 많이 나옴)를 세어 보는 통계 활동으로 확장할 수 있습니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['<code>import random</code>', '<code>randint(a, b)</code> 끝 포함 / <code>randrange(n)</code> 끝 제외', '<code>choice(리스트)</code> · <code>shuffle(리스트)</code>', '<code>random()</code> 0.0~1.0 → 확률', '의사난수와 <code>seed()</code>'],
            notes: '<p>다음 시간 예고: 난수로 만드는 작은 게임들.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch07-2',
        title: '난수로 만드는 작은 게임',
        minutes: 45,
        goals: [
          '난수와 조건문을 결합해 게임 규칙을 구현할 수 있다',
          '점수를 기록하고 결과를 판정할 수 있다',
          '<code>while</code> 반복과 <code>break</code> 로 게임 흐름을 만들 수 있다',
          '리스트와 무작위를 활용한 프로그램을 설계할 수 있다'
        ],
        flow: [['가위바위보', 12], ['숫자 맞히기', 14], ['운세 · 뽑기', 10], ['자유 제작', 6], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '가위바위보' },
          {
            type: 'code', title: '예제 7-7. micro:bit 와 가위바위보', code: `from microbit import *
import random

ROCK = Image("00000:09990:09990:09990:00000")
PAPER = Image("99999:90009:90009:90009:99999")
SCISSORS = Image("90009:09090:00900:09090:90009")

HANDS = [ROCK, PAPER, SCISSORS]
NAMES = ["ROCK", "PAPER", "SCISSORS"]

display.scroll("RPS", delay=70)

while True:
    if button_a.was_pressed():
        # 고민하는 연출
        for i in range(6):
            display.show(HANDS[i % 3])
            sleep(120)
        n = random.randint(0, 2)
        display.show(HANDS[n])
        print("micro:bit 는", NAMES[n])
    sleep(50)`,
            desc: '가위바위보 그림 3개를 만들고 무작위로 하나를 고릅니다. <code>i % 3</code> 으로 0, 1, 2 를 순환시켜 고민하는 연출을 넣었습니다.',
            expect: 'A 를 누르면 바위 · 보 · 가위가 돌다가 하나로 멈춥니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 7-8. 승패까지 판정하기', code: `from microbit import *
import random

ROCK, PAPER, SCISSORS = 0, 1, 2
HANDS = [Image("00000:09990:09990:09990:00000"),
         Image("99999:90009:90009:90009:99999"),
         Image("90009:09090:00900:09090:90009")]

my_hand = ROCK
win = 0
lose = 0

display.show(HANDS[my_hand])

while True:
    # A: 내 손 바꾸기
    if button_a.was_pressed():
        my_hand = (my_hand + 1) % 3
        display.show(HANDS[my_hand])

    # B: 대결!
    if button_b.was_pressed():
        bit_hand = random.randint(0, 2)
        for i in range(5):
            display.show(HANDS[i % 3])
            sleep(100)
        display.show(HANDS[bit_hand])
        sleep(800)

        if my_hand == bit_hand:
            display.scroll("DRAW", delay=70)
        elif (my_hand - bit_hand) % 3 == 1:
            win = win + 1
            display.scroll("WIN", delay=70)
        else:
            lose = lose + 1
            display.scroll("LOSE", delay=70)

        print("승", win, "패", lose)
        display.show(HANDS[my_hand])
    sleep(50)`,
            desc: '<b>승패 판정</b>이 핵심입니다. 바위(0)는 가위(2)를 이기고, 보(1)는 바위(0)를, 가위(2)는 보(1)를 이깁니다. <code>(내 손 - 상대 손) % 3 == 1</code> 이면 내가 이깁니다. 나머지 연산으로 세 가지 경우를 한 줄로 처리했습니다.',
            expect: 'A 로 손을 고르고 B 로 대결합니다. 승패가 콘솔에 기록됩니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'more', title: '왜 (a - b) % 3 == 1 일까?', html: '<p>바위=0, 보=1, 가위=2 로 두면 <b>이기는 관계</b>는 다음과 같습니다.</p><ul><li>보(1) 가 바위(0) 를 이김 → 1 − 0 = 1</li><li>가위(2) 가 보(1) 를 이김 → 2 − 1 = 1</li><li>바위(0) 가 가위(2) 를 이김 → 0 − 2 = −2, 그런데 <code>(−2) % 3 = 1</code></li></ul><p>세 경우 모두 <b>나머지가 1</b> 입니다. 순환하는 규칙을 나머지 연산으로 깔끔하게 표현한 예입니다.</p>' },

          { type: 'h', text: '숫자 맞히기 게임' },
          {
            type: 'code', title: '예제 7-9. 업다운 게임', code: `from microbit import *
import random
import music

while True:
    answer = random.randint(1, 20)
    guess = 10
    tries = 0
    display.scroll("1-20", delay=60)
    display.show(guess)

    while True:
        # A: 내리기, B: 올리기
        if button_a.was_pressed():
            guess = max(1, guess - 1)
            display.show(guess)
        if button_b.was_pressed():
            guess = min(20, guess + 1)
            display.show(guess)

        # 로고 터치: 제출!
        if pin_logo.is_touched():
            tries = tries + 1
            if guess == answer:
                display.scroll("OK " + str(tries), delay=70)
                music.play(music.POWER_UP)
                break
            elif guess < answer:
                display.show(Image.ARROW_N)   # 더 위로
                music.pitch(400, 150)
            else:
                display.show(Image.ARROW_S)   # 더 아래로
                music.pitch(300, 150)
            sleep(600)
            display.show(guess)
        sleep(50)

    sleep(1000)`,
            desc: '<b>반복 안의 반복</b>입니다. 안쪽 <code>while True:</code> 는 한 판, 바깥쪽은 게임 전체입니다. 정답을 맞히면 <code>break</code> 로 안쪽 반복만 빠져나와 새 판이 시작됩니다.',
            expect: 'A · B 로 숫자를 고르고 로고를 터치해 제출합니다. 화살표로 위 · 아래를 알려 줍니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'tip', title: 'max() 와 min() 으로 범위 지키기', html: '<code>max(1, guess - 1)</code> 은 “<code>guess - 1</code> 과 1 중 큰 값” 이므로 <b>1 아래로는 내려가지 않습니다</b>. <code>min(20, guess + 1)</code> 은 20 을 넘지 않게 합니다. <code>if</code> 문 여러 줄을 한 줄로 줄이는 좋은 방법입니다.' },

          { type: 'h', text: '운세와 뽑기' },
          {
            type: 'code', title: '예제 7-10. 오늘의 운세', code: `from microbit import *
import random

FORTUNES = [
    ("GREAT DAY", Image.HAPPY),
    ("BE CAREFUL", Image.CONFUSED),
    ("LUCKY", Image.FABULOUS),
    ("STUDY HARD", Image.MEH),
    ("MAKE A FRIEND", Image.HEART),
    ("TRY AGAIN", Image.SAD),
]

display.show(Image.DIAMOND_SMALL)

while True:
    if accelerometer.was_gesture("shake") or button_a.was_pressed():
        display.show(Image.ALL_CLOCKS, delay=60)
        text, face = random.choice(FORTUNES)
        display.show(face)
        sleep(800)
        display.scroll(text, delay=80)
        display.show(Image.DIAMOND_SMALL)
    sleep(50)`,
            hint: '🧭 <b>센서 탭</b>의 <b>흔들기</b> 버튼을 누르거나 A 버튼을 눌러 보세요.',
            desc: '리스트 안에 <b>(글자, 그림) 쌍</b>을 담았습니다. <code>text, face = random.choice(FORTUNES)</code> 처럼 한 번에 두 값을 꺼낼 수 있습니다. <code>was_gesture("shake")</code> 는 9장에서 자세히 배웁니다.',
            expect: '흔들거나 A 를 누르면 오늘의 운세가 나옵니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 7-11. 이름 뽑기 (중복 없이)', code: `from microbit import *
import random

names = ["MIN", "SUA", "JUN", "HA", "YUL", "DOY"]
pool = []

display.scroll("PICK", delay=60)

while True:
    if button_a.was_pressed():
        if not pool:                    # 통이 비었으면 다시 채우기
            pool = list(names)
            random.shuffle(pool)
            display.show(Image.ALL_CLOCKS, delay=50)
        picked = pool.pop()             # 마지막 하나를 꺼낸다
        display.scroll(picked, delay=80)
        print("뽑힘:", picked, "/ 남은 수:", len(pool))
    sleep(50)`,
            desc: '<b>중복 없이</b> 뽑으려면 목록을 섞어 두고 하나씩 꺼냅니다. <code>pool.pop()</code> 은 마지막 항목을 <b>꺼내면서 목록에서 지웁니다</b>. 통이 비면 다시 채웁니다. <code>list(names)</code> 는 원본을 건드리지 않도록 <b>복사본</b>을 만듭니다.',
            expect: 'A 를 누를 때마다 다른 이름이 나오고, 여섯 명이 모두 나오면 다시 섞입니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'warn', title: 'list(names) 로 복사하기', html: '<code>pool = names</code> 라고 쓰면 <b>같은 리스트를 가리키는 다른 이름</b>일 뿐입니다. <code>pool.pop()</code> 을 하면 <code>names</code> 도 함께 줄어듭니다. <code>list(names)</code> 또는 <code>names[:]</code> 로 <b>복사본</b>을 만들어야 원본이 그대로 남습니다.' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 무작위로 걸어 다니는 점', code: `from microbit import *
import random

x, y = 2, 2

while True:
    display.clear()
    display.set_pixel(x, y, 9)

    # 네 방향 중 하나로 한 칸
    dx, dy = random.choice([(1, 0), (-1, 0), (0, 1), (0, -1)])
    x = max(0, min(4, x + dx))
    y = max(0, min(4, y + dy))

    sleep(220)`,
            desc: '매번 <b>네 방향 중 하나</b>를 무작위로 골라 한 칸씩 움직입니다. 이것을 <b>무작위 걷기(random walk)</b> 라고 하며, 분자의 운동이나 주가 변동을 흉내 낼 때 쓰는 모형입니다.',
            expect: '점이 화면 안을 제멋대로 돌아다닙니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ②. 무작위 패턴 만들기', code: `from microbit import *
import random

while True:
    if button_a.was_pressed():
        # 25칸의 밝기를 무작위로 정해 그림 하나를 만든다
        rows = []
        for y in range(5):
            row = ""
            for x in range(5):
                row = row + str(random.choice([0, 0, 0, 5, 9]))
            rows.append(row)

        art = Image(":".join(rows))
        display.show(art)
        print(repr(art))
    sleep(50)`,
            desc: '밝기를 무작위로 골라 그림을 만듭니다. <code>[0, 0, 0, 5, 9]</code> 처럼 0 을 여러 번 넣어 <b>꺼진 칸이 더 많이</b> 나오게 했습니다. 마음에 드는 무늬가 나오면 콘솔의 <code>Image(\'…\')</code> 를 복사해 쓰세요.',
            expect: "Image('00509:90000:00090:05000:00009:')",
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. 동전을 100번 던지면', code: `from microbit import *
import random

display.show(Image.ALL_CLOCKS, delay=40)

heads = 0
streak = 0
best = 0
prev = None

for i in range(100):
    coin = random.choice(["H", "T"])
    if coin == "H":
        heads = heads + 1
    # 같은 면이 몇 번 이어졌나
    streak = streak + 1 if coin == prev else 1
    best = max(best, streak)
    prev = coin

print("앞면:", heads, "/ 뒷면:", 100 - heads)
print("같은 면이 가장 길게 이어진 횟수:", best)
display.scroll("H" + str(heads) + " S" + str(best), delay=80)`,
            desc: '100번 던지면 앞면이 대략 50번쯤 나옵니다. 그런데 <b>같은 면이 5~7번 연속</b>으로 나오는 일도 흔합니다. “무작위인데 왜 몰려서 나오지?” 하는 느낌이 드는 이유입니다.',
            expect: '앞면: 48 / 뒷면: 52\n같은 면이 가장 길게 이어진 횟수: 6',
            nondeterministic: true
          },

          { type: 'h', text: '🚀 응용 예제 — 무작위로 만드는 놀이' },
          { type: 'p', html: '난수와 리스트를 조합하면 교실에서 바로 쓸 수 있는 놀이 도구가 됩니다. 이름과 개수를 우리 반에 맞게 바꿔 보세요.' },
          {
            type: 'code', title: '응용 예제 7-1. 빙고 번호 추첨기', code: `from microbit import *
import random
import music

MAX_NUMBER = 25
pool = []
drawn = []

display.scroll("BINGO", delay=60)
display.show(Image.SQUARE_SMALL)

while True:
    if button_a.was_pressed():
        if not pool:
            pool = list(range(1, MAX_NUMBER + 1))
            random.shuffle(pool)
            drawn = []
            display.scroll("NEW", delay=60)

        n = pool.pop()
        drawn.append(n)

        display.show(Image.ALL_CLOCKS, delay=40)
        display.scroll(str(n), delay=100)
        music.pitch(600 + n * 20, 120)
        print(len(drawn), "번째:", n, "/ 남은 수:", len(pool))
        display.show(Image.SQUARE_SMALL)

    if button_b.was_pressed():
        display.scroll(str(len(drawn)) + "/" + str(MAX_NUMBER), delay=80)
        print("지금까지:", drawn)
        display.show(Image.SQUARE_SMALL)

    if pin_logo.is_touched():
        pool = []
        display.show(Image.NO)
        sleep(500)
        display.show(Image.SQUARE_SMALL)

    sleep(50)`,
            desc: '<b>중복 없이</b> 1~25 를 하나씩 뽑습니다. A 로 뽑고, B 로 지금까지 몇 개 뽑았는지 확인하고, 로고를 만지면 새로 시작합니다. 뽑힌 번호는 콘솔에 모두 기록됩니다.',
            expect: 'A 를 누를 때마다 다른 번호가 나오고, 25개가 모두 나오면 새로 섞입니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 7-2. 돌아가는 룰렛', code: `from microbit import *
import random
import music

# 테두리 16칸을 시계 방향으로
RIM = [(2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3),
       (4, 4), (3, 4), (2, 4), (1, 4), (0, 4), (0, 3),
       (0, 2), (0, 1), (0, 0), (1, 0)]
PRIZE = ["WIN", "LOSE", "AGAIN", "BONUS"]

display.show(Image.DIAMOND)

while True:
    if button_a.was_pressed():
        pos = random.randint(0, len(RIM) - 1)
        speed = 40
        turns = random.randint(20, 34)        # 몇 칸 더 돌지

        for step in range(turns):
            pos = (pos + 1) % len(RIM)
            display.clear()
            display.set_pixel(2, 2, 3)
            x, y = RIM[pos]
            display.set_pixel(x, y, 9)
            music.pitch(900, 15)
            sleep(speed)
            speed = speed + 8                 # 점점 느려진다

        # 멈춘 칸을 4등분해 상품 결정
        prize = PRIZE[pos // 4]
        sleep(400)
        display.scroll(prize, delay=80)
        music.play(music.POWER_UP if prize != "LOSE" else music.WAWAWAWAA)
        display.show(Image.DIAMOND)

    sleep(50)`,
            desc: '<code>speed</code> 를 조금씩 늘려 <b>점점 느려지다 멈추게</b> 했습니다. 이 연출 하나로 훨씬 그럴듯한 룰렛이 됩니다. 멈춘 위치를 4로 나눠 네 가지 상품 중 하나를 정합니다.',
            expect: 'A 를 누르면 점이 테두리를 돌다가 천천히 멈추고 결과가 나옵니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 7-3. 모둠 나누기', code: `from microbit import *
import random

MEMBERS = ["MIN", "SUA", "JUN", "HA", "YUL", "DOY", "NAM", "SOL"]
GROUPS = 2

display.scroll("TEAM", delay=60)
display.show(Image.SQUARE_SMALL)

while True:
    if button_a.was_pressed():
        pool = list(MEMBERS)
        random.shuffle(pool)

        teams = [[] for i in range(GROUPS)]
        for i, name in enumerate(pool):
            teams[i % GROUPS].append(name)      # 돌아가며 한 명씩

        for i, team in enumerate(teams):
            print("모둠", i + 1, ":", team)
            display.scroll(str(i + 1) + " " + " ".join(team), delay=80)
            sleep(400)

        display.show(Image.YES)
        sleep(600)
        display.show(Image.SQUARE_SMALL)

    if button_b.was_pressed():
        GROUPS = GROUPS % 4 + 1                 # 2 → 3 → 4 → 1 → 2
        display.scroll("G" + str(GROUPS), delay=70)
        display.show(Image.SQUARE_SMALL)

    sleep(50)`,
            desc: '이름을 섞은 뒤 <b>번갈아 나눠</b> 인원이 고르게 들어가게 했습니다(<code>i % GROUPS</code>). B 로 모둠 수를 바꿀 수 있습니다. <code>MEMBERS</code> 를 우리 반 이름으로 바꿔 보세요.',
            expect: '모둠 1 : [\'HA\', \'MIN\', \'SOL\', \'JUN\']\n모둠 2 : [\'DOY\', \'YUL\', \'SUA\', \'NAM\']',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 7-4. 별이 쏟아지는 밤하늘', code: `from microbit import *
import random

# 각 칸의 밝기를 직접 관리한다
sky = [[0] * 5 for y in range(5)]

while True:
    # ① 가끔 새 별이 태어난다
    if random.random() < 0.5:
        sky[random.randint(0, 4)][random.randint(0, 4)] = 9

    # ② 모든 별이 조금씩 어두워진다
    for y in range(5):
        for x in range(5):
            if sky[y][x] > 0:
                sky[y][x] = sky[y][x] - 1

    # ③ 화면에 그린다
    for y in range(5):
        for x in range(5):
            display.set_pixel(x, y, sky[y][x])

    # ④ 아주 가끔 별똥별
    if random.random() < 0.08:
        for i in range(5):
            display.clear()
            display.set_pixel(4 - i, i, 9)
            if i > 0:
                display.set_pixel(5 - i, i - 1, 4)
            sleep(50)

    sleep(120)`,
            desc: '<code>[[0] * 5 for y in range(5)]</code> 로 <b>5×5 표</b>를 만들어 각 칸의 밝기를 기억합니다. 별이 무작위로 태어나 서서히 사라지고, 가끔 별똥별이 지나갑니다. 확률 숫자를 바꿔 밤하늘의 분위기를 조절해 보세요.',
            expect: '별이 반짝이다 사라지고, 가끔 별똥별이 지나갑니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 7-5. 숫자 기억 게임', code: `from microbit import *
import random
import music

seq = []
best = 0

display.scroll("MEMORY", delay=60)

while True:
    seq = []
    round_no = 0

    while True:
        # ① 숫자 하나 추가해서 보여 주기
        seq.append(random.randint(0, 9))
        round_no = len(seq)

        display.scroll("R" + str(round_no), delay=60)
        for n in seq:
            display.show(n)
            music.pitch(400 + n * 60, 120)
            sleep(500)
            display.clear()
            sleep(180)

        # ② 따라 입력하기 (A 로 숫자 올리고 B 로 확정)
        ok = True
        for want in seq:
            pick = 0
            display.show(pick)
            while True:
                if button_a.was_pressed():
                    pick = (pick + 1) % 10
                    display.show(pick)
                if button_b.was_pressed():
                    break
                sleep(40)

            if pick != want:
                ok = False
                break
            music.pitch(900, 60)

        if not ok:
            display.show(Image.NO)
            music.play(music.WAWAWAWAA)
            best = max(best, round_no - 1)
            display.scroll("S" + str(round_no - 1) + " B" + str(best), delay=80)
            break

        display.show(Image.YES)
        music.play(music.BA_DING)
        sleep(500)

    sleep(800)`,
            desc: '숫자가 한 개씩 늘어나는 기억력 게임입니다. A 로 숫자를 고르고 B 로 확정합니다. 사람이 한 번에 기억할 수 있는 숫자는 보통 <b>5 ~ 9개</b> 라고 합니다 — 몇 개까지 되는지 도전해 보세요.',
            expect: '숫자가 차례로 보인 뒤 따라 입력하면 다음 라운드로 넘어갑니다.',
            nondeterministic: true
          },

          { type: 'h', text: '2교시 · 7장 요약' },
          {
            type: 'list', items: [
              '난수 + 조건문 = <b>게임 규칙</b>. 리스트에 담아 두면 무작위로 고르기 쉽습니다.',
              '순환하는 규칙(가위바위보 승패)은 <b>나머지 연산(<code>%</code>)</b> 으로 깔끔하게 표현합니다.',
              '<b>반복 안의 반복</b>: 안쪽은 한 판, 바깥쪽은 게임 전체. <code>break</code> 로 안쪽만 빠져나옵니다.',
              '<code>max()</code> · <code>min()</code> 으로 값의 범위를 지킵니다.',
              '중복 없이 뽑으려면 <b>섞어 두고 <code>pop()</code></b> 으로 하나씩 꺼냅니다. 복사본을 쓰세요.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 7-3. 복권 긁기',
            level: 2,
            desc: '<p>A 를 누르면 <b>당첨 여부</b>를 알려 주는 복권을 만드세요.</p><ul><li>10% 확률로 <b>1등</b>: <code>Image.FABULOUS</code> + <code>music.POWER_UP</code> + <code>JACKPOT</code></li><li>30% 확률로 <b>2등</b>: <code>Image.HAPPY</code> + <code>music.BA_DING</code> + <code>WIN</code></li><li>나머지는 <b>꽝</b>: <code>Image.SAD</code> + <code>music.WAWAWAWAA</code></li><li>지금까지 1등이 몇 번 나왔는지 콘솔에 출력</li></ul>',
            hint: '<code>r = random.random()</code> 로 0.0~1.0 을 뽑고 <code>if r &lt; 0.1: … elif r &lt; 0.4: … else: …</code> 순서로 판단합니다. (0.1 = 10%, 0.1~0.4 = 30%)',
            starter: 'from microbit import *\nimport random\nimport music\n\njackpot = 0\n\nwhile True:\n    if button_a.was_pressed():\n        display.show(Image.ALL_CLOCKS, delay=50)\n        r = random.random()\n        # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\njackpot = 0\ntries = 0\ndisplay.show(Image.DIAMOND_SMALL)\n\nwhile True:\n    if button_a.was_pressed():\n        tries = tries + 1\n        display.show(Image.ALL_CLOCKS, delay=50)\n        r = random.random()\n\n        if r < 0.1:\n            jackpot = jackpot + 1\n            display.show(Image.FABULOUS)\n            music.play(music.POWER_UP)\n            display.scroll("JACKPOT", delay=70)\n        elif r < 0.4:\n            display.show(Image.HAPPY)\n            music.play(music.BA_DING)\n            display.scroll("WIN", delay=70)\n        else:\n            display.show(Image.SAD)\n            music.play(music.WAWAWAWAA)\n\n        print(tries, "번 중 1등", jackpot, "번")\n        display.show(Image.DIAMOND_SMALL)\n    sleep(50)\n'
          },
          {
            title: '실습 7-4. 도전! 기억력 게임 (사이먼)',
            level: 3,
            desc: '<p>micro:bit 가 보여 주는 <b>방향 순서를 기억해 따라 하는</b> 게임을 만드세요.</p><ol><li>화살표(위 · 아래 · 왼쪽 · 오른쪽) 중 하나를 무작위로 골라 순서 리스트에 추가합니다.</li><li>순서대로 화살표를 보여 줍니다 (각 0.6초).</li><li>사용자가 <b>기울기</b>로 방향을 입력합니다. (<code>accelerometer.current_gesture()</code> 가 <code>"up"</code>, <code>"down"</code>, <code>"left"</code>, <code>"right"</code>)</li><li>모두 맞히면 순서를 하나 더 늘리고, 틀리면 점수를 보여 주고 처음부터.</li></ol><p><b>힌트</b>: 기울기 대신 A(왼쪽) · B(오른쪽) · 로고(위) 세 가지로 줄여도 좋습니다.</p>',
            hint: '<code>seq = []</code> 에 <code>seq.append(random.choice(["up","down","left","right"]))</code> 로 하나씩 늘립니다. 입력은 <code>g = accelerometer.current_gesture()</code> 가 빈 문자열이 아닐 때까지 기다립니다.',
            starter: 'from microbit import *\nimport random\nimport music\n\nARROWS = {"up": Image.ARROW_N, "down": Image.ARROW_S,\n          "left": Image.ARROW_W, "right": Image.ARROW_E}\nDIRS = ["up", "down", "left", "right"]\n\nwhile True:\n    seq = []\n    # TODO: 한 판 진행\n    sleep(1000)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\nARROWS = {"up": Image.ARROW_N, "down": Image.ARROW_S,\n          "left": Image.ARROW_W, "right": Image.ARROW_E}\nDIRS = ["up", "down", "left", "right"]\n\n\ndef wait_gesture():\n    """평평한 상태로 돌아왔다가 한 방향으로 기울일 때까지 기다린다"""\n    while accelerometer.current_gesture() in DIRS:\n        sleep(50)\n    while True:\n        g = accelerometer.current_gesture()\n        if g in DIRS:\n            return g\n        sleep(50)\n\n\nwhile True:\n    seq = []\n    score = 0\n    display.scroll("GO", delay=60)\n\n    while True:\n        seq.append(random.choice(DIRS))\n\n        # 보여 주기\n        for d in seq:\n            display.show(ARROWS[d])\n            sleep(600)\n            display.clear()\n            sleep(200)\n\n        # 따라 하기\n        ok = True\n        for d in seq:\n            g = wait_gesture()\n            if g != d:\n                ok = False\n                break\n            display.show(Image.YES)\n            music.pitch(880, 100)\n            sleep(200)\n            display.clear()\n\n        if not ok:\n            display.show(Image.NO)\n            music.play(music.WAWAWAWAA)\n            display.scroll("SCORE " + str(score), delay=80)\n            break\n\n        score = len(seq)\n        music.play(music.BA_DING)\n        sleep(400)\n\n    sleep(1000)\n'
          }
        ],
        quiz: [
          {
            q: '가위바위보에서 바위=0, 보=1, 가위=2 일 때 내가 이기는 조건은?', options: ['<code>(내손 - 상대) % 3 == 1</code>', '<code>내손 &gt; 상대</code>', '<code>내손 + 상대 == 3</code>', '<code>내손 == 상대 + 1</code>'], answer: 0,
            explain: '보(1)−바위(0)=1, 가위(2)−보(1)=1, 바위(0)−가위(2)=−2 이고 <code>(−2) % 3 = 1</code> 입니다. 세 경우 모두 나머지가 1 입니다.'
          },
          {
            q: '<code>guess = max(1, guess - 1)</code> 의 효과는?', options: ['guess 가 무조건 1 이 된다', 'guess 를 1 줄이되 1 아래로는 내려가지 않는다', 'guess 를 1 늘린다', '오류'], answer: 1,
            explain: '“<code>guess - 1</code> 과 1 중 <b>큰 값</b>” 이므로 결과는 항상 1 이상입니다. 범위를 지키는 간단한 방법입니다.'
          },
          {
            q: '<b>중복 없이</b> 뽑으려면?', options: ['<code>random.choice()</code> 를 반복한다', '목록을 <code>shuffle()</code> 하고 <code>pop()</code> 으로 하나씩 꺼낸다', '<code>randint()</code> 를 쓴다', '불가능하다'], answer: 1,
            explain: '<code>choice()</code> 는 같은 것이 또 나올 수 있습니다. 섞어 두고 하나씩 꺼내야 중복이 없습니다.'
          },
          {
            q: '<code>pool = names</code> 와 <code>pool = list(names)</code> 의 차이는?', options: ['차이가 없다', '앞은 같은 리스트를 가리키고, 뒤는 복사본을 만든다', '뒤가 더 느리다', '앞은 오류가 난다'], answer: 1,
            explain: '<code>pool = names</code> 는 같은 리스트의 <b>다른 이름</b>일 뿐이라 <code>pop()</code> 하면 원본도 줄어듭니다. <code>list(names)</code> 는 <b>복사본</b>입니다.'
          },
          {
            q: '<code>break</code> 는 무엇을 하나요?', options: ['프로그램을 완전히 끝낸다', '가장 가까운 반복 하나를 빠져나간다', '잠시 멈춘다', '오류를 일으킨다'], answer: 1,
            explain: '<code>break</code> 는 <b>자기를 감싸고 있는 가장 안쪽 반복</b>을 즉시 빠져나갑니다. 바깥 반복은 계속됩니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '난수로 만드는 작은 게임', subtitle: 'Chapter 07 · 난수', badge: '2교시',
            notes: '<p>게임을 만드는 시간입니다. 자유 제작 시간을 10분쯤 남겨 두면 좋습니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'code', title: '가위바위보 — 승패 판정', code: 'ROCK, PAPER, SCISSORS = 0, 1, 2\n\nif my_hand == bit_hand:\n    display.scroll("DRAW")\nelif (my_hand - bit_hand) % 3 == 1:\n    display.scroll("WIN")\nelse:\n    display.scroll("LOSE")',
            points: ['바위=0, 보=1, 가위=2', '보−바위=1, 가위−보=1, 바위−가위=−2', '<code>(−2) % 3 = 1</code>', '순환 규칙 = 나머지 연산'],
            notes: '<p>칠판에 0,1,2 를 원형으로 그리고 화살표로 이기는 방향을 표시하면 직관적입니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'code', title: '업다운 게임', code: 'while True:            # 게임 전체\n    answer = random.randint(1, 20)\n    guess = 10\n\n    while True:        # 한 판\n        if button_a.was_pressed():\n            guess = max(1, guess - 1)\n        if button_b.was_pressed():\n            guess = min(20, guess + 1)\n        if pin_logo.is_touched():\n            if guess == answer:\n                break\n            elif guess < answer:\n                display.show(Image.ARROW_N)\n        sleep(50)',
            points: ['<b>반복 안의 반복</b>', '안쪽 = 한 판 / 바깥 = 게임 전체', '<code>break</code> 는 안쪽만 빠져나감', '<code>max()</code> · <code>min()</code> 으로 범위 지키기'],
            notes: '<p>중첩 반복은 처음에 헷갈립니다. 들여쓰기 깊이를 손으로 짚어 가며 설명하세요.</p><p>시간: 12분</p>'
          },
          {
            layout: 'code', title: '중복 없이 뽑기', code: 'names = ["MIN", "SUA", "JUN", "HA", "YUL"]\npool = []\n\nif not pool:\n    pool = list(names)      # 복사본!\n    random.shuffle(pool)\n\npicked = pool.pop()         # 꺼내면서 지움',
            points: ['<code>choice()</code> 는 중복 가능', '섞어 두고 <code>pop()</code> 으로 하나씩', '<code>list(names)</code> = <b>복사본</b>', '통이 비면 다시 채우기'],
            notes: '<p>학급 번호 뽑기에 바로 쓸 수 있어 실용적입니다. 반 학생 이름으로 바꿔 보게 하세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'practice', title: '실습 7-3. 복권 긁기', desc: '10% 1등, 30% 2등, 나머지 꽝',
            starter: 'from microbit import *\nimport random\nimport music\n\nwhile True:\n    if button_a.was_pressed():\n        r = random.random()\n        # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\nwhile True:\n    if button_a.was_pressed():\n        display.show(Image.ALL_CLOCKS, delay=50)\n        r = random.random()\n        if r < 0.1:\n            display.show(Image.FABULOUS)\n            music.play(music.POWER_UP)\n            display.scroll("JACKPOT", delay=70)\n        elif r < 0.4:\n            display.show(Image.HAPPY)\n            music.play(music.BA_DING)\n        else:\n            display.show(Image.SAD)\n            music.play(music.WAWAWAWAA)\n    sleep(50)\n',
            notes: '<p>확률 구간을 <code>if / elif</code> 로 나누는 방법이 핵심입니다. 실제 확률이 맞는지 100번 돌려 세어 보는 활동으로 확장할 수 있습니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '7장 정리', bullets: ['<code>randint</code> / <code>randrange</code> / <code>choice</code> / <code>shuffle</code> / <code>random()</code>', '난수 + 조건문 = 게임 규칙', '순환 규칙은 <code>%</code> 로', '중첩 반복과 <code>break</code>', '중복 없이 뽑기 = 섞고 <code>pop()</code>'],
            notes: '<p>7장 전체 정리. 다음 장 예고: 움직임 — 보드를 기울이고 흔들어 조작하기.</p><p>과제: 나만의 무작위 게임 만들어 오기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
