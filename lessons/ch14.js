/* Chapter 14. 다음 단계 — 확장과 프로젝트
 * 원본: MicroPython on the BBC micro:bit — Next Steps / NeoPixel
 */
(function () {
  const FIG_NEO = `<svg viewBox="0 0 1280 340" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">NeoPixel — 한 가닥 선으로 수십 개의 RGB LED 를</text>
  <rect x="80" y="90" width="150" height="110" rx="14" fill="#0e6b64"/>
  <text x="155" y="152" text-anchor="middle" font-size="18" fill="#9fd8d3">micro:bit</text>
  ${[['3V', 110, 'var(--danger)'], ['P0', 145, 'var(--accent)'], ['GND', 180, 'var(--muted)']]
      .map(([n, y, c]) => `<rect x="${'' + 216}" y="${y - 11}" width="30" height="22" rx="3" fill="#e0b526"/>
  <text x="206" y="${y + 6}" text-anchor="end" font-size="15" font-weight="bold" fill="${c}">${n}</text>
  <line x1="246" y1="${y}" x2="330" y2="${y}" stroke="${c}" stroke-width="3.5"/>`).join('\n  ')}
  <rect x="330" y="96" width="820" height="100" rx="12" fill="#1a1a1a" stroke="var(--line)" stroke-width="2"/>
  ${['#ff3333', '#ff9933', '#ffee33', '#55dd55', '#3399ff', '#8855ff', '#ff55bb', '#ffffff']
      .map((c, i) => `<rect x="${356 + i * 98}" y="${118}" width="56" height="56" rx="10" fill="${c}"/>
  <text x="${384 + i * 98}" y="${222}" text-anchor="middle" font-size="17" fill="var(--muted)">np[${i}]</text>`).join('\n  ')}
  <text x="640" y="268" text-anchor="middle" font-size="20" fill="var(--fg)">각 LED 의 색을 <tspan font-family="monospace" font-weight="bold">(R, G, B)</tspan> 로 지정합니다 — 각 값은 <tspan font-weight="bold">0 ~ 255</tspan></text>
  <text x="640" y="304" text-anchor="middle" font-size="19" fill="var(--muted)">색을 정한 뒤 <tspan font-family="monospace" font-weight="bold" fill="var(--danger)">np.show()</tspan> 를 불러야 실제로 켜집니다</text>
</svg>`;

  const FIG_ROADMAP = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">여기서 어디로 갈까?</text>
  ${[
      ['🐍', 'PC 파이썬', '여기서 배운 문법 그대로\n데이터 분석 · 웹 · 인공지능', 'var(--accent)'],
      ['🤖', '더 큰 보드', 'Raspberry Pi Pico · ESP32\n같은 MicroPython, 더 많은 핀', 'var(--ok)'],
      ['🔧', '전자 공작', '센서 · 모터 · 3D 프린팅\n진짜 제품 만들기', 'var(--accent2)'],
      ['🏆', '대회 · 동아리', '메이커 페어 · 발명 대회\n작품으로 겨루기', 'var(--more)']
    ].map(([icon, title, desc, color], i) => {
      const x = 40 + i * 312;
      return `<rect x="${x}" y="70" width="272" height="230" rx="18" fill="var(--card)" stroke="${color}" stroke-width="3.5"/>
  <text x="${x + 136}" y="130" text-anchor="middle" font-size="44">${icon}</text>
  <text x="${x + 136}" y="180" text-anchor="middle" font-size="22" font-weight="bold" fill="${color}">${title}</text>
  ${desc.split('\n').map((t, k) => `<text x="${x + 136}" y="${222 + k * 30}" text-anchor="middle" font-size="17" fill="var(--muted)">${t}</text>`).join('\n  ')}`;
    }).join('\n  ')}
  <text x="640" y="360" text-anchor="middle" font-size="21" fill="var(--fg)">14장을 마치면 여러분은 <tspan font-weight="bold">센서를 읽고 · 판단하고 · 세상에 반응하는</tspan> 프로그램을 만들 수 있습니다</text>
  <text x="640" y="398" text-anchor="middle" font-size="19" fill="var(--muted)">이제 필요한 것은 “무엇을 만들까?” 하는 아이디어뿐입니다</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch14',
    no: '14',
    title: '다음 단계 — 확장과 프로젝트',
    subtitle: 'NeoPixel · 서보 · 종합 프로젝트 · 앞으로의 길',
    summary: '지금까지 배운 것을 모아 진짜 작품을 만듭니다. 수십 개의 RGB LED 를 다루는 NeoPixel, 각도를 움직이는 서보 모터를 배우고, 여러 기능을 합친 종합 프로젝트를 설계합니다. 마지막으로 micro:bit 다음에 무엇을 배우면 좋을지 길을 안내합니다.',
    goals: [
      '<code>neopixel</code> 모듈로 RGB LED 띠를 제어할 수 있다',
      '색을 계산해 무지개 · 그라데이션 효과를 만들 수 있다',
      '서보 모터로 움직이는 장치를 만들 수 있다',
      '여러 기능을 합친 프로젝트를 설계하고 완성할 수 있다',
      'micro:bit 다음에 배울 것들을 안다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch14-1',
        title: 'NeoPixel — 색을 자유롭게',
        minutes: 45,
        goals: [
          'RGB 색 표현(0~255 세 값)을 이해한다',
          '<code>neopixel.NeoPixel()</code> 로 LED 띠를 제어할 수 있다',
          '<code>show()</code> 를 불러야 반영된다는 것을 안다',
          '반복문으로 흐르는 빛 · 무지개 효과를 만들 수 있다'
        ],
        flow: [['RGB 색', 8], ['NeoPixel 기본', 14], ['효과 만들기', 14], ['센서와 연결', 6], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: 'RGB — 빛의 삼원색' },
          { type: 'p', html: 'micro:bit 의 LED 화면은 <b>빨간색 한 가지</b>만 나옵니다. 여러 색을 쓰려면 <b>RGB LED</b> 가 필요합니다. RGB 는 <b>Red(빨강) · Green(초록) · Blue(파랑)</b> 로, 이 셋을 섞으면 거의 모든 색을 만들 수 있습니다.' },
          {
            type: 'figure', html: `<div style="text-align:center;padding:10px">
          ${[['(255, 0, 0)', '#ff0000', '빨강'], ['(0, 255, 0)', '#00ff00', '초록'], ['(0, 0, 255)', '#0000ff', '파랑'],
            ['(255, 255, 0)', '#ffff00', '노랑'], ['(0, 255, 255)', '#00ffff', '하늘'], ['(255, 0, 255)', '#ff00ff', '자홍'],
            ['(255, 255, 255)', '#ffffff', '흰색'], ['(0, 0, 0)', '#000000', '꺼짐'], ['(255, 120, 0)', '#ff7800', '주황'], ['(60, 0, 90)', '#3c005a', '어두운 보라']]
              .map(([code, hex, name]) => `<div style="display:inline-block;text-align:center;margin:6px 10px">
            <div style="width:64px;height:64px;border-radius:12px;background:${hex};border:2px solid var(--line);margin:0 auto"></div>
            <div style="font-size:12.5px;font-weight:700;margin-top:4px">${name}</div>
            <div style="font-size:11.5px;color:var(--muted);font-family:var(--mono)">${code}</div></div>`).join('')}
          </div>`, caption: '그림 14-1. RGB 로 만드는 색 — 각 값은 0 ~ 255'
          },
          { type: 'callout', kind: 'more', title: '물감과 빛은 반대입니다', html: '<p>미술 시간에 물감을 다 섞으면 <b>검정</b>에 가까워집니다(감산 혼합). 하지만 <b>빛</b>은 다 섞으면 <b>흰색</b>이 됩니다(가산 혼합).</p><p>그래서 <code>(255, 255, 255)</code> 가 흰색이고 <code>(0, 0, 0)</code> 이 꺼진 상태입니다. TV · 스마트폰 화면도 모두 이 방식입니다.</p>' },

          { type: 'h', text: 'NeoPixel 연결하고 켜기' },
          { type: 'figure', html: FIG_NEO, caption: '그림 14-2. NeoPixel 띠 연결' },
          {
            type: 'code', title: '예제 14-1. 첫 NeoPixel', code: `from microbit import *
import neopixel

# P0 에 8개짜리 띠를 연결
np = neopixel.NeoPixel(pin0, 8)

# 색 지정 (아직 켜지지 않음)
np[0] = (255, 0, 0)        # 빨강
np[1] = (0, 255, 0)        # 초록
np[2] = (0, 0, 255)        # 파랑
np[3] = (255, 255, 0)      # 노랑

np.show()                  # 이제 실제로 켜진다!

display.show(Image.YES)`,
            hint: '🧩 <b>부품 탭</b>에 NeoPixel 띠가 자동으로 추가됩니다. 색이 칠해지는 것을 확인하세요.',
            desc: '<code>neopixel.NeoPixel(핀, 개수)</code> 로 만들고, <code>np[번호] = (R, G, B)</code> 로 색을 정한 뒤 <b><code>np.show()</code> 를 불러야</b> 실제로 켜집니다.',
            expect: '앞의 네 개가 빨강 · 초록 · 파랑 · 노랑으로 켜집니다.'
          },
          { type: 'callout', kind: 'warn', title: 'show() 를 잊지 마세요', html: '<code>np[0] = (255, 0, 0)</code> 은 <b>“이렇게 할 거야” 하고 적어 두는 것</b>일 뿐입니다. <code>np.show()</code> 를 불러야 실제 LED 로 전송됩니다. “색을 바꿨는데 아무 일도 안 일어나요” 의 99% 는 <code>show()</code> 를 빠뜨린 경우입니다.' },
          {
            type: 'code', title: '예제 14-2. 전체를 한 색으로', code: `from microbit import *
import neopixel

np = neopixel.NeoPixel(pin0, 8)

COLORS = [(255, 0, 0), (255, 120, 0), (255, 255, 0),
          (0, 255, 0), (0, 150, 255), (100, 0, 255)]

for color in COLORS:
    np.fill(color)          # 전부 같은 색으로
    np.show()
    sleep(600)

np.clear()                  # 모두 끄기 (show 까지 해 줌)
display.show(Image.YES)`,
            desc: '<code>np.fill(색)</code> 은 모든 LED 를 같은 색으로 정합니다. <code>np.clear()</code> 는 모두 끄고 <code>show()</code> 까지 해 줍니다.',
            expect: '띠 전체가 빨강 → 주황 → 노랑 → 초록 → 파랑 → 보라로 바뀝니다.'
          },
          {
            type: 'code', title: '예제 14-3. 흐르는 빛', code: `from microbit import *
import neopixel

np = neopixel.NeoPixel(pin0, 8)

while True:
    for i in range(len(np)):
        np.clear()                    # 전부 끄고
        np[i] = (0, 100, 255)         # 하나만 켜기
        # 꼬리 효과
        if i > 0:
            np[i - 1] = (0, 30, 80)
        np.show()
        sleep(90)`,
            hint: '🧩 부품 탭에서 빛이 흘러가는 것을 확인하세요.',
            desc: '<code>len(np)</code> 로 LED 개수를 알 수 있습니다. 하나만 켜고 이전 것을 어둡게 하면 <b>꼬리가 있는 흐르는 빛</b>이 됩니다.',
            expect: '파란 빛이 띠를 따라 흘러갑니다.'
          },

          { type: 'h', text: '무지개와 그라데이션' },
          {
            type: 'code', title: '예제 14-4. 무지개 만들기', code: `from microbit import *
import neopixel

np = neopixel.NeoPixel(pin0, 8)


def wheel(pos):
    """0~255 를 넣으면 무지개 색 하나를 돌려준다"""
    pos = pos % 256
    if pos < 85:
        return (255 - pos * 3, pos * 3, 0)
    if pos < 170:
        pos = pos - 85
        return (0, 255 - pos * 3, pos * 3)
    pos = pos - 170
    return (pos * 3, 0, 255 - pos * 3)


offset = 0
while True:
    for i in range(len(np)):
        np[i] = wheel(offset + i * 32)
    np.show()
    offset = offset + 6
    sleep(50)`,
            desc: '<code>wheel()</code> 은 0~255 의 숫자를 <b>무지개 색</b> 하나로 바꿔 줍니다. 빨강 → 초록 → 파랑 → 빨강 으로 이어지는 원형 색상환이지요. <code>offset</code> 을 조금씩 늘리면 무지개가 흘러갑니다.',
            expect: '무지개가 띠를 따라 부드럽게 흘러갑니다.'
          },
          { type: 'callout', kind: 'more', title: 'wheel() 이 하는 일', html: '<p>색상환을 세 구간으로 나눕니다.</p><ul><li>0 ~ 84: 빨강 <b>→</b> 초록 (빨강 줄고 초록 늘어남)</li><li>85 ~ 169: 초록 <b>→</b> 파랑</li><li>170 ~ 255: 파랑 <b>→</b> 빨강 (다시 처음으로)</li></ul><p>각 구간에서 한 색은 줄고 다른 색은 늘어나므로 <b>부드럽게 이어집니다</b>. NeoPixel 을 다루는 거의 모든 예제에 등장하는 유명한 함수입니다.</p>' },
          {
            type: 'code', title: '예제 14-5. 밝기 조절하기', code: `from microbit import *
import neopixel

np = neopixel.NeoPixel(pin0, 8)

BRIGHT = 0.25          # 25% 밝기


def dim(color, k):
    r, g, b = color
    return (int(r * k), int(g * k), int(b * k))


while True:
    for c in [(255, 0, 0), (0, 255, 0), (0, 0, 255)]:
        np.fill(dim(c, BRIGHT))
        np.show()
        sleep(500)`,
            desc: 'NeoPixel 은 <b>아주 밝고 전류를 많이 씁니다</b>. 모든 값에 0.2 ~ 0.3 을 곱해 밝기를 낮추면 눈도 편하고 전력도 아낍니다. 3장에서 이미지에 숫자를 곱한 것과 같은 아이디어입니다.',
            expect: '띠가 은은한 빨강 → 초록 → 파랑으로 바뀝니다.'
          },
          { type: 'callout', kind: 'board', title: '⚠ 전원에 주의하세요', html: '<p>NeoPixel 은 LED 하나가 최대 밝기(흰색)에서 <b>약 60mA</b> 를 씁니다. 8개면 480mA — micro:bit 의 3V 단자(최대 90mA)로는 <b>어림도 없습니다</b>.</p><ul><li>LED 가 <b>4~8개</b> 정도이고 <b>밝기를 낮추면</b> micro:bit 전원으로도 동작합니다</li><li>더 많거나 밝게 쓰려면 <b>별도의 3V ~ 5V 전원</b>을 연결하고 <b>GND 만 micro:bit 와 공통</b>으로 잇습니다</li></ul>' },

          { type: 'h', text: '센서와 연결하기' },
          {
            type: 'code', title: '예제 14-6. 온도계 띠', code: `from microbit import *
import neopixel

np = neopixel.NeoPixel(pin0, 8)

while True:
    t = temperature()
    # 10도 ~ 35도를 0 ~ 8 칸으로
    n = scale(t, from_=(10, 35), to=(0, 8))
    n = max(0, min(8, n))

    np.clear()
    for i in range(n):
        if i < 3:
            np[i] = (0, 0, 60)       # 차가움 (파랑)
        elif i < 6:
            np[i] = (0, 60, 0)       # 알맞음 (초록)
        else:
            np[i] = (80, 0, 0)       # 더움 (빨강)
    np.show()

    display.show(str(t)[0])
    sleep(500)`,
            hint: '🧭 센서 탭의 <b>온도</b> 슬라이더를 움직여 보세요.',
            desc: '온도를 <b>색과 길이</b> 두 가지로 표현했습니다. 차가우면 파랑, 알맞으면 초록, 더우면 빨강입니다. 한눈에 알아보기 쉬운 표시 방법입니다.',
            expect: '온도에 따라 띠의 길이와 색이 바뀝니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 14-7. 소리 반응 조명', code: `from microbit import *
import neopixel

np = neopixel.NeoPixel(pin0, 8)

while True:
    level = microphone.sound_level()
    n = min(8, level // 28)

    np.clear()
    for i in range(n):
        if i < 4:
            np[i] = (0, 50, 0)
        elif i < 7:
            np[i] = (60, 50, 0)
        else:
            np[i] = (80, 0, 0)
    np.show()
    sleep(50)`,
            hint: '🧭 센서 탭의 <b>소리</b> 슬라이더나 <b>👏 박수</b> 버튼을 눌러 보세요.',
            desc: '소리 크기에 따라 띠가 차오르는 <b>레벨 미터</b> 입니다. 노래방 기계나 오디오 장비에서 보던 것과 같은 표시 방식입니다.',
            expect: '소리가 클수록 띠가 더 많이 켜지고 빨갛게 변합니다.',
            nondeterministic: true
          },
          {
            type: 'table', head: ['메서드', '하는 일'], rows: [
              ['<code>neopixel.NeoPixel(핀, 개수)</code>', 'LED 띠 만들기'],
              ['<code>np[i] = (r, g, b)</code>', 'i 번째 LED 의 색 정하기 (0~255)'],
              ['<code>np[i]</code>', 'i 번째 LED 의 색 읽기'],
              ['<code>len(np)</code>', 'LED 개수'],
              ['<code>np.fill((r, g, b))</code>', '모두 같은 색으로 정하기'],
              ['<code>np.show()</code>', '<b>정한 색을 실제로 전송</b> (꼭 필요!)'],
              ['<code>np.clear()</code>', '모두 끄고 즉시 반영']
            ]
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              'RGB 는 <b>빨강 · 초록 · 파랑</b> 세 값(각 0~255)으로 색을 만듭니다. 다 섞으면 <b>흰색</b>.',
              '<code>np = neopixel.NeoPixel(pin0, 개수)</code> → <code>np[i] = (r, g, b)</code> → <b><code>np.show()</code></b>',
              '<code>show()</code> 를 부르지 않으면 <b>아무 일도 일어나지 않습니다</b>.',
              '<code>fill()</code> 전체 지정 · <code>clear()</code> 전부 끄기 · <code>len(np)</code> 개수.',
              '색에 <b>0.2 ~ 0.3 을 곱해</b> 밝기를 낮추면 눈도 편하고 전력도 아낍니다.',
              'LED 가 많으면 <b>별도 전원 + 공통 GND</b> 가 필요합니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 14-1. 신호등 띠',
            level: 1,
            desc: '<p>NeoPixel 8개로 <b>신호등</b>을 만드세요.</p><ul><li>빨강 3초 (앞의 3개를 빨강) → 노랑 1초 (가운데 2개) → 초록 3초 (뒤의 3개) → 반복</li><li>밝기는 30% 로 낮춥니다</li><li>LED 화면에도 현재 색을 글자로 표시합니다 (R · Y · G)</li></ul>',
            hint: '<code>def dim(c, k)</code> 함수를 만들어 색에 배율을 곱하세요. 구간별로 <code>np[i] = …</code> 를 반복문으로 칠합니다.',
            starter: 'from microbit import *\nimport neopixel\n\nnp = neopixel.NeoPixel(pin0, 8)\nB = 0.3\n\n\ndef dim(c, k):\n    return (int(c[0] * k), int(c[1] * k), int(c[2] * k))\n\n\nwhile True:\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\nimport neopixel\n\nnp = neopixel.NeoPixel(pin0, 8)\nB = 0.3\n\n\ndef dim(c, k):\n    return (int(c[0] * k), int(c[1] * k), int(c[2] * k))\n\n\ndef light(start, count, color, letter, ms):\n    np.clear()\n    for i in range(start, start + count):\n        np[i] = dim(color, B)\n    np.show()\n    display.show(letter)\n    sleep(ms)\n\n\nwhile True:\n    light(0, 3, (255, 0, 0), "R", 3000)\n    light(3, 2, (255, 200, 0), "Y", 1000)\n    light(5, 3, (0, 255, 0), "G", 3000)\n    light(3, 2, (255, 200, 0), "Y", 1000)\n'
          },
          {
            title: '실습 14-2. 기울기 수평계 띠',
            level: 2,
            desc: '<p>NeoPixel 로 <b>좌우 기울기</b>를 보여 주는 수평계를 만드세요.</p><ul><li>보드를 왼쪽으로 기울이면 띠의 왼쪽이, 오른쪽으로 기울이면 오른쪽이 켜집니다</li><li>평평하면 <b>가운데 두 개</b>가 초록색으로 켜집니다</li><li>많이 기울일수록 <b>빨강에 가깝게</b> 색이 바뀝니다</li><li>밝기는 낮춰서 쓰세요</li></ul>',
            hint: '<code>pos = scale(x, from_=(-1024, 1024), to=(0, 7))</code> 로 위치를 정하고, 가운데(3~4)에서 멀수록 빨간 성분을 늘립니다.',
            starter: 'from microbit import *\nimport neopixel\n\nnp = neopixel.NeoPixel(pin0, 8)\n\nwhile True:\n    x = accelerometer.get_x()\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport neopixel\n\nnp = neopixel.NeoPixel(pin0, 8)\nB = 0.3\n\nwhile True:\n    x = accelerometer.get_x()\n    pos = scale(x, from_=(-1024, 1024), to=(0, 7))\n    pos = max(0, min(7, pos))\n\n    # 가운데(3.5)에서 얼마나 떨어졌나 (0 ~ 1)\n    off = abs(pos - 3.5) / 3.5\n    r = int(255 * off * B)\n    g = int(255 * (1 - off) * B)\n\n    np.clear()\n    np[pos] = (r, g, 0)\n    if pos > 0:\n        np[pos - 1] = (r // 3, g // 3, 0)\n    if pos < 7:\n        np[pos + 1] = (r // 3, g // 3, 0)\n    np.show()\n\n    sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: 'RGB 에서 <code>(255, 255, 255)</code> 는 무슨 색인가요?', options: ['검정', '흰색', '회색', '빨강'], answer: 1,
            explain: '빛은 다 섞으면 <b>흰색</b>입니다(가산 혼합). <code>(0, 0, 0)</code> 이 꺼진 상태입니다.'
          },
          {
            q: '<code>np[0] = (255, 0, 0)</code> 만 실행하면?', options: ['첫 LED 가 빨갛게 켜진다', '<b>아무 일도 일어나지 않는다</b>', '모든 LED 가 켜진다', '오류가 난다'], answer: 1,
            explain: '색을 <b>적어 두기만</b> 한 것입니다. <code>np.show()</code> 를 불러야 실제로 전송됩니다.'
          },
          {
            q: 'LED 띠 전체를 한 색으로 하려면?', options: ['<code>np.all((r,g,b))</code>', '<code>np.fill((r,g,b))</code>', '<code>np.set((r,g,b))</code>', '반복문밖에 없다'], answer: 1,
            explain: '<code>np.fill(색)</code> 입니다. 그 뒤에도 <code>np.show()</code> 가 필요합니다.'
          },
          {
            q: 'NeoPixel 8개를 최대 밝기로 켜면 안 되는 이유는?', options: ['너무 밝아서', '전류를 약 480mA 나 써서 micro:bit 전원으로 부족해서', '색이 이상해져서', '문제없다'], answer: 1,
            explain: 'LED 하나가 최대 약 60mA 입니다. micro:bit 3V 단자는 최대 90mA 이므로 <b>밝기를 낮추거나 별도 전원</b>이 필요합니다.'
          },
          {
            q: '색에 <code>0.3</code> 을 곱하는 이유는?', options: ['색을 바꾸려고', '밝기를 낮춰 눈을 편하게 하고 전력을 아끼려고', '속도를 빠르게 하려고', '이유 없다'], answer: 1,
            explain: 'R · G · B 값을 모두 줄이면 <b>같은 색의 어두운 버전</b>이 됩니다. 3장에서 이미지에 숫자를 곱한 것과 같습니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: 'NeoPixel — 색을 자유롭게', subtitle: 'Chapter 14 · 다음 단계', badge: '1교시',
            notes: '<p>실물 NeoPixel 띠가 있으면 반응이 폭발적입니다. 없으면 시뮬레이터 부품 탭으로 충분합니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'diagram', title: 'RGB — 빛의 삼원색', html: `<div style="text-align:center;padding:6px">
          ${[['(255,0,0)', '#ff0000'], ['(0,255,0)', '#00ff00'], ['(0,0,255)', '#0000ff'], ['(255,255,0)', '#ffff00'], ['(0,255,255)', '#00ffff'], ['(255,0,255)', '#ff00ff'], ['(255,255,255)', '#ffffff']]
                .map(([code, hex]) => `<div style="display:inline-block;text-align:center;margin:5px 8px">
            <div style="width:62px;height:62px;border-radius:12px;background:${hex};border:2px solid var(--line)"></div>
            <div style="font-size:12px;color:var(--muted);font-family:var(--mono);margin-top:3px">${code}</div></div>`).join('')}
          </div>`, caption: '빛은 다 섞으면 흰색 (물감과 반대!)',
            notes: '<p>미술 시간의 물감 혼합과 비교하면 재미있습니다. TV 화면을 돋보기로 보면 RGB 점이 보인다는 이야기도 좋습니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: '첫 NeoPixel', code: 'from microbit import *\nimport neopixel\n\nnp = neopixel.NeoPixel(pin0, 8)\n\nnp[0] = (255, 0, 0)\nnp[1] = (0, 255, 0)\nnp[2] = (0, 0, 255)\n\nnp.show()          # ← 이것이 있어야 켜진다!',
            points: ['<code>NeoPixel(핀, 개수)</code>', '<code>np[i] = (r, g, b)</code> 는 <b>적어 두기만</b>', '<b><code>np.show()</code></b> 를 꼭!', '한 가닥 선으로 수십 개 제어'],
            notes: '<p>일부러 show() 없이 실행해 "왜 안 켜질까?" 하고 물어보면 확실히 각인됩니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '흐르는 빛', code: 'while True:\n    for i in range(len(np)):\n        np.clear()\n        np[i] = (0, 100, 255)\n        if i > 0:\n            np[i - 1] = (0, 30, 80)   # 꼬리\n        np.show()\n        sleep(90)',
            points: ['<code>len(np)</code> = LED 개수', '하나만 켜고 이전 것은 어둡게', '3장 애니메이션과 같은 원리', '속도와 색을 바꿔 실험'],
            notes: '<p>3장의 LED 화면 애니메이션과 완전히 같은 구조라는 점을 짚어 주세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '무지개 만들기', code: 'def wheel(pos):\n    pos = pos % 256\n    if pos < 85:\n        return (255 - pos * 3, pos * 3, 0)\n    if pos < 170:\n        pos = pos - 85\n        return (0, 255 - pos * 3, pos * 3)\n    pos = pos - 170\n    return (pos * 3, 0, 255 - pos * 3)\n\noffset = 0\nwhile True:\n    for i in range(len(np)):\n        np[i] = wheel(offset + i * 32)\n    np.show()\n    offset += 6\n    sleep(50)',
            points: ['0~255 → 무지개 색 하나', '빨강 → 초록 → 파랑 → 빨강 (순환)', 'offset 을 늘리면 흘러감', 'NeoPixel 예제의 고전'],
            notes: '<p>wheel 함수의 세 구간을 칠판에 그려 설명하면 좋습니다. 색상환 개념과 연결됩니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'bullets', title: '⚠ 전원에 주의',
            bullets: ['LED 1개 최대 밝기 = 약 <b>60mA</b>', '8개면 480mA — micro:bit(90mA)로는 부족', '밝기를 <b>0.2~0.3 배</b>로 낮추기', '많이 쓰려면 별도 전원 + 공통 GND'],
            notes: '<p>안전과 보드 보호를 위해 꼭 짚어야 할 내용입니다.</p><p>시간: 5분</p>'
          },
          {
            layout: 'practice', title: '실습 14-2. 기울기 수평계 띠', desc: '기울인 쪽이 켜지고, 많이 기울일수록 빨갛게',
            starter: 'from microbit import *\nimport neopixel\n\nnp = neopixel.NeoPixel(pin0, 8)\n\nwhile True:\n    x = accelerometer.get_x()\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport neopixel\n\nnp = neopixel.NeoPixel(pin0, 8)\nB = 0.3\n\nwhile True:\n    x = accelerometer.get_x()\n    pos = max(0, min(7, scale(x, from_=(-1024, 1024), to=(0, 7))))\n    off = abs(pos - 3.5) / 3.5\n    r = int(255 * off * B)\n    g = int(255 * (1 - off) * B)\n\n    np.clear()\n    np[pos] = (r, g, 0)\n    if pos > 0:\n        np[pos - 1] = (r // 3, g // 3, 0)\n    if pos < 7:\n        np[pos + 1] = (r // 3, g // 3, 0)\n    np.show()\n    sleep(50)\n',
            notes: '<p>8장의 수평계를 NeoPixel 로 확장한 것입니다. 배운 것들이 합쳐지는 경험을 하게 됩니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['RGB = (빨강, 초록, 파랑) 각 0~255 · 다 섞으면 흰색', '<code>NeoPixel(pin0, 개수)</code> → <code>np[i] = 색</code> → <code>np.show()</code>', '<code>fill()</code> · <code>clear()</code> · <code>len(np)</code>', '색에 0.3 을 곱해 밝기 낮추기', '전원 주의 — 많이 쓰면 별도 전원'],
            notes: '<p>다음 시간 예고: 서보 모터와 종합 프로젝트.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch14-2',
        title: '종합 프로젝트와 다음 단계',
        minutes: 45,
        goals: [
          '서보 모터로 움직이는 장치를 만들 수 있다',
          '여러 기능을 합친 프로젝트를 설계할 수 있다',
          '프로그램을 함수로 나누어 정리할 수 있다',
          'micro:bit 다음에 배울 것을 안다'
        ],
        flow: [['서보 복습과 활용', 10], ['프로젝트 설계법', 10], ['종합 프로젝트', 18], ['다음 단계 안내', 5], ['마무리', 2]],
        content: [
          { type: 'h', text: '서보 모터로 움직이는 장치 만들기' },
          { type: 'p', html: '5장에서 배운 서보 모터를 다시 써 봅니다. 서보는 <b>정해진 각도로 회전축을 돌려 주는</b> 모터로, 로봇 팔 · 자동문 · 방향타에 쓰입니다.' },
          {
            type: 'code', title: '예제 14-8. 서보 제어 함수 만들기', code: `from microbit import *

SERVO_PIN = pin0
SERVO_PIN.set_analog_period(20)        # 서보는 20ms 주기


def servo(angle):
    """0 ~ 180도로 서보를 움직인다"""
    angle = max(0, min(180, int(angle)))
    SERVO_PIN.write_analog(26 + (angle * 102) // 180)


display.show(Image.ARROW_E)

while True:
    if button_a.was_pressed():
        servo(0)
        display.show("0")
    if button_b.was_pressed():
        servo(180)
        display.show("1")
    if pin_logo.is_touched():
        servo(90)
        display.show("-")
    sleep(50)`,
            hint: '🧩 <b>부품 탭</b>에서 <b>⚙️ 서보 모터</b>를 P0 에 연결하고 각도가 바뀌는 것을 보세요.',
            desc: '자주 쓰는 계산을 <code>servo()</code> 함수로 묶어 두면 <b>각도만 넣으면</b> 됩니다. 프로젝트가 커질수록 이렇게 정리하는 것이 중요합니다.',
            expect: 'A → 0°, B → 180°, 로고 → 90°'
          },
          {
            type: 'code', title: '예제 14-9. 자동 문 (사람이 오면 열림)', code: `from microbit import *
import music

SERVO_PIN = pin0
SERVO_PIN.set_analog_period(20)
OPEN, CLOSE = 90, 0


def servo(angle):
    SERVO_PIN.write_analog(26 + (max(0, min(180, int(angle))) * 102) // 180)


servo(CLOSE)
is_open = False
close_at = 0
display.show(Image.SQUARE)

while True:
    # 소리가 나면(노크) 문을 연다
    if microphone.sound_level() > 140 and not is_open:
        is_open = True
        close_at = running_time() + 3000
        servo(OPEN)
        music.play(music.JUMP_UP)
        display.show(Image.YES)

    # 3초 뒤 자동으로 닫힘
    if is_open and running_time() > close_at:
        is_open = False
        servo(CLOSE)
        music.play(music.JUMP_DOWN)
        display.show(Image.SQUARE)

    sleep(50)`,
            hint: '🧩 서보를 P0 에 연결하고, 🧭 센서 탭의 <b>👏 박수</b> 버튼을 눌러 보세요.',
            desc: '<b>센서 → 판단 → 동작</b> 의 완전한 예입니다. 소리를 감지하면 문이 열리고 3초 뒤 자동으로 닫힙니다. 11장에서 배운 <code>running_time()</code> 비교를 썼습니다.',
            expect: '큰 소리가 나면 서보가 90° 로 열리고 3초 뒤 닫힙니다.'
          },

          { type: 'h', text: '프로젝트는 이렇게 설계합니다' },
          {
            type: 'figure', html: `<svg viewBox="0 0 1280 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker id="c14a" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  ${[['① 무엇을?', '해결하고 싶은 문제\n또는 만들고 싶은 것'], ['② 무엇으로?', '어떤 센서로 읽고\n어떻게 표현할까'], ['③ 작게 나누기', '기능을 하나씩\n따로 만들어 확인'], ['④ 합치기', '함수로 묶어\n하나의 프로그램으로']]
      .map(([t, d], i) => {
        const x = 40 + i * 312;
        return `<rect x="${x}" y="70" width="272" height="130" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="${x + 136}" y="112" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">${t}</text>
  ${d.split('\n').map((s, k) => `<text x="${x + 136}" y="${148 + k * 28}" text-anchor="middle" font-size="17" fill="var(--muted)">${s}</text>`).join('\n  ')}` +
          (i < 3 ? `<line x1="${x + 277}" y1="135" x2="${x + 307}" y2="135" stroke="var(--accent)" stroke-width="4" marker-end="url(#c14a)"/>` : '');
      }).join('\n  ')}
  <text x="640" y="250" text-anchor="middle" font-size="20" fill="var(--fg)">가장 중요한 것은 <tspan font-weight="bold">③ 작게 나누기</tspan> — 한꺼번에 만들면 어디가 잘못됐는지 알 수 없습니다</text>
  <text x="640" y="284" text-anchor="middle" font-size="18" fill="var(--muted)">기능 하나를 만들고 → 실행해 확인하고 → 다음 기능을 더합니다</text>
</svg>`, caption: '그림 14-3. 프로젝트 설계 네 단계'
          },
          {
            type: 'list', items: [
              '<b>작게 시작하세요.</b> “센서 값이 콘솔에 잘 찍히는가?” 부터 확인합니다.',
              '<b>함수로 나누세요.</b> <code>def read_sensor():</code>, <code>def show_result():</code> 처럼 역할별로 묶으면 고치기 쉽습니다.',
              '<b>상수는 위에 모으세요.</b> <code>THRESHOLD = 140</code> 처럼 이름을 붙여 맨 위에 두면 조절이 편합니다.',
              '<b><code>print()</code> 를 아끼지 마세요.</b> 값이 어떻게 흐르는지 보면 문제를 훨씬 빨리 찾습니다.',
              '<b>완성한 뒤 다듬으세요.</b> 먼저 동작하게 만들고, 그다음에 예쁘게 만듭니다.'
            ]
          },

          { type: 'h', text: '종합 프로젝트 — 스마트 화분 지킴이' },
          {
            type: 'code', title: '예제 14-10. 스마트 화분 지킴이', code: `from microbit import *
import music
import log

# ── 설정 (여기만 고치면 동작이 바뀝니다) ──────────────
DRY_LEVEL = 400          # 이보다 작으면 흙이 마름
DARK_LEVEL = 40          # 이보다 어두우면 빛 부족
CHECK_MS = 5000          # 확인 간격
SENSOR_PIN = pin1        # 토양 수분 센서 (가변저항으로 대체 가능)

log.set_labels("moisture", "light", "temp", timestamp=log.SECONDS)

next_check = running_time()
alarm = True
display.show(Image.HAPPY)


def read_all():
    """센서를 모두 읽어 돌려준다"""
    return (SENSOR_PIN.read_analog(),
            display.read_light_level(),
            temperature())


def judge(moisture, light):
    """상태를 판단해 (그림, 메시지) 를 돌려준다"""
    if moisture < DRY_LEVEL:
        return Image.SAD, "WATER ME"
    if light < DARK_LEVEL:
        return Image.ASLEEP, "TOO DARK"
    return Image.HAPPY, ""


while True:
    if running_time() >= next_check:
        next_check = next_check + CHECK_MS
        m, l, t = read_all()
        log.add(moisture=m, light=l, temp=t)
        print("수분", m, "빛", l, "온도", t)

        face, msg = judge(m, l)
        display.show(face)
        if msg and alarm:
            display.scroll(msg, delay=70)
            music.play(music.WAWAWAWAA)
            display.show(face)

    # A: 지금 상태를 자세히 보기
    if button_a.was_pressed():
        m, l, t = read_all()
        display.scroll("M" + str(m // 100) + " L" + str(l // 10) + " T" + str(t), delay=70)

    # B: 알림 켜기 / 끄기
    if button_b.was_pressed():
        alarm = not alarm
        display.show(Image.YES if alarm else Image.NO)
        sleep(500)

    sleep(50)`,
            hint: '🧩 부품 탭에서 <b>🎛️ 가변저항</b>을 P1 에 연결해 “토양 수분” 을 흉내 내고, 🧭 센서 탭의 빛 슬라이더도 움직여 보세요.',
            desc: '<b>지금까지 배운 거의 모든 것</b>이 들어 있습니다 — 핀 아날로그 입력(5장), 조건문(4장), 이미지(3장), 음악(6장), 데이터 로깅(11장), 시각 비교(11장), 함수로 정리하기. 설정값을 맨 위에 모아 두어 고치기 쉽게 만들었습니다.',
            expect: '5초마다 상태를 확인해 표정으로 알려 주고, 문제가 있으면 메시지와 소리로 알립니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'more', title: '토양 수분 센서 만들기', html: '<p>전용 센서가 없어도 만들 수 있습니다. <b>못이나 철사 두 개</b>를 흙에 꽂고 하나는 <code>3V</code>, 하나는 <code>P1</code> 에 연결한 뒤 <code>P1</code> 과 <code>GND</code> 사이에 저항(10kΩ)을 넣습니다.</p><p>흙이 젖으면 전기가 잘 통해 <code>read_analog()</code> 값이 <b>커지고</b>, 마르면 작아집니다. 실제 토양 수분 센서도 같은 원리입니다.</p>' },

          { type: 'h', text: '프로젝트 아이디어' },
          {
            type: 'table', head: ['프로젝트', '쓰는 기능', '난이도'], rows: [
              ['<b>만보기 · 활동량 측정기</b>', '가속도(8장) · 파일 저장(11장) · 데이터 로깅', '★★☆'],
              ['<b>스마트 가로등</b>', '빛 센서 · NeoPixel · 서보(14장)', '★★☆'],
              ['<b>도난 경보기</b>', '가속도 · 소리 · radio(13장) · 알림음', '★★☆'],
              ['<b>무선 리모컨 자동차</b>', 'radio · 서보 · 모터 드라이버', '★★★'],
              ['<b>교실 환경 모니터</b>', '온도 · 빛 · 소리 · 데이터 로깅 · CSV 분석', '★★☆'],
              ['<b>반응 속도 대결 (여러 명)</b>', 'radio · 버튼 · 난수 · 점수 기록', '★★★'],
              ['<b>모스 부호 통신기</b>', '버튼 길게/짧게 · radio 또는 핀 통신', '★★★'],
              ['<b>디지털 주사위 보드게임</b>', '제스처 · 난수 · radio · 음악', '★★☆'],
              ['<b>악기 (테레민 · 드럼)</b>', '빛 · 기울기 · music · 핀 터치', '★★☆'],
              ['<b>출석 체크 시스템</b>', 'radio · 파일 저장 · 학생별 번호', '★★★']
            ], caption: '표 14-1. 프로젝트 아이디어 — 배운 장을 조합해 보세요'
          },
          {
            type: 'code', title: '예제 14-11. 프로젝트 뼈대 (복사해서 시작하세요)', code: `from microbit import *
# import music, radio, neopixel, log, random 등 필요한 것만

# ── 설정 ─────────────────────────────────
THRESHOLD = 500
INTERVAL = 1000

# ── 상태 변수 ────────────────────────────
count = 0
running = True
next_time = running_time()


# ── 기능별 함수 ──────────────────────────
def read_sensors():
    """센서를 읽어 돌려준다"""
    return temperature(), display.read_light_level()


def show_state(temp, light):
    """상태를 화면에 보여 준다"""
    display.show(Image.HAPPY if light > 50 else Image.ASLEEP)


def handle_buttons():
    """버튼 입력을 처리한다"""
    global running, count
    if button_a.was_pressed():
        running = not running
    if button_b.was_pressed():
        count = 0


# ── 준비 ─────────────────────────────────
display.scroll("START", delay=60)

# ── 메인 루프 ────────────────────────────
while True:
    handle_buttons()

    if running and running_time() >= next_time:
        next_time = next_time + INTERVAL
        temp, light = read_sensors()
        show_state(temp, light)
        count = count + 1
        print(count, temp, light)

    sleep(50)`,
            desc: '어떤 프로젝트든 이 뼈대에서 시작할 수 있습니다. <b>설정 → 상태 변수 → 함수 → 준비 → 메인 루프</b> 순서로 정리하면 코드가 길어져도 읽기 쉽습니다. <code>global</code> 은 함수 안에서 바깥 변수를 바꿀 때 필요합니다.',
            expect: 'START 가 흐른 뒤 1초마다 상태를 확인합니다. A 로 멈추고 시작합니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'tip', title: 'global 이 필요한 이유', html: '함수 안에서 <code>count = 0</code> 처럼 <b>값을 넣으면</b> 파이썬은 그것을 <b>함수 안에서만 쓰는 새 변수</b>로 봅니다. 바깥의 변수를 바꾸려면 <code>global count</code> 라고 미리 선언해야 합니다. (읽기만 할 때는 필요 없습니다)' },

          { type: 'h', text: '여기서 어디로 갈까?' },
          { type: 'figure', html: FIG_ROADMAP, caption: '그림 14-4. micro:bit 다음의 길' },
          {
            type: 'table', head: ['다음 단계', '무엇을', '왜'], rows: [
              ['<b>PC 파이썬</b>', '여기서 배운 문법 그대로. 리스트 · 딕셔너리 · 함수 · 클래스', '데이터 분석 · 웹 · 인공지능 어디에나 쓰입니다'],
              ['<b>Raspberry Pi Pico</b>', '같은 MicroPython, 핀 26개 · 더 빠름 · 더 저렴', 'micro:bit 코드가 거의 그대로 동작합니다'],
              ['<b>ESP32</b>', 'MicroPython + <b>WiFi · 블루투스</b>', '인터넷에 연결되는 장치(IoT)를 만들 수 있습니다'],
              ['<b>Arduino</b>', 'C++ 로 프로그래밍. 부품 · 자료가 가장 많음', '전자 공작의 표준. 라이브러리가 풍부합니다'],
              ['<b>전자 · 회로</b>', '옴의 법칙 · 트랜지스터 · 브레드보드 · 납땜', '스스로 회로를 설계할 수 있게 됩니다'],
              ['<b>3D 프린팅 · 제작</b>', '케이스 만들기 · 기구 설계', '작품이 “진짜 제품” 처럼 보이게 됩니다']
            ]
          },
          {
            type: 'list', items: [
              '<b>공식 문서</b>: <a href="https://microbit-micropython.readthedocs.io/en/v2-docs/" target="_blank" rel="noopener">microbit-micropython.readthedocs.io</a> — 이 강좌의 원본입니다.',
              '<b>온라인 편집기</b>: <a href="https://python.microbit.org" target="_blank" rel="noopener">python.microbit.org</a> — 공식 파이썬 편집기.',
              '<b>프로젝트 모음</b>: <a href="https://microbit.org/projects/" target="_blank" rel="noopener">microbit.org/projects</a> — 수백 개의 아이디어.',
              '<b>MicroPython 공식</b>: <a href="https://micropython.org" target="_blank" rel="noopener">micropython.org</a> — 다른 보드로 넓혀 갈 때.'
            ]
          },

          { type: 'h', text: '마무리 — 14장의 여정' },
          {
            type: 'table', head: ['장', '배운 것', '핵심'], rows: [
              ['01 ~ 02', 'micro:bit · MicroPython · 화면에 글자', '<code>display.scroll</code> · <code>show</code> · <code>sleep</code> · 들여쓰기'],
              ['03', '이미지와 애니메이션', '<code>Image()</code> · <code>set_pixel</code> · 리스트 + delay'],
              ['04', '버튼과 이벤트 루프', '<code>was_pressed</code> · <code>if</code>/<code>elif</code>/<code>else</code>'],
              ['05', '입출력 핀', '디지털 · 아날로그 · PWM · 풀업/풀다운'],
              ['06 ~ 07', '음악과 난수', '<code>music.play</code> · <code>pitch</code> · <code>random</code>'],
              ['08 ~ 10', '센서 — 가속도 · 제스처 · 나침반', '<code>get_values</code> · <code>was_gesture</code> · <code>heading</code>'],
              ['11', '파일과 데이터 로깅', '<code>with open</code> · <code>os</code> · <code>log</code>'],
              ['12', '말하기와 소리', '<code>speech</code> · <code>audio</code> · <code>microphone</code>'],
              ['13', '통신', '<code>print</code> · 핀 통신 · <code>radio</code>'],
              ['14', 'NeoPixel · 서보 · 프로젝트', '배운 것을 <b>합치기</b>']
            ]
          },
          { type: 'callout', kind: 'tip', title: '마지막으로', html: '<p>프로그래밍은 <b>문법을 외우는 것</b>이 아니라 <b>문제를 작게 나누어 푸는 연습</b>입니다. 여기까지 온 여러분은 이미 그 방법을 알고 있습니다.</p><p>이제 “무엇을 만들까?” 를 스스로 정해 보세요. 잘 안 되면 <b>더 작게 나누고</b>, 오류가 나면 <b>메시지를 읽고</b>, 막히면 <b>print() 로 들여다보세요</b>. 그것이 전부입니다.</p><p><b>수고하셨습니다!</b> 🎉</p>' }
        ],
        practice: [
          {
            title: '실습 14-3. 도난 경보기',
            level: 2,
            desc: '<p>가방이나 서랍에 넣어 두는 <b>도난 경보기</b>를 만드세요.</p><ol><li>A 를 누르면 <b>경계 모드</b>가 켜집니다 (3초 뒤부터 감시 시작 — 손을 뗄 시간)</li><li>경계 중에 보드가 움직이면(<code>get_strength() &gt; 1400</code>) 경보!</li><li>경보: 화면 깜빡임 + 사이렌 소리 (10초간 또는 A 를 누를 때까지)</li><li>경계 중에는 화면에 작은 점 하나만 표시합니다 (눈에 띄지 않게)</li><li>도전: 경보가 울릴 때 <code>radio</code> 로 <code>"ALERT"</code> 를 보내 다른 보드에도 알리세요</li></ol>',
            hint: '상태를 <code>mode</code> 변수로 관리하세요: <code>"off"</code> → <code>"arming"</code>(3초 대기) → <code>"armed"</code> → <code>"alarm"</code>. 각 상태에서 할 일을 <code>if</code> 로 나눕니다.',
            starter: 'from microbit import *\nimport music\n\nmode = "off"\nt0 = 0\ndisplay.show(Image.NO)\n\nwhile True:\n    # TODO: 상태별 동작\n    sleep(50)\n',
            solution: 'from microbit import *\nimport music\nimport radio\n\nradio.on()\nradio.config(group=7)\n\nTHRESHOLD = 1400\nmode = "off"\nt0 = 0\ndisplay.show(Image.NO)\n\nwhile True:\n    if button_a.was_pressed():\n        if mode == "off":\n            mode = "arming"\n            t0 = running_time()\n            display.show(Image.ALL_CLOCKS, delay=40)\n        else:\n            mode = "off"\n            music.stop()\n            display.show(Image.NO)\n\n    if mode == "arming":\n        if running_time() - t0 > 3000:\n            mode = "armed"\n            music.pitch(880, 100)\n            display.clear()\n            display.set_pixel(4, 4, 2)\n\n    elif mode == "armed":\n        display.clear()\n        display.set_pixel(4, 4, 2)\n        if accelerometer.get_strength() > THRESHOLD:\n            mode = "alarm"\n            t0 = running_time()\n            radio.send("ALERT")\n            print("도난 감지!")\n\n    elif mode == "alarm":\n        for hz in range(600, 1200, 40):\n            music.pitch(hz, 8)\n        display.show(Image.SKULL)\n        sleep(60)\n        display.clear()\n        sleep(60)\n        if running_time() - t0 > 10000:\n            mode = "armed"\n\n    sleep(50)\n'
          },
          {
            title: '실습 14-4. 도전! 나만의 종합 프로젝트',
            level: 3,
            desc: '<p>표 14-1 의 아이디어 중 하나를 고르거나 <b>직접 생각한 것</b>을 만드세요.</p><p><b>조건</b></p><ol><li>센서를 <b>2가지 이상</b> 사용합니다 (버튼 · 가속도 · 빛 · 소리 · 온도 · 나침반 · 핀 입력)</li><li>출력을 <b>2가지 이상</b> 사용합니다 (LED 화면 · 소리 · 핀 출력 · NeoPixel · 서보 · radio)</li><li>기능을 <b>함수 3개 이상</b>으로 나눕니다</li><li>설정값(상수)을 맨 위에 모읍니다</li><li>프로그램 맨 위에 <b>주석으로 설명</b>을 적습니다 (무엇을 하는지, 어떻게 쓰는지)</li></ol><p><b>제출 · 발표</b>: 완성한 코드를 <code>💾</code> 로 <code>main.py</code> 저장하고, 실제 보드가 있으면 올려서 시연해 보세요.</p>',
            hint: '예제 14-11 의 뼈대를 복사해 시작하세요. 한 기능을 완성하고 실행해 확인한 뒤 다음 기능을 더하는 순서로 만드는 것이 가장 빠릅니다.',
            starter: 'from microbit import *\n\n# ─────────────────────────────────────────\n#  프로젝트 이름:\n#  만든 사람:\n#  하는 일:\n#  사용법: A =        B =        흔들기 =\n# ─────────────────────────────────────────\n\n# ── 설정 ──\n\n\n# ── 상태 변수 ──\n\n\n# ── 함수 ──\n\n\n# ── 준비 ──\ndisplay.scroll("READY", delay=60)\n\n# ── 메인 루프 ──\nwhile True:\n    sleep(50)\n',
            solution: 'from microbit import *\nimport music\nimport random\n\n# ─────────────────────────────────────────\n#  프로젝트: 공부 타이머 (뽀모도로)\n#  하는 일: 25분 공부 / 5분 휴식을 반복하며 알려 준다\n#  사용법: A = 시작/정지, B = 남은 시간 확인, 흔들기 = 초기화\n# ─────────────────────────────────────────\n\n# ── 설정 ──\nSTUDY_MS = 25 * 60 * 1000\nBREAK_MS = 5 * 60 * 1000\nDARK_LEVEL = 30\n\n# ── 상태 변수 ──\nrunning = False\nstudying = True\nend_at = 0\nrounds = 0\n\n\n# ── 함수 ──\ndef start_phase():\n    """현재 단계를 시작한다"""\n    global end_at\n    end_at = running_time() + (STUDY_MS if studying else BREAK_MS)\n    music.play(music.POWER_UP if studying else music.JUMP_DOWN)\n    display.scroll("STUDY" if studying else "BREAK", delay=60)\n\n\ndef show_progress():\n    """남은 시간을 막대로 보여 준다"""\n    total = STUDY_MS if studying else BREAK_MS\n    left = max(0, end_at - running_time())\n    n = int(left * 5 / total)\n    display.clear()\n    for y in range(n):\n        for x in range(5):\n            display.set_pixel(x, 4 - y, 9 if studying else 4)\n\n\ndef check_light():\n    """너무 어두우면 알려 준다"""\n    if display.read_light_level() < DARK_LEVEL:\n        music.pitch(400, 60)\n\n\n# ── 준비 ──\ndisplay.scroll("READY", delay=60)\ndisplay.show(Image.SQUARE_SMALL)\n\n# ── 메인 루프 ──\nwhile True:\n    if button_a.was_pressed():\n        running = not running\n        if running:\n            start_phase()\n        else:\n            display.show(Image.SQUARE_SMALL)\n\n    if button_b.was_pressed():\n        left = max(0, (end_at - running_time()) // 60000)\n        display.scroll(str(left) + "M R" + str(rounds), delay=70)\n\n    if accelerometer.was_gesture("shake"):\n        running = False\n        rounds = 0\n        studying = True\n        display.show(Image.NO)\n        sleep(500)\n        display.show(Image.SQUARE_SMALL)\n\n    if running:\n        if running_time() >= end_at:\n            if studying:\n                rounds = rounds + 1\n            studying = not studying\n            start_phase()\n        else:\n            show_progress()\n            if studying and random.randint(0, 200) == 0:\n                check_light()\n\n    sleep(100)\n'
          }
        ],
        quiz: [
          {
            q: '프로젝트를 만들 때 가장 중요한 원칙은?', options: ['한 번에 다 만들기', '기능을 <b>작게 나누어</b> 하나씩 확인하기', '코드를 최대한 짧게 쓰기', '주석을 쓰지 않기'], answer: 1,
            explain: '한꺼번에 만들면 어디가 잘못됐는지 찾을 수 없습니다. <b>한 기능씩 만들고 확인</b>하는 것이 가장 빠릅니다.'
          },
          {
            q: '함수 안에서 바깥의 변수 값을 바꾸려면?', options: ['그냥 바꾸면 된다', '<code>global 변수이름</code> 을 선언한다', '<code>return</code> 을 쓴다', '불가능하다'], answer: 1,
            explain: '함수 안에서 값을 넣으면 <b>새 지역 변수</b>가 됩니다. 바깥 변수를 바꾸려면 <code>global</code> 선언이 필요합니다.'
          },
          {
            q: '설정값(상수)을 프로그램 맨 위에 모으는 이유는?', options: ['실행이 빨라져서', '<b>조절하기 쉬워서</b>', '메모리를 아껴서', '규칙이라서'], answer: 1,
            explain: '<code>THRESHOLD = 140</code> 처럼 이름을 붙여 위에 모으면 <b>한 곳만 고쳐</b> 동작을 조절할 수 있습니다.'
          },
          {
            q: 'micro:bit 다음에 배우기 좋은 것으로 가장 자연스러운 것은?', options: ['완전히 다른 언어', '같은 MicroPython 을 쓰는 Raspberry Pi Pico · ESP32', '기계어', 'HTML'], answer: 1,
            explain: '<b>같은 MicroPython</b> 을 쓰므로 코드가 거의 그대로 동작합니다. 핀이 더 많고 ESP32 는 WiFi 까지 됩니다.'
          },
          {
            q: 'NeoPixel 에서 색을 바꿨는데 아무 변화가 없다면 가장 먼저 확인할 것은?', options: ['전원', '<code>np.show()</code> 를 불렀는지', '핀 번호', 'LED 개수'], answer: 1,
            explain: '<code>np[i] = 색</code> 은 적어 두기만 합니다. <b><code>np.show()</code></b> 를 불러야 실제로 켜집니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '종합 프로젝트와 다음 단계', subtitle: 'Chapter 14 · 마지막 시간', badge: '2교시',
            notes: '<p>마지막 시간입니다. 프로젝트 제작과 발표 시간을 충분히 남겨 두세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'code', title: '서보로 움직이는 장치', code: 'from microbit import *\n\nSERVO_PIN = pin0\nSERVO_PIN.set_analog_period(20)\n\ndef servo(angle):\n    angle = max(0, min(180, int(angle)))\n    SERVO_PIN.write_analog(26 + (angle * 102) // 180)\n\nservo(0)\nsleep(1000)\nservo(180)',
            points: ['5장의 서보를 <b>함수로</b> 정리', '각도만 넣으면 되게', '자동문 · 로봇 팔 · 방향타', '⚠ 별도 전원 + 공통 GND'],
            notes: '<p>실물 서보가 있으면 종이로 팔을 만들어 붙여 보게 하면 좋습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'diagram', title: '프로젝트 설계 네 단계', html: `<svg viewBox="0 0 1280 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <defs><marker id="s14a" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--accent)"/></marker></defs>
  ${[['① 무엇을?', '만들고 싶은 것'], ['② 무엇으로?', '센서와 표현 방법'], ['③ 작게 나누기', '하나씩 만들어 확인'], ['④ 합치기', '함수로 묶어 완성']]
                .map(([t, d], i) => {
                  const x = 40 + i * 312;
                  return `<rect x="${x}" y="60" width="272" height="110" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="${x + 136}" y="105" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">${t}</text>
  <text x="${x + 136}" y="140" text-anchor="middle" font-size="17" fill="var(--muted)">${d}</text>` +
                    (i < 3 ? `<line x1="${x + 277}" y1="115" x2="${x + 307}" y2="115" stroke="var(--accent)" stroke-width="4" marker-end="url(#s14a)"/>` : '');
                }).join('\n  ')}
  <text x="640" y="220" text-anchor="middle" font-size="20" fill="var(--fg)">가장 중요한 것은 <tspan font-weight="bold">③ 작게 나누기</tspan></text>
</svg>`, caption: '한꺼번에 만들면 어디가 잘못됐는지 알 수 없습니다',
            notes: '<p>학생들이 가장 많이 실패하는 지점입니다. "먼저 센서 값이 콘솔에 찍히는지부터" 를 강조하세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '프로젝트 뼈대', code: '# ── 설정 ──\nTHRESHOLD = 500\nINTERVAL = 1000\n\n# ── 상태 변수 ──\ncount = 0\nnext_time = running_time()\n\n# ── 함수 ──\ndef read_sensors():\n    return temperature(), display.read_light_level()\n\ndef show_state(temp, light):\n    display.show(Image.HAPPY if light > 50 else Image.ASLEEP)\n\n# ── 메인 루프 ──\nwhile True:\n    if running_time() >= next_time:\n        next_time += INTERVAL\n        show_state(*read_sensors())\n    sleep(50)',
            points: ['설정 → 상태 → 함수 → 루프', '설정값은 <b>맨 위</b>에 모으기', '기능별로 <code>def</code> 로 나누기', '이 뼈대로 무엇이든 시작'],
            notes: '<p>이 뼈대를 복사해 프로젝트를 시작하게 하세요. 구조가 잡히면 훨씬 수월합니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'table', title: '프로젝트 아이디어', head: ['프로젝트', '쓰는 기능'], rows: [
              ['만보기 · 활동량 측정', '가속도 · 파일 · 로깅'],
              ['스마트 가로등', '빛 · NeoPixel · 서보'],
              ['도난 경보기', '가속도 · 소리 · radio'],
              ['무선 리모컨 자동차', 'radio · 서보 · 모터'],
              ['교실 환경 모니터', '온도 · 빛 · 소리 · CSV']],
            notes: '<p>학생들이 각자 하고 싶은 것을 고르게 하고, 필요하면 난이도를 조절해 주세요.</p><p>시간: 6분</p>'
          },
          {
            layout: 'practice', title: '실습 14-4. 나만의 종합 프로젝트', desc: '센서 2가지 이상 · 출력 2가지 이상 · 함수 3개 이상 · 설정값 정리 · 설명 주석',
            starter: 'from microbit import *\n\n# ─────────────────────────────\n#  프로젝트 이름:\n#  하는 일:\n#  사용법:\n# ─────────────────────────────\n\n# ── 설정 ──\n\n# ── 상태 변수 ──\n\n# ── 함수 ──\n\n# ── 메인 루프 ──\nwhile True:\n    sleep(50)\n',
            solution: '# (예시) 공부 타이머 — 25분 공부 / 5분 휴식\nfrom microbit import *\nimport music\n\nSTUDY_MS = 25 * 60 * 1000\nBREAK_MS = 5 * 60 * 1000\n\nrunning = False\nstudying = True\nend_at = 0\n\n\ndef start_phase():\n    global end_at\n    end_at = running_time() + (STUDY_MS if studying else BREAK_MS)\n    music.play(music.POWER_UP if studying else music.JUMP_DOWN)\n    display.scroll("STUDY" if studying else "BREAK", delay=60)\n\n\ndef show_progress():\n    total = STUDY_MS if studying else BREAK_MS\n    n = int(max(0, end_at - running_time()) * 5 / total)\n    display.clear()\n    for y in range(n):\n        for x in range(5):\n            display.set_pixel(x, 4 - y, 9 if studying else 4)\n\n\nwhile True:\n    if button_a.was_pressed():\n        running = not running\n        if running:\n            start_phase()\n\n    if running:\n        if running_time() >= end_at:\n            studying = not studying\n            start_phase()\n        else:\n            show_progress()\n\n    sleep(100)\n',
            notes: '<p>남은 시간을 모두 제작과 발표에 쓰세요. 완성하지 못해도 괜찮으니 과정에서 배운 것을 나누게 하면 좋습니다.</p><p>시간: 20분</p>'
          },
          {
            layout: 'diagram', title: '여기서 어디로 갈까?', html: FIG_ROADMAP, caption: 'PC 파이썬 · 더 큰 보드 · 전자 공작 · 대회',
            notes: '<p>"여기서 배운 파이썬은 진짜 파이썬" 이라는 점을 마지막으로 강조하세요. 다음 학습에 대한 동기가 생깁니다.</p><p>시간: 5분</p>'
          },
          {
            layout: 'summary', title: '14장 · 강좌 정리', bullets: ['NeoPixel: <code>np[i] = (r,g,b)</code> → <code>np.show()</code>', '서보: 함수로 묶어 각도만 넣기', '프로젝트: 작게 나누어 하나씩 확인', '설정 → 상태 → 함수 → 메인 루프', '다음: PC 파이썬 · Pico · ESP32 · 전자 공작'],
            notes: '<p>전체 강좌를 마무리합니다. 학생들의 작품을 축하하고, 앞으로 무엇을 만들고 싶은지 한마디씩 말하게 하면 좋은 마무리가 됩니다.</p><p>수고하셨습니다! 🎉</p><p>시간: 5분</p>'
          }
        ]
      }
    ]
  });
})();
