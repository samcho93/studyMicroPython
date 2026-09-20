/* Chapter 03. 이미지 — LED 화면에 그림 그리기
 * 원본: MicroPython on the BBC micro:bit — Images
 */
(function () {
  const screen = (rows, label, big) => {
    const px = rows.replace(/[^0-9]/g, '');
    const s = big ? 150 : 110;
    return `<div style="display:inline-block;text-align:center;margin:6px 9px;vertical-align:top">
      <svg viewBox="0 0 150 150" width="${s}" height="${s}"><rect x="0" y="0" width="150" height="150" rx="12" fill="#0e6b64"/>
      ${Array.from({ length: 25 }, (_, i) => {
      const v = +(px[i] || 0);
      return `<rect x="${18 + (i % 5) * 26}" y="${16 + Math.floor(i / 5) * 26}" width="14" height="20" rx="3" fill="${v ? '#ff2d1a' : '#4a1a16'}" opacity="${v ? (0.18 + v / 9 * 0.82).toFixed(2) : 1}"/>`;
    }).join('')}</svg>
      ${label ? `<div style="font-size:12.5px;color:var(--muted);margin-top:2px;font-family:var(--mono)">${label}</div>` : ''}</div>`;
  };

  const FIG_GRID = `<svg viewBox="0 0 1280 560" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="38" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--fg)">LED 화면의 좌표 — 왼쪽 위가 (0, 0)</text>
  <!-- x 축 라벨 -->
  ${[0, 1, 2, 3, 4].map((x) => `<text x="${320 + x * 90}" y="92" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--accent)">x=${x}</text>`).join('\n  ')}
  ${[0, 1, 2, 3, 4].map((y) => `<text x="${250}" y="${152 + y * 90}" text-anchor="end" font-size="24" font-weight="bold" fill="var(--accent2)">y=${y}</text>`).join('\n  ')}
  <rect x="275" y="105" width="450" height="450" rx="16" fill="#0e6b64" opacity=".18" stroke="var(--line)" stroke-width="2"/>
  ${Array.from({ length: 25 }, (_, i) => {
      const x = i % 5, y = Math.floor(i / 5);
      const on = (x === 0 && y === 0) || (x === 2 && y === 2) || (x === 4 && y === 4);
      return `<rect x="${290 + x * 90}" y="${120 + y * 90}" width="60" height="60" rx="8" fill="${on ? '#ff2d1a' : 'var(--card)'}" stroke="var(--line)" stroke-width="2"/>
  <text x="${320 + x * 90}" y="${157 + y * 90}" text-anchor="middle" font-size="17" fill="${on ? '#fff' : 'var(--muted)'}">${x},${y}</text>`;
    }).join('\n  ')}
  <text x="790" y="180" font-size="22" fill="var(--fg)"><tspan font-weight="bold" fill="#ff2d1a">(0, 0)</tspan> — 왼쪽 <tspan font-weight="bold">위</tspan> 모서리</text>
  <text x="790" y="230" font-size="22" fill="var(--fg)"><tspan font-weight="bold" fill="#ff2d1a">(2, 2)</tspan> — 한가운데</text>
  <text x="790" y="280" font-size="22" fill="var(--fg)"><tspan font-weight="bold" fill="#ff2d1a">(4, 4)</tspan> — 오른쪽 <tspan font-weight="bold">아래</tspan> 모서리</text>
  <text x="790" y="350" font-size="21" fill="var(--muted)">x 는 오른쪽으로 갈수록 커지고,</text>
  <text x="790" y="386" font-size="21" fill="var(--muted)">y 는 <tspan font-weight="bold">아래로</tspan> 갈수록 커집니다.</text>
  <text x="790" y="440" font-size="21" fill="var(--danger)">수학 시간의 좌표와 y 방향이 반대!</text>
  <text x="790" y="500" font-size="21" fill="var(--fg)">display.set_pixel(<tspan font-weight="bold" fill="var(--accent)">x</tspan>, <tspan font-weight="bold" fill="var(--accent2)">y</tspan>, <tspan font-weight="bold" fill="var(--ok)">밝기</tspan>)</text>
</svg>`;

  const FIG_STRING = `<svg viewBox="0 0 1280 520" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="40" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--fg)">Image("...") — 숫자로 그림 그리기</text>
  <text x="60" y="110" font-size="30" font-family="monospace" fill="var(--fg)">Image(</text>
  ${['09090', '99999', '99999', '09990', '00900'].map((row, y) => `<text x="230" y="${110 + y * 54}" font-size="30" font-family="monospace" fill="var(--accent)">"${row}${y < 4 ? ':' : ':"'}</text>` + (y < 4 ? '' : '')).join('\n  ')}
  <text x="60" y="380" font-size="30" font-family="monospace" fill="var(--fg)">)</text>
  <text x="430" y="110" font-size="22" fill="var(--muted)">← 1번째 줄 (y = 0)</text>
  <text x="430" y="164" font-size="22" fill="var(--muted)">← 2번째 줄 (y = 1)</text>
  <text x="430" y="218" font-size="22" fill="var(--muted)">← 3번째 줄 (y = 2)</text>
  <text x="430" y="272" font-size="22" fill="var(--muted)">← 4번째 줄 (y = 3)</text>
  <text x="430" y="326" font-size="22" fill="var(--muted)">← 5번째 줄 (y = 4)</text>
  <rect x="760" y="70" width="330" height="330" rx="16" fill="#0e6b64"/>
  ${['09090', '99999', '99999', '09990', '00900'].map((row, y) => row.split('').map((c, x) => `<rect x="${790 + x * 60}" y="${100 + y * 60}" width="36" height="46" rx="6" fill="${+c ? '#ff2d1a' : '#4a1a16'}" opacity="${+c ? (0.18 + (+c) / 9 * 0.82).toFixed(2) : 1}"/>`).join('')).join('\n  ')}
  <text x="925" y="440" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--fg)">Image.HEART 와 같다</text>
  <text x="60" y="450" font-size="21" fill="var(--fg)">숫자 <tspan font-weight="bold">0</tspan> = 꺼짐, <tspan font-weight="bold">9</tspan> = 가장 밝음. 사이 숫자는 밝기 단계입니다.</text>
  <text x="60" y="488" font-size="21" fill="var(--muted)">각 줄은 콜론(:) 으로 나눕니다. 줄마다 5글자, 모두 5줄.</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch03',
    no: '03',
    title: '이미지 — LED 화면에 그림 그리기',
    subtitle: '내장 이미지 · 직접 만들기 · 픽셀 · 애니메이션',
    summary: 'micro:bit 에 미리 들어 있는 60여 가지 그림을 살펴보고, 숫자 문자열로 나만의 그림을 직접 만드는 방법을 배웁니다. LED 하나하나를 좌표로 다루는 set_pixel · get_pixel, 그림을 여러 장 이어 붙여 만드는 애니메이션, 그림끼리 더하고 곱하는 연산까지 익혀 LED 화면을 자유롭게 다룰 수 있게 됩니다.',
    goals: [
      '내장 이미지(<code>Image.HEART</code> 등)를 찾아 쓸 수 있다',
      '<code>Image("...")</code> 문자열로 나만의 그림을 만들 수 있다',
      'LED 좌표 체계를 이해하고 <code>set_pixel</code> · <code>get_pixel</code> 을 쓸 수 있다',
      '이미지 리스트와 <code>delay</code> · <code>loop</code> 로 애니메이션을 만들 수 있다',
      '이미지의 밝기 조절 · 이동 · 합치기를 활용할 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch03-1',
        title: '내장 이미지 사용하기',
        minutes: 45,
        goals: [
          '<code>Image</code> 가 무엇인지 설명할 수 있다',
          '내장 이미지 목록에서 원하는 그림을 찾아 쓸 수 있다',
          '<code>display.show()</code> 에 이미지를 넣어 보여 줄 수 있다',
          '이미지를 변수에 담아 재사용할 수 있다'
        ],
        flow: [['Image 란?', 6], ['내장 이미지 둘러보기', 14], ['이미지 보여 주기', 12], ['변수에 담기', 8], ['정리 · 퀴즈', 5]],
        content: [
          { type: 'h', text: 'Image — 5×5 그림 한 장' },
          { type: 'p', html: '2장에서 <code>display.show(Image.HEART)</code> 로 하트를 띄워 봤습니다. 여기서 <code>Image</code> 는 <b>5×5 LED 그림 한 장</b>을 나타내는 이름입니다. micro:bit 에는 하트, 웃는 얼굴, 동물, 화살표 등 <b>60가지가 넘는 그림</b>이 미리 들어 있습니다.' },
          {
            type: 'code', repl: true, title: '셸에서 이미지 살펴보기', code: `Image.HEART
display.show(Image.HEART)
display.show(Image.GHOST)`,
            desc: '<code>Image.HEART</code> 를 그냥 입력하면 <code>Image(\'09090:99999:99999:09990:00900:\')</code> 처럼 <b>숫자로 표현된 모습</b>이 나옵니다. 각 숫자가 LED 하나의 밝기입니다. 이 표기법은 2교시에서 직접 써 봅니다.',
            expect: ">>> Image.HEART\nImage('09090:99999:99999:09990:00900:')"
          },

          { type: 'h', text: '내장 이미지 목록' },
          { type: 'p', html: '자주 쓰는 그림들입니다. 이름은 모두 <b>대문자</b>이고, <code>Image.</code> 뒤에 붙여 씁니다.' },
          {
            type: 'figure', html: `<div style="text-align:center">
            ${screen('09090 99999 99999 09990 00900', 'HEART')}
            ${screen('00000 09090 09990 00900 00000', 'HEART_SMALL')}
            ${screen('00000 09090 00000 90009 09990', 'HAPPY')}
            ${screen('00000 09090 00000 09990 90009', 'SAD')}
            ${screen('00000 00000 00000 90009 09990', 'SMILE')}
            ${screen('00000 09090 00000 09090 90909', 'CONFUSED')}
            ${screen('90009 09090 00000 99999 90909', 'ANGRY')}
            ${screen('00000 99099 00000 09990 00000', 'ASLEEP')}
            ${screen('09090 00000 00900 09090 00900', 'SURPRISED')}
            ${screen('90009 00000 99999 00909 00999', 'SILLY')}
            ${screen('99999 99099 00000 09090 09990', 'FABULOUS')}
            ${screen('09090 00000 00090 00900 09000', 'MEH')}
            </div>`, caption: '그림 3-1. 표정 이미지'
          },
          {
            type: 'figure', html: `<div style="text-align:center">
            ${screen('00900 09990 90909 00900 00900', 'ARROW_N')}
            ${screen('00900 00090 99999 00090 00900', 'ARROW_E')}
            ${screen('00900 00900 90909 09990 00900', 'ARROW_S')}
            ${screen('00900 09000 99999 09000 00900', 'ARROW_W')}
            ${screen('00000 00009 00090 90900 09000', 'YES')}
            ${screen('90009 09090 00900 09090 90009', 'NO')}
            ${screen('99999 90009 90009 90009 99999', 'SQUARE')}
            ${screen('00900 09090 90009 09090 00900', 'DIAMOND')}
            ${screen('00000 00900 09090 99999 00000', 'TRIANGLE')}
            ${screen('09090 90909 09090 90909 09090', 'CHESSBOARD')}
            ${screen('00900 09990 99099 09990 00900', 'TARGET')}
            ${screen('00900 09990 99999 09990 09090', 'HOUSE')}
            </div>`, caption: '그림 3-2. 화살표 · 기호 이미지 (화살표는 N · NE · E · SE · S · SW · W · NW 8방향)'
          },
          {
            type: 'figure', html: `<div style="text-align:center">
            ${screen('09900 99900 09999 09990 00000', 'DUCK')}
            ${screen('90900 90900 99990 99090 99990', 'RABBIT')}
            ${screen('90009 90009 99999 09990 00900', 'COW')}
            ${screen('99000 09000 09000 09990 09090', 'GIRAFFE')}
            ${screen('99000 99099 09090 09990 00000', 'SNAKE')}
            ${screen('00000 09990 99999 09090 00000', 'TORTOISE')}
            ${screen('99099 99999 00900 99999 99099', 'BUTTERFLY')}
            ${screen('09990 90909 99999 09990 09990', 'SKULL')}
            ${screen('99999 90909 99999 99999 90909', 'GHOST')}
            ${screen('09999 99090 99900 99990 09999', 'PACMAN')}
            ${screen('00900 00990 00909 99900 99900', 'MUSIC_QUAVER')}
            ${screen('09990 99999 00900 90900 09900', 'UMBRELLA')}
            </div>`, caption: '그림 3-3. 동물 · 사물 이미지'
          },
          {
            type: 'table', head: ['분류', '이름'], rows: [
              ['표정', '<code>HEART</code> <code>HEART_SMALL</code> <code>HAPPY</code> <code>SMILE</code> <code>SAD</code> <code>CONFUSED</code> <code>ANGRY</code> <code>ASLEEP</code> <code>SURPRISED</code> <code>SILLY</code> <code>FABULOUS</code> <code>MEH</code>'],
              ['기호', '<code>YES</code> <code>NO</code> <code>SQUARE</code> <code>SQUARE_SMALL</code> <code>DIAMOND</code> <code>DIAMOND_SMALL</code> <code>TRIANGLE</code> <code>TRIANGLE_LEFT</code> <code>CHESSBOARD</code> <code>TARGET</code>'],
              ['화살표', '<code>ARROW_N</code> <code>ARROW_NE</code> <code>ARROW_E</code> <code>ARROW_SE</code> <code>ARROW_S</code> <code>ARROW_SW</code> <code>ARROW_W</code> <code>ARROW_NW</code>'],
              ['동물', '<code>DUCK</code> <code>RABBIT</code> <code>COW</code> <code>GIRAFFE</code> <code>SNAKE</code> <code>TORTOISE</code> <code>BUTTERFLY</code>'],
              ['사물 · 기타', '<code>HOUSE</code> <code>TSHIRT</code> <code>ROLLERSKATE</code> <code>UMBRELLA</code> <code>SWORD</code> <code>SCISSORS</code> <code>PITCHFORK</code> <code>XMAS</code> <code>STICKFIGURE</code> <code>SKULL</code> <code>GHOST</code> <code>PACMAN</code> <code>MUSIC_QUAVER</code> <code>MUSIC_CROTCHET</code> <code>MUSIC_QUAVERS</code>'],
              ['목록(여러 장)', '<code>Image.ALL_ARROWS</code> (화살표 8장), <code>Image.ALL_CLOCKS</code> (시계 12장)']
            ], caption: '표 3-1. 내장 이미지 전체 목록'
          },
          { type: 'callout', kind: 'tip', title: '목록을 직접 확인하기', html: '셸에서 <code>dir(Image)</code> 를 입력하면 쓸 수 있는 이미지 이름이 모두 나옵니다. 외울 필요 없이 필요할 때 찾아 쓰세요.' },

          { type: 'h', text: '이미지 보여 주기' },
          {
            type: 'code', title: '예제 3-1. 표정 바꾸기', code: `from microbit import *

display.show(Image.HAPPY)
sleep(1000)
display.show(Image.SAD)
sleep(1000)
display.show(Image.SURPRISED)
sleep(1000)
display.show(Image.ASLEEP)`,
            desc: '<code>show()</code> 에 이미지를 넣으면 <b>그대로 화면에 멈춥니다</b>. 마지막 그림은 <code>clear()</code> 하기 전까지 남아 있습니다.',
            expect: '웃는 얼굴 → 슬픈 얼굴 → 놀란 얼굴 → 자는 얼굴'
          },
          {
            type: 'code', title: '예제 3-2. 동물 도감', code: `from microbit import *

animals = [Image.DUCK, Image.RABBIT, Image.COW,
           Image.GIRAFFE, Image.SNAKE, Image.TORTOISE]
names = ["DUCK", "RABBIT", "COW", "GIRAFFE", "SNAKE", "TORTOISE"]

for i in range(len(animals)):
    display.scroll(names[i], delay=80)
    display.show(animals[i])
    sleep(1200)

display.clear()`,
            desc: '<b>리스트</b>(<code>[ ]</code>)에 이미지와 이름을 담아 두고 차례로 꺼내 보여 줍니다. <code>len(animals)</code> 는 리스트의 개수(6), <code>animals[i]</code> 는 <code>i</code>번째 이미지입니다. (번호는 <b>0부터</b> 시작합니다)',
            expect: 'DUCK 이 흐른 뒤 오리 그림, RABBIT 이 흐른 뒤 토끼 그림 … 순서로 보입니다.'
          },
          { type: 'callout', kind: 'more', title: '리스트(list) 맛보기', html: '<p><code>[Image.DUCK, Image.RABBIT]</code> 처럼 <b>대괄호 안에 쉼표로 나열한 것</b>을 리스트라고 합니다. 여러 값을 한 이름으로 묶어 다룰 때 씁니다.</p><ul><li><code>animals[0]</code> — 첫 번째 (번호는 0부터!)</li><li><code>len(animals)</code> — 개수</li><li><code>for a in animals:</code> — 하나씩 꺼내며 반복</li></ul><p>리스트를 쓰면 예제 3-2 를 훨씬 짧게 쓸 수도 있습니다. 3교시에서 다시 씁니다.</p>' },

          { type: 'h', text: '변수에 담아 두기' },
          { type: 'p', html: '같은 이미지를 여러 번 쓸 때는 <b>변수</b>에 담아 두면 코드가 짧고 읽기 쉬워집니다.' },
          {
            type: 'code', title: '예제 3-3. 변수로 정리하기', code: `from microbit import *

# 자주 쓰는 그림에 짧은 이름 붙이기
big = Image.HEART
small = Image.HEART_SMALL

while True:
    display.show(big)
    sleep(200)
    display.show(small)
    sleep(200)`,
            desc: '<code>big = Image.HEART</code> 는 “<code>Image.HEART</code> 에 <code>big</code> 이라는 별명을 붙여라”는 뜻입니다. 나중에 다른 그림으로 바꾸고 싶으면 <b>맨 위 한 줄만</b> 고치면 됩니다.',
            expect: '큰 하트와 작은 하트가 번갈아 나타납니다.'
          },
          {
            type: 'code', title: '예제 3-4. 신호등', code: `from microbit import *

red = Image("99999:99999:00000:00000:00000")
yellow = Image("00000:00000:99999:00000:00000")
green = Image("00000:00000:00000:99999:99999")

while True:
    display.show(red)
    sleep(2000)
    display.show(yellow)
    sleep(700)
    display.show(green)
    sleep(2000)
    display.show(yellow)
    sleep(700)`,
            desc: '내장 이미지에 없는 그림은 <code>Image("…")</code> 로 직접 만듭니다. 자세한 방법은 2교시에서 배웁니다. 여기서는 “직접 만들 수도 있다”는 것만 확인하세요.',
            expect: '위쪽 두 줄(빨강) → 가운데(노랑) → 아래 두 줄(초록) 순서로 반복됩니다.'
          },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 쓸 수 있는 이미지 세어 보기', code: `from microbit import *

names = [n for n in dir(Image) if n.isupper()]
print("쓸 수 있는 이미지:", len(names), "개")
for n in names:
    print(" -", n)

display.scroll(str(len(names)), delay=80)`,
            desc: '<code>dir(Image)</code> 가 돌려주는 이름 중 <b>대문자로만 된 것</b>이 이미지입니다. <code>[n for n in … if …]</code> 는 조건에 맞는 것만 골라 새 리스트를 만드는 <b>리스트 컴프리헨션</b> 입니다.',
            expect: '쓸 수 있는 이미지: 60 개\n - ALL_ARROWS\n - ALL_CLOCKS\n - ANGRY …',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ②. 대기 표시 만들기', code: `from microbit import *

display.scroll("WAIT", delay=60)

# 시계는 12장, 화살표는 8장이 들어 있는 리스트
for turn in range(2):
    display.show(Image.ALL_CLOCKS, delay=70)
for turn in range(2):
    display.show(Image.ALL_ARROWS, delay=110)

display.show(Image.YES)
sleep(800)
display.clear()`,
            desc: '<code>Image.ALL_CLOCKS</code> 와 <code>Image.ALL_ARROWS</code> 는 <b>이미 여러 장이 담긴 리스트</b>입니다. 그대로 <code>show()</code> 에 넣으면 애니메이션이 됩니다.',
            expect: '시계가 두 바퀴, 화살표가 두 바퀴 돈 뒤 체크 표시'
          },
          {
            type: 'code', title: '더 해 보기 ③. 표정 슬라이드쇼', code: `from microbit import *

FACES = [Image.HAPPY, Image.SAD, Image.ANGRY, Image.CONFUSED,
         Image.SURPRISED, Image.ASLEEP, Image.SILLY, Image.FABULOUS,
         Image.MEH, Image.SMILE]

# 리스트를 그대로 넘기면 차례로 바뀐다 (끝없이 반복)
display.show(FACES, delay=700, loop=True)`,
            desc: '표정 10가지가 계속 바뀝니다. <code>delay</code> 를 줄이면 훨씬 빠르게 지나갑니다. 리스트에 담아 두면 <b>단 한 줄</b>로 애니메이션이 만들어집니다.',
            expect: '표정이 0.7초마다 바뀌기를 반복합니다. (■ 정지)'
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '<code>Image</code> 는 <b>5×5 그림 한 장</b>입니다. micro:bit 에는 60가지가 넘는 그림이 내장되어 있습니다.',
              '<code>display.show(Image.이름)</code> 으로 보여 줍니다. 이름은 모두 <b>대문자</b>입니다.',
              '<code>dir(Image)</code> 로 쓸 수 있는 이미지 목록을 볼 수 있습니다.',
              '여러 이미지는 <b>리스트</b>(<code>[ ]</code>)에 담아 차례로 다룰 수 있습니다.',
              '자주 쓰는 이미지는 <b>변수</b>에 담아 두면 코드가 짧아집니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 3-1. 기분 일기',
            level: 1,
            desc: '<p>오늘 하루의 기분을 표정 4개로 표현하는 프로그램을 만드세요.</p><ul><li>각 표정 앞에 시간을 흘려보냅니다. (예: <code>AM</code>, <code>PM</code>)</li><li>표정은 1.5초씩 보여 줍니다.</li><li>마지막에는 화면을 지웁니다.</li></ul>',
            hint: '<code>display.scroll("MORNING")</code> 다음 <code>display.show(Image.HAPPY)</code>, <code>sleep(1500)</code> 순서로 씁니다.',
            starter: 'from microbit import *\n\n# TODO: 아침 · 점심 · 저녁 · 밤의 기분\n\ndisplay.clear()\n',
            solution: 'from microbit import *\n\ndisplay.scroll("MORNING", delay=70)\ndisplay.show(Image.ASLEEP)\nsleep(1500)\n\ndisplay.scroll("NOON", delay=70)\ndisplay.show(Image.HAPPY)\nsleep(1500)\n\ndisplay.scroll("EVENING", delay=70)\ndisplay.show(Image.MEH)\nsleep(1500)\n\ndisplay.scroll("NIGHT", delay=70)\ndisplay.show(Image.ASLEEP)\nsleep(1500)\n\ndisplay.clear()\n'
          },
          {
            title: '실습 3-2. 화살표 나침반',
            level: 2,
            desc: '<p>화살표 8개를 <b>시계 방향으로</b> 차례로 보여 주어 빙글빙글 도는 것처럼 만드세요.</p><p>순서: N → NE → E → SE → S → SW → W → NW → (다시 N)</p><p>리스트를 쓰면 훨씬 짧게 쓸 수 있습니다. micro:bit 에는 이미 <code>Image.ALL_ARROWS</code> 라는 리스트가 준비되어 있습니다!</p>',
            hint: '<code>for a in Image.ALL_ARROWS:</code> 로 하나씩 꺼내 쓸 수 있습니다. 전체를 <code>while True:</code> 로 감싸면 계속 돕니다.',
            starter: 'from microbit import *\n\nwhile True:\n    # TODO: 화살표 8개를 차례로\n    pass\n',
            solution: 'from microbit import *\n\nwhile True:\n    for arrow in Image.ALL_ARROWS:\n        display.show(arrow)\n        sleep(150)\n'
          }
        ],
        quiz: [
          {
            q: '<code>Image</code> 는 무엇을 나타내나요?', options: ['소리 한 곡', '5×5 LED 그림 한 장', '보드의 온도', '파일 이름'], answer: 1,
            explain: '<code>Image</code> 는 micro:bit 화면 크기(5×5)의 그림 한 장을 나타냅니다.'
          },
          {
            q: '쓸 수 있는 이미지 목록을 보려면?', options: ['<code>list(Image)</code>', '<code>dir(Image)</code>', '<code>Image.all()</code>', '<code>help(Image)</code>'], answer: 1,
            explain: '<code>dir(Image)</code> 를 셸에 입력하면 이름 목록이 나옵니다.'
          },
          {
            q: '<code>animals = [Image.DUCK, Image.COW]</code> 일 때 <code>animals[0]</code> 은?', options: ['<code>Image.DUCK</code>', '<code>Image.COW</code>', '오류', '개수 2'], answer: 0,
            explain: '리스트의 번호는 <b>0부터</b> 시작합니다. <code>animals[0]</code> 은 첫 번째인 <code>Image.DUCK</code> 입니다.'
          },
          {
            q: '8방향 화살표가 모두 들어 있는 리스트는?', options: ['<code>Image.ARROWS</code>', '<code>Image.ALL_ARROWS</code>', '<code>Image.DIRECTIONS</code>', '<code>Image.COMPASS</code>'], answer: 1,
            explain: '<code>Image.ALL_ARROWS</code> 입니다. 시계 그림은 <code>Image.ALL_CLOCKS</code> 로 12장이 들어 있습니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '내장 이미지 사용하기', subtitle: 'Chapter 03 · 이미지', badge: '1교시',
            notes: '<p>학생들이 가장 재미있어하는 챕터입니다. 자유롭게 그림을 바꿔 보게 하세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'diagram', title: '내장 이미지 — 표정', html: `<div style="text-align:center">
            ${screen('09090 99999 99999 09990 00900', 'HEART')}${screen('00000 09090 00000 90009 09990', 'HAPPY')}${screen('00000 09090 00000 09990 90009', 'SAD')}${screen('90009 09090 00000 99999 90909', 'ANGRY')}${screen('00000 99099 00000 09990 00000', 'ASLEEP')}${screen('99999 99099 00000 09090 09990', 'FABULOUS')}</div>`,
            caption: '이름은 모두 대문자 · Image. 뒤에 붙여 씁니다',
            notes: '<p>학생들에게 마음에 드는 그림을 하나씩 골라 셸에서 띄워 보게 합니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: '표정 바꾸기', code: 'from microbit import *\n\ndisplay.show(Image.HAPPY)\nsleep(1000)\ndisplay.show(Image.SAD)\nsleep(1000)\ndisplay.show(Image.SURPRISED)',
            points: ['<code>show()</code> 에 이미지 넣기', '마지막 그림은 그대로 남음', '<code>dir(Image)</code> 로 목록 확인', '외우지 말고 찾아 쓰기'],
            notes: '<p>셸에서 dir(Image) 를 실행해 목록을 함께 봅니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: '리스트로 여러 장 다루기', code: 'from microbit import *\n\nanimals = [Image.DUCK, Image.RABBIT, Image.COW]\n\nfor a in animals:\n    display.show(a)\n    sleep(1000)',
            points: ['<code>[ ]</code> = 리스트 (여러 값 묶음)', '<code>for a in animals:</code> 로 하나씩 꺼냄', '번호는 <b>0부터</b>', '<code>Image.ALL_ARROWS</code> 도 리스트'],
            notes: '<p>리스트는 7장 이후에 자세히 다룹니다. 여기서는 "여러 개를 묶어 차례로 꺼낸다" 정도로 소개합니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '변수에 담기', code: 'from microbit import *\n\nbig = Image.HEART\nsmall = Image.HEART_SMALL\n\nwhile True:\n    display.show(big)\n    sleep(200)\n    display.show(small)\n    sleep(200)',
            points: ['자주 쓰는 그림에 <b>짧은 이름</b>', '바꿀 때 <b>한 줄만</b> 고치면 됨', '코드가 읽기 쉬워짐', '변수 이름은 소문자로'],
            notes: '<p>변수를 "별명 붙이기"로 설명하면 이해가 빠릅니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'practice', title: '실습 3-2. 화살표 나침반', desc: '화살표 8개를 시계 방향으로 돌려 보세요.',
            starter: 'from microbit import *\n\nwhile True:\n    # TODO\n    pass\n',
            solution: 'from microbit import *\n\nwhile True:\n    for arrow in Image.ALL_ARROWS:\n        display.show(arrow)\n        sleep(150)\n',
            notes: '<p>처음에는 8줄로 쓰게 두고, 나중에 ALL_ARROWS 를 알려 주면 "이렇게 짧아지는구나" 하는 감동이 있습니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['<code>Image</code> = 5×5 그림 한 장', '60가지 이상 내장 · 이름은 대문자', '<code>dir(Image)</code> 로 목록 확인', '리스트 <code>[ ]</code> 로 여러 장 묶기', '변수로 짧은 이름 붙이기'],
            notes: '<p>다음 시간 예고: 나만의 그림 직접 만들기.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch03-2',
        title: '나만의 그림 만들기 — 좌표와 픽셀',
        minutes: 45,
        goals: [
          'LED 화면의 좌표 체계(왼쪽 위가 0,0)를 설명할 수 있다',
          '<code>Image("…")</code> 문자열로 원하는 그림을 만들 수 있다',
          '<code>set_pixel</code> · <code>get_pixel</code> 로 LED 하나를 다룰 수 있다',
          '밝기 0~9 를 활용해 표현을 다양하게 할 수 있다'
        ],
        flow: [['좌표 이해하기', 10], ['Image 문자열', 14], ['set_pixel · get_pixel', 12], ['밝기 활용', 6], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: 'LED 화면의 좌표' },
          { type: 'p', html: 'LED 하나하나를 다루려면 <b>어느 위치인지</b> 말할 수 있어야 합니다. micro:bit 는 <b>왼쪽 위 모서리를 (0, 0)</b> 으로 잡고, 오른쪽으로 <code>x</code>, <b>아래로</b> <code>y</code> 가 커집니다.' },
          { type: 'figure', html: FIG_GRID, caption: '그림 3-4. LED 화면의 좌표 — 수학 시간과 달리 y 는 아래로 갈수록 커진다' },
          { type: 'callout', kind: 'warn', title: 'y 방향에 주의!', html: '수학 시간에 배우는 좌표평면은 위로 갈수록 <code>y</code> 가 커지지만, 컴퓨터 화면은 <b>아래로 갈수록</b> 커집니다. <code>(0, 4)</code> 는 왼쪽 <b>아래</b>입니다.' },
          {
            type: 'code', repl: true, title: '셸에서 좌표 확인하기', code: `display.clear()
display.set_pixel(0, 0, 9)
display.set_pixel(4, 0, 9)
display.set_pixel(2, 2, 9)
display.set_pixel(0, 4, 9)
display.set_pixel(4, 4, 9)`,
            desc: '네 모서리와 가운데가 켜집니다. 보드 그림을 보면서 좌표가 어디를 가리키는지 확인하세요.',
            expect: '네 모서리 + 가운데 LED 가 켜집니다.'
          },

          { type: 'h', text: 'Image("…") — 숫자로 그림 그리기' },
          { type: 'p', html: '내장 이미지에 없는 그림은 <b>숫자 문자열</b>로 직접 만듭니다. 한 줄에 5글자씩, 5줄을 콜론(<code>:</code>)으로 이어 씁니다. 숫자 <b>0</b> 은 꺼짐, <b>9</b> 는 가장 밝음입니다.' },
          { type: 'figure', html: FIG_STRING, caption: '그림 3-5. Image("…") 문자열의 구조' },
          {
            type: 'code', title: '예제 3-5. 나만의 그림 만들기', code: `from microbit import *

smiley = Image("00000:"
               "09090:"
               "00000:"
               "90009:"
               "09990")

display.show(smiley)`,
            desc: '문자열을 <b>여러 줄로 나눠 쓰면</b> 그림 모양이 코드에 그대로 보여 훨씬 읽기 좋습니다. 파이썬은 붙어 있는 문자열을 자동으로 이어 줍니다. 숫자를 바꿔 가며 나만의 그림을 만들어 보세요.',
            expect: '웃는 얼굴이 나타납니다.'
          },
          {
            type: 'code', title: '예제 3-6. 한 줄로 쓰기', code: `from microbit import *

# 위와 똑같은 그림 (한 줄로)
smiley = Image("00000:09090:00000:90009:09990")
display.show(smiley)

# 마지막에 콜론을 붙여도 됩니다
boat = Image("00000:00000:00000:99999:09990:")
display.show(boat)
sleep(1000)`,
            desc: '한 줄로 써도 같습니다. 줄 수가 5개보다 적으면 나머지는 꺼진 채로 둡니다.',
            expect: '웃는 얼굴 → 배 모양'
          },
          {
            type: 'figure', html: `<div style="text-align:center">
            ${screen('00000 09090 00000 90009 09990', 'Image("00000:09090:\\n00000:90009:09990")', true)}
            ${screen('09990 99999 99999 99999 09990', '전부 켜기', true)}
            ${screen('90009 09090 00900 09090 90009', 'X 모양', true)}
            </div>`, caption: '그림 3-6. 직접 만든 그림의 예'
          },
          { type: 'callout', kind: 'tip', title: '그림 설계 요령', html: '종이에 5×5 칸을 그려 놓고 색칠한 다음, 칠한 칸을 <code>9</code>, 빈 칸을 <code>0</code> 으로 옮겨 적으면 실수가 줄어듭니다. 모눈종이 한 장을 나눠 주면 좋습니다.' },

          { type: 'h', text: '밝기 0 ~ 9 활용하기' },
          { type: 'p', html: '<code>0</code> 과 <code>9</code> 사이의 숫자를 쓰면 <b>중간 밝기</b>가 됩니다. 이걸 이용하면 그림자, 반짝임, 멀어지는 느낌을 표현할 수 있습니다.' },
          {
            type: 'code', title: '예제 3-7. 밝기 단계', code: `from microbit import *

steps = Image("01234:"
              "12345:"
              "23456:"
              "34567:"
              "45678")

display.show(steps)`,
            desc: '왼쪽 위에서 오른쪽 아래로 갈수록 밝아지는 그라데이션입니다. 오른쪽 보드 그림에서 밝기 차이를 확인해 보세요.',
            expect: '대각선으로 점점 밝아지는 화면'
          },
          {
            type: 'code', title: '예제 3-8. 부드럽게 나타나는 하트', code: `from microbit import *

while True:
    # 밝기를 0 배 → 1 배로 늘리며 나타나게
    for b in range(0, 10):
        display.show(Image.HEART * (b / 9))
        sleep(60)
    for b in range(9, -1, -1):
        display.show(Image.HEART * (b / 9))
        sleep(60)`,
            desc: '이미지에 <b>숫자를 곱하면</b> 전체 밝기가 그 배율로 바뀝니다. <code>Image.HEART * 0.5</code> 는 절반 밝기입니다. 하트가 숨 쉬듯 나타났다 사라집니다.',
            expect: '하트가 부드럽게 밝아졌다 어두워지기를 반복합니다.'
          },

          { type: 'h', text: 'set_pixel 과 get_pixel' },
          { type: 'p', html: '그림 전체가 아니라 <b>LED 하나만</b> 다루고 싶을 때 씁니다.' },
          {
            type: 'table', head: ['명령', '하는 일'], rows: [
              ['<code>display.set_pixel(x, y, 밝기)</code>', '(x, y) 위치 LED 의 밝기를 <b>정한다</b> (밝기 0~9)'],
              ['<code>display.get_pixel(x, y)</code>', '(x, y) 위치 LED 의 현재 밝기를 <b>읽는다</b>'],
              ['<code>display.clear()</code>', '모든 LED 를 끈다']
            ]
          },
          {
            type: 'code', title: '예제 3-9. 점 찍어 테두리 그리기', code: `from microbit import *

display.clear()
for i in range(5):
    display.set_pixel(i, 0, 9)   # 위쪽 줄
    display.set_pixel(i, 4, 9)   # 아래쪽 줄
    display.set_pixel(0, i, 9)   # 왼쪽 줄
    display.set_pixel(4, i, 9)   # 오른쪽 줄
    sleep(150)`,
            desc: '<code>i</code> 가 0, 1, 2, 3, 4 로 바뀌면서 네 변이 동시에 그려집니다. 이렇게 반복문과 좌표를 함께 쓰면 규칙적인 그림을 쉽게 만들 수 있습니다.',
            expect: '사각형 테두리가 서서히 그려집니다.'
          },
          {
            type: 'code', title: '예제 3-10. 움직이는 점', code: `from microbit import *

x = 0
y = 2
while True:
    display.clear()
    display.set_pixel(x, y, 9)
    sleep(200)
    x = x + 1
    if x > 4:       # 오른쪽 끝에 닿으면 다시 왼쪽으로
        x = 0`,
            desc: '점 하나가 왼쪽에서 오른쪽으로 계속 움직입니다. <code>display.clear()</code> 를 빼면 어떻게 되는지도 확인해 보세요. (지우지 않으면 지나간 자리가 남습니다)',
            expect: '가운데 줄에서 점 하나가 왼쪽 → 오른쪽으로 계속 움직입니다.'
          },
          {
            type: 'code', title: '예제 3-11. get_pixel 로 상태 읽기', code: `from microbit import *

display.clear()
display.set_pixel(2, 2, 7)

print("가운데 밝기:", display.get_pixel(2, 2))
print("왼쪽 위 밝기:", display.get_pixel(0, 0))

# 켜져 있으면 끄고, 꺼져 있으면 켠다 (토글)
while True:
    now = display.get_pixel(2, 2)
    display.set_pixel(2, 2, 0 if now > 0 else 9)
    sleep(400)`,
            desc: '<code>get_pixel()</code> 로 현재 밝기를 읽어 와 반대로 바꾸면 <b>깜빡임</b>을 만들 수 있습니다. <code>0 if now &gt; 0 else 9</code> 는 “now 가 0보다 크면 0, 아니면 9” 라는 뜻입니다.',
            expect: '가운데 밝기: 7\n왼쪽 위 밝기: 0\n(가운데 LED 가 깜빡입니다)'
          },
          { type: 'callout', kind: 'warn', title: '좌표는 0~4 까지만', html: '<code>display.set_pixel(5, 0, 9)</code> 처럼 범위를 벗어나면 <code>ValueError: index out of bounds</code> 가 납니다. 밝기도 <b>0~9</b> 를 벗어나면 오류입니다.' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 화면을 읽어 콘솔에 그리기', code: `from microbit import *

display.show(Image.HEART)
sleep(300)

# 화면의 25칸을 읽어 콘솔에 그대로 찍어 본다
for y in range(5):
    row = ""
    for x in range(5):
        row = row + ("#" if display.get_pixel(x, y) > 0 else ".")
    print(row)`,
            desc: '<code>get_pixel()</code> 로 현재 화면을 읽어 <code>#</code> 과 <code>.</code> 으로 다시 그렸습니다. 화면 상태를 <b>확인(디버깅)</b>할 때 아주 유용한 방법입니다.',
            expect: '.#.#.\n#####\n#####\n.###.\n..#..'
          },
          {
            type: 'code', title: '더 해 보기 ②. 밝기로 그라데이션 애니메이션', code: `from microbit import *

while True:
    # 왼쪽에서 오른쪽으로 밝기가 흐른다
    for t in range(10):
        for x in range(5):
            for y in range(5):
                b = (t + x) % 10
                display.set_pixel(x, y, b)
        sleep(90)`,
            desc: '<code>(t + x) % 10</code> 으로 <b>열마다 밝기를 한 단계씩 어긋나게</b> 주면 빛이 흐르는 것처럼 보입니다. <code>x</code> 를 <code>y</code> 로 바꾸면 세로로 흐릅니다.',
            expect: '밝기 물결이 왼쪽에서 오른쪽으로 흐릅니다.'
          },
          {
            type: 'code', title: '더 해 보기 ③. 큰 그림에서 잘라 내기 (crop)', code: `from microbit import *

# 10칸 × 5줄짜리 큰 그림
big = Image("9000000009:"
            "0900000090:"
            "0090000900:"
            "0009009000:"
            "0000990000")

print("크기:", big.width(), "x", big.height())

# 5칸 창을 오른쪽으로 옮겨 가며 들여다본다
while True:
    for x in range(big.width() - 4):
        display.show(big.crop(x, 0, 5, 5))
        sleep(200)`,
            desc: '<code>Image</code> 는 <b>5×5 보다 클 수도</b> 있습니다. <code>crop(x, y, 폭, 높이)</code> 로 원하는 부분만 잘라 내면 큰 그림을 훑어보는 효과가 됩니다 — <code>scroll()</code> 이 하는 일과 같은 원리입니다.',
            expect: '크기: 10 x 5\n(V 자 모양이 오른쪽으로 지나갑니다)'
          },

          { type: 'h', text: '2교시 요약' },
          {
            type: 'list', items: [
              'LED 좌표는 <b>왼쪽 위가 (0, 0)</b>, 오른쪽으로 <code>x</code>, <b>아래로</b> <code>y</code> 가 커집니다. 둘 다 0~4.',
              '<code>Image("00000:09090:…")</code> — 숫자 문자열로 나만의 그림을 만듭니다. <b>0 = 꺼짐, 9 = 가장 밝음</b>.',
              '여러 줄로 나눠 쓰면 그림 모양이 코드에 그대로 보입니다.',
              '<code>display.set_pixel(x, y, 밝기)</code> / <code>display.get_pixel(x, y)</code> 로 LED 하나를 다룹니다.',
              '이미지에 숫자를 곱하면(<code>Image.HEART * 0.5</code>) 전체 밝기가 바뀝니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 3-3. 내 이니셜 그리기',
            level: 1,
            desc: '<p><code>Image("…")</code> 로 <b>내 이름의 첫 글자</b>(알파벳)를 5×5 로 그려 보세요.</p><p>예: <code>H</code> 는 <code>"90009:90009:99999:90009:90009"</code></p><p>완성하면 2초 보여 주고, 그다음 밝기를 절반으로(<code>* 0.5</code>) 해서 2초 더 보여 주세요.</p>',
            hint: '종이에 5×5 칸을 그리고 색칠한 뒤 옮겨 적으면 쉽습니다. 여러 줄로 나눠 쓰면 모양이 보입니다.',
            starter: 'from microbit import *\n\nletter = Image("00000:"\n               "00000:"\n               "00000:"\n               "00000:"\n               "00000")\n\ndisplay.show(letter)\nsleep(2000)\n# TODO: 절반 밝기로 2초 더\n',
            solution: 'from microbit import *\n\nletter = Image("90009:"\n               "90009:"\n               "99999:"\n               "90009:"\n               "90009")\n\ndisplay.show(letter)\nsleep(2000)\ndisplay.show(letter * 0.5)\nsleep(2000)\ndisplay.clear()\n'
          },
          {
            title: '실습 3-4. 대각선 스캐너',
            level: 2,
            desc: '<p><code>set_pixel</code> 과 반복문으로 <b>왼쪽 위에서 오른쪽 아래로</b> 이동하는 점을 만드세요.</p><ul><li>점이 지나간 자리는 지웁니다.</li><li>끝에 닿으면 다시 처음부터 (끝없이 반복)</li><li>도전: 점 뒤에 <b>흐릿한 꼬리</b>가 남게 해 보세요. (바로 앞 칸은 밝기 3 정도)</li></ul>',
            hint: '대각선이므로 <code>x</code> 와 <code>y</code> 가 같습니다. <code>for i in range(5):</code> 안에서 <code>display.set_pixel(i, i, 9)</code>. 꼬리는 <code>if i &gt; 0: display.set_pixel(i-1, i-1, 3)</code>',
            starter: 'from microbit import *\n\nwhile True:\n    for i in range(5):\n        display.clear()\n        # TODO: (i, i) 에 점 찍기\n        sleep(200)\n',
            solution: 'from microbit import *\n\nwhile True:\n    for i in range(5):\n        display.clear()\n        if i > 0:\n            display.set_pixel(i - 1, i - 1, 3)\n        display.set_pixel(i, i, 9)\n        sleep(200)\n'
          },
          {
            title: '실습 3-5. 도전! 레이더',
            level: 3,
            desc: '<p>가운데(2, 2)를 중심으로 <b>테두리를 한 바퀴 도는 점</b>을 만드세요. 레이더가 도는 것처럼 보입니다.</p><ul><li>가운데 점은 항상 밝기 3 으로 켜 둡니다.</li><li>테두리 12칸을 시계 방향으로 한 칸씩 이동합니다.</li><li>끝없이 반복합니다.</li></ul><p><b>힌트</b>: 테두리 좌표를 리스트로 미리 적어 두면 훨씬 쉽습니다.</p>',
            hint: '<code>path = [(2,0),(3,0),(4,0),(4,1),(4,2),(4,3),(4,4),(3,4),(2,4),(1,4),(0,4),(0,3),(0,2),(0,1),(0,0),(1,0)]</code> 처럼 좌표 쌍을 리스트로 만들고 <code>for x, y in path:</code> 로 꺼내 씁니다.',
            starter: 'from microbit import *\n\npath = [(2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3), (4, 4),\n        (3, 4), (2, 4), (1, 4), (0, 4), (0, 3), (0, 2), (0, 1), (0, 0), (1, 0)]\n\nwhile True:\n    for x, y in path:\n        # TODO: 화면 지우고, 가운데 밝기 3, (x, y) 밝기 9\n        sleep(100)\n',
            solution: 'from microbit import *\n\npath = [(2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3), (4, 4),\n        (3, 4), (2, 4), (1, 4), (0, 4), (0, 3), (0, 2), (0, 1), (0, 0), (1, 0)]\n\nwhile True:\n    for x, y in path:\n        display.clear()\n        display.set_pixel(2, 2, 3)\n        display.set_pixel(x, y, 9)\n        sleep(100)\n'
          }
        ],
        quiz: [
          {
            q: 'LED 화면에서 <code>(0, 0)</code> 은 어디인가요?', options: ['왼쪽 아래', '왼쪽 위', '가운데', '오른쪽 위'], answer: 1,
            explain: '<b>왼쪽 위</b> 모서리입니다. <code>x</code> 는 오른쪽으로, <code>y</code> 는 <b>아래로</b> 커집니다.'
          },
          {
            q: '<code>Image("…")</code> 문자열에서 숫자 <code>0</code> 과 <code>9</code> 의 뜻은?', options: ['0 = 가장 밝음, 9 = 꺼짐', '0 = 꺼짐, 9 = 가장 밝음', '0 = 빨강, 9 = 파랑', '아무 뜻 없음'], answer: 1,
            explain: '<b>0 은 꺼짐, 9 는 가장 밝음</b>입니다. 그 사이 숫자는 중간 밝기입니다.'
          },
          {
            q: '<code>display.set_pixel(5, 2, 9)</code> 를 실행하면?', options: ['오른쪽 끝이 켜진다', '<code>ValueError: index out of bounds</code>', '아무 일도 안 일어난다', '전체가 켜진다'], answer: 1,
            explain: '좌표는 <b>0 ~ 4</b> 까지만 쓸 수 있습니다. 5 는 범위를 벗어나 오류가 납니다.'
          },
          {
            q: '<code>Image.HEART * 0.5</code> 의 결과는?', options: ['하트가 절반만 보인다', '하트 전체가 절반 밝기가 된다', '하트가 두 개가 된다', '오류'], answer: 1,
            explain: '이미지에 숫자를 곱하면 <b>전체 밝기</b>가 그 배율로 바뀝니다.'
          },
          {
            q: '다음 그림이 나타내는 모양은?<pre><code>Image("00900:00900:99999:00900:00900")</code></pre>', options: ['X 모양', '십자(+) 모양', '네모', '하트'], answer: 1,
            explain: '가운데 세로줄과 가운데 가로줄이 켜지므로 <b>십자(+) 모양</b>입니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '나만의 그림 만들기', subtitle: 'Chapter 03 · 좌표와 픽셀', badge: '2교시',
            notes: '<p>모눈종이(5×5 칸이 그려진 종이)를 미리 나눠 주면 효과가 큽니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'diagram', title: 'LED 화면의 좌표', html: FIG_GRID, caption: '왼쪽 위가 (0,0) · y 는 아래로 커집니다',
            notes: '<p><b>발문</b>: "수학 시간의 좌표와 뭐가 다를까요?" → y 방향이 반대. 컴퓨터 화면은 대부분 이렇습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'diagram', title: 'Image("…") 문자열', html: FIG_STRING, caption: '0 = 꺼짐, 9 = 가장 밝음 · 5글자 × 5줄',
            notes: '<p>칠판에 5×5 칸을 그리고 학생들에게 색칠하게 한 뒤 함께 숫자로 옮겨 적어 봅니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '나만의 그림 만들기', code: 'from microbit import *\n\nsmiley = Image("00000:"\n               "09090:"\n               "00000:"\n               "90009:"\n               "09990")\n\ndisplay.show(smiley)',
            points: ['여러 줄로 나눠 쓰면 <b>모양이 보임</b>', '각 줄 5글자 · 모두 5줄', '콜론(:) 으로 줄 구분', '숫자를 바꿔 실험하기'],
            notes: '<p>학생마다 자기 그림을 만들어 발표하게 하면 수업 분위기가 좋아집니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'code', title: '밝기 활용', code: 'from microbit import *\n\nsteps = Image("01234:"\n              "12345:"\n              "23456:"\n              "34567:"\n              "45678")\ndisplay.show(steps)\nsleep(2000)\ndisplay.show(Image.HEART * 0.3)',
            points: ['0 ~ 9 사이 숫자 = 중간 밝기', '그라데이션 · 그림자 표현', '<code>이미지 * 숫자</code> 로 전체 밝기 조절', '숨 쉬는 효과에 활용'],
            notes: '<p>밝기 차이는 시뮬레이터에서도 잘 보이지만 실제 보드에서 더 극적입니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: 'set_pixel — LED 하나씩', code: 'from microbit import *\n\ndisplay.clear()\nfor i in range(5):\n    display.set_pixel(i, 0, 9)\n    display.set_pixel(i, 4, 9)\n    display.set_pixel(0, i, 9)\n    display.set_pixel(4, i, 9)\n    sleep(150)',
            points: ['<code>set_pixel(x, y, 밝기)</code>', '<code>get_pixel(x, y)</code> 로 읽기', '반복문 + 좌표 = 규칙적인 그림', '좌표는 0~4, 밝기는 0~9'],
            notes: '<p>i 가 바뀌면서 네 변이 동시에 그려지는 것을 짚어 줍니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'practice', title: '실습 3-4. 대각선 스캐너', desc: '왼쪽 위 → 오른쪽 아래로 이동하는 점. 꼬리도 남겨 보세요.',
            starter: 'from microbit import *\n\nwhile True:\n    for i in range(5):\n        display.clear()\n        # TODO\n        sleep(200)\n',
            solution: 'from microbit import *\n\nwhile True:\n    for i in range(5):\n        display.clear()\n        if i > 0:\n            display.set_pixel(i - 1, i - 1, 3)\n        display.set_pixel(i, i, 9)\n        sleep(200)\n',
            notes: '<p>clear() 를 빼면 어떻게 되는지 먼저 실험하게 하면 clear 의 역할을 확실히 이해합니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'summary', title: '2교시 정리', bullets: ['좌표: 왼쪽 위 (0,0) · x→오른쪽 · y→아래 · 0~4', '<code>Image("00000:09090:…")</code> · 0=꺼짐 9=가장밝음', '<code>set_pixel(x, y, 밝기)</code> / <code>get_pixel(x, y)</code>', '<code>이미지 * 숫자</code> = 밝기 조절', '범위를 벗어나면 ValueError'],
            notes: '<p>다음 시간 예고: 그림을 이어 붙여 애니메이션 만들기.</p><p>시간: 2분</p>'
          }
        ]
      },

      /* ═══════════════════════ 3교시 ═══════════════════════ */
      {
        id: 'ch03-3',
        title: '애니메이션 — 그림을 움직이게',
        minutes: 45,
        goals: [
          '이미지 리스트와 <code>delay</code> · <code>loop</code> 로 애니메이션을 만들 수 있다',
          '<code>Image.ALL_CLOCKS</code> · <code>ALL_ARROWS</code> 를 활용할 수 있다',
          '이미지를 밀어(<code>shift_*</code>) 움직이는 효과를 만들 수 있다',
          '이미지끼리 더하고 곱해 새 그림을 만들 수 있다'
        ],
        flow: [['애니메이션 원리', 6], ['리스트 애니메이션', 12], ['내장 애니메이션', 8], ['shift 와 연산', 12], ['정리 · 퀴즈', 7]],
        content: [
          { type: 'h', text: '애니메이션 = 그림을 빠르게 바꾸기' },
          { type: 'p', html: '만화 영화, 게임, 이 화면의 움직임 — 모두 <b>조금씩 다른 그림을 빠르게 바꾸는 것</b>입니다. micro:bit 도 똑같습니다. 여러 장의 <code>Image</code> 를 <b>리스트</b>로 묶어 <code>display.show()</code> 에 주면 차례로 바꿔 가며 보여 줍니다.' },
          {
            type: 'code', title: '예제 3-12. 심장 박동 (리스트 버전)', code: `from microbit import *

beat = [Image.HEART, Image.HEART_SMALL]
display.show(beat, delay=250, loop=True)`,
            desc: '2장에서 <code>while True:</code> 로 만들었던 심장 박동을 <b>단 두 줄</b>로 줄였습니다. <code>delay</code> 는 한 장을 보여 주는 시간(ms), <code>loop=True</code> 는 끝없이 반복입니다.',
            expect: '하트가 커졌다 작아졌다를 반복합니다.'
          },
          {
            type: 'table', head: ['옵션', '기본값', '뜻'], rows: [
              ['<code>delay</code>', '400', '한 장을 보여 주는 시간(ms)'],
              ['<code>loop</code>', '<code>False</code>', '<code>True</code> 면 끝없이 반복'],
              ['<code>wait</code>', '<code>True</code>', '<code>False</code> 면 애니메이션이 도는 동안 다음 줄 실행'],
              ['<code>clear</code>', '<code>False</code>', '<code>True</code> 면 끝난 뒤 화면을 지움']
            ], caption: '표 3-2. show() 의 애니메이션 옵션'
          },
          {
            type: 'code', title: '예제 3-13. 직접 만든 애니메이션 — 파도', code: `from microbit import *

wave1 = Image("99999:"
              "00000:"
              "00000:"
              "00000:"
              "00000")
wave2 = Image("00000:"
              "99999:"
              "00000:"
              "00000:"
              "00000")
wave3 = Image("00000:"
              "00000:"
              "99999:"
              "00000:"
              "00000")
wave4 = Image("00000:"
              "00000:"
              "00000:"
              "99999:"
              "00000")
wave5 = Image("00000:"
              "00000:"
              "00000:"
              "00000:"
              "99999")

display.show([wave1, wave2, wave3, wave4, wave5], delay=120, loop=True)`,
            desc: '가로줄이 위에서 아래로 내려가는 애니메이션입니다. 다섯 장의 그림을 리스트로 묶었습니다. (이 코드는 잠시 뒤 <code>shift_down</code> 으로 훨씬 짧게 만들 수 있습니다)',
            expect: '가로줄이 위에서 아래로 계속 흘러내립니다.'
          },

          { type: 'h', text: '내장 애니메이션' },
          { type: 'p', html: 'micro:bit 에는 애니메이션용 <b>이미지 리스트</b>가 두 개 준비되어 있습니다.' },
          {
            type: 'code', title: '예제 3-14. 시계와 화살표', code: `from microbit import *

# 시계 바늘이 한 바퀴 돈다 (12장)
display.show(Image.ALL_CLOCKS, delay=100)

# 화살표가 한 바퀴 돈다 (8장)
display.show(Image.ALL_ARROWS, delay=150)

display.clear()`,
            desc: '<code>Image.ALL_CLOCKS</code> 는 시계 바늘 12장, <code>Image.ALL_ARROWS</code> 는 화살표 8장입니다. 기다리는 중임을 표시할 때 자주 씁니다.',
            expect: '시계 바늘이 한 바퀴 돈 뒤, 화살표가 한 바퀴 돕니다.'
          },
          {
            type: 'code', title: '예제 3-15. 로딩 중 표시', code: `from microbit import *

display.scroll("LOADING", delay=60)
# 시계를 3바퀴 돌린다
for turn in range(3):
    display.show(Image.ALL_CLOCKS, delay=80)
display.show(Image.YES)
sleep(1000)
display.clear()`,
            desc: '실제 프로그램에서 “처리 중”을 보여 줄 때 이런 식으로 씁니다. <code>Image.YES</code> 는 체크 표시입니다.',
            expect: 'LOADING 이 흐른 뒤 시계가 3바퀴 돌고 체크 표시가 나타납니다.'
          },

          { type: 'h', text: '이미지 밀기 — shift' },
          { type: 'p', html: '이미지를 <b>한 칸씩 밀어서</b> 새 이미지를 만들 수 있습니다. 애니메이션을 훨씬 쉽게 만들 수 있는 강력한 기능입니다.' },
          {
            type: 'table', head: ['메서드', '하는 일'], rows: [
              ['<code>이미지.shift_left(n)</code>', '왼쪽으로 n 칸 밀기'],
              ['<code>이미지.shift_right(n)</code>', '오른쪽으로 n 칸 밀기'],
              ['<code>이미지.shift_up(n)</code>', '위로 n 칸 밀기'],
              ['<code>이미지.shift_down(n)</code>', '아래로 n 칸 밀기']
            ]
          },
          {
            type: 'figure', html: `<div style="text-align:center">
            ${screen('99999 00000 00000 00000 00000', '원본')}
            ${screen('00000 99999 00000 00000 00000', 'shift_down(1)')}
            ${screen('00000 00000 99999 00000 00000', 'shift_down(2)')}
            <span style="font-size:26px;vertical-align:60px;color:var(--muted)">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            ${screen('09090 99999 99999 09990 00900', '원본')}
            ${screen('90900 99990 99990 99900 09000', 'shift_left(1)')}
            ${screen('00909 09999 09999 00999 00090', 'shift_right(1)')}
            </div>`, caption: '그림 3-7. shift 로 이미지 밀기 — 밀려 나간 부분은 사라지고 빈 자리는 꺼집니다'
          },
          {
            type: 'code', title: '예제 3-16. shift 로 파도 만들기 (짧은 버전)', code: `from microbit import *

line = Image("99999:00000:00000:00000:00000")

while True:
    for i in range(5):
        display.show(line.shift_down(i))
        sleep(120)`,
            desc: '예제 3-13 에서 다섯 장을 일일이 만들던 것을 <b>원본 한 장 + shift</b> 로 줄였습니다. <code>i</code> 가 0~4 로 바뀌면서 줄이 내려갑니다. 같은 결과를 훨씬 짧게!',
            expect: '가로줄이 위에서 아래로 계속 흘러내립니다.'
          },
          {
            type: 'code', title: '예제 3-17. 지나가는 하트', code: `from microbit import *

heart = Image.HEART

while True:
    # 오른쪽에서 들어와 왼쪽으로 나간다
    for i in range(5, -6, -1):
        display.show(heart.shift_left(i))
        sleep(120)`,
            desc: '<code>shift_left(5)</code> 는 완전히 왼쪽 밖(화면이 빈 상태), <code>shift_left(-5)</code> 는 완전히 오른쪽 밖입니다. 그 사이를 지나가며 하트가 화면을 가로지릅니다. <b>음수를 넣으면 반대 방향</b>으로 밀립니다.',
            expect: '하트가 오른쪽에서 나타나 왼쪽으로 지나갑니다.'
          },

          { type: 'h', text: '이미지 연산 — 더하기와 곱하기' },
          {
            type: 'table', head: ['연산', '뜻', '예'], rows: [
              ['<code>A + B</code>', '두 그림을 <b>겹친다</b> (같은 자리의 밝기를 더함, 최대 9)', '<code>Image.HEART + Image.SQUARE</code>'],
              ['<code>A - B</code>', 'A 에서 B 를 <b>뺀다</b> (최소 0)', '<code>Image.SQUARE - Image.SQUARE_SMALL</code>'],
              ['<code>A * 수</code>', '전체 밝기를 <b>배율</b>로 조절', '<code>Image.HEART * 0.5</code>'],
              ['<code>A / 수</code>', '전체 밝기를 <b>나눔</b>', '<code>Image.HEART / 2</code>'],
              ['<code>A.invert()</code>', '밝기를 <b>뒤집는다</b> (0↔9)', '<code>Image.HEART.invert()</code>']
            ]
          },
          {
            type: 'figure', html: `<div style="text-align:center">
            ${screen('09090 99999 99999 09990 00900', 'HEART')}
            <span style="font-size:30px;vertical-align:50px;color:var(--muted)">+</span>
            ${screen('99999 90009 90009 90009 99999', 'SQUARE')}
            <span style="font-size:30px;vertical-align:50px;color:var(--muted)">=</span>
            ${screen('99999 99999 99999 99999 99999', '겹친 결과')}
            <span style="font-size:26px;vertical-align:50px;color:var(--muted)">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            ${screen('09090 99999 99999 09990 00900', 'HEART')}
            <span style="font-size:30px;vertical-align:50px;color:var(--muted)">→</span>
            ${screen('90909 00000 00000 90009 99099', 'invert()')}
            </div>`, caption: '그림 3-8. 이미지 더하기와 반전'
          },
          {
            type: 'code', title: '예제 3-18. 반짝이는 별', code: `from microbit import *

star = Image("00900:"
             "00900:"
             "99999:"
             "00900:"
             "00900")
glow = Image("90009:"
             "00000:"
             "00000:"
             "00000:"
             "90009")

while True:
    display.show(star)
    sleep(300)
    display.show(star + glow)     # 모서리 반짝임을 겹친다
    sleep(150)`,
            desc: '두 그림을 <code>+</code> 로 겹치면 반짝이는 효과가 됩니다. 같은 자리에 겹치면 밝기가 더해지되 최대 9 를 넘지 않습니다.',
            expect: '십자 모양 별의 모서리가 반짝입니다.'
          },
          {
            type: 'code', title: '예제 3-19. 그림 반전 깜빡이', code: `from microbit import *

face = Image.HAPPY
while True:
    display.show(face)
    sleep(600)
    display.show(face.invert())
    sleep(600)`,
            desc: '<code>invert()</code> 는 켜진 곳은 끄고, 꺼진 곳은 켭니다. 네거티브 필름처럼 보입니다.',
            expect: '웃는 얼굴과 그 반전이 번갈아 나타납니다.'
          },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 대각선으로 움직이기', code: `from microbit import *

heart = Image.HEART

while True:
    # shift 를 두 번 겹치면 대각선이 된다
    for i in range(5, -6, -1):
        display.show(heart.shift_left(i).shift_up(i))
        sleep(110)`,
            desc: '<code>shift_left()</code> 의 결과에 다시 <code>shift_up()</code> 을 이어 붙이면 <b>대각선 이동</b>이 됩니다. 이렇게 메서드를 <b>연달아 부르는 것</b>을 체이닝이라고 합니다.',
            expect: '하트가 오른쪽 아래에서 왼쪽 위로 대각선으로 지나갑니다.'
          },
          {
            type: 'code', title: '더 해 보기 ②. 빼기로 구멍 뚫기', code: `from microbit import *

full = Image("99999:99999:99999:99999:99999")

while True:
    # 가운데가 점점 커지며 뚫린다
    for hole in [Image.DIAMOND_SMALL, Image.DIAMOND, Image.SQUARE_SMALL, Image.SQUARE]:
        display.show(full - hole)
        sleep(350)
    display.show(full)
    sleep(350)`,
            desc: '<code>A - B</code> 는 A 에서 B 만큼 <b>밝기를 뺍니다</b>(최소 0). 밝은 배경에서 모양만 오려 내는 효과를 만들 수 있습니다.',
            expect: '꽉 찬 화면에 구멍이 점점 커졌다가 다시 채워집니다.'
          },
          {
            type: 'code', title: '더 해 보기 ③. 코드로 그림 만들기', code: `from microbit import *


def make_ring(r):
    """가운데(2,2)에서 거리가 r 인 칸만 켠 그림을 만든다"""
    im = Image()                      # 전부 꺼진 5x5
    for y in range(5):
        for x in range(5):
            d = max(abs(x - 2), abs(y - 2))
            if d == r:
                im.set_pixel(x, y, 9)
    return im


while True:
    for r in [0, 1, 2]:
        display.show(make_ring(r))
        sleep(220)`,
            desc: '<code>Image()</code> 는 <b>전부 꺼진 빈 그림</b>을 만듭니다. 여기에 <code>set_pixel()</code> 로 칠하면 <b>계산으로 그림을 만들</b> 수 있습니다. 문자열로 일일이 적는 것보다 규칙적인 그림에 훨씬 편합니다.',
            expect: '가운데 점에서 사각 고리가 바깥으로 퍼져 나갑니다.'
          },

          { type: 'h', text: '🚀 응용 예제 — 화면을 자유자재로' },
          { type: 'p', html: '3장에서 배운 <b>이미지 · 좌표 · 애니메이션 · 연산</b>을 모아 만든 프로그램들입니다. 숫자와 그림을 바꿔 가며 나만의 버전으로 고쳐 보세요.' },
          {
            type: 'code', title: '응용 예제 3-1. 심장 박동 모니터', code: `from microbit import *
import music

BPM = 72                      # 1분에 몇 번 뛸까
beat = 60000 // BPM

BIG = Image.HEART
SMALL = Image.HEART_SMALL

while True:
    # 두근 (강)
    display.show(BIG)
    music.pitch(140, 60)
    sleep(120)
    display.show(SMALL)
    sleep(90)
    # 근 (약)
    display.show(BIG * 0.6)
    music.pitch(110, 50)
    sleep(100)
    display.clear()
    sleep(beat - 310)`,
            desc: '실제 심장 소리처럼 <b>“두 · 근”</b> 두 박을 한 묶음으로 만들었습니다. <code>BIG * 0.6</code> 으로 두 번째 박은 조금 약하게 표현했습니다. <code>BPM</code> 을 바꾸면 심박수가 달라집니다.',
            expect: '하트가 “두근” 하고 뛰며 낮은 소리가 함께 납니다.'
          },
          {
            type: 'code', title: '응용 예제 3-2. 출렁이는 물결', code: `from microbit import *

# 각 열의 높이가 파도처럼 오르내린다
WAVE = [0, 1, 2, 3, 4, 3, 2, 1]

while True:
    for t in range(len(WAVE)):
        display.clear()
        for x in range(5):
            h = WAVE[(t + x) % len(WAVE)]     # 열마다 조금씩 어긋나게
            for y in range(4, 4 - h - 1, -1):
                display.set_pixel(x, y, 9 - (4 - y))
        sleep(120)`,
            desc: '열마다 파도의 위상을 <b>한 칸씩 어긋나게</b> 주면 물결이 옆으로 흐르는 것처럼 보입니다. <code>9 - (4 - y)</code> 로 위로 갈수록 희미하게 만들어 물보라 느낌을 냈습니다.',
            expect: '아래쪽에서 물결이 좌우로 출렁입니다.'
          },
          {
            type: 'code', title: '응용 예제 3-3. 따라다니는 눈동자', code: `from microbit import *


def eyes(dx, dy):
    """눈동자가 (dx, dy) 쪽으로 치우친 얼굴"""
    im = Image()
    # 눈 흰자 자리
    im.set_pixel(1, 1, 3)
    im.set_pixel(3, 1, 3)
    # 눈동자 (범위를 벗어나지 않게 제한)
    im.set_pixel(max(0, min(4, 1 + dx)), max(0, min(4, 1 + dy)), 9)
    im.set_pixel(max(0, min(4, 3 + dx)), max(0, min(4, 1 + dy)), 9)
    # 입
    for x in range(1, 4):
        im.set_pixel(x, 4, 5)
    return im


while True:
    x = accelerometer.get_x()
    y = accelerometer.get_y()
    dx = 1 if x > 350 else (-1 if x < -350 else 0)
    dy = 1 if y > 350 else (-1 if y < -350 else 0)
    display.show(eyes(dx, dy))
    sleep(120)`,
            hint: '🧭 <b>센서 탭</b>의 기울기 판을 끌면 눈동자가 그쪽을 바라봅니다.',
            desc: '기울인 방향으로 눈동자가 움직입니다. <code>1 if 조건 else …</code> 는 “조건이 참이면 앞의 값, 아니면 뒤의 값” 이라는 짧은 표현입니다.',
            expect: '보드를 기울이면 눈동자가 그 방향을 바라봅니다.'
          },
          {
            type: 'code', title: '응용 예제 3-4. 그림과 글자를 섞은 배너', code: `from microbit import *

BANNER = [
    (Image.HOUSE, "OPEN"),
    (Image.MUSIC_QUAVER, "PARTY"),
    (Image.HEART, "WELCOME"),
    (Image.DUCK, "HAVE FUN"),
]

while True:
    for picture, text in BANNER:
        # 그림이 오른쪽에서 들어온다
        for i in range(5, -1, -1):
            display.show(picture.shift_left(i))
            sleep(70)
        sleep(400)
        display.scroll(text, delay=80)
        sleep(200)`,
            desc: '리스트 안에 <b>(그림, 글자) 쌍</b>을 담아 두고 하나씩 꺼내 씁니다. 그림이 슥 들어오는 연출을 넣으면 훨씬 완성도가 높아 보입니다. 축제나 학급 행사 안내판으로 써 보세요.',
            expect: '그림이 슬라이드해 들어온 뒤 글자가 흐르기를 반복합니다.'
          },
          {
            type: 'code', title: '응용 예제 3-5. 픽셀 아트 그리기 도구', code: `from microbit import *

canvas = Image()          # 빈 도화지
x, y = 0, 0               # 커서 위치
tick = 0

while True:
    # A: 커서 이동 (오른쪽 → 줄이 끝나면 다음 줄)
    if button_a.was_pressed():
        x = x + 1
        if x > 4:
            x = 0
            y = (y + 1) % 5

    # B: 지금 칸을 켜거나 끄기
    if button_b.was_pressed():
        canvas.set_pixel(x, y, 0 if canvas.get_pixel(x, y) else 9)

    # 로고: 완성된 그림 보기 + 코드로 출력
    if pin_logo.is_touched():
        display.show(canvas)
        print(repr(canvas))
        sleep(1500)

    # 커서는 깜빡이며 표시
    tick = tick + 1
    shown = canvas.copy()
    if tick % 4 < 2:
        shown.set_pixel(x, y, 9 if canvas.get_pixel(x, y) == 0 else 3)
    display.show(shown)
    sleep(120)`,
            desc: 'A 로 칸을 옮기고 B 로 켜고 끕니다. 로고를 터치하면 완성된 그림이 <code>Image(\'09090:…\')</code> 형태로 <b>콘솔에 출력</b>되므로, 그대로 복사해 다른 프로그램에 쓸 수 있습니다. <code>copy()</code> 로 원본을 건드리지 않고 커서만 겹쳐 그렸습니다.',
            expect: '커서가 깜빡이며 이동하고, B 로 칸을 칠할 수 있습니다.'
          },

          { type: 'h', text: '3교시 · 3장 요약' },
          {
            type: 'list', items: [
              '이미지 <b>리스트</b>를 <code>display.show()</code> 에 주면 애니메이션이 됩니다. <code>delay</code> · <code>loop</code> · <code>wait</code> · <code>clear</code> 옵션.',
              '<code>Image.ALL_CLOCKS</code>(12장) · <code>Image.ALL_ARROWS</code>(8장) 가 내장되어 있습니다.',
              '<code>shift_left · right · up · down(n)</code> 으로 이미지를 밀어 새 그림을 만듭니다. <b>음수면 반대 방향</b>.',
              '이미지끼리 <code>+</code>(겹치기) <code>-</code>(빼기) <code>*</code> <code>/</code>(밝기) 연산을 할 수 있고, <code>invert()</code> 로 반전합니다.',
              '애니메이션의 핵심은 <b>조금씩 다른 그림을 빠르게 바꾸는 것</b>입니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 3-6. 눈 깜빡이는 얼굴',
            level: 2,
            desc: '<p>웃는 얼굴이 가끔 <b>눈을 깜빡이는</b> 애니메이션을 만드세요.</p><ul><li>평소에는 눈을 뜬 얼굴(<code>Image.HAPPY</code>)</li><li>가끔 눈을 감은 얼굴(눈 부분만 끈 그림)을 0.15초 보여 줍니다</li><li>깜빡이는 간격은 2초</li></ul>',
            hint: '눈 감은 얼굴은 <code>Image("00000:00000:00000:90009:09990")</code> = <code>Image.SMILE</code> 입니다!',
            starter: 'from microbit import *\n\nopen_eyes = Image.HAPPY\nclosed_eyes = Image.SMILE\n\nwhile True:\n    # TODO\n    pass\n',
            solution: 'from microbit import *\n\nopen_eyes = Image.HAPPY\nclosed_eyes = Image.SMILE\n\nwhile True:\n    display.show(open_eyes)\n    sleep(2000)\n    display.show(closed_eyes)\n    sleep(150)\n'
          },
          {
            title: '실습 3-7. 흘러가는 내 이니셜',
            level: 2,
            desc: '<p>실습 3-3 에서 만든 이니셜 그림이 <b>오른쪽에서 왼쪽으로 지나가게</b> 만드세요. (예제 3-17 참고)</p><p>지나간 뒤에는 0.5초 쉬고 다시 반복합니다.</p>',
            hint: '<code>for i in range(5, -6, -1):</code> 안에서 <code>display.show(letter.shift_left(i))</code>',
            starter: 'from microbit import *\n\nletter = Image("90009:90009:99999:90009:90009")   # H\n\nwhile True:\n    # TODO: shift_left 로 지나가게\n    sleep(500)\n',
            solution: 'from microbit import *\n\nletter = Image("90009:90009:99999:90009:90009")   # H\n\nwhile True:\n    for i in range(5, -6, -1):\n        display.show(letter.shift_left(i))\n        sleep(100)\n    sleep(500)\n'
          },
          {
            title: '실습 3-8. 도전! 폭죽',
            level: 3,
            desc: '<p>아래에서 점이 올라가 가운데에서 <b>터지는</b> 폭죽 애니메이션을 만드세요.</p><ol><li>점 하나가 아래(2, 4)에서 위(2, 1)로 올라갑니다.</li><li>가운데에서 작은 다이아몬드 → 큰 다이아몬드 → 사각형 순서로 커집니다.</li><li>마지막에 전체가 희미해지며(<code>* 0.5</code>, <code>* 0.2</code>) 사라집니다.</li><li>1초 쉬고 반복합니다.</li></ol>',
            hint: '커지는 부분은 <code>[Image.DIAMOND_SMALL, Image.DIAMOND, Image.SQUARE]</code> 리스트를 쓰면 됩니다. 희미해지는 부분은 <code>Image.SQUARE * 0.5</code> 처럼 곱셈을 쓰세요.',
            starter: 'from microbit import *\n\nwhile True:\n    # 1) 올라가기\n    for y in range(4, 0, -1):\n        display.clear()\n        display.set_pixel(2, y, 9)\n        sleep(120)\n\n    # TODO: 2) 터지기  3) 희미해지기\n\n    display.clear()\n    sleep(1000)\n',
            solution: 'from microbit import *\n\nwhile True:\n    # 1) 올라가기\n    for y in range(4, 0, -1):\n        display.clear()\n        display.set_pixel(2, y, 9)\n        sleep(120)\n\n    # 2) 터지기\n    display.show([Image.DIAMOND_SMALL, Image.DIAMOND, Image.SQUARE], delay=120)\n\n    # 3) 희미해지기\n    for b in [0.7, 0.45, 0.25, 0.1]:\n        display.show(Image.SQUARE * b)\n        sleep(120)\n\n    display.clear()\n    sleep(1000)\n'
          }
        ],
        quiz: [
          {
            q: '<code>display.show([Image.HEART, Image.HAPPY], delay=500, loop=True)</code> 의 동작은?', options: ['두 그림이 겹쳐 보인다', '0.5초마다 번갈아 보이며 끝없이 반복', '두 그림이 한 번만 보인다', '오류'], answer: 1,
            explain: '리스트를 주면 차례로 바꿔 보여 줍니다. <code>delay</code> 는 한 장의 시간, <code>loop=True</code> 는 끝없이 반복입니다.'
          },
          {
            q: '<code>Image.HEART.shift_left(2)</code> 의 결과는?', options: ['하트가 2칸 왼쪽으로 밀린다', '하트가 2칸 오른쪽으로 밀린다', '하트가 2배 커진다', '하트가 2개가 된다'], answer: 0,
            explain: '왼쪽으로 2칸 밀립니다. 밀려 나간 부분은 사라지고 오른쪽 빈 자리는 꺼집니다. <b>음수</b>를 주면 반대 방향입니다.'
          },
          {
            q: '<code>Image.HEART + Image.SQUARE</code> 는?', options: ['두 그림이 차례로 보인다', '두 그림이 겹쳐진 하나의 그림', '오류', '하트만 보인다'], answer: 1,
            explain: '같은 자리의 밝기를 <b>더해서</b> 하나의 그림으로 만듭니다. 최대 9 를 넘지 않습니다.'
          },
          {
            q: '시계 바늘이 한 바퀴 도는 내장 리스트는?', options: ['<code>Image.CLOCK</code>', '<code>Image.ALL_CLOCKS</code>', '<code>Image.TIMER</code>', '<code>Image.ROUND</code>'], answer: 1,
            explain: '<code>Image.ALL_CLOCKS</code> 에 12장이 들어 있습니다. “처리 중” 표시에 자주 씁니다.'
          },
          {
            q: '<code>Image.HAPPY.invert()</code> 는?', options: ['위아래가 뒤집힌다', '좌우가 뒤집힌다', '켜진 곳은 꺼지고 꺼진 곳은 켜진다', '밝기가 절반이 된다'], answer: 2,
            explain: '밝기를 <b>0 ↔ 9 로 뒤집습니다</b>. 네거티브 필름 같은 효과입니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '애니메이션 — 그림을 움직이게', subtitle: 'Chapter 03 · 이미지', badge: '3교시',
            notes: '<p>3장의 마지막이자 가장 재미있는 시간입니다. 학생 작품 발표 시간을 남겨 두세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'bullets', title: '애니메이션의 원리',
            bullets: ['조금씩 다른 그림을 <b>빠르게</b> 바꾸기', '만화 영화 · 게임 · 화면의 모든 움직임', 'micro:bit: 이미지 <b>리스트</b>를 show() 에 주기', '<code>delay</code>(한 장의 시간) · <code>loop</code>(반복)'],
            notes: '<p>플립북(공책 모서리 그림)을 예로 들면 쉽게 이해합니다.</p><p>시간: 5분</p>'
          },
          {
            layout: 'code', title: '리스트 애니메이션', code: 'from microbit import *\n\nbeat = [Image.HEART, Image.HEART_SMALL]\ndisplay.show(beat, delay=250, loop=True)',
            points: ['2장의 while True 버전이 <b>2줄</b>로!', '리스트 = 애니메이션 프레임들', '<code>delay</code> · <code>loop</code> · <code>wait</code> · <code>clear</code>', '■ 정지로 멈추기'],
            notes: '<p>2장에서 만든 while True 버전과 나란히 보여 주면 리스트의 장점이 잘 드러납니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: '내장 애니메이션', code: 'from microbit import *\n\ndisplay.scroll("LOADING", delay=60)\nfor turn in range(3):\n    display.show(Image.ALL_CLOCKS, delay=80)\ndisplay.show(Image.YES)',
            points: ['<code>Image.ALL_CLOCKS</code> — 시계 12장', '<code>Image.ALL_ARROWS</code> — 화살표 8장', '“처리 중” 표시에 활용', '<code>Image.YES</code> = 체크 표시'],
            notes: '<p>실제 앱에서 로딩 표시가 어떤 역할을 하는지 이야기해 보면 좋습니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'diagram', title: 'shift — 이미지 밀기', html: `<div style="text-align:center">
            ${screen('99999 00000 00000 00000 00000', '원본')}${screen('00000 99999 00000 00000 00000', 'shift_down(1)')}${screen('00000 00000 99999 00000 00000', 'shift_down(2)')}
            <span style="font-size:26px;vertical-align:50px;color:var(--muted)">&nbsp;|&nbsp;</span>
            ${screen('09090 99999 99999 09990 00900', 'HEART')}${screen('90900 99990 99990 99900 09000', 'shift_left(1)')}</div>`,
            caption: '밀려 나간 부분은 사라지고, 빈 자리는 꺼집니다',
            notes: '<p>음수를 넣으면 반대 방향이라는 점을 꼭 알려 주세요. 이걸 알면 코드가 훨씬 짧아집니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: 'shift 로 짧게 만들기', code: 'from microbit import *\n\nline = Image("99999:00000:00000:00000:00000")\n\nwhile True:\n    for i in range(5):\n        display.show(line.shift_down(i))\n        sleep(120)',
            points: ['그림 5장 → <b>원본 1장 + shift</b>', '반복 변수를 shift 칸수로 사용', '음수면 반대 방향', '코드가 훨씬 짧고 읽기 쉬움'],
            notes: '<p>5장을 일일이 만든 코드와 비교해 보여 주면 "규칙을 찾아 코드로 만드는" 프로그래밍의 핵심을 느낄 수 있습니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'table', title: '이미지 연산', head: ['연산', '뜻'], rows: [
              ['<code>A + B</code>', '겹치기 (밝기 더하기, 최대 9)'],
              ['<code>A - B</code>', '빼기 (최소 0)'],
              ['<code>A * 수</code>', '전체 밝기 조절'],
              ['<code>A.invert()</code>', '밝기 반전 (0 ↔ 9)']],
            notes: '<p>셸에서 <code>display.show(Image.HEART + Image.SQUARE)</code> 를 직접 실행해 보여 주세요.</p><p>시간: 5분</p>'
          },
          {
            layout: 'practice', title: '실습 3-8. 도전! 폭죽', desc: '점이 올라가 가운데에서 터지고 희미해지는 애니메이션',
            starter: 'from microbit import *\n\nwhile True:\n    for y in range(4, 0, -1):\n        display.clear()\n        display.set_pixel(2, y, 9)\n        sleep(120)\n    # TODO: 터지기 · 희미해지기\n    display.clear()\n    sleep(1000)\n',
            solution: 'from microbit import *\n\nwhile True:\n    for y in range(4, 0, -1):\n        display.clear()\n        display.set_pixel(2, y, 9)\n        sleep(120)\n\n    display.show([Image.DIAMOND_SMALL, Image.DIAMOND, Image.SQUARE], delay=120)\n\n    for b in [0.7, 0.45, 0.25, 0.1]:\n        display.show(Image.SQUARE * b)\n        sleep(120)\n\n    display.clear()\n    sleep(1000)\n',
            notes: '<p>시간이 남으면 각자 만든 애니메이션을 교사 화면에 띄워 발표하게 합니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'summary', title: '3장 정리', bullets: ['내장 이미지 60여 가지 · <code>dir(Image)</code>', '<code>Image("00000:09090:…")</code> 로 직접 만들기 (0~9)', '좌표 (0,0) = 왼쪽 위 · <code>set_pixel</code> / <code>get_pixel</code>', '리스트 + delay + loop = 애니메이션', '<code>shift_*</code> 로 밀기 · <code>+ - * invert()</code> 로 연산'],
            notes: '<p>3장 전체 정리. 다음 장 예고: 버튼 — 사용자의 입력을 받는 프로그램.</p><p>과제: 나만의 애니메이션 만들어 오기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
