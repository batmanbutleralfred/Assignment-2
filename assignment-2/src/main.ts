interface CubicResults {
    p: number;
    q: number;
    discriminant: number;
    roots: (number | string)[];
}

const style = document.createElement('style');
style.textContent = `
body { font-family:'Segoe UI',Arial; text-align:center; background:#f9f9f9; padding:20px }
h1 { color:#ff7f00 }
.input-container { display:flex; justify-content:center; gap:15px; margin-bottom:20px }
.input-box { display:flex; flex-direction:column; align-items:center; font-weight:bold }
input { padding:10px; width:80px; border:1px solid #ddd; border-radius:8px; text-align:center }
button { background:#ff7f00; color:white; border:none; padding:12px 25px; border-radius:5px; cursor:pointer; font-weight:bold }
button:hover { background:#e67300 }
.main-content { display:flex; justify-content:center; gap:40px; margin-top:20px }
.result-table { border-collapse:collapse; width:350px; background:white; box-shadow:0 2px 10px rgba(0,0,0,0.1) }
.result-table td { border:1px solid #eee; padding:12px }
.orange-header { background:#ff7f00; color:white; font-weight:bold }
canvas { background:white; border:1px solid #ddd }
`;
document.head.appendChild(style);

document.body.innerHTML = `
<h1>Cubic Solver</h1>
<div id="equation-display">ax³ + bx² + cx + d = 0</div>

<div class="input-container">
<div class="input-box"><label>a</label><input id="a_val" type="number" value="1"></div>
<div class="input-box"><label>b</label><input id="b_val" type="number" value="6"></div>
<div class="input-box"><label>c</label><input id="c_val" type="number" value="11"></div>
<div class="input-box"><label>d</label><input id="d_val" type="number" value="6"></div>
</div>

<button id="solveBtn">Solve Cubic</button>

<div class="main-content">
<div id="output"></div>
<canvas id="graph" width="600" height="400"></canvas>
</div>
`;

const drawGraph = (a: number, b: number, c: number, d: number, roots: (number | string)[]) => {
    const canvas = document.getElementById("graph") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;
    const scale = 30;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;

    // vertical grid lines
    for (let x = centerX % scale; x < w; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }

    // horizontal grid lines
    for (let y = centerY % scale; y < h; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, h);
    ctx.stroke();

    ctx.strokeStyle = "#ff7f00";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px < w; px++) {
        const x = (px - centerX) / scale;
        const y = a * x * x * x + b * x * x + c * x + d;
        const py = centerY - y * scale;

        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }

    ctx.stroke();

    ctx.fillStyle = "red";
    roots.forEach(r => {
        if (typeof r === "number") {
            const px = Math.round(centerX + r * scale);
            ctx.beginPath();
            ctx.arc(px, centerY, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    const py = centerY - d * scale;
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(centerX, py, 5, 0, Math.PI * 2);
    ctx.fill();
};

const renderTable = (data: CubicResults) => {
    const output = document.getElementById("output");
    if (!output) return;

    const rootRows = data.roots.map((r, i) => {
        const x = typeof r === "number" ? r.toFixed(2) : r;
        const y = typeof r === "number" ? "0" : "-";
        return `<tr><td>Root ${i + 1}</td><td>${x} &nbsp;&nbsp; ${y}</td></tr>`;
    }).join("");

    output.innerHTML = `
<table class="result-table">
<tr><td>p</td><td>${data.p.toFixed(5)}</td></tr>
<tr><td>q</td><td>${data.q.toFixed(5)}</td></tr>
<tr><td>Discriminant</td><td>${data.discriminant.toFixed(5)}</td></tr>
<tr class="orange-header"><td>Value</td><td>x&nbsp;&nbsp;&nbsp;y</td></tr>
${rootRows}
</table>
`;
};

const solveCubic = () => {

    const a = parseFloat((document.getElementById("a_val") as HTMLInputElement).value);
    const b = parseFloat((document.getElementById("b_val") as HTMLInputElement).value);
    const c = parseFloat((document.getElementById("c_val") as HTMLInputElement).value);
    const d = parseFloat((document.getElementById("d_val") as HTMLInputElement).value);

    if (a === 0) { alert("a cannot be zero"); return; }

    document.getElementById("equation-display")!.innerHTML =
        `${a}x³ + ${b}x² + ${c}x + ${d} = 0`;

    const f = ((3 * c / a) - (b * b / (a * a))) / 3;
    const g = ((2 * b * b * b / (a * a * a)) - (9 * b * c / (a * a)) + (27 * d / a)) / 27;
    const h = (g * g / 4) + (f * f * f / 27);

    let roots: (number | string)[] = [];
    const EPS = 1e-10;

    if (Math.abs(h) < EPS && Math.abs(g) < EPS) {

        const root = -b / (3 * a);
        roots = [root, root, root];

    }
    else if (h < 0) {

        const i = Math.sqrt((g * g / 4) - h);
        const j = Math.cbrt(i);
        const k = Math.acos(-(g / (2 * i)));
        const m = Math.cos(k / 3);
        const n = Math.sin(k / 3) * Math.sqrt(3);
        const p = -b / (3 * a);

        roots = [
            2 * j * m + p,
            -j * (m + n) + p,
            -j * (m - n) + p
        ];

    }

    else if (Math.abs(h) <= EPS) {

        const r = Math.cbrt(-g / 2);
        const root1 = 2 * r - (b / (3 * a));
        const root2 = -r - (b / (3 * a));

        roots = [root1, root2, root2];

    }

    else {

        const R = -(g / 2) + Math.sqrt(h);
        const S = Math.cbrt(R);
        const T = -(g / 2) - Math.sqrt(h);
        const U = Math.cbrt(T);

        roots = [(S + U) - (b / (3 * a)), "Complex Number", "Complex Number"];



    }

    roots = roots.map(r => {
        if (typeof r === "number") {
            const clean = parseFloat(r.toFixed(6));
            return Object.is(clean, -0) ? 0 : clean;
        }
        return r;
    });

    renderTable({ p: f, q: g, discriminant: h, roots });
    drawGraph(a, b, c, d, roots);

};

document.getElementById("solveBtn")?.addEventListener("click", solveCubic);