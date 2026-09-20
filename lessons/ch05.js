/* Chapter 05. 입출력 핀 — 바깥 세상과 연결
 * 원본: MicroPython on the BBC micro:bit — Input/Output Pins
 */
(function () {
  /* 보드를 그림 안에 놓는 위치 (보드 좌표 → 그림 좌표) */
  const EBX = 412, EBY = 34;
  const EP = (name) => [MB_FIG.ANCHOR.pad(name)[0] + EBX, MB_FIG.BOT + EBY];

  const FIG_EDGE = `<svg viewBox="0 0 1280 570" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="30" text-anchor="middle" font-size="26" font-weight="bold" fill="var(--fg)">엣지 커넥터 — micro:bit 가 바깥 세상과 만나는 곳</text>
  ${MB_FIG.board({ x: EBX, y: EBY, leds: '0000001110011100111000000' })}
  <!-- 커넥터 영역 강조 -->
  <rect x="${EBX + 34}" y="${EBY + 288}" width="392" height="${MB_FIG.BOT - 288 + 6}" rx="8" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="8 6"/>
  <!-- 설명 상자로 이어지는 선 -->
  ${[['0', 300], ['1', 300], ['2', 300], ['3V', 680], ['GND', 1030]].map(([n, tx]) => {
      const [x, y] = EP(n);
      return `<path d="M${x} ${y} L${x} ${y + 34} L${tx} 452" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-dasharray="6 5"/>`;
    }).join('\n  ')}
  <rect x="100" y="452" width="400" height="104" rx="12" fill="var(--ok)" opacity=".13" stroke="var(--ok)" stroke-width="3"/>
  <text x="300" y="486" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--ok)">0 · 1 · 2</text>
  <text x="300" y="516" text-anchor="middle" font-size="18" fill="var(--fg)">디지털 · 아날로그 · 터치</text>
  <text x="300" y="542" text-anchor="middle" font-size="17" fill="var(--muted)">입력과 출력 모두 가능</text>
  <rect x="530" y="452" width="300" height="104" rx="12" fill="var(--danger)" opacity=".13" stroke="var(--danger)" stroke-width="3"/>
  <text x="680" y="486" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--danger)">3V</text>
  <text x="680" y="516" text-anchor="middle" font-size="18" fill="var(--fg)">전원 (+3.3V)</text>
  <text x="680" y="542" text-anchor="middle" font-size="17" fill="var(--muted)">부품에 전기를 공급</text>
  <rect x="860" y="452" width="340" height="104" rx="12" fill="var(--muted)" opacity=".18" stroke="var(--muted)" stroke-width="3"/>
  <text x="1030" y="486" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--fg)">GND</text>
  <text x="1030" y="516" text-anchor="middle" font-size="18" fill="var(--fg)">접지 (0V)</text>
  <text x="1030" y="542" text-anchor="middle" font-size="17" fill="var(--muted)">전기가 돌아오는 길</text>
  <text x="140" y="120" font-size="21" fill="var(--fg)">보드 <tspan font-weight="bold">아래쪽 가장자리</tspan>의</text>
  <text x="140" y="154" font-size="21" fill="var(--fg)">금색 단자가 엣지 커넥터입니다.</text>
  <text x="140" y="206" font-size="19" fill="var(--muted)">넓은 단자 <tspan font-weight="bold" fill="var(--fg)">5개</tspan>는 구멍이 뚫려 있어</text>
  <text x="140" y="236" font-size="19" fill="var(--muted)"><tspan font-weight="bold" fill="var(--fg)">악어클립</tspan>으로 집을 수 있습니다.</text>
  <text x="140" y="288" font-size="19" fill="var(--muted)">좁은 단자는 확장 보드를</text>
  <text x="140" y="318" font-size="19" fill="var(--muted)">끼워야 쓸 수 있습니다.</text>
</svg>`;

  const FIG_LED = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="36" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">LED 연결 — 전류는 핀 → 저항 → LED → GND 로 흐른다</text>
  <rect x="80" y="110" width="200" height="150" rx="14" fill="#0e6b64"/>
  <text x="180" y="170" text-anchor="middle" font-size="20" fill="#9fd8d3">micro:bit</text>
  <rect x="240" y="150" width="40" height="26" rx="3" fill="#e0b526"/><text x="260" y="200" text-anchor="middle" font-size="18" font-weight="bold" fill="var(--fg)">P0</text>
  <rect x="240" y="212" width="40" height="26" rx="3" fill="#e0b526"/><text x="260" y="262" text-anchor="middle" font-size="18" font-weight="bold" fill="var(--fg)">GND</text>
  <!-- 저항 -->
  <line x1="280" y1="163" x2="400" y2="163" stroke="var(--fg)" stroke-width="4"/>
  <rect x="400" y="145" width="110" height="36" rx="5" fill="var(--card2)" stroke="var(--fg)" stroke-width="3"/>
  <text x="455" y="170" text-anchor="middle" font-size="17" fill="var(--fg)">220Ω</text>
  <text x="455" y="128" text-anchor="middle" font-size="16" fill="var(--muted)">저항</text>
  <line x1="510" y1="163" x2="640" y2="163" stroke="var(--fg)" stroke-width="4"/>
  <!-- LED -->
  <polygon points="640,143 640,183 685,163" fill="#ff4b3e" stroke="var(--fg)" stroke-width="3"/>
  <line x1="685" y1="141" x2="685" y2="185" stroke="var(--fg)" stroke-width="4"/>
  <text x="662" y="122" text-anchor="middle" font-size="16" fill="var(--muted)">긴 다리 (+)</text>
  <text x="700" y="122" text-anchor="start" font-size="16" fill="var(--muted)">짧은 다리 (−)</text>
  <path d="M700 135 L714 121 M706 133 L720 119" stroke="#ff4b3e" stroke-width="3"/>
  <line x1="685" y1="163" x2="860" y2="163" stroke="var(--fg)" stroke-width="4"/>
  <line x1="860" y1="163" x2="860" y2="225" stroke="var(--fg)" stroke-width="4"/>
  <line x1="860" y1="225" x2="280" y2="225" stroke="var(--fg)" stroke-width="4"/>
  <text x="570" y="248" text-anchor="middle" font-size="18" fill="var(--muted)">전류가 돌아오는 길 (GND)</text>
  <rect x="930" y="110" width="300" height="150" rx="12" fill="var(--warn)" opacity=".13" stroke="var(--warn)" stroke-width="3"/>
  <text x="1080" y="145" text-anchor="middle" font-size="19" font-weight="bold" fill="var(--warn)">⚠ 저항을 꼭 넣으세요</text>
  <text x="1080" y="178" text-anchor="middle" font-size="17" fill="var(--fg)">저항이 없으면 전류가 너무 많이</text>
  <text x="1080" y="202" text-anchor="middle" font-size="17" fill="var(--fg)">흘러 LED 나 보드가 망가집니다.</text>
  <text x="1080" y="236" text-anchor="middle" font-size="17" fill="var(--muted)">보통 220Ω ~ 470Ω 을 씁니다.</text>
  <text x="640" y="320" text-anchor="middle" font-size="21" fill="var(--fg)">pin0.write_digital(<tspan font-weight="bold" fill="var(--ok)">1</tspan>) → P0 에 <tspan font-weight="bold">3.3V</tspan> 가 나옴 → LED 켜짐</text>
  <text x="640" y="356" text-anchor="middle" font-size="21" fill="var(--fg)">pin0.write_digital(<tspan font-weight="bold" fill="var(--danger)">0</tspan>) → P0 이 <tspan font-weight="bold">0V</tspan> 가 됨 → LED 꺼짐</text>
</svg>`;

  const FIG_PWM = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">PWM — 아주 빠르게 켰다 껐다 해서 '중간 밝기'를 만든다</text>
  ${[['write_analog(1023)', '항상 켜짐 (100%)', 1.0, 'var(--ok)'], ['write_analog(512)', '절반 (50%)', 0.5, 'var(--accent)'], ['write_analog(128)', '조금 (12%)', 0.125, 'var(--accent2)']]
      .map(([label, desc, duty, color], i) => {
        const y = 80 + i * 110;
        let path = `M120,${y + 60} `;
        for (let k = 0; k < 6; k++) {
          const x0 = 120 + k * 110, on = 110 * duty;
          path += `L${x0},${y + 10} L${x0 + on},${y + 10} L${x0 + on},${y + 60} L${x0 + 110},${y + 60} `;
        }
        return `<text x="110" y="${y + 6}" text-anchor="end" font-size="17" font-family="monospace" fill="${color}">${label}</text>
  <text x="110" y="${y + 32}" text-anchor="end" font-size="16" fill="var(--muted)">${desc}</text>
  <line x1="120" y1="${y + 60}" x2="790" y2="${y + 60}" stroke="var(--line)" stroke-width="2"/>
  <path d="${path}" fill="none" stroke="${color}" stroke-width="3.5"/>
  <rect x="830" y="${y + 6}" width="80" height="60" rx="10" fill="#ff4b3e" opacity="${(0.12 + duty * 0.88).toFixed(2)}"/>
  <text x="940" y="${y + 44}" font-size="18" fill="var(--fg)">LED 밝기</text>`;
      }).join('\n  ')}
  <text x="640" y="400" text-anchor="middle" font-size="19" fill="var(--muted)">켜져 있는 시간의 비율을 <tspan font-weight="bold" fill="var(--fg)">듀티 비(duty cycle)</tspan> 라고 합니다. 0 ~ 1023 으로 지정합니다.</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch05',
    no: '05',
    title: '입출력 핀 — 바깥 세상과 연결',
    subtitle: '디지털 · 아날로그 · PWM · 터치 · 부품 연결',
    summary: 'micro:bit 아래쪽 엣지 커넥터에 LED · 버튼 · 가변저항 · 부저 · 서보 모터 같은 부품을 연결해 진짜 전자 장치를 만듭니다. 켜짐/꺼짐만 다루는 디지털 입출력, 0~1023 의 값을 다루는 아날로그 입력, 빠른 깜빡임으로 중간값을 만드는 PWM 출력을 배우고, 각 핀이 어떤 일을 할 수 있는지 익힙니다.',
    goals: [
      '엣지 커넥터의 핀 구성(0·1·2 · 3V · GND)과 역할을 설명할 수 있다',
      '<code>write_digital()</code> · <code>read_digital()</code> 로 LED 와 버튼을 다룰 수 있다',
      '<code>read_analog()</code> 로 가변저항 · 센서 값을 읽을 수 있다',
      '<code>write_analog()</code> 와 PWM 으로 밝기 · 속도 · 서보 각도를 조절할 수 있다',
      '풀업 · 풀다운 저항의 필요성을 설명할 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch05-1',
        title: '디지털 출력 — LED 켜고 끄기',
        minutes: 45,
        goals: [
          '엣지 커넥터의 핀 구성과 역할을 설명할 수 있다',
          '<code>write_digital(0/1)</code> 로 핀에 전압을 낼 수 있다',
          'LED 를 저항과 함께 연결하는 회로를 이해한다',
          '여러 핀을 함께 제어할 수 있다'
        ],
        flow: [['엣지 커넥터 둘러보기', 10], ['디지털 출력의 뜻', 8], ['LED 연결과 제어', 16], ['여러 개 제어', 8], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '엣지 커넥터 — 바깥 세상으로 나가는 문' },
          { type: 'p', html: '지금까지는 micro:bit <b>안에</b> 있는 LED 화면과 버튼만 썼습니다. 이제 보드 <b>바깥</b>의 부품을 연결해 봅니다. 아래쪽 금색 가장자리를 <b>엣지 커넥터(edge connector)</b> 라고 합니다.' },
          { type: 'figure', html: FIG_EDGE, caption: '그림 5-1. 엣지 커넥터의 큰 단자 5개' },
          {
            type: 'table', head: ['핀', '할 수 있는 일'], rows: [
              ['<code>pin0</code> <code>pin1</code> <code>pin2</code>', '<b>디지털 입력 · 출력</b>, <b>아날로그 입력</b>, <b>PWM 출력</b>, <b>터치</b> — 가장 자유롭게 쓸 수 있는 핀'],
              ['<code>3V</code>', '<b>3.3V 전원</b>. 부품에 전기를 공급합니다. 프로그램에서 제어할 수 없습니다.'],
              ['<code>GND</code>', '<b>접지(0V)</b>. 모든 전류가 돌아오는 길입니다. 회로의 기준점.'],
              ['<code>pin3</code> ~ <code>pin16</code>, <code>pin19</code>, <code>pin20</code>', '좁은 단자. 확장 보드를 끼워야 쓸 수 있습니다. 일부는 LED 화면 · 버튼과 공유합니다.']
            ]
          },
          { type: 'callout', kind: 'warn', title: '함께 쓰면 안 되는 핀', html: '<code>pin3</code> · <code>pin4</code> · <code>pin6</code> · <code>pin7</code> · <code>pin9</code> · <code>pin10</code> 은 <b>LED 화면</b>이, <code>pin5</code> · <code>pin11</code> 은 <b>버튼 A · B</b> 가 이미 쓰고 있습니다. 이 핀들을 쓰려면 <code>display.off()</code> 로 화면을 꺼야 합니다. <b>수업에서는 0 · 1 · 2 와 8 · 12 · 16 을 쓰면 안전합니다.</b>' },

          { type: 'h', text: '디지털 출력 — 0 아니면 1' },
          { type: 'p', html: '<b>디지털(digital)</b> 은 값이 <b>두 가지뿐</b>이라는 뜻입니다. micro:bit 핀의 디지털 출력은:' },
          {
            type: 'table', head: ['코드', '핀의 전압', '뜻'], rows: [
              ['<code>pin0.write_digital(1)</code>', '<b>3.3V</b>', 'HIGH · 켜짐 · 참'],
              ['<code>pin0.write_digital(0)</code>', '<b>0V</b>', 'LOW · 꺼짐 · 거짓']
            ]
          },
          {
            type: 'code', title: '예제 5-1. 바깥 LED 깜빡이기', code: `from microbit import *

while True:
    pin0.write_digital(1)    # 켜기
    sleep(500)
    pin0.write_digital(0)    # 끄기
    sleep(500)`,
            hint: '🧩 <b>부품 탭</b>에서 <b>💡 LED</b> 를 추가하고 핀을 <code>P0</code> 으로 맞춘 뒤 실행하세요. 보드 아래 요약 줄에서도 LED 가 깜빡이는 것을 볼 수 있습니다.',
            desc: '실제로는 P0 과 GND 사이에 <b>저항 + LED</b> 를 연결합니다. <code>write_digital(1)</code> 을 하면 핀에 3.3V 가 나와 LED 에 전류가 흐릅니다.',
            expect: '연결한 LED 가 0.5초 간격으로 깜빡입니다.'
          },
          { type: 'figure', html: FIG_LED, caption: '그림 5-2. LED 연결 방법 — 저항을 꼭 함께!' },
          {
            type: 'list', items: [
              '<b>LED 는 방향이 있습니다.</b> <b>긴 다리(+, 애노드)</b> 가 핀 쪽, <b>짧은 다리(−, 캐소드)</b> 가 GND 쪽입니다. 거꾸로 꽂으면 불이 들어오지 않습니다.',
              '<b>저항을 꼭 넣으세요.</b> 220Ω ~ 470Ω 을 씁니다. 저항 없이 연결하면 전류가 너무 많이 흘러 LED 나 보드가 상할 수 있습니다.',
              '악어클립으로 연결할 때는 <b>큰 단자(0 · 1 · 2 · 3V · GND)</b> 를 씁니다.'
            ]
          },
          { type: 'callout', kind: 'more', title: '왜 저항이 필요할까?', html: '<p>LED 는 전류가 많이 흐를수록 밝아지지만, 일정량을 넘으면 <b>타 버립니다</b>. LED 자체는 전류를 막지 못하므로 저항을 직렬로 넣어 전류를 제한합니다.</p><p>옴의 법칙으로 계산해 보면: LED 에 걸리는 전압이 약 2V 라면 저항에는 3.3 − 2 = 1.3V 가 걸립니다. 220Ω 이면 전류는 1.3 ÷ 220 ≈ <b>0.006A = 6mA</b>. micro:bit 핀이 안전하게 낼 수 있는 전류(최대 약 5mA/핀, 전체 90mA)에 알맞습니다.</p>' },

          { type: 'h', text: '여러 개를 함께 제어하기' },
          {
            type: 'code', title: '예제 5-2. 신호등 (LED 3개)', code: `from microbit import *

# P0 = 빨강, P1 = 노랑, P2 = 초록
def all_off():
    pin0.write_digital(0)
    pin1.write_digital(0)
    pin2.write_digital(0)

while True:
    all_off()
    pin0.write_digital(1)      # 빨강
    sleep(3000)

    all_off()
    pin1.write_digital(1)      # 노랑
    sleep(800)

    all_off()
    pin2.write_digital(1)      # 초록
    sleep(3000)

    all_off()
    pin1.write_digital(1)      # 노랑
    sleep(800)`,
            hint: '🧩 <b>부품 탭</b>에서 LED 를 3개 추가하고 핀을 각각 <code>P0</code> · <code>P1</code> · <code>P2</code>, 색을 red · yellow · green 으로 맞춰 보세요.',
            desc: '같은 일을 여러 번 쓰는 대신 <code>def all_off():</code> 로 <b>함수</b>를 만들어 묶었습니다. 이름만 부르면 세 줄이 실행됩니다.',
            expect: '빨강 3초 → 노랑 0.8초 → 초록 3초 → 노랑 0.8초 반복'
          },
          { type: 'callout', kind: 'more', title: '함수(def) 맛보기', html: '<p><code>def 이름():</code> 으로 <b>자주 쓰는 코드 묶음에 이름을 붙일</b> 수 있습니다.</p><pre><code>def all_off():\n    pin0.write_digital(0)\n    pin1.write_digital(0)\n    pin2.write_digital(0)\n\nall_off()      # 이렇게 부르면 위 세 줄이 실행된다</code></pre><p>같은 코드를 여러 번 쓰지 않아도 되고, 고칠 때도 한 곳만 고치면 됩니다.</p>' },
          {
            type: 'code', title: '예제 5-3. 리스트로 더 깔끔하게', code: `from microbit import *

pins = [pin0, pin1, pin2]

# 순서대로 하나씩 켜기 (흐르는 불빛)
while True:
    for p in pins:
        for q in pins:
            q.write_digital(0)     # 전부 끄고
        p.write_digital(1)         # 하나만 켜기
        sleep(300)`,
            hint: '🧩 LED 3개를 P0 · P1 · P2 에 연결하세요.',
            desc: '핀도 <b>리스트</b>에 담을 수 있습니다. 부품이 많아질수록 리스트가 훨씬 편합니다.',
            expect: 'LED 3개가 차례로 하나씩 켜집니다.'
          },
          {
            type: 'code', title: '예제 5-4. 버튼으로 바깥 LED 켜기', code: `from microbit import *

while True:
    if button_a.is_pressed():
        pin0.write_digital(1)
        display.show(Image.YES)
    else:
        pin0.write_digital(0)
        display.clear()
    sleep(50)`,
            hint: '🧩 LED 를 P0 에 연결하고, 보드 그림의 A 버튼을 눌러 보세요.',
            desc: '안쪽 버튼 입력과 바깥 부품 출력을 연결했습니다. 이것이 피지컬 컴퓨팅의 기본 형태입니다.',
            expect: 'A 를 누르는 동안 바깥 LED 가 켜집니다.'
          },

          { type: 'h', text: '핀 상태 확인하기' },
          { type: 'p', html: '오른쪽 시뮬레이터의 <b>🔌 핀 탭</b>을 열면 프로그램이 각 핀을 어떻게 쓰고 있는지 표로 볼 수 있습니다. 모드(디지털 출력 / 입력 / 아날로그)와 현재 값이 실시간으로 바뀝니다.' },
          {
            type: 'code', repl: true, title: '셸에서 핀 다뤄 보기', code: `pin0.write_digital(1)
pin0.get_mode()
pin1.write_analog(512)
pin1.get_mode()`,
            desc: '<code>get_mode()</code> 는 그 핀이 지금 어떤 용도로 쓰이고 있는지 알려 줍니다. 🔌 핀 탭과 비교해 보세요.',
            expect: ">>> pin0.get_mode()\n'write_digital'\n>>> pin1.get_mode()\n'write_analog'"
          },
          { type: 'callout', kind: 'board', title: '전류 제한', html: '<p>micro:bit 의 핀은 <b>많은 전류를 낼 수 없습니다</b>.</p><ul><li>핀 하나: 최대 <b>5mA</b> 정도 (LED 1개면 충분)</li><li>3V 단자 전체: 최대 <b>90mA</b></li></ul><p>모터, 여러 개의 LED, 전구 등을 직접 연결하면 안 됩니다. <b>트랜지스터 · 모터 드라이버 · 릴레이</b>를 통해 별도 전원으로 구동해야 합니다.</p>' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 핀이 지금 어떤 모드인지 보기', code: `from microbit import *

print("처음:", pin0.get_mode())

pin0.write_digital(1)
print("digital 출력 뒤:", pin0.get_mode())

pin0.write_analog(512)
print("analog 출력 뒤:", pin0.get_mode())

pin1.read_digital()
print("P1 읽은 뒤:", pin1.get_mode(), "/ 풀 저항:", pin1.get_pull())

display.scroll("SEE PIN TAB", delay=70)`,
            hint: '실행한 뒤 오른쪽 <b>🔌 핀</b> 탭의 표와 비교해 보세요.',
            desc: '<code>get_mode()</code> 는 그 핀이 지금 <b>입력인지 출력인지</b>를 알려 줍니다. 핀이 예상과 다르게 동작할 때 가장 먼저 확인할 것입니다.',
            expect: "처음: unused\ndigital 출력 뒤: write_digital\nanalog 출력 뒤: write_analog\nP1 읽은 뒤: read_digital / 풀 저항: 2"
          },
          {
            type: 'code', title: '더 해 보기 ②. 안쪽 화면과 바깥 LED 를 함께', code: `from microbit import *

while True:
    for i in range(5):
        # 안쪽 LED 화면: 왼쪽에서 오른쪽으로
        display.clear()
        for y in range(5):
            display.set_pixel(i, y, 9)
        # 바깥 LED: 가운데 칸일 때만 켜기
        pin0.write_digital(1 if i == 2 else 0)
        sleep(180)`,
            hint: '🧩 <b>부품 탭</b>에서 LED 를 P0 에 연결하세요.',
            desc: '보드 안의 화면과 바깥 부품을 <b>같은 반복 안에서</b> 함께 다룹니다. 피지컬 컴퓨팅에서 아주 흔한 형태입니다.',
            expect: '세로줄이 지나가고, 가운데를 지날 때 바깥 LED 가 켜집니다.'
          },
          {
            type: 'code', title: '더 해 보기 ③. 패턴을 표로 적어 두고 재생하기', code: `from microbit import *

PINS = [pin0, pin1, pin2]

# 1 = 켜기, 0 = 끄기 (세 개 LED 의 시간표)
PATTERN = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
    [0, 0, 0],
]

while True:
    for step in PATTERN:
        for i in range(3):
            PINS[i].write_digital(step[i])
        sleep(250)`,
            hint: '🧩 LED 3개를 P0 · P1 · P2 에 연결하세요.',
            desc: '켜고 끄는 순서를 <b>표(리스트의 리스트)</b>로 적어 두면, 코드를 고치지 않고 <code>PATTERN</code> 만 바꿔 다른 연출을 만들 수 있습니다. 전광판이나 조명 쇼를 만들 때 쓰는 방법입니다.',
            expect: 'LED 3개가 표에 적힌 순서대로 켜졌다 꺼집니다.'
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '엣지 커넥터의 큰 단자는 <code>0</code> · <code>1</code> · <code>2</code> · <code>3V</code> · <code>GND</code> 다섯 개입니다.',
              '<code>pin0.write_digital(1)</code> → 핀에 3.3V, <code>write_digital(0)</code> → 0V.',
              'LED 는 <b>방향</b>이 있고 <b>저항(220Ω 정도)</b> 을 꼭 함께 연결합니다.',
              '<code>def 이름():</code> 으로 자주 쓰는 코드를 묶고, 핀들을 <b>리스트</b>에 담아 반복문으로 다룹니다.',
              '핀 하나가 낼 수 있는 전류는 약 5mA 로 작습니다. 모터는 드라이버가 필요합니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 5-1. 번갈아 깜빡이기',
            level: 1,
            desc: '<p>LED 두 개를 <code>P0</code> · <code>P1</code> 에 연결하고, <b>번갈아</b> 깜빡이게 만드세요. (한쪽이 켜지면 다른 쪽은 꺼짐)</p><p>속도는 0.4초입니다. 🧩 부품 탭에서 LED 2개를 추가하세요.</p>',
            hint: '둘을 동시에 바꿔야 합니다. <code>pin0.write_digital(1)</code> 과 <code>pin1.write_digital(0)</code> 을 함께 쓰세요.',
            starter: 'from microbit import *\n\nwhile True:\n    # TODO\n    sleep(400)\n',
            solution: 'from microbit import *\n\nwhile True:\n    pin0.write_digital(1)\n    pin1.write_digital(0)\n    sleep(400)\n    pin0.write_digital(0)\n    pin1.write_digital(1)\n    sleep(400)\n'
          },
          {
            title: '실습 5-2. 버튼으로 켜는 손전등',
            level: 2,
            desc: '<p>A 를 누를 때마다 바깥 LED(<code>P0</code>)가 <b>켜짐 ↔ 꺼짐</b> 으로 바뀌는 손전등을 만드세요. (누르고 있는 동안이 아니라 <b>한 번 누르면 계속 유지</b>)</p><ul><li>LED 화면에도 현재 상태를 표시합니다 (켜짐 = <code>Image.YES</code>, 꺼짐 = <code>Image.NO</code>)</li><li>도전: B 를 누르면 <b>SOS 모스 부호</b>로 깜빡이게 해 보세요</li></ul>',
            hint: '상태를 <code>on = False</code> 변수로 기억하고, <code>was_pressed()</code> 일 때 <code>on = not on</code> 으로 뒤집습니다.',
            starter: 'from microbit import *\n\non = False\npin0.write_digital(0)\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\n\non = False\npin0.write_digital(0)\ndisplay.show(Image.NO)\n\n\ndef signal(times, length):\n    for i in range(times):\n        pin0.write_digital(1)\n        sleep(length)\n        pin0.write_digital(0)\n        sleep(200)\n\n\nwhile True:\n    if button_a.was_pressed():\n        on = not on\n        pin0.write_digital(1 if on else 0)\n        display.show(Image.YES if on else Image.NO)\n\n    if button_b.was_pressed():\n        signal(3, 200)\n        sleep(300)\n        signal(3, 600)\n        sleep(300)\n        signal(3, 200)\n        pin0.write_digital(1 if on else 0)\n\n    sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: '<code>pin0.write_digital(1)</code> 을 실행하면 P0 핀의 전압은?', options: ['0V', '1V', '3.3V', '5V'], answer: 2,
            explain: 'micro:bit 의 디지털 HIGH 는 <b>3.3V</b> 입니다. <code>0</code> 은 0V 입니다.'
          },
          {
            q: 'LED 를 연결할 때 저항을 넣는 이유는?', options: ['LED 를 더 밝게 하려고', '전류를 제한해 LED 와 보드를 보호하려고', '전압을 올리려고', '없어도 상관없다'], answer: 1,
            explain: 'LED 는 스스로 전류를 제한하지 못합니다. 저항(220Ω 정도)으로 전류를 제한해야 합니다.'
          },
          {
            q: '수업에서 바깥 부품을 연결하기에 <b>가장 안전한</b> 핀은?', options: ['<code>pin3</code>, <code>pin4</code>', '<code>pin5</code>, <code>pin11</code>', '<code>pin0</code>, <code>pin1</code>, <code>pin2</code>', '<code>pin19</code>, <code>pin20</code>'], answer: 2,
            explain: '<code>pin0</code> · <code>pin1</code> · <code>pin2</code> 는 큰 단자이고 다른 기능과 겹치지 않습니다. <code>pin3~4</code> 는 LED 화면, <code>pin5</code> · <code>pin11</code> 은 버튼과 공유합니다.'
          },
          {
            q: 'micro:bit 핀 하나가 안전하게 낼 수 있는 전류는 대략?', options: ['5mA', '50mA', '500mA', '제한 없음'], answer: 0,
            explain: '핀 하나당 약 <b>5mA</b>, 3V 단자 전체로 약 90mA 입니다. 모터 같은 부품은 드라이버를 거쳐야 합니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '디지털 출력 — LED 켜고 끄기', subtitle: 'Chapter 05 · 입출력 핀', badge: '1교시',
            notes: '<p>실물 LED · 저항 · 악어클립이 있으면 최고입니다. 없어도 시뮬레이터의 부품 탭으로 모두 실습 가능합니다.</p><p>시간: 2분</p>'
          },
          {
            layout: 'diagram', title: '엣지 커넥터', html: FIG_EDGE, caption: '큰 단자 5개: 0 · 1 · 2 · 3V · GND',
            notes: '<p>실물 보드를 돌려 보며 금색 단자를 직접 만져 보게 합니다.</p><p><b>주의</b>: pin3~11 은 LED 화면 · 버튼과 공유합니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'diagram', title: 'LED 연결 방법', html: FIG_LED, caption: '핀 → 저항 → LED(긴 다리 +) → GND',
            notes: '<p>LED 방향과 저항의 중요성을 강조합니다. 저항 없이 연결한 LED 가 타는 사진을 보여 주면 인상적입니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '바깥 LED 깜빡이기', code: 'from microbit import *\n\nwhile True:\n    pin0.write_digital(1)\n    sleep(500)\n    pin0.write_digital(0)\n    sleep(500)',
            points: ['<code>write_digital(1)</code> → 3.3V', '<code>write_digital(0)</code> → 0V', '🧩 부품 탭에서 LED 추가 → P0', '🔌 핀 탭에서 상태 확인'],
            notes: '<p>시뮬레이터 부품 탭 사용법을 함께 보여 주세요. LED 밝기 % 가 표시됩니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '함수로 묶기 — 신호등', code: 'from microbit import *\n\ndef all_off():\n    pin0.write_digital(0)\n    pin1.write_digital(0)\n    pin2.write_digital(0)\n\nwhile True:\n    all_off()\n    pin0.write_digital(1)\n    sleep(3000)\n    all_off()\n    pin1.write_digital(1)\n    sleep(800)',
            points: ['<code>def 이름():</code> 으로 코드 묶기', '같은 코드를 여러 번 쓰지 않음', '고칠 때 한 곳만', '핀을 <b>리스트</b>에 담으면 더 편리'],
            notes: '<p>함수는 9장에서 자세히 다루지만, 여기서 자연스럽게 필요성을 느끼게 합니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'bullets', title: '⚠ 전류 제한',
            bullets: ['핀 하나: 최대 <b>약 5mA</b> (LED 1개)', '3V 단자 전체: 최대 <b>약 90mA</b>', '모터 · 전구 직접 연결 ✘', '트랜지스터 · 모터 드라이버 · 릴레이 사용'],
            notes: '<p>안전 교육 차원에서 꼭 짚고 넘어가세요. 보드가 망가지면 수업이 멈춥니다.</p><p>시간: 5분</p>'
          },
          {
            layout: 'practice', title: '실습 5-2. 버튼으로 켜는 손전등', desc: 'A 를 누를 때마다 바깥 LED 가 켜짐 ↔ 꺼짐',
            starter: 'from microbit import *\n\non = False\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\n\non = False\npin0.write_digital(0)\ndisplay.show(Image.NO)\n\nwhile True:\n    if button_a.was_pressed():\n        on = not on\n        pin0.write_digital(1 if on else 0)\n        display.show(Image.YES if on else Image.NO)\n    sleep(50)\n',
            notes: '<p><code>on = not on</code> 이라는 토글 패턴을 꼭 소개하세요. 앞으로 자주 씁니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['큰 단자: 0 · 1 · 2 · 3V · GND', '<code>write_digital(1)</code> = 3.3V, <code>(0)</code> = 0V', 'LED: 방향 있음 + 저항 220Ω 필수', '<code>def</code> 로 묶고 리스트로 다루기', '핀 전류는 5mA 로 작음'],
            notes: '<p>다음 시간 예고: 바깥 버튼과 스위치를 읽어 들이기 (디지털 입력).</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch05-2',
        title: '디지털 입력 — 바깥 버튼과 스위치',
        minutes: 45,
        goals: [
          '<code>read_digital()</code> 로 핀의 상태를 읽을 수 있다',
          '풀업 · 풀다운 저항이 왜 필요한지 설명할 수 있다',
          '바깥 버튼 · 스위치를 연결해 입력으로 쓸 수 있다',
          '“누르면 0” 인 이유를 설명할 수 있다'
        ],
        flow: [['디지털 입력', 8], ['떠 있는 핀 문제', 12], ['풀업 · 풀다운', 12], ['버튼 연결 실습', 10], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: 'read_digital() — 핀의 상태 읽기' },
          { type: 'p', html: '<code>write_digital()</code> 이 핀에 전압을 <b>내보내는</b> 것이라면, <code>read_digital()</code> 은 핀에 걸린 전압을 <b>읽어 들이는</b> 것입니다. 결과는 <code>0</code> 또는 <code>1</code> 입니다.' },
          {
            type: 'table', head: ['핀에 걸린 전압', '<code>read_digital()</code> 결과'], rows: [
              ['0V 에 가까움 (GND 에 연결)', '<b>0</b>'],
              ['3.3V 에 가까움 (3V 에 연결)', '<b>1</b>']
            ]
          },
          {
            type: 'code', title: '예제 5-5. 핀 값 읽어 보기', code: `from microbit import *

while True:
    v = pin1.read_digital()
    display.show(v)
    print("P1 =", v)
    sleep(300)`,
            hint: '🔌 <b>핀 탭</b>에서 P1 행의 <b>0</b> · <b>1</b> 버튼을 눌러 값을 강제로 바꿔 보세요. 또는 🧩 부품 탭에서 <b>🔘 버튼</b>을 P1 에 연결하고 “누르기” 를 눌러 보세요.',
            desc: '핀 하나의 값을 계속 읽어 화면과 콘솔에 보여 줍니다. 값을 바꾸면 즉시 반응합니다.',
            expect: 'P1 = 0\nP1 = 0\nP1 = 1 …',
            nondeterministic: true
          },

          { type: 'h', text: '문제: 아무것도 연결하지 않은 핀은?' },
          { type: 'p', html: '버튼을 이렇게 연결했다고 해 봅시다: <b>P1 ── 버튼 ── GND</b>' },
          {
            type: 'figure', html: `<svg viewBox="0 0 1280 380" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="320" y="36" text-anchor="middle" font-size="23" font-weight="bold" fill="var(--danger)">✘ 풀 저항이 없을 때</text>
  <rect x="80" y="70" width="140" height="180" rx="12" fill="#0e6b64"/>
  <text x="150" y="150" text-anchor="middle" font-size="18" fill="#9fd8d3">micro:bit</text>
  <rect x="200" y="110" width="30" height="22" rx="3" fill="#e0b526"/><text x="215" y="102" text-anchor="middle" font-size="16" font-weight="bold" fill="var(--fg)">P1</text>
  <rect x="200" y="190" width="30" height="22" rx="3" fill="#e0b526"/><text x="215" y="232" text-anchor="middle" font-size="15" font-weight="bold" fill="var(--fg)">GND</text>
  <line x1="230" y1="121" x2="360" y2="121" stroke="var(--fg)" stroke-width="3"/>
  <rect x="360" y="100" width="70" height="42" rx="6" fill="none" stroke="var(--fg)" stroke-width="3"/>
  <line x1="368" y1="121" x2="390" y2="121" stroke="var(--fg)" stroke-width="3"/>
  <line x1="400" y1="112" x2="422" y2="121" stroke="var(--fg)" stroke-width="3"/>
  <text x="395" y="90" text-anchor="middle" font-size="15" fill="var(--muted)">버튼</text>
  <line x1="430" y1="121" x2="500" y2="121" stroke="var(--fg)" stroke-width="3"/>
  <line x1="500" y1="121" x2="500" y2="201" stroke="var(--fg)" stroke-width="3"/>
  <line x1="500" y1="201" x2="230" y2="201" stroke="var(--fg)" stroke-width="3"/>
  <text x="320" y="290" text-anchor="middle" font-size="18" fill="var(--fg)">버튼을 누르면 → GND 와 이어짐 → <tspan font-weight="bold">0</tspan></text>
  <text x="320" y="322" text-anchor="middle" font-size="18" fill="var(--danger)">버튼을 <tspan font-weight="bold">떼면</tspan> → 아무 데도 안 이어짐 → <tspan font-weight="bold">0? 1?</tspan></text>
  <text x="320" y="352" text-anchor="middle" font-size="17" fill="var(--muted)">전압이 정해지지 않아 값이 제멋대로 (플로팅)</text>

  <text x="960" y="36" text-anchor="middle" font-size="23" font-weight="bold" fill="var(--ok)">✔ 풀업 저항이 있을 때</text>
  <rect x="720" y="70" width="140" height="180" rx="12" fill="#0e6b64"/>
  <text x="790" y="150" text-anchor="middle" font-size="18" fill="#9fd8d3">micro:bit</text>
  <rect x="840" y="110" width="30" height="22" rx="3" fill="#e0b526"/><text x="855" y="102" text-anchor="middle" font-size="16" font-weight="bold" fill="var(--fg)">P1</text>
  <rect x="840" y="190" width="30" height="22" rx="3" fill="#e0b526"/><text x="855" y="232" text-anchor="middle" font-size="15" font-weight="bold" fill="var(--fg)">GND</text>
  <!-- 풀업 -->
  <line x1="870" y1="121" x2="930" y2="121" stroke="var(--fg)" stroke-width="3"/>
  <line x1="930" y1="121" x2="930" y2="70" stroke="var(--ok)" stroke-width="3"/>
  <rect x="912" y="26" width="36" height="44" rx="5" fill="var(--card2)" stroke="var(--ok)" stroke-width="3"/>
  <line x1="930" y1="26" x2="930" y2="6" stroke="var(--ok)" stroke-width="3"/>
  <text x="985" y="52" font-size="15" fill="var(--ok)">내부 풀업 저항 → 3.3V</text>
  <line x1="930" y1="121" x2="1010" y2="121" stroke="var(--fg)" stroke-width="3"/>
  <rect x="1010" y="100" width="70" height="42" rx="6" fill="none" stroke="var(--fg)" stroke-width="3"/>
  <line x1="1018" y1="121" x2="1040" y2="121" stroke="var(--fg)" stroke-width="3"/>
  <line x1="1050" y1="112" x2="1072" y2="121" stroke="var(--fg)" stroke-width="3"/>
  <line x1="1080" y1="121" x2="1140" y2="121" stroke="var(--fg)" stroke-width="3"/>
  <line x1="1140" y1="121" x2="1140" y2="201" stroke="var(--fg)" stroke-width="3"/>
  <line x1="1140" y1="201" x2="870" y2="201" stroke="var(--fg)" stroke-width="3"/>
  <text x="960" y="290" text-anchor="middle" font-size="18" fill="var(--fg)">버튼을 누르면 → GND 쪽이 이김 → <tspan font-weight="bold">0</tspan></text>
  <text x="960" y="322" text-anchor="middle" font-size="18" fill="var(--ok)">버튼을 떼면 → 풀업이 3.3V 로 끌어올림 → <tspan font-weight="bold">1</tspan></text>
  <text x="960" y="352" text-anchor="middle" font-size="17" fill="var(--muted)">항상 값이 확실합니다 — 누르면 0!</text>
</svg>`, caption: '그림 5-3. 풀업 저항이 필요한 이유'
          },
          { type: 'p', html: '버튼을 <b>누르면</b> P1 이 GND 와 이어지므로 <b>0</b> 입니다. 그런데 버튼을 <b>떼면</b> P1 은 아무 데도 이어지지 않습니다. 이런 상태를 <b>떠 있다(floating)</b> 고 하며, 전압이 정해지지 않아 값이 <b>제멋대로</b> 바뀝니다.' },
          { type: 'p', html: '이 문제를 풀려면 “아무것도 연결되지 않았을 때의 기본값”을 정해 줄 <b>풀(pull) 저항</b>이 필요합니다.' },
          {
            type: 'table', head: ['방식', '기본값', '버튼을 누르면', '연결'], rows: [
              ['<b>풀업(PULL_UP)</b>', '<b>1</b> (3.3V 로 끌어올림)', '<b>0</b>', '핀 ── 버튼 ── GND'],
              ['<b>풀다운(PULL_DOWN)</b>', '<b>0</b> (0V 로 끌어내림)', '<b>1</b>', '핀 ── 버튼 ── 3V'],
              ['<b>NO_PULL</b>', '없음 (떠 있음)', '—', '값이 불안정 — 특별한 경우에만']
            ]
          },
          { type: 'callout', kind: 'tip', title: '왜 “누르면 0” 이 흔할까?', html: '풀업 방식은 <b>micro:bit 안에 저항이 이미 들어 있어</b> 부품을 더 달 필요가 없습니다. 그래서 대부분의 회로가 “핀 ── 버튼 ── GND” 로 만들어지고, 결과적으로 <b>누르면 0</b>(LOW) 이 됩니다. micro:bit 의 버튼 A · B 도 이 방식입니다.' },

          { type: 'h', text: 'set_pull() — 풀 저항 설정하기' },
          {
            type: 'code', title: '예제 5-6. 풀업으로 바깥 버튼 읽기', code: `from microbit import *

pin1.set_pull(pin1.PULL_UP)     # 기본값을 1 로

while True:
    if pin1.read_digital() == 0:      # 누르면 0!
        display.show(Image.HAPPY)
    else:
        display.show(Image.ASLEEP)
    sleep(50)`,
            hint: '🧩 부품 탭에서 <b>🔘 버튼</b>을 추가하고 핀을 <code>P1</code>, 반대쪽을 <code>GND (누르면 0)</code> 로 맞춘 뒤 “누르기” 를 눌러 보세요.',
            desc: '<code>set_pull()</code> 로 기본값을 정합니다. 버튼을 누르지 않으면 풀업이 <code>1</code> 로 유지하고, 누르면 GND 가 이겨 <code>0</code> 이 됩니다.',
            expect: '버튼을 누르면 웃는 얼굴, 떼면 자는 얼굴'
          },
          {
            type: 'code', title: '예제 5-7. 풀다운으로 읽기', code: `from microbit import *

pin2.set_pull(pin2.PULL_DOWN)   # 기본값을 0 으로

while True:
    if pin2.read_digital() == 1:      # 누르면 1
        display.show(Image.YES)
    else:
        display.show(Image.NO)
    sleep(50)`,
            hint: '🧩 부품 탭에서 버튼을 P2 에 연결하고 반대쪽을 <code>3V (누르면 1)</code> 로 맞추세요.',
            desc: '핀 ── 버튼 ── <b>3V</b> 로 연결했다면 풀다운을 씁니다. 평소 <code>0</code>, 누르면 <code>1</code> 이라 더 직관적이지만 3V 배선이 필요합니다.',
            expect: '버튼을 누르면 체크, 떼면 엑스'
          },
          { type: 'callout', kind: 'warn', title: 'micro:bit 핀의 기본 풀 설정', html: '<p>micro:bit 핀의 기본값은 <b>핀마다 다릅니다</b>.</p><ul><li><code>pin5</code>(버튼 A) · <code>pin11</code>(버튼 B): 기본 <b>풀업</b></li><li>그 밖의 핀: 기본 <b>풀다운</b></li></ul><p>혼란을 막으려면 <b>직접 <code>set_pull()</code> 을 써서 명시</b>하는 습관을 들이세요.</p>' },
          {
            type: 'code', title: '예제 5-8. 토글 스위치로 모드 바꾸기', code: `from microbit import *

pin1.set_pull(pin1.PULL_UP)

while True:
    if pin1.read_digital() == 0:
        # 스위치 ON — 온도 표시
        display.show(str(temperature())[0])
    else:
        # 스위치 OFF — 잠자기
        display.show(Image.ASLEEP)
    sleep(300)`,
            hint: '🧩 부품 탭에서 <b>🎚️ 토글 스위치</b>를 P1 에 연결하고 켜고 꺼 보세요.',
            desc: '버튼과 달리 <b>토글 스위치</b>는 한 번 누르면 상태가 유지됩니다. 전원 스위치, 모드 스위치에 씁니다.',
            expect: '스위치를 켜면 온도, 끄면 자는 얼굴',
            nondeterministic: true
          },

          { type: 'h', text: '핀 값이 흔들릴 때 — 채터링' },
          { type: 'p', html: '실제 버튼은 눌리는 순간 접점이 아주 짧은 시간 동안 여러 번 붙었다 떨어집니다. 이것을 <b>채터링(chattering)</b> 또는 <b>바운싱(bouncing)</b> 이라고 하며, 한 번 눌렀는데 여러 번 눌린 것처럼 읽힐 수 있습니다.' },
          {
            type: 'code', title: '예제 5-9. 간단한 채터링 방지', code: `from microbit import *

pin1.set_pull(pin1.PULL_UP)
count = 0
last = 1

while True:
    now = pin1.read_digital()
    # 1 → 0 으로 바뀌는 순간(누르는 순간)만 센다
    if last == 1 and now == 0:
        count = count + 1
        display.show(count % 10)
        sleep(50)        # 접점이 안정될 때까지 잠깐 대기
    last = now
    sleep(20)`,
            hint: '🧩 버튼을 P1 에 연결하고 여러 번 눌러 보세요.',
            desc: '<b>값이 바뀌는 순간</b>만 세고, 그 뒤 잠깐 쉬어(디바운스) 채터링을 막습니다. <code>last</code> 변수가 <b>직전 상태</b>를 기억합니다. 이것은 <code>was_pressed()</code> 가 내부에서 하는 일과 비슷합니다.',
            expect: '버튼을 누를 때마다 숫자가 정확히 1씩 올라갑니다.'
          },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 풀 저항을 바꿔 가며 값 보기', code: `from microbit import *

for name, pull in [("PULL_UP", pin1.PULL_UP),
                   ("PULL_DOWN", pin1.PULL_DOWN),
                   ("NO_PULL", pin1.NO_PULL)]:
    pin1.set_pull(pull)
    sleep(100)
    values = [pin1.read_digital() for i in range(10)]
    print(name, "→", values)
    display.scroll(name[5], delay=80)

pin1.set_pull(pin1.PULL_UP)
display.show(Image.YES)`,
            hint: '🧩 부품 탭에서 <b>아무것도 연결하지 않은 채</b> 먼저 실행하고, 그다음 버튼을 P1 에 연결해 다시 실행해 보세요.',
            desc: '아무것도 연결하지 않은 핀을 10번씩 읽어 봅니다. 풀업은 계속 <code>1</code>, 풀다운은 계속 <code>0</code> 이지만 <b>NO_PULL 은 값이 정해지지 않습니다</b>. 왜 풀 저항이 필요한지 눈으로 확인할 수 있습니다.',
            expect: 'PULL_UP → [1, 1, 1, …]\nPULL_DOWN → [0, 0, 0, …]\nNO_PULL → […]',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ②. 스위치 두 개로 네 가지 상태', code: `from microbit import *

pin1.set_pull(pin1.PULL_UP)
pin2.set_pull(pin2.PULL_UP)

FACES = [Image.HAPPY, Image.SAD, Image.ANGRY, Image.ASLEEP]

while True:
    # 누르면 0 이므로 뒤집어서 0/1 로 만든다
    a = 1 - pin1.read_digital()
    b = 1 - pin2.read_digital()
    state = a * 2 + b                 # 00 01 10 11 → 0 1 2 3

    display.show(FACES[state])
    print("P1:", a, "P2:", b, "→ 상태", state)
    sleep(300)`,
            hint: '🧩 <b>토글 스위치</b> 두 개를 P1 · P2 에 연결하고 켜고 꺼 보세요.',
            desc: '스위치 2개로 <b>2<sup>2</sup> = 4가지</b> 상태를 만들 수 있습니다. <code>a * 2 + b</code> 는 두 개의 0/1 을 하나의 숫자로 합치는 <b>2진수</b> 계산입니다. 스위치가 3개면 8가지가 됩니다.',
            expect: 'P1: 0 P2: 0 → 상태 0\nP1: 1 P2: 0 → 상태 2 …',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. 바깥 버튼으로 LED 토글하기', code: `from microbit import *

pin1.set_pull(pin1.PULL_UP)
on = False
last = 1

pin0.write_digital(0)
display.show(Image.NO)

while True:
    now = pin1.read_digital()
    # 1 → 0 (누르는 순간)에만 뒤집는다
    if last == 1 and now == 0:
        on = not on
        pin0.write_digital(1 if on else 0)
        display.show(Image.YES if on else Image.NO)
        sleep(50)
    last = now
    sleep(20)`,
            hint: '🧩 LED 를 P0, 버튼을 P1(GND) 에 연결하세요.',
            desc: '<b>누르는 순간</b>에만 상태를 뒤집습니다. <code>on = not on</code> 은 <code>True</code> ↔ <code>False</code> 를 오가는 <b>토글</b> 방법으로, 앞으로 아주 자주 씁니다.',
            expect: '바깥 버튼을 누를 때마다 LED 가 켜졌다 꺼집니다.'
          },

          { type: 'h', text: '2교시 요약' },
          {
            type: 'list', items: [
              '<code>pin.read_digital()</code> 은 핀 전압을 <b>0 또는 1</b> 로 읽습니다.',
              '아무것도 연결되지 않은 핀은 <b>떠 있어(floating)</b> 값이 불안정합니다.',
              '<b>풀업</b>(기본 1, 누르면 0) · <b>풀다운</b>(기본 0, 누르면 1) 저항으로 기본값을 정합니다.',
              '<code>pin1.set_pull(pin1.PULL_UP)</code> 처럼 <b>직접 지정</b>하는 습관을 들입니다.',
              '버튼의 <b>채터링</b>은 “값이 바뀌는 순간만 처리 + 잠깐 대기” 로 막습니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 5-3. 바깥 버튼으로 LED 켜기',
            level: 1,
            desc: '<p><code>P1</code> 에 연결한 버튼을 누르면 <code>P0</code> 에 연결한 LED 가 켜지게 만드세요.</p><p>🧩 부품 탭에서 <b>LED(P0)</b> 와 <b>버튼(P1, GND)</b> 을 추가하세요.</p>',
            hint: '<code>pin1.set_pull(pin1.PULL_UP)</code> 을 먼저 하고, <code>pin1.read_digital() == 0</code> 일 때 <code>pin0.write_digital(1)</code>.',
            starter: 'from microbit import *\n\npin1.set_pull(pin1.PULL_UP)\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\n\npin1.set_pull(pin1.PULL_UP)\n\nwhile True:\n    if pin1.read_digital() == 0:\n        pin0.write_digital(1)\n    else:\n        pin0.write_digital(0)\n    sleep(50)\n'
          },
          {
            title: '실습 5-4. 도어벨',
            level: 2,
            desc: '<p>바깥 버튼(<code>P1</code>)을 누르면 초인종이 울리는 프로그램을 만드세요.</p><ul><li>버튼을 누른 <b>순간</b> 딩동 소리 (<code>music.pitch(659, 300)</code> 그리고 <code>music.pitch(523, 500)</code>)</li><li>동시에 LED 화면에 <code>Image.HAPPY</code> 를 1초 표시</li><li>누른 횟수를 콘솔에 출력</li><li>채터링을 막아 한 번 누르면 한 번만 울리게</li></ul>',
            hint: '<code>last</code> 변수로 직전 값을 기억하고, <code>last == 1 and now == 0</code> 일 때만 처리합니다.',
            starter: 'from microbit import *\nimport music\n\npin1.set_pull(pin1.PULL_UP)\nlast = 1\ncount = 0\n\nwhile True:\n    now = pin1.read_digital()\n    # TODO\n    last = now\n    sleep(20)\n',
            solution: 'from microbit import *\nimport music\n\npin1.set_pull(pin1.PULL_UP)\nlast = 1\ncount = 0\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    now = pin1.read_digital()\n    if last == 1 and now == 0:\n        count = count + 1\n        print("손님", count, "번째")\n        display.show(Image.HAPPY)\n        music.pitch(659, 300)\n        music.pitch(523, 500)\n        sleep(500)\n        display.show(Image.ASLEEP)\n    last = now\n    sleep(20)\n'
          }
        ],
        quiz: [
          {
            q: '아무것도 연결하지 않은 핀을 <code>read_digital()</code> 하면?', options: ['항상 0', '항상 1', '값이 불안정하게 바뀐다(플로팅)', '오류가 난다'], answer: 2,
            explain: '전압이 정해지지 않아 <b>떠 있는(floating)</b> 상태가 되어 값이 제멋대로 바뀝니다. 풀 저항으로 기본값을 정해야 합니다.'
          },
          {
            q: '<b>풀업</b> 저항을 쓰고 “핀 ── 버튼 ── GND” 로 연결했을 때, 버튼을 <b>누르면</b>?', options: ['0', '1', '값이 바뀌지 않는다', '오류'], answer: 0,
            explain: '평소에는 풀업이 3.3V 로 끌어올려 <b>1</b>, 누르면 GND 와 이어져 <b>0</b> 이 됩니다. 그래서 “누르면 0”.'
          },
          {
            q: '<code>pin2.set_pull(pin2.PULL_DOWN)</code> 으로 설정하면 평소 값은?', options: ['0', '1', '불안정', '3.3'], answer: 0,
            explain: '풀다운은 핀을 0V 쪽으로 끌어내리므로 평소 <b>0</b> 입니다. 3V 에 연결된 버튼을 누르면 1 이 됩니다.'
          },
          {
            q: '버튼을 한 번 눌렀는데 여러 번 눌린 것처럼 읽히는 현상은?', options: ['플로팅', '채터링(바운싱)', '풀업', '단락'], answer: 1,
            explain: '접점이 아주 짧은 시간 동안 여러 번 붙었다 떨어지는 <b>채터링</b> 입니다. 값이 바뀌는 순간만 처리하고 잠깐 대기해 막습니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '디지털 입력 — 바깥 버튼과 스위치', subtitle: 'Chapter 05 · 입출력 핀', badge: '2교시',
            notes: '<p>풀업 · 풀다운은 처음 배울 때 어려운 개념입니다. 그림을 충분히 활용하세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'code', title: 'read_digital() — 핀 읽기', code: 'from microbit import *\n\nwhile True:\n    v = pin1.read_digital()\n    display.show(v)\n    print("P1 =", v)\n    sleep(300)',
            points: ['0V 근처 → <b>0</b>', '3.3V 근처 → <b>1</b>', '🔌 핀 탭에서 0 · 1 강제해 보기', '🧩 부품 탭에서 버튼 연결'],
            notes: '<p>핀 탭의 "입력 강제" 버튼으로 값을 바꾸며 보여 주면 이해가 빠릅니다.</p><p>시간: 7분</p>'
          },
          {
            layout: 'diagram', title: '왜 풀 저항이 필요할까?', html: `<svg viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="250" y="34" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--danger)">✘ 풀 저항 없음</text>
  <text x="250" y="90" text-anchor="middle" font-size="19" fill="var(--fg)">누르면 → GND 와 이어짐 → <tspan font-weight="bold">0</tspan></text>
  <text x="250" y="130" text-anchor="middle" font-size="19" fill="var(--danger)">떼면 → 아무 데도 안 이어짐</text>
  <text x="250" y="170" text-anchor="middle" font-size="19" fill="var(--danger)">→ <tspan font-weight="bold">0? 1?</tspan> 제멋대로!</text>
  <text x="250" y="230" text-anchor="middle" font-size="17" fill="var(--muted)">떠 있는 상태 = 플로팅(floating)</text>
  <line x1="500" y1="40" x2="500" y2="260" stroke="var(--line)" stroke-width="3"/>
  <text x="750" y="34" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--ok)">✔ 풀업 저항</text>
  <text x="750" y="90" text-anchor="middle" font-size="19" fill="var(--fg)">누르면 → GND 가 이김 → <tspan font-weight="bold">0</tspan></text>
  <text x="750" y="130" text-anchor="middle" font-size="19" fill="var(--ok)">떼면 → 3.3V 로 끌어올림 → <tspan font-weight="bold">1</tspan></text>
  <text x="750" y="170" text-anchor="middle" font-size="19" fill="var(--ok)">항상 값이 <tspan font-weight="bold">확실</tspan>!</text>
  <text x="750" y="230" text-anchor="middle" font-size="17" fill="var(--muted)">그래서 “누르면 0” 이 흔합니다</text>
</svg>`, caption: '기본값을 정해 주는 것이 풀 저항의 역할',
            notes: '<p>"버튼을 떼면 핀이 어디에 연결되어 있나요?" 라고 물으면 학생들이 스스로 문제를 발견합니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'table', title: '풀업 vs 풀다운', head: ['방식', '평소', '누르면', '연결'], rows: [
              ['<b>PULL_UP</b>', '1', '0', '핀 ─ 버튼 ─ GND'],
              ['<b>PULL_DOWN</b>', '0', '1', '핀 ─ 버튼 ─ 3V'],
              ['NO_PULL', '불안정', '—', '특별한 경우만']],
            notes: '<p>micro:bit 의 버튼 A · B 도 풀업 방식이라 "누르면 0" 입니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: '풀업으로 바깥 버튼 읽기', code: 'from microbit import *\n\npin1.set_pull(pin1.PULL_UP)\n\nwhile True:\n    if pin1.read_digital() == 0:   # 누르면 0!\n        display.show(Image.HAPPY)\n    else:\n        display.show(Image.ASLEEP)\n    sleep(50)',
            points: ['<code>set_pull()</code> 로 명시하기', '<code>== 0</code> 이 “눌림”', '핀마다 기본값이 달라 헷갈림', '항상 직접 지정하는 습관'],
            notes: '<p>부품 탭에서 버튼을 연결해 함께 실행합니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '채터링 막기', code: 'from microbit import *\n\npin1.set_pull(pin1.PULL_UP)\ncount = 0\nlast = 1\n\nwhile True:\n    now = pin1.read_digital()\n    if last == 1 and now == 0:\n        count += 1\n        display.show(count % 10)\n        sleep(50)\n    last = now\n    sleep(20)',
            points: ['실제 버튼은 접점이 여러 번 튐', '<b>값이 바뀌는 순간</b>만 처리', '<code>last</code> 로 직전 상태 기억', '<code>was_pressed()</code> 가 하는 일과 같음'],
            notes: '<p>실물 버튼이 있으면 이 코드 없이 세어 보게 해 채터링을 직접 겪게 하면 좋습니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'practice', title: '실습 5-4. 도어벨', desc: '바깥 버튼을 누르면 딩동 소리와 함께 웃는 얼굴',
            starter: 'from microbit import *\nimport music\n\npin1.set_pull(pin1.PULL_UP)\nlast = 1\n\nwhile True:\n    now = pin1.read_digital()\n    # TODO\n    last = now\n    sleep(20)\n',
            solution: 'from microbit import *\nimport music\n\npin1.set_pull(pin1.PULL_UP)\nlast = 1\ncount = 0\ndisplay.show(Image.ASLEEP)\n\nwhile True:\n    now = pin1.read_digital()\n    if last == 1 and now == 0:\n        count += 1\n        print("손님", count, "번째")\n        display.show(Image.HAPPY)\n        music.pitch(659, 300)\n        music.pitch(523, 500)\n        sleep(500)\n        display.show(Image.ASLEEP)\n    last = now\n    sleep(20)\n',
            notes: '<p>music 은 6장에서 배우지만 여기서 미리 맛보기로 씁니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'summary', title: '2교시 정리', bullets: ['<code>read_digital()</code> → 0 또는 1', '연결 안 된 핀은 <b>플로팅</b> — 값 불안정', '풀업(평소 1, 누르면 0) / 풀다운(평소 0, 누르면 1)', '<code>set_pull()</code> 로 직접 지정', '채터링은 “바뀌는 순간만 + 잠깐 대기”'],
            notes: '<p>다음 시간 예고: 0과 1 사이의 값 — 아날로그와 PWM.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 3교시 ═══════════════════════ */
      {
        id: 'ch05-3',
        title: '아날로그 — 0과 1 사이의 값',
        minutes: 45,
        goals: [
          '<code>read_analog()</code> 로 0 ~ 1023 의 값을 읽을 수 있다',
          '가변저항 · 조도 센서를 연결해 값을 활용할 수 있다',
          '<code>write_analog()</code> 와 PWM 으로 밝기를 조절할 수 있다',
          '서보 모터를 움직일 수 있다',
          '<code>scale()</code> 로 값의 범위를 바꿀 수 있다'
        ],
        flow: [['아날로그란', 6], ['read_analog', 14], ['write_analog · PWM', 14], ['서보 모터', 8], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '디지털과 아날로그' },
          { type: 'p', html: '전등 스위치는 <b>켜짐/꺼짐</b> 둘뿐입니다 — 디지털. 하지만 조광기(밝기 조절 다이얼)는 <b>그 사이의 모든 밝기</b>를 만들 수 있습니다 — 아날로그.' },
          {
            type: 'table', head: ['', '디지털', '아날로그'], rows: [
              ['값의 종류', '0 또는 1 (두 가지)', '0 ~ 1023 (여러 단계)'],
              ['읽기', '<code>read_digital()</code>', '<code>read_analog()</code>'],
              ['쓰기', '<code>write_digital()</code>', '<code>write_analog()</code>'],
              ['예', '버튼, 스위치, LED 켜고 끄기', '가변저항, 조도 센서, LED 밝기, 모터 속도'],
              ['쓸 수 있는 핀', '모든 핀', '입력: <b>P0 · P1 · P2 · P3 · P4 · P10</b> / 출력: 모든 핀']
            ]
          },
          { type: 'callout', kind: 'warn', title: '아날로그 입력은 정해진 핀에서만', html: '<code>read_analog()</code> 는 <b>P0, P1, P2, P3, P4, P10</b> 에서만 됩니다. 다른 핀에서 부르면 <code>ValueError</code> 가 납니다. P3 · P4 · P10 은 LED 화면과 공유하므로 <code>display.off()</code> 가 필요합니다. <b>수업에서는 P0 · P1 · P2 를 쓰세요.</b>' },

          { type: 'h', text: 'read_analog() — 값을 읽어 들이기' },
          {
            type: 'code', title: '예제 5-10. 가변저항 값 읽기', code: `from microbit import *

while True:
    v = pin0.read_analog()
    print("P0 =", v)
    display.show(str(v // 114))     # 0~1023 을 0~8 로 줄여서
    sleep(200)`,
            hint: '🧩 <b>부품 탭</b>에서 <b>🎛️ 가변저항</b>을 추가하고 핀을 <code>P0</code> 으로 맞춘 뒤, 슬라이더를 움직여 보세요.',
            desc: '<code>read_analog()</code> 는 핀에 걸린 전압을 <b>0(0V) ~ 1023(3.3V)</b> 의 숫자로 바꿔 줍니다. 이것을 <b>ADC</b>(아날로그-디지털 변환) 라고 합니다.',
            expect: 'P0 = 512\nP0 = 730 … (슬라이더를 움직이면 따라 바뀝니다)',
            nondeterministic: true
          },
          {
            type: 'figure', html: `<svg viewBox="0 0 1280 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--fg)">가변저항(포텐셔미터) 연결 — 3V · 핀 · GND 세 다리</text>
  <rect x="140" y="80" width="170" height="130" rx="12" fill="#0e6b64"/>
  <text x="225" y="150" text-anchor="middle" font-size="17" fill="#9fd8d3">micro:bit</text>
  ${[['3V', 100, 'var(--danger)'], ['P0', 145, 'var(--accent)'], ['GND', 190, 'var(--muted)']].map(([n, y, c]) => `<rect x="290" y="${y - 10}" width="32" height="22" rx="3" fill="#e0b526"/>
  <text x="270" y="${y + 6}" text-anchor="end" font-size="16" font-weight="bold" fill="${c}">${n}</text>
  <line x1="322" y1="${y}" x2="560" y2="${y}" stroke="${c}" stroke-width="3.5"/>`).join('\n  ')}
  <rect x="560" y="70" width="180" height="150" rx="14" fill="var(--card2)" stroke="var(--fg)" stroke-width="3"/>
  <circle cx="650" cy="145" r="46" fill="none" stroke="var(--fg)" stroke-width="3"/>
  <line x1="650" y1="145" x2="686" y2="117" stroke="var(--accent)" stroke-width="6" stroke-linecap="round"/>
  <text x="650" y="248" text-anchor="middle" font-size="18" fill="var(--muted)">가변저항 (돌리는 다이얼)</text>
  <text x="820" y="110" font-size="19" fill="var(--fg)">왼쪽 끝으로 돌리면 → <tspan font-weight="bold" fill="var(--accent)">0</tspan> (0V)</text>
  <text x="820" y="152" font-size="19" fill="var(--fg)">가운데 → <tspan font-weight="bold" fill="var(--accent)">약 512</tspan> (1.65V)</text>
  <text x="820" y="194" font-size="19" fill="var(--fg)">오른쪽 끝으로 돌리면 → <tspan font-weight="bold" fill="var(--accent)">1023</tspan> (3.3V)</text>
  <text x="820" y="248" font-size="17" fill="var(--muted)">가운데 다리가 핀에 연결됩니다</text>
</svg>`, caption: '그림 5-4. 가변저항 연결'
          },
          {
            type: 'code', title: '예제 5-11. 값으로 막대그래프 그리기', code: `from microbit import *

while True:
    v = pin0.read_analog()
    level = v * 5 // 1024        # 0 ~ 4 (몇 줄을 채울지)
    display.clear()
    for y in range(level + 1):
        for x in range(5):
            display.set_pixel(x, 4 - y, 9)
    sleep(100)`,
            hint: '🧩 가변저항을 P0 에 연결하고 슬라이더를 천천히 움직여 보세요.',
            desc: '아날로그 값을 <b>화면 높이</b>로 바꿨습니다. <code>v * 5 // 1024</code> 는 0~1023 을 0~4 로 줄이는 계산입니다. <code>4 - y</code> 로 아래에서부터 채웁니다.',
            expect: '가변저항을 돌리면 막대가 아래에서부터 차오릅니다.'
          },
          { type: 'h', text: 'scale() — 범위 바꾸기' },
          { type: 'p', html: '0~1023 을 다른 범위로 바꾸는 계산은 아주 자주 합니다. micro:bit 에는 이를 위한 <code>scale()</code> 함수가 준비되어 있습니다.' },
          {
            type: 'code', repl: true, title: '셸에서 scale() 써 보기', code: `scale(512, from_=(0, 1023), to=(0, 100))
scale(0, from_=(0, 1023), to=(0, 9))
scale(1023, from_=(0, 1023), to=(0, 9))
scale(512, from_=(0, 1023), to=(0.0, 1.0))`,
            desc: '<code>scale(값, from_=(원래 범위), to=(바꿀 범위))</code>. <code>to</code> 에 정수를 주면 정수가, 실수를 주면 실수가 나옵니다.',
            expect: '>>> scale(512, from_=(0, 1023), to=(0, 100))\n50\n>>> scale(1023, from_=(0, 1023), to=(0, 9))\n9\n>>> scale(512, from_=(0, 1023), to=(0.0, 1.0))\n0.5004888'
          },
          {
            type: 'code', title: '예제 5-12. scale 로 깔끔하게', code: `from microbit import *

while True:
    v = pin0.read_analog()
    b = scale(v, from_=(0, 1023), to=(0, 9))     # 밝기 0~9 로
    display.show(Image("99999:99999:99999:99999:99999") * (b / 9))
    print(v, "->", b)
    sleep(100)`,
            hint: '🧩 가변저항을 P0 에 연결하세요.',
            desc: '가변저항을 돌리면 화면 전체의 밝기가 바뀝니다. <code>scale()</code> 덕분에 복잡한 계산 없이 범위를 바꿀 수 있습니다.',
            expect: '가변저항으로 화면 밝기가 조절됩니다.',
            nondeterministic: true
          },

          { type: 'h', text: 'write_analog() 와 PWM' },
          { type: 'p', html: 'micro:bit 는 핀에서 <b>진짜 중간 전압</b>(예: 1.5V)을 낼 수 없습니다. 대신 <b>아주 빠르게 켰다 껐다</b> 해서 평균적으로 중간처럼 보이게 합니다. 이것을 <b>PWM(Pulse Width Modulation, 펄스 폭 변조)</b> 이라고 합니다.' },
          { type: 'figure', html: FIG_PWM, caption: '그림 5-5. PWM — 켜져 있는 시간의 비율로 밝기를 만든다' },
          {
            type: 'code', title: '예제 5-13. LED 밝기 조절', code: `from microbit import *

while True:
    # 점점 밝게
    for v in range(0, 1024, 32):
        pin0.write_analog(v)
        sleep(30)
    # 점점 어둡게
    for v in range(1023, -1, -32):
        pin0.write_analog(v)
        sleep(30)`,
            hint: '🧩 부품 탭에서 <b>💡 LED</b> 를 P0 에 연결하고 밝기 % 가 바뀌는 것을 보세요.',
            desc: '<code>write_analog(0~1023)</code> 으로 밝기를 조절합니다. <code>range(0, 1024, 32)</code> 는 0, 32, 64 … 992 처럼 <b>32씩 건너뛰며</b> 셉니다.',
            expect: 'LED 가 부드럽게 밝아졌다 어두워지기를 반복합니다.'
          },
          {
            type: 'code', title: '예제 5-14. 가변저항으로 LED 밝기 조절', code: `from microbit import *

while True:
    v = pin1.read_analog()      # 가변저항 읽기
    pin0.write_analog(v)        # 그대로 LED 로
    sleep(20)`,
            hint: '🧩 가변저항을 <b>P1</b>, LED 를 <b>P0</b> 에 연결하세요.',
            desc: '입력을 읽어 그대로 출력으로 보내는, 아주 단순하지만 강력한 프로그램입니다. 실제 조광 스위치와 똑같은 원리입니다.',
            expect: '가변저항을 돌리면 LED 밝기가 따라 바뀝니다.'
          },
          {
            type: 'code', title: '예제 5-15. 부저로 소리 내기', code: `from microbit import *

# 소리는 PWM 의 '주파수' 로 만든다
for hz in [262, 294, 330, 349, 392, 440, 494, 523]:
    pin0.set_analog_period_microseconds(1000000 // hz)
    pin0.write_analog(512)        # 듀티 50% = 가장 큰 소리
    sleep(300)

pin0.write_analog(0)              # 소리 끄기`,
            hint: '🧩 부품 탭에서 <b>🔊 부저</b>를 P0 에 연결하고 소리를 들어 보세요. (브라우저 음량을 켜 두세요)',
            desc: 'PWM 의 <b>주기</b>를 바꾸면 소리의 <b>높이</b>가 됩니다. <code>set_analog_period_microseconds()</code> 로 주기를 정합니다. 다음 장에서 배울 <code>music</code> 모듈이 이 일을 대신 해 줍니다.',
            expect: '도 · 레 · 미 · 파 · 솔 · 라 · 시 · 도 소리가 납니다.'
          },
          {
            type: 'table', head: ['메서드', '하는 일'], rows: [
              ['<code>pin.write_analog(0~1023)</code>', 'PWM 듀티 비를 정한다 (0 = 항상 꺼짐, 1023 = 항상 켜짐)'],
              ['<code>pin.set_analog_period(ms)</code>', 'PWM 주기를 밀리초로 정한다'],
              ['<code>pin.set_analog_period_microseconds(us)</code>', 'PWM 주기를 마이크로초로 정한다 (더 정밀)'],
              ['<code>pin.get_analog_period_microseconds()</code>', '현재 주기를 읽는다']
            ]
          },

          { type: 'h', text: '서보 모터 움직이기' },
          { type: 'p', html: '<b>서보 모터</b>는 정해진 각도(보통 0°~180°)로 회전축을 돌려 주는 모터입니다. 로봇 팔, 자동문, 방향타에 씁니다. PWM 신호의 <b>펄스 폭</b>으로 각도를 정합니다.' },
          {
            type: 'table', head: ['펄스 폭', '각도', '<code>write_analog</code> 값 (주기 20ms 기준)'], rows: [
              ['약 0.5ms', '0°', '약 26'], ['약 1.5ms', '90° (가운데)', '약 77'], ['약 2.5ms', '180°', '약 128']
            ]
          },
          {
            type: 'code', title: '예제 5-16. 서보 각도 바꾸기', code: `from microbit import *

pin0.set_analog_period(20)        # 서보는 20ms 주기


def servo(angle):
    # 0~180도 → 펄스 폭 0.5~2.5ms → 듀티 값
    duty = 26 + (angle * 102) // 180
    pin0.write_analog(duty)


while True:
    servo(0)
    sleep(1000)
    servo(90)
    sleep(1000)
    servo(180)
    sleep(1000)`,
            hint: '🧩 부품 탭에서 <b>⚙️ 서보 모터</b>를 P0 에 연결하고 각도가 바뀌는 것을 보세요.',
            desc: '<code>servo()</code> 함수를 만들어 각도만 넣으면 되게 했습니다. 서보는 전류를 많이 쓰므로 <b>실제로는 별도 전원(건전지)</b> 을 쓰는 것이 안전합니다.',
            expect: '서보가 0° → 90° → 180° 로 움직입니다.'
          },
          {
            type: 'code', title: '예제 5-17. 기울기로 움직이는 서보', code: `from microbit import *

pin0.set_analog_period(20)


def servo(angle):
    angle = max(0, min(180, angle))
    pin0.write_analog(26 + (angle * 102) // 180)


while True:
    x = accelerometer.get_x()               # -1024 ~ 1024
    angle = scale(x, from_=(-1024, 1024), to=(0, 180))
    servo(angle)
    display.show(str(angle // 20))
    sleep(50)`,
            hint: '🧩 서보를 P0 에 연결하고, 🧭 센서 탭의 기울기 판을 좌우로 끌어 보세요.',
            desc: '가속도 센서와 서보를 연결했습니다. 보드를 기울이면 서보가 따라 움직입니다. <code>max(0, min(180, …))</code> 로 범위를 넘지 않게 막았습니다.',
            expect: '보드를 좌우로 기울이면 서보 각도가 0~180° 로 바뀝니다.'
          },
          { type: 'callout', kind: 'board', title: '모터에는 별도 전원을', html: '서보 모터는 순간적으로 <b>수백 mA</b> 를 씁니다. micro:bit 의 3V 단자로는 부족해 보드가 재부팅되거나 불안정해질 수 있습니다. 실제로는 <b>AA 건전지 팩</b> 등 별도 전원을 서보에 주고, <b>GND 만 micro:bit 와 연결</b>(공통 접지)하세요.' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 값이 흔들릴 때 — 여러 번 읽어 평균내기', code: `from microbit import *


def read_avg(pin, n=8):
    """n 번 읽어 평균을 낸다 (값이 훨씬 안정된다)"""
    total = 0
    for i in range(n):
        total = total + pin.read_analog()
        sleep(2)
    return total // n


while True:
    raw = pin0.read_analog()
    avg = read_avg(pin0)
    print("한 번:", raw, " / 평균:", avg, " / 차이:", abs(raw - avg))
    sleep(400)`,
            hint: '🧩 부품 탭에서 <b>가변저항</b>을 P0 에 연결하고 가만히 두어 보세요.',
            desc: '아날로그 값은 조금씩 흔들립니다. <b>여러 번 읽어 평균</b>을 내면 훨씬 안정된 값을 얻을 수 있습니다. 센서를 다룰 때 거의 항상 쓰는 기법입니다.',
            expect: '한 번: 512  / 평균: 510  / 차이: 2',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ②. PWM 주기를 바꿔 보기', code: `from microbit import *

# 같은 듀티(50%)라도 주기가 다르면 쓰임이 달라진다
for ms, note in [(20, "서보용 20ms"), (1, "LED용 1ms"), (0.5, "소리용 0.5ms")]:
    print(note, "→ 주기", int(ms * 1000), "us")
    pin0.set_analog_period_microseconds(int(ms * 1000))
    pin0.write_analog(512)
    display.scroll(str(ms), delay=80)
    sleep(800)

pin0.write_analog(0)
display.show(Image.YES)`,
            hint: '🧩 P0 에 <b>부저</b>를 연결하면 주기에 따라 소리가 달라지는 것을 들을 수 있습니다.',
            desc: '듀티 비(50%)는 그대로인데 <b>주기</b>만 바꿨습니다. 주기가 길면(20ms) 서보 신호, 짧으면(0.5ms = 2000Hz) 소리가 됩니다. 같은 PWM 이 용도에 따라 다르게 쓰이는 이유입니다.',
            expect: '서보용 20ms → 주기 20000 us\nLED용 1ms → 주기 1000 us\n소리용 0.5ms → 주기 500 us'
          },
          {
            type: 'code', title: '더 해 보기 ③. 두 아날로그 입력 비교하기', code: `from microbit import *

while True:
    left = pin1.read_analog()
    right = pin2.read_analog()
    diff = left - right

    display.clear()
    if abs(diff) < 60:
        display.show(Image.DIAMOND_SMALL)       # 거의 같음
    elif diff > 0:
        display.show(Image.ARROW_W)             # 왼쪽이 큼
    else:
        display.show(Image.ARROW_E)             # 오른쪽이 큼

    print("L:", left, " R:", right, " 차이:", diff)
    sleep(250)`,
            hint: '🧩 <b>조도 센서</b>(또는 가변저항) 두 개를 P1 · P2 에 연결하고 값을 다르게 움직여 보세요.',
            desc: '센서 두 개의 <b>차이</b>를 보면 “어느 쪽이 더 밝은가 · 기울었는가” 를 알 수 있습니다. 라인 트레이서 로봇이 길을 따라가는 원리와 같습니다.',
            expect: 'L: 700  R: 300  차이: 400',
            nondeterministic: true
          },

          { type: 'h', text: '🚀 응용 예제 — 진짜 장치 만들기' },
          { type: 'p', html: '핀 입출력을 모아 실제로 쓸 수 있는 장치를 만들어 봅니다. 각 예제 위의 <b>연결</b> 안내대로 🧩 부품 탭에서 부품을 붙인 뒤 실행하세요.' },
          {
            type: 'code', title: '응용 예제 5-1. 가변저항 밝기 조절 조명', code: `from microbit import *

# 연결: 가변저항 → P1, LED → P0
full = Image("99999:99999:99999:99999:99999")
last_shown = -1

while True:
    v = pin1.read_analog()            # 0 ~ 1023
    pin0.write_analog(v)              # 그대로 LED 밝기로

    level = scale(v, from_=(0, 1023), to=(0, 9))
    if level != last_shown:           # 값이 바뀔 때만 화면 갱신
        display.show(full * (level / 9))
        print("밝기", level, "/ 9  (원래 값", v, ")")
        last_shown = level

    sleep(40)`,
            hint: '🧩 <b>가변저항 → P1</b>, <b>LED → P0</b>',
            desc: '입력을 읽어 그대로 출력으로 보내는 가장 단순한 장치입니다. <code>last_shown</code> 으로 <b>값이 바뀔 때만</b> 화면을 고쳐 깜빡임을 없앴습니다.',
            expect: '가변저항을 돌리면 LED 와 화면 밝기가 함께 바뀝니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 5-2. 자동 야간등', code: `from microbit import *

# 연결: 조도 센서 → P1, LED → P0
DARK = 400              # 이보다 어두우면 켜기 시작
FADE = 30               # 한 번에 바뀌는 밝기 (부드럽게)

now = 0                 # 지금 LED 밝기

while True:
    light = pin1.read_analog()
    target = 0 if light > DARK else scale(DARK - light, from_=(0, DARK), to=(0, 1023))

    # 목표 밝기로 서서히 따라간다
    if now < target:
        now = min(target, now + FADE)
    elif now > target:
        now = max(target, now - FADE)

    pin0.write_analog(now)
    display.show(Image.ASLEEP if now == 0 else Image.SQUARE_SMALL)
    sleep(40)`,
            hint: '🧩 <b>조도 센서 → P1</b>, <b>LED → P0</b>. 조도 슬라이더를 천천히 내려 보세요.',
            desc: '어두울수록 밝게 켜지되, <b>한 번에 확 바뀌지 않고 서서히</b> 따라갑니다. 구름이 지나갈 때마다 깜빡이지 않도록 하는 실제 조명 제어 기법입니다.',
            expect: '어두워지면 LED 가 부드럽게 밝아집니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 5-3. 가변저항으로 돌리는 서보', code: `from microbit import *

# 연결: 가변저항 → P1, 서보 → P0
pin0.set_analog_period(20)


def servo(angle):
    angle = max(0, min(180, int(angle)))
    pin0.write_analog(26 + (angle * 102) // 180)


last = -1

while True:
    v = pin1.read_analog()
    angle = scale(v, from_=(0, 1023), to=(0, 180))

    if abs(angle - last) > 2:        # 조금이라도 움직였을 때만
        servo(angle)
        display.show(str(angle // 20))
        print("각도:", angle)
        last = angle

    sleep(40)`,
            hint: '🧩 <b>가변저항 → P1</b>, <b>서보 모터 → P0</b>',
            desc: '가변저항을 돌리면 서보가 따라 돕니다. 로봇 팔, 카메라 각도 조절, 수문 제어 같은 데 쓰이는 기본 구조입니다. <code>abs(angle - last) &gt; 2</code> 로 <b>떨림</b>을 막았습니다.',
            expect: '가변저항을 돌리면 서보가 0°~180° 로 따라 움직입니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 5-4. 부저 테레민 (빛으로 연주)', code: `from microbit import *

# 연결: 조도 센서 → P1, 부저 → P0
MIN_HZ, MAX_HZ = 200, 1600

display.show(Image.MUSIC_QUAVER)

while True:
    if button_a.is_pressed():
        light = pin1.read_analog()
        hz = scale(light, from_=(0, 1023), to=(MIN_HZ, MAX_HZ))
        pin0.set_analog_period_microseconds(1000000 // hz)
        pin0.write_analog(512)

        level = scale(light, from_=(0, 1023), to=(0, 4))
        display.clear()
        display.set_pixel(2, 4 - level, 9)
    else:
        pin0.write_analog(0)
        display.show(Image.MUSIC_QUAVER)

    sleep(30)`,
            hint: '🧩 <b>조도 센서 → P1</b>, <b>부저 → P0</b>. A 를 누른 채 조도 슬라이더를 움직이세요.',
            desc: 'A 를 누르는 동안만 소리가 나고, 빛의 세기가 <b>음의 높이</b>가 됩니다. 실제 보드에서는 센서 위에서 손을 위아래로 움직여 연주합니다.',
            expect: 'A 를 누른 채 빛을 바꾸면 소리 높이가 달라집니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 5-5. 보행자 버튼이 있는 신호등', code: `from microbit import *
import music

# 연결: 빨강 LED → P0, 노랑 → P1, 초록 → P2, 버튼 → P8(GND)
pin8.set_pull(pin8.PULL_UP)

RED, YELLOW, GREEN = pin0, pin1, pin2
requested = False


def lights(r, y, g, ms, mark):
    """세 LED 를 정해진 상태로 두고 ms 만큼 기다린다 (그동안 버튼도 확인)"""
    global requested
    RED.write_digital(r)
    YELLOW.write_digital(y)
    GREEN.write_digital(g)
    display.show(mark)
    t0 = running_time()
    while running_time() - t0 < ms:
        if pin8.read_digital() == 0:
            requested = True
        sleep(20)


while True:
    lights(1, 0, 0, 4000 if not requested else 1500, "R")
    requested = False
    lights(0, 1, 0, 800, "Y")
    lights(0, 0, 1, 3000, "G")
    music.play(['c5:1', 'c', 'c'], wait=False)
    lights(0, 1, 0, 800, "Y")`,
            hint: '🧩 <b>LED 3개 → P0 · P1 · P2</b>(색은 red · yellow · green), <b>버튼 → P8</b>',
            desc: '보행자 버튼을 누르면 <b>빨간불이 짧아집니다</b>. 기다리는 동안에도 버튼을 확인하려고 <code>sleep()</code> 대신 <code>running_time()</code> 비교를 썼습니다 — 실제 신호등 제어기와 같은 방식입니다.',
            expect: '빨강 → 노랑 → 초록 → 노랑 을 반복하고, 버튼을 누르면 다음 빨간불이 짧아집니다.',
            nondeterministic: true
          },

          { type: 'h', text: '3교시 · 5장 요약' },
          {
            type: 'list', items: [
              '<code>read_analog()</code> — 핀 전압을 <b>0 ~ 1023</b> 으로 읽습니다. <b>P0 · P1 · P2 · P3 · P4 · P10</b> 만 가능.',
              '<code>write_analog(0~1023)</code> — <b>PWM</b> 으로 중간 밝기 · 속도를 만듭니다.',
              '<code>set_analog_period(ms)</code> 로 PWM 주기를 바꿔 <b>소리</b>와 <b>서보</b>를 제어합니다.',
              '<code>scale(값, from_=(…), to=(…))</code> 로 값의 범위를 쉽게 바꿉니다.',
              '모터 같은 큰 부품은 <b>별도 전원 + 공통 접지</b>로 연결합니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 5-5. 빛 감지 자동 조명',
            level: 2,
            desc: '<p>조도 센서를 <code>P1</code> 에 연결하고, <b>어두워지면</b> <code>P0</code> 의 LED 가 자동으로 켜지는 조명을 만드세요.</p><ul><li>조도 값이 400 보다 작으면 LED 를 켭니다 (어두움)</li><li>밝으면 끕니다</li><li>LED 화면에도 현재 밝기를 막대로 표시합니다</li><li>도전: 켜고 끄는 대신 <b>어두울수록 밝게</b> 조절해 보세요 (<code>write_analog</code>)</li></ul>',
            hint: '🧩 부품 탭에서 <b>🔆 조도 센서(P1)</b> 와 <b>💡 LED(P0)</b> 를 추가하고 조도 슬라이더를 움직입니다. 어두울수록 밝게 하려면 <code>1023 - v</code> 를 써 보세요.',
            starter: 'from microbit import *\n\nwhile True:\n    light = pin1.read_analog()\n    print("light =", light)\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\n\nwhile True:\n    light = pin1.read_analog()\n    # 어두울수록 밝게\n    pin0.write_analog(1023 - light)\n\n    level = scale(light, from_=(0, 1023), to=(0, 4))\n    display.clear()\n    for y in range(level + 1):\n        for x in range(5):\n            display.set_pixel(x, 4 - y, 9)\n    sleep(100)\n'
          },
          {
            title: '실습 5-6. 도전! 미니 전자 악기',
            level: 3,
            desc: '<p>가변저항으로 <b>음 높이</b>를 조절하고, 버튼을 누르는 동안만 소리가 나는 악기를 만드세요.</p><ul><li>가변저항(<code>P1</code>)으로 200Hz ~ 1000Hz 사이를 조절</li><li>버튼 A 를 누르는 동안만 부저(<code>P0</code>)에서 소리</li><li>LED 화면에 음 높이를 막대로 표시</li><li>도전: B 를 누르면 지금 음을 <b>기억</b>했다가, 나중에 다시 재생</li></ul>',
            hint: '<code>scale()</code> 로 0~1023 을 200~1000 으로 바꾸고, <code>pin0.set_analog_period_microseconds(1000000 // hz)</code> 로 주파수를 정합니다. 소리를 끄려면 <code>pin0.write_analog(0)</code>.',
            starter: 'from microbit import *\n\nwhile True:\n    v = pin1.read_analog()\n    hz = scale(v, from_=(0, 1023), to=(200, 1000))\n    # TODO: A 를 누르는 동안만 소리\n    sleep(30)\n',
            solution: 'from microbit import *\n\nnotes = []\n\nwhile True:\n    v = pin1.read_analog()\n    hz = scale(v, from_=(0, 1023), to=(200, 1000))\n\n    if button_a.is_pressed():\n        pin0.set_analog_period_microseconds(1000000 // hz)\n        pin0.write_analog(512)\n    else:\n        pin0.write_analog(0)\n\n    if button_b.was_pressed():\n        notes.append(hz)\n        display.show(Image.YES)\n        sleep(200)\n\n    if len(notes) >= 8:\n        display.scroll("PLAY", delay=60)\n        for n in notes:\n            pin0.set_analog_period_microseconds(1000000 // n)\n            pin0.write_analog(512)\n            sleep(300)\n        pin0.write_analog(0)\n        notes = []\n\n    level = scale(v, from_=(0, 1023), to=(0, 4))\n    display.clear()\n    for y in range(level + 1):\n        display.set_pixel(2, 4 - y, 9)\n    sleep(30)\n'
          }
        ],
        quiz: [
          {
            q: '<code>read_analog()</code> 가 돌려주는 값의 범위는?', options: ['0 ~ 1', '0 ~ 100', '0 ~ 255', '0 ~ 1023'], answer: 3,
            explain: '0V 를 <b>0</b>, 3.3V 를 <b>1023</b> 으로 바꿉니다. 10비트 ADC(2<sup>10</sup> = 1024단계) 입니다.'
          },
          {
            q: '<code>read_analog()</code> 를 쓸 수 <b>없는</b> 핀은?', options: ['<code>pin0</code>', '<code>pin1</code>', '<code>pin2</code>', '<code>pin8</code>'], answer: 3,
            explain: '아날로그 입력은 <b>P0 · P1 · P2 · P3 · P4 · P10</b> 에서만 됩니다. <code>pin8</code> 에서 부르면 <code>ValueError</code> 입니다.'
          },
          {
            q: 'PWM 은 어떻게 중간 밝기를 만드나요?', options: ['전압을 진짜로 1.5V 로 낮춘다', '아주 빠르게 켰다 껐다 해서 평균을 만든다', 'LED 를 여러 개 쓴다', '저항을 바꾼다'], answer: 1,
            explain: '디지털 핀은 0V 또는 3.3V 밖에 못 내므로, <b>켜져 있는 시간의 비율(듀티 비)</b>을 조절해 평균적으로 중간처럼 보이게 합니다.'
          },
          {
            q: '<code>scale(512, from_=(0, 1023), to=(0, 100))</code> 의 결과는?', options: ['512', '약 50', '1023', '100'], answer: 1,
            explain: '0~1023 의 가운데인 512 를 0~100 범위로 바꾸면 <b>약 50</b> 입니다.'
          },
          {
            q: '서보 모터를 micro:bit 의 3V 단자로 직접 구동하면?', options: ['문제없다', '전류가 부족해 보드가 재부팅되거나 불안정해질 수 있다', '서보가 더 빨라진다', '오류 메시지가 뜬다'], answer: 1,
            explain: '서보는 순간적으로 수백 mA 를 씁니다. <b>별도 전원</b>을 주고 <b>GND 만 공통</b>으로 연결해야 합니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '아날로그 — 0과 1 사이의 값', subtitle: 'Chapter 05 · 입출력 핀', badge: '3교시',
            notes: '<p>이 시간의 PWM 개념은 전자 공작의 핵심입니다. 그림을 충분히 활용하세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'table', title: '디지털 vs 아날로그', head: ['', '디지털', '아날로그'], rows: [
              ['값', '0 또는 1', '0 ~ 1023'],
              ['읽기', '<code>read_digital()</code>', '<code>read_analog()</code>'],
              ['쓰기', '<code>write_digital()</code>', '<code>write_analog()</code>'],
              ['예', '스위치 · LED 켜기', '다이얼 · 밝기 · 속도']],
            notes: '<p>전등 스위치 vs 조광기 다이얼 비유가 잘 통합니다.</p><p>시간: 5분</p>'
          },
          {
            layout: 'diagram', title: '가변저항 연결', html: `<svg viewBox="0 0 1000 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="60" y="60" width="150" height="120" rx="12" fill="#0e6b64"/>
  <text x="135" y="125" text-anchor="middle" font-size="17" fill="#9fd8d3">micro:bit</text>
  ${[['3V', 85, 'var(--danger)'], ['P0', 120, 'var(--accent)'], ['GND', 155, 'var(--muted)']].map(([n, y, c]) => `<rect x="196" y="${y - 9}" width="28" height="20" rx="3" fill="#e0b526"/>
  <text x="188" y="${y + 6}" text-anchor="end" font-size="15" font-weight="bold" fill="${c}">${n}</text>
  <line x1="224" y1="${y}" x2="420" y2="${y}" stroke="${c}" stroke-width="3"/>`).join('\n  ')}
  <circle cx="480" cy="120" r="46" fill="none" stroke="var(--fg)" stroke-width="3"/>
  <line x1="480" y1="120" x2="516" y2="92" stroke="var(--accent)" stroke-width="6" stroke-linecap="round"/>
  <text x="480" y="200" text-anchor="middle" font-size="17" fill="var(--muted)">가변저항</text>
  <text x="600" y="92" font-size="18" fill="var(--fg)">왼쪽 끝 → <tspan font-weight="bold" fill="var(--accent)">0</tspan></text>
  <text x="600" y="128" font-size="18" fill="var(--fg)">가운데 → <tspan font-weight="bold" fill="var(--accent)">약 512</tspan></text>
  <text x="600" y="164" font-size="18" fill="var(--fg)">오른쪽 끝 → <tspan font-weight="bold" fill="var(--accent)">1023</tspan></text>
</svg>`, caption: '3V · 핀 · GND 세 다리 · 가운데가 핀',
            notes: '<p>실물 가변저항이 있으면 돌려 가며 콘솔의 숫자를 보여 주세요.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: 'read_analog() 와 scale()', code: 'from microbit import *\n\nwhile True:\n    v = pin0.read_analog()\n    b = scale(v, from_=(0, 1023), to=(0, 9))\n    print(v, "->", b)\n    sleep(100)',
            points: ['0V → 0, 3.3V → 1023 (ADC)', '입력 가능 핀: <b>P0 · P1 · P2 · P3 · P4 · P10</b>', '<code>scale()</code> 로 범위 변환', '🧩 부품 탭의 가변저항으로 실험'],
            notes: '<p>scale 은 아주 유용하니 꼭 익히게 하세요. 직접 계산하려면 복잡합니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'diagram', title: 'PWM — 중간 밝기 만들기', html: FIG_PWM, caption: '빠르게 켰다 껐다 → 평균이 중간값',
            notes: '<p>"눈이 따라가지 못할 만큼 빠르게 깜빡이면 중간 밝기로 보인다" 는 점을 강조합니다. 형광등도 같은 원리입니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'code', title: '가변저항 → LED 밝기', code: 'from microbit import *\n\nwhile True:\n    v = pin1.read_analog()   # 가변저항\n    pin0.write_analog(v)     # LED\n    sleep(20)',
            points: ['입력을 읽어 그대로 출력', '실제 조광 스위치와 같은 원리', '단 4줄의 완성된 장치', '🧩 가변저항 P1 + LED P0'],
            notes: '<p>짧지만 완성된 "장치" 라는 점이 학생들에게 인상적입니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: '서보 모터', code: 'from microbit import *\n\npin0.set_analog_period(20)\n\ndef servo(angle):\n    pin0.write_analog(26 + (angle * 102) // 180)\n\nwhile True:\n    servo(0)\n    sleep(1000)\n    servo(90)\n    sleep(1000)\n    servo(180)\n    sleep(1000)',
            points: ['주기 20ms · 펄스 폭 0.5~2.5ms', '<code>servo()</code> 함수로 감싸기', '로봇 팔 · 자동문 · 방향타', '⚠ 별도 전원 + 공통 GND'],
            notes: '<p>실물 서보가 있으면 반드시 보여 주세요. 움직이는 것을 보면 반응이 완전히 다릅니다.</p><p>시간: 9분</p>'
          },
          {
            layout: 'practice', title: '실습 5-5. 빛 감지 자동 조명', desc: '어두워지면 LED 가 자동으로 켜지게 (도전: 어두울수록 밝게)',
            starter: 'from microbit import *\n\nwhile True:\n    light = pin1.read_analog()\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\n\nwhile True:\n    light = pin1.read_analog()\n    pin0.write_analog(1023 - light)\n    level = scale(light, from_=(0, 1023), to=(0, 4))\n    display.clear()\n    for y in range(level + 1):\n        for x in range(5):\n            display.set_pixel(x, 4 - y, 9)\n    sleep(100)\n',
            notes: '<p>가로등, 자동 야간 조명 같은 실제 사례와 연결해 이야기하면 좋습니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'summary', title: '5장 정리', bullets: ['큰 단자 0 · 1 · 2 · 3V · GND', '<code>write_digital</code> / <code>read_digital</code> + 풀업 · 풀다운', '<code>read_analog</code> 0~1023 (P0·P1·P2·P3·P4·P10)', '<code>write_analog</code> = PWM (밝기 · 소리 · 서보)', '<code>scale()</code> 로 범위 변환 · 모터는 별도 전원'],
            notes: '<p>5장 전체 정리. 다음 장 예고: 음악 — micro:bit 로 소리 내기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
