p = 'assets/art.js'
s = open(p, encoding='utf-8').read()

def rep(a, b):
    global s
    assert s.count(a) == 1, a[:70]
    s = s.replace(a, b)

# 🏠 фон «room» — звичайна кімната: полиця з книжками, вікно, картина, рослина
ROOM = r"""    /* Звичайна кімната (вдома, у школі, в бібліотеці): не кухня й не кабінет, тож
       підходить до розмов про безпеку, гроші, право — коли місце дії неважливе. */
    room() {
      let s = `<rect width="400" height="300" fill="#ede7f6"/>`;
      for (let x = 0; x < 400; x += 40) s += `<rect x="${x}" y="0" width="20" height="230" fill="#e3dcf3"/>`;
      s += `<rect x="20" y="40" width="96" height="150" rx="4" fill="#a1887f" ${O}/>`;
      for (const y of [76, 112, 148]) s += `<line x1="20" y1="${y}" x2="116" y2="${y}" ${O}/>`;
      const books = [['#ef5350', 12], ['#42a5f5', 10], ['#66bb6a', 14], ['#ffca28', 11], ['#ab47bc', 12]];
      for (const [row, y] of [[0, 46], [1, 82], [2, 118]]) {
        let x = 26 + row * 4;
        books.forEach(([c, w], i) => { if ((i + row) % 5 === 4) return; s += `<rect x="${x}" y="${y + (i % 2) * 4}" width="${w}" height="${26 - (i % 2) * 4}" fill="${c}" ${O2}/>`; x += w + 3; });
      }
      s += `<rect x="232" y="30" width="120" height="92" rx="4" fill="#bfe6ff" ${O}/><line x1="292" y1="30" x2="292" y2="122" ${O}/><line x1="232" y1="76" x2="352" y2="76" ${O}/>`;
      s += `<path d="M226,24 h24 q-8,54 0,104 h-24z" fill="#ffcc80" ${O}/><path d="M358,24 h-24 q8,54 0,104 h24z" fill="#ffcc80" ${O}/>`;
      s += `<rect x="148" y="52" width="58" height="44" fill="#fff" stroke="#8d6e63" stroke-width="5"/><path d="M152,92 L170,72 L184,84 L202,66 V92Z" fill="#81c784"/><circle cx="192" cy="62" r="6" fill="#ffca28"/>`;
      s += `<path d="M372,230 q-6,-40 8,-62 M372,230 q4,-46 -14,-70 M372,230 q10,-30 22,-44" fill="none" stroke="#388e3c" stroke-width="6" stroke-linecap="round"/><path d="M358,230 h28 l-4,22 h-20z" fill="#ff8a65" ${O}/>`;
      s += `<rect x="-5" y="230" width="410" height="76" fill="#d7b48a" ${O}/>`;
      for (let x = 0; x < 400; x += 56) s += `<line x1="${x}" y1="230" x2="${x - 20}" y2="300" stroke="#b98d5e" stroke-width="3"/>`;
      return { svg: s, ground: 292 };
    },
    home() {"""
rep("    home() {", ROOM)

# 🛂 предмет «passport»
rep("    stetoskop: () => `", "    passport: () => `<rect x=\"-18\" y=\"-50\" width=\"36\" height=\"50\" rx=\"4\" fill=\"#8e1b2c\" ${O}/><circle cx=\"0\" cy=\"-30\" r=\"9\" fill=\"none\" stroke=\"#f4c542\" stroke-width=\"2.5\"/><path d=\"M-6,-30 h12 M0,-36 v12\" stroke=\"#f4c542\" stroke-width=\"2\"/><rect x=\"-11\" y=\"-14\" width=\"22\" height=\"4\" rx=\"2\" fill=\"#f4c542\"/>`,\n    stetoskop: () => `")

# 🤔 настрій «think»: погляд угору вбік, одна брова піднята, рот набік
rep("    if (mood === 'surprised') return pair(x => `<circle cx=\"${x}\" cy=\"-3\" r=\"7\" fill=\"#fff\" ${O2}/><circle cx=\"${x}\" cy=\"-3\" r=\"3\" fill=\"${INK}\"/>`);\n    let s = pair(",
    "    if (mood === 'surprised') return pair(x => `<circle cx=\"${x}\" cy=\"-3\" r=\"7\" fill=\"#fff\" ${O2}/><circle cx=\"${x}\" cy=\"-3\" r=\"3\" fill=\"${INK}\"/>`);\n    if (mood === 'think') return pair(x => `<ellipse cx=\"${x + 2}\" cy=\"-5\" rx=\"3.6\" ry=\"4.6\" fill=\"${INK}\"/>`) + `<path d=\"M-18,-14 L-6,-13 M6,-17 Q12,-21 18,-16\" ${O}/>`;\n    let s = pair(")
rep("    angry: `<path d=\"M-8,14 q8,-4 16,0\" fill=\"none\" ${O}/>`\n  }[mood]",
    "    angry: `<path d=\"M-8,14 q8,-4 16,0\" fill=\"none\" ${O}/>`,\n    think: `<path d=\"M-4,13 q6,-1 11,-4\" fill=\"none\" ${O}/>`\n  }[mood]")

# робот: «думає» — очі вгору, рот хвилькою
rep("      angry: x => `<path d=\"M${x - 6},${x < 0 ? -7 : -1} L${x + 6},${x < 0 ? -1 : -7}\" stroke=\"#ff5252\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>`\n    }[mood]",
    "      angry: x => `<path d=\"M${x - 6},${x < 0 ? -7 : -1} L${x + 6},${x < 0 ? -1 : -7}\" stroke=\"#ff5252\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>`,\n      think: x => `<rect x=\"${x - 2}\" y=\"-12\" width=\"8\" height=\"8\" rx=\"3\" fill=\"${led}\"/>`\n    }[mood]")
rep("      angry: `<path d=\"M-8,11 h16\" stroke=\"#ff5252\" stroke-width=\"3\" stroke-linecap=\"round\"/>`\n    }[mood]",
    "      angry: `<path d=\"M-8,11 h16\" stroke=\"#ff5252\" stroke-width=\"3\" stroke-linecap=\"round\"/>`,\n      think: `<path d=\"M-8,10 q4,-4 8,0 q4,4 8,0\" fill=\"none\" stroke=\"${led}\" stroke-width=\"3\" stroke-linecap=\"round\"/>`\n    }[mood]")

# 🗣️ поза «talk»: одна рука опущена, друга вперед на рівні грудей — пояснює
rep("      walk: [[-shx - 16, shy + armL * 0.9], [shx + 16, shy + armL * 0.9]]\n    }[pose]",
    "      walk: [[-shx - 16, shy + armL * 0.9], [shx + 16, shy + armL * 0.9]],\n      talk: [[-shx - 8, shy + armL], [shx + armL * 0.72, shy + armL * 0.22]]\n    }[pose]")
rep("hips: [[-48, -62], [48, -62]], walk: [[-42, -52], [42, -64]] }[pose]",
    "hips: [[-48, -62], [48, -62]], walk: [[-42, -52], [42, -64]], talk: [[-40, -46], [62, -72]] }[pose]")

rep("moods: ['normal', 'happy', 'grin', 'surprised', 'sad', 'angry'], poses: ['down', 'wave', 'cheer', 'point', 'hold', 'hips', 'walk'] };",
    "moods: ['normal', 'happy', 'grin', 'surprised', 'sad', 'angry', 'think'], poses: ['down', 'wave', 'cheer', 'point', 'hold', 'hips', 'walk', 'talk'] };")
open(p, 'w', encoding='utf-8').write(s)
print('ok')
