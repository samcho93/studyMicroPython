/* Chapter 06. 음악 — 소리를 내 보자
 * 원본: MicroPython on the BBC micro:bit — Music
 */
(function () {
  const FIG_WAVE = `<svg viewBox="0 0 1280 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">소리의 높이 = 1초에 떨리는 횟수 (주파수, Hz)</text>
  ${[['낮은 도 (C3) · 131Hz', 2, 'var(--accent)'], ['가운데 도 (C4) · 262Hz', 4, 'var(--ok)'], ['높은 도 (C5) · 523Hz', 8, 'var(--danger)']]
      .map(([label, n, color], i) => {
        const y = 90 + i * 90;
        let d = `M180,${y}`;
        for (let k = 0; k <= 240; k++) {
          const x = 180 + k * 3.3;
          d += ` L${x.toFixed(1)},${(y - Math.sin(k / 240 * n * Math.PI * 2) * 32).toFixed(1)}`;
        }
        return `<text x="170" y="${y + 6}" text-anchor="end" font-size="17" fill="${color}">${label}</text>
  <path d="${d}" fill="none" stroke="${color}" stroke-width="3"/>`;
      }).join('\n  ')}
  <text x="640" y="330" text-anchor="middle" font-size="20" fill="var(--fg)">떨림이 <tspan font-weight="bold">빠를수록</tspan> 높은 소리, <tspan font-weight="bold">느릴수록</tspan> 낮은 소리</text>
  <text x="640" y="362" text-anchor="middle" font-size="19" fill="var(--muted)">한 옥타브 올라가면 주파수는 정확히 <tspan font-weight="bold">2배</tspan> 가 됩니다 (262 → 523)</text>
</svg>`;

  const FIG_NOTE = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="36" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">음표 문자열의 구조 — 'c4:4'</text>
  <text x="400" y="130" font-size="72" font-family="monospace" font-weight="bold" fill="var(--accent)">c</text>
  <text x="480" y="130" font-size="72" font-family="monospace" font-weight="bold" fill="var(--accent2)">4</text>
  <text x="530" y="130" font-size="72" font-family="monospace" fill="var(--muted)">:</text>
  <text x="575" y="130" font-size="72" font-family="monospace" font-weight="bold" fill="var(--ok)">4</text>
  <line x1="412" y1="150" x2="412" y2="200" stroke="var(--accent)" stroke-width="3"/>
  <text x="412" y="228" text-anchor="middle" font-size="21" font-weight="bold" fill="var(--accent)">음 이름</text>
  <text x="412" y="256" text-anchor="middle" font-size="17" fill="var(--muted)">a b c d e f g</text>
  <text x="412" y="280" text-anchor="middle" font-size="17" fill="var(--muted)">(라 시 도 레 미 파 솔)</text>
  <text x="412" y="308" text-anchor="middle" font-size="17" fill="var(--muted)">r = 쉼표</text>
  <text x="412" y="336" text-anchor="middle" font-size="17" fill="var(--muted)"># 올림, b 내림</text>
  <line x1="496" y1="150" x2="496" y2="200" stroke="var(--accent2)" stroke-width="3"/>
  <text x="620" y="228" text-anchor="middle" font-size="21" font-weight="bold" fill="var(--accent2)">옥타브 (생략 가능)</text>
  <text x="620" y="256" text-anchor="middle" font-size="17" fill="var(--muted)">4 = 가운데 옥타브</text>
  <text x="620" y="280" text-anchor="middle" font-size="17" fill="var(--muted)">숫자가 클수록 높은 소리</text>
  <text x="620" y="308" text-anchor="middle" font-size="17" fill="var(--muted)">생략하면 앞 음과 같음</text>
  <line x1="592" y1="150" x2="592" y2="200" stroke="var(--ok)" stroke-width="3"/>
  <text x="900" y="228" text-anchor="middle" font-size="21" font-weight="bold" fill="var(--ok)">길이 (생략 가능)</text>
  <text x="900" y="256" text-anchor="middle" font-size="17" fill="var(--muted)">몇 박자인지 (기본 4)</text>
  <text x="900" y="280" text-anchor="middle" font-size="17" fill="var(--muted)">숫자가 클수록 길게</text>
  <text x="900" y="308" text-anchor="middle" font-size="17" fill="var(--muted)">생략하면 앞 음과 같음</text>
  <rect x="120" y="352" width="1040" height="38" rx="8" fill="var(--code-bg)" stroke="var(--line)" stroke-width="2"/>
  <text x="640" y="378" text-anchor="middle" font-size="19" font-family="monospace" fill="var(--fg)">['c4:4', 'e', 'g', 'c5:8']  →  도(4박) 미(4박) 솔(4박) 높은도(8박)</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch06',
    no: '06',
    title: '음악 — 소리를 내 보자',
    subtitle: 'music 모듈 · 내장 멜로디 · 음표 · 직접 작곡 · pitch',
    summary: 'micro:bit V2 의 내장 스피커(또는 연결한 부저)로 소리를 냅니다. music 모듈의 21가지 내장 멜로디를 재생하고, 음표 문자열로 직접 곡을 적어 연주하며, pitch() 로 주파수를 직접 다뤄 사이렌 · 효과음을 만듭니다. 소리가 무엇인지, 주파수와 음 높이의 관계도 함께 배웁니다.',
    goals: [
      '<code>music.play()</code> 로 내장 멜로디를 재생할 수 있다',
      '음표 문자열(<code>\'c4:4\'</code>)의 구조를 설명하고 직접 곡을 적을 수 있다',
      '<code>set_tempo()</code> 로 빠르기를 조절할 수 있다',
      '<code>music.pitch()</code> 로 주파수를 직접 지정해 효과음을 만들 수 있다',
      '<code>wait=False</code> 로 음악과 화면을 동시에 다룰 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch06-1',
        title: 'music 모듈 — 내장 멜로디와 음표',
        minutes: 45,
        goals: [
          '소리의 높이가 주파수라는 것을 설명할 수 있다',
          '<code>import music</code> 후 내장 멜로디를 재생할 수 있다',
          '음표 문자열의 구조를 이해하고 간단한 곡을 적을 수 있다',
          '<code>wait</code> · <code>loop</code> 옵션을 활용할 수 있다'
        ],
        flow: [['소리란 무엇인가', 8], ['내장 멜로디', 10], ['음표 문자열', 16], ['옵션 활용', 8], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '소리는 떨림입니다' },
          { type: 'p', html: '소리는 공기의 <b>떨림(진동)</b> 입니다. 1초에 몇 번 떨리는지를 <b>주파수</b>라고 하고 <b>헤르츠(Hz)</b> 로 셉니다. 떨림이 빠를수록(주파수가 높을수록) <b>높은 소리</b>가 납니다.' },
          { type: 'figure', html: FIG_WAVE, caption: '그림 6-1. 주파수와 음 높이' },
          {
            type: 'table', head: ['음', '주파수(Hz)', '음', '주파수(Hz)'], rows: [
              ['도 (C4)', '262', '솔 (G4)', '392'],
              ['레 (D4)', '294', '라 (A4)', '440'],
              ['미 (E4)', '330', '시 (B4)', '494'],
              ['파 (F4)', '349', '높은 도 (C5)', '523']
            ], caption: '표 6-1. 가운데 옥타브의 음과 주파수'
          },
          { type: 'callout', kind: 'more', title: '왜 라(A4) 가 440Hz 일까?', html: '<p>오케스트라가 조율할 때 기준으로 삼는 음이 <b>A4 = 440Hz</b> 입니다. 1939년 국제 회의에서 정해졌고, 지금도 세계 표준입니다.</p><p>한 옥타브 위는 정확히 <b>2배</b>(880Hz), 아래는 절반(220Hz) 입니다. 그 사이를 12등분한 것이 우리가 쓰는 12음계입니다.</p>' },

          { type: 'h', text: 'micro:bit 에서 소리 내기' },
          { type: 'p', html: 'micro:bit <b>V2</b> 에는 <b>내장 스피커</b>가 있어 아무것도 연결하지 않아도 소리가 납니다. <b>V1</b> 에서는 <code>P0</code> 과 <code>GND</code> 에 이어폰이나 부저를 연결해야 합니다.' },
          {
            type: 'code', title: '예제 6-1. 첫 소리', code: `from microbit import *
import music

music.play(music.NYAN)`,
            desc: '<code>import music</code> 이 필요합니다(<code>from microbit import *</code> 로는 안 옵니다). <code>music.NYAN</code> 은 내장 멜로디 중 하나입니다. <b>브라우저 음량을 켜 두세요.</b>',
            expect: '냥캣 멜로디가 재생됩니다.'
          },
          {
            type: 'table', head: ['이름', '설명', '이름', '설명'], rows: [
              ['<code>music.DADADADUM</code>', '베토벤 운명 교향곡', '<code>music.NYAN</code>', '냥캣'],
              ['<code>music.ENTERTAINER</code>', '디 엔터테이너', '<code>music.RINGTONE</code>', '전화벨'],
              ['<code>music.PRELUDE</code>', '바흐 전주곡', '<code>music.FUNK</code>', '펑크 베이스'],
              ['<code>music.ODE</code>', '환희의 송가', '<code>music.BLUES</code>', '블루스'],
              ['<code>music.BIRTHDAY</code>', '생일 축하합니다', '<code>music.WEDDING</code>', '결혼 행진곡'],
              ['<code>music.FUNERAL</code>', '장송 행진곡', '<code>music.PUNCHLINE</code>', '개그 효과음'],
              ['<code>music.PYTHON</code>', '몬티 파이선 테마', '<code>music.BADDY</code>', '악당 등장'],
              ['<code>music.CHASE</code>', '추격전', '<code>music.BA_DING</code>', '띠링 (알림)'],
              ['<code>music.WAWAWAWAA</code>', '실패 효과음', '<code>music.JUMP_UP</code>', '점프 위로'],
              ['<code>music.JUMP_DOWN</code>', '점프 아래로', '<code>music.POWER_UP</code>', '아이템 획득'],
              ['<code>music.POWER_DOWN</code>', '파워 감소', '', '']
            ], caption: '표 6-2. 내장 멜로디 21가지'
          },
          {
            type: 'code', title: '예제 6-2. 멜로디 골라 듣기', code: `from microbit import *
import music

tunes = [music.BIRTHDAY, music.ODE, music.BA_DING,
         music.POWER_UP, music.WAWAWAWAA]
names = ["BIRTHDAY", "ODE", "BA_DING", "POWER_UP", "WAWAWAWAA"]
index = 0

display.scroll(names[index], delay=60)

while True:
    if button_a.was_pressed():
        index = (index + 1) % len(tunes)
        display.scroll(names[index], delay=60)
    if button_b.was_pressed():
        display.show(Image.MUSIC_QUAVER)
        music.play(tunes[index])
        display.clear()
    sleep(50)`,
            desc: 'A 로 곡을 고르고 B 로 재생합니다. 4장에서 배운 <b>상태 변수 + 순환</b> 패턴을 그대로 썼습니다.',
            expect: 'A 로 곡을 고르고 B 를 누르면 재생됩니다.'
          },
          { type: 'callout', kind: 'board', title: 'V1 에서 소리 내기', html: 'micro:bit V1 에는 스피커가 없습니다. <b>P0</b> 과 <b>GND</b> 에 악어클립으로 이어폰이나 작은 부저를 연결하면 같은 코드로 소리가 납니다. V2 에서도 <code>music.play(곡, pin=pin0)</code> 로 바깥 부저를 쓸 수 있습니다.' },

          { type: 'h', text: '음표 문자열 — 직접 곡 적기' },
          { type: 'p', html: '내장 멜로디는 사실 <b>문자열 리스트</b>입니다. 우리도 같은 방식으로 곡을 적을 수 있습니다.' },
          { type: 'figure', html: FIG_NOTE, caption: '그림 6-2. 음표 문자열의 구조' },
          {
            type: 'code', repl: true, title: '셸에서 내장 멜로디 들여다보기', code: `import music
music.BA_DING
music.BIRTHDAY`,
            desc: '내장 멜로디도 우리가 쓸 수 있는 문자열 리스트일 뿐입니다. 어떻게 적혀 있는지 확인해 보세요.',
            expect: ">>> music.BA_DING\n['b5:1', 'e6:3']"
          },
          {
            type: 'code', title: '예제 6-3. 도레미파솔라시도', code: `from microbit import *
import music

scale = ['c4:4', 'd', 'e', 'f', 'g', 'a', 'b', 'c5']
music.play(scale)`,
            desc: '첫 음에서 옥타브(<code>4</code>)와 길이(<code>:4</code>)를 정하면, 뒤의 음들은 <b>생략해도 그대로 이어집니다</b>. 마지막 <code>c5</code> 는 한 옥타브 위의 도입니다.',
            expect: '도 레 미 파 솔 라 시 도 가 차례로 연주됩니다.'
          },
          {
            type: 'code', title: '예제 6-4. 반짝반짝 작은 별', code: `from microbit import *
import music

twinkle = ['c4:4', 'c', 'g', 'g', 'a', 'a', 'g:8',
           'f:4', 'f', 'e', 'e', 'd', 'd', 'c:8']

display.show(Image.MUSIC_QUAVER)
music.play(twinkle)
display.clear()`,
            desc: '<code>:8</code> 은 다른 음의 두 배 길이입니다. 쉼표는 <code>\'r\'</code> (rest) 로 적습니다. 여러 줄로 나눠 쓰면 악보처럼 읽기 좋습니다.',
            expect: '반짝반짝 작은 별이 연주됩니다.'
          },
          {
            type: 'table', head: ['표기', '뜻', '예'], rows: [
              ['<code>a</code> ~ <code>g</code>', '음 이름 (라 시 도 레 미 파 솔)', '<code>\'c\'</code> = 도'],
              ['<code>r</code>', '쉼표 (소리 없음)', '<code>\'r:2\'</code> = 2박 쉬기'],
              ['<code>#</code>', '반음 올림 (샾)', '<code>\'c#4:4\'</code> = 도♯'],
              ['<code>b</code>', '반음 내림 (플랫)', '<code>\'eb4:4\'</code> = 미♭'],
              ['숫자 (음 뒤)', '옥타브 (기본 4)', '<code>\'c5\'</code> = 한 옥타브 위 도'],
              ['<code>:</code> 뒤 숫자', '길이 (기본 4)', '<code>\'c:8\'</code> = 두 배 길게']
            ]
          },
          { type: 'callout', kind: 'warn', title: '플랫(b) 과 시(b) 헷갈리지 않기', html: '<code>\'b\'</code> 하나만 쓰면 <b>시</b> 음입니다. 플랫은 <b>음 이름 뒤에</b> 붙습니다 — <code>\'eb\'</code> 는 “미 플랫”이고 <code>\'e\'</code> 다음의 <code>\'b\'</code> 가 아닙니다.' },

          { type: 'h', text: '빠르기 조절 — set_tempo()' },
          {
            type: 'code', title: '예제 6-5. 빠르기 바꿔 보기', code: `from microbit import *
import music

tune = ['c4:4', 'd', 'e', 'f', 'g', 'a', 'b', 'c5']

display.scroll("SLOW", delay=60)
music.set_tempo(ticks=4, bpm=60)      # 느리게
music.play(tune)

display.scroll("FAST", delay=60)
music.set_tempo(ticks=4, bpm=240)     # 빠르게
music.play(tune)

music.reset()                          # 기본값으로 되돌리기`,
            desc: '<code>bpm</code>(beats per minute) 은 1분에 몇 박인지, <code>ticks</code> 는 한 박을 몇 조각으로 나눌지입니다. 기본값은 <code>ticks=4, bpm=120</code> 입니다. <code>music.reset()</code> 으로 기본값으로 되돌립니다.',
            expect: '같은 음계가 느리게 한 번, 빠르게 한 번 연주됩니다.'
          },
          {
            type: 'code', title: '예제 6-6. 음악과 화면을 동시에', code: `from microbit import *
import music

# wait=False → 음악이 흐르는 동안 다음 줄이 바로 실행된다
music.play(music.NYAN, wait=False, loop=True)

while True:
    display.show(Image.MUSIC_QUAVER)
    sleep(200)
    display.show(Image.MUSIC_CROTCHET)
    sleep(200)
    if button_a.was_pressed():
        music.stop()
        display.clear()
        break`,
            desc: '<code>wait=False</code> 는 “곡이 끝날 때까지 기다리지 말라”, <code>loop=True</code> 는 “끝없이 반복”입니다. 음악이 흐르는 동안 화면 애니메이션이 함께 돌아갑니다. A 를 누르면 <code>music.stop()</code> 으로 멈추고 <code>break</code> 로 반복을 빠져나갑니다.',
            expect: '냥캣이 반복 재생되며 음표가 깜빡입니다. A 를 누르면 멈춥니다.'
          },
          {
            type: 'table', head: ['옵션 · 함수', '하는 일'], rows: [
              ['<code>music.play(곡)</code>', '곡을 재생합니다 (끝날 때까지 기다림)'],
              ['<code>wait=False</code>', '기다리지 않고 바로 다음 줄로'],
              ['<code>loop=True</code>', '끝없이 반복'],
              ['<code>pin=pin1</code>', '다른 핀으로 소리 내기 (기본 <code>pin0</code>)'],
              ['<code>music.stop()</code>', '재생 중인 음악을 멈춤'],
              ['<code>music.set_tempo(ticks, bpm)</code>', '빠르기 설정'],
              ['<code>music.get_tempo()</code>', '현재 빠르기 읽기'],
              ['<code>music.reset()</code>', '빠르기를 기본값으로']
            ]
          },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 내장 멜로디 전부 들어 보기', code: `from microbit import *
import music

TUNES = [
    ("DADADADUM", music.DADADADUM), ("ENTERTAINER", music.ENTERTAINER),
    ("PRELUDE", music.PRELUDE), ("ODE", music.ODE),
    ("NYAN", music.NYAN), ("RINGTONE", music.RINGTONE),
    ("FUNK", music.FUNK), ("BLUES", music.BLUES),
    ("BIRTHDAY", music.BIRTHDAY), ("WEDDING", music.WEDDING),
    ("FUNERAL", music.FUNERAL), ("PUNCHLINE", music.PUNCHLINE),
    ("PYTHON", music.PYTHON), ("BADDY", music.BADDY),
    ("CHASE", music.CHASE), ("BA_DING", music.BA_DING),
    ("WAWAWAWAA", music.WAWAWAWAA), ("JUMP_UP", music.JUMP_UP),
    ("JUMP_DOWN", music.JUMP_DOWN), ("POWER_UP", music.POWER_UP),
    ("POWER_DOWN", music.POWER_DOWN),
]

print("내장 멜로디:", len(TUNES), "개")

for name, tune in TUNES:
    display.scroll(name, delay=45)
    music.play(tune)
    sleep(400)

display.show(Image.YES)`,
            desc: '21가지를 이름과 함께 차례로 들려줍니다. 마음에 드는 것을 골라 게임 효과음으로 써 보세요. 도중에 멈추려면 <b>■ 정지</b>를 누르세요.',
            expect: '내장 멜로디: 21 개\n(이름이 흐른 뒤 그 곡이 재생됩니다)'
          },
          {
            type: 'code', title: '더 해 보기 ②. 옥타브를 바꿔 들어 보기', code: `from microbit import *
import music

SCALE = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'c']

for octave in [3, 4, 5, 6]:
    display.show(octave)
    # 첫 음에만 옥타브를 적으면 나머지가 따라온다
    tune = [SCALE[0] + str(octave) + ':2'] + SCALE[1:]
    print(octave, "옥타브:", tune)
    music.play(tune)
    sleep(400)

display.clear()`,
            desc: '같은 도레미를 옥타브만 바꿔 들어 봅니다. 한 옥타브 올라갈 때마다 <b>주파수가 2배</b>가 되어 훨씬 높게 들립니다. 3옥타브는 낮고 6옥타브는 아주 높습니다.',
            expect: "3 옥타브: ['c3:2', 'd', 'e', 'f', 'g', 'a', 'b', 'c']\n(낮은 도레미 → 점점 높은 도레미)"
          },
          {
            type: 'code', title: '더 해 보기 ③. 쉼표와 박자 실험', code: `from microbit import *
import music

display.scroll("NO REST", delay=60)
music.play(['c4:2', 'c', 'c', 'c'])
sleep(600)

display.scroll("REST", delay=60)
music.play(['c4:2', 'r', 'c', 'r', 'c', 'r', 'c'])
sleep(600)

display.scroll("LONG", delay=60)
music.play(['c4:1', 'c:1', 'c:8', 'c:1', 'c:1', 'c:8'])

display.clear()`,
            desc: '같은 “도” 만 쓰는데도 <b>쉼표(<code>r</code>)</b>와 <b>길이</b>를 바꾸면 완전히 다른 리듬이 됩니다. 음의 높이만큼이나 리듬이 중요하다는 것을 느낄 수 있습니다.',
            expect: '같은 음이 세 가지 리듬으로 연주됩니다.'
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '소리의 높이는 <b>주파수(Hz)</b> 입니다. 한 옥타브 위는 주파수가 <b>2배</b>.',
              '<code>import music</code> 후 <code>music.play(music.NYAN)</code> 처럼 내장 멜로디 21가지를 재생합니다.',
              '음표 문자열: <code>\'음이름 + 옥타브 : 길이\'</code> — 예: <code>\'c4:4\'</code>. 옥타브와 길이는 <b>생략하면 앞 음과 같습니다</b>.',
              '<code>\'r\'</code> = 쉼표, <code>#</code> = 올림, <code>b</code> = 내림.',
              '<code>music.set_tempo(ticks, bpm)</code> 로 빠르기를, <code>wait=False</code> · <code>loop=True</code> 로 동작 방식을 바꿉니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 6-1. 나만의 짧은 곡',
            level: 1,
            desc: '<p>아는 노래의 첫 소절을 음표 문자열로 적어 연주해 보세요. (동요, 교가, 게임 음악 등)</p><p>아래 <b>학교 종</b> 악보를 참고하세요.</p><pre>솔 솔 라 라 | 솔 솔 미 | 솔 솔 미 미 | 레 —</pre><p>연주하는 동안 LED 화면에 음표 그림을 보여 주면 더 좋습니다.</p>',
            hint: '솔 = <code>g</code>, 라 = <code>a</code>, 미 = <code>e</code>, 레 = <code>d</code>. 첫 음에 옥타브와 길이를 정하고(<code>\'g4:4\'</code>) 나머지는 음 이름만 적습니다. 긴 음은 <code>\'d:8\'</code>.',
            starter: 'from microbit import *\nimport music\n\nsong = [\'g4:4\']   # TODO: 이어서 적기\n\ndisplay.show(Image.MUSIC_QUAVER)\nmusic.play(song)\ndisplay.clear()\n',
            solution: 'from microbit import *\nimport music\n\n# 학교 종이 땡땡땡\nsong = [\'g4:4\', \'g\', \'a\', \'a\', \'g\', \'g\', \'e:8\',\n        \'g:4\', \'g\', \'e\', \'e\', \'d:8\']\n\ndisplay.show(Image.MUSIC_QUAVER)\nmusic.play(song)\ndisplay.clear()\n'
          },
          {
            title: '실습 6-2. 버튼 피아노',
            level: 2,
            desc: '<p>버튼과 터치로 연주하는 작은 피아노를 만드세요.</p><ul><li>A → 도(<code>\'c4:2\'</code>), B → 미(<code>\'e4:2\'</code>), A+B 동시 → 솔(<code>\'g4:2\'</code>)</li><li>로고 터치 → 높은 도(<code>\'c5:2\'</code>)</li><li>소리를 낼 때마다 화면에 다른 그림을 보여 줍니다</li></ul>',
            hint: '동시 누름 조건을 <b>맨 위</b>에 두어야 합니다. <code>music.play([\'c4:2\'])</code> 처럼 리스트로 감싸거나 문자열 하나만 줘도 됩니다.',
            starter: 'from microbit import *\nimport music\n\nwhile True:\n    # TODO\n    sleep(30)\n',
            solution: 'from microbit import *\nimport music\n\nwhile True:\n    a = button_a.is_pressed()\n    b = button_b.is_pressed()\n\n    if a and b:\n        display.show(Image.DIAMOND)\n        music.play(\'g4:2\')\n    elif a:\n        display.show(Image.ARROW_W)\n        music.play(\'c4:2\')\n    elif b:\n        display.show(Image.ARROW_E)\n        music.play(\'e4:2\')\n    elif pin_logo.is_touched():\n        display.show(Image.HEART)\n        music.play(\'c5:2\')\n    else:\n        display.clear()\n    sleep(30)\n'
          }
        ],
        quiz: [
          {
            q: '음악을 쓰려면 무엇이 필요한가요?', options: ['<code>from microbit import *</code> 만 있으면 된다', '<code>import music</code> 가 따로 필요하다', '<code>import sound</code>', '아무것도 필요 없다'], answer: 1,
            explain: '<code>music</code> 은 별도의 모듈이므로 <code>import music</code> 을 따로 써야 합니다.'
          },
          {
            q: '<code>[\'c4:4\', \'e\', \'g\']</code> 에서 <code>\'e\'</code> 와 <code>\'g\'</code> 의 옥타브와 길이는?', options: ['옥타브 0, 길이 0', '옥타브 4, 길이 4 (앞 음과 같음)', '오류가 난다', '무작위'], answer: 1,
            explain: '옥타브와 길이를 생략하면 <b>앞 음의 값이 그대로 이어집니다</b>. 그래서 모두 4옥타브 4박입니다.'
          },
          {
            q: '<code>\'r:4\'</code> 는 무엇인가요?', options: ['레 음', '쉼표(소리 없이 4박)', '반복', '오류'], answer: 1,
            explain: '<code>r</code> 은 rest, 즉 <b>쉼표</b>입니다. 소리 없이 그 길이만큼 쉽니다.'
          },
          {
            q: '음악이 흐르는 동안 화면도 움직이게 하려면?', options: ['<code>music.play(곡, loop=True)</code>', '<code>music.play(곡, wait=False)</code>', '<code>music.play(곡, pin=pin1)</code>', '불가능하다'], answer: 1,
            explain: '<code>wait=False</code> 는 곡이 끝날 때까지 기다리지 않고 바로 다음 줄을 실행합니다.'
          },
          {
            q: '한 옥타브 위의 음은 주파수가 몇 배가 되나요?', options: ['1.5배', '2배', '4배', '12배'], answer: 1,
            explain: '정확히 <b>2배</b> 입니다. 라(A4) 440Hz → 라(A5) 880Hz.'
          }
        ],
        slides: [
          {
            layout: 'title', title: 'music 모듈 — 내장 멜로디와 음표', subtitle: 'Chapter 06 · 음악', badge: '1교시',
            notes: '<p>소리가 나는 수업이라 분위기가 살아납니다. 교실 음량과 이어폰 준비를 미리 확인하세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'diagram', title: '소리 = 떨림 = 주파수', html: FIG_WAVE, caption: '빠르게 떨릴수록 높은 소리',
            notes: '<p>과학 시간의 소리 단원과 연결하면 좋습니다. 고무줄이나 자를 튕겨 보여 주면 직관적입니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: '첫 소리', code: 'from microbit import *\nimport music\n\nmusic.play(music.NYAN)',
            points: ['<code>import music</code> 이 <b>따로</b> 필요', 'V2 는 <b>내장 스피커</b>', 'V1 은 P0 + GND 에 부저 연결', '브라우저 음량 확인!'],
            notes: '<p>여러 멜로디를 차례로 들려주면 학생들이 좋아합니다. BIRTHDAY, WEDDING, FUNERAL 조합이 웃음 포인트입니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'table', title: '내장 멜로디 (일부)', head: ['이름', '설명'], rows: [
              ['<code>NYAN</code>', '냥캣'], ['<code>BIRTHDAY</code>', '생일 축하합니다'],
              ['<code>ODE</code>', '환희의 송가'], ['<code>BA_DING</code>', '띠링 (알림)'],
              ['<code>POWER_UP</code>', '아이템 획득'], ['<code>WAWAWAWAA</code>', '실패 효과음']],
            notes: '<p>모두 21가지입니다. 게임 효과음(POWER_UP, WAWAWAWAA, JUMP_UP)은 나중 프로젝트에서 쓸 수 있다고 알려 주세요.</p><p>시간: 5분</p>'
          },
          {
            layout: 'diagram', title: '음표 문자열 구조', html: FIG_NOTE, caption: '음이름 + 옥타브 : 길이',
            notes: '<p>음악 시간에 배운 계이름과 연결합니다. c = 도 라는 점(고정도법)을 짚어 주세요.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '반짝반짝 작은 별', code: 'from microbit import *\nimport music\n\ntwinkle = [\'c4:4\', \'c\', \'g\', \'g\', \'a\', \'a\', \'g:8\',\n           \'f:4\', \'f\', \'e\', \'e\', \'d\', \'d\', \'c:8\']\n\nmusic.play(twinkle)',
            points: ['옥타브 · 길이는 <b>생략하면 앞과 같음</b>', '<code>:8</code> = 두 배 길게', '<code>\'r\'</code> = 쉼표', '여러 줄로 나눠 쓰면 악보처럼'],
            notes: '<p>학생들이 각자 아는 노래를 적어 보게 합니다. 음악 교과서를 참고해도 좋습니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'code', title: '음악과 화면을 동시에', code: 'from microbit import *\nimport music\n\nmusic.play(music.NYAN, wait=False, loop=True)\n\nwhile True:\n    display.show(Image.MUSIC_QUAVER)\n    sleep(200)\n    display.show(Image.MUSIC_CROTCHET)\n    sleep(200)\n    if button_a.was_pressed():\n        music.stop()\n        break',
            points: ['<code>wait=False</code> = 기다리지 않기', '<code>loop=True</code> = 반복', '<code>music.stop()</code> 으로 정지', '<code>break</code> 로 반복 빠져나가기'],
            notes: '<p>break 는 여기서 처음 나옵니다. "반복을 즉시 빠져나가는 명령" 이라고 설명하세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'practice', title: '실습 6-1. 나만의 짧은 곡', desc: '아는 노래의 첫 소절을 음표 문자열로 적어 연주하세요.',
            starter: 'from microbit import *\nimport music\n\nsong = [\'g4:4\']   # TODO\n\nmusic.play(song)\n',
            solution: 'from microbit import *\nimport music\n\n# 학교 종이 땡땡땡\nsong = [\'g4:4\', \'g\', \'a\', \'a\', \'g\', \'g\', \'e:8\',\n        \'g:4\', \'g\', \'e\', \'e\', \'d:8\']\n\ndisplay.show(Image.MUSIC_QUAVER)\nmusic.play(song)\ndisplay.clear()\n',
            notes: '<p>완성한 학생의 곡을 교사 화면에서 재생해 발표하면 즐겁습니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['소리 = 떨림, 높이 = 주파수(Hz)', '<code>import music</code> → <code>music.play(music.NYAN)</code>', '음표: <code>\'c4:4\'</code> = 음이름+옥타브:길이', '생략하면 앞 음과 같음 · <code>r</code> 쉼표', '<code>wait=False</code> · <code>loop=True</code> · <code>set_tempo()</code>'],
            notes: '<p>다음 시간 예고: 주파수를 직접 다뤄 효과음 만들기.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch06-2',
        title: 'pitch — 주파수를 직접 다루기',
        minutes: 45,
        goals: [
          '<code>music.pitch()</code> 로 주파수를 직접 지정할 수 있다',
          '사이렌 · 효과음처럼 연속적으로 변하는 소리를 만들 수 있다',
          '센서 값을 소리로 바꾸는 프로그램을 만들 수 있다',
          '스피커 제어와 음량 조절을 할 수 있다'
        ],
        flow: [['pitch 기본', 10], ['변하는 소리', 14], ['센서 → 소리', 12], ['스피커 제어', 6], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: 'music.pitch() — 주파수를 직접' },
          { type: 'p', html: '<code>music.play()</code> 가 “악보”라면 <code>music.pitch()</code> 는 “<b>이 주파수로 소리 내라</b>” 는 직접 명령입니다. 음계에 없는 소리, 서서히 변하는 소리를 만들 때 씁니다.' },
          {
            type: 'code', title: '예제 6-7. pitch 기본', code: `from microbit import *
import music

music.pitch(440, 1000)      # 440Hz(라) 를 1초 동안
sleep(500)
music.pitch(880, 1000)      # 한 옥타브 위 라
sleep(500)
music.pitch(220, 1000)      # 한 옥타브 아래 라`,
            desc: '<code>music.pitch(주파수, 길이ms)</code>. 같은 “라” 인데 주파수가 2배, 절반일 때 어떻게 들리는지 확인해 보세요.',
            expect: '라 → 높은 라 → 낮은 라 가 1초씩 납니다.'
          },
          {
            type: 'code', repl: true, title: '셸에서 주파수 실험', code: `import music
music.pitch(262, 500)
music.pitch(1000, 500)
music.pitch(50, 500)
music.pitch(5000, 300)`,
            desc: '아주 낮은 소리(50Hz)와 아주 높은 소리(5000Hz)도 들어 보세요. 사람이 들을 수 있는 범위는 대략 <b>20Hz ~ 20,000Hz</b> 입니다.',
            expect: '(각각 다른 높이의 소리가 납니다)'
          },
          { type: 'callout', kind: 'warn', title: 'duration 을 생략하면', html: '<code>music.pitch(440)</code> 처럼 길이를 빼면 <b>계속 소리가 납니다</b>. <code>music.stop()</code> 을 부를 때까지 멈추지 않습니다. 주의해서 쓰세요.' },

          { type: 'h', text: '변하는 소리 만들기' },
          {
            type: 'code', title: '예제 6-8. 사이렌', code: `from microbit import *
import music

while True:
    # 올라가는 소리
    for hz in range(400, 1000, 20):
        music.pitch(hz, 12)
    # 내려가는 소리
    for hz in range(1000, 400, -20):
        music.pitch(hz, 12)
    if button_a.was_pressed():
        music.stop()
        break`,
            desc: '짧은 소리를 아주 빠르게 이어 붙이면 <b>연속적으로 변하는 소리</b>가 됩니다. 구급차 사이렌 같은 소리가 납니다.',
            expect: '사이렌 소리가 반복됩니다. A 를 누르면 멈춥니다.'
          },
          {
            type: 'code', title: '예제 6-9. 게임 효과음 만들기', code: `from microbit import *
import music


def power_up():
    for hz in range(300, 1200, 60):
        music.pitch(hz, 20)


def power_down():
    for hz in range(1200, 300, -60):
        music.pitch(hz, 20)


def laser():
    for hz in range(2000, 200, -120):
        music.pitch(hz, 8)


while True:
    if button_a.was_pressed():
        display.show(Image.ARROW_N)
        power_up()
    if button_b.was_pressed():
        display.show(Image.ARROW_S)
        power_down()
    if pin_logo.is_touched():
        display.show(Image.TARGET)
        laser()
        sleep(200)
    sleep(50)`,
            desc: '효과음을 <b>함수</b>로 만들어 두면 게임에서 필요할 때마다 이름만 부르면 됩니다. 숫자를 바꿔 가며 나만의 효과음을 만들어 보세요.',
            expect: 'A → 상승음, B → 하강음, 로고 → 레이저 소리'
          },
          {
            type: 'code', title: '예제 6-10. 무작위 외계인 소리', code: `from microbit import *
import music
import random

while True:
    if button_a.was_pressed():
        display.show(Image.GHOST)
        for i in range(12):
            hz = random.randint(200, 2000)
            music.pitch(hz, random.randint(30, 90))
        display.clear()
    sleep(50)`,
            desc: '<code>random.randint(a, b)</code> 는 a 이상 b 이하의 정수를 무작위로 고릅니다(7장에서 자세히). 무작위 주파수를 이어 붙이면 외계인 · 로봇 소리가 됩니다.',
            expect: 'A 를 누르면 외계인 같은 소리가 납니다.',
            nondeterministic: true
          },

          { type: 'h', text: '센서를 소리로 바꾸기' },
          { type: 'p', html: '센서 값을 주파수로 바꾸면 <b>소리로 듣는 계측기</b>가 됩니다. 눈으로 보지 않아도 값의 변화를 알 수 있어 실제로 많이 쓰이는 방법입니다.' },
          {
            type: 'code', title: '예제 6-11. 기울기 테레민', code: `from microbit import *
import music

display.show(Image.MUSIC_QUAVER)

while True:
    x = accelerometer.get_x()                       # -1024 ~ 1024
    hz = scale(x, from_=(-1024, 1024), to=(200, 1200))
    music.pitch(hz, 40)`,
            hint: '🧭 <b>센서 탭</b>에서 기울기 판을 좌우로 천천히 끌어 보세요.',
            desc: '보드를 좌우로 기울이면 소리의 높이가 바뀝니다. 손의 움직임으로 연주하는 악기 <b>테레민</b> 과 비슷합니다. 5장에서 배운 <code>scale()</code> 을 썼습니다.',
            expect: '기울기에 따라 소리 높이가 변합니다.'
          },
          {
            type: 'code', title: '예제 6-12. 온도 알림음', code: `from microbit import *
import music

while True:
    t = temperature()
    display.show(str(t)[0])
    if t > 28:
        music.pitch(1500, 100)      # 더움 — 높은 경고음
        sleep(200)
        music.pitch(1500, 100)
    elif t < 10:
        music.pitch(300, 400)       # 추움 — 낮은 소리
    else:
        music.pitch(700, 80)        # 적당 — 짧은 신호
    sleep(1500)`,
            hint: '🧭 센서 탭의 온도 슬라이더를 움직여 보세요.',
            desc: '값의 범위에 따라 다른 소리를 냅니다. 온실, 냉장고 같은 실제 장치에서 쓰는 방식입니다.',
            expect: '온도에 따라 다른 알림음이 납니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 6-13. 빛 테레민 (조도 센서)', code: `from microbit import *
import music

while True:
    light = display.read_light_level()               # 0 ~ 255
    if light > 30:
        hz = scale(light, from_=(0, 255), to=(200, 2000))
        music.pitch(hz, 40)
    else:
        sleep(40)`,
            hint: '🧭 센서 탭의 <b>빛</b> 슬라이더를 움직여 보세요. 실제 보드에서는 손으로 화면을 가렸다 열었다 합니다.',
            desc: 'LED 화면 자체가 빛 센서 역할을 합니다. 손을 화면 위에서 움직이면 소리가 변해 진짜 테레민처럼 연주할 수 있습니다.',
            expect: '빛의 밝기에 따라 소리 높이가 변합니다.',
            nondeterministic: true
          },

          { type: 'h', text: '스피커 제어와 음량' },
          {
            type: 'table', head: ['명령', '하는 일'], rows: [
              ['<code>speaker.off()</code>', '내장 스피커 끄기 (P0 에 연결한 부저로만 소리)'],
              ['<code>speaker.on()</code>', '내장 스피커 켜기'],
              ['<code>speaker.is_on()</code>', '켜져 있는지 확인'],
              ['<code>set_volume(0~255)</code>', '음량 조절 (기본 127)']
            ]
          },
          {
            type: 'code', title: '예제 6-14. 음량 조절', code: `from microbit import *
import music

for v in [30, 100, 200, 255]:
    set_volume(v)
    display.show(str(v // 30))
    music.play(['c5:4', 'e', 'g'])
    sleep(300)

set_volume(127)
display.clear()`,
            desc: '<code>set_volume()</code> 은 micro:bit <b>V2</b> 에서만 됩니다. 0 은 무음, 255 가 가장 큽니다.',
            expect: '같은 음이 점점 크게 네 번 연주됩니다.'
          },
          { type: 'callout', kind: 'board', title: '이어폰 연결하기', html: '악어클립으로 <b>P0 ↔ 이어폰 끝(팁)</b>, <b>GND ↔ 이어폰 몸통(슬리브)</b> 를 연결하면 이어폰으로 들을 수 있습니다. 교실에서 여러 명이 동시에 실습할 때 아주 유용합니다. 이때는 <code>speaker.off()</code> 로 내장 스피커를 꺼 두세요.' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 주파수를 계산해서 음 만들기', code: `from microbit import *
import music

# 라(A4) = 440Hz 를 기준으로 반음씩 올린다
NAMES = ["A", "A#", "B", "C", "D#", "E", "F", "F#", "G", "G#"]

display.scroll("CALC", delay=60)

for n in range(13):                     # 한 옥타브 = 반음 12개
    hz = int(440 * (2 ** (n / 12)))     # 반음 하나 = 2의 12제곱근 배
    print(n, "반음 위 →", hz, "Hz")
    display.show(n % 10)
    music.pitch(hz, 250)
    sleep(80)

display.clear()`,
            desc: '반음 하나가 올라갈 때마다 주파수에 <code>2<sup>1/12</sup></code>(약 1.0595)를 곱합니다. 12번 곱하면 정확히 <b>2배</b>, 즉 한 옥타브가 됩니다. 수학과 음악이 만나는 지점입니다.',
            expect: '0 반음 위 → 440 Hz\n1 반음 위 → 466 Hz\n…\n12 반음 위 → 880 Hz'
          },
          {
            type: 'code', title: '더 해 보기 ②. 화음처럼 들리게 하기', code: `from microbit import *
import music


def chord(freqs, ms):
    """여러 음을 아주 빠르게 번갈아 내면 화음처럼 들린다"""
    t0 = running_time()
    while running_time() - t0 < ms:
        for f in freqs:
            music.pitch(f, 12)


display.show(Image.MUSIC_QUAVER)

chord([262, 330, 392], 1200)        # 도미솔 (C 장3화음)
sleep(300)
chord([262, 311, 392], 1200)        # 도미♭솔 (C 단3화음)
sleep(300)
chord([262, 330, 392, 523], 1500)   # 도미솔도

display.clear()`,
            desc: 'micro:bit 는 <b>한 번에 한 음</b>만 낼 수 있습니다. 하지만 아주 빠르게 번갈아 내면 사람 귀에는 <b>화음처럼</b> 들립니다. 밝은 장3화음과 어두운 단3화음의 차이를 느껴 보세요.',
            expect: '세 가지 화음이 차례로 들립니다.'
          },
          {
            type: 'code', title: '더 해 보기 ③. 소리에 맞춰 화면도 움직이기', code: `from microbit import *
import music

# (주파수, 화면에 켤 높이) 를 짝지어 둔다
NOTES = [(262, 0), (294, 1), (330, 2), (349, 3),
         (392, 4), (440, 3), (494, 2), (523, 1)]

while True:
    for hz, level in NOTES:
        display.clear()
        for x in range(5):
            display.set_pixel(x, 4 - level, 9)
        music.pitch(hz, 220)
    sleep(300)`,
            desc: '음이 높을수록 화면의 줄도 위로 올라갑니다. 소리를 <b>눈으로도</b> 볼 수 있어 음의 높낮이를 이해하는 데 도움이 됩니다.',
            expect: '음이 올라가면 가로줄도 위로 올라갑니다.'
          },

          { type: 'h', text: '🚀 응용 예제 — 소리로 만드는 것들' },
          { type: 'p', html: '악기 · 작곡기 · 퀴즈까지, 소리를 중심으로 한 프로그램들입니다. <b>브라우저 음량</b>을 켜고 실행하세요.' },
          {
            type: 'code', title: '응용 예제 6-1. 다섯 음 피아노', code: `from microbit import *
import music

# (입력, 음, 화면)
KEYS = [
    ("A", 262, Image("90000:90000:90000:90000:90000")),      # 도
    ("B", 330, Image("00900:00900:00900:00900:00900")),      # 미
    ("AB", 392, Image("00009:00009:00009:00009:00009")),     # 솔
    ("LOGO", 523, Image("99999:00000:00000:00000:00000")),   # 높은 도
    ("P0", 220, Image("00000:00000:00000:00000:99999")),     # 낮은 라
]

display.show(Image.MUSIC_QUAVER)

while True:
    a = button_a.is_pressed()
    b = button_b.is_pressed()

    key = None
    if a and b:
        key = "AB"
    elif a:
        key = "A"
    elif b:
        key = "B"
    elif pin_logo.is_touched():
        key = "LOGO"
    elif pin0.is_touched():
        key = "P0"

    if key:
        for name, hz, picture in KEYS:
            if name == key:
                display.show(picture)
                music.pitch(hz, 150)
    else:
        display.show(Image.MUSIC_QUAVER)

    sleep(25)`,
            desc: 'A · B · A+B · 로고 · P0 다섯 가지 입력을 건반으로 씁니다. 누른 건반에 따라 화면의 막대 위치도 달라져 어느 음인지 눈으로도 알 수 있습니다. 실제 보드에서는 P0 에 과일이나 알루미늄 포일을 붙여 보세요.',
            expect: '버튼과 터치로 다섯 가지 음을 연주할 수 있습니다.'
          },
          {
            type: 'code', title: '응용 예제 6-2. 자동 작곡기', code: `from microbit import *
import music
import random

SCALE = ['c4', 'd4', 'e4', 'g4', 'a4', 'c5']   # 5음 음계 (어떻게 섞어도 어울림)
LENGTH = 8

display.show(Image.MUSIC_QUAVER)

while True:
    if button_a.was_pressed():
        # 무작위로 한 곡 만들기
        song = []
        for i in range(LENGTH):
            note = random.choice(SCALE)
            dur = random.choice([2, 2, 4, 4, 8])
            song.append(note + ":" + str(dur))

        print("만든 곡:", song)
        display.show(Image.ALL_CLOCKS, delay=40)
        music.play(song)
        display.show(Image.MUSIC_QUAVER)

    if button_b.was_pressed():
        # 빠르기를 바꿔 본다
        ticks, bpm = music.get_tempo()
        bpm = 60 if bpm >= 240 else bpm + 60
        music.set_tempo(ticks=4, bpm=bpm)
        display.scroll(str(bpm), delay=70)
        display.show(Image.MUSIC_QUAVER)

    sleep(50)`,
            desc: '<b>5음 음계</b>(펜타토닉)는 어떤 순서로 이어 붙여도 어울리게 들립니다. A 를 누를 때마다 새 곡이 만들어지고, B 로 빠르기를 바꿉니다. 마음에 드는 곡이 나오면 콘솔에서 복사해 두세요.',
            expect: "만든 곡: ['e4:4', 'g4:2', 'c5:8', …]",
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 6-3. 멜로디 맞히기 퀴즈', code: `from microbit import *
import music
import random

QUIZ = [
    ("BIRTHDAY", music.BIRTHDAY),
    ("ODE", music.ODE),
    ("NYAN", music.NYAN),
    ("WEDDING", music.WEDDING),
]

score = 0
display.scroll("QUIZ", delay=60)

while True:
    answer = random.randint(0, len(QUIZ) - 1)
    name, tune = QUIZ[answer]

    display.show(Image.MUSIC_QUAVER)
    music.play(tune)

    # A 를 누를 때마다 보기가 바뀌고, B 로 정답 제출
    pick = 0
    display.show(pick)
    while True:
        if button_a.was_pressed():
            pick = (pick + 1) % len(QUIZ)
            display.show(pick)
        if button_b.was_pressed():
            break
        if pin_logo.is_touched():        # 힌트: 한 번 더 듣기
            music.play(tune)
            display.show(pick)
        sleep(40)

    if pick == answer:
        score = score + 1
        display.show(Image.HAPPY)
        music.play(music.POWER_UP)
    else:
        display.show(Image.SAD)
        music.play(music.WAWAWAWAA)
        display.scroll(name, delay=70)

    display.scroll("S" + str(score), delay=80)
    sleep(600)`,
            desc: '곡을 들려주고 <b>0 ~ 3 번</b> 중에서 고르게 합니다. A 로 번호를 바꾸고 B 로 제출, 로고를 만지면 다시 들려줍니다. 곡 목록을 바꾸면 우리 반 전용 퀴즈가 됩니다.',
            expect: '곡이 들린 뒤 번호를 고르면 정답 여부와 점수가 나옵니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 6-4. 알람 시계', code: `from microbit import *
import music

ALARM_SEC = 10          # 몇 초 뒤에 울릴까 (수업에서는 짧게)
armed = False
alarm_at = 0

display.show(Image.SQUARE_SMALL)

while True:
    # A: 알람 켜기 / 끄기
    if button_a.was_pressed():
        armed = not armed
        if armed:
            alarm_at = running_time() + ALARM_SEC * 1000
            display.show(Image.YES)
            music.pitch(880, 100)
        else:
            display.show(Image.NO)
        sleep(400)

    # B: 남은 시간 보기
    if button_b.was_pressed() and armed:
        left = max(0, (alarm_at - running_time()) // 1000)
        display.scroll(str(left), delay=70)

    if armed and running_time() >= alarm_at:
        # 알람! 아무 버튼이나 누를 때까지
        while not (button_a.was_pressed() or button_b.was_pressed()):
            display.show(Image("99999:99999:99999:99999:99999"))
            music.play(music.RINGTONE, wait=False)
            sleep(300)
            display.clear()
            sleep(200)
        music.stop()
        armed = False

    # 평소 화면
    if armed:
        display.show(Image.ALL_CLOCKS[(running_time() // 200) % 12])
    else:
        display.show(Image.SQUARE_SMALL)

    sleep(50)`,
            desc: 'A 로 알람을 걸고 B 로 남은 시간을 확인합니다. 울릴 때는 <code>wait=False</code> 로 소리를 내면서 <b>동시에</b> 화면을 깜빡이고 버튼도 확인합니다. <code>ALARM_SEC</code> 를 <code>300</code> 으로 바꾸면 5분 타이머가 됩니다.',
            expect: 'A 로 알람을 걸면 시계가 돌고, 시간이 되면 울립니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 6-5. 기울기 연주 악기', code: `from microbit import *
import music

# 기울기를 8음계로 나눠 연주한다
SCALE = [262, 294, 330, 349, 392, 440, 494, 523]

display.show(Image.MUSIC_QUAVER)

while True:
    if pin_logo.is_touched():
        x = accelerometer.get_x()
        i = scale(x, from_=(-1024, 1024), to=(0, len(SCALE) - 1))
        i = max(0, min(len(SCALE) - 1, i))

        # 기울기 세기로 음의 길이를 바꾼다
        y = accelerometer.get_y()
        ms = scale(abs(y), from_=(0, 1024), to=(60, 200))

        music.pitch(SCALE[i], ms)

        display.clear()
        display.set_pixel(i % 5, 4 - (i // 5) * 2, 9)
        print("음", i, SCALE[i], "Hz /", ms, "ms")
    else:
        display.show(Image.MUSIC_QUAVER)
        sleep(40)`,
            hint: '🧭 <b>센서 탭</b>의 기울기 판을 끌면서 보드 그림의 <b>로고</b>를 누르고 있으세요.',
            desc: '로고를 만지고 있는 동안만 소리가 나므로 <b>원하는 순간에만</b> 연주할 수 있습니다. 좌우 기울기가 음높이, 앞뒤 기울기가 음 길이입니다.',
            expect: '로고를 만진 채 기울이면 8음계 중 하나가 연주됩니다.',
            nondeterministic: true
          },

          { type: 'h', text: '2교시 · 6장 요약' },
          {
            type: 'list', items: [
              '<code>music.pitch(주파수, 길이ms)</code> 로 주파수를 <b>직접</b> 지정합니다. 길이를 빼면 계속 납니다.',
              '짧은 소리를 빠르게 이어 붙이면 <b>사이렌 · 효과음</b>이 됩니다.',
              '효과음은 <b>함수</b>로 만들어 두면 필요할 때 이름만 부르면 됩니다.',
              '센서 값을 <code>scale()</code> 로 주파수 범위로 바꾸면 <b>소리로 듣는 계측기</b>가 됩니다.',
              '<code>speaker.off()</code> · <code>set_volume()</code> 으로 스피커와 음량을 제어합니다. (V2)'
            ]
          }
        ],
        practice: [
          {
            title: '실습 6-3. 구급차 · 경찰차 사이렌',
            level: 2,
            desc: '<p>버튼으로 <b>두 가지 사이렌</b>을 골라 울리는 프로그램을 만드세요.</p><ul><li>A → <b>구급차</b>: 두 음(예: 600Hz, 900Hz)을 0.5초씩 번갈아</li><li>B → <b>경찰차</b>: 400Hz 에서 1200Hz 로 빠르게 올라갔다 내려오기를 반복</li><li>로고를 터치하면 멈춥니다</li><li>사이렌이 울리는 동안 화면에 번갈아 그림을 보여 줍니다</li></ul>',
            hint: '각 사이렌을 <code>def</code> 함수로 만들고, 그 안에서 <code>if pin_logo.is_touched(): return</code> 으로 빠져나가게 하세요.',
            starter: 'from microbit import *\nimport music\n\n\ndef ambulance():\n    # TODO\n    pass\n\n\ndef police():\n    # TODO\n    pass\n\n\nwhile True:\n    if button_a.was_pressed():\n        ambulance()\n    if button_b.was_pressed():\n        police()\n    sleep(50)\n',
            solution: 'from microbit import *\nimport music\n\n\ndef ambulance():\n    while not pin_logo.is_touched():\n        display.show(Image.SQUARE)\n        music.pitch(600, 500)\n        display.show(Image.SQUARE_SMALL)\n        music.pitch(900, 500)\n    display.clear()\n\n\ndef police():\n    while not pin_logo.is_touched():\n        display.show(Image.DIAMOND)\n        for hz in range(400, 1200, 40):\n            music.pitch(hz, 8)\n        display.show(Image.DIAMOND_SMALL)\n        for hz in range(1200, 400, -40):\n            music.pitch(hz, 8)\n    display.clear()\n\n\nwhile True:\n    if button_a.was_pressed():\n        ambulance()\n    if button_b.was_pressed():\n        police()\n    sleep(50)\n'
          },
          {
            title: '실습 6-4. 도전! 음악 메모장',
            level: 3,
            desc: '<p>버튼으로 음을 골라 <b>곡을 만들고 저장했다가 재생</b>하는 프로그램을 만드세요.</p><ol><li>A 를 누르면 음이 올라가고(도→레→미→…), B 를 누르면 지금 음을 <b>기록</b>합니다.</li><li>고를 때마다 그 음을 짧게 들려주고 화면에 번호를 보여 줍니다.</li><li>로고를 터치하면 기록한 곡을 <b>처음부터 재생</b>합니다.</li><li>A+B 를 동시에 누르면 기록을 지웁니다.</li></ol>',
            hint: '음 이름은 <code>notes = [\'c4\', \'d\', \'e\', \'f\', \'g\', \'a\', \'b\', \'c5\']</code>, 기록은 <code>song = []</code> 리스트에 <code>song.append(notes[i])</code> 로 추가합니다.',
            starter: 'from microbit import *\nimport music\n\nnotes = [\'c4\', \'d4\', \'e4\', \'f4\', \'g4\', \'a4\', \'b4\', \'c5\']\ni = 0\nsong = []\ndisplay.show(i)\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport music\n\nnotes = [\'c4\', \'d4\', \'e4\', \'f4\', \'g4\', \'a4\', \'b4\', \'c5\']\ni = 0\nsong = []\ndisplay.show(i)\n\nwhile True:\n    a = button_a.was_pressed()\n    b = button_b.was_pressed()\n\n    if a and b:\n        song = []\n        display.show(Image.NO)\n        sleep(400)\n        display.show(i)\n    elif a:\n        i = (i + 1) % len(notes)\n        display.show(i)\n        music.play(notes[i] + \':2\')\n    elif b:\n        song.append(notes[i] + \':4\')\n        display.show(Image.YES)\n        sleep(200)\n        display.show(i)\n\n    if pin_logo.is_touched():\n        if song:\n            display.show(Image.MUSIC_QUAVER)\n            music.play(song)\n            display.show(i)\n        else:\n            display.show(Image.SAD)\n            sleep(400)\n            display.show(i)\n\n    sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: '<code>music.pitch(440, 1000)</code> 의 뜻은?', options: ['440번 반복', '440Hz 소리를 1초 동안', '1000Hz 소리를 440ms 동안', '음량 440'], answer: 1,
            explain: '<code>music.pitch(주파수, 길이ms)</code> 입니다. 440Hz(라) 를 1000ms(1초) 동안 냅니다.'
          },
          {
            q: '<code>music.pitch(440)</code> 처럼 길이를 빼면?', options: ['소리가 나지 않는다', '기본 1초 동안 난다', '<code>music.stop()</code> 할 때까지 계속 난다', '오류'], answer: 2,
            explain: '길이를 생략하면 <b>계속</b> 소리가 납니다. <code>music.stop()</code> 으로 멈춰야 합니다.'
          },
          {
            q: '사이렌처럼 연속적으로 변하는 소리를 만드는 방법은?', options: ['<code>music.play()</code> 를 반복', '짧은 <code>pitch()</code> 를 주파수를 바꿔 가며 빠르게 이어 붙인다', '<code>set_volume()</code> 을 바꾼다', '불가능'], answer: 1,
            explain: '<code>for hz in range(400, 1000, 20): music.pitch(hz, 12)</code> 처럼 <b>짧은 소리를 빠르게 이어</b> 붙입니다.'
          },
          {
            q: '내장 스피커를 끄고 P0 에 연결한 부저로만 소리를 내려면?', options: ['<code>speaker.off()</code>', '<code>set_volume(0)</code>', '<code>music.stop()</code>', '<code>display.off()</code>'], answer: 0,
            explain: '<code>speaker.off()</code> 는 내장 스피커만 끄고, P0 의 신호는 그대로 나갑니다.'
          },
          {
            q: '센서 값(0~255)을 200~2000Hz 로 바꾸려면?', options: ['<code>scale(v, from_=(0, 255), to=(200, 2000))</code>', '<code>v * 2000</code>', '<code>v // 255</code>', '<code>scale(v, from_=(200, 2000), to=(0, 255))</code>'], answer: 0,
            explain: '<code>scale(값, from_=(원래 범위), to=(바꿀 범위))</code> 순서입니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: 'pitch — 주파수를 직접 다루기', subtitle: 'Chapter 06 · 음악', badge: '2교시',
            notes: '<p>효과음 만들기는 학생들이 몰입하는 활동입니다. 시간을 넉넉히 주세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'code', title: 'music.pitch()', code: 'from microbit import *\nimport music\n\nmusic.pitch(440, 1000)   # 440Hz 를 1초\nsleep(500)\nmusic.pitch(880, 1000)   # 한 옥타브 위\nsleep(500)\nmusic.pitch(220, 1000)   # 한 옥타브 아래',
            points: ['<code>pitch(주파수, 길이ms)</code>', 'play = 악보 / pitch = 직접 주파수', '길이를 빼면 <b>계속</b> 소리남', '사람 가청 범위 20 ~ 20,000Hz'],
            notes: '<p>셸에서 극단적인 값(50Hz, 5000Hz)을 들려주면 반응이 좋습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '사이렌 만들기', code: 'from microbit import *\nimport music\n\nwhile True:\n    for hz in range(400, 1000, 20):\n        music.pitch(hz, 12)\n    for hz in range(1000, 400, -20):\n        music.pitch(hz, 12)\n    if button_a.was_pressed():\n        music.stop()\n        break',
            points: ['짧은 소리를 <b>빠르게 이어</b> 붙이기', '<code>range(시작, 끝, 간격)</code>', '간격과 길이를 바꿔 실험', '애니메이션과 같은 원리!'],
            notes: '<p>3장의 애니메이션(그림을 빠르게 바꾸기)과 같은 아이디어라는 점을 짚어 주면 좋습니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '효과음을 함수로', code: 'def power_up():\n    for hz in range(300, 1200, 60):\n        music.pitch(hz, 20)\n\ndef laser():\n    for hz in range(2000, 200, -120):\n        music.pitch(hz, 8)\n\nwhile True:\n    if button_a.was_pressed():\n        power_up()\n    if pin_logo.is_touched():\n        laser()\n    sleep(50)',
            points: ['효과음마다 <b>이름</b> 붙이기', '필요할 때 이름만 부르기', '게임 만들 때 그대로 재사용', '숫자를 바꿔 나만의 소리'],
            notes: '<p>학생들이 자기만의 효과음을 만들어 들려주게 하면 재미있습니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '기울기 테레민', code: 'from microbit import *\nimport music\n\nwhile True:\n    x = accelerometer.get_x()\n    hz = scale(x, from_=(-1024, 1024), to=(200, 1200))\n    music.pitch(hz, 40)',
            points: ['센서 값 → <code>scale()</code> → 주파수', '눈이 아닌 <b>귀로 듣는 계측기</b>', '실제 장비에서도 쓰는 방법', '빛 센서로도 가능'],
            notes: '<p>실제 테레민 연주 영상을 잠깐 보여 주면 이해가 빠릅니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'table', title: '스피커 제어 (V2)', head: ['명령', '하는 일'], rows: [
              ['<code>speaker.off()</code>', '내장 스피커 끄기'],
              ['<code>speaker.on()</code>', '켜기'],
              ['<code>set_volume(0~255)</code>', '음량 (기본 127)'],
              ['이어폰', 'P0 ↔ 팁, GND ↔ 슬리브']],
            notes: '<p>교실에서 여러 명이 실습할 때는 이어폰 연결을 안내하면 좋습니다.</p><p>시간: 5분</p>'
          },
          {
            layout: 'practice', title: '실습 6-3. 구급차 · 경찰차 사이렌', desc: 'A 는 구급차, B 는 경찰차. 로고 터치로 정지.',
            starter: 'from microbit import *\nimport music\n\ndef ambulance():\n    # TODO\n    pass\n\nwhile True:\n    if button_a.was_pressed():\n        ambulance()\n    sleep(50)\n',
            solution: 'from microbit import *\nimport music\n\n\ndef ambulance():\n    while not pin_logo.is_touched():\n        display.show(Image.SQUARE)\n        music.pitch(600, 500)\n        display.show(Image.SQUARE_SMALL)\n        music.pitch(900, 500)\n    display.clear()\n\n\ndef police():\n    while not pin_logo.is_touched():\n        for hz in range(400, 1200, 40):\n            music.pitch(hz, 8)\n        for hz in range(1200, 400, -40):\n            music.pitch(hz, 8)\n    display.clear()\n\n\nwhile True:\n    if button_a.was_pressed():\n        ambulance()\n    if button_b.was_pressed():\n        police()\n    sleep(50)\n',
            notes: '<p>실제 사이렌 소리를 들려주고 최대한 비슷하게 만들어 보게 하면 몰입도가 높습니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '6장 정리', bullets: ['<code>import music</code> · 내장 멜로디 21가지', '음표 <code>\'c4:4\'</code> · 생략하면 앞 음과 같음', '<code>music.pitch(Hz, ms)</code> 로 직접 주파수', '짧은 pitch 를 이어 붙여 사이렌 · 효과음', '센서 → <code>scale()</code> → 소리'],
            notes: '<p>6장 전체 정리. 다음 장 예고: 난수 — 예측할 수 없는 프로그램 만들기.</p><p>과제: 나만의 효과음 3개 만들어 오기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
