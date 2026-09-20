/* Chapter 10. 방향 — 나침반
 * 원본: MicroPython on the BBC micro:bit — Direction
 */
(function () {
  const FIG_COMPASS = `<svg viewBox="0 0 1280 440" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">방위각(heading) — 북쪽에서 시계 방향으로 잰 각도</text>
  <circle cx="330" cy="240" r="150" fill="var(--card)" stroke="var(--line)" stroke-width="4"/>
  ${[['N', 0, '북 · 0°'], ['NE', 45, '북동 · 45°'], ['E', 90, '동 · 90°'], ['SE', 135, '남동 · 135°'],
    ['S', 180, '남 · 180°'], ['SW', 225, '남서 · 225°'], ['W', 270, '서 · 270°'], ['NW', 315, '북서 · 315°']]
      .map(([label, deg]) => {
        const r = (deg - 90) * Math.PI / 180;
        const x = 330 + Math.cos(r) * 122, y = 240 + Math.sin(r) * 122;
        const big = deg % 90 === 0;
        return `<line x1="330" y1="240" x2="${(330 + Math.cos(r) * 150).toFixed(1)}" y2="${(240 + Math.sin(r) * 150).toFixed(1)}" stroke="var(--line)" stroke-width="${big ? 3 : 1.5}"/>
  <text x="${x.toFixed(1)}" y="${(y + 7).toFixed(1)}" text-anchor="middle" font-size="${big ? 25 : 18}" font-weight="bold" fill="${deg === 0 ? 'var(--danger)' : 'var(--muted)'}">${label}</text>`;
      }).join('\n  ')}
  <polygon points="330,120 318,246 342,246" fill="var(--danger)"/>
  <polygon points="330,360 318,234 342,234" fill="var(--muted)" opacity=".55"/>
  <circle cx="330" cy="240" r="10" fill="var(--fg)"/>
  ${[['0°', '북 (N)'], ['90°', '동 (E)'], ['180°', '남 (S)'], ['270°', '서 (W)']]
      .map(([d, k], i) => `<rect x="580" y="${110 + i * 62}" width="150" height="46" rx="10" fill="var(--accent)" opacity=".15" stroke="var(--accent)" stroke-width="2"/>
  <text x="655" y="${140 + i * 62}" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">${d}</text>
  <text x="760" y="${140 + i * 62}" font-size="21" fill="var(--fg)">${k}</text>`).join('\n  ')}
  <text x="940" y="145" font-size="20" fill="var(--fg)">compass.heading() 은</text>
  <text x="940" y="180" font-size="20" fill="var(--fg)"><tspan font-weight="bold" fill="var(--accent)">0 ~ 359</tspan> 사이의 정수를</text>
  <text x="940" y="215" font-size="20" fill="var(--fg)">돌려줍니다.</text>
  <text x="940" y="275" font-size="19" fill="var(--muted)">보드의 <tspan font-weight="bold">위쪽(로고 쪽)</tspan>이</text>
  <text x="940" y="308" font-size="19" fill="var(--muted)">가리키는 방향이 기준입니다.</text>
  <text x="640" y="424" text-anchor="middle" font-size="18" fill="var(--muted)">시계 방향으로 각도가 커집니다 — 지도나 항해에서 쓰는 방식과 같습니다</text>
</svg>`;

  const FIG_CAL = `<svg viewBox="0 0 1280 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--fg)">보정(calibrate) — 처음 한 번은 꼭 필요합니다</text>
  ${[['①', '"TILT TO FILL SCREEN"', '안내 글자가 흐릅니다'],
    ['②', '보드를 이리저리 기울임', '점이 움직이며 화면을 채웁니다'],
    ['③', '25칸을 모두 채우면 끝', '웃는 얼굴이 나타납니다'],
    ['④', '이제 heading() 이 정확', '전원을 껐다 켜면 다시 필요']]
      .map(([n, a, b], i) => {
        const x = 40 + i * 310;
        return `<rect x="${x}" y="70" width="280" height="150" rx="16" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="${x + 140}" y="118" text-anchor="middle" font-size="34" font-weight="bold" fill="var(--accent)">${n}</text>
  <text x="${x + 140}" y="162" text-anchor="middle" font-size="18" font-weight="bold" fill="var(--fg)">${a}</text>
  <text x="${x + 140}" y="194" text-anchor="middle" font-size="16" fill="var(--muted)">${b}</text>`;
      }).join('\n  ')}
  <text x="640" y="272" text-anchor="middle" font-size="19" fill="var(--danger)">보정하지 않고 heading() 을 부르면 <tspan font-weight="bold">자동으로 보정 화면이 시작</tspan>되어 프로그램이 멈춘 것처럼 보입니다</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch10',
    no: '10',
    title: '방향 — 나침반',
    subtitle: 'compass · heading · 보정 · 나침반 만들기 · 금속 탐지',
    summary: 'micro:bit 안의 지자기 센서로 어느 쪽이 북쪽인지 알아냅니다. 방위각(heading)의 의미와 0~359° 의 방향 체계를 이해하고, 처음 한 번 꼭 필요한 보정(calibration) 과정을 배웁니다. 화살표로 북쪽을 가리키는 나침반, 자기장 세기로 쇠붙이를 찾는 금속 탐지기를 만듭니다.',
    goals: [
      '<code>compass.heading()</code> 으로 방위각을 읽을 수 있다',
      '0 ~ 359° 가 각각 어느 방향인지 설명할 수 있다',
      '보정(<code>calibrate()</code>)이 왜 필요한지 설명하고 수행할 수 있다',
      '방위각을 8방향으로 나누어 화살표로 표시할 수 있다',
      '<code>get_field_strength()</code> 로 자기장 세기를 잴 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch10-1',
        title: '나침반 센서와 보정',
        minutes: 45,
        goals: [
          '지자기 센서가 무엇을 재는지 설명할 수 있다',
          '방위각(0~359°)의 의미를 이해한다',
          '보정 과정을 수행하고 왜 필요한지 설명할 수 있다',
          '<code>heading()</code> 값을 화면과 콘솔에 표시할 수 있다'
        ],
        flow: [['지구는 커다란 자석', 8], ['방위각 이해하기', 10], ['보정하기', 12], ['값 읽고 표시', 12], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '지구는 커다란 자석입니다' },
          { type: 'p', html: '지구 내부의 액체 상태 철이 움직이면서 <b>거대한 자기장</b>을 만듭니다. 그래서 지구는 커다란 막대자석과 비슷합니다. 나침반 바늘이 북쪽을 가리키는 것은 이 자기장 때문입니다.' },
          { type: 'p', html: 'micro:bit 에는 <b>지자기 센서(magnetometer)</b> 가 들어 있어 이 자기장의 방향을 잽니다. 파이썬에서는 <code>compass</code> 라는 이름으로 씁니다.' },
          { type: 'callout', kind: 'more', title: '진북과 자북', html: '<p>지구의 <b>자기 북극</b>은 지도상의 <b>북극점</b>과 정확히 일치하지 않습니다. 둘 사이의 각도 차이를 <b>편각(declination)</b> 이라고 하며, 한국에서는 약 <b>서쪽으로 7~8도</b> 입니다.</p><p>또 자기 북극은 해마다 조금씩 이동합니다. 정밀한 항해나 측량에서는 이 차이를 보정하지만, 이 강좌에서는 무시하고 자북을 그대로 씁니다.</p>' },

          { type: 'h', text: '방위각 (heading)' },
          { type: 'figure', html: FIG_COMPASS, caption: '그림 10-1. 방위각 — 북쪽이 0°, 시계 방향으로 커진다' },
          {
            type: 'table', head: ['방위각', '방향', '방위각', '방향'], rows: [
              ['0° (= 360°)', '북 (N)', '180°', '남 (S)'],
              ['45°', '북동 (NE)', '225°', '남서 (SW)'],
              ['90°', '동 (E)', '270°', '서 (W)'],
              ['135°', '남동 (SE)', '315°', '북서 (NW)']
            ]
          },
          { type: 'callout', kind: 'tip', title: '기준은 보드의 위쪽', html: '<code>heading()</code> 이 알려 주는 것은 <b>micro:bit 의 위쪽(로고가 있는 쪽)이 가리키는 방향</b>입니다. 보드를 평평하게 들고 로고 쪽이 북쪽을 향하면 0 에 가까운 값이 나옵니다.' },

          { type: 'h', text: '보정 (calibration) — 처음 한 번' },
          { type: 'p', html: '지자기 센서는 주변의 쇠붙이, 자석, 전자 기기의 영향을 받습니다. 그래서 <b>쓰기 전에 한 번 보정</b>해 “어느 정도가 정상인지” 를 알려 주어야 합니다.' },
          { type: 'figure', html: FIG_CAL, caption: '그림 10-2. 보정 과정' },
          {
            type: 'code', title: '예제 10-1. 보정하고 방위각 읽기', code: `from microbit import *

# 보정: 화면의 점을 움직여 25칸을 모두 채운다
compass.calibrate()

display.scroll("OK", delay=60)

while True:
    h = compass.heading()
    print("방위각:", h)
    display.show(str(h // 100))       # 백의 자리만 간단히
    sleep(500)`,
            hint: '🧭 <b>센서 탭</b>의 <b>방위각</b> 슬라이더를 움직여 보세요. 시뮬레이터에서는 보정이 바로 끝납니다.',
            desc: '<code>compass.calibrate()</code> 는 실제 보드에서 <b>보정 게임</b>을 띄웁니다. 보드를 기울여 화면의 모든 칸을 채우면 끝납니다. 시뮬레이터에서는 즉시 통과합니다.',
            expect: '방위각: 0\n방위각: 90 …',
            nondeterministic: true
          },
          { type: 'callout', kind: 'warn', title: '보정하지 않으면?', html: '보정하지 않은 채 <code>heading()</code> 을 부르면 micro:bit 가 <b>자동으로 보정 화면을 띄웁니다</b>. 이때 사용자는 프로그램이 멈춘 줄 알고 당황하게 되므로, <b>프로그램 시작 부분에서 직접 <code>calibrate()</code> 를 부르는 것</b>이 좋습니다.' },
          {
            type: 'code', title: '예제 10-2. 필요할 때만 보정하기', code: `from microbit import *

display.scroll("COMPASS", delay=60)

# 아직 보정되지 않았을 때만 보정
if not compass.is_calibrated():
    display.scroll("CAL", delay=60)
    compass.calibrate()

display.show(Image.YES)
sleep(500)

while True:
    display.show(str(compass.heading() // 45))
    sleep(300)`,
            desc: '<code>is_calibrated()</code> 로 이미 보정되었는지 확인할 수 있습니다. 불필요한 보정을 피해 사용자 경험이 좋아집니다.',
            expect: '보정 후 방위각을 8등분한 번호가 표시됩니다.',
            nondeterministic: true
          },
          {
            type: 'table', head: ['메서드', '하는 일'], rows: [
              ['<code>compass.heading()</code>', '방위각을 <b>0 ~ 359</b> 정수로 돌려준다'],
              ['<code>compass.calibrate()</code>', '보정 시작 (화면에서 점을 움직여 채우기)'],
              ['<code>compass.is_calibrated()</code>', '보정되었는지 <code>True</code> / <code>False</code>'],
              ['<code>compass.clear_calibration()</code>', '보정 기록을 지움 (다시 보정 필요)'],
              ['<code>compass.get_field_strength()</code>', '자기장 세기 (나노테슬라, nT)'],
              ['<code>compass.get_x() / get_y() / get_z()</code>', '세 축의 자기장 값']
            ]
          },

          { type: 'h', text: '방위각 다루기' },
          {
            type: 'code', title: '예제 10-3. 북쪽을 보면 알려 주기', code: `from microbit import *
import music

compass.calibrate()

while True:
    h = compass.heading()

    # 북쪽(0°) 근처인가? 0 은 359 와 이어지므로 두 조건 모두 확인
    if h < 15 or h > 345:
        display.show(Image.YES)
        music.pitch(880, 100)
    else:
        display.show(Image.NO)

    sleep(300)`,
            hint: '🧭 센서 탭의 <b>방위각</b> 슬라이더를 0 이나 350 근처로 움직여 보세요.',
            desc: '<b>0° 와 359° 는 이어져 있다</b>는 점이 중요합니다. “북쪽 근처”는 <code>h &lt; 15</code> 와 <code>h &gt; 345</code> 를 <b>둘 다</b> 확인해야 합니다.',
            expect: '북쪽 근처면 체크 표시와 소리, 아니면 엑스'
          },
          {
            type: 'code', title: '예제 10-4. 8방향으로 나누기', code: `from microbit import *

NAMES = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

compass.calibrate()

while True:
    h = compass.heading()
    # 22.5도씩 회전시킨 뒤 45도로 나누면 8방향
    index = int((h + 22.5) // 45) % 8
    display.show(NAMES[index][0])
    print(h, "도 →", NAMES[index])
    sleep(400)`,
            hint: '🧭 방위각 슬라이더를 천천히 0 → 359 로 움직여 보세요.',
            desc: '<b>22.5 를 더하는 이유</b>: 북쪽(N)의 범위는 337.5° ~ 22.5° 입니다. 22.5 를 더하면 이 범위가 0 ~ 45 가 되어 45 로 나누기만 하면 됩니다. <code>% 8</code> 은 360° 근처에서 8 이 나오는 것을 0 으로 되돌립니다.',
            expect: '0 도 → N\n90 도 → E\n200 도 → S …',
            nondeterministic: true
          },
          { type: 'callout', kind: 'more', title: '왜 22.5 를 더할까?', html: '<p>8방향으로 나누면 한 방향이 <b>45°</b> 를 차지합니다. 북(N)은 0° 를 <b>가운데</b> 로 하므로 실제 범위는 <b>−22.5° ~ +22.5°</b>, 즉 337.5° ~ 22.5° 입니다.</p><p>그냥 <code>h // 45</code> 로 나누면 0~44 만 N 이 되어 범위가 어긋납니다. 미리 <b>22.5 를 더해</b> 범위를 0 ~ 45 로 옮긴 뒤 나누면 정확해집니다.</p>' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 16방위로 더 자세히', code: `from microbit import *

NAMES16 = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
           "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]

compass.calibrate()
last = ""

while True:
    h = compass.heading()
    # 한 칸이 22.5도
    name = NAMES16[int((h + 11.25) // 22.5) % 16]

    if name != last:
        print(h, "도 →", name)
        display.scroll(name, delay=70)
        last = name

    sleep(200)`,
            hint: '🧭 <b>센서 탭</b>의 방위각 슬라이더를 천천히 돌려 보세요.',
            desc: '4방위(90°) · 8방위(45°) · 16방위(22.5°) 모두 <b>같은 공식</b>입니다 — 한 칸의 절반을 더하고 한 칸 크기로 나눕니다. 배가 항해할 때 쓰는 방위 표기법입니다.',
            expect: '0 도 → N\n30 도 → NNE\n95 도 → E …',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ②. 자기장을 세 축으로 보기', code: `from microbit import *

compass.calibrate()

while True:
    x = compass.get_x()
    y = compass.get_y()
    z = compass.get_z()

    print("x:", x, " y:", y, " z:", z,
          " 세기:", compass.get_field_strength(), "nT")

    # x · y 를 화면 위치로 (자기장이 향하는 쪽)
    col = max(0, min(4, scale(x, from_=(-40000, 40000), to=(0, 4))))
    row = max(0, min(4, scale(y, from_=(-40000, 40000), to=(4, 0))))
    display.clear()
    display.set_pixel(2, 2, 2)
    display.set_pixel(col, row, 9)

    sleep(300)`,
            hint: '🧭 방위각 슬라이더를 돌리면 점이 원을 그리며 돕니다.',
            desc: '나침반도 가속도 센서처럼 <b>세 축</b>으로 자기장을 잽니다. <code>heading()</code> 은 사실 이 <code>x</code> · <code>y</code> 값으로 각도를 계산한 결과입니다. 값의 단위는 나노테슬라(nT)입니다.',
            expect: 'x: 0  y: 40000  z: -20000  세기: 50000 nT',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. 보정 상태 확인하고 다시 하기', code: `from microbit import *

display.scroll("CAL?", delay=60)

while True:
    ok = compass.is_calibrated()
    display.show(Image.YES if ok else Image.NO)

    if button_a.was_pressed():
        # 보정하기
        display.scroll("CAL", delay=60)
        compass.calibrate()
        display.show(Image.YES)
        print("보정 완료. 방위각:", compass.heading())
        sleep(600)

    if button_b.was_pressed():
        # 보정 기록 지우기 (다시 보정이 필요해진다)
        compass.clear_calibration()
        print("보정 기록을 지웠습니다")
        display.show(Image.NO)
        sleep(600)

    sleep(150)`,
            desc: 'A 로 보정하고 B 로 보정을 취소합니다. 실제 보드에서는 <b>자석이나 노트북 옆</b>에서 보정하면 값이 어긋나므로, 그럴 때 B 로 지우고 다른 곳에서 다시 보정하면 됩니다.',
            expect: '보정되어 있으면 체크, 아니면 엑스가 보입니다.'
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              'micro:bit 의 <b>지자기 센서</b>가 지구 자기장의 방향을 잽니다. 파이썬 이름은 <code>compass</code>.',
              '<code>compass.heading()</code> 은 <b>0 ~ 359</b> 정수를 돌려줍니다. 북 0° · 동 90° · 남 180° · 서 270°.',
              '기준은 보드의 <b>위쪽(로고 쪽)</b>이 가리키는 방향입니다.',
              '쓰기 전에 <code>compass.calibrate()</code> 로 <b>보정</b>해야 합니다. <code>is_calibrated()</code> 로 확인할 수 있습니다.',
              '<b>0° 와 359° 는 이어져 있습니다.</b> 범위를 판단할 때 두 조건을 모두 확인하세요.',
              '8방향 변환: <code>int((h + 22.5) // 45) % 8</code>'
            ]
          }
        ],
        practice: [
          {
            title: '실습 10-1. 방위 표시기',
            level: 1,
            desc: '<p>방위각을 읽어 <b>N · E · S · W</b> 중 가장 가까운 방향을 화면에 보여 주세요.</p><ul><li>4방향이므로 한 방향이 90° 를 차지합니다 (북: 315°~45°)</li><li>방향이 바뀔 때만 짧은 소리를 냅니다</li><li>콘솔에는 방위각 숫자도 함께 출력합니다</li></ul>',
            hint: '4방향은 <code>int((h + 45) // 90) % 4</code> 로 구합니다. 직전 방향을 변수에 기억해 두고 바뀔 때만 소리를 내세요.',
            starter: 'from microbit import *\nimport music\n\nNAMES = ["N", "E", "S", "W"]\ncompass.calibrate()\nlast = ""\n\nwhile True:\n    h = compass.heading()\n    # TODO\n    sleep(300)\n',
            solution: 'from microbit import *\nimport music\n\nNAMES = ["N", "E", "S", "W"]\ncompass.calibrate()\nlast = ""\n\nwhile True:\n    h = compass.heading()\n    name = NAMES[int((h + 45) // 90) % 4]\n    display.show(name)\n    print(h, "도 →", name)\n\n    if name != last:\n        music.pitch(700, 80)\n        last = name\n\n    sleep(300)\n'
          },
          {
            title: '실습 10-2. 목표 방향 안내',
            level: 2,
            desc: '<p>A 를 누른 순간의 방향을 <b>목표</b>로 저장하고, 그 방향으로 안내하는 프로그램을 만드세요.</p><ul><li>A 를 누르면 현재 방위각을 <code>target</code> 에 저장하고 <code>Image.YES</code> 표시</li><li>그 뒤로는 목표까지 <b>왼쪽으로 돌아야 하는지 오른쪽으로 돌아야 하는지</b> 화살표로 안내</li><li>목표 방향에 가까우면(±15°) <code>Image.HAPPY</code> 와 소리</li></ul>',
            hint: '차이는 <code>diff = (target - h) % 360</code> 으로 구합니다. <code>diff</code> 가 180 보다 작으면 <b>오른쪽</b>, 크면 <b>왼쪽</b>으로 돌아야 합니다.',
            starter: 'from microbit import *\nimport music\n\ncompass.calibrate()\ntarget = None\n\nwhile True:\n    h = compass.heading()\n    if button_a.was_pressed():\n        target = h\n        display.show(Image.YES)\n        sleep(500)\n    # TODO\n    sleep(200)\n',
            solution: 'from microbit import *\nimport music\n\ncompass.calibrate()\ntarget = None\ndisplay.show(Image.DIAMOND_SMALL)\n\nwhile True:\n    h = compass.heading()\n\n    if button_a.was_pressed():\n        target = h\n        display.show(Image.YES)\n        music.pitch(880, 120)\n        sleep(500)\n\n    if target is None:\n        display.show(Image.DIAMOND_SMALL)\n    else:\n        diff = (target - h) % 360\n        if diff < 15 or diff > 345:\n            display.show(Image.HAPPY)\n            music.pitch(1000, 60)\n        elif diff < 180:\n            display.show(Image.ARROW_E)      # 오른쪽으로 돌기\n        else:\n            display.show(Image.ARROW_W)      # 왼쪽으로 돌기\n\n    sleep(200)\n'
          }
        ],
        quiz: [
          {
            q: '<code>compass.heading()</code> 이 돌려주는 값의 범위는?', options: ['0 ~ 100', '0 ~ 359', '−180 ~ 180', '0 ~ 1023'], answer: 1,
            explain: '<b>0 ~ 359</b> 정수입니다. 북쪽이 0, 시계 방향으로 커집니다.'
          },
          {
            q: '방위각 <b>270°</b> 는 어느 방향인가요?', options: ['북', '동', '남', '서'], answer: 3,
            explain: '북 0° → 동 90° → 남 180° → <b>서 270°</b> 순서입니다.'
          },
          {
            q: '<code>compass.calibrate()</code> 를 부르지 않고 <code>heading()</code> 을 부르면?', options: ['오류가 난다', '항상 0 이 나온다', '자동으로 보정 화면이 시작된다', '아무 일도 없다'], answer: 2,
            explain: 'micro:bit 가 <b>자동으로 보정 화면</b>을 띄웁니다. 사용자가 당황하지 않도록 프로그램 시작에서 직접 보정하는 것이 좋습니다.'
          },
          {
            q: '“북쪽 근처(±15°)” 를 판단하는 올바른 조건은?', options: ['<code>if h &lt; 15:</code>', '<code>if h &lt; 15 or h &gt; 345:</code>', '<code>if h &lt; 15 and h &gt; 345:</code>', '<code>if h == 0:</code>'], answer: 1,
            explain: '<b>0° 와 359° 는 이어져</b> 있으므로 양쪽 끝을 모두 확인해야 합니다. <code>and</code> 로 쓰면 절대 참이 될 수 없습니다.'
          },
          {
            q: '8방향으로 나눌 때 <code>(h + 22.5) // 45</code> 처럼 22.5 를 더하는 이유는?', options: ['오차를 줄이려고', '북쪽 범위가 337.5°~22.5° 라서 범위를 0~45 로 옮기려고', '소수를 없애려고', '이유 없다'], answer: 1,
            explain: '한 방향이 45° 이고 북은 0° 를 <b>가운데</b> 로 하므로 범위가 −22.5° ~ +22.5° 입니다. 22.5 를 더해야 경계가 맞습니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '나침반 센서와 보정', subtitle: 'Chapter 10 · 방향', badge: '1교시',
            notes: '<p>실제 보드가 있으면 교실에서 북쪽을 찾아보는 활동이 가능합니다. 스마트폰 나침반과 비교해 보세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'bullets', title: '지구는 커다란 자석',
            bullets: ['지구 내부 액체 철의 움직임 → 거대한 자기장', '나침반 바늘이 북쪽을 가리키는 이유', 'micro:bit 의 <b>지자기 센서</b>가 그 방향을 잼', '파이썬 이름: <code>compass</code>'],
            notes: '<p>과학 시간의 자기장 단원과 연결하면 좋습니다. 실물 나침반이 있으면 함께 보여 주세요.</p><p>시간: 6분</p>'
          },
          {
            layout: 'diagram', title: '방위각 (heading)', html: FIG_COMPASS, caption: '북 0° · 동 90° · 남 180° · 서 270°',
            notes: '<p>학생들이 직접 몸을 돌려 방향을 가리켜 보게 하면 기억에 잘 남습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'diagram', title: '보정 (calibrate)', html: FIG_CAL, caption: '전원을 켤 때마다 한 번 필요',
            notes: '<p>실제 보드에서 보정 게임을 한 번 해 보여 주세요. 학생들이 재미있어합니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '보정하고 읽기', code: 'from microbit import *\n\nif not compass.is_calibrated():\n    display.scroll("CAL", delay=60)\n    compass.calibrate()\n\nwhile True:\n    h = compass.heading()\n    print("방위각:", h)\n    sleep(500)',
            points: ['<code>calibrate()</code> 먼저!', '<code>is_calibrated()</code> 로 확인', '<b>0 ~ 359</b> 정수', '기준은 보드의 <b>위쪽(로고 쪽)</b>'],
            notes: '<p>보정을 빠뜨렸을 때 무슨 일이 생기는지도 보여 주면 좋습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '⚠ 0° 와 359° 는 이어져 있다', code: '# ✘ 틀린 방법\nif h < 15:\n    display.show(Image.YES)\n\n# ✔ 올바른 방법\nif h < 15 or h > 345:\n    display.show(Image.YES)',
            points: ['각도는 <b>둥글게 순환</b>합니다', '359° 다음이 0°', '양쪽 끝을 모두 확인', '<code>and</code> 를 쓰면 절대 참이 안 됨'],
            notes: '<p>시계의 12시와 같은 개념입니다. 아주 흔한 실수이니 꼭 짚어 주세요.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: '8방향으로 나누기', code: 'NAMES = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]\n\nh = compass.heading()\nindex = int((h + 22.5) // 45) % 8\ndisplay.show(NAMES[index][0])',
            points: ['한 방향 = 45°', '북은 337.5° ~ 22.5° (0° 가 가운데)', '22.5 를 더해 범위를 옮김', '<code>% 8</code> 로 360° 근처 처리'],
            notes: '<p>칠판에 원을 그리고 45도씩 나눠 보면 왜 22.5 를 더하는지 직관적으로 이해합니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'practice', title: '실습 10-1. 방위 표시기', desc: 'N · E · S · W 중 가장 가까운 방향을 표시하세요.',
            starter: 'from microbit import *\n\nNAMES = ["N", "E", "S", "W"]\ncompass.calibrate()\n\nwhile True:\n    h = compass.heading()\n    # TODO\n    sleep(300)\n',
            solution: 'from microbit import *\nimport music\n\nNAMES = ["N", "E", "S", "W"]\ncompass.calibrate()\nlast = ""\n\nwhile True:\n    h = compass.heading()\n    name = NAMES[int((h + 45) // 90) % 4]\n    display.show(name)\n    if name != last:\n        music.pitch(700, 80)\n        last = name\n    sleep(300)\n',
            notes: '<p>4방향은 45 를 더하고 90 으로 나눕니다. 8방향과 같은 원리임을 확인시켜 주세요.</p><p>시간: 10분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['<code>compass.heading()</code> → 0 ~ 359', '북 0 · 동 90 · 남 180 · 서 270', '<code>calibrate()</code> 먼저 · <code>is_calibrated()</code>', '0° 와 359° 는 이어져 있다', '8방향: <code>int((h + 22.5) // 45) % 8</code>'],
            notes: '<p>다음 시간 예고: 화살표로 북쪽을 가리키는 진짜 나침반 만들기.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch10-2',
        title: '나침반 만들기와 자기장 탐지',
        minutes: 45,
        goals: [
          '화살표로 북쪽을 가리키는 나침반을 만들 수 있다',
          'LED 하나로 방향을 가리키는 표현을 구현할 수 있다',
          '<code>get_field_strength()</code> 로 자기장 세기를 잴 수 있다',
          '나침반과 다른 센서를 결합한 프로젝트를 만들 수 있다'
        ],
        flow: [['화살표 나침반', 12], ['LED 나침반', 12], ['자기장 탐지', 12], ['프로젝트', 6], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '북쪽을 가리키는 나침반' },
          { type: 'p', html: '진짜 나침반은 <b>내가 어느 쪽을 보고 있든 바늘이 항상 북쪽</b>을 가리킵니다. micro:bit 로 만들려면 “북쪽이 <b>나를 기준으로</b> 어느 방향에 있는가” 를 계산해야 합니다.' },
          {
            type: 'figure', html: `<svg viewBox="0 0 1180 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="590" y="32" text-anchor="middle" font-size="23" font-weight="bold" fill="var(--fg)">내가 동쪽(90°)을 보고 있다면, 북쪽은 나의 <tspan fill="var(--accent)">왼쪽</tspan>에 있다</text>
  ${[[180, '내가 북(0°)을 봄', 0, '북쪽은 <tspan font-weight="bold">앞</tspan>'], [510, '내가 동(90°)을 봄', 270, '북쪽은 <tspan font-weight="bold">왼쪽</tspan>'], [840, '내가 남(180°)을 봄', 180, '북쪽은 <tspan font-weight="bold">뒤</tspan>']]
      .map(([cx, label, arrowDeg, desc]) => {
        const r = (arrowDeg - 90) * Math.PI / 180;
        return `<circle cx="${cx}" cy="150" r="66" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <line x1="${cx}" y1="150" x2="${(cx + Math.cos(r) * 52).toFixed(1)}" y2="${(150 + Math.sin(r) * 52).toFixed(1)}" stroke="var(--danger)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="${cx}" cy="150" r="8" fill="var(--fg)"/>
  <text x="${cx}" y="102" text-anchor="middle" font-size="16" fill="var(--muted)">보드 위쪽</text>
  <text x="${cx}" y="248" text-anchor="middle" font-size="18" font-weight="bold" fill="var(--fg)">${label}</text>
  <text x="${cx}" y="276" text-anchor="middle" font-size="17" fill="var(--muted)">${desc}</text>`;
      }).join('\n  ')}
  <text x="590" y="298" text-anchor="middle" font-size="17" fill="var(--accent)">화살표가 가리킬 각도 = (360 − heading) % 360</text>
</svg>`, caption: '그림 10-3. 북쪽이 나를 기준으로 어느 쪽인가'
          },
          {
            type: 'code', title: '예제 10-5. 화살표 나침반', code: `from microbit import *

ARROWS = [Image.ARROW_N, Image.ARROW_NE, Image.ARROW_E, Image.ARROW_SE,
          Image.ARROW_S, Image.ARROW_SW, Image.ARROW_W, Image.ARROW_NW]

compass.calibrate()
display.scroll("N", delay=60)

while True:
    h = compass.heading()
    # 북쪽이 나를 기준으로 있는 방향
    rel = (360 - h) % 360
    index = int((rel + 22.5) // 45) % 8
    display.show(ARROWS[index])
    sleep(200)`,
            hint: '🧭 센서 탭의 <b>방위각</b> 슬라이더를 돌리면 화살표가 반대로 돕니다 — 실제 나침반처럼요!',
            desc: '<code>(360 - h) % 360</code> 이 핵심입니다. 내가 오른쪽으로 돌면(h 증가) 북쪽은 나를 기준으로 <b>왼쪽</b>으로 돌아야 하므로 부호를 뒤집습니다.',
            expect: '보드를 돌리면 화살표가 계속 북쪽을 가리킵니다.'
          },
          { type: 'callout', kind: 'tip', title: '8방향이면 충분할까?', html: '화살표 이미지는 8가지뿐이라 45° 단위로만 표시됩니다. 더 부드럽게 하려면 <b>LED 하나</b>로 테두리를 도는 방식(다음 예제)을 쓰면 12~16단계까지 표현할 수 있습니다.' },

          { type: 'h', text: 'LED 하나로 가리키기' },
          {
            type: 'code', title: '예제 10-6. 테두리를 도는 나침반', code: `from microbit import *

# 테두리 12칸 (시계 방향, 맨 위 가운데부터)
RIM = [(2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3),
       (4, 4), (3, 4), (2, 4), (1, 4), (0, 4), (0, 3),
       (0, 2), (0, 1), (0, 0), (1, 0)]

compass.calibrate()

while True:
    h = compass.heading()
    rel = (360 - h) % 360
    # 16칸이므로 한 칸이 22.5도
    index = int((rel + 11.25) // 22.5) % len(RIM)

    display.clear()
    display.set_pixel(2, 2, 2)              # 중심
    x, y = RIM[index]
    display.set_pixel(x, y, 9)              # 북쪽 표시
    sleep(150)`,
            hint: '🧭 방위각 슬라이더를 천천히 돌려 점이 테두리를 도는 것을 보세요.',
            desc: '테두리 16칸을 리스트로 적어 두고 방위각에 맞는 칸을 켭니다. 한 칸이 <b>22.5°</b> 이므로 화살표보다 두 배 정밀합니다. 9장 실습에서 만든 레이더와 같은 구조입니다.',
            expect: '보드를 돌리면 테두리의 점이 북쪽 방향을 계속 가리킵니다.'
          },
          {
            type: 'code', title: '예제 10-7. 밝기로 정밀하게', code: `from microbit import *

RIM = [(2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3),
       (4, 4), (3, 4), (2, 4), (1, 4), (0, 4), (0, 3),
       (0, 2), (0, 1), (0, 0), (1, 0)]

compass.calibrate()

while True:
    h = compass.heading()
    rel = (360 - h) % 360
    pos = rel / 22.5                    # 실수로 (0.0 ~ 16.0)
    i = int(pos) % len(RIM)
    j = (i + 1) % len(RIM)
    frac = pos - int(pos)               # 사이의 위치 (0.0 ~ 1.0)

    display.clear()
    display.set_pixel(2, 2, 2)
    x1, y1 = RIM[i]
    x2, y2 = RIM[j]
    display.set_pixel(x1, y1, max(1, int(9 * (1 - frac))))
    display.set_pixel(x2, y2, max(1, int(9 * frac)))
    sleep(120)`,
            desc: '두 칸의 <b>밝기를 나눠</b> 그 사이의 위치를 표현합니다. 점이 칸에서 칸으로 부드럽게 넘어가는 것처럼 보입니다. 이런 기법을 <b>보간(interpolation)</b> 이라고 합니다.',
            expect: '점이 테두리를 부드럽게 이동하며 북쪽을 가리킵니다.'
          },

          { type: 'h', text: '자기장 세기 — 금속 탐지기' },
          { type: 'p', html: '<code>get_field_strength()</code> 는 주변 자기장의 <b>세기</b>를 나노테슬라(nT) 단위로 돌려줍니다. 자석이나 쇠붙이가 가까이 오면 값이 크게 변합니다.' },
          {
            type: 'code', title: '예제 10-8. 자기장 세기 보기', code: `from microbit import *

compass.calibrate()

while True:
    strength = compass.get_field_strength()
    print("자기장:", strength, "nT")

    # 지구 자기장은 약 50,000nT. 그보다 크면 자석이 가까이 있는 것
    level = min(4, abs(strength) // 25000)
    display.clear()
    for y in range(level + 1):
        for x in range(5):
            display.set_pixel(x, 4 - y, 9)
    sleep(200)`,
            desc: '지구 자기장은 대략 <b>25,000 ~ 65,000nT</b> 입니다. 자석을 가까이 대면 수십만 nT 까지 올라갑니다. 막대 높이로 세기를 표시했습니다.',
            expect: '자기장 세기가 막대로 표시됩니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 10-9. 금속 탐지기', code: `from microbit import *
import music

compass.calibrate()

# 지금 자리의 자기장을 '기준'으로 삼는다
display.scroll("SET", delay=60)
base = compass.get_field_strength()
display.show(Image.YES)
sleep(500)

while True:
    now = compass.get_field_strength()
    diff = abs(now - base)

    if diff > 20000:
        display.show(Image.SKULL)
        music.pitch(1200, 80)
    elif diff > 8000:
        display.show(Image.SQUARE)
        music.pitch(800, 60)
    elif diff > 3000:
        display.show(Image.SQUARE_SMALL)
        music.pitch(500, 50)
    else:
        display.show(Image.DIAMOND_SMALL)

    if button_a.was_pressed():        # 기준 다시 잡기
        base = compass.get_field_strength()
        display.show(Image.YES)
        sleep(400)

    sleep(150)`,
            desc: '처음 자리의 자기장을 <b>기준</b>으로 저장하고, 그 차이로 쇠붙이를 찾습니다. 차이가 클수록 큰 그림과 높은 소리가 납니다. 실제 보드를 냉장고 문이나 책상 다리에 가까이 대 보세요.',
            expect: '자석이나 쇠붙이가 가까워지면 그림이 커지고 소리가 높아집니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'board', title: '실제 보드에서 해 보기', html: '<p>냉장고 자석, 이어폰(안에 자석이 있습니다), 스피커, 쇠로 된 문고리 등에 micro:bit 를 가까이 대 보세요. 값이 크게 변합니다.</p><p>반대로 <b>보정할 때는 자석 · 노트북 · 스마트폰에서 멀리 떨어져</b> 있어야 정확합니다.</p>' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 두 방향 사이의 각도 구하기', code: `from microbit import *


def angle_between(a, b):
    """두 방위각 사이의 최소 차이 (0 ~ 180)"""
    return abs((a - b + 180) % 360 - 180)


def turn_dir(now, target):
    """어느 쪽으로 도는 게 빠를까 ('R' 또는 'L')"""
    return "R" if (target - now) % 360 < 180 else "L"


for now, target in [(10, 350), (350, 10), (0, 180), (90, 100), (270, 30)]:
    print(now, "→", target, ": 차이", angle_between(now, target),
          "도,", turn_dir(now, target), "쪽으로")

compass.calibrate()
target = 0

while True:
    h = compass.heading()
    d = angle_between(h, target)
    display.show(Image.YES if d < 15 else (Image.ARROW_E if turn_dir(h, target) == "R" else Image.ARROW_W))
    sleep(200)`,
            desc: '각도는 <b>360도에서 다시 0도로 이어지므로</b> 단순히 빼면 안 됩니다. <code>abs((a - b + 180) % 360 - 180)</code> 이 최소 차이를 구하는 표준 공식입니다. 10도와 350도의 차이는 340이 아니라 <b>20</b> 입니다.',
            expect: '10 → 350 : 차이 20 도, L 쪽으로\n350 → 10 : 차이 20 도, R 쪽으로'
          },
          {
            type: 'code', title: '더 해 보기 ②. 온 길을 되짚어 가기', code: `from microbit import *
import music

compass.calibrate()
saved = None

display.show(Image.SQUARE_SMALL)

while True:
    h = compass.heading()

    # A: 지금 방향을 기억
    if button_a.was_pressed():
        saved = h
        display.show(Image.YES)
        music.pitch(880, 120)
        print("기억한 방향:", saved, "도 / 되돌아갈 방향:", (saved + 180) % 360)
        sleep(500)

    if saved is None:
        display.show(Image.SQUARE_SMALL)
    else:
        back = (saved + 180) % 360        # 정반대 방향
        diff = abs((back - h + 180) % 360 - 180)
        if diff < 15:
            display.show(Image.YES)
        elif (back - h) % 360 < 180:
            display.show(Image.ARROW_E)
        else:
            display.show(Image.ARROW_W)

    sleep(150)`,
            hint: '🧭 방위각을 정한 뒤 A 를 누르고, 슬라이더를 돌려 반대 방향을 찾아보세요.',
            desc: '출발할 때 방향을 기억해 두면 <b>정반대 방향(+180도)</b>이 돌아가는 길입니다. 숲이나 넓은 곳에서 길을 잃지 않게 해 주는 간단한 방법입니다.',
            expect: 'A 로 방향을 기억하면, 반대 방향을 향할 때 체크가 뜹니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. 얼마나 빨리 돌고 있나', code: `from microbit import *

compass.calibrate()
prev = compass.heading()
prev_t = running_time()

while True:
    h = compass.heading()
    t = running_time()

    # 각도 변화량 (-180 ~ 180)
    delta = (h - prev + 180) % 360 - 180
    dt = max(1, t - prev_t)
    speed = abs(delta) * 1000 // dt          # 초당 몇 도

    if speed > 5:
        print("회전 속도:", speed, "도/초", "(" + ("오른쪽" if delta > 0 else "왼쪽") + ")")

    level = min(4, speed // 60)
    display.clear()
    for y in range(level + 1):
        for x in range(5):
            display.set_pixel(x, 4 - y, 9)

    prev, prev_t = h, t
    sleep(120)`,
            hint: '🧭 방위각 슬라이더를 빠르게 움직여 보세요.',
            desc: '방위각의 <b>변화량 ÷ 걸린 시간</b>이 회전 속도입니다. 각도가 순환하므로 여기서도 <code>(차이 + 180) % 360 - 180</code> 공식을 씁니다. 자이로스코프 없이 회전을 재는 방법입니다.',
            expect: '회전 속도: 120 도/초 (오른쪽)',
            nondeterministic: true
          },

          { type: 'h', text: '🚀 응용 예제 — 방향으로 만드는 도구' },
          { type: 'p', html: '나침반은 야외 활동과 탐사에 쓰는 도구입니다. 실제 보드를 들고 운동장이나 복도에서 해 보면 훨씬 재미있습니다.' },
          {
            type: 'code', title: '응용 예제 10-1. 디지털 나침반 완성판', code: `from microbit import *

RIM = [(2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3),
       (4, 4), (3, 4), (2, 4), (1, 4), (0, 4), (0, 3),
       (0, 2), (0, 1), (0, 0), (1, 0)]
NAMES = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

if not compass.is_calibrated():
    display.scroll("CAL", delay=60)
    compass.calibrate()

display.scroll("N", delay=70)

while True:
    h = compass.heading()
    rel = (360 - h) % 360

    # 두 칸의 밝기를 나눠 부드럽게 표시
    pos = rel / 22.5
    i = int(pos) % len(RIM)
    j = (i + 1) % len(RIM)
    frac = pos - int(pos)

    display.clear()
    display.set_pixel(2, 2, 2)
    x1, y1 = RIM[i]
    x2, y2 = RIM[j]
    display.set_pixel(x1, y1, max(1, int(9 * (1 - frac))))
    display.set_pixel(x2, y2, max(1, int(9 * frac)))

    # A: 각도 숫자 보기 / B: 방위 이름 보기
    if button_a.was_pressed():
        display.scroll(str(h), delay=80)
    if button_b.was_pressed():
        display.scroll(NAMES[int((h + 22.5) // 45) % 8], delay=80)

    sleep(100)`,
            hint: '🧭 방위각 슬라이더를 돌리면 점이 계속 북쪽을 가리킵니다.',
            desc: '테두리 점이 <b>항상 북쪽</b>을 가리키고, 두 칸의 밝기를 나눠 부드럽게 움직입니다. A 로 각도(0~359), B 로 방위 이름을 확인할 수 있습니다. 그대로 실제 보드에 올려 쓸 수 있습니다.',
            expect: '보드를 돌려도 점이 북쪽을 가리키고, A · B 로 각도와 방위를 봅니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 10-2. 목적지 안내기', code: `from microbit import *
import music

if not compass.is_calibrated():
    compass.calibrate()

target = None
display.show(Image.SQUARE_SMALL)

while True:
    h = compass.heading()

    # A: 지금 보고 있는 쪽을 목적지로 설정
    if button_a.was_pressed():
        target = h
        display.show(Image.YES)
        music.pitch(880, 120)
        print("목적지 방향:", target, "도")
        sleep(500)

    # B: 목적지 해제
    if button_b.was_pressed():
        target = None
        display.show(Image.NO)
        sleep(400)

    if target is None:
        display.show(Image.SQUARE_SMALL)
    else:
        diff = (target - h) % 360
        off = abs((diff + 180) % 360 - 180)

        if off < 12:
            display.show(Image.HEART)
            music.pitch(1100, 50)
        elif off < 45:
            display.show(Image.ARROW_NE if diff < 180 else Image.ARROW_NW)
        elif diff < 180:
            display.show(Image.ARROW_E)
        else:
            display.show(Image.ARROW_W)

    sleep(150)`,
            desc: 'A 로 목적지 방향을 기억한 뒤, 그 방향을 향할 때까지 <b>좌 · 우 · 비스듬히</b> 안내합니다. 가까워질수록 화살표가 대각선으로 바뀌어 미세 조정을 돕습니다.',
            expect: '목적지를 설정하면 그 방향으로 화살표가 안내합니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 10-3. 숨은 자석 찾기 게임', code: `from microbit import *
import music

if not compass.is_calibrated():
    compass.calibrate()

display.scroll("FIND", delay=60)
base = compass.get_field_strength()
print("기준 자기장:", base, "nT")
found = 0
last_beep = 0

display.show(Image.DIAMOND_SMALL)

while True:
    now = compass.get_field_strength()
    diff = abs(now - base)

    # 차이가 클수록 삐 소리가 빨라지고 화면이 커진다
    if diff > 2500:
        level = min(4, diff // 6000)
        pics = [Image.DIAMOND_SMALL, Image.DIAMOND, Image.SQUARE_SMALL,
                Image.SQUARE, Image.SKULL]
        display.show(pics[level])

        gap = max(80, 700 - level * 150)
        if running_time() - last_beep > gap:
            music.pitch(600 + level * 250, 50)
            last_beep = running_time()

        if level >= 4:
            found = found + 1
            display.show(Image.HEART)
            music.play(music.POWER_UP)
            print("찾았다!", found, "개 / 세기", diff)
            sleep(1200)
            display.show(Image.DIAMOND_SMALL)
    else:
        display.show(Image.DIAMOND_SMALL)

    # A: 기준값 다시 잡기
    if button_a.was_pressed():
        base = compass.get_field_strength()
        display.show(Image.YES)
        print("기준 재설정:", base)
        sleep(400)

    sleep(80)`,
            desc: '방 안 여러 곳에 자석을 숨기고 찾는 게임입니다. 가까워질수록 <b>소리가 빨라지고 그림이 커집니다</b>. 실제 보드로 냉장고 문, 이어폰, 스피커에 가까이 대 보세요.',
            expect: '자석이 가까워지면 소리가 빨라지고, 아주 가까우면 하트가 나옵니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 10-4. 몇 바퀴 돌았나 (회전 각도계)', code: `from microbit import *
import music

if not compass.is_calibrated():
    compass.calibrate()

prev = compass.heading()
total = 0                 # 누적 회전 각도 (양수 = 오른쪽)

display.show(0)

while True:
    h = compass.heading()
    delta = (h - prev + 180) % 360 - 180

    # 튀는 값은 무시 (한 번에 90도 넘게 돌 수는 없다고 본다)
    if abs(delta) < 90:
        total = total + delta
    prev = h

    turns = int(abs(total) // 360)
    display.show(turns % 10)

    if button_a.was_pressed():
        print("누적:", int(total), "도 =", round(total / 360, 2), "바퀴")
        display.scroll(str(int(total)), delay=80)
        display.show(turns % 10)

    if button_b.was_pressed():
        total = 0
        display.show(Image.NO)
        music.pitch(400, 120)
        sleep(400)
        display.show(0)

    sleep(80)`,
            hint: '🧭 방위각 슬라이더를 0 → 359 로 여러 번 돌려 보세요.',
            desc: '각도 변화를 <b>계속 더해</b> 몇 바퀴 돌았는지 셉니다. 한 번에 90도 넘게 변하면 센서가 튄 것으로 보고 무시합니다. 회전하는 장치의 회전수를 세는 데 쓸 수 있습니다.',
            expect: '누적: 735 도 = 2.04 바퀴',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 10-5. 야외 활동 만능 도구', code: `from microbit import *

RIM = [(2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3),
       (4, 4), (3, 4), (2, 4), (1, 4), (0, 4), (0, 3),
       (0, 2), (0, 1), (0, 0), (1, 0)]
MODES = ["COMPASS", "LEVEL", "TEMP"]
mode = 0

if not compass.is_calibrated():
    display.scroll("CAL", delay=60)
    compass.calibrate()
display.scroll(MODES[mode], delay=60)


def show_compass():
    rel = (360 - compass.heading()) % 360
    i = int((rel + 11.25) // 22.5) % len(RIM)
    display.clear()
    display.set_pixel(2, 2, 2)
    x, y = RIM[i]
    display.set_pixel(x, y, 9)


def show_level():
    x = accelerometer.get_x()
    y = accelerometer.get_y()
    if abs(x) < 60 and abs(y) < 60:
        display.show(Image.YES)
    else:
        display.clear()
        display.set_pixel(2, 2, 2)
        display.set_pixel(scale(x, from_=(-1024, 1024), to=(0, 4)),
                          scale(y, from_=(-1024, 1024), to=(0, 4)), 9)


while True:
    if accelerometer.is_gesture("face down"):
        display.off()
        sleep(300)
        continue
    display.on()

    if button_a.was_pressed():
        mode = (mode + 1) % len(MODES)
        display.scroll(MODES[mode], delay=55)

    if mode == 0:
        show_compass()
    elif mode == 1:
        show_level()
    else:
        display.show(str(temperature())[0])

    if button_b.was_pressed():
        if mode == 0:
            display.scroll(str(compass.heading()), delay=80)
        elif mode == 2:
            display.scroll(str(temperature()) + "C", delay=80)

    sleep(120)`,
            desc: '<b>나침반 · 수평계 · 온도계</b>를 한 프로그램에 담았습니다. A 로 기능을 바꾸고 B 로 자세한 값을 보며, 엎어 두면 화면을 꺼 전력을 아낍니다. 실제 보드에 올려 야외 활동에 써 보세요.',
            expect: 'A 로 COMPASS → LEVEL → TEMP 로 바뀝니다.',
            nondeterministic: true
          },

          { type: 'h', text: '2교시 · 10장 요약' },
          {
            type: 'list', items: [
              '나침반 화살표가 가리킬 방향 = <code>(360 - heading()) % 360</code> — 내가 돌면 바늘은 <b>반대로</b> 돕니다.',
              '테두리 16칸에 LED 하나를 켜면 22.5° 단위로 더 정밀하게 가리킬 수 있습니다.',
              '두 칸의 <b>밝기를 나누면</b>(보간) 더 부드럽게 보입니다.',
              '<code>get_field_strength()</code> 는 자기장 세기(nT). 지구 자기장은 약 <b>25,000 ~ 65,000nT</b>.',
              '기준값과의 <b>차이</b>를 보면 금속 탐지기를 만들 수 있습니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 10-3. 보물찾기',
            level: 2,
            desc: '<p>정해진 방향(예: 북동쪽 45°)을 향할 때만 <b>보물</b>이 나타나는 게임을 만드세요.</p><ul><li>시작할 때 목표 방향을 무작위로 정합니다 (<code>random.randint(0, 359)</code>)</li><li>목표에 가까울수록 <b>화면이 밝아지고 소리가 높아집니다</b> (뜨겁다/차갑다 게임)</li><li>±10° 안에 들어오면 <code>Image.HEART</code> 와 축하 소리, 새 목표를 정합니다</li><li>찾은 횟수를 콘솔에 기록합니다</li></ul>',
            hint: '차이는 <code>diff = abs((target - h + 180) % 360 - 180)</code> 으로 구하면 0~180 사이가 됩니다. 이 값을 <code>scale()</code> 로 밝기 · 주파수로 바꾸세요.',
            starter: 'from microbit import *\nimport random\nimport music\n\ncompass.calibrate()\ntarget = random.randint(0, 359)\nfound = 0\n\nwhile True:\n    h = compass.heading()\n    # TODO\n    sleep(200)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\ncompass.calibrate()\ntarget = random.randint(0, 359)\nfound = 0\nfull = Image("99999:99999:99999:99999:99999")\n\nwhile True:\n    h = compass.heading()\n    diff = abs((target - h + 180) % 360 - 180)     # 0 ~ 180\n\n    if diff <= 10:\n        found = found + 1\n        display.show(Image.HEART)\n        music.play(music.POWER_UP)\n        print("찾음!", found, "개 / 목표였던 방향", target)\n        sleep(600)\n        target = random.randint(0, 359)\n        display.scroll("NEXT", delay=60)\n    else:\n        b = scale(180 - diff, from_=(0, 180), to=(0.0, 1.0))\n        display.show(full * b)\n        hz = scale(180 - diff, from_=(0, 180), to=(200, 1200))\n        music.pitch(hz, 60)\n\n    sleep(200)\n'
          },
          {
            title: '실습 10-4. 도전! 디지털 나침반 시계',
            level: 3,
            desc: '<p>나침반과 다른 기능을 합친 <b>야외 활동용 도구</b>를 만드세요.</p><ul><li>기본 화면: 테두리 LED 로 북쪽 표시 (예제 10-6)</li><li>A 를 누르면 <b>방위각 숫자</b>를 흘려보냅니다 (예: <code>128</code>)</li><li>B 를 누르면 <b>온도</b>를 흘려보냅니다</li><li>흔들면 <b>자기장 세기</b>를 막대로 3초간 보여 줍니다</li><li>엎어 놓으면 화면을 꺼 절전합니다</li></ul>',
            hint: '각 기능을 <code>def</code> 함수로 나누면 코드가 정리됩니다. 화면을 잠깐 바꿨다가 기본 화면으로 돌아오는 구조로 만드세요.',
            starter: 'from microbit import *\n\nRIM = [(2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3),\n       (4, 4), (3, 4), (2, 4), (1, 4), (0, 4), (0, 3),\n       (0, 2), (0, 1), (0, 0), (1, 0)]\n\ncompass.calibrate()\n\n\ndef show_compass():\n    h = compass.heading()\n    rel = (360 - h) % 360\n    i = int((rel + 11.25) // 22.5) % len(RIM)\n    display.clear()\n    display.set_pixel(2, 2, 2)\n    x, y = RIM[i]\n    display.set_pixel(x, y, 9)\n\n\nwhile True:\n    show_compass()\n    # TODO: A / B / 흔들기 / 엎기\n    sleep(150)\n',
            solution: 'from microbit import *\n\nRIM = [(2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3),\n       (4, 4), (3, 4), (2, 4), (1, 4), (0, 4), (0, 3),\n       (0, 2), (0, 1), (0, 0), (1, 0)]\n\ncompass.calibrate()\n\n\ndef show_compass():\n    h = compass.heading()\n    rel = (360 - h) % 360\n    i = int((rel + 11.25) // 22.5) % len(RIM)\n    display.clear()\n    display.set_pixel(2, 2, 2)\n    x, y = RIM[i]\n    display.set_pixel(x, y, 9)\n\n\ndef show_field():\n    t0 = running_time()\n    while running_time() - t0 < 3000:\n        s = compass.get_field_strength()\n        level = min(4, abs(s) // 25000)\n        display.clear()\n        for y in range(level + 1):\n            for x in range(5):\n                display.set_pixel(x, 4 - y, 9)\n        sleep(150)\n\n\nwhile True:\n    if accelerometer.is_gesture("face down"):\n        display.off()\n        sleep(300)\n        continue\n    display.on()\n\n    show_compass()\n\n    if button_a.was_pressed():\n        display.scroll(str(compass.heading()), delay=80)\n    if button_b.was_pressed():\n        display.scroll(str(temperature()) + "C", delay=80)\n    if accelerometer.was_gesture("shake"):\n        show_field()\n\n    sleep(150)\n'
          }
        ],
        quiz: [
          {
            q: '나침반 화살표가 가리킬 방향을 구하는 식은?', options: ['<code>heading()</code>', '<code>(360 - heading()) % 360</code>', '<code>heading() + 180</code>', '<code>heading() // 45</code>'], answer: 1,
            explain: '내가 오른쪽으로 돌면 북쪽은 나를 기준으로 <b>왼쪽</b>으로 가므로 부호를 뒤집어야 합니다.'
          },
          {
            q: '지구 자기장의 세기는 대략 얼마인가요?', options: ['약 500nT', '약 5,000nT', '약 50,000nT', '약 5,000,000nT'], answer: 2,
            explain: '대략 <b>25,000 ~ 65,000nT</b> 입니다. 자석을 가까이 대면 수십만 nT 까지 올라갑니다.'
          },
          {
            q: '두 방위각 사이의 <b>최소 차이</b>(0~180)를 구하는 식은?', options: ['<code>abs(a - b)</code>', '<code>abs((a - b + 180) % 360 - 180)</code>', '<code>(a - b) % 360</code>', '<code>a - b</code>'], answer: 1,
            explain: '각도는 순환하므로 350° 와 10° 의 차이는 340 이 아니라 <b>20</b> 입니다. 180 을 더하고 360 으로 나눈 뒤 다시 180 을 빼면 −180~180 이 되고, 절댓값을 씌우면 0~180 이 됩니다.'
          },
          {
            q: '테두리 16칸으로 방향을 표시하면 한 칸이 몇 도인가요?', options: ['45°', '30°', '22.5°', '15°'], answer: 2,
            explain: '360 ÷ 16 = <b>22.5°</b> 입니다. 화살표 8방향(45°)보다 두 배 정밀합니다.'
          },
          {
            q: '나침반을 보정할 때 주의할 점은?', options: ['어두운 곳에서 해야 한다', '자석 · 노트북 · 스마트폰에서 멀리 떨어져야 한다', 'USB 를 뽑아야 한다', '버튼을 누르고 있어야 한다'], answer: 1,
            explain: '주변의 자기장이 보정을 방해합니다. <b>금속과 전자 기기에서 떨어진 곳</b>에서 보정하세요.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '나침반 만들기와 자기장 탐지', subtitle: 'Chapter 10 · 방향', badge: '2교시',
            notes: '<p>실물 보드와 자석을 준비하면 금속 탐지기 실습이 훨씬 즐겁습니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'diagram', title: '북쪽은 나를 기준으로 어디?', html: `<svg viewBox="0 0 1180 280" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  ${[[180, '내가 북(0°)을 봄', 0, '북쪽은 앞'], [510, '내가 동(90°)을 봄', 270, '북쪽은 왼쪽'], [840, '내가 남(180°)을 봄', 180, '북쪽은 뒤']]
                .map(([cx, label, arrowDeg, desc]) => {
                  const r = (arrowDeg - 90) * Math.PI / 180;
                  return `<circle cx="${cx}" cy="130" r="64" fill="var(--card)" stroke="var(--line)" stroke-width="3"/>
  <line x1="${cx}" y1="130" x2="${(cx + Math.cos(r) * 50).toFixed(1)}" y2="${(130 + Math.sin(r) * 50).toFixed(1)}" stroke="var(--danger)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="${cx}" cy="130" r="8" fill="var(--fg)"/>
  <text x="${cx}" y="226" text-anchor="middle" font-size="18" font-weight="bold" fill="var(--fg)">${label}</text>
  <text x="${cx}" y="254" text-anchor="middle" font-size="17" fill="var(--muted)">${desc}</text>`;
                }).join('\n  ')}
  <text x="590" y="42" text-anchor="middle" font-size="21" font-weight="bold" fill="var(--accent)">화살표 각도 = (360 − heading) % 360</text>
</svg>`, caption: '내가 돌면 바늘은 반대로 돕니다',
            notes: '<p>학생들이 직접 몸을 돌리며 손으로 북쪽을 가리켜 보게 하면 금방 이해합니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '화살표 나침반', code: 'from microbit import *\n\nARROWS = [Image.ARROW_N, Image.ARROW_NE, Image.ARROW_E, Image.ARROW_SE,\n          Image.ARROW_S, Image.ARROW_SW, Image.ARROW_W, Image.ARROW_NW]\n\ncompass.calibrate()\n\nwhile True:\n    h = compass.heading()\n    rel = (360 - h) % 360\n    display.show(ARROWS[int((rel + 22.5) // 45) % 8])\n    sleep(200)',
            points: ['<code>(360 - h) % 360</code> 이 핵심', '8방향 = 45° 단위', '보드를 돌리면 화살표가 반대로', '진짜 나침반처럼 동작'],
            notes: '<p>실물 보드로 교실 안에서 북쪽을 찾아보게 하면 좋습니다. 스마트폰 나침반과 비교해 보세요.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: 'LED 하나로 더 정밀하게', code: 'RIM = [(2,0), (3,0), (4,0), (4,1), (4,2), (4,3),\n       (4,4), (3,4), (2,4), (1,4), (0,4), (0,3),\n       (0,2), (0,1), (0,0), (1,0)]\n\nrel = (360 - compass.heading()) % 360\ni = int((rel + 11.25) // 22.5) % len(RIM)\n\ndisplay.clear()\ndisplay.set_pixel(2, 2, 2)\nx, y = RIM[i]\ndisplay.set_pixel(x, y, 9)',
            points: ['테두리 16칸 = 한 칸 <b>22.5°</b>', '화살표보다 두 배 정밀', '9장 레이더와 같은 구조', '밝기를 나누면 더 부드럽게'],
            notes: '<p>좌표 리스트를 직접 만들어 보게 해도 좋은 연습이 됩니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '금속 탐지기', code: 'base = compass.get_field_strength()   # 기준 저장\n\nwhile True:\n    diff = abs(compass.get_field_strength() - base)\n    if diff > 20000:\n        display.show(Image.SKULL)\n        music.pitch(1200, 80)\n    elif diff > 8000:\n        display.show(Image.SQUARE)\n        music.pitch(800, 60)\n    else:\n        display.show(Image.DIAMOND_SMALL)\n    sleep(150)',
            points: ['지구 자기장 ≈ 25,000 ~ 65,000nT', '기준값과의 <b>차이</b>로 판단', '자석 · 이어폰 · 문고리로 실험', '보정할 때는 금속에서 멀리'],
            notes: '<p>냉장고 자석이나 이어폰을 준비해 학생들이 직접 찾아보게 하세요. 반응이 아주 좋습니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'practice', title: '실습 10-3. 보물찾기', desc: '무작위 방향을 향하면 화면이 밝아지고 소리가 높아집니다.',
            starter: 'from microbit import *\nimport random\nimport music\n\ncompass.calibrate()\ntarget = random.randint(0, 359)\n\nwhile True:\n    h = compass.heading()\n    # TODO\n    sleep(200)\n',
            solution: 'from microbit import *\nimport random\nimport music\n\ncompass.calibrate()\ntarget = random.randint(0, 359)\nfull = Image("99999:99999:99999:99999:99999")\n\nwhile True:\n    h = compass.heading()\n    diff = abs((target - h + 180) % 360 - 180)\n\n    if diff <= 10:\n        display.show(Image.HEART)\n        music.play(music.POWER_UP)\n        sleep(600)\n        target = random.randint(0, 359)\n    else:\n        b = scale(180 - diff, from_=(0, 180), to=(0.0, 1.0))\n        display.show(full * b)\n        music.pitch(scale(180 - diff, from_=(0, 180), to=(200, 1200)), 60)\n    sleep(200)\n',
            notes: '<p>각도 차이 공식 <code>abs((a-b+180) % 360 - 180)</code> 은 자주 쓰이니 꼭 설명하세요. 순환하는 값의 거리 계산입니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '10장 정리', bullets: ['<code>compass.heading()</code> 0~359 · <code>calibrate()</code> 필수', '화살표 방향 = <code>(360 - h) % 360</code>', '테두리 16칸 = 22.5° 단위', '<code>get_field_strength()</code> 로 금속 탐지', '각도 차이 = <code>abs((a-b+180) % 360 - 180)</code>'],
            notes: '<p>10장 정리. 다음 장 예고: 저장 — 전원을 꺼도 사라지지 않는 데이터.</p><p>과제: 실습 10-4 만능 도구 완성하기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
