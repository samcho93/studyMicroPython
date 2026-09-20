/* Chapter 13. 통신 — 선과 무선
 * 원본: MicroPython on the BBC micro:bit — Network / Radio
 */
(function () {
  /* 두 보드를 0.5 배로 놓고, 실제 패드 위치에서 전선을 뽑는다 */
  const WS = 0.5, WY = 70, AX = 70, BX = 870;
  const wireX = (bx, pad) => bx + MB_FIG.ANCHOR.pad(pad)[0] * WS;
  const wireY = WY + MB_FIG.BOT * WS;

  const FIG_WIRE = `<svg viewBox="0 0 1280 470" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="30" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">선으로 연결하기 — 두 보드의 GND 를 반드시 잇는다</text>
  ${MB_FIG.board({ x: AX, y: WY, scale: WS, btnLabel: false, ics: false, leds: '0000001110011100111000000' })}
  ${MB_FIG.board({ x: BX, y: WY, scale: WS, btnLabel: false, ics: false, leds: '0000000000001000000000000' })}
  <text x="${AX + 230 * WS}" y="${WY - 8}" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--fg)">micro:bit A (보내는 쪽)</text>
  <text x="${BX + 230 * WS}" y="${WY - 8}" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--fg)">micro:bit B (받는 쪽)</text>
  ${[['1', 312, 'var(--accent)', '신호선 — P1 ↔ P1'], ['GND', 380, 'var(--danger)', '공통 접지 GND ↔ GND (필수!)']]
      .map(([pad, drop, color, note]) => {
        const x1 = wireX(AX, pad), x2 = wireX(BX, pad);
        return `<path d="M${x1.toFixed(1)} ${wireY} L${x1.toFixed(1)} ${drop} L${x2.toFixed(1)} ${drop} L${x2.toFixed(1)} ${wireY}" fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="${x1.toFixed(1)}" cy="${wireY}" r="6" fill="${color}"/><circle cx="${x2.toFixed(1)}" cy="${wireY}" r="6" fill="${color}"/>
  <text x="640" y="${drop - 12}" text-anchor="middle" font-size="19" font-weight="bold" fill="${color}">${note}</text>`;
      }).join('\n  ')}
  <rect x="120" y="398" width="1040" height="52" rx="10" fill="var(--danger)" opacity=".13" stroke="var(--danger)" stroke-width="2"/>
  <text x="640" y="431" text-anchor="middle" font-size="19" fill="var(--fg)">⚠ <tspan font-weight="bold">GND 를 연결하지 않으면</tspan> 두 보드가 “0V 가 어디인지” 를 몰라 신호를 읽을 수 없습니다</text>
</svg>`;

  const FIG_RADIO = `<svg viewBox="0 0 1280 400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">radio — 선 없이 여러 대가 동시에</text>
  ${[[300, 150, 'A'], [640, 110, 'B'], [980, 150, 'C'], [470, 290, 'D'], [810, 290, 'E']]
      .map(([x, y, name]) => MB_FIG.board({ x: x - 0.26 * 230, y: y - 0.26 * 188, scale: 0.26, labels: false, btnLabel: false, ics: false, leds: '0000000000001000000000000' }) +
        `<text x="${x}" y="${y + 74}" text-anchor="middle" font-size="24" font-weight="bold" fill="var(--fg)">${name}</text>`).join('\n  ')}
  ${[[300, 150], [640, 110], [980, 150], [470, 290], [810, 290]]
      .map(([x, y]) => [1, 2, 3].map((r) => `<circle cx="${x}" cy="${y}" r="${45 + r * 26}" fill="none" stroke="var(--accent)" stroke-width="1.6" opacity="${0.4 - r * 0.1}"/>`).join('')).join('\n  ')}
  <rect x="440" y="180" width="400" height="66" rx="14" fill="var(--card)" stroke="var(--accent)" stroke-width="3"/>
  <text x="640" y="212" text-anchor="middle" font-size="20" font-weight="bold" fill="var(--accent)">같은 group 의 보드끼리만</text>
  <text x="640" y="236" text-anchor="middle" font-size="17" fill="var(--muted)">radio.config(group=7)</text>
  <text x="640" y="378" text-anchor="middle" font-size="19" fill="var(--muted)">한 대가 보내면 <tspan font-weight="bold" fill="var(--fg)">주변의 모든 보드</tspan>가 받습니다 (브로드캐스트) · 약 70m 까지</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch13',
    no: '13',
    title: '통신 — 선과 무선',
    subtitle: 'USB 시리얼 · 핀 통신 · uart · radio',
    summary: 'micro:bit 가 다른 장치와 이야기하는 방법을 배웁니다. USB 로 PC 와 주고받는 시리얼 통신, 핀과 전선으로 두 보드를 잇는 방법, 그리고 선 없이 여러 대가 동시에 통신하는 radio 모듈을 다룹니다. 라디오로 채팅, 원격 조종, 여러 대가 함께하는 게임을 만들어 봅니다.',
    goals: [
      '<code>print()</code> 가 USB 시리얼로 나간다는 것을 이해하고 활용할 수 있다',
      '핀과 전선으로 두 보드가 신호를 주고받게 할 수 있다',
      '<code>radio.on()</code> · <code>send()</code> · <code>receive()</code> 로 무선 통신을 할 수 있다',
      '<code>group</code> 으로 통신 상대를 구분할 수 있다',
      '여러 대가 함께하는 프로그램을 설계할 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch13-1',
        title: '선으로 통신하기 — 시리얼과 핀',
        minutes: 45,
        goals: [
          '<code>print()</code> 와 USB 시리얼의 관계를 설명할 수 있다',
          '핀으로 신호를 주고받는 원리를 이해한다',
          '두 보드를 전선으로 연결해 통신할 수 있다',
          '<code>uart</code> 모듈의 쓰임을 안다'
        ],
        flow: [['통신이란', 6], ['USB 시리얼', 12], ['핀으로 신호 보내기', 16], ['uart', 8], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '통신 — 정보를 주고받기' },
          { type: 'p', html: '지금까지 만든 프로그램은 micro:bit <b>혼자</b> 동작했습니다. 이제 <b>다른 장치와 정보를 주고받는</b> 방법을 배웁니다. 크게 세 가지가 있습니다.' },
          {
            type: 'table', head: ['방법', '무엇으로', '특징'], rows: [
              ['<b>USB 시리얼</b>', 'USB 케이블 ↔ PC', '<code>print()</code> 로 손쉽게. 디버깅 · 데이터 수집에 활용'],
              ['<b>핀 통신</b>', '전선 ↔ 다른 보드 · 센서', '1:1 · 거리가 짧음. 간단한 신호에 적합'],
              ['<b>무선(radio)</b>', '전파 ↔ 다른 micro:bit', '선 없이 여러 대. 약 70m. (2교시)']
            ]
          },

          { type: 'h', text: 'USB 시리얼 — print() 의 정체' },
          { type: 'p', html: '지금까지 쓴 <code>print()</code> 는 사실 <b>USB 케이블을 통해 PC 로 글자를 보내는</b> 명령입니다. 이 강좌에서는 그 내용이 콘솔에 보였던 것이지요.' },
          {
            type: 'code', title: '예제 13-1. 센서 값을 PC 로 보내기', code: `from microbit import *

print("time,temperature,light")        # CSV 의 열 제목

while True:
    t = running_time() // 1000
    print(str(t) + "," + str(temperature()) + "," + str(display.read_light_level()))
    sleep(1000)`,
            desc: '쉼표로 구분해 출력하면 그대로 <b>CSV 형식</b>이 됩니다. 실제 보드를 연결하고 이 출력을 복사해 엑셀에 붙여 넣으면 바로 그래프를 그릴 수 있습니다.',
            expect: 'time,temperature,light\n1,24,128\n2,24,128 …',
            nondeterministic: true
          },
          { type: 'callout', kind: 'board', title: '실제 보드의 시리얼 보기', html: '<p>보드를 <b>🔌 보드</b> 로 연결하면 <code>print()</code> 출력이 이 강좌의 콘솔에 그대로 나타납니다. 다른 방법도 있습니다.</p><ul><li>아래 <code>&gt;&gt;&gt;</code> 칸에 직접 입력해 보드의 REPL 을 쓸 수 있습니다</li><li>Arduino IDE 의 시리얼 모니터, PuTTY, screen 등 다른 터미널 프로그램도 가능합니다 (115200bps)</li></ul>' },
          {
            type: 'code', title: '예제 13-2. 측정값에 표시 붙이기', code: `from microbit import *

# 값이 클 때 * 를 붙여 눈에 띄게
while True:
    level = display.read_light_level()
    mark = "  <== BRIGHT!" if level > 200 else ""
    print("light:", level, mark)
    sleep(500)`,
            hint: '🧭 센서 탭의 <b>빛</b> 슬라이더를 높여 보세요.',
            desc: '콘솔 출력을 잘 꾸미면 <b>디버깅</b>이 훨씬 쉬워집니다. 값이 이상할 때 바로 눈에 띄게 만드는 습관을 들이세요.',
            expect: 'light: 128 \nlight: 230   <== BRIGHT!',
            nondeterministic: true
          },

          { type: 'h', text: '핀으로 신호 보내기' },
          { type: 'p', html: '5장에서 배운 <code>write_digital()</code> 과 <code>read_digital()</code> 만으로도 <b>두 보드가 신호를 주고받을 수</b> 있습니다. 보내는 쪽이 핀을 1 로 만들면 받는 쪽이 1 을 읽는 것이지요.' },
          { type: 'figure', html: FIG_WIRE, caption: '그림 13-1. 두 보드를 전선으로 연결하기' },
          { type: 'callout', kind: 'warn', title: 'GND 를 반드시 연결하세요', html: '전압은 <b>기준점이 있어야</b> 잴 수 있습니다. 두 보드의 <code>GND</code> 를 연결하지 않으면 “0V 가 어디인지” 가 서로 달라 신호를 제대로 읽을 수 없습니다. <b>신호선 1개 + GND 1개</b>, 최소 두 가닥이 필요합니다.' },
          {
            type: 'code', title: '예제 13-3. 보내는 쪽 (sender.py)', code: `from microbit import *

# P1 을 신호선으로 쓴다
pin1.write_digital(0)
display.show(Image.ARROW_E)

while True:
    if button_a.was_pressed():
        # 짧은 펄스를 보낸다
        pin1.write_digital(1)
        sleep(50)
        pin1.write_digital(0)
        display.show(Image.YES)
        sleep(200)
        display.show(Image.ARROW_E)
    sleep(30)`,
            hint: '🔌 <b>핀 탭</b>에서 P1 의 값이 순간적으로 1 이 되는 것을 확인하세요.',
            desc: '버튼을 누르면 P1 에 <b>50ms 동안 1</b> 을 내보냅니다. 이런 짧은 신호를 <b>펄스(pulse)</b> 라고 합니다.',
            expect: 'A 를 누르면 P1 이 잠깐 1 이 됩니다.'
          },
          {
            type: 'code', title: '예제 13-4. 받는 쪽 (receiver.py)', code: `from microbit import *
import music

pin1.set_pull(pin1.PULL_DOWN)      # 평소 0
display.show(Image.ARROW_W)
count = 0
last = 0

while True:
    now = pin1.read_digital()
    # 0 → 1 로 바뀌는 순간만 센다
    if last == 0 and now == 1:
        count = count + 1
        display.show(count % 10)
        music.pitch(880, 100)
        print("신호 받음:", count)
    last = now
    sleep(10)`,
            hint: '🔌 <b>핀 탭</b>에서 P1 의 입력을 <b>1</b> 로 만들었다가 <b>자동</b>으로 되돌려 보세요. 신호가 하나 들어옵니다.',
            desc: '5장에서 배운 <b>변화하는 순간만 감지</b>하는 방법을 그대로 씁니다. 두 보드를 연결하면 A 보드의 버튼이 B 보드의 화면을 바꿉니다.',
            expect: '신호가 올 때마다 숫자가 올라가고 소리가 납니다.'
          },
          { type: 'callout', kind: 'more', title: '한 가닥으로 여러 정보 보내기', html: '<p>펄스 <b>개수</b>를 세면 여러 신호를 구분할 수 있습니다.</p><ul><li>짧은 펄스 1개 = “안녕”</li><li>2개 = “도와줘”</li><li>3개 = “끝”</li></ul><p>펄스 <b>길이</b>로 구분할 수도 있습니다(짧게 = 점, 길게 = 선 → <b>모스 부호</b>). 실제 통신 규약(프로토콜)도 이런 약속의 모음입니다.</p>' },
          {
            type: 'code', title: '예제 13-5. 펄스 개수로 메시지 보내기', code: `from microbit import *

MESSAGES = ["HELLO", "HELP", "BYE"]
index = 0

pin1.write_digital(0)
display.show(index + 1)

while True:
    if button_a.was_pressed():
        index = (index + 1) % len(MESSAGES)
        display.show(index + 1)

    if button_b.was_pressed():
        # index + 1 개의 펄스를 보낸다
        for i in range(index + 1):
            pin1.write_digital(1)
            sleep(40)
            pin1.write_digital(0)
            sleep(120)
        display.scroll(MESSAGES[index], delay=60)
        display.show(index + 1)

    sleep(30)`,
            desc: 'A 로 메시지를 고르고 B 로 보냅니다. 받는 쪽에서는 <b>일정 시간 안에 들어온 펄스 개수</b>를 세어 어떤 메시지인지 알아냅니다. 통신 규약을 직접 설계해 본 셈입니다.',
            expect: 'A 로 1~3 을 고르고 B 를 누르면 그 개수만큼 펄스가 나갑니다.'
          },

          { type: 'h', text: 'uart — 진짜 시리얼 통신' },
          { type: 'p', html: '펄스를 직접 세는 대신, <b>UART</b> 라는 표준 방식을 쓰면 <b>글자를 그대로</b> 주고받을 수 있습니다. micro:bit 의 <code>uart</code> 모듈이 이 일을 합니다.' },
          {
            type: 'code', title: '예제 13-6. uart 로 글자 보내기 (개념)', code: `from microbit import *

# P0 = 보내는 선(TX), P1 = 받는 선(RX)
uart.init(baudrate=9600, tx=pin0, rx=pin1)

display.show(Image.ARROW_E)

while True:
    if button_a.was_pressed():
        uart.write("HELLO\\n")
        display.show(Image.YES)
        sleep(200)
        display.show(Image.ARROW_E)

    if uart.any():                      # 받은 것이 있나?
        data = uart.readline()
        if data:
            text = str(data, "utf-8").strip()
            print("받음:", text)
            display.scroll(text, delay=60)

    sleep(30)`,
            run: false,
            desc: '두 보드를 <b>서로 엇갈리게</b> 연결합니다 — A 의 TX ↔ B 의 RX, A 의 RX ↔ B 의 TX, 그리고 GND ↔ GND. <code>uart.write()</code> 로 보내고 <code>uart.any()</code> · <code>uart.readline()</code> 으로 받습니다.'
          },
          { type: 'callout', kind: 'warn', title: 'uart.init() 을 쓰면 print() 가 막힙니다', html: '<code>uart.init(tx=…, rx=…)</code> 으로 핀을 지정하면 USB 시리얼 연결이 <b>그 핀으로 옮겨갑니다</b>. 그 뒤로는 <code>print()</code> 가 PC 로 가지 않고 REPL 도 쓸 수 없습니다. 다시 USB 로 돌리려면 <code>uart.init(115200)</code> 을 인수 없이 부르거나 보드를 리셋하세요. <b>이 강좌의 시뮬레이터에서는 uart 를 쓰지 않는 것을 권장합니다.</b>' },
          {
            type: 'table', head: ['메서드', '하는 일'], rows: [
              ['<code>uart.init(baudrate, tx=, rx=)</code>', '통신 시작 (속도 · 핀 지정)'],
              ['<code>uart.write(데이터)</code>', '보내기 (문자열 또는 bytes)'],
              ['<code>uart.any()</code>', '받은 데이터가 있는지'],
              ['<code>uart.read(n)</code>', 'n 바이트 읽기 (없으면 <code>None</code>)'],
              ['<code>uart.readline()</code>', '줄바꿈까지 한 줄 읽기']
            ]
          },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 콘솔에 그래프 그리기', code: `from microbit import *

print("light |" + "-" * 40 + "| 시간에 따른 밝기")

while True:
    light = display.read_light_level()          # 0 ~ 255
    bars = light * 40 // 255
    print("{:5d} |".format(light) + "#" * bars + " " * (40 - bars) + "|")
    sleep(400)`,
            hint: '🧭 <b>센서 탭</b>의 빛 슬라이더를 천천히 움직이며 콘솔을 보세요.',
            desc: '콘솔에 <code>#</code> 을 값만큼 찍으면 <b>실시간 그래프</b>가 됩니다. 별다른 도구 없이 값의 변화를 한눈에 볼 수 있어 센서를 다룰 때 아주 유용합니다. <code>"{:5d}".format(n)</code> 은 숫자를 5칸에 맞춰 찍습니다.',
            expect: '  128 |####################                    |',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ②. 펄스 길이 재기', code: `from microbit import *
from machine import time_pulse_us

pin1.set_pull(pin1.PULL_DOWN)
display.show(Image.ARROW_W)

while True:
    # P1 이 1 이 되는 동안의 길이를 마이크로초로 잰다 (최대 0.5초 대기)
    us = time_pulse_us(pin1, 1, 500000)

    if us > 0:
        print("펄스 길이:", us, "us =", us / 1000, "ms")
        display.show(Image.YES if us > 30000 else Image.NO)
        sleep(400)
        display.show(Image.ARROW_W)

    sleep(20)`,
            hint: '🔌 <b>핀 탭</b>에서 P1 을 1 로 바꿨다가 자동으로 되돌려 보세요.',
            desc: '<code>time_pulse_us()</code> 는 신호가 <b>얼마나 오래</b> 유지됐는지 마이크로초 단위로 잽니다. 초음파 거리 센서(HC-SR04)가 거리를 재는 방법이 바로 이것입니다 — 소리가 갔다 오는 시간을 재는 것이지요.',
            expect: '펄스 길이: 40000 us = 40.0 ms',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. 핀으로 모스 부호 주고받기', code: `from microbit import *

DOT_MAX = 300             # 이보다 짧으면 점, 길면 선

pin1.set_pull(pin1.PULL_DOWN)
marks = []
last = 0
high_at = 0
idle_at = running_time()

display.show(Image.ARROW_W)

while True:
    now = pin1.read_digital()

    if last == 0 and now == 1:
        high_at = running_time()
    elif last == 1 and now == 0:
        length = running_time() - high_at
        marks.append("." if length < DOT_MAX else "-")
        print("받음:", marks)
        display.show(len(marks))
        idle_at = running_time()

    # 1초 동안 조용하면 한 글자가 끝난 것으로 본다
    if marks and running_time() - idle_at > 1000:
        code = "".join(marks)
        print("글자 완성:", code)
        display.scroll(code, delay=90)
        marks = []
        display.show(Image.ARROW_W)

    last = now
    sleep(10)`,
            hint: '🔌 <b>핀 탭</b>에서 P1 을 1 ↔ 0 으로 여러 번 바꿔 보세요. 짧게 바꾸면 점, 길게 두면 선입니다.',
            desc: '신호가 유지된 <b>길이</b>로 점과 선을 구분하고, 조용한 시간이 길어지면 한 글자가 끝난 것으로 봅니다. 통신 규약을 직접 만드는 좋은 연습입니다.',
            expect: "받음: ['.', '.', '.']\n글자 완성: ...",
            nondeterministic: true
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              '<code>print()</code> 는 <b>USB 시리얼</b>로 PC 에 글자를 보냅니다. 쉼표로 나누면 그대로 CSV 가 됩니다.',
              '핀 하나와 <b>GND</b> 만 연결하면 <code>write_digital()</code> / <code>read_digital()</code> 으로 신호를 주고받을 수 있습니다.',
              '<b>GND 를 반드시 연결</b>해야 합니다 — 전압의 기준점이 필요하기 때문입니다.',
              '펄스의 <b>개수</b>나 <b>길이</b>로 여러 메시지를 구분할 수 있습니다 (통신 규약의 기본 아이디어).',
              '<code>uart</code> 모듈로 글자를 그대로 주고받을 수 있지만, 핀을 지정하면 <b><code>print()</code> 가 막힙니다</b>.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 13-1. 시리얼 데이터 수집기',
            level: 1,
            desc: '<p>센서 값을 <b>CSV 형식</b>으로 콘솔에 출력하는 프로그램을 만드세요.</p><ul><li>첫 줄에 열 제목: <code>time,temp,light,sound</code></li><li>2초마다 한 줄씩 출력</li><li>A 를 누르면 출력을 멈추고, 다시 누르면 재개합니다</li><li>출력 중에는 화면에 하트가 깜빡입니다</li></ul><p>콘솔의 내용을 복사해 스프레드시트에 붙여 넣으면 그래프를 그릴 수 있습니다.</p>',
            hint: '값들을 문자열로 이으려면 <code>str()</code> 로 바꿔 <code>+</code> 로 붙이거나, <code>print(a, b, c, sep=",")</code> 를 쓰세요.',
            starter: 'from microbit import *\n\nprint("time,temp,light,sound")\nrecording = True\n\nwhile True:\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\n\nprint("time,temp,light,sound")\nrecording = True\nnext_time = running_time()\n\nwhile True:\n    if button_a.was_pressed():\n        recording = not recording\n        display.show(Image.YES if recording else Image.NO)\n        sleep(400)\n\n    if recording and running_time() >= next_time:\n        print(running_time() // 1000,\n              temperature(),\n              display.read_light_level(),\n              microphone.sound_level(),\n              sep=",")\n        next_time = next_time + 2000\n\n    if recording:\n        display.show(Image.HEART if (running_time() // 500) % 2 else Image.HEART_SMALL)\n    else:\n        display.show(Image.SQUARE_SMALL)\n\n    sleep(100)\n'
          },
          {
            title: '실습 13-2. 핀 신호 주고받기',
            level: 2,
            desc: '<p>보드 <b>두 대</b>(또는 시뮬레이터의 핀 탭)를 써서 신호를 주고받는 프로그램을 만드세요.</p><ul><li><b>보내는 쪽</b>: A 를 누르면 펄스 1개, B 를 누르면 펄스 2개를 P1 로 보냅니다</li><li><b>받는 쪽</b>: 0.5초 안에 들어온 펄스 개수를 세어 1개면 <code>Image.HAPPY</code>, 2개면 <code>Image.HEART</code> 를 보여 줍니다</li><li>두 프로그램을 <b>한 파일에</b> 넣고, 시작할 때 A 를 누르고 있으면 보내는 쪽 · 아니면 받는 쪽으로 동작하게 해 보세요</li></ul>',
            hint: '시작 모드 판단: <code>sender = button_a.is_pressed()</code> 를 맨 위에 두고 <code>if sender:</code> 로 나눕니다. 펄스 세기는 첫 펄스가 들어온 시각을 기억해 500ms 동안 셉니다.',
            starter: 'from microbit import *\n\n# 시작할 때 A 를 누르고 있으면 보내는 쪽\nsender = button_a.is_pressed()\ndisplay.scroll("TX" if sender else "RX", delay=60)\n\nif sender:\n    pin1.write_digital(0)\nelse:\n    pin1.set_pull(pin1.PULL_DOWN)\n\nwhile True:\n    # TODO\n    sleep(20)\n',
            solution: 'from microbit import *\n\nsender = button_a.is_pressed()\ndisplay.scroll("TX" if sender else "RX", delay=60)\n\nif sender:\n    pin1.write_digital(0)\nelse:\n    pin1.set_pull(pin1.PULL_DOWN)\n\n\ndef pulse(n):\n    for i in range(n):\n        pin1.write_digital(1)\n        sleep(40)\n        pin1.write_digital(0)\n        sleep(120)\n\n\nlast = 0\ncount = 0\nfirst_at = None\n\nwhile True:\n    if sender:\n        if button_a.was_pressed():\n            pulse(1)\n            display.show(1)\n        if button_b.was_pressed():\n            pulse(2)\n            display.show(2)\n    else:\n        now = pin1.read_digital()\n        if last == 0 and now == 1:\n            count = count + 1\n            if first_at is None:\n                first_at = running_time()\n        last = now\n\n        if first_at is not None and running_time() - first_at > 500:\n            if count == 1:\n                display.show(Image.HAPPY)\n            elif count == 2:\n                display.show(Image.HEART)\n            else:\n                display.show(Image.CONFUSED)\n            print("받은 펄스:", count)\n            count = 0\n            first_at = None\n\n    sleep(20)\n'
          }
        ],
        quiz: [
          {
            q: '<code>print()</code> 는 실제 micro:bit 에서 어디로 출력되나요?', options: ['LED 화면', 'USB 시리얼(PC)', '파일', '아무 데도'], answer: 1,
            explain: 'USB 케이블을 통해 PC 로 글자를 보냅니다. 이 강좌에서는 그 내용이 콘솔에 보입니다.'
          },
          {
            q: '두 micro:bit 를 전선으로 연결할 때 <b>반드시</b> 이어야 하는 핀은?', options: ['3V', 'GND', 'P0', 'USB'], answer: 1,
            explain: '전압은 기준점이 있어야 잴 수 있습니다. <b>GND(0V)</b> 를 연결하지 않으면 신호를 읽을 수 없습니다.'
          },
          {
            q: '짧은 신호를 잠깐 보냈다 끄는 것을 무엇이라 하나요?', options: ['펄스(pulse)', '아날로그', '풀업', '스캔'], answer: 0,
            explain: '<b>펄스</b> 입니다. 개수나 길이로 여러 메시지를 구분할 수 있습니다.'
          },
          {
            q: '<code>uart.init(tx=pin0, rx=pin1)</code> 을 실행하면?', options: ['속도가 빨라진다', '<code>print()</code> 가 PC 로 가지 않게 된다', 'radio 가 켜진다', '아무 변화 없다'], answer: 1,
            explain: 'USB 시리얼이 지정한 핀으로 <b>옮겨갑니다</b>. 그 뒤로는 <code>print()</code> 와 REPL 을 쓸 수 없습니다.'
          },
          {
            q: '센서 값을 엑셀에서 그래프로 그리기 좋게 출력하려면?', options: ['한 줄에 하나씩 그냥 출력', '쉼표로 구분해 CSV 형식으로 출력', '그림으로 출력', '불가능하다'], answer: 1,
            explain: '<code>print(a, b, c, sep=",")</code> 처럼 <b>쉼표로 구분</b>하면 그대로 CSV 가 되어 스프레드시트에 붙여 넣을 수 있습니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '선으로 통신하기', subtitle: 'Chapter 13 · 시리얼과 핀', badge: '1교시',
            notes: '<p>보드가 두 대 이상 있으면 짝을 지어 실습하면 좋습니다.</p><p>시간: 1분</p>'
          },
          {
            layout: 'table', title: '세 가지 통신 방법', head: ['방법', '무엇으로', '특징'], rows: [
              ['USB 시리얼', 'USB ↔ PC', '<code>print()</code> · 디버깅'],
              ['핀 통신', '전선 ↔ 보드', '1:1 · 짧은 거리'],
              ['무선 radio', '전파 ↔ 여러 대', '선 없이 · 약 70m']],
            notes: '<p>일상에서 쓰는 통신(와이파이, 블루투스, USB)과 비교해 이야기하면 좋습니다.</p><p>시간: 5분</p>'
          },
          {
            layout: 'code', title: 'print() 의 정체 = USB 시리얼', code: 'from microbit import *\n\nprint("time,temperature,light")\n\nwhile True:\n    print(running_time() // 1000,\n          temperature(),\n          display.read_light_level(),\n          sep=",")\n    sleep(1000)',
            points: ['<code>print()</code> → USB 케이블 → PC', '쉼표로 나누면 <b>CSV</b>', '엑셀에 붙여 넣어 그래프', '<code>sep=","</code> 로 간단히'],
            notes: '<p>실제로 콘솔 내용을 복사해 스프레드시트에 붙여 넣어 보여 주면 효과적입니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'diagram', title: '두 보드를 전선으로', html: FIG_WIRE, caption: '신호선 1개 + GND 1개 = 최소 두 가닥',
            notes: '<p>GND 를 빼먹으면 안 된다는 점을 꼭 강조하세요. 가장 흔한 실패 원인입니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'code', title: '보내는 쪽 · 받는 쪽', code: '# 보내는 쪽\nif button_a.was_pressed():\n    pin1.write_digital(1)\n    sleep(50)\n    pin1.write_digital(0)\n\n# 받는 쪽\npin1.set_pull(pin1.PULL_DOWN)\nnow = pin1.read_digital()\nif last == 0 and now == 1:\n    count += 1\n    display.show(count % 10)\nlast = now',
            points: ['짧은 신호 = <b>펄스</b>', '받는 쪽은 <code>PULL_DOWN</code>', '<b>변하는 순간</b>만 세기 (5장)', '펄스 개수로 메시지 구분'],
            notes: '<p>5장의 채터링 방지 코드와 똑같은 구조입니다. 반복해서 나오는 패턴임을 짚어 주세요.</p><p>시간: 10분</p>'
          },
          {
            layout: 'bullets', title: '통신 규약(프로토콜)을 만들어 보자',
            bullets: ['펄스 <b>1개</b> = “안녕”', '펄스 <b>2개</b> = “도와줘”', '펄스 <b>3개</b> = “끝”', '길이로 구분하면 → <b>모스 부호</b>'],
            notes: '<p>"약속을 정하는 것이 곧 프로토콜" 이라고 설명하면 인터넷 프로토콜까지 자연스럽게 연결됩니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'practice', title: '실습 13-1. 시리얼 데이터 수집기', desc: 'CSV 형식으로 2초마다 출력, A 로 시작 · 정지',
            starter: 'from microbit import *\n\nprint("time,temp,light,sound")\n\nwhile True:\n    # TODO\n    sleep(100)\n',
            solution: 'from microbit import *\n\nprint("time,temp,light,sound")\nrecording = True\nnext_time = running_time()\n\nwhile True:\n    if button_a.was_pressed():\n        recording = not recording\n        display.show(Image.YES if recording else Image.NO)\n        sleep(400)\n\n    if recording and running_time() >= next_time:\n        print(running_time() // 1000, temperature(),\n              display.read_light_level(), microphone.sound_level(), sep=",")\n        next_time = next_time + 2000\n\n    sleep(100)\n',
            notes: '<p>11장의 log 모듈과 비교하면 좋습니다. 둘 다 데이터를 남기는 방법입니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['<code>print()</code> = USB 시리얼 · CSV 로 출력하면 분석 편리', '핀 + <b>GND</b> 로 신호 주고받기', '펄스의 개수 · 길이로 메시지 구분', '<code>uart</code> 는 글자를 그대로 (단, print 가 막힘)', 'GND 연결은 필수!'],
            notes: '<p>다음 시간 예고: 선 없이 여러 대가 통신하는 radio.</p><p>시간: 2분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch13-2',
        title: 'radio — 무선으로 이야기하기',
        minutes: 45,
        goals: [
          '<code>radio.on()</code> · <code>send()</code> · <code>receive()</code> 를 쓸 수 있다',
          '<code>group</code> 으로 통신 상대를 구분할 수 있다',
          '받은 메시지를 해석해 동작하는 프로그램을 만들 수 있다',
          '여러 대가 함께하는 프로그램을 설계할 수 있다'
        ],
        flow: [['radio 소개', 6], ['보내고 받기', 14], ['group 과 설정', 10], ['프로젝트', 12], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: 'radio — 선 없이, 여러 대가' },
          { type: 'p', html: 'micro:bit 안에는 <b>2.4GHz 무선 칩</b>이 들어 있습니다. <code>radio</code> 모듈로 <b>선 없이</b> 다른 micro:bit 와 메시지를 주고받을 수 있습니다. 실내에서 보통 <b>10~30m</b>, 트인 곳에서는 <b>70m</b> 정도까지 닿습니다.' },
          { type: 'figure', html: FIG_RADIO, caption: '그림 13-2. radio 는 주변의 모든 보드에 동시에 전달됩니다' },
          { type: 'callout', kind: 'info', title: '시뮬레이터의 가상 짝 보드', html: '시뮬레이터에는 micro:bit 가 한 대뿐이므로, <b>📡 무선 탭</b>의 <b>가상 짝 보드</b>가 대신 대답합니다. “그대로 되돌려줌(echo)”, “re: 를 붙여 답장”, “대답 없음” 중에서 고를 수 있고, 직접 메시지를 수신함에 넣어 볼 수도 있습니다. 실제 수업에서는 <b>두 대 이상</b>으로 실습하세요.' },

          { type: 'h', text: '보내고 받기' },
          {
            type: 'code', title: '예제 13-7. 첫 무선 메시지', code: `from microbit import *
import radio

radio.on()                 # 무선 켜기 (전력을 쓰므로 꼭 필요할 때만)
radio.config(group=7)      # 같은 group 끼리만 통신

display.show(Image.ARROW_E)

while True:
    # 보내기
    if button_a.was_pressed():
        radio.send("HELLO")
        display.show(Image.YES)
        sleep(200)
        display.show(Image.ARROW_E)

    # 받기
    msg = radio.receive()
    if msg:
        print("받음:", msg)
        display.scroll(msg, delay=60)
        display.show(Image.ARROW_E)

    sleep(30)`,
            hint: '📡 <b>무선 탭</b>에서 짝 보드를 “그대로 되돌려줌” 으로 두고 A 를 눌러 보세요. 보낸 메시지가 그대로 돌아옵니다.',
            desc: '<code>radio.on()</code> 으로 켜고, <code>send()</code> 로 보내고, <code>receive()</code> 로 받습니다. <b>받은 것이 없으면 <code>None</code></b> 이 나오므로 <code>if msg:</code> 로 확인해야 합니다.',
            expect: '받음: HELLO (짝 보드가 되돌려 준 메시지)'
          },
          { type: 'callout', kind: 'warn', title: 'radio.on() 을 잊지 마세요', html: '<code>radio.on()</code> 없이 <code>send()</code> 를 부르면 <code>ValueError: radio is not enabled</code> 가 납니다. 반대로 무선을 안 쓸 때는 <code>radio.off()</code> 로 꺼 두면 <b>전력을 아낄 수 있습니다</b>.' },
          {
            type: 'code', title: '예제 13-8. 무선 채팅', code: `from microbit import *
import radio

radio.on()
radio.config(group=7)

MESSAGES = ["HI", "OK", "NO", "HELP", "BYE"]
index = 0
display.scroll(MESSAGES[index], delay=60)

while True:
    if button_a.was_pressed():
        index = (index + 1) % len(MESSAGES)
        display.scroll(MESSAGES[index], delay=60)

    if button_b.was_pressed():
        radio.send(MESSAGES[index])
        display.show(Image.ARROW_E)
        sleep(300)

    msg = radio.receive()
    if msg:
        display.show(Image.ARROW_W)
        sleep(200)
        display.scroll(msg, delay=70)

    sleep(30)`,
            hint: '📡 무선 탭에서 직접 메시지를 입력해 수신함에 넣어 보세요. 또는 짝 보드를 “re: 를 붙여 답장” 으로 바꿔 보세요.',
            desc: 'A 로 보낼 말을 고르고 B 로 보냅니다. 받으면 왼쪽 화살표가 뜬 뒤 내용이 흘러갑니다. <b>두 대가 있으면 진짜 채팅</b>이 됩니다.',
            expect: 'A 로 메시지를 고르고 B 로 보냅니다. 받은 메시지가 흘러갑니다.'
          },
          {
            type: 'code', title: '예제 13-9. 원격 조종 — 보내는 쪽', code: `from microbit import *
import radio

radio.on()
radio.config(group=7)

display.show(Image.ARROW_E)

while True:
    g = accelerometer.current_gesture()

    if g in ("left", "right", "up", "down"):
        radio.send(g)
        print("보냄:", g)
        sleep(200)

    if button_a.was_pressed():
        radio.send("heart")
    if button_b.was_pressed():
        radio.send("clear")

    sleep(50)`,
            hint: '🧭 센서 탭의 기울기 버튼을 누르고, 📡 무선 탭의 “보낸 메시지” 목록에서 확인하세요.',
            desc: '기울이면 방향 이름을, 버튼을 누르면 명령을 보냅니다. <b>리모컨</b> 역할입니다.',
            expect: '보냄: left\n보냄: right …',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 13-10. 원격 조종 — 받는 쪽', code: `from microbit import *
import radio

radio.on()
radio.config(group=7)

ARROWS = {
    "left": Image.ARROW_W,
    "right": Image.ARROW_E,
    "up": Image.ARROW_N,
    "down": Image.ARROW_S,
    "heart": Image.HEART,
}

display.show(Image.ARROW_W)

while True:
    msg = radio.receive()
    if msg:
        print("받음:", msg)
        if msg == "clear":
            display.clear()
        else:
            display.show(ARROWS.get(msg, Image.CONFUSED))
    sleep(30)`,
            hint: '📡 무선 탭의 입력 칸에 <code>left</code>, <code>right</code>, <code>heart</code>, <code>clear</code> 를 넣어 보세요.',
            desc: '9장에서 배운 <b>딕셔너리</b>로 메시지를 그림에 대응시켰습니다. 알 수 없는 메시지는 <code>Image.CONFUSED</code> 로 처리합니다. 두 대를 쓰면 한 대가 다른 한 대를 조종합니다.',
            expect: '받은 메시지에 맞는 화살표가 나타납니다.'
          },

          { type: 'h', text: 'group 과 설정' },
          { type: 'p', html: 'radio 는 <b>주변의 모든 보드</b>에 메시지를 뿌립니다. 교실에서 여러 조가 동시에 실습하면 서로의 메시지가 섞이겠지요. 이를 막는 것이 <b><code>group</code></b> 입니다.' },
          {
            type: 'table', head: ['설정', '뜻', '값'], rows: [
              ['<code>group</code>', '<b>조 번호</b>. 같은 group 끼리만 통신', '0 ~ 255 (기본 0)'],
              ['<code>channel</code>', '주파수 채널', '0 ~ 83 (기본 7)'],
              ['<code>power</code>', '송신 세기 (클수록 멀리)', '0 ~ 7 (기본 6)'],
              ['<code>length</code>', '한 메시지의 최대 길이', '1 ~ 251 바이트 (기본 32)'],
              ['<code>queue</code>', '받아 둘 메시지 개수', '기본 3'],
              ['<code>data_rate</code>', '전송 속도', '<code>radio.RATE_1MBIT</code> 등']
            ]
          },
          {
            type: 'code', title: '예제 13-11. 조 번호 정하기', code: `from microbit import *
import radio

MY_GROUP = 3            # 우리 조 번호 (조마다 다르게!)

radio.on()
radio.config(group=MY_GROUP, power=7)

display.show(MY_GROUP)

while True:
    if button_a.was_pressed():
        radio.send("G" + str(MY_GROUP) + " HI")
        display.show(Image.YES)
        sleep(200)
        display.show(MY_GROUP)

    msg = radio.receive()
    if msg:
        display.scroll(msg, delay=60)
        display.show(MY_GROUP)

    sleep(30)`,
            desc: '조마다 <code>MY_GROUP</code> 을 다르게 정하면 <b>서로 간섭하지 않습니다</b>. 화면에 조 번호를 띄워 두면 확인하기 편합니다. 수업 전에 조별 번호를 정해 두세요.',
            expect: '같은 조의 메시지만 받습니다.'
          },
          { type: 'callout', kind: 'more', title: '메시지 길이 제한', html: '<p>기본 설정으로는 한 번에 <b>32바이트</b>(영문 32글자 정도)까지 보낼 수 있습니다. 더 긴 메시지를 보내려면 <code>radio.config(length=100)</code> 처럼 늘리거나, <b>여러 번 나눠</b> 보내야 합니다.</p><p>한글은 한 글자에 3바이트를 쓰므로 기본 설정으로는 10글자 정도만 들어갑니다.</p>' },
          {
            type: 'code', title: '예제 13-12. 센서 값을 무선으로 보내기', code: `from microbit import *
import radio

radio.on()
radio.config(group=7)

display.show(Image.ARROW_E)

while True:
    # "T:24,L:128" 처럼 짧게 만들어 보낸다
    msg = "T:" + str(temperature()) + ",L:" + str(display.read_light_level())
    radio.send(msg)
    print("보냄:", msg)

    got = radio.receive()
    if got and got.startswith("T:"):
        # "T:24,L:128" 을 나눠 읽기
        parts = got.split(",")
        temp = parts[0][2:]
        light = parts[1][2:]
        print("받음 → 온도", temp, "빛", light)
        display.show(str(temp)[0])

    sleep(2000)`,
            hint: '📡 무선 탭에서 짝 보드를 “그대로 되돌려줌” 으로 두고 실행하세요.',
            desc: '여러 값을 한 메시지에 담을 때는 <b>구분 기호</b>(여기서는 <code>,</code> 와 <code>:</code>)를 정해 두고 <code>split()</code> 으로 나눠 읽습니다. 통신 규약을 만드는 기본 방법입니다.',
            expect: '보냄: T:24,L:128\n받음 → 온도 24 빛 128',
            nondeterministic: true
          },
          {
            type: 'table', head: ['함수', '하는 일'], rows: [
              ['<code>radio.on()</code> / <code>off()</code>', '무선 켜기 / 끄기 (끄면 전력 절약)'],
              ['<code>radio.config(group=, channel=, power=, length=)</code>', '설정 바꾸기'],
              ['<code>radio.send(문자열)</code>', '문자열 보내기'],
              ['<code>radio.receive()</code>', '받기 (없으면 <code>None</code>)'],
              ['<code>radio.send_bytes(b)</code> / <code>receive_bytes()</code>', 'bytes 로 주고받기'],
              ['<code>radio.receive_full()</code>', '(데이터, 신호 세기, 시각) 을 함께 받기'],
              ['<code>radio.reset()</code>', '설정을 기본값으로']
            ]
          },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 누가 보냈는지 적어 보내기', code: `from microbit import *
import radio

MY_ID = 1                 # 보드마다 다르게 (1, 2, 3 …)

radio.on()
radio.config(group=7)
display.show(MY_ID)

while True:
    if button_a.was_pressed():
        msg = str(MY_ID) + ":HELLO"
        radio.send(msg)
        print("보냄:", msg)

    got = radio.receive()
    if got and ":" in got:
        sender, text = got.split(":", 1)
        if int(sender) != MY_ID:                 # 내가 보낸 건 무시
            print(sender, "번에게서:", text)
            display.scroll(sender + " " + text, delay=70)
            display.show(MY_ID)

    sleep(40)`,
            hint: '📡 <b>무선 탭</b>의 입력 칸에 <code>2:HI</code> 처럼 넣어 보세요.',
            desc: 'radio 는 <b>누가 보냈는지 알려 주지 않습니다</b>. 그래서 메시지 앞에 번호를 붙이는 <b>규약</b>을 직접 만들어야 합니다. <code>split(":", 1)</code> 은 첫 번째 콜론에서만 나눠 본문에 콜론이 있어도 안전합니다.',
            expect: '2 번에게서: HI',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ②. 신호가 얼마나 센가 (거리 가늠)', code: `from microbit import *
import radio

radio.on()
radio.config(group=7, power=7)
display.show(Image.ARROW_E)

while True:
    if button_a.was_pressed():
        radio.send("PING")

    full = radio.receive_full()
    if full:
        data, rssi, when = full
        text = str(data, "utf-8")
        print(text, "/ 신호 세기:", rssi, "dBm")

        # -40(아주 가까움) ~ -95(아주 멈)
        level = max(0, min(4, (rssi + 95) * 5 // 55))
        display.clear()
        for y in range(level + 1):
            for x in range(5):
                display.set_pixel(x, 4 - y, 9)
        sleep(500)
        display.show(Image.ARROW_E)

    sleep(40)`,
            hint: '📡 무선 탭에서 짝 보드를 “그대로 되돌려줌” 으로 두고 A 를 눌러 보세요.',
            desc: '<code>receive_full()</code> 은 <b>(내용, 신호 세기, 시각)</b> 세 가지를 함께 돌려줍니다. 신호 세기(RSSI)는 음수이고 <b>0 에 가까울수록 가깝습니다</b>. 실제 보드 두 대를 멀리 떨어뜨리며 막대가 줄어드는 것을 확인해 보세요.',
            expect: 'PING / 신호 세기: -50 dBm',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. 잘 받았다고 답장하기 (ACK)', code: `from microbit import *
import radio

MY_ID = 1
radio.on()
radio.config(group=7)

waiting = None
sent_at = 0
seq = 0

display.show(Image.ARROW_E)

while True:
    # A: 번호를 붙여 보내고 답장을 기다린다
    if button_a.was_pressed() and waiting is None:
        seq = seq + 1
        waiting = seq
        sent_at = running_time()
        radio.send("MSG:" + str(MY_ID) + ":" + str(seq))
        display.show(Image.ARROW_E)
        print("보냄 #" + str(seq))

    got = radio.receive()
    if got:
        parts = got.split(":")
        if parts[0] == "MSG":
            # 받았으면 바로 답장
            radio.send("ACK:" + parts[1] + ":" + parts[2])
            display.show(Image.ARROW_W)
            print("받고 답장 #" + parts[2])
            sleep(200)
        elif parts[0] == "ACK" and waiting is not None and int(parts[2]) == waiting:
            rtt = running_time() - sent_at
            print("답장 확인 #" + parts[2], "/ 왕복", rtt, "ms")
            display.show(Image.YES)
            waiting = None
            sleep(400)

    # 1초 안에 답장이 없으면 실패로 본다
    if waiting is not None and running_time() - sent_at > 1000:
        print("답장 없음 #" + str(waiting))
        display.show(Image.NO)
        waiting = None
        sleep(400)

    display.show(Image.ARROW_E) if waiting is None else None
    sleep(40)`,
            hint: '📡 무선 탭에서 짝 보드를 “그대로 되돌려줌” 으로 두면 자기 메시지가 돌아와 ACK 흐름을 볼 수 있습니다.',
            desc: '무선은 메시지가 <b>사라질 수 있습니다</b>. 받은 쪽이 “잘 받았다(ACK)” 고 답장하고, 보낸 쪽은 일정 시간 안에 답장이 없으면 실패로 처리합니다. 인터넷의 TCP 도 같은 아이디어를 씁니다.',
            expect: '보냄 #1\n받고 답장 #1\n답장 확인 #1 / 왕복 24 ms',
            nondeterministic: true
          },

          { type: 'h', text: '🚀 응용 예제 — 여러 대로 함께' },
          { type: 'p', html: 'radio 는 <b>여러 대가 있을 때</b> 진가를 발휘합니다. 시뮬레이터에서는 📡 무선 탭의 가상 짝 보드로 흐름을 확인하고, 교실에서는 조별로 <code>group</code> 번호를 정해 실제로 해 보세요.' },
          {
            type: 'code', title: '응용 예제 13-1. 무선 채팅방', code: `from microbit import *
import radio
import music

MY_ID = 1                 # 보드마다 다르게!
GROUP = 7

WORDS = ["HI", "OK", "NO", "WAIT", "HELP", "BYE", "GOOD", "?"]
index = 0

radio.on()
radio.config(group=GROUP)

display.scroll("ID" + str(MY_ID), delay=60)
display.scroll(WORDS[index], delay=70)

while True:
    # A: 보낼 말 고르기
    if button_a.was_pressed():
        index = (index + 1) % len(WORDS)
        display.scroll(WORDS[index], delay=70)

    # B: 보내기
    if button_b.was_pressed():
        radio.send(str(MY_ID) + ">" + WORDS[index])
        display.show(Image.ARROW_E)
        music.pitch(900, 60)
        sleep(300)
        display.scroll(WORDS[index], delay=70)

    # 받기
    got = radio.receive()
    if got and ">" in got:
        sender, text = got.split(">", 1)
        if sender != str(MY_ID):
            display.show(Image.ARROW_W)
            music.pitch(600, 60)
            sleep(200)
            display.scroll(sender + " " + text, delay=75)
            print(sender, "번:", text)

    sleep(40)`,
            desc: '조별로 <code>GROUP</code> 을 같게, <code>MY_ID</code> 를 다르게 설정하면 <b>여러 대가 대화</b>할 수 있습니다. 받은 메시지는 보낸 사람 번호와 함께 흐르고, 보낼 때와 받을 때 소리가 달라 구분됩니다.',
            expect: 'A 로 말을 고르고 B 로 보내면, 다른 보드에 그 말이 뜹니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 13-2. 무선 센서 네트워크', code: `from microbit import *
import radio
import log

# A 를 누른 채 켜면 '수집기', 아니면 '측정기'
IS_HUB = button_a.is_pressed()
MY_ID = 2                  # 측정기마다 다르게
INTERVAL = 3000

radio.on()
radio.config(group=7)

display.scroll("HUB" if IS_HUB else "NODE" + str(MY_ID), delay=55)

if IS_HUB:
    log.set_labels("node", "temp", "light", timestamp=log.SECONDS)
    seen = {}

    while True:
        got = radio.receive()
        if got and got.startswith("D:"):
            parts = got.split(":")
            node, temp, light = parts[1], int(parts[2]), int(parts[3])
            seen[node] = temp
            log.add(node=node, temp=temp, light=light)
            print(node, "번 →", temp, "도 /", light)
            display.show(Image.ARROW_W)
            sleep(200)

        if button_b.was_pressed():
            print("연결된 측정기:", seen)
            display.scroll(str(len(seen)) + "N", delay=80)

        display.show(len(seen) % 10)
        sleep(60)
else:
    next_send = running_time()
    while True:
        if running_time() >= next_send:
            msg = "D:" + str(MY_ID) + ":" + str(temperature()) + ":" + str(display.read_light_level())
            radio.send(msg)
            print("보냄:", msg)
            next_send = next_send + INTERVAL
            display.show(Image.ARROW_E)
            sleep(200)
        display.show(MY_ID)
        sleep(60)`,
            hint: '📡 무선 탭 입력 칸에 <code>D:3:26:150</code> 처럼 넣으면 수집기 동작을 확인할 수 있습니다.',
            desc: '한 대는 <b>수집기(hub)</b>, 나머지는 <b>측정기(node)</b> 가 되어 교실 여러 곳의 온도와 밝기를 한곳에 모읍니다. 켤 때 A 를 누르고 있으면 수집기가 됩니다. 수집기는 받은 값을 모두 로그에 남기므로 CSV 로 받아 비교할 수 있습니다.',
            expect: '3 번 → 26 도 / 150',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 13-3. 무선 리모컨 (서보 조종)', code: `from microbit import *
import radio

# A 를 누른 채 켜면 '리모컨', 아니면 '수신기(서보)'
IS_REMOTE = button_a.is_pressed()

radio.on()
radio.config(group=7)
display.scroll("TX" if IS_REMOTE else "RX", delay=55)

if IS_REMOTE:
    last = -1
    while True:
        x = accelerometer.get_x()
        angle = scale(x, from_=(-1024, 1024), to=(0, 180))

        if abs(angle - last) > 4:            # 조금이라도 움직였을 때만
            radio.send("S:" + str(angle))
            last = angle
            print("각도 전송:", angle)

        # 화면에 지금 각도 표시
        display.clear()
        display.set_pixel(scale(angle, from_=(0, 180), to=(0, 4)), 2, 9)
        sleep(80)
else:
    pin0.set_analog_period(20)

    def servo(a):
        a = max(0, min(180, int(a)))
        pin0.write_analog(26 + (a * 102) // 180)

    servo(90)
    while True:
        got = radio.receive()
        if got and got.startswith("S:"):
            angle = int(got[2:])
            servo(angle)
            display.clear()
            display.set_pixel(scale(angle, from_=(0, 180), to=(0, 4)), 2, 9)
            print("각도 수신:", angle)
        sleep(20)`,
            hint: '🧩 수신기 쪽에 <b>서보 모터 → P0</b>. 📡 무선 탭 입력 칸에 <code>S:45</code> 처럼 넣어도 됩니다.',
            desc: '리모컨 보드를 <b>기울이면</b> 수신기의 서보가 따라 움직입니다. 값이 조금이라도 바뀔 때만 보내 무선 트래픽을 아꼈습니다. 바퀴 두 개를 달면 무선 자동차가 됩니다.',
            expect: '각도 전송: 45 / 각도 수신: 45',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 13-4. 여러 대가 동시에 시작하는 스톱워치', code: `from microbit import *
import radio
import music

radio.on()
radio.config(group=7)

running = False
start = 0

display.show(Image.SQUARE_SMALL)

while True:
    # A: 모두에게 시작 신호 (자기 자신도 시작)
    if button_a.was_pressed():
        radio.send("GO")
        running = True
        start = running_time()
        music.pitch(1200, 80)

    # B: 모두에게 정지 신호
    if button_b.was_pressed():
        radio.send("STOP")
        if running:
            running = False
            display.scroll(str((running_time() - start) // 100), delay=70)
        music.pitch(500, 80)

    got = radio.receive()
    if got == "GO" and not running:
        running = True
        start = running_time()
        music.pitch(1200, 80)
    elif got == "STOP" and running:
        running = False
        ms = running_time() - start
        print("기록:", ms, "ms")
        display.scroll(str(ms // 100), delay=70)

    if running:
        display.show(Image.ALL_CLOCKS[(running_time() // 120) % 12])
    else:
        display.show(Image.SQUARE_SMALL)

    sleep(40)`,
            hint: '📡 무선 탭 입력 칸에 <code>GO</code> 와 <code>STOP</code> 을 넣어 보세요.',
            desc: '한 대에서 A 를 누르면 <b>모든 보드가 동시에</b> 시간을 재기 시작합니다. 육상 경기의 출발 신호처럼 쓸 수 있고, 여러 지점에서 같은 시각을 재야 하는 실험에도 유용합니다.',
            expect: 'GO 를 받으면 모든 보드의 시계가 동시에 돌기 시작합니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 13-5. 무선 퀴즈 버저 (여러 명)', code: `from microbit import *
import radio
import music

MY_ID = 1                  # 참가자마다 다르게
IS_HOST = button_b.is_pressed()    # B 를 누른 채 켜면 사회자

radio.on()
radio.config(group=7)
display.scroll("HOST" if IS_HOST else str(MY_ID), delay=55)

if IS_HOST:
    while True:
        if button_a.was_pressed():
            radio.send("OPEN")
            display.show(Image("99999:99999:99999:99999:99999"))
            music.pitch(1200, 100)
            t0 = running_time()
            winner = None

            while running_time() - t0 < 6000 and winner is None:
                got = radio.receive()
                if got and got.startswith("BUZZ:"):
                    winner = got.split(":")[1]
                sleep(10)

            radio.send("CLOSE")
            if winner:
                ms = running_time() - t0
                print(winner, "번이", ms, "ms 에 눌렀습니다")
                display.scroll(winner, delay=80)
                music.play(music.POWER_UP)
            else:
                display.scroll("NONE", delay=70)
                music.play(music.WAWAWAWAA)

            display.show(Image.ARROW_E)
        sleep(40)
else:
    open_now = False
    while True:
        got = radio.receive()
        if got == "OPEN":
            open_now = True
            display.show(Image.ARROW_N)
            music.pitch(900, 60)
        elif got == "CLOSE":
            open_now = False
            display.show(str(MY_ID))

        if open_now and button_a.was_pressed():
            radio.send("BUZZ:" + str(MY_ID))
            open_now = False
            display.show(Image.YES)
            music.pitch(1400, 120)
            sleep(600)
            display.show(str(MY_ID))

        sleep(20)`,
            hint: '📡 무선 탭 입력 칸에 <code>OPEN</code> · <code>BUZZ:3</code> 을 넣어 흐름을 확인해 보세요.',
            desc: '사회자가 문제를 열면(<code>OPEN</code>) 참가자들이 버튼을 누를 수 있고, <b>가장 먼저 도착한 신호</b>의 번호가 승자가 됩니다. 사회자 보드는 켤 때 B 를 누르고 있으면 됩니다. 반 전체가 함께하는 퀴즈 대회에 바로 쓸 수 있습니다.',
            expect: 'OPEN 뒤 먼저 누른 참가자 번호가 사회자 화면에 뜹니다.',
            nondeterministic: true
          },

          { type: 'h', text: '2교시 · 13장 요약' },
          {
            type: 'list', items: [
              '<code>import radio</code> → <code>radio.on()</code> → <code>radio.send()</code> / <code>radio.receive()</code>',
              '<code>receive()</code> 는 받은 것이 없으면 <b><code>None</code></b> 이므로 <code>if msg:</code> 로 확인합니다.',
              '<code>radio.config(group=번호)</code> 로 <b>조를 구분</b>합니다. 같은 group 끼리만 통신합니다.',
              'radio 는 <b>브로드캐스트</b> — 보내면 주변의 모든 보드가 받습니다.',
              '여러 값은 <b>구분 기호</b>를 정해 한 문자열로 보내고 <code>split()</code> 으로 나눠 읽습니다.',
              '기본 메시지 길이는 <b>32바이트</b>. 한글은 한 글자에 3바이트입니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 13-3. 무선 응원봉',
            level: 2,
            desc: '<p>한 대가 보내면 <b>주변의 모든 보드</b>가 같은 그림을 보여 주는 응원봉을 만드세요.</p><ul><li>A 를 누르면 <code>"heart"</code>, B 를 누르면 <code>"star"</code>, 흔들면 <code>"flash"</code> 를 보냅니다</li><li>받으면 그에 맞는 그림 · 애니메이션을 보여 줍니다 (<code>flash</code> 는 화면 전체가 세 번 깜빡)</li><li><b>자기가 보낸 것도 자기 화면에 반영</b>되게 하세요 (보내고 나서 직접 처리)</li><li>조 번호(<code>group</code>)를 정해 다른 조와 섞이지 않게 합니다</li></ul>',
            hint: '보내는 동작과 표시하는 동작을 <code>def show_effect(name):</code> 함수로 묶으면 보낼 때도 받을 때도 같은 함수를 쓸 수 있습니다.',
            starter: 'from microbit import *\nimport radio\n\nradio.on()\nradio.config(group=7)\n\n\ndef show_effect(name):\n    # TODO\n    pass\n\n\nwhile True:\n    # TODO\n    sleep(30)\n',
            solution: 'from microbit import *\nimport radio\n\nradio.on()\nradio.config(group=7)\nfull = Image("99999:99999:99999:99999:99999")\ndisplay.show(Image.DIAMOND_SMALL)\n\n\ndef show_effect(name):\n    if name == "heart":\n        display.show([Image.HEART, Image.HEART_SMALL] * 3, delay=180)\n    elif name == "star":\n        display.show([Image.DIAMOND_SMALL, Image.DIAMOND, Image.SQUARE], delay=180)\n    elif name == "flash":\n        for i in range(3):\n            display.show(full)\n            sleep(120)\n            display.clear()\n            sleep(120)\n    display.show(Image.DIAMOND_SMALL)\n\n\ndef send_and_show(name):\n    radio.send(name)\n    show_effect(name)\n\n\nwhile True:\n    if button_a.was_pressed():\n        send_and_show("heart")\n    if button_b.was_pressed():\n        send_and_show("star")\n    if accelerometer.was_gesture("shake"):\n        send_and_show("flash")\n\n    msg = radio.receive()\n    if msg:\n        print("받음:", msg)\n        show_effect(msg)\n\n    sleep(30)\n'
          },
          {
            title: '실습 13-4. 도전! 무선 술래잡기',
            level: 3,
            desc: '<p>여러 대가 함께하는 술래잡기 게임을 만드세요.</p><ol><li>시작할 때 각 보드는 <b>자기 번호</b>를 정합니다 (A 를 눌러 1~9 중 선택, 로고 터치로 확정)</li><li>한 대가 <b>술래</b>가 됩니다 (B 를 길게 눌러 술래 선언 → <code>"IT:번호"</code> 를 보냄)</li><li>술래는 화면에 <code>Image.SKULL</code>, 나머지는 <code>Image.HAPPY</code></li><li>술래가 흔들면 <code>"TAG:번호"</code> 를 보냅니다 — 그 번호의 보드가 새 술래가 됩니다</li><li>술래는 흔들 때마다 <b>다음 번호</b>를 지목합니다 (1 → 2 → … → 9 → 1)</li></ol><p><b>힌트</b>: 시뮬레이터에서는 📡 무선 탭의 입력 칸으로 다른 보드의 메시지를 흉내 낼 수 있습니다.</p>',
            hint: '메시지 형식을 <code>"명령:값"</code> 으로 정하고 <code>msg.split(":")</code> 로 나눠 읽습니다. 자기 번호와 같은지 비교해 동작을 정하세요.',
            starter: 'from microbit import *\nimport radio\n\nradio.on()\nradio.config(group=7)\n\nmy_id = 1\nis_it = False\n\n# 1) 번호 정하기\nwhile not pin_logo.is_touched():\n    display.show(my_id)\n    if button_a.was_pressed():\n        my_id = my_id % 9 + 1\n    sleep(50)\ndisplay.scroll("ID" + str(my_id), delay=60)\n\nwhile True:\n    # TODO\n    sleep(30)\n',
            solution: 'from microbit import *\nimport radio\nimport music\n\nradio.on()\nradio.config(group=7)\n\nmy_id = 1\nis_it = False\ntarget = 1\n\n# 1) 번호 정하기\nwhile not pin_logo.is_touched():\n    display.show(my_id)\n    if button_a.was_pressed():\n        my_id = my_id % 9 + 1\n    sleep(50)\ndisplay.scroll("ID" + str(my_id), delay=60)\nsleep(500)\n\npressed_at = None\n\nwhile True:\n    # 술래 선언 (B 를 2초 이상)\n    if button_b.is_pressed():\n        if pressed_at is None:\n            pressed_at = running_time()\n        elif running_time() - pressed_at > 2000:\n            is_it = True\n            radio.send("IT:" + str(my_id))\n            music.play(music.BADDY)\n            pressed_at = None\n    else:\n        pressed_at = None\n\n    # 술래가 흔들면 다음 사람을 지목\n    if is_it and accelerometer.was_gesture("shake"):\n        target = target % 9 + 1\n        if target == my_id:\n            target = target % 9 + 1\n        radio.send("TAG:" + str(target))\n        print("지목:", target)\n        is_it = False\n        music.play(music.JUMP_DOWN)\n\n    msg = radio.receive()\n    if msg and ":" in msg:\n        cmd, value = msg.split(":")\n        if cmd == "IT":\n            is_it = (int(value) == my_id)\n        elif cmd == "TAG":\n            if int(value) == my_id:\n                is_it = True\n                music.play(music.BADDY)\n            else:\n                is_it = False\n\n    display.show(Image.SKULL if is_it else Image.HAPPY)\n    sleep(30)\n'
          }
        ],
        quiz: [
          {
            q: '<code>radio.on()</code> 없이 <code>radio.send("hi")</code> 를 부르면?', options: ['정상 동작한다', '<code>ValueError: radio is not enabled</code>', '아무 일도 없다', '보드가 꺼진다'], answer: 1,
            explain: '무선을 먼저 켜야 합니다. 안 쓸 때는 <code>radio.off()</code> 로 꺼 전력을 아끼세요.'
          },
          {
            q: '<code>radio.receive()</code> 가 받은 것이 없을 때 돌려주는 값은?', options: ['빈 문자열 <code>""</code>', '<code>0</code>', '<code>None</code>', '오류'], answer: 2,
            explain: '<code>None</code> 입니다. 그래서 <code>if msg:</code> 로 확인한 뒤 써야 합니다.'
          },
          {
            q: '교실에서 여러 조가 동시에 실습할 때 서로 간섭하지 않게 하려면?', options: ['<code>radio.config(group=조번호)</code>', '<code>radio.config(power=0)</code>', '거리를 멀리 둔다', '방법이 없다'], answer: 0,
            explain: '<b>group</b> 이 같은 보드끼리만 메시지를 주고받습니다. 조마다 다른 번호를 정하세요.'
          },
          {
            q: 'radio 로 한 대가 메시지를 보내면?', options: ['정해진 한 대만 받는다', '주변의 <b>같은 group 보드 모두</b>가 받는다', '가장 가까운 보드만 받는다', '아무도 못 받는다'], answer: 1,
            explain: 'radio 는 <b>브로드캐스트</b> 방식입니다. 특정 보드에게만 보내려면 메시지 안에 상대 번호를 적는 등의 <b>규약</b>을 직접 만들어야 합니다.'
          },
          {
            q: '<code>"T:24,L:128"</code> 처럼 여러 값을 한 메시지에 담았을 때 나눠 읽으려면?', options: ['<code>msg.split(",")</code>', '<code>msg.join(",")</code>', '<code>int(msg)</code>', '나눌 수 없다'], answer: 0,
            explain: '<code>split(구분자)</code> 로 나눠 리스트로 만듭니다. 구분 기호를 미리 정해 두는 것이 <b>통신 규약</b>의 기본입니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: 'radio — 무선으로 이야기하기', subtitle: 'Chapter 13 · 통신', badge: '2교시',
            notes: '<p>보드가 여러 대 있으면 가장 신나는 수업입니다. 조별로 group 번호를 미리 정해 두세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'diagram', title: 'radio 는 브로드캐스트', html: FIG_RADIO, caption: '한 대가 보내면 같은 group 의 모든 보드가 받습니다',
            notes: '<p>"라디오 방송" 과 같다고 설명하면 이해가 빠릅니다. 채널(group)을 맞춰야 들린다는 점도요.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: '첫 무선 메시지', code: 'from microbit import *\nimport radio\n\nradio.on()\nradio.config(group=7)\n\nwhile True:\n    if button_a.was_pressed():\n        radio.send("HELLO")\n\n    msg = radio.receive()\n    if msg:\n        display.scroll(msg, delay=60)\n\n    sleep(30)',
            points: ['<code>radio.on()</code> 을 <b>꼭</b> 먼저', '<code>send()</code> 로 보내기', '<code>receive()</code> 는 없으면 <code>None</code>', '<code>if msg:</code> 로 확인'],
            notes: '<p>두 대가 있으면 학생 두 명에게 나눠 주고 직접 보내 보게 하세요. 시뮬레이터는 무선 탭의 짝 보드로 대신합니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'code', title: '원격 조종', code: '# 보내는 쪽\ng = accelerometer.current_gesture()\nif g in ("left", "right", "up", "down"):\n    radio.send(g)\n\n# 받는 쪽\nARROWS = {"left": Image.ARROW_W, "right": Image.ARROW_E,\n          "up": Image.ARROW_N, "down": Image.ARROW_S}\n\nmsg = radio.receive()\nif msg:\n    display.show(ARROWS.get(msg, Image.CONFUSED))',
            points: ['기울이면 → 방향 이름 전송', '받으면 딕셔너리로 그림 대응', '한 대가 다른 한 대를 <b>조종</b>', '로봇 · 자동차로 확장 가능'],
            notes: '<p>9장의 딕셔너리가 여기서 자연스럽게 쓰입니다. 모터를 달면 진짜 RC카가 된다고 말해 주면 눈이 반짝입니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'table', title: 'radio 설정', head: ['설정', '뜻', '값'], rows: [
              ['<code>group</code>', '조 번호', '0 ~ 255 (기본 0)'],
              ['<code>channel</code>', '주파수 채널', '0 ~ 83 (기본 7)'],
              ['<code>power</code>', '송신 세기', '0 ~ 7 (기본 6)'],
              ['<code>length</code>', '최대 길이', '기본 32바이트']],
            notes: '<p>교실에서 조마다 group 을 다르게 정하는 것이 실습의 핵심입니다. 칠판에 조별 번호를 적어 두세요.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: '여러 값을 한 메시지에', code: 'msg = "T:" + str(temperature()) + ",L:" + str(display.read_light_level())\nradio.send(msg)\n\ngot = radio.receive()\nif got and got.startswith("T:"):\n    parts = got.split(",")\n    temp = parts[0][2:]\n    light = parts[1][2:]\n    print("온도", temp, "빛", light)',
            points: ['<b>구분 기호</b>를 정해 두기', '<code>split()</code> 으로 나눠 읽기', '이것이 <b>통신 규약</b>의 기본', '기본 길이 32바이트 주의'],
            notes: '<p>HTTP, JSON 같은 실제 프로토콜도 결국 "약속된 형식" 이라는 점을 언급하면 좋습니다.</p><p>시간: 8분</p>'
          },
          {
            layout: 'practice', title: '실습 13-3. 무선 응원봉', desc: '한 대가 보내면 모든 보드가 같은 효과를 보여 줍니다.',
            starter: 'from microbit import *\nimport radio\n\nradio.on()\nradio.config(group=7)\n\ndef show_effect(name):\n    # TODO\n    pass\n\nwhile True:\n    # TODO\n    sleep(30)\n',
            solution: 'from microbit import *\nimport radio\n\nradio.on()\nradio.config(group=7)\nfull = Image("99999:99999:99999:99999:99999")\n\n\ndef show_effect(name):\n    if name == "heart":\n        display.show([Image.HEART, Image.HEART_SMALL] * 3, delay=180)\n    elif name == "star":\n        display.show([Image.DIAMOND_SMALL, Image.DIAMOND, Image.SQUARE], delay=180)\n    elif name == "flash":\n        for i in range(3):\n            display.show(full)\n            sleep(120)\n            display.clear()\n            sleep(120)\n    display.show(Image.DIAMOND_SMALL)\n\n\ndef send_and_show(name):\n    radio.send(name)\n    show_effect(name)\n\n\nwhile True:\n    if button_a.was_pressed():\n        send_and_show("heart")\n    if button_b.was_pressed():\n        send_and_show("star")\n    if accelerometer.was_gesture("shake"):\n        send_and_show("flash")\n\n    msg = radio.receive()\n    if msg:\n        show_effect(msg)\n\n    sleep(30)\n',
            notes: '<p>반 전체가 같은 group 으로 맞추고 한 명이 누르면 모두의 화면이 동시에 바뀌는 장면은 아주 인상적입니다. 꼭 해 보세요.</p><p>시간: 14분</p>'
          },
          {
            layout: 'summary', title: '13장 정리', bullets: ['<code>print()</code> = USB 시리얼 · 핀 통신은 GND 필수', '<code>radio.on()</code> → <code>send()</code> / <code>receive()</code>', '<code>receive()</code> 는 없으면 <code>None</code>', '<code>group</code> 으로 조 구분 · 브로드캐스트', '구분 기호 + <code>split()</code> = 통신 규약'],
            notes: '<p>13장 정리. 다음 장 예고: 다음 단계 — NeoPixel · 서보 · 종합 프로젝트.</p><p>과제: 조별 무선 프로젝트 기획하기.</p><p>시간: 2분</p>'
          }
        ]
      }
    ]
  });
})();
