/* Chapter 12. 말하기와 소리
 * 원본: MicroPython on the BBC micro:bit — Speech / Audio / Microphone
 */
(function () {
  const FIG_SPEECH = `<svg viewBox="0 0 1280 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">speech.say() 가 말이 되기까지</text>
  ${[['"hello"', '영어 단어', 'var(--accent)'],
    ['HH AH0 L OW1', '발음 기호 (phoneme)', 'var(--accent2)'],
    ['🔊 파형 생성', '목소리 합성', 'var(--ok)'],
    ['스피커 출력', '들리는 소리', 'var(--more)']]
      .map(([a, b, color], i) => {
        const x = 40 + i * 312;
        return `<rect x="${x}" y="90" width="272" height="110" rx="16" fill="var(--card)" stroke="${color}" stroke-width="3.5"/>
  <text x="${x + 136}" y="136" text-anchor="middle" font-size="22" font-family="monospace" font-weight="bold" fill="${color}">${a}</text>
  <text x="${x + 136}" y="172" text-anchor="middle" font-size="17" fill="var(--muted)">${b}</text>` +
          (i < 3 ? `<text x="${x + 288}" y="152" font-size="30" fill="var(--muted)">→</text>` : '');
      }).join('\n  ')}
  <text x="640" y="256" text-anchor="middle" font-size="20" fill="var(--fg)"><tspan font-family="monospace" font-weight="bold">speech.say()</tspan> 는 이 과정을 <tspan font-weight="bold">한 번에</tspan> 처리합니다</text>
  <text x="640" y="294" text-anchor="middle" font-size="20" fill="var(--fg)"><tspan font-family="monospace" font-weight="bold">speech.translate()</tspan> 는 ①→② 까지만, <tspan font-family="monospace" font-weight="bold">speech.pronounce()</tspan> 는 ②→④ 를 합니다</text>
  <text x="640" y="348" text-anchor="middle" font-size="18" fill="var(--danger)">micro:bit 의 음성 합성은 <tspan font-weight="bold">영어</tspan>만 지원합니다 (1980년대 로봇 목소리 방식)</text>
</svg>`;

  const FIG_PARAMS = `<svg viewBox="0 0 1280 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="32" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--fg)">목소리를 바꾸는 네 가지 값 (0 ~ 255)</text>
  ${[['pitch', '음 높이', '기본 64', '작을수록 높은 목소리', 'var(--accent)'],
    ['speed', '말하는 속도', '기본 72', '작을수록 빠름', 'var(--ok)'],
    ['mouth', '입 크기', '기본 128', '클수록 또렷함', 'var(--accent2)'],
    ['throat', '목의 울림', '기본 128', '클수록 굵은 목소리', 'var(--more)']]
      .map(([n, ko, def, desc, color], i) => {
        const x = 40 + i * 312;
        return `<rect x="${x}" y="66" width="272" height="150" rx="14" fill="var(--card)" stroke="${color}" stroke-width="3"/>
  <text x="${x + 136}" y="106" text-anchor="middle" font-size="23" font-family="monospace" font-weight="bold" fill="${color}">${n}</text>
  <text x="${x + 136}" y="140" text-anchor="middle" font-size="19" font-weight="bold" fill="var(--fg)">${ko}</text>
  <text x="${x + 136}" y="170" text-anchor="middle" font-size="17" fill="var(--muted)">${def}</text>
  <text x="${x + 136}" y="198" text-anchor="middle" font-size="16" fill="var(--muted)">${desc}</text>`;
      }).join('\n  ')}
  <text x="640" y="262" text-anchor="middle" font-size="19" font-family="monospace" fill="var(--fg)">speech.say("hello", pitch=100, speed=120, mouth=200, throat=100)</text>
  <text x="640" y="290" text-anchor="middle" font-size="17" fill="var(--muted)">값을 바꿔 가며 로봇 · 외계인 · 할아버지 목소리를 만들어 보세요</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch12',
    no: '12',
    title: '말하기와 소리',
    subtitle: 'speech · audio · 마이크 · 스피커',
    summary: 'micro:bit 가 말을 합니다. speech 모듈로 영어 문장을 읽게 하고, 발음 기호를 직접 다뤄 노래도 부르게 합니다. V2 의 내장 효과음(audio 모듈)과 마이크(microphone)로 소리를 듣고 반응하는 프로그램까지 만들어, 소리를 주고받는 장치를 완성합니다.',
    goals: [
      '<code>speech.say()</code> 로 영어 문장을 말하게 할 수 있다',
      '<code>pitch</code> · <code>speed</code> · <code>mouth</code> · <code>throat</code> 로 목소리를 바꿀 수 있다',
      '<code>translate()</code> 와 <code>pronounce()</code> 의 관계를 설명할 수 있다',
      '<code>audio.play()</code> 로 내장 효과음을 재생할 수 있다',
      '<code>microphone</code> 으로 소리 크기를 읽고 반응할 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch12-1',
        title: 'speech — micro:bit 가 말을 한다',
        minutes: 45,
        goals: [
          '<code>speech.say()</code> 로 문장을 말하게 할 수 있다',
          '네 가지 목소리 파라미터를 조절할 수 있다',
          '<code>translate()</code> 로 발음 기호를 확인할 수 있다',
          '<code>pronounce()</code> · <code>sing()</code> 을 쓸 수 있다'
        ],
        flow: [['음성 합성이란', 8], ['say 기본', 12], ['목소리 바꾸기', 12], ['pronounce · sing', 10], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '컴퓨터가 말을 한다는 것' },
          { type: 'p', html: '내비게이션, 스마트 스피커, 지하철 안내 방송 — 컴퓨터가 말하는 것을 <b>음성 합성(speech synthesis)</b> 이라고 합니다. 요즘은 진짜 사람 목소리와 구분하기 어려울 정도지만, micro:bit 는 메모리가 작아 <b>1980년대 방식</b>의 로봇 같은 목소리를 씁니다.' },
          { type: 'p', html: 'micro:bit 의 <code>speech</code> 모듈은 1980년대 애플 II 컴퓨터에서 쓰이던 <b>SAM</b>(Software Automatic Mouth) 이라는 프로그램을 옮겨 온 것입니다. 용량이 아주 작아 micro:bit 에서도 돌아갑니다.' },
          { type: 'figure', html: FIG_SPEECH, caption: '그림 12-1. 글자가 소리가 되기까지' },
          { type: 'callout', kind: 'warn', title: '영어만 됩니다', html: 'micro:bit 의 음성 합성은 <b>영어 발음 규칙</b>만 알고 있습니다. 한글을 넣으면 소리가 나지 않거나 이상하게 들립니다. 한국어를 말하게 하고 싶다면 영어 철자로 비슷하게 적어 보세요 — 예: <code>speech.say("an nyeong ha se yo")</code>' },

          { type: 'h', text: 'speech.say() — 말하게 하기' },
          {
            type: 'code', title: '예제 12-1. 첫 말하기', code: `from microbit import *
import speech

display.show(Image.HAPPY)
speech.say("Hello, I am a micro bit")
sleep(500)
speech.say("Nice to meet you")
display.clear()`,
            desc: '<code>import speech</code> 가 필요합니다. <b>브라우저 음량을 켜 두세요.</b> 실제 micro:bit V2 는 내장 스피커로, V1 은 P0 에 이어폰을 연결해야 들립니다.',
            expect: '“Hello, I am a micro bit” 와 “Nice to meet you” 를 말합니다.'
          },
          { type: 'callout', kind: 'tip', title: '알아듣기 쉽게 적는 요령', html: '<ul><li>숫자는 <b>영어 단어</b>로: <code>"one two three"</code> (<code>"123"</code> 은 잘 안 됩니다)</li><li>단어 사이는 <b>띄어쓰기</b>로 구분</li><li>줄임말보다 <b>풀어서</b>: <code>"micro bit"</code> 가 <code>"microbit"</code> 보다 낫습니다</li><li>문장이 길면 짧게 나눠서 여러 번 부르세요</li></ul>' },
          {
            type: 'code', title: '예제 12-2. 버튼을 누르면 말하기', code: `from microbit import *
import speech

MESSAGES = [
    "Hello there",
    "How are you today",
    "I am a talking micro bit",
    "Press the other button",
]

index = 0
display.show(Image.ASLEEP)

while True:
    if button_a.was_pressed():
        display.show(Image.HAPPY)
        speech.say(MESSAGES[index])
        index = (index + 1) % len(MESSAGES)
        display.show(Image.ASLEEP)

    if button_b.was_pressed():
        display.show(Image.SURPRISED)
        speech.say("You pressed button B")
        display.show(Image.ASLEEP)

    sleep(50)`,
            desc: '문장을 리스트에 담아 두고 차례로 말합니다. 말하는 동안 표정이 바뀌니 살아 있는 것 같습니다.',
            expect: 'A 를 누를 때마다 다른 문장을, B 를 누르면 정해진 문장을 말합니다.'
          },

          { type: 'h', text: '목소리 바꾸기' },
          { type: 'figure', html: FIG_PARAMS, caption: '그림 12-2. 네 가지 목소리 파라미터' },
          {
            type: 'code', title: '예제 12-3. 여러 목소리로 말하기', code: `from microbit import *
import speech

display.show(Image.HAPPY)

# 기본 목소리
speech.say("This is the normal voice")
sleep(400)

# 높고 빠른 목소리 (다람쥐)
speech.say("I am a little squirrel", pitch=200, speed=120)
sleep(400)

# 낮고 느린 목소리 (거인)
speech.say("I am a big giant", pitch=10, speed=30, throat=220)
sleep(400)

# 로봇 목소리
speech.say("I am a ro bot", pitch=100, speed=72, mouth=200, throat=100)

display.clear()`,
            desc: '네 값을 조합하면 아주 다양한 목소리가 나옵니다. 값은 모두 <b>0 ~ 255</b> 이고, 기본값은 <code>pitch=64, speed=72, mouth=128, throat=128</code> 입니다.',
            expect: '네 가지 다른 목소리로 말합니다.'
          },
          { type: 'callout', kind: 'more', title: 'pitch 는 작을수록 높다?', html: '<p>조금 헷갈리지만 <code>pitch</code> 는 <b>소리의 주기</b>에 가까운 값이라 <b>작을수록 높은 목소리</b>가 납니다. <code>pitch=10</code> 이 아주 높고, <code>pitch=255</code> 가 아주 낮습니다.</p><p>같은 이유로 <code>speed</code> 도 <b>작을수록 빠릅니다</b>. 직접 바꿔 보면서 감을 잡는 것이 가장 빠릅니다.</p>' },
          {
            type: 'code', title: '예제 12-4. 기울기로 목소리 바꾸기', code: `from microbit import *
import speech

display.show(Image.HAPPY)

while True:
    if button_a.was_pressed():
        x = accelerometer.get_x()
        y = accelerometer.get_y()
        p = scale(x, from_=(-1024, 1024), to=(10, 250))
        s = scale(y, from_=(-1024, 1024), to=(20, 200))
        print("pitch =", p, " speed =", s)
        speech.say("hello hello hello", pitch=p, speed=s)
    sleep(50)`,
            hint: '🧭 센서 탭의 기울기 판을 이리저리 끌어 놓고 A 를 눌러 보세요.',
            desc: '기울기에 따라 목소리가 바뀝니다. 센서와 음성 합성을 연결한 예입니다.',
            expect: '기울인 정도에 따라 다른 목소리로 말합니다.',
            nondeterministic: true
          },

          { type: 'h', text: 'translate 와 pronounce — 발음 기호 다루기' },
          { type: 'p', html: '영어 철자와 실제 발음은 자주 다릅니다(예: <code>knight</code> → “나이트”). <code>speech.translate()</code> 는 단어를 <b>발음 기호(phoneme)</b> 로 바꿔 보여 줍니다.' },
          {
            type: 'code', repl: true, title: '셸에서 발음 기호 보기', code: `import speech
speech.translate("hello")
speech.translate("micro bit")
speech.translate("python")`,
            desc: '결과는 <code>HH AH L OW</code> 같은 <b>발음 기호 문자열</b>입니다. 이것을 <code>pronounce()</code> 에 넣으면 그대로 발음합니다.',
            expect: '>>> speech.translate("hello")\n\'HHEHLLAO\''
          },
          {
            type: 'code', title: '예제 12-5. 발음 기호로 직접 말하기', code: `from microbit import *
import speech

display.show(Image.HAPPY)

# ① 영어 단어를 발음 기호로 바꿔 본다
p = speech.translate("hello world")
print("발음 기호:", p)

# ② 같은 발음 기호로 말하기
speech.pronounce(p)
sleep(500)

# ③ 발음 기호를 직접 적어 말하기
speech.pronounce("HH AH L OW")
sleep(500)
speech.pronounce("MAY KROW BIHT")

display.clear()`,
            desc: '<code>translate()</code> 로 얻은 발음 기호를 <b>손으로 고쳐</b> 억양이나 발음을 다듬을 수 있습니다. <code>pronounce()</code> 는 철자 해석을 건너뛰므로 더 정확합니다.',
            expect: '발음 기호: HHEHLLAO WWERLD\n(세 가지 방식으로 말합니다)'
          },
          {
            type: 'code', title: '예제 12-6. 노래하기 (sing)', code: `from microbit import *
import speech

display.show(Image.MUSIC_QUAVER)

# # 뒤의 숫자가 음 높이 (숫자가 작을수록 높음)
speech.sing("#115DOWWWWWW")
sleep(300)
speech.sing("#103ME #103ME #103ME")
sleep(300)

# 간단한 음계
for n in ["#124DOWWW", "#111REYYY", "#99MIYYY", "#93FAWWW", "#83SOWWW"]:
    speech.sing(n)
    sleep(120)

display.clear()`,
            desc: '<code>sing()</code> 은 발음 기호 앞에 <code>#숫자</code> 로 <b>음 높이</b>를 지정합니다. 숫자가 작을수록 높은 음입니다. 모음을 여러 번 반복하면 길게 늘여 부릅니다.',
            expect: 'micro:bit 가 노래하듯 소리를 냅니다.'
          },
          {
            type: 'table', head: ['함수', '하는 일'], rows: [
              ['<code>speech.say(글)</code>', '영어 문장을 읽는다 (가장 많이 씀)'],
              ['<code>speech.translate(글)</code>', '발음 기호 문자열로 바꿔 <b>돌려준다</b> (소리는 안 남)'],
              ['<code>speech.pronounce(기호)</code>', '발음 기호를 그대로 발음한다'],
              ['<code>speech.sing(기호)</code>', '음 높이를 지정해 노래하듯 발음한다 (<code>#숫자</code>)']
            ], caption: '표 12-1. speech 모듈의 함수 (모두 pitch · speed · mouth · throat 지정 가능)'
          },
          { type: 'callout', kind: 'board', title: 'V1 에서 소리 듣기', html: 'micro:bit V1 에는 스피커가 없습니다. <b>P0 ↔ 이어폰 팁</b>, <b>GND ↔ 이어폰 슬리브</b> 를 악어클립으로 연결하면 들을 수 있습니다. V2 에서도 <code>speech.say("hi", pin=pin1)</code> 처럼 다른 핀을 쓸 수 있습니다.' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 목소리 값을 하나씩 바꿔 보기', code: `from microbit import *
import speech

WORD = "micro bit"

display.scroll("PITCH", delay=55)
for p in [20, 64, 120, 200]:
    print("pitch =", p)
    display.show(p // 50)
    speech.say(WORD, pitch=p)
    sleep(250)

display.scroll("SPEED", delay=55)
for s in [30, 72, 120, 180]:
    print("speed =", s)
    display.show(s // 50)
    speech.say(WORD, speed=s)
    sleep(250)

display.clear()`,
            desc: '한 번에 하나씩만 바꿔 들어 보면 각 값이 어떤 역할인지 확실히 알 수 있습니다. <b>pitch 와 speed 는 작을수록 높고 빠릅니다</b> — 헷갈리기 쉬우니 직접 들어 보세요.',
            expect: '같은 단어가 여덟 가지 목소리로 들립니다.'
          },
          {
            type: 'code', title: '더 해 보기 ②. 숫자를 영어로 읽어 주기', code: `from microbit import *
import speech

ONES = ["zero", "one", "two", "three", "four",
        "five", "six", "seven", "eight", "nine"]
TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen",
         "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
TENS = ["", "ten", "twenty", "thirty", "forty", "fifty",
        "sixty", "seventy", "eighty", "ninety"]


def say_number(n):
    if n < 10:
        return ONES[n]
    if n < 20:
        return TEENS[n - 10]
    if n < 100:
        return TENS[n // 10] + (" " + ONES[n % 10] if n % 10 else "")
    return "a lot"


for n in [0, 7, 13, 25, 40, 99]:
    print(n, "→", say_number(n))
    display.scroll(str(n), delay=60)
    speech.say(say_number(n))
    sleep(200)`,
            desc: '<code>speech.say("25")</code> 는 제대로 읽지 못합니다. 숫자를 <b>영어 단어</b>로 바꿔 주는 함수를 만들어 두면 온도 · 시간 · 점수를 말하게 할 때 계속 재사용할 수 있습니다.',
            expect: '0 → zero\n7 → seven\n13 → thirteen\n25 → twenty five\n40 → forty\n99 → ninety nine'
          },
          {
            type: 'code', title: '더 해 보기 ③. 음 높이를 정해 노래하기', code: `from microbit import *
import speech

# #숫자 = 음 높이 (작을수록 높음)
SONG = [
    ("#124", "DOWWWW"), ("#111", "REYYYY"), ("#99", "MIYYYY"),
    ("#93", "FAWWWW"), ("#83", "SOWWWW"), ("#74", "LAWWWW"),
    ("#66", "TIYYYY"), ("#62", "DOWWWW"),
]

display.show(Image.MUSIC_QUAVER)

for pitch_mark, sound in SONG:
    speech.sing(pitch_mark + sound)
    sleep(120)

sleep(400)
# 거꾸로 내려오기
for pitch_mark, sound in reversed(SONG):
    speech.sing(pitch_mark + sound)
    sleep(120)

display.clear()`,
            desc: '<code>sing()</code> 은 발음 기호 앞에 <code>#숫자</code> 로 <b>음 높이</b>를 지정합니다. 모음을 여러 번 반복하면 길게 늘여 부릅니다. <code>reversed()</code> 로 리스트를 거꾸로 훑어 내려오는 음계를 만들었습니다.',
            expect: '도레미파솔라시도를 올라갔다 내려옵니다.'
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '<code>import speech</code> — micro:bit 의 음성 합성 (1980년대 SAM 방식, <b>영어만</b>).',
              '<code>speech.say("Hello")</code> 로 문장을 읽습니다. 숫자는 영어 단어로 적으세요.',
              '<code>pitch</code>(작을수록 높음) · <code>speed</code>(작을수록 빠름) · <code>mouth</code> · <code>throat</code> — 모두 <b>0 ~ 255</b>.',
              '<code>translate()</code> 로 발음 기호를 보고, <code>pronounce()</code> 로 그대로 발음합니다.',
              '<code>sing("#115DOWWW")</code> 로 노래하듯 발음합니다 — <code>#숫자</code> 가 음 높이.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 12-1. 말하는 인사 로봇',
            level: 1,
            desc: '<p>버튼과 제스처에 따라 다른 말을 하는 인사 로봇을 만드세요.</p><ul><li>A → 인사 (예: <code>"Hello my friend"</code>)</li><li>B → 이름 소개 (예: <code>"My name is micro bit"</code>)</li><li>흔들면 → 놀란 목소리 (높고 빠르게)</li><li>말할 때마다 어울리는 표정을 보여 줍니다</li></ul>',
            hint: '놀란 목소리는 <code>speech.say("oh no", pitch=200, speed=110)</code> 처럼 만듭니다.',
            starter: 'from microbit import *\nimport speech\n\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport speech\n\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    if button_a.was_pressed():\n        display.show(Image.HAPPY)\n        speech.say("Hello my friend")\n        display.show(Image.ASLEEP)\n\n    if button_b.was_pressed():\n        display.show(Image.FABULOUS)\n        speech.say("My name is micro bit")\n        display.show(Image.ASLEEP)\n\n    if accelerometer.was_gesture("shake"):\n        display.show(Image.SURPRISED)\n        speech.say("oh no please stop shaking me", pitch=200, speed=110)\n        display.show(Image.ASLEEP)\n\n    sleep(50)\n'
          },
          {
            title: '실습 12-2. 말하는 온도계',
            level: 2,
            desc: '<p>버튼을 누르면 현재 온도를 <b>말로 알려 주는</b> 온도계를 만드세요.</p><ul><li>A → “The temperature is 숫자 degrees” (숫자는 <b>영어 단어</b>로!)</li><li>25도가 넘으면 <code>"It is hot"</code>, 15도 미만이면 <code>"It is cold"</code> 를 덧붙입니다</li><li>숫자를 영어로 바꾸는 함수를 직접 만들어 보세요 (0~39 정도면 충분)</li></ul>',
            hint: '<code>ONES = ["zero","one","two",…,"nine"]</code>, <code>TENS = ["", "ten", "twenty", "thirty"]</code> 를 만들고 십의 자리와 일의 자리를 나눠 조합하세요.',
            starter: 'from microbit import *\nimport speech\n\nONES = ["zero", "one", "two", "three", "four",\n        "five", "six", "seven", "eight", "nine"]\nTENS = ["", "ten", "twenty", "thirty"]\n\n\ndef say_number(n):\n    # TODO: 0 ~ 39 를 영어 단어로\n    return str(n)\n\n\nwhile True:\n    if button_a.was_pressed():\n        # TODO\n        pass\n    sleep(50)\n',
            solution: 'from microbit import *\nimport speech\n\nONES = ["zero", "one", "two", "three", "four",\n        "five", "six", "seven", "eight", "nine"]\nTENS = ["", "ten", "twenty", "thirty"]\nTEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen",\n         "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]\n\n\ndef say_number(n):\n    if n < 10:\n        return ONES[n]\n    if n < 20:\n        return TEENS[n - 10]\n    return TENS[n // 10] + " " + ONES[n % 10]\n\n\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    if button_a.was_pressed():\n        t = temperature()\n        display.show(Image.HAPPY)\n        speech.say("The temperature is " + say_number(t) + " degrees")\n\n        if t > 25:\n            speech.say("It is hot", pitch=120, speed=90)\n        elif t < 15:\n            speech.say("It is cold", pitch=30, speed=50)\n\n        display.show(Image.ASLEEP)\n    sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: 'micro:bit 의 <code>speech</code> 모듈이 지원하는 언어는?', options: ['한국어', '영어', '영어와 한국어', '모든 언어'], answer: 1,
            explain: '<b>영어 발음 규칙</b>만 알고 있습니다. 한국어는 영어 철자로 비슷하게 적어야 합니다.'
          },
          {
            q: '<code>speech.say("hi", pitch=200)</code> 의 결과는?', options: ['아주 높은 목소리', '아주 낮은 목소리', '아주 빠른 목소리', '아주 느린 목소리'], answer: 1,
            explain: '<code>pitch</code> 는 <b>작을수록 높은</b> 목소리입니다. 200 은 기본값 64 보다 크므로 <b>낮은</b> 목소리가 납니다.'
          },
          {
            q: '<code>speech.translate("hello")</code> 를 실행하면?', options: ['“hello” 를 말한다', '한국어로 번역한다', '발음 기호 문자열을 돌려준다', '오류가 난다'], answer: 2,
            explain: '<b>소리는 나지 않고</b> 발음 기호 문자열을 돌려줍니다. 이것을 <code>pronounce()</code> 에 넣어 말하게 할 수 있습니다.'
          },
          {
            q: '<code>speech.sing("#115DOWWWW")</code> 에서 <code>#115</code> 는?', options: ['반복 횟수', '음 높이', '음량', '속도'], answer: 1,
            explain: '<code>#숫자</code> 는 <b>음 높이</b>입니다. 숫자가 작을수록 높은 음입니다.'
          },
          {
            q: '숫자 25 를 말하게 하려면 어떻게 적는 것이 가장 좋을까요?', options: ['<code>speech.say("25")</code>', '<code>speech.say("twenty five")</code>', '<code>speech.say(25)</code>', '<code>speech.say("이십오")</code>'], answer: 1,
            explain: '숫자 기호보다 <b>영어 단어</b>로 적어야 제대로 발음합니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: 'speech — micro:bit 가 말을 한다', subtitle: 'Chapter 12 · 말하기와 소리', badge: '1교시',
            notes: '<p>소리가 나는 수업입니다. 음량과 이어폰을 미리 확인하세요. 학생들이 아주 즐거워하는 장입니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'code', title: '첫 말하기', code: 'from microbit import *\nimport speech\n\ndisplay.show(Image.HAPPY)\nspeech.say("Hello, I am a micro bit")\nsleep(500)\nspeech.say("Nice to meet you")',
            points: ['<code>import speech</code> 필요', '<b>영어만</b> 지원', '숫자는 영어 단어로', 'V2 내장 스피커 / V1 은 이어폰'],
            notes: '<p>먼저 교사 화면에서 들려준 뒤 학생들이 자기 문장을 넣어 보게 합니다. 반응이 좋습니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'diagram', title: '글자가 소리가 되기까지', html: FIG_SPEECH, caption: 'say = 전 과정 · translate = 발음기호까지 · pronounce = 발음기호부터',
            notes: '<p>1980년대 SAM 프로그램에서 왔다는 이야기를 하면 흥미로워합니다. 애플 II 시절 영상을 보여 줘도 좋습니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'diagram', title: '목소리를 바꾸는 네 값', html: FIG_PARAMS, caption: '모두 0~255 · pitch 와 speed 는 작을수록 높고 빠름',
            notes: '<p>pitch 가 작을수록 높다는 점이 헷갈립니다. 직접 들려주며 설명하세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '여러 목소리', code: 'speech.say("This is the normal voice")\nspeech.say("I am a little squirrel", pitch=200, speed=120)\nspeech.say("I am a big giant", pitch=10, speed=30, throat=220)\nspeech.say("I am a ro bot", pitch=100, mouth=200, throat=100)',
            points: ['다람쥐 · 거인 · 로봇 목소리', '값을 조합해 실험', '기본값: pitch 64, speed 72', 'mouth 128, throat 128'],
            notes: '<p>학생들이 가장 재미있어하는 부분입니다. 자기만의 캐릭터 목소리를 만들어 발표하게 하세요.</p><p>시간: 10분</p>'
          },
          {
            layout: 'code', title: 'translate 와 pronounce', code: 'import speech\n\np = speech.translate("hello world")\nprint("발음 기호:", p)      # HHEHLLAO WWERLD\n\nspeech.pronounce(p)\nspeech.pronounce("MAY KROW BIHT")',
            points: ['영어 철자 ≠ 실제 발음', '<code>translate()</code> = 기호로 변환만', '<code>pronounce()</code> = 기호를 발음', '기호를 손으로 다듬어 정확도 ↑'],
            notes: '<p>영어 시간과 연결해 발음 기호 이야기를 하면 좋습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'practice', title: '실습 12-1. 말하는 인사 로봇', desc: 'A · B · 흔들기에 따라 다른 말과 표정',
            starter: 'from microbit import *\nimport speech\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport speech\n\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    if button_a.was_pressed():\n        display.show(Image.HAPPY)\n        speech.say("Hello my friend")\n        display.show(Image.ASLEEP)\n    if button_b.was_pressed():\n        display.show(Image.FABULOUS)\n        speech.say("My name is micro bit")\n        display.show(Image.ASLEEP)\n    if accelerometer.was_gesture("shake"):\n        display.show(Image.SURPRISED)\n        speech.say("oh no please stop shaking me", pitch=200, speed=110)\n        display.show(Image.ASLEEP)\n    sleep(50)\n',
            notes: '<p>완성한 로봇들을 서로 인사시키면 즐겁습니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['<code>import speech</code> · 영어만', '<code>say()</code> / <code>translate()</code> / <code>pronounce()</code> / <code>sing()</code>', 'pitch · speed · mouth · throat (0~255)', 'pitch, speed 는 <b>작을수록</b> 높고 빠름', '숫자는 영어 단어로'],
            notes: '<p>다음 시간 예고: 내장 효과음과 마이크 — 듣고 반응하는 micro:bit.</p><p>시간: 2분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch12-2',
        title: '효과음과 마이크 — 듣고 반응하기',
        minutes: 45,
        goals: [
          '<code>audio.play()</code> 로 V2 내장 효과음을 재생할 수 있다',
          '<code>SoundEffect</code> 로 효과음을 직접 만들 수 있다',
          '<code>microphone.sound_level()</code> 로 소리 크기를 읽을 수 있다',
          '<code>SoundEvent</code> 로 큰 소리 · 조용함을 감지할 수 있다'
        ],
        flow: [['내장 효과음', 12], ['효과음 만들기', 10], ['마이크', 14], ['소리로 조종', 6], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: 'audio — 내장 효과음 (V2)' },
          { type: 'p', html: 'micro:bit <b>V2</b> 에는 미리 만들어진 <b>표현 효과음 10가지</b>가 들어 있습니다. 웃음, 인사, 하품 같은 소리로 로봇에 성격을 줄 수 있습니다.' },
          {
            type: 'code', title: '예제 12-7. 내장 효과음 듣기', code: `from microbit import *
import audio

SOUNDS = [
    (Sound.GIGGLE, "GIGGLE"),
    (Sound.HAPPY, "HAPPY"),
    (Sound.HELLO, "HELLO"),
    (Sound.MYSTERIOUS, "MYSTERY"),
    (Sound.SAD, "SAD"),
    (Sound.SLIDE, "SLIDE"),
    (Sound.SOARING, "SOARING"),
    (Sound.SPRING, "SPRING"),
    (Sound.TWINKLE, "TWINKLE"),
    (Sound.YAWN, "YAWN"),
]

for sound, name in SOUNDS:
    display.scroll(name, delay=50)
    audio.play(sound)
    sleep(300)

display.clear()`,
            desc: '<code>Sound</code> 는 <code>microbit</code> 모듈에 들어 있어 따로 import 하지 않아도 됩니다. <code>audio.play()</code> 로 재생합니다.',
            expect: '10가지 효과음이 이름과 함께 차례로 재생됩니다.'
          },
          {
            type: 'table', head: ['이름', '느낌', '이름', '느낌'], rows: [
              ['<code>Sound.GIGGLE</code>', '킥킥 웃음', '<code>Sound.SLIDE</code>', '미끄러지는 소리'],
              ['<code>Sound.HAPPY</code>', '기쁨', '<code>Sound.SOARING</code>', '날아오르는 소리'],
              ['<code>Sound.HELLO</code>', '인사', '<code>Sound.SPRING</code>', '용수철 튕김'],
              ['<code>Sound.MYSTERIOUS</code>', '수상함', '<code>Sound.TWINKLE</code>', '반짝임'],
              ['<code>Sound.SAD</code>', '슬픔', '<code>Sound.YAWN</code>', '하품']
            ], caption: '표 12-2. micro:bit V2 의 내장 효과음 10가지'
          },
          {
            type: 'code', title: '예제 12-8. 감정 표현 로봇', code: `from microbit import *
import audio

display.show(Image.ASLEEP)

while True:
    if button_a.was_pressed():
        display.show(Image.HAPPY)
        audio.play(Sound.HAPPY)
        display.show(Image.ASLEEP)

    if button_b.was_pressed():
        display.show(Image.SAD)
        audio.play(Sound.SAD)
        display.show(Image.ASLEEP)

    if accelerometer.was_gesture("shake"):
        display.show(Image.SURPRISED)
        audio.play(Sound.SPRING)
        display.show(Image.ASLEEP)

    if pin_logo.is_touched():
        display.show(Image.SILLY)
        audio.play(Sound.GIGGLE)
        display.show(Image.ASLEEP)

    sleep(50)`,
            desc: '표정과 효과음을 짝지으면 감정이 있는 것처럼 느껴집니다. 로고를 만지면 간지럼을 타는 듯 웃습니다.',
            expect: 'A → 기쁨, B → 슬픔, 흔들면 → 놀람, 로고 → 웃음'
          },

          { type: 'h', text: '효과음 직접 만들기 — SoundEffect' },
          {
            type: 'code', title: '예제 12-9. 나만의 효과음', code: `from microbit import *
import audio

laser = audio.SoundEffect(
    freq_start=2000,        # 시작 주파수
    freq_end=200,           # 끝 주파수
    duration=300,           # 길이(ms)
    vol_start=255,
    vol_end=0,
    waveform=audio.SoundEffect.WAVEFORM_SAWTOOTH,
    fx=audio.SoundEffect.FX_NONE,
)

alarm = audio.SoundEffect(
    freq_start=400,
    freq_end=1400,
    duration=600,
    waveform=audio.SoundEffect.WAVEFORM_SQUARE,
    fx=audio.SoundEffect.FX_WARBLE,
)

while True:
    if button_a.was_pressed():
        display.show(Image.TARGET)
        audio.play(laser)
        display.clear()
    if button_b.was_pressed():
        display.show(Image.SKULL)
        audio.play(alarm)
        display.clear()
    sleep(50)`,
            desc: '<code>SoundEffect</code> 로 시작 · 끝 주파수, 길이, 파형, 효과를 정해 <b>나만의 소리</b>를 만듭니다. 파형은 <code>WAVEFORM_SINE</code> · <code>SAWTOOTH</code> · <code>TRIANGLE</code> · <code>SQUARE</code> · <code>NOISE</code> 가 있습니다.',
            expect: 'A → 레이저 소리, B → 경보음'
          },
          { type: 'callout', kind: 'more', title: 'music.pitch 와 무엇이 다를까?', html: '<p>6장의 <code>music.pitch()</code> 는 <b>한 가지 높이의 소리</b>만 냅니다. 여러 소리를 이어 붙여 효과음을 만들었지요.</p><p><code>SoundEffect</code> 는 <b>주파수 · 음량이 부드럽게 변하는 소리</b>를 한 번에 만들어 줍니다. 파형과 효과(떨림 · 흔들림)도 지정할 수 있어 훨씬 풍부합니다. 다만 <b>V2 에서만</b> 됩니다.</p>' },

          { type: 'h', text: 'microphone — 소리 듣기 (V2)' },
          { type: 'p', html: 'micro:bit V2 에는 <b>마이크</b>가 있습니다. 소리를 녹음하지는 못하지만, <b>얼마나 큰 소리인지</b>는 잴 수 있습니다.' },
          {
            type: 'code', title: '예제 12-10. 소리 크기 재기', code: `from microbit import *

while True:
    level = microphone.sound_level()       # 0 ~ 255
    print("소리 크기:", level)

    # 막대그래프로 표시
    n = min(4, level // 52)
    display.clear()
    for y in range(n + 1):
        for x in range(5):
            display.set_pixel(x, 4 - y, 9)
    sleep(100)`,
            hint: '🧭 <b>센서 탭</b>의 <b>소리</b> 슬라이더를 움직이거나 <b>👏 박수</b> 버튼을 눌러 보세요.',
            desc: '<code>sound_level()</code> 은 <b>0 ~ 255</b> 의 값을 돌려줍니다. 조용하면 작고, 소리가 클수록 큽니다. 실제 보드에서는 손뼉을 치거나 말해 보세요.',
            expect: '소리 크기에 따라 막대가 오르내립니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 12-11. 박수 감지기', code: `from microbit import *
import audio

THRESHOLD = 150
claps = 0
display.show(Image.ASLEEP)

while True:
    if microphone.sound_level() > THRESHOLD:
        claps = claps + 1
        display.show(Image.SURPRISED)
        audio.play(Sound.TWINKLE)
        print("박수!", claps, "회")
        sleep(400)                 # 같은 박수를 두 번 세지 않도록
        display.show(Image.ASLEEP)

    if button_a.was_pressed():
        display.scroll(str(claps), delay=80)
        display.show(Image.ASLEEP)

    sleep(30)`,
            hint: '🧭 센서 탭의 <b>👏 박수</b> 버튼을 눌러 보세요.',
            desc: '임계값을 넘으면 박수로 판단합니다. <code>sleep(400)</code> 으로 <b>같은 소리를 여러 번 세지 않게</b> 했습니다 (5장 · 8장의 채터링 방지와 같은 방법).',
            expect: '박수를 칠 때마다 반짝 소리와 함께 횟수가 올라갑니다.',
            nondeterministic: true
          },

          { type: 'h', text: 'SoundEvent — 소리 사건' },
          { type: 'p', html: '직접 임계값을 비교하지 않고, micro:bit 가 <b>“큰 소리” · “조용함”</b> 을 판단해 알려 주게 할 수도 있습니다. 9장의 제스처와 같은 방식입니다.' },
          {
            type: 'code', title: '예제 12-12. 큰 소리 감지', code: `from microbit import *

display.show(Image.ASLEEP)

while True:
    # was_event: 그 사건이 있었나? (확인하면 초기화)
    if microphone.was_event(SoundEvent.LOUD):
        display.show(Image.SURPRISED)
        sleep(500)
        display.show(Image.ASLEEP)

    # current_event: 지금 상태는?
    if microphone.current_event() == SoundEvent.QUIET:
        display.set_pixel(0, 0, 2)

    sleep(50)`,
            hint: '🧭 센서 탭의 <b>👏 박수</b> 와 <b>🤫 조용히</b> 버튼을 눌러 보세요.',
            desc: '<code>SoundEvent.LOUD</code>(큰 소리) 와 <code>SoundEvent.QUIET</code>(조용함) 두 가지가 있습니다. <code>was_event()</code> · <code>current_event()</code> · <code>is_event()</code> 는 제스처의 <code>was_gesture</code> 등과 똑같이 동작합니다.',
            expect: '큰 소리가 나면 놀란 얼굴이 나타납니다.'
          },
          {
            type: 'table', head: ['메서드', '하는 일'], rows: [
              ['<code>microphone.sound_level()</code>', '소리 크기 <b>0 ~ 255</b>'],
              ['<code>microphone.current_event()</code>', '지금 상태 (<code>SoundEvent.LOUD</code> / <code>QUIET</code>)'],
              ['<code>microphone.was_event(e)</code>', '그 사건이 있었나? (확인하면 초기화)'],
              ['<code>microphone.is_event(e)</code>', '지금 그 상태인가?'],
              ['<code>microphone.get_events()</code>', '사건 기록 전체'],
              ['<code>microphone.set_threshold(e, v)</code>', '판정 기준값 조절']
            ]
          },
          {
            type: 'code', title: '예제 12-13. 소리로 조종하는 게임', code: `from microbit import *
import audio

y = 4          # 공의 높이 (4 = 바닥)

while True:
    level = microphone.sound_level()

    # 소리가 크면 위로, 작으면 아래로
    if level > 120:
        y = max(0, y - 1)
    else:
        y = min(4, y + 1)

    display.clear()
    display.set_pixel(2, y, 9)

    if y == 0:
        audio.play(Sound.SOARING, wait=False)

    sleep(200)`,
            hint: '🧭 센서 탭의 <b>소리</b> 슬라이더를 크게 올렸다 내렸다 해 보세요. 실제 보드에서는 “아~” 하고 소리를 내면 됩니다.',
            desc: '소리를 내면 공이 올라가고 멈추면 내려옵니다. 목소리로 조종하는 게임이 됩니다. <code>wait=False</code> 로 소리가 나는 동안에도 게임이 계속됩니다.',
            expect: '소리가 크면 점이 올라가고, 조용하면 내려옵니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'board', title: 'V1 에는 마이크가 없습니다', html: '<code>microphone</code> 과 <code>audio.SoundEffect</code>, <code>Sound.*</code> 내장 효과음은 <b>micro:bit V2 전용</b>입니다. V1 에서 실행하면 <code>AttributeError</code> 가 납니다. V1 으로 소리를 감지하려면 별도의 소리 센서 모듈을 핀에 연결해야 합니다.' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 파형을 바꿔 들어 보기', code: `from microbit import *
import audio

WAVES = [
    (audio.SoundEffect.WAVEFORM_SINE, "SINE", Image.HEART_SMALL),
    (audio.SoundEffect.WAVEFORM_SAWTOOTH, "SAW", Image.TRIANGLE),
    (audio.SoundEffect.WAVEFORM_TRIANGLE, "TRI", Image.ARROW_N),
    (audio.SoundEffect.WAVEFORM_SQUARE, "SQR", Image.SQUARE),
    (audio.SoundEffect.WAVEFORM_NOISE, "NOISE", Image.CONFUSED),
]

for wave, name, picture in WAVES:
    display.show(picture)
    print(name)
    audio.play(audio.SoundEffect(freq_start=600, freq_end=600,
                                 duration=600, waveform=wave))
    sleep(250)

display.clear()`,
            desc: '같은 높이(600Hz)인데 <b>파형</b>만 바꿨습니다. 사인파는 부드럽고, 사각파는 딱딱하고, 톱니파는 거칠고, 노이즈는 “쉬~” 하는 소리입니다. 악기와 효과음의 성격이 바로 이 파형에서 나옵니다.',
            expect: '같은 음이 다섯 가지 음색으로 들립니다.'
          },
          {
            type: 'code', title: '더 해 보기 ②. 내 교실의 소음 기준 찾기', code: `from microbit import *

samples = []
display.scroll("QUIET", delay=55)

# ① 조용할 때 10번 재기
for i in range(10):
    samples.append(microphone.sound_level())
    display.show(i)
    sleep(200)

quiet = sum(samples) // len(samples)
print("조용할 때 평균:", quiet, " 최대:", max(samples))

display.scroll("LOUD", delay=55)
samples = []

# ② 시끄러울 때 10번 재기
for i in range(10):
    samples.append(microphone.sound_level())
    display.show(i)
    sleep(200)

loud = sum(samples) // len(samples)
print("시끄러울 때 평균:", loud, " 최대:", max(samples))
print("→ 임계값은", (quiet + loud) // 2, "쯤이 좋겠습니다")

display.scroll(str((quiet + loud) // 2), delay=80)`,
            hint: '🧭 앞 10번은 <b>🤫 조용히</b>, 뒤 10번은 <b>👏 박수</b> 버튼을 누르며 재 보세요.',
            desc: '교실마다 소음 수준이 다릅니다. 조용할 때와 시끄러울 때를 각각 재서 <b>그 중간</b>을 임계값으로 잡으면 잘 동작합니다. 센서를 쓰는 프로그램을 만들 때 꼭 거치는 과정입니다.',
            expect: '조용할 때 평균: 30  최대: 45\n시끄러울 때 평균: 180  최대: 220\n→ 임계값은 105 쯤이 좋겠습니다',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. 소리 사건 기록하기', code: `from microbit import *

events = []
display.show(Image.ASLEEP)

while True:
    for e in microphone.get_events():          # 그동안 쌓인 사건 전부
        t = running_time() // 1000
        events.append((t, e.name))
        print(t, "초 →", e.name)

    if button_a.was_pressed():
        loud = [e for e in events if e[1] == "loud"]
        print("전체", len(events), "건 / 큰 소리", len(loud), "건")
        display.scroll(str(len(loud)), delay=80)
        display.show(Image.ASLEEP)

    if button_b.was_pressed():
        events = []
        display.show(Image.NO)
        sleep(400)
        display.show(Image.ASLEEP)

    sleep(100)`,
            hint: '🧭 <b>👏 박수</b> 와 <b>🤫 조용히</b> 버튼을 번갈아 눌러 보세요.',
            desc: '<code>get_events()</code> 는 제스처의 <code>get_gestures()</code> 와 같습니다 — 그동안 일어난 사건을 <b>순서대로 모아</b> 돌려주고 기록을 비웁니다. 언제 시끄러웠는지 시각과 함께 남길 수 있습니다.',
            expect: '3 초 → loud\n5 초 → quiet',
            nondeterministic: true
          },

          { type: 'h', text: '🚀 응용 예제 — 듣고 말하는 장치' },
          { type: 'p', html: '소리를 <b>듣고</b> 또 <b>말하는</b> 프로그램들입니다. V2 전용 기능이 많으니 실제 보드로 해 볼 때는 V2 인지 확인하세요.' },
          {
            type: 'code', title: '응용 예제 12-1. 말하는 안내 도우미', code: `from microbit import *
import speech

ONES = ["zero", "one", "two", "three", "four",
        "five", "six", "seven", "eight", "nine"]
TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen",
         "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
TENS = ["", "ten", "twenty", "thirty", "forty", "fifty"]


def words(n):
    if n < 10:
        return ONES[n]
    if n < 20:
        return TEENS[n - 10]
    if n < 60:
        return TENS[n // 10] + (" " + ONES[n % 10] if n % 10 else "")
    return "a lot"


display.show(Image.ASLEEP)

while True:
    # A: 온도 말하기
    if button_a.was_pressed():
        t = temperature()
        display.show(Image.HAPPY)
        speech.say("the temperature is " + words(t) + " degrees")
        if t > 26:
            speech.say("it is quite warm", pitch=110, speed=90)
        elif t < 16:
            speech.say("it is cold", pitch=30, speed=55)
        display.show(Image.ASLEEP)

    # B: 켜진 시간 말하기
    if button_b.was_pressed():
        m = running_time() // 60000
        s = running_time() // 1000 % 60
        display.show(Image.ALL_CLOCKS, delay=40)
        speech.say("running for " + words(m) + " minutes " + words(s) + " seconds")
        display.show(Image.ASLEEP)

    # 로고: 밝기 말하기
    if pin_logo.is_touched():
        l = display.read_light_level()
        display.show(Image.SURPRISED)
        if l > 180:
            speech.say("it is very bright here")
        elif l > 60:
            speech.say("the light is just fine")
        else:
            speech.say("it is dark", pitch=140, speed=60)
        display.show(Image.ASLEEP)

    sleep(50)`,
            desc: '센서 값을 <b>말로</b> 알려 줍니다. 숫자를 영어 단어로 바꾸는 <code>words()</code> 함수를 만들어 두고 여러 곳에서 재사용했습니다. 눈이 불편한 사람을 위한 보조 기기의 기본 아이디어이기도 합니다.',
            expect: 'A · B · 로고에 따라 온도 · 시간 · 밝기를 말해 줍니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 12-2. 목소리로 조종하는 점프 게임', code: `from microbit import *
import audio

JUMP_LEVEL = 110
GRAVITY = 0.45

y = 4.0              # 세로 위치 (4 = 바닥)
vy = 0.0
obstacle = 4         # 장애물 x 위치
score = 0

display.scroll("SHOUT", delay=55)

while True:
    # ① 소리를 내면 위로 튀어 오른다
    if microphone.sound_level() > JUMP_LEVEL and y > 3.5:
        vy = -1.5

    # ② 중력
    vy = vy + GRAVITY
    y = y + vy
    if y > 4:
        y, vy = 4.0, 0.0
    if y < 0:
        y, vy = 0.0, 0.0

    # ③ 장애물이 왼쪽으로
    obstacle = obstacle - 1
    if obstacle < 0:
        obstacle = 4
        score = score + 1
        audio.play(Sound.TWINKLE, wait=False)

    # ④ 그리기
    display.clear()
    display.set_pixel(1, int(y + 0.5), 9)          # 나
    display.set_pixel(obstacle, 4, 6)              # 장애물

    # ⑤ 부딪혔나
    if obstacle == 1 and int(y + 0.5) == 4:
        display.show(Image.SAD)
        audio.play(Sound.SAD)
        display.scroll(str(score), delay=80)
        y, vy, obstacle, score = 4.0, 0.0, 4, 0
        display.scroll("SHOUT", delay=55)

    sleep(200)`,
            hint: '🧭 장애물이 다가오면 <b>👏 박수</b> 버튼을 눌러 점프하세요.',
            desc: '소리를 내면 점프하고 중력으로 떨어집니다. 8장의 <b>속도와 중력</b> 계산을 그대로 썼습니다. 실제 보드에서는 “앗!” 하고 소리를 내면 점프합니다.',
            expect: '소리를 내면 점이 뛰어오르고, 장애물을 피하면 점수가 올라갑니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 12-3. 박수 두 번으로 켜는 스위치', code: `from microbit import *
import audio

GAP_MS = 700              # 이 시간 안에 두 번 박수
CLAP_LEVEL = 140

claps = 0
first_at = 0
on = False

display.show(Image.NO)

while True:
    if microphone.sound_level() > CLAP_LEVEL:
        now = running_time()
        if claps == 0 or now - first_at > GAP_MS:
            claps = 1
            first_at = now
        else:
            claps = claps + 1

        if claps >= 2:
            on = not on
            claps = 0
            pin0.write_digital(1 if on else 0)     # 바깥 LED 도 함께
            display.show(Image.YES if on else Image.NO)
            audio.play(Sound.HAPPY if on else Sound.YAWN)
            print("스위치", "켜짐" if on else "꺼짐")

        sleep(220)        # 같은 박수를 두 번 세지 않도록

    # 시간이 지나면 첫 박수는 무효
    if claps == 1 and running_time() - first_at > GAP_MS:
        claps = 0

    sleep(25)`,
            hint: '🧩 LED 를 P0 에 연결하고, 🧭 <b>👏 박수</b> 버튼을 <b>빠르게 두 번</b> 눌러 보세요.',
            desc: '<b>정해진 시간 안에 두 번</b> 소리가 나야 동작합니다. 한 번만 나면 무시되므로 말소리나 문 닫는 소리에 잘 반응하지 않습니다. 실제 “박수 스위치” 제품이 쓰는 방법입니다.',
            expect: '박수를 두 번 치면 LED 가 켜지고, 다시 두 번 치면 꺼집니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 12-4. 대답하는 로봇', code: `from microbit import *
import speech
import audio
import random

ANSWERS = [
    "i think so", "no way", "ask me later",
    "that sounds good", "i am not sure", "definitely yes",
]

display.show(Image.ASLEEP)
mood = 0                     # 0 = 보통, 1 = 기분 좋음, 2 = 졸림

while True:
    # 큰 소리로 말을 걸면 대답한다
    if microphone.was_event(SoundEvent.LOUD):
        display.show(Image.SURPRISED)
        audio.play(Sound.HELLO)
        sleep(200)

        answer = random.choice(ANSWERS)
        if mood == 1:
            speech.say(answer, pitch=90, speed=95)
            display.show(Image.HAPPY)
        elif mood == 2:
            speech.say(answer, pitch=180, speed=45)
            display.show(Image.ASLEEP)
        else:
            speech.say(answer)
            display.show(Image.SMILE)
        print("로봇:", answer)
        sleep(500)
        display.show(Image.ASLEEP)

    # A: 기분 바꾸기
    if button_a.was_pressed():
        mood = (mood + 1) % 3
        display.show([Image.SMILE, Image.HAPPY, Image.ASLEEP][mood])
        audio.play([Sound.HELLO, Sound.GIGGLE, Sound.YAWN][mood])
        sleep(400)
        display.show(Image.ASLEEP)

    # 흔들면 싫어한다
    if accelerometer.was_gesture("shake"):
        display.show(Image.ANGRY)
        speech.say("please stop shaking me", pitch=200, speed=110)
        display.show(Image.ASLEEP)

    sleep(60)`,
            hint: '🧭 <b>👏 박수</b> 로 말을 걸고, A 로 기분을 바꾸고, <b>흔들기</b> 도 해 보세요.',
            desc: '<b>듣고(마이크) · 말하고(speech) · 표정(LED) · 효과음(audio)</b> 을 모두 쓴 작은 로봇입니다. 기분에 따라 목소리가 바뀌어 성격이 있는 것처럼 느껴집니다.',
            expect: '소리를 내면 로봇이 대답하고, 흔들면 싫어합니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 12-5. 기록이 남는 소음 감시기', code: `from microbit import *
import audio
import log

THRESHOLD = 130
WARN_SEC = 3
INTERVAL = 2000

log.set_labels("level", "warn", timestamp=log.SECONDS)

loud_since = None
warnings = 0
next_log = running_time()

display.show(Image.HAPPY)

while True:
    level = microphone.sound_level()
    warned_now = 0

    # ① 계속 시끄러운지 확인
    if level > THRESHOLD:
        if loud_since is None:
            loud_since = running_time()
        elif running_time() - loud_since > WARN_SEC * 1000:
            warnings = warnings + 1
            warned_now = 1
            display.show(Image.ANGRY)
            audio.play(Sound.SAD)
            print("경고", warnings, "회 / 소리", level)
            sleep(900)
            loud_since = None
    else:
        loud_since = None

    # ② 일정 간격으로 기록
    if running_time() >= next_log:
        log.add(level=level, warn=warned_now)
        next_log = next_log + INTERVAL

    # ③ 평소에는 소음 막대
    if loud_since is None:
        n = min(5, level // 45)
        display.clear()
        for y in range(n):
            for x in range(5):
                display.set_pixel(x, 4 - y, 9 if n >= 4 else 5)
        if n == 0:
            display.show(Image.HAPPY)

    if button_a.was_pressed():
        display.scroll(str(warnings), delay=80)

    sleep(120)`,
            desc: '소음을 <b>실시간으로 보여 주고 동시에 기록</b>합니다. 3초 이상 계속 시끄러우면 경고하고 그 순간도 함께 남깁니다. 수업이 끝난 뒤 <b>📊 로그</b> 탭에서 CSV 를 받아 “언제 시끄러웠나” 를 그래프로 볼 수 있습니다.',
            expect: '소음 막대가 움직이고, 계속 시끄러우면 경고 후 기록됩니다.',
            nondeterministic: true
          },

          { type: 'h', text: '2교시 · 12장 요약' },
          {
            type: 'list', items: [
              '<code>import audio</code> — <code>audio.play(Sound.GIGGLE)</code> 로 V2 내장 효과음 10가지를 재생합니다.',
              '<code>audio.SoundEffect(freq_start=…, freq_end=…, duration=…)</code> 로 나만의 효과음을 만듭니다.',
              '<code>microphone.sound_level()</code> — 소리 크기 <b>0 ~ 255</b>.',
              '<code>SoundEvent.LOUD</code> · <code>QUIET</code> 와 <code>was_event()</code> 로 소리 사건을 감지합니다 (제스처와 같은 방식).',
              '같은 소리를 여러 번 세지 않도록 <b>감지 후 잠깐 쉬는</b> 처리가 필요합니다.',
              '<code>microphone</code> · <code>audio</code> · <code>Sound</code> 는 <b>V2 전용</b>입니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 12-3. 소음 측정기',
            level: 2,
            desc: '<p>교실의 소음을 감시하는 장치를 만드세요.</p><ul><li>소리 크기를 막대그래프로 계속 표시합니다</li><li>일정 시간(3초) 동안 계속 시끄러우면 <code>Image.ANGRY</code> 와 경고음</li><li>조용해지면 <code>Image.HAPPY</code></li><li>A 를 누르면 지금까지 <b>경고가 몇 번</b> 울렸는지 보여 줍니다</li></ul>',
            hint: '“3초 동안 계속” 을 판단하려면 시끄러워지기 시작한 시각을 기억해 두고 <code>running_time() - loud_since &gt; 3000</code> 으로 확인합니다.',
            starter: 'from microbit import *\nimport audio\n\nTHRESHOLD = 120\nloud_since = None\nwarnings = 0\n\nwhile True:\n    level = microphone.sound_level()\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\nimport audio\n\nTHRESHOLD = 120\nloud_since = None\nwarnings = 0\n\nwhile True:\n    level = microphone.sound_level()\n\n    if level > THRESHOLD:\n        if loud_since is None:\n            loud_since = running_time()\n        elif running_time() - loud_since > 3000:\n            warnings = warnings + 1\n            display.show(Image.ANGRY)\n            audio.play(Sound.SAD)\n            print("경고", warnings, "회")\n            sleep(1000)\n            loud_since = None\n    else:\n        loud_since = None\n\n    if loud_since is None and not button_a.is_pressed():\n        n = min(4, level // 52)\n        display.clear()\n        for y in range(n + 1):\n            for x in range(5):\n                display.set_pixel(x, 4 - y, 9)\n\n    if button_a.was_pressed():\n        display.scroll(str(warnings), delay=80)\n\n    sleep(100)\n'
          },
          {
            title: '실습 12-4. 도전! 말하는 알림 시계',
            level: 3,
            desc: '<p>여러 기능을 합친 <b>말하는 도우미</b>를 만드세요.</p><ul><li>A → 현재 온도를 <b>말로</b> 알려 줍니다 (실습 12-2 의 <code>say_number</code> 재사용)</li><li>B → 프로그램이 켜진 뒤 지난 <b>시간(분)</b> 을 말합니다</li><li>큰 소리(박수)가 나면 <code>"I heard you"</code> 라고 대답합니다</li><li>흔들면 무작위 <b>명언</b>을 하나 말합니다 (3개 이상)</li><li>엎어 놓으면 조용히 하고(화면도 끄기), 다시 놓으면 <code>Sound.HELLO</code></li></ul>',
            hint: '각 기능을 <code>def</code> 로 나누면 관리하기 쉽습니다. 분 단위 시간은 <code>running_time() // 60000</code>.',
            starter: 'from microbit import *\nimport speech\nimport audio\nimport random\n\nONES = ["zero", "one", "two", "three", "four",\n        "five", "six", "seven", "eight", "nine"]\nTEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen",\n         "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]\nTENS = ["", "ten", "twenty", "thirty", "forty", "fifty"]\n\nQUOTES = ["practice makes perfect"]   # TODO: 더 추가\n\n\ndef say_number(n):\n    if n < 10:\n        return ONES[n]\n    if n < 20:\n        return TEENS[n - 10]\n    return TENS[n // 10] + " " + ONES[n % 10]\n\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport speech\nimport audio\nimport random\n\nONES = ["zero", "one", "two", "three", "four",\n        "five", "six", "seven", "eight", "nine"]\nTEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen",\n         "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]\nTENS = ["", "ten", "twenty", "thirty", "forty", "fifty"]\n\nQUOTES = [\n    "practice makes perfect",\n    "never give up",\n    "small steps every day",\n    "mistakes help you learn",\n]\n\n\ndef say_number(n):\n    if n < 10:\n        return ONES[n]\n    if n < 20:\n        return TEENS[n - 10]\n    if n < 60:\n        return TENS[n // 10] + " " + ONES[n % 10]\n    return "many"\n\n\nsleeping = False\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    if accelerometer.is_gesture("face down"):\n        if not sleeping:\n            sleeping = True\n            display.off()\n        sleep(200)\n        continue\n\n    if sleeping:\n        sleeping = False\n        display.on()\n        display.show(Image.HAPPY)\n        audio.play(Sound.HELLO)\n        display.show(Image.ASLEEP)\n\n    if button_a.was_pressed():\n        display.show(Image.HAPPY)\n        speech.say("The temperature is " + say_number(temperature()) + " degrees")\n        display.show(Image.ASLEEP)\n\n    if button_b.was_pressed():\n        m = running_time() // 60000\n        display.show(Image.ALL_CLOCKS, delay=40)\n        speech.say("I have been running for " + say_number(m) + " minutes")\n        display.show(Image.ASLEEP)\n\n    if microphone.was_event(SoundEvent.LOUD):\n        display.show(Image.SURPRISED)\n        speech.say("I heard you", pitch=100)\n        display.show(Image.ASLEEP)\n\n    if accelerometer.was_gesture("shake"):\n        display.show(Image.FABULOUS)\n        speech.say(random.choice(QUOTES), speed=90)\n        display.show(Image.ASLEEP)\n\n    sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: '<code>audio.play(Sound.GIGGLE)</code> 를 쓰려면?', options: ['<code>import audio</code> 만 필요', '<code>import sound</code> 가 필요', '아무것도 필요 없다', 'V1 에서도 잘 된다'], answer: 0,
            explain: '<code>import audio</code> 가 필요하고, <code>Sound</code> 는 <code>microbit</code> 모듈에 있어 따로 import 하지 않아도 됩니다. <b>V2 전용</b>입니다.'
          },
          {
            q: '<code>microphone.sound_level()</code> 의 값 범위는?', options: ['0 ~ 9', '0 ~ 100', '0 ~ 255', '0 ~ 1023'], answer: 2,
            explain: '<b>0 ~ 255</b> 입니다. 조용하면 작고 시끄러우면 큽니다.'
          },
          {
            q: '박수를 한 번 쳤는데 여러 번 세어질 때의 해결책은?', options: ['임계값을 낮춘다', '감지한 뒤 잠깐 <code>sleep()</code> 한다', '반복을 없앤다', '해결할 수 없다'], answer: 1,
            explain: '소리는 잠시 이어지므로 감지 직후 <b>잠깐 쉬어</b> 같은 소리를 다시 세지 않게 합니다. 버튼 채터링 방지와 같은 방법입니다.'
          },
          {
            q: '<code>microphone.was_event(SoundEvent.LOUD)</code> 는 제스처의 무엇과 같은 방식인가요?', options: ['<code>current_gesture()</code>', '<code>is_gesture()</code>', '<code>was_gesture()</code>', '<code>get_values()</code>'], answer: 2,
            explain: '<code>was_gesture()</code> 와 마찬가지로 “있었나?” 를 묻고 <b>확인하면 기록이 지워집니다</b>.'
          },
          {
            q: 'micro:bit <b>V1</b> 에서 <code>microphone.sound_level()</code> 을 실행하면?', options: ['정상 동작한다', '항상 0 이 나온다', '<code>AttributeError</code> 가 난다', '보드가 꺼진다'], answer: 2,
            explain: 'V1 에는 마이크가 없습니다. <code>microphone</code> · <code>audio.SoundEffect</code> · <code>Sound.*</code> 는 <b>V2 전용</b>입니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '효과음과 마이크 — 듣고 반응하기', subtitle: 'Chapter 12 · 말하기와 소리', badge: '2교시',
            notes: '<p>V2 전용 기능들입니다. V1 만 있는 교실이라면 시뮬레이터로 진행하세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'code', title: '내장 효과음 10가지', code: 'from microbit import *\nimport audio\n\naudio.play(Sound.GIGGLE)\naudio.play(Sound.HAPPY)\naudio.play(Sound.HELLO)\naudio.play(Sound.MYSTERIOUS)\naudio.play(Sound.SAD)',
            points: ['GIGGLE · HAPPY · HELLO · MYSTERIOUS · SAD', 'SLIDE · SOARING · SPRING · TWINKLE · YAWN', '<code>import audio</code> 필요', '<b>V2 전용</b>'],
            notes: '<p>10가지를 모두 들려주면 학생들이 각자 좋아하는 소리를 고릅니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '감정 표현 로봇', code: 'while True:\n    if button_a.was_pressed():\n        display.show(Image.HAPPY)\n        audio.play(Sound.HAPPY)\n    if accelerometer.was_gesture("shake"):\n        display.show(Image.SURPRISED)\n        audio.play(Sound.SPRING)\n    if pin_logo.is_touched():\n        display.show(Image.SILLY)\n        audio.play(Sound.GIGGLE)\n    sleep(50)',
            points: ['표정 + 소리 = <b>감정</b>', '로고를 만지면 간지럼', '3장 · 9장의 내용을 합침', '작은 로봇 캐릭터 만들기'],
            notes: '<p>지금까지 배운 것들이 자연스럽게 합쳐지는 예제입니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '효과음 직접 만들기', code: 'laser = audio.SoundEffect(\n    freq_start=2000,\n    freq_end=200,\n    duration=300,\n    waveform=audio.SoundEffect.WAVEFORM_SAWTOOTH,\n)\n\naudio.play(laser)',
            points: ['시작 · 끝 주파수 · 길이', '파형: SINE · SAWTOOTH · TRIANGLE · SQUARE · NOISE', '효과: VIBRATO · TREMOLO · WARBLE', '6장 pitch 보다 훨씬 풍부'],
            notes: '<p>파형을 바꿔 가며 들려주면 소리의 성질을 체험할 수 있습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '마이크로 소리 크기 재기', code: 'from microbit import *\n\nwhile True:\n    level = microphone.sound_level()   # 0 ~ 255\n    n = min(4, level // 52)\n    display.clear()\n    for y in range(n + 1):\n        for x in range(5):\n            display.set_pixel(x, 4 - y, 9)\n    sleep(100)',
            points: ['<code>sound_level()</code> = 0 ~ 255', '녹음은 안 되고 <b>크기만</b>', '막대그래프로 시각화', '🧭 센서 탭의 소리 슬라이더'],
            notes: '<p>실제 보드가 있으면 말하거나 손뼉을 쳐 보게 하세요. 반응이 즉각적입니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: 'SoundEvent — 소리 사건', code: 'while True:\n    if microphone.was_event(SoundEvent.LOUD):\n        display.show(Image.SURPRISED)\n        sleep(500)\n        display.show(Image.ASLEEP)\n    sleep(50)',
            points: ['<code>SoundEvent.LOUD</code> / <code>QUIET</code>', '<code>was_event()</code> = 제스처의 <code>was_gesture()</code> 와 같음', '임계값 비교를 대신해 줌', '<code>set_threshold()</code> 로 기준 조절'],
            notes: '<p>9장 제스처와 같은 구조라는 점을 짚으면 개념이 정리됩니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'practice', title: '실습 12-3. 소음 측정기', desc: '3초 이상 시끄러우면 경고, 조용하면 웃는 얼굴',
            starter: 'from microbit import *\nimport audio\n\nTHRESHOLD = 120\nloud_since = None\n\nwhile True:\n    level = microphone.sound_level()\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\nimport audio\n\nTHRESHOLD = 120\nloud_since = None\nwarnings = 0\n\nwhile True:\n    level = microphone.sound_level()\n\n    if level > THRESHOLD:\n        if loud_since is None:\n            loud_since = running_time()\n        elif running_time() - loud_since > 3000:\n            warnings += 1\n            display.show(Image.ANGRY)\n            audio.play(Sound.SAD)\n            sleep(1000)\n            loud_since = None\n    else:\n        loud_since = None\n        n = min(4, level // 52)\n        display.clear()\n        for y in range(n + 1):\n            for x in range(5):\n                display.set_pixel(x, 4 - y, 9)\n\n    sleep(100)\n',
            notes: '<p>실제로 교실에 두고 써 보면 학생들이 스스로 조용해지는 효과가 있습니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '12장 정리', bullets: ['<code>speech.say()</code> · pitch · speed · mouth · throat', '<code>translate()</code> / <code>pronounce()</code> / <code>sing()</code>', '<code>audio.play(Sound.GIGGLE)</code> · <code>SoundEffect</code>', '<code>microphone.sound_level()</code> 0~255', '<code>SoundEvent.LOUD</code> · <code>was_event()</code> · <b>V2 전용</b>'],
            notes: '<p>12장 정리. 다음 장 예고: 통신 — micro:bit 끼리 이야기하기.</p><p>과제: 실습 12-4 말하는 도우미 완성.</p><p>시간: 2분</p>'
          }
        ]
      }
    ]
  });
})();
