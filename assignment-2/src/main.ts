/**
 * Interfaces for clarity
 */
interface CubicResults {
    p: number;
    q: number;
    discriminant: number;
    roots: number[];
}

// Keep your existing CSS injection (Simplified for TS string template)
const style: HTMLStyleElement = document.createElement('style');
style.textContent = `
    body { font-family: 'Segoe UI', Arial, sans-serif; text-align: center; background-color: #f9f9f9; margin: 0; padding: 20px; }
    h1 { color: #ff7f00; }
    .input-container { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; }
    .input-box { display: flex; flex-direction: column; align-items: center; }
    input { padding: 10px; width: 80px; border: 1px solid #D3D3D3; border-radius: 8px; text-align: center; }
    button { background-color: #ff7f00; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-weight: bold; }
    button:hover { background-color: #e67300; }

    /* Table styling to match the image precisely */
    .result-table { margin: 30px auto; border-collapse: collapse; width: 350px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    .result-table td { border: 1px solid #f0f0f0; padding: 12px 20px; text-align: left; color: #444; }
    .result-table tr td:last-child { text-align: right; font-family: monospace; }
    .orange-header { background-color: #ff7f00; color: white !important; font-weight: bold; }
    .orange-header td { color: white !important; border: none; }
`;
document.head.appendChild(style);

// Inject HTML
document.body.innerHTML = `
    <h1>Cubic Root Solver</h1>
    <div class="input-container">
        <div class="input-box"><label>a</label><input type="number" id="a_val" value=""></div>
        <div class="input-box"><label>b</label><input type="number" id="b_val" value=""></div>
        <div class="input-box"><label>c</label><input type="number" id="c_val" value=""></div>
        <div class="input-box"><label>d</label><input type="number" id="d_val" value=""></div>
    </div>
    <button id="solveBtn">Solve Cubic</button>
    <div id="output"></div>
`;

/**
 * Main Solver Logic
 */
const solveCubic = (): void => {
    // Type casting to HTMLInputElement
    const a = parseFloat((document.getElementById('a_val') as HTMLInputElement).value);
    const b = parseFloat((document.getElementById('b_val') as HTMLInputElement).value);
    const c = parseFloat((document.getElementById('c_val') as HTMLInputElement).value);
    const d = parseFloat((document.getElementById('d_val') as HTMLInputElement).value);

    if (a === 0) {
        alert("Coefficient 'a' cannot be zero.");
        return;
    }

    // Cardano's Method constants
    const f: number = ((3 * c / a) - (b * b / (a * a))) / 3;
    const g: number = ((2 * Math.pow(b, 3) / Math.pow(a, 3)) - (9 * b * c / (a * a)) + (27 * d / a)) / 27;
    const h: number = (g * g / 4) + (f * f * f / 27);

    let roots: number[] = [];

    if (h <= 0) {
        // 3 Real Roots
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
        // 1 Real Root (Simplified for display)
        const R = -(g / 2) + Math.sqrt(h);
        const S = Math.pow(R, 1 / 3);
        const T = -(g / 2) - Math.sqrt(h);
        const U = (T < 0) ? -Math.pow(-T, 1 / 3) : Math.pow(T, 1 / 3);
        roots.push((S + U) - (b / (3 * a)));
    }

    renderTable({ p: f, q: g, discriminant: h, roots });
};

/**
 * UI Rendering
 */
const renderTable = (data: CubicResults): void => {
    const output = document.getElementById('output');
    if (!output) return;

    let rootHtml = data.roots
        .sort((a, b) => b - a)
        .map((r, i) => `<tr><td>Root ${i + 1}</td><td>${r.toFixed(2)} &nbsp;&nbsp;&nbsp; 0</td></tr>`)
        .join('');

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

// Event Listener
document.getElementById('solveBtn')?.addEventListener('click', solveCubic);