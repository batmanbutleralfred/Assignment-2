/**
 * Interfaces for Assignment 2 [cite: 1]
 */
interface CubicResults {
    p: number;
    q: number;
    discriminant: number;
    roots: (number | string)[]; // Supports "Complex Number" strings 
}

// 1. Setup CSS [cite: 5]
const style = document.createElement('style');
style.textContent = `
    body { font-family: 'Segoe UI', Arial, sans-serif; text-align: center; background-color: #f9f9f9; margin: 0; padding: 20px; }
    h1 { color: #ff7f00; }
    #equation-display { font-size: 1.6rem; margin-bottom: 20px; font-weight: bold; color: #333; }
    .input-container { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; }
    .input-box { display: flex; flex-direction: column; align-items: center; font-weight: bold; }
    input { padding: 10px; width: 80px; border: 1px solid #D3D3D3; border-radius: 8px; text-align: center; }
    button { background-color: #ff7f00; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-weight: bold; margin-bottom: 20px; }
    button:hover { background-color: #e67300; }

    /* Side-by-side Layout  */
    .main-content { display: flex; justify-content: center; align-items: flex-start; gap: 40px; flex-wrap: wrap; margin-top: 20px; }
    
    .result-table { margin: 0; border-collapse: collapse; width: 350px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    .result-table td { border: 1px solid #f0f0f0; padding: 12px 20px; text-align: left; color: #444; }
    .result-table tr td:last-child { text-align: right; font-family: monospace; }
    .orange-header { background-color: #ff7f00; color: white !important; font-weight: bold; }
    
    canvas { background: white; border: 1px solid #ddd; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
`;
document.head.appendChild(style);

// 2. Inject HTML Structure [cite: 5, 6, 30]
document.body.innerHTML = `
    <h1>Cubic Solver</h1>
    <div id="equation-display">ax³ + bx² + cx + d = 0</div>
    <div class="input-container">
        <div class="input-box"><label>a-value:</label><input type="number" id="a_val" value="1"></div>
        <div class="input-box"><label>b-value:</label><input type="number" id="b_val" value="6"></div>
        <div class="input-box"><label>c-value:</label><input type="number" id="c_val" value="11"></div>
        <div class="input-box"><label>d-value:</label><input type="number" id="d_val" value="6"></div>
    </div>
    <button id="solveBtn">Solve Cubic</button>
    <div class="main-content">
        <div id="output"></div>
        <canvas id="graph" width="600" height="400"></canvas>
    </div>
`;

/**
 * 3. Graphing Logic using Canvas API 
 */
const drawGraph = (a: number, b: number, c: number, d: number): void => {
    const canvas = document.getElementById("graph") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;
    const scale = 30; // Scale factor for visibility

    // Draw Axes [cite: 32, 33, 34, 35]
    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(w, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, h);
    ctx.stroke();

    // Draw Cubic Curve [cite: 36, 37, 42]
    ctx.strokeStyle = "#ff7f00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
        const x = (px - centerX) / scale;
        const y = a * (x ** 3) + b * (x ** 2) + c * x + d;
        const py = centerY - (y * scale);
        
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
};

/**
 * 4. UI Rendering for Results Table [cite: 14, 20]
 */
const renderTable = (data: CubicResults): void => {
    const output = document.getElementById('output');
    if (!output) return;

    const rootHtml = data.roots.map((r, i) => {
        const xVal = typeof r === 'number' ? r.toFixed(2) : r;
        const yVal = typeof r === 'number' ? "0" : "-";
        return `<tr><td>Root ${i + 1}</td><td>${xVal} &nbsp;&nbsp;&nbsp; ${yVal}</td></tr>`;
    }).join('');

    output.innerHTML = `
        <table class="result-table">
            <tr><td>p</td><td>${data.p.toFixed(5)}</td></tr>
            <tr><td>q</td><td>${data.q.toFixed(5)}</td></tr>
            <tr><td>Discriminant</td><td>${data.discriminant.toFixed(5)}</td></tr>
            <tr class="orange-header">
                <td>Value</td>
                <td style="text-align: center">x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; y</td>
            </tr>
            ${rootHtml}
        </table>
    `;
};

/**
 * 5. Main Solver Logic [cite: 12, 13]
 */
const solveCubic = (): void => {
    const a = parseFloat((document.getElementById('a_val') as HTMLInputElement).value) || 0;
    const b = parseFloat((document.getElementById('b_val') as HTMLInputElement).value) || 0;
    const c = parseFloat((document.getElementById('c_val') as HTMLInputElement).value) || 0;
    const d = parseFloat((document.getElementById('d_val') as HTMLInputElement).value) || 0;

    if (a === 0) {
        alert("Coefficient 'a' cannot be zero.");
        return;
    }

    // Display formatted equation 
    document.getElementById('equation-display')!.innerHTML = 
        `${a}x³ + ${b}x² + ${c}x + ${d} = 0`;

    // Cardano's Calculations
    const f = ((3 * c / a) - (b * b / (a * a))) / 3;
    const g = ((2 * (b ** 3) / (a ** 3)) - (9 * b * c / (a * a)) + (27 * d / a)) / 27;
    const h = (g * g / 4) + (f * f * f / 27);

    let roots: (number | string)[] = [];

    if (h <= 0) {
        // Three real roots [cite: 12]
        const i = Math.sqrt((g * g / 4) - h);
        const j = Math.pow(i, 1 / 3);
        const k = Math.acos(-(g / (2 * i)));
        const L = j * -1;
        const M = Math.cos(k / 3);
        const N = Math.sqrt(3) * Math.sin(k / 3);
        const P = (b / (3 * a)) * -1;

        roots.push(2 * j * Math.cos(k / 3) - (b / (3 * a)));
        roots.push(L * (M + N) + P);
        roots.push(L * (M - N) + P);
    } else {
        // One real root and two complex roots 
        const R = -(g / 2) + Math.sqrt(h);
        const S = (R < 0) ? -Math.pow(-R, 1/3) : Math.pow(R, 1/3);
        const T = -(g / 2) - Math.sqrt(h);
        const U = (T < 0) ? -Math.pow(-T, 1/3) : Math.pow(T, 1/3);
        
        roots.push((S + U) - (b / (3 * a)));
        roots.push("Complex Number"); // 
        roots.push("Complex Number"); // 
    }

    renderTable({ p: f, q: g, discriminant: h, roots });
    drawGraph(a, b, c, d); // 
};

// Event Listener [cite: 11]
document.getElementById('solveBtn')?.addEventListener('click', solveCubic);