/* Chapter 11. 저장 — 파일과 데이터 기록
 * 원본: MicroPython on the BBC micro:bit — Storage / Data Logging
 */
(function () {
  const FIG_FS = `<svg viewBox="0 0 1280 420" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">micro:bit 의 파일 시스템 — 폴더 없는 평평한 구조</text>
  <rect x="80" y="70" width="480" height="300" rx="16" fill="var(--card)" stroke="var(--danger)" stroke-width="3"/>
  <text x="320" y="106" text-anchor="middle" font-size="21" font-weight="bold" fill="var(--danger)">✘ PC 의 파일 시스템 (폴더 있음)</text>
  ${[['📁 Documents', 0, 140], ['📁 photos', 1, 176], ['🖼 cat.png', 2, 212], ['📄 diary.txt', 1, 248], ['📁 Downloads', 0, 284], ['📄 game.zip', 1, 320]]
      .map(([name, depth, y]) => `<text x="${120 + depth * 40}" y="${y}" font-size="19" font-family="monospace" fill="var(--fg)">${name}</text>`).join('\n  ')}
  <rect x="720" y="70" width="480" height="300" rx="16" fill="var(--card)" stroke="var(--ok)" stroke-width="3"/>
  <text x="960" y="106" text-anchor="middle" font-size="21" font-weight="bold" fill="var(--ok)">✔ micro:bit (폴더 없음)</text>
  ${[['📄 main.py', 140], ['📄 story.txt', 176], ['📄 score.txt', 212], ['📄 log.csv', 248], ['📄 settings.txt', 284]]
      .map(([name, y]) => `<text x="760" y="${y}" font-size="19" font-family="monospace" fill="var(--fg)">${name}</text>`).join('\n  ')}
  <text x="960" y="330" text-anchor="middle" font-size="17" fill="var(--muted)">이름만 있고 경로(/)는 쓸 수 없습니다</text>
  <text x="640" y="404" text-anchor="middle" font-size="19" fill="var(--muted)">저장 공간은 약 <tspan font-weight="bold" fill="var(--fg)">30KB</tspan> — 텍스트 파일 몇 개 정도만 들어갑니다</text>
</svg>`;

  const FIG_MODE = `<svg viewBox="0 0 1280 330" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <text x="640" y="34" text-anchor="middle" font-size="25" font-weight="bold" fill="var(--fg)">open() 의 모드 — 파일을 어떻게 열 것인가</text>
  ${[
      ["'r'", 'read · 읽기', '파일을 읽습니다. 없으면 오류', 'var(--accent)'],
      ["'w'", 'write · 쓰기', '새로 만듭니다. <tspan font-weight="bold" fill="#d64541">기존 내용은 지워집니다</tspan>', 'var(--danger)'],
      ["'a'", 'append · 덧붙이기', '끝에 이어 씁니다. 없으면 새로 만듦', 'var(--ok)']
    ].map(([m, name, desc, color], i) => {
      const y = 76 + i * 78;
      return `<rect x="100" y="${y}" width="1080" height="60" rx="12" fill="var(--card)" stroke="${color}" stroke-width="3"/>
  <text x="160" y="${y + 40}" font-size="27" font-family="monospace" font-weight="bold" fill="${color}">${m}</text>
  <text x="260" y="${y + 40}" font-size="21" font-weight="bold" fill="var(--fg)">${name}</text>
  <text x="530" y="${y + 40}" font-size="19" fill="var(--muted)">${desc}</text>`;
    }).join('\n  ')}
  <text x="640" y="320" text-anchor="middle" font-size="19" fill="var(--danger)">⚠ <tspan font-weight="bold">'w'</tspan> 는 기존 파일을 <tspan font-weight="bold">통째로 덮어씁니다</tspan>. 이어 쓰려면 반드시 <tspan font-weight="bold">'a'</tspan> 를 쓰세요.</text>
</svg>`;

  MB_COURSE.addChapter({
    id: 'ch11',
    no: '11',
    title: '저장 — 파일과 데이터 기록',
    subtitle: '파일 시스템 · open · os · log 모듈 · CSV',
    summary: '전원을 꺼도 사라지지 않는 데이터를 다룹니다. micro:bit 안의 작은 파일 시스템에 텍스트를 쓰고 읽는 방법, 폴더가 없는 구조의 특징, os 모듈로 파일을 관리하는 법을 배웁니다. 그리고 micro:bit V2 의 log 모듈로 센서 데이터를 자동 기록해 표로 확인하고 CSV 로 내려받습니다.',
    goals: [
      '<code>open()</code> 으로 파일을 쓰고 읽을 수 있다',
      '<code>\'r\'</code> · <code>\'w\'</code> · <code>\'a\'</code> 모드의 차이를 설명할 수 있다',
      '<code>with</code> 문으로 안전하게 파일을 다룰 수 있다',
      '<code>os</code> 모듈로 파일 목록 · 크기 · 삭제를 다룰 수 있다',
      '<code>log</code> 모듈로 센서 데이터를 기록하고 CSV 로 내보낼 수 있다'
    ],
    sections: [
      /* ═══════════════════════ 1교시 ═══════════════════════ */
      {
        id: 'ch11-1',
        title: '파일 읽고 쓰기',
        minutes: 45,
        goals: [
          'micro:bit 파일 시스템의 특징(폴더 없음, 작은 용량)을 설명할 수 있다',
          '<code>open()</code> 과 <code>with</code> 로 파일을 쓰고 읽을 수 있다',
          '모드 <code>r</code> · <code>w</code> · <code>a</code> 를 구분해 쓸 수 있다',
          '<code>os</code> 모듈로 파일을 관리할 수 있다'
        ],
        flow: [['왜 저장이 필요한가', 6], ['파일 시스템 구조', 8], ['쓰기와 읽기', 16], ['os 모듈', 12], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '전원을 끄면 사라지는 것들' },
          { type: 'p', html: '지금까지 만든 프로그램의 변수들 — 점수, 횟수, 설정 — 은 모두 <b>전원을 끄면 사라집니다</b>. 게임 최고 점수를 기록하거나, 온도를 하루 종일 측정해 나중에 분석하려면 <b>파일</b>로 저장해야 합니다.' },
          { type: 'p', html: 'micro:bit 안에는 아주 작은 <b>파일 시스템</b>이 있습니다. 전원을 꺼도 내용이 남고, 다시 켜면 그대로 읽을 수 있습니다.' },
          { type: 'figure', html: FIG_FS, caption: '그림 11-1. micro:bit 의 파일 시스템은 폴더가 없습니다' },
          {
            type: 'table', head: ['특징', '설명'], rows: [
              ['<b>폴더가 없다</b>', '파일 이름만 있습니다. <code>"data/temp.txt"</code> 같은 경로는 쓸 수 없습니다.'],
              ['<b>용량이 작다</b>', '약 <b>30KB</b>. <code>main.py</code> 도 여기에 저장되므로 실제 여유는 더 적습니다.'],
              ['<b>텍스트가 기본</b>', '글자를 저장하는 것이 보통입니다. 이진 데이터도 가능합니다(<code>\'b\'</code> 모드).'],
              ['<b>전원을 꺼도 남는다</b>', '플래시 메모리에 저장되어 전원과 무관하게 유지됩니다.']
            ]
          },
          { type: 'callout', kind: 'tip', title: '시뮬레이터의 파일 탭', html: '오른쪽 시뮬레이터의 <b>💾 파일</b> 탭에서 프로그램이 만든 파일을 볼 수 있습니다. 파일 이름을 누르면 내용이 보이고, ✕ 로 지울 수 있습니다. (페이지를 새로 고치면 사라집니다)' },

          { type: 'h', text: '파일에 쓰기' },
          {
            type: 'code', title: '예제 11-1. 첫 파일 만들기', code: `from microbit import *

# 파일 열기 → 쓰기 → 닫기
f = open("hello.txt", "w")
f.write("안녕, micro:bit!\\n")
f.write("두 번째 줄입니다.\\n")
f.close()

display.scroll("SAVED", delay=60)`,
            hint: '실행한 뒤 오른쪽 <b>💾 파일</b> 탭을 눌러 <code>hello.txt</code> 를 확인해 보세요.',
            desc: '<code>open(파일이름, 모드)</code> 로 열고, <code>write()</code> 로 쓰고, <code>close()</code> 로 닫습니다. <code>\\n</code> 은 <b>줄바꿈</b>입니다. <code>close()</code> 를 잊으면 내용이 저장되지 않을 수 있습니다.',
            expect: 'SAVED 가 흘러가고, 파일 탭에 hello.txt 가 생깁니다.'
          },
          { type: 'figure', html: FIG_MODE, caption: '그림 11-2. open() 의 세 가지 모드' },
          {
            type: 'code', title: '예제 11-2. with 문 — 자동으로 닫기', code: `from microbit import *

# with 를 쓰면 블록이 끝날 때 자동으로 close() 된다
with open("hello.txt", "w") as f:
    f.write("with 문을 쓰면\\n")
    f.write("닫는 것을 잊지 않습니다.\\n")

display.scroll("OK", delay=60)`,
            desc: '<code>with open(...) as f:</code> 는 블록이 끝나면 <b>자동으로 파일을 닫습니다</b>. 오류가 나도 확실히 닫히므로 <b>이 방식을 권장</b>합니다. 앞으로는 <code>with</code> 를 쓰겠습니다.',
            expect: 'hello.txt 의 내용이 새 내용으로 바뀝니다.'
          },
          { type: 'callout', kind: 'warn', title: "'w' 는 기존 내용을 지웁니다", html: '<code>open("hello.txt", "w")</code> 를 실행하는 순간 <b>파일 내용이 통째로 사라집니다</b>. 기존 내용에 이어 쓰려면 반드시 <code>\'a\'</code>(append) 모드를 쓰세요. 실수로 데이터를 날리는 가장 흔한 원인입니다.' },
          {
            type: 'code', title: '예제 11-3. 이어 쓰기 (a 모드)', code: `from microbit import *

# 버튼을 누를 때마다 기록을 덧붙인다
display.show(Image.ARROW_E)

while True:
    if button_a.was_pressed():
        t = running_time() // 1000
        with open("log.txt", "a") as f:        # 'a' = 덧붙이기
            f.write(str(t) + "초에 버튼 눌림\\n")
        display.show(Image.YES)
        sleep(300)
        display.show(Image.ARROW_E)
    sleep(50)`,
            hint: 'A 를 여러 번 누른 뒤 <b>💾 파일</b> 탭에서 <code>log.txt</code> 를 확인해 보세요.',
            desc: '<code>\'a\'</code> 모드는 기존 내용 <b>뒤에 이어서</b> 씁니다. 파일이 없으면 새로 만듭니다. 기록을 쌓아 갈 때 꼭 필요합니다.',
            expect: '누를 때마다 log.txt 에 한 줄씩 쌓입니다.'
          },

          { type: 'h', text: '파일 읽기' },
          {
            type: 'code', title: '예제 11-4. 파일 전체 읽기', code: `from microbit import *

with open("hello.txt", "w") as f:
    f.write("첫째 줄\\n둘째 줄\\n셋째 줄\\n")

# 전체를 한 번에 읽기
with open("hello.txt", "r") as f:
    content = f.read()

print("=== 전체 내용 ===")
print(content)
print("=== 글자 수:", len(content), "===")`,
            desc: '<code>read()</code> 는 파일 전체를 <b>하나의 문자열</b>로 읽습니다. 파일이 크면 메모리가 부족할 수 있으니 주의하세요.',
            expect: '=== 전체 내용 ===\n첫째 줄\n둘째 줄\n셋째 줄\n\n=== 글자 수: 18 ==='
          },
          {
            type: 'code', title: '예제 11-5. 한 줄씩 읽기', code: `from microbit import *

with open("hello.txt", "w") as f:
    f.write("APPLE\\nBANANA\\nCHERRY\\n")

# 한 줄씩 읽어 처리하기
with open("hello.txt", "r") as f:
    for line in f:
        word = line.strip()           # 앞뒤 공백 · 줄바꿈 제거
        print("읽음:", word)
        display.scroll(word, delay=60)`,
            desc: '<code>for line in f:</code> 로 <b>한 줄씩</b> 읽으면 큰 파일도 메모리 걱정 없이 처리할 수 있습니다. <code>strip()</code> 은 줄 끝의 <code>\\n</code> 을 없애 줍니다.',
            expect: '읽음: APPLE\n읽음: BANANA\n읽음: CHERRY\n(각 단어가 화면에 흘러갑니다)'
          },
          {
            type: 'code', title: '예제 11-6. 최고 점수 기록하기', code: `from microbit import *
import random


def load_best():
    """저장된 최고 점수를 읽는다. 없으면 0"""
    try:
        with open("best.txt", "r") as f:
            return int(f.read())
    except OSError:
        return 0


def save_best(score):
    with open("best.txt", "w") as f:
        f.write(str(score))


best = load_best()
display.scroll("BEST " + str(best), delay=70)

while True:
    if button_a.was_pressed():
        score = random.randint(1, 100)        # 게임 점수라고 가정
        display.scroll(str(score), delay=70)

        if score > best:
            best = score
            save_best(best)
            display.scroll("NEW BEST!", delay=70)
    sleep(50)`,
            hint: 'A 를 여러 번 눌러 점수를 뽑고, 페이지를 <b>새로 고쳐도</b> 최고 점수가 남는지 확인해 보세요. (실제 보드에서는 전원을 껐다 켜도 남습니다)',
            desc: '파일이 없을 때 <code>open("best.txt", "r")</code> 은 <code>OSError</code> 를 냅니다. <code>try</code> / <code>except</code> 로 그 경우를 처리해 <b>처음 실행해도 오류가 나지 않게</b> 했습니다.',
            expect: 'A 를 누르면 점수가 나오고, 최고 점수를 넘으면 NEW BEST! 가 나옵니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'more', title: 'try / except — 오류에 대비하기', html: '<pre><code>try:\n    위험할 수 있는 코드\nexcept OSError:\n    오류가 났을 때 할 일</code></pre><p>파일이 없거나 읽을 수 없을 때 프로그램이 멈추는 대신 <b>다른 방법으로 계속 진행</b>할 수 있습니다. 파일을 다룰 때는 거의 항상 필요합니다.</p>' },

          { type: 'h', text: 'os 모듈 — 파일 관리' },
          {
            type: 'code', repl: true, title: '셸에서 os 써 보기', code: `import os
os.listdir()
os.size("hello.txt")
os.uname()`,
            desc: '<code>os.listdir()</code> 은 저장된 <b>파일 이름 목록</b>을, <code>os.size()</code> 는 <b>크기(바이트)</b> 를 돌려줍니다. <code>os.uname()</code> 은 보드 정보입니다.',
            expect: ">>> os.listdir()\n['hello.txt', 'log.txt']\n>>> os.size('hello.txt')\n18"
          },
          {
            type: 'code', title: '예제 11-7. 파일 목록 보기', code: `from microbit import *
import os

files = os.listdir()

print("파일 개수:", len(files))
total = 0
for name in files:
    size = os.size(name)
    total = total + size
    print(name, "-", size, "바이트")

print("합계:", total, "바이트")
display.scroll(str(len(files)) + " FILES", delay=70)`,
            desc: '파일 목록을 훑으며 크기를 더합니다. 저장 공간이 30KB 밖에 없으므로 가끔 확인하는 습관이 필요합니다.',
            expect: '파일 개수: 2\nhello.txt - 18 바이트\nlog.txt - 45 바이트\n합계: 63 바이트',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 11-8. 파일 지우기', code: `from microbit import *
import os

display.scroll("A=LIST B=DEL", delay=60)

while True:
    if button_a.was_pressed():
        files = os.listdir()
        print(files)
        display.scroll(str(len(files)), delay=70)

    if button_b.was_pressed():
        # log.txt 만 지운다
        if "log.txt" in os.listdir():
            os.remove("log.txt")
            display.show(Image.YES)
        else:
            display.show(Image.NO)
        sleep(500)
        display.clear()
    sleep(50)`,
            desc: '<code>os.remove(이름)</code> 으로 파일을 지웁니다. 없는 파일을 지우려 하면 오류가 나므로 <code>in os.listdir()</code> 로 먼저 확인했습니다.',
            expect: 'A 로 목록 확인, B 로 log.txt 삭제'
          },
          {
            type: 'table', head: ['함수', '하는 일'], rows: [
              ['<code>os.listdir()</code>', '파일 이름 목록 (리스트)'],
              ['<code>os.size(이름)</code>', '파일 크기 (바이트)'],
              ['<code>os.remove(이름)</code>', '파일 삭제'],
              ['<code>os.uname()</code>', '보드 정보 (버전 등)']
            ]
          },
          { type: 'callout', kind: 'board', title: '실제 보드의 파일 보기', html: '<p>보드를 연결한 뒤 <b>🔌 연결됨</b> → <b>📁 보드의 파일 목록</b> 을 누르면 실제 micro:bit 안의 파일을 볼 수 있습니다.</p><p>파일이 가득 차면 <code>OSError: [Errno 28] ENOSPC</code> 가 납니다. 필요 없는 파일을 지우거나, python.microbit.org 에서 프로그램을 다시 전송하면 파일 시스템이 초기화됩니다.</p>' },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 리스트를 파일에 저장하고 불러오기', code: `from microbit import *

names = ["MIN", "SUA", "JUN", "HA"]

# ① 저장: 한 줄에 하나씩
with open("names.txt", "w") as f:
    for n in names:
        f.write(n + "\\n")

# ② 불러오기
loaded = []
with open("names.txt", "r") as f:
    for line in f:
        name = line.strip()
        if name:                       # 빈 줄은 건너뛴다
            loaded.append(name)

print("저장한 것:", names)
print("불러온 것:", loaded)
print("같은가?", names == loaded)
display.scroll(str(len(loaded)), delay=80)`,
            hint: '실행한 뒤 오른쪽 <b>💾 파일</b> 탭에서 <code>names.txt</code> 를 눌러 내용을 확인하세요.',
            desc: '리스트를 파일로 남기는 가장 간단한 방법은 <b>한 줄에 하나씩</b> 쓰는 것입니다. 읽을 때는 <code>strip()</code> 으로 줄바꿈을 떼고 빈 줄을 걸러 냅니다.',
            expect: "저장한 것: ['MIN', 'SUA', 'JUN', 'HA']\n불러온 것: ['MIN', 'SUA', 'JUN', 'HA']\n같은가? True"
          },
          {
            type: 'code', title: '더 해 보기 ②. 저장 공간이 얼마나 남았나', code: `from microbit import *
import os

LIMIT = 30 * 1024          # micro:bit 파일 시스템은 약 30KB

files = os.listdir()
used = 0
for name in files:
    size = os.size(name)
    used = used + size
    print(name, "-", size, "바이트")

print("─" * 24)
print("사용:", used, "/", LIMIT, "바이트 (", used * 100 // LIMIT, "% )")

level = min(5, used * 5 // LIMIT)
display.clear()
for y in range(level):
    for x in range(5):
        display.set_pixel(x, 4 - y, 9)`,
            desc: '파일 목록을 훑으며 크기를 더합니다. 공간이 가득 차면 <code>OSError: [Errno 28]</code> 가 나므로, 파일을 많이 만드는 프로그램에서는 이렇게 <b>미리 확인</b>하는 것이 좋습니다.',
            expect: 'names.txt - 16 바이트\n────────────────────────\n사용: 16 / 30720 바이트 ( 0 % )',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. 폴더는 쓸 수 없습니다', code: `from microbit import *
import os

# ① 보통 이름은 잘 된다
with open("ok.txt", "w") as f:
    f.write("good")
print("보통 이름:", os.listdir())

# ② 경로(/)가 들어간 이름은 오류
try:
    with open("data/temp.txt", "w") as f:
        f.write("bad")
except OSError as e:
    print("폴더 이름은 쓸 수 없습니다:", e)

os.remove("ok.txt")
display.show(Image.YES)`,
            desc: 'micro:bit 에는 <b>폴더가 없습니다</b>. PC 파이썬 코드를 그대로 옮기면 경로 때문에 오류가 나기 쉬우니, 파일 이름은 <code>"temp.txt"</code> 처럼 단순하게 쓰세요. 굳이 구분하고 싶다면 <code>"data_temp.txt"</code> 처럼 이름에 표시합니다.',
            expect: "보통 이름: ['ok.txt']\n폴더 이름은 쓸 수 없습니다: …"
          },

          { type: 'h', text: '1교시 요약' },
          {
            type: 'list', items: [
              'micro:bit 파일 시스템은 <b>폴더가 없고</b> 약 <b>30KB</b> 로 작습니다.',
              '<code>with open(이름, 모드) as f:</code> — 블록이 끝나면 자동으로 닫힙니다.',
              '모드: <code>\'r\'</code> 읽기 · <code>\'w\'</code> <b>새로 쓰기(기존 내용 삭제)</b> · <code>\'a\'</code> 이어 쓰기',
              '<code>f.read()</code> 전체 읽기 / <code>for line in f:</code> 한 줄씩 읽기 / <code>line.strip()</code> 줄바꿈 제거',
              '파일이 없을 때를 대비해 <code>try</code> / <code>except OSError:</code> 를 씁니다.',
              '<code>os.listdir()</code> · <code>os.size()</code> · <code>os.remove()</code> 로 파일을 관리합니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 11-1. 방문 기록기',
            level: 2,
            desc: '<p>버튼을 누를 때마다 <b>기록을 파일에 쌓는</b> 프로그램을 만드세요.</p><ul><li>A 를 누르면 <code>visits.txt</code> 에 “몇 초에 눌렸는지” 를 한 줄 덧붙입니다</li><li>B 를 누르면 파일을 읽어 <b>총 몇 번 눌렸는지</b> 를 화면에 표시합니다</li><li>A + B 동시에 누르면 파일을 지웁니다</li><li>파일이 없을 때도 오류가 나지 않아야 합니다</li></ul>',
            hint: '줄 수를 세려면 <code>for line in f:</code> 로 읽으며 <code>count += 1</code> 하거나, <code>f.read().count("\\n")</code> 을 쓰세요.',
            starter: 'from microbit import *\nimport os\n\ndisplay.show(Image.ARROW_E)\n\nwhile True:\n    a = button_a.was_pressed()\n    b = button_b.was_pressed()\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport os\n\ndisplay.show(Image.ARROW_E)\n\n\ndef count_lines():\n    try:\n        n = 0\n        with open("visits.txt", "r") as f:\n            for line in f:\n                n = n + 1\n        return n\n    except OSError:\n        return 0\n\n\nwhile True:\n    a = button_a.was_pressed()\n    b = button_b.was_pressed()\n\n    if a and b:\n        if "visits.txt" in os.listdir():\n            os.remove("visits.txt")\n        display.show(Image.NO)\n        sleep(500)\n        display.show(Image.ARROW_E)\n    elif a:\n        t = running_time() // 1000\n        with open("visits.txt", "a") as f:\n            f.write(str(t) + "\\n")\n        display.show(Image.YES)\n        sleep(300)\n        display.show(Image.ARROW_E)\n    elif b:\n        display.scroll(str(count_lines()), delay=80)\n        display.show(Image.ARROW_E)\n\n    sleep(50)\n'
          },
          {
            title: '실습 11-2. 설정 저장하기',
            level: 2,
            desc: '<p>사용자 설정을 파일에 저장해 <b>다시 켜도 유지되는</b> 프로그램을 만드세요.</p><ul><li>A 를 누르면 화면 밝기 단계가 1 → 5 → 9 → 1 로 순환합니다</li><li>바뀔 때마다 <code>config.txt</code> 에 저장합니다</li><li>프로그램이 시작될 때 저장된 값을 읽어 그 밝기로 시작합니다</li><li>저장된 값이 없으면 5 로 시작합니다</li></ul>',
            hint: '읽을 때 <code>int(f.read())</code> 로 숫자로 바꿔야 합니다. 밝기는 <code>display.show(Image("99999:...") * (b / 9))</code> 처럼 곱셈으로 적용하세요.',
            starter: 'from microbit import *\n\nfull = Image("99999:99999:99999:99999:99999")\nLEVELS = [1, 5, 9]\n\n\ndef load():\n    # TODO: config.txt 읽기 (없으면 5)\n    return 5\n\n\ndef save(v):\n    # TODO: config.txt 쓰기\n    pass\n\n\nbright = load()\n\nwhile True:\n    display.show(full * (bright / 9))\n    # TODO: A 로 순환 + 저장\n    sleep(100)\n',
            solution: 'from microbit import *\n\nfull = Image("99999:99999:99999:99999:99999")\nLEVELS = [1, 5, 9]\n\n\ndef load():\n    try:\n        with open("config.txt", "r") as f:\n            return int(f.read())\n    except (OSError, ValueError):\n        return 5\n\n\ndef save(v):\n    with open("config.txt", "w") as f:\n        f.write(str(v))\n\n\nbright = load()\nprint("시작 밝기:", bright)\n\nwhile True:\n    display.show(full * (bright / 9))\n\n    if button_a.was_pressed():\n        i = LEVELS.index(bright) if bright in LEVELS else 1\n        bright = LEVELS[(i + 1) % len(LEVELS)]\n        save(bright)\n        print("밝기 저장:", bright)\n\n    sleep(100)\n'
          }
        ],
        quiz: [
          {
            q: 'micro:bit 파일 시스템의 특징으로 <b>맞는</b> 것은?', options: ['폴더를 자유롭게 만들 수 있다', '폴더가 없고 파일 이름만 있다', '용량이 1GB 다', '전원을 끄면 사라진다'], answer: 1,
            explain: '<b>폴더가 없는</b> 평평한 구조이고 약 30KB 로 작습니다. 전원을 꺼도 내용은 남습니다.'
          },
          {
            q: '<code>open("data.txt", "w")</code> 를 실행하면?', options: ['기존 내용 뒤에 이어 쓴다', '<b>기존 내용이 모두 지워진다</b>', '파일을 읽기만 한다', '오류가 난다'], answer: 1,
            explain: '<code>\'w\'</code> 는 파일을 <b>새로 만드는</b> 모드라 기존 내용이 사라집니다. 이어 쓰려면 <code>\'a\'</code> 를 쓰세요.'
          },
          {
            q: '<code>with open("a.txt", "r") as f:</code> 를 쓰는 이유는?', options: ['더 빠르다', '블록이 끝나면 <b>자동으로 닫힌다</b>', '파일을 만들 수 있다', '이어 쓸 수 있다'], answer: 1,
            explain: '오류가 나도 확실히 <code>close()</code> 되므로 안전합니다. 파일을 다룰 때 권장되는 방식입니다.'
          },
          {
            q: '없는 파일을 <code>open(…, "r")</code> 로 열면?', options: ['빈 파일이 만들어진다', '<code>OSError</code> 가 발생한다', '<code>None</code> 이 나온다', '아무 일도 없다'], answer: 1,
            explain: '읽기 모드로 없는 파일을 열면 <code>OSError</code> 입니다. <code>try</code> / <code>except OSError:</code> 로 대비하세요.'
          },
          {
            q: '저장된 파일 목록을 보려면?', options: ['<code>os.files()</code>', '<code>os.listdir()</code>', '<code>os.dir()</code>', '<code>open.list()</code>'], answer: 1,
            explain: '<code>import os</code> 후 <code>os.listdir()</code> 입니다. 크기는 <code>os.size(이름)</code>, 삭제는 <code>os.remove(이름)</code>.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '파일 읽고 쓰기', subtitle: 'Chapter 11 · 저장', badge: '1교시',
            notes: '<p>파일 다루기는 PC 파이썬과 거의 같습니다. 여기서 배운 것이 그대로 이어진다고 알려 주세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'bullets', title: '전원을 끄면 사라지는 것들',
            bullets: ['변수 = 전원이 꺼지면 <b>사라짐</b>', '최고 점수 · 설정 · 측정 기록은 남아야 함', 'micro:bit 안의 작은 <b>파일 시스템</b>', '약 30KB · 폴더 없음'],
            notes: '<p><b>발문</b>: "게임 최고 점수는 어떻게 남아 있을까요?"</p><p>시간: 5분</p>'
          },
          {
            layout: 'diagram', title: '폴더가 없는 파일 시스템', html: FIG_FS, caption: '이름만 있고 경로는 쓸 수 없습니다',
            notes: '<p>PC 의 폴더 구조와 비교하면 차이가 확실히 드러납니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'diagram', title: 'open() 의 세 가지 모드', html: FIG_MODE, caption: "'w' 는 기존 내용을 통째로 지웁니다",
            notes: '<p>실수로 데이터를 날리는 가장 흔한 원인입니다. 빨간색으로 강조해 설명하세요.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: 'with 문으로 안전하게', code: 'from microbit import *\n\n# 쓰기\nwith open("hello.txt", "w") as f:\n    f.write("첫째 줄\\n")\n    f.write("둘째 줄\\n")\n\n# 읽기\nwith open("hello.txt", "r") as f:\n    for line in f:\n        print(line.strip())',
            points: ['<code>with</code> = 자동으로 <code>close()</code>', '<code>\\n</code> 은 줄바꿈', '<code>strip()</code> 으로 줄바꿈 제거', '💾 파일 탭에서 확인'],
            notes: '<p>실행 후 파일 탭에서 실제 파일을 보여 주면 이해가 확실해집니다.</p><p>시간: 10분</p>'
          },
          {
            layout: 'code', title: '최고 점수 저장하기', code: 'def load_best():\n    try:\n        with open("best.txt", "r") as f:\n            return int(f.read())\n    except OSError:\n        return 0\n\n\ndef save_best(score):\n    with open("best.txt", "w") as f:\n        f.write(str(score))',
            points: ['처음 실행하면 파일이 <b>없다</b>', '<code>try</code> / <code>except OSError:</code> 로 대비', '<code>int()</code> · <code>str()</code> 로 변환', '함수로 묶으면 재사용 편리'],
            notes: '<p>try/except 는 여기서 처음 나옵니다. "오류가 나도 프로그램이 멈추지 않게 하는 장치" 로 설명하세요.</p><p>시간: 10분</p>'
          },
          {
            layout: 'table', title: 'os 모듈', head: ['함수', '하는 일'], rows: [
              ['<code>os.listdir()</code>', '파일 이름 목록'],
              ['<code>os.size(이름)</code>', '파일 크기 (바이트)'],
              ['<code>os.remove(이름)</code>', '파일 삭제'],
              ['<code>os.uname()</code>', '보드 정보']],
            notes: '<p>셸에서 직접 실행해 보여 주세요. 파일 탭과 대조하면 좋습니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'practice', title: '실습 11-1. 방문 기록기', desc: 'A 로 기록 추가, B 로 횟수 확인, A+B 로 초기화',
            starter: 'from microbit import *\nimport os\n\nwhile True:\n    a = button_a.was_pressed()\n    b = button_b.was_pressed()\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport os\n\n\ndef count_lines():\n    try:\n        n = 0\n        with open("visits.txt", "r") as f:\n            for line in f:\n                n = n + 1\n        return n\n    except OSError:\n        return 0\n\n\nwhile True:\n    a = button_a.was_pressed()\n    b = button_b.was_pressed()\n    if a and b:\n        if "visits.txt" in os.listdir():\n            os.remove("visits.txt")\n        display.show(Image.NO)\n        sleep(500)\n    elif a:\n        with open("visits.txt", "a") as f:\n            f.write(str(running_time() // 1000) + "\\n")\n        display.show(Image.YES)\n        sleep(300)\n    elif b:\n        display.scroll(str(count_lines()), delay=80)\n    sleep(50)\n',
            notes: '<p>a 모드를 w 로 잘못 쓰면 기록이 하나만 남는다는 것을 실험으로 보여 주면 확실히 기억합니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '1교시 정리', bullets: ['폴더 없음 · 약 30KB', '<code>with open(이름, 모드) as f:</code>', "<code>'r'</code> 읽기 / <code>'w'</code> 새로 쓰기 / <code>'a'</code> 이어 쓰기", '<code>try</code> / <code>except OSError:</code> 로 대비', '<code>os.listdir()</code> · <code>size()</code> · <code>remove()</code>'],
            notes: '<p>다음 시간 예고: log 모듈로 센서 데이터를 자동 기록하기.</p><p>시간: 3분</p>'
          }
        ]
      },

      /* ═══════════════════════ 2교시 ═══════════════════════ */
      {
        id: 'ch11-2',
        title: '데이터 로깅 — 센서 기록하기',
        minutes: 45,
        goals: [
          '<code>log</code> 모듈로 센서 값을 자동 기록할 수 있다',
          '<code>set_labels()</code> 와 <code>add()</code> 를 쓸 수 있다',
          '기록한 데이터를 표와 CSV 로 확인할 수 있다',
          '일정 간격으로 측정하는 프로그램을 설계할 수 있다'
        ],
        flow: [['데이터 로깅이란', 6], ['log 모듈 기본', 14], ['간격 측정', 12], ['분석하기', 10], ['정리 · 퀴즈', 3]],
        content: [
          { type: 'h', text: '데이터 로깅 — 과학 실험의 도구' },
          { type: 'p', html: '교실 온도가 하루 동안 어떻게 변할까? 창가와 복도 중 어디가 더 밝을까? 이런 질문에 답하려면 <b>일정 간격으로 측정해 기록</b>하고 나중에 그래프로 그려 봐야 합니다. 이것을 <b>데이터 로깅(data logging)</b> 이라고 합니다.' },
          { type: 'p', html: 'micro:bit <b>V2</b> 에는 이를 위한 <code>log</code> 모듈이 들어 있습니다. 직접 파일을 다루지 않아도 표 형태로 깔끔하게 기록해 줍니다.' },
          {
            type: 'table', head: ['', '직접 파일 쓰기 (1교시)', '<code>log</code> 모듈'], rows: [
              ['형식', '내가 정해야 함', '<b>표(CSV)</b> 형식 자동'],
              ['시간', '직접 기록해야 함', '<b>자동으로 붙음</b>'],
              ['확인', '텍스트로만', '표 · 그래프 · CSV 내려받기'],
              ['용량', '약 30KB', '별도 영역 (V2 는 약 120KB)'],
              ['쓰기 좋은 곳', '설정 · 점수 같은 작은 값', '센서 측정 기록']
            ]
          },

          { type: 'h', text: 'log 모듈 기본' },
          {
            type: 'code', title: '예제 11-9. 첫 데이터 기록', code: `from microbit import *
import log

# 어떤 값을 기록할지 이름(열 제목)을 미리 정한다
log.set_labels("temperature", "light")

display.scroll("LOG", delay=60)

for i in range(10):
    log.add({
        "temperature": temperature(),
        "light": display.read_light_level(),
    })
    display.show(i)
    sleep(1000)

display.show(Image.YES)`,
            hint: '실행한 뒤 오른쪽 <b>📊 로그</b> 탭을 눌러 표를 확인하세요. CSV 로 내려받을 수도 있습니다.',
            desc: '<code>set_labels()</code> 로 <b>열 제목</b>을 정하고, <code>add()</code> 로 한 줄씩 기록합니다. 시간은 자동으로 붙습니다. 10초 동안 1초마다 온도와 빛을 기록합니다.',
            expect: '📊 로그 탭에 Time · temperature · light 열이 있는 표가 만들어집니다.'
          },
          { type: 'callout', kind: 'tip', title: 'set_labels() 는 처음에 한 번만', html: '<code>set_labels()</code> 를 부르면 <b>기존 기록이 지워지고</b> 새 표가 시작됩니다. 프로그램 <b>시작 부분에서 한 번만</b> 부르세요. 반복 안에 넣으면 기록이 계속 사라집니다.' },
          {
            type: 'code', title: '예제 11-10. 시간 단위 정하기', code: `from microbit import *
import log

# timestamp: MILLISECONDS · SECONDS · MINUTES · HOURS · DAYS
log.set_labels("x", "y", "z", timestamp=log.MILLISECONDS)

display.show(Image.ARROW_E)

for i in range(20):
    x, y, z = accelerometer.get_values()
    log.add({"x": x, "y": y, "z": z})
    sleep(200)

display.show(Image.YES)`,
            hint: '🧭 센서 탭의 기울기 판을 움직이면서 실행한 뒤 📊 로그 탭을 확인하세요.',
            desc: '<code>timestamp</code> 로 시간 단위를 정합니다. 빠르게 변하는 값은 <code>MILLISECONDS</code>, 오래 측정할 때는 <code>MINUTES</code> 나 <code>HOURS</code> 가 좋습니다. <code>timestamp=None</code> 이면 시간을 기록하지 않습니다.',
            expect: '가속도 3축이 0.2초 간격으로 20번 기록됩니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '예제 11-11. 키워드로 간단히 쓰기', code: `from microbit import *
import log

log.set_labels("temp", "light", "sound")
log.set_mirroring(True)        # 콘솔에도 함께 출력

display.show(Image.ARROW_E)

for i in range(8):
    # 딕셔너리 대신 이름=값 형태로도 쓸 수 있다
    log.add(temp=temperature(),
            light=display.read_light_level(),
            sound=microphone.sound_level())
    sleep(800)

display.show(Image.YES)`,
            desc: '<code>log.add(이름=값, …)</code> 형태가 더 짧습니다. <code>set_mirroring(True)</code> 를 쓰면 기록할 때마다 <b>콘솔(USB 시리얼)</b> 에도 출력되어 실시간으로 확인할 수 있습니다.',
            expect: '{"temp": "24", "light": "128", "sound": "40"}\n… (콘솔에 8번 출력)',
            nondeterministic: true
          },
          {
            type: 'table', head: ['함수', '하는 일'], rows: [
              ['<code>log.set_labels(이름들…, timestamp=단위)</code>', '열 제목과 시간 단위 설정 (<b>기존 기록 삭제</b>)'],
              ['<code>log.add({"이름": 값, …})</code>', '한 줄 기록 (딕셔너리)'],
              ['<code>log.add(이름=값, …)</code>', '한 줄 기록 (키워드)'],
              ['<code>log.set_mirroring(True)</code>', '기록을 콘솔에도 출력'],
              ['<code>log.delete()</code>', '기록 전체 삭제'],
              ['<code>log.MILLISECONDS</code> ~ <code>log.DAYS</code>', '시간 단위 상수']
            ]
          },

          { type: 'h', text: '일정 간격으로 오래 측정하기' },
          {
            type: 'code', title: '예제 11-12. 10초마다 온도 기록', code: `from microbit import *
import log

INTERVAL = 10000          # 10초 (실제로는 60000 = 1분 등)

log.set_labels("temp", "light", timestamp=log.SECONDS)
display.scroll("REC", delay=60)

next_time = running_time()
count = 0

while True:
    now = running_time()

    if now >= next_time:
        log.add(temp=temperature(), light=display.read_light_level())
        count = count + 1
        next_time = next_time + INTERVAL
        display.show(Image.HEART)
        sleep(100)
        display.show(count % 10)

    # 측정 사이에도 버튼을 확인할 수 있다
    if button_a.was_pressed():
        display.scroll(str(count), delay=80)
        display.show(count % 10)

    sleep(50)`,
            desc: '<code>sleep(10000)</code> 으로 기다리면 그동안 <b>버튼을 누를 수 없습니다</b>. 대신 <code>running_time()</code> 으로 “다음 측정 시각” 을 계산해 두고 <b>지났는지만 확인</b>하면, 기다리는 동안에도 다른 일을 할 수 있습니다.',
            expect: '10초마다 기록되고, A 를 누르면 지금까지의 기록 수가 보입니다.',
            nondeterministic: true
          },
          { type: 'callout', kind: 'more', title: 'sleep 대신 시각 비교를 쓰는 이유', html: '<p><code>sleep(10000)</code> 은 10초 동안 <b>아무것도 못 합니다</b>. 버튼도, 센서도 확인할 수 없지요.</p><p><code>if now &gt;= next_time:</code> 방식은 짧은 <code>sleep(50)</code> 으로 계속 돌면서 “시간이 됐는지” 만 확인합니다. 이 구조를 쓰면 <b>여러 가지 일을 동시에</b> 하는 것처럼 만들 수 있습니다. 실제 임베디드 프로그램에서 아주 많이 쓰는 방법입니다.</p>' },
          {
            type: 'code', title: '예제 11-13. 버튼으로 기록 시작 · 정지', code: `from microbit import *
import log

INTERVAL = 2000

log.set_labels("temp", "light", timestamp=log.SECONDS)

recording = False
next_time = 0
count = 0
display.show(Image.SQUARE_SMALL)

while True:
    if button_a.was_pressed():
        recording = not recording
        next_time = running_time()
        display.show(Image.YES if recording else Image.NO)
        sleep(400)

    if button_b.was_pressed():
        log.delete()
        count = 0
        display.scroll("CLR", delay=60)

    if recording and running_time() >= next_time:
        log.add(temp=temperature(), light=display.read_light_level())
        count = count + 1
        next_time = next_time + INTERVAL

    if recording:
        display.show(Image.HEART if (running_time() // 500) % 2 else Image.HEART_SMALL)
    else:
        display.show(Image.SQUARE_SMALL)

    sleep(50)`,
            desc: 'A 로 기록을 켜고 끄고, B 로 지웁니다. 기록 중에는 하트가 뛰어 <b>동작 중임을 알려 줍니다</b>. 실제 측정 장비처럼 동작합니다.',
            expect: 'A 를 누르면 하트가 뛰며 2초마다 기록됩니다.',
            nondeterministic: true
          },

          { type: 'h', text: '기록한 데이터 확인하기' },
          {
            type: 'list', items: [
              '<b>시뮬레이터</b>: 오른쪽 <b>📊 로그</b> 탭에서 표로 보고 <b>⬇ CSV 내려받기</b> 로 저장합니다.',
              '<b>실제 보드</b>: USB 로 연결하면 나타나는 <code>MICROBIT</code> 드라이브 안의 <b><code>MY_DATA.HTM</code></b> 파일을 브라우저로 엽니다. 표와 그래프가 함께 보이고 CSV 로 받을 수 있습니다.',
              '<b>실시간</b>: <code>log.set_mirroring(True)</code> 로 콘솔에서 바로 확인합니다.',
              '내려받은 CSV 는 <b>엑셀 · 구글 스프레드시트</b>에서 열어 그래프로 그릴 수 있습니다.'
            ]
          },
          { type: 'callout', kind: 'board', title: '실제 보드의 MY_DATA.HTM', html: '<p>micro:bit V2 를 USB 로 연결하면 <code>MICROBIT</code> 드라이브에 <b><code>MY_DATA.HTM</code></b> 파일이 보입니다. 더블클릭하면 브라우저가 열리고 기록이 <b>표와 그래프</b>로 나타납니다.</p><p>데이터 저장 공간은 약 <b>120KB</b> 로, 열이 두세 개면 수천 줄을 기록할 수 있습니다. 가득 차면 더 이상 기록되지 않으니 <code>log.delete()</code> 로 비우세요.</p>' },
          {
            type: 'code', title: '예제 11-14. 기록 공간 관리', code: `from microbit import *
import log

MAX_ROWS = 100

log.set_labels("n", "temp")
count = 0
display.show(Image.ARROW_E)

while True:
    if button_a.was_pressed():
        if count >= MAX_ROWS:
            display.scroll("FULL", delay=60)
        else:
            log.add(n=count, temp=temperature())
            count = count + 1
            display.show(Image.YES)
            sleep(200)
            display.show(str(count // 10))

    if button_b.was_pressed():
        log.delete()
        count = 0
        display.scroll("CLR", delay=60)
        display.show(Image.ARROW_E)

    sleep(50)`,
            desc: '기록 줄 수를 직접 세어 상한을 두었습니다. 실제 프로젝트에서는 이렇게 <b>공간이 가득 차는 상황</b>을 미리 처리해 두는 것이 좋습니다.',
            expect: 'A 로 기록, 100줄이 넘으면 FULL, B 로 초기화'
          },

          { type: 'h', text: '더 해 보기' },
          {
            type: 'code', title: '더 해 보기 ①. 시간 단위를 바꿔 가며 기록', code: `from microbit import *
import log

for unit, name in [(log.MILLISECONDS, "MS"), (log.SECONDS, "SEC")]:
    log.set_labels("unit", "temp", timestamp=unit)
    display.scroll(name, delay=55)

    for i in range(4):
        log.add(unit=name, temp=temperature())
        sleep(400)

# 시간 없이 기록하기
log.set_labels("n", "value", timestamp=None)
for i in range(3):
    log.add(n=i, value=i * i)

display.show(Image.YES)
print("📊 로그 탭에서 세 가지 표를 확인하세요")`,
            hint: '실행 뒤 <b>📊 로그</b> 탭을 열어 보세요. (마지막 <code>set_labels</code> 의 표만 남습니다)',
            desc: '<code>set_labels()</code> 를 부를 때마다 <b>표가 새로 시작</b>합니다. <code>timestamp=None</code> 을 주면 시간 열이 아예 없어집니다 — 시간과 상관없는 측정값을 모을 때 씁니다.',
            expect: '📊 로그 탭에서 세 가지 표를 확인하세요'
          },
          {
            type: 'code', title: '더 해 보기 ②. 기록하면서 콘솔로도 확인하기', code: `from microbit import *
import log

log.set_labels("temp", "light", timestamp=log.SECONDS)
log.set_mirroring(True)          # ← 콘솔에도 함께 출력

display.show(Image.ARROW_E)

for i in range(6):
    log.add(temp=temperature(), light=display.read_light_level())
    display.show(i)
    sleep(700)

log.set_mirroring(False)
display.show(Image.YES)`,
            hint: '🧭 센서 탭의 온도 · 빛 슬라이더를 움직이며 콘솔을 보세요.',
            desc: '<code>set_mirroring(True)</code> 를 켜면 기록할 때마다 <b>콘솔에도 똑같이</b> 출력됩니다. 실제 보드에서는 USB 시리얼로 나가므로, 측정이 제대로 되고 있는지 실시간으로 확인할 수 있습니다.',
            expect: '{"temp": "24", "light": "128"}\n{"temp": "25", "light": "130"} …',
            nondeterministic: true
          },
          {
            type: 'code', title: '더 해 보기 ③. 기록 간격을 조절할 수 있게', code: `from microbit import *
import log

INTERVALS = [1000, 3000, 10000]      # 1초 · 3초 · 10초
choice = 0

log.set_labels("temp", "light", timestamp=log.SECONDS)
next_time = running_time()
count = 0

display.scroll("1S", delay=55)

while True:
    # A: 간격 바꾸기
    if button_a.was_pressed():
        choice = (choice + 1) % len(INTERVALS)
        display.scroll(str(INTERVALS[choice] // 1000) + "S", delay=55)
        next_time = running_time()

    # B: 지금까지 몇 개 모았나
    if button_b.was_pressed():
        display.scroll(str(count), delay=80)

    if running_time() >= next_time:
        log.add(temp=temperature(), light=display.read_light_level())
        count = count + 1
        next_time = next_time + INTERVALS[choice]
        display.show(Image.HEART)
        sleep(120)

    display.show(count % 10)
    sleep(60)`,
            desc: '측정 간격을 <b>실행 중에</b> 바꿀 수 있게 했습니다. 짧게 하면 자세하지만 공간이 빨리 차고, 길게 하면 오래 기록할 수 있습니다. 실제 관측 장비도 이런 설정을 제공합니다.',
            expect: 'A 로 1초 · 3초 · 10초 간격을 바꾸며 기록합니다.',
            nondeterministic: true
          },

          { type: 'h', text: '🚀 응용 예제 — 기록하고 분석하기' },
          { type: 'p', html: '측정하고 저장해서 나중에 분석하는 것은 과학 탐구의 기본입니다. 기록한 데이터는 <b>📊 로그</b> 탭에서 CSV 로 내려받아 스프레드시트로 그래프를 그려 보세요.' },
          {
            type: 'code', title: '응용 예제 11-1. 하루 온도 기록계', code: `from microbit import *
import log

INTERVAL = 10000          # 실제로는 60000(1분)이나 300000(5분)
MAX_ROWS = 200

log.set_labels("temp", "light", timestamp=log.MINUTES)

count = 0
next_time = running_time()
tmin, tmax = 99, -99

display.scroll("REC", delay=55)

while True:
    if running_time() >= next_time and count < MAX_ROWS:
        t = temperature()
        log.add(temp=t, light=display.read_light_level())
        count = count + 1
        next_time = next_time + INTERVAL

        tmin = min(tmin, t)
        tmax = max(tmax, t)
        print(count, "회 /", t, "도 (최저", tmin, "최고", tmax, ")")

    # A: 지금 상태 요약
    if button_a.was_pressed():
        display.scroll(str(count) + "X " + str(tmin) + "-" + str(tmax), delay=75)

    # B: 기록 지우고 새로 시작
    if button_b.was_pressed():
        log.delete()
        count, tmin, tmax = 0, 99, -99
        display.scroll("CLR", delay=55)

    # 기록 중임을 알리는 표시
    if count >= MAX_ROWS:
        display.show(Image.SQUARE)          # 가득 참
    else:
        display.show(Image.HEART if (running_time() // 600) % 2 else Image.HEART_SMALL)

    sleep(80)`,
            desc: '일정 간격으로 온도와 밝기를 기록하면서 <b>최저 · 최고</b>를 함께 추적합니다. 교실 창가에 하루 두고 측정한 뒤 CSV 를 내려받아 그래프를 그려 보세요. <code>MAX_ROWS</code> 로 공간이 넘치지 않게 막았습니다.',
            expect: '1 회 / 24 도 (최저 24 최고 24 )',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 11-2. 전원을 꺼도 남는 걸음 수', code: `from microbit import *
import music

FILE = "steps.txt"
THRESHOLD = 1400
SAVE_EVERY = 10               # 10걸음마다 저장 (너무 자주 쓰면 느려진다)


def load():
    try:
        with open(FILE, "r") as f:
            return int(f.read())
    except (OSError, ValueError):
        return 0


def save(n):
    with open(FILE, "w") as f:
        f.write(str(n))


steps = load()
unsaved = 0
above = False

print("이어서 세기:", steps, "걸음")
display.scroll(str(steps), delay=70)
display.show(Image.STICKFIGURE)

while True:
    if accelerometer.get_strength() > THRESHOLD:
        if not above:
            steps = steps + 1
            unsaved = unsaved + 1
            above = True
            if unsaved >= SAVE_EVERY:
                save(steps)
                unsaved = 0
                music.pitch(1000, 30)
            sleep(250)
    else:
        above = False

    if button_a.was_pressed():
        save(steps)
        display.scroll(str(steps), delay=80)
        display.show(Image.STICKFIGURE)

    if button_b.was_pressed():
        steps, unsaved = 0, 0
        save(steps)
        display.show(Image.NO)
        sleep(500)
        display.show(Image.STICKFIGURE)

    sleep(30)`,
            hint: '🧭 <b>흔들기</b> 버튼을 여러 번 눌러 걸음을 만든 뒤, 페이지를 새로 고쳐 이어지는지 확인하세요.',
            desc: '걸음 수를 파일에 저장해 <b>전원을 꺼도 이어집니다</b>. 매 걸음마다 저장하면 느려지므로 10걸음마다 한 번만 씁니다 — 실제 기기들도 쓰는 절충입니다.',
            expect: '이어서 세기: 37 걸음',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 11-3. 출석 체크', code: `from microbit import *
import music

MEMBERS = ["MIN", "SUA", "JUN", "HA", "YUL"]
FILE = "attend.txt"

index = 0
present = set()


def load():
    got = set()
    try:
        with open(FILE, "r") as f:
            for line in f:
                name = line.strip()
                if name:
                    got.add(name)
    except OSError:
        pass
    return got


def save():
    with open(FILE, "w") as f:
        for name in MEMBERS:
            if name in present:
                f.write(name + "\\n")


present = load()
print("불러온 출석:", present)
display.scroll(MEMBERS[index], delay=60)

while True:
    # A: 다음 사람
    if button_a.was_pressed():
        index = (index + 1) % len(MEMBERS)
        display.scroll(MEMBERS[index], delay=60)

    # B: 출석 체크 (있으면 빼고, 없으면 넣기)
    if button_b.was_pressed():
        name = MEMBERS[index]
        if name in present:
            present.discard(name)
            music.pitch(400, 100)
        else:
            present.add(name)
            music.pitch(900, 100)
        save()
        print(name, "→", "출석" if name in present else "결석")

    # 로고: 전체 현황
    if pin_logo.is_touched():
        display.scroll(str(len(present)) + "/" + str(len(MEMBERS)), delay=80)
        print("출석:", sorted(present))
        sleep(300)

    display.show(Image.YES if MEMBERS[index] in present else Image.NO)
    sleep(120)`,
            desc: '<b>집합(set)</b>은 “있다 · 없다” 만 다루는 자료형으로 출석 체크에 딱 맞습니다. <code>add</code> · <code>discard</code> · <code>in</code> 세 가지만 알면 됩니다. 체크할 때마다 파일에 저장되어 <b>전원을 꺼도 유지</b>됩니다.',
            expect: 'A 로 이름을 넘기고 B 로 출석을 체크합니다.',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 11-4. 버튼으로 재는 실험 데이터 수집기', code: `from microbit import *
import log
import music

log.set_labels("n", "temp", "light", "sound", timestamp=log.SECONDS)
n = 0

display.scroll("DATA", delay=55)
display.show(Image.ARROW_E)

while True:
    # A: 지금 값을 한 번 기록 (수동 측정)
    if button_a.was_pressed():
        n = n + 1
        t = temperature()
        l = display.read_light_level()
        s = microphone.sound_level()
        log.add(n=n, temp=t, light=l, sound=s)

        print(n, "번째 →", t, "도 /", l, "/", s)
        display.show(Image.YES)
        music.pitch(1000, 60)
        sleep(350)
        display.show(n % 10)

    # B: 몇 개 모았는지
    if button_b.was_pressed():
        display.scroll(str(n), delay=80)
        display.show(n % 10)

    # 로고: 전부 지우기
    if pin_logo.is_touched():
        log.delete()
        n = 0
        display.scroll("CLR", delay=55)
        display.show(Image.ARROW_E)

    sleep(60)`,
            desc: '자동이 아니라 <b>원할 때만</b> 측정합니다. “창가에서 한 번, 복도에서 한 번, 교실 가운데서 한 번” 처럼 장소를 옮겨 가며 재는 탐구 활동에 알맞습니다. CSV 로 받아 막대그래프로 비교해 보세요.',
            expect: '1 번째 → 24 도 / 128 / 40',
            nondeterministic: true
          },
          {
            type: 'code', title: '응용 예제 11-5. 기록이 남는 반응 속도 게임', code: `from microbit import *
import random
import music

FILE = "best.txt"


def load_best():
    try:
        with open(FILE, "r") as f:
            return int(f.read())
    except (OSError, ValueError):
        return 9999


def save_best(ms):
    with open(FILE, "w") as f:
        f.write(str(ms))


best = load_best()
full = Image("99999:99999:99999:99999:99999")

display.scroll("B" + (str(best) if best < 9999 else "-"), delay=70)

while True:
    display.scroll("WAIT", delay=60)
    button_a.was_pressed()

    # 부정 출발 확인
    cheat = False
    wait = random.randint(2000, 5000)
    t0 = running_time()
    while running_time() - t0 < wait:
        if button_a.was_pressed():
            cheat = True
            break
        sleep(20)

    if cheat:
        display.scroll("EARLY", delay=70)
        music.play(music.WAWAWAWAA)
    else:
        display.show(full)
        start = running_time()
        while not button_a.was_pressed():
            sleep(5)
        ms = running_time() - start

        display.clear()
        display.scroll(str(ms), delay=70)
        print("기록:", ms, "ms / 최고:", best)

        if ms < best:
            best = ms
            save_best(best)
            display.scroll("NEW BEST", delay=70)
            music.play(music.POWER_UP)
        else:
            music.play(music.BA_DING)

    display.show(Image.ARROW_E)
    while not button_b.was_pressed():
        sleep(50)`,
            desc: '4장의 반응 속도 게임에 <b>최고 기록 저장</b>을 더했습니다. 전원을 껐다 켜도 기록이 남아 여러 날에 걸쳐 도전할 수 있습니다. 부정 출발 확인도 들어 있습니다.',
            expect: '기록: 287 ms / 최고: 265',
            nondeterministic: true
          },

          { type: 'h', text: '2교시 · 11장 요약' },
          {
            type: 'list', items: [
              '<code>import log</code> — micro:bit <b>V2</b> 의 데이터 로깅 모듈.',
              '<code>log.set_labels("a", "b", timestamp=log.SECONDS)</code> — 열 제목과 시간 단위 (<b>기존 기록 삭제</b>, 시작에서 한 번만).',
              '<code>log.add(a=값, b=값)</code> — 한 줄 기록. 시간은 자동으로 붙습니다.',
              '<code>log.set_mirroring(True)</code> — 콘솔에도 출력, <code>log.delete()</code> — 전체 삭제.',
              '오래 측정할 때는 <code>sleep()</code> 대신 <b><code>running_time()</code> 비교</b>로 다른 일도 함께 처리합니다.',
              '결과는 <b>📊 로그 탭</b> 또는 실제 보드의 <b><code>MY_DATA.HTM</code></b> 에서 확인하고 CSV 로 내려받습니다.'
            ]
          }
        ],
        practice: [
          {
            title: '실습 11-3. 교실 환경 측정기',
            level: 2,
            desc: '<p>교실의 <b>온도 · 밝기 · 소음</b>을 5초마다 기록하는 장치를 만드세요.</p><ul><li>세 값을 한 줄로 기록합니다 (<code>timestamp=log.SECONDS</code>)</li><li>기록할 때마다 화면을 잠깐 깜빡여 알려 줍니다</li><li>A 를 누르면 현재 기록 수를, B 를 누르면 현재 온도를 보여 줍니다</li><li>기다리는 동안에도 버튼이 반응해야 합니다 (예제 11-12 참고)</li></ul><p>완성하면 📊 로그 탭에서 CSV 를 내려받아 표로 확인해 보세요.</p>',
            hint: '<code>next_time = running_time()</code> 으로 시작하고, <code>if running_time() &gt;= next_time:</code> 안에서 기록한 뒤 <code>next_time += 5000</code>.',
            starter: 'from microbit import *\nimport log\n\nINTERVAL = 5000\nlog.set_labels("temp", "light", "sound", timestamp=log.SECONDS)\n\nnext_time = running_time()\ncount = 0\ndisplay.show(Image.ARROW_E)\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport log\n\nINTERVAL = 5000\nlog.set_labels("temp", "light", "sound", timestamp=log.SECONDS)\n\nnext_time = running_time()\ncount = 0\ndisplay.show(Image.ARROW_E)\n\nwhile True:\n    if running_time() >= next_time:\n        log.add(temp=temperature(),\n                light=display.read_light_level(),\n                sound=microphone.sound_level())\n        count = count + 1\n        next_time = next_time + INTERVAL\n        display.show(Image.HEART)\n        sleep(150)\n        display.show(Image.ARROW_E)\n\n    if button_a.was_pressed():\n        display.scroll(str(count), delay=80)\n        display.show(Image.ARROW_E)\n\n    if button_b.was_pressed():\n        display.scroll(str(temperature()) + "C", delay=80)\n        display.show(Image.ARROW_E)\n\n    sleep(50)\n'
          },
          {
            title: '실습 11-4. 도전! 움직임 기록기',
            level: 3,
            desc: '<p>보드가 <b>움직일 때만</b> 기록하는 스마트 기록기를 만드세요.</p><ol><li><code>get_strength()</code> 가 1300 을 넘으면 “움직임” 으로 판단합니다.</li><li>움직임이 감지되면 그 시각과 세기, 온도를 기록합니다.</li><li>같은 움직임이 여러 번 기록되지 않도록 <b>한 번 기록한 뒤 1초</b> 쉽니다.</li><li>화면에는 지금까지의 기록 수를 표시합니다 (10 이상이면 <code>+</code> 로).</li><li>A 를 누르면 기록 수를 흘려보내고, B 를 길게 누르면(2초) 기록을 지웁니다.</li></ol>',
            hint: '“길게 누르기” 는 눌린 시각을 저장해 두고 <code>running_time() - pressed_at &gt; 2000</code> 으로 판단합니다.',
            starter: 'from microbit import *\nimport log\n\nlog.set_labels("strength", "temp", timestamp=log.SECONDS)\ncount = 0\n\nwhile True:\n    s = accelerometer.get_strength()\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport log\n\nTHRESHOLD = 1300\nlog.set_labels("strength", "temp", timestamp=log.SECONDS)\ncount = 0\npressed_at = None\ndisplay.show(0)\n\nwhile True:\n    s = accelerometer.get_strength()\n\n    if s > THRESHOLD:\n        log.add(strength=s, temp=temperature())\n        count = count + 1\n        print("기록", count, "세기", s)\n        display.show(Image.HEART)\n        sleep(1000)                      # 연속 기록 방지\n        display.show(count if count < 10 else "+")\n\n    if button_a.was_pressed():\n        display.scroll(str(count), delay=80)\n        display.show(count if count < 10 else "+")\n\n    # B 를 2초 이상 누르면 삭제\n    if button_b.is_pressed():\n        if pressed_at is None:\n            pressed_at = running_time()\n        elif running_time() - pressed_at > 2000:\n            log.delete()\n            count = 0\n            display.scroll("CLR", delay=60)\n            display.show(0)\n            pressed_at = None\n    else:\n        pressed_at = None\n\n    sleep(50)\n'
          }
        ],
        quiz: [
          {
            q: '<code>log.set_labels("a", "b")</code> 를 반복 안에 넣으면?', options: ['문제없다', '기록이 계속 지워진다', '열이 계속 늘어난다', '오류가 난다'], answer: 1,
            explain: '<code>set_labels()</code> 는 <b>기존 기록을 지우고</b> 새 표를 시작합니다. 반드시 프로그램 시작에서 한 번만 부르세요.'
          },
          {
            q: '<code>log.add(temp=24, light=100)</code> 과 같은 것은?', options: ['<code>log.add("temp", 24)</code>', '<code>log.add({"temp": 24, "light": 100})</code>', '<code>log.write(24, 100)</code>', '<code>log.set(temp=24)</code>'], answer: 1,
            explain: '딕셔너리로 주는 방식과 키워드로 주는 방식은 같은 결과입니다.'
          },
          {
            q: '기록한 데이터를 실제 보드에서 보려면?', options: ['<code>log.show()</code>', 'MICROBIT 드라이브의 <code>MY_DATA.HTM</code> 을 연다', '시리얼 콘솔에서만 볼 수 있다', '볼 수 없다'], answer: 1,
            explain: 'USB 로 연결하면 나타나는 <code>MICROBIT</code> 드라이브의 <b><code>MY_DATA.HTM</code></b> 을 브라우저로 열면 표와 그래프가 보입니다.'
          },
          {
            q: '10초마다 측정하면서 <b>버튼도 확인</b>하려면?', options: ['<code>sleep(10000)</code> 을 쓴다', '<code>running_time()</code> 으로 다음 측정 시각을 비교한다', '반복을 두 개 만든다', '불가능하다'], answer: 1,
            explain: '<code>sleep(10000)</code> 은 그동안 아무것도 못 합니다. 짧은 <code>sleep(50)</code> 으로 돌면서 “시간이 됐는지” 만 확인하면 여러 일을 함께 할 수 있습니다.'
          },
          {
            q: '<code>log.set_mirroring(True)</code> 의 효과는?', options: ['기록을 두 번 저장한다', '기록을 콘솔(USB 시리얼)에도 출력한다', '기록을 압축한다', '기록을 백업한다'], answer: 1,
            explain: '기록할 때마다 콘솔에도 출력되어 <b>실시간으로 확인</b>할 수 있습니다.'
          }
        ],
        slides: [
          {
            layout: 'title', title: '데이터 로깅 — 센서 기록하기', subtitle: 'Chapter 11 · 저장', badge: '2교시',
            notes: '<p>과학 탐구와 연결하기 좋은 시간입니다. 실제 측정 프로젝트를 제안해 보세요.</p><p>시간: 1분</p>'
          },
          {
            layout: 'bullets', title: '데이터 로깅이란?',
            bullets: ['일정 간격으로 <b>측정 → 기록 → 분석</b>', '교실 온도 변화, 창가 vs 복도 밝기', '기상 관측 · 환경 감시 · 실험 데이터', 'micro:bit V2 의 <code>log</code> 모듈'],
            notes: '<p><b>발문</b>: "우리 교실에서 측정해 보고 싶은 것은?" → 온도, 소음, 밝기, 이산화탄소 등.</p><p>시간: 6분</p>'
          },
          {
            layout: 'code', title: 'log 모듈 기본', code: 'from microbit import *\nimport log\n\nlog.set_labels("temperature", "light")\n\nfor i in range(10):\n    log.add({\n        "temperature": temperature(),\n        "light": display.read_light_level(),\n    })\n    sleep(1000)',
            points: ['<code>set_labels()</code> = 열 제목 (한 번만!)', '<code>add()</code> = 한 줄 기록', '시간은 <b>자동</b>으로 붙음', '📊 로그 탭에서 확인'],
            notes: '<p>실행 후 로그 탭의 표를 보여 주고 CSV 내려받기도 시연하세요.</p><p>시간: 10분</p>'
          },
          {
            layout: 'code', title: '더 짧게 · 실시간으로', code: 'log.set_labels("temp", "light", timestamp=log.SECONDS)\nlog.set_mirroring(True)     # 콘솔에도 출력\n\nlog.add(temp=temperature(),\n        light=display.read_light_level())',
            points: ['<code>이름=값</code> 형태가 더 짧음', '<code>timestamp</code> = MILLISECONDS ~ DAYS', '<code>set_mirroring(True)</code> = 실시간 확인', '<code>log.delete()</code> = 전체 삭제'],
            notes: '<p>mirroring 을 켜면 콘솔에서 바로 보이니 디버깅에 좋다는 점을 알려 주세요.</p><p>시간: 7분</p>'
          },
          {
            layout: 'code', title: 'sleep 대신 시각 비교', code: 'INTERVAL = 10000\nnext_time = running_time()\n\nwhile True:\n    if running_time() >= next_time:\n        log.add(temp=temperature())\n        next_time = next_time + INTERVAL\n\n    if button_a.was_pressed():     # 기다리는 중에도 반응!\n        display.scroll("OK")\n\n    sleep(50)',
            points: ['<code>sleep(10000)</code> = 10초간 <b>아무것도 못 함</b>', '시각 비교 = 다른 일도 함께', '임베디드에서 아주 많이 쓰는 방법', '여러 일을 동시에 하는 느낌'],
            notes: '<p>이 패턴은 중요합니다. 실제 기기들이 이렇게 동작한다고 알려 주세요.</p><p>시간: 10분</p>'
          },
          {
            layout: 'bullets', title: '기록 확인하기',
            bullets: ['시뮬레이터: <b>📊 로그 탭</b> → 표 · CSV 내려받기', '실제 보드: MICROBIT 드라이브의 <b>MY_DATA.HTM</b>', '실시간: <code>set_mirroring(True)</code> + 콘솔', 'CSV → 엑셀 · 구글 스프레드시트로 그래프'],
            notes: '<p>실제 보드가 있으면 MY_DATA.HTM 을 열어 그래프를 보여 주세요. 학생들이 놀랍니다.</p><p>시간: 6분</p>'
          },
          {
            layout: 'practice', title: '실습 11-3. 교실 환경 측정기', desc: '온도 · 밝기 · 소음을 5초마다 기록하고 CSV 로 내려받기',
            starter: 'from microbit import *\nimport log\n\nINTERVAL = 5000\nlog.set_labels("temp", "light", "sound", timestamp=log.SECONDS)\nnext_time = running_time()\n\nwhile True:\n    # TODO\n    sleep(50)\n',
            solution: 'from microbit import *\nimport log\n\nINTERVAL = 5000\nlog.set_labels("temp", "light", "sound", timestamp=log.SECONDS)\nnext_time = running_time()\ncount = 0\ndisplay.show(Image.ARROW_E)\n\nwhile True:\n    if running_time() >= next_time:\n        log.add(temp=temperature(),\n                light=display.read_light_level(),\n                sound=microphone.sound_level())\n        count = count + 1\n        next_time = next_time + INTERVAL\n        display.show(Image.HEART)\n        sleep(150)\n        display.show(Image.ARROW_E)\n\n    if button_a.was_pressed():\n        display.scroll(str(count), delay=80)\n        display.show(Image.ARROW_E)\n\n    sleep(50)\n',
            notes: '<p>실제로 하루 동안 교실에 두고 측정하는 과제로 확장하면 훌륭한 탐구 활동이 됩니다.</p><p>시간: 12분</p>'
          },
          {
            layout: 'summary', title: '11장 정리', bullets: ['<code>with open(이름, 모드) as f:</code> · r / w / a', '<code>try</code> / <code>except OSError:</code> · <code>os.listdir()</code>', '<code>log.set_labels()</code> (한 번만) · <code>log.add()</code>', 'sleep 대신 <code>running_time()</code> 비교', '📊 로그 탭 · MY_DATA.HTM · CSV'],
            notes: '<p>11장 정리. 다음 장 예고: 말하기와 소리 — micro:bit 가 말을 한다!</p><p>과제: 집에서 하루 온도 측정해 오기.</p><p>시간: 3분</p>'
          }
        ]
      }
    ]
  });
})();
