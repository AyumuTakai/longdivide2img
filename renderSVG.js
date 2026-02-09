const create = (name) => {
    const SVG_NS = "http://www.w3.org/2000/svg";
    return document.createElementNS(SVG_NS, name);
}

const divSymbol = (x, height, width, length, strokeWidth = 2.5) => {
    const symbol = create("path");
    symbol.setAttributeNS(null, "fill", "transparent");
    symbol.setAttributeNS(null, "stroke", "black");
    symbol.setAttributeNS(null, "stroke-width", strokeWidth);
    const path = `M${x + width / 3} ${height * 2} Q ${x + width} ${height * 1.5}, ${x + width / 3} ${height} H ${x + width + length + width}`;
    symbol.setAttributeNS(null, "d", path);
    return symbol;
}

const createGroup = (fontSize,family="math") => {
    const g = create("g");
    g.setAttributeNS(null, "font-size", fontSize);
    g.setAttributeNS(null, "font-family", family);
    return g;
}

const createText = (x, row, lineHeight, width, content) => {
    if (content.length == 0) {
        return null;
    }
    const oc = content.replaceAll(' ', '_');
    const ox = x;
    const oy = row * lineHeight - lineHeight * 0.15;

    const text = create("text");
    text.setAttributeNS(null,'white-space','pre');
    let c = 0;
    for (let i = 0; i < content.length; i++) {
        if (content[i] !== " ") {
            break;
        }
        c++;
        x += width;
    }
    text.setAttributeNS(null, "x", x);
    text.setAttributeNS(null, "y", oy);
    content = content.trim();
    text.textContent = content;
    // console.log({
    //     ox, oy, x, row, content, length: content.length, c, oc
    // });
    return text;
}

function generate(svg, script) {
    const lineHeight = 30;
    const radix = 10;

    let maxW = 0;
    let maxH = 0;

    // 文字サイズの取得
    const unitText = createText(0, 0, lineHeight, 0, "M");
    svg.appendChild(unitText);
    const charSize = unitText.getBBox();
    const width = charSize.width;
    // console.log({ width, height: charSize.height });

    // 要素を全て削除
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    // 文字表示用グループ作成
    const numbers = createGroup(lineHeight);
    svg.appendChild(numbers);


    const lines = script.split("\n");
    console.log({ lines });

    let row = 1;
    lines.forEach(line => {
        if (line.length == 0) {
            return;
        }
        // console.log(line);
        const found = /(.+?)\s*\/\s*(.+?)\s*$/.exec(line);
        if (found) {
            // 除算記号
            const divisor = found[1];
            const dividend = found[2];

            // 序数
            const divisorText = createText(0, 2, lineHeight, width, divisor);
            numbers.appendChild(divisorText);
            const divisorBBox = divisorText.getBBox();
            maxW = Math.max(divisorBBox.x + divisorBBox.width, maxW);
            maxH = Math.max(divisorBBox.y + divisorBBox.height, maxH);

            // 被序数
            const dividendText = createText((("" + divisor).length + 1) * width, 2, lineHeight, width, dividend);
            numbers.appendChild(dividendText);
            const dividendBBox = dividendText.getBBox();
            maxW = Math.max(dividendBBox.x + dividendBBox.width, maxW);
            maxH = Math.max(dividendBBox.y + dividendBBox.height, maxH);

            // 被除数の数値部分の表示幅
            const result = /^\s*([+-]?(?:\d+\.?\d*|\.\d+))/.exec(dividend);
            console.log({result});
                const vText = createText(0,0,lineHeight,width,result[1]);
                numbers.appendChild(vText);
                const vTextBBox = vText.getBBox();


            // 筆算記号
            const symbol = divSymbol(divisorBBox.width, lineHeight, width, vTextBBox.width);
            const symbolBBox = symbol.getBBox();
            maxW = Math.max(symbolBBox.x + symbolBBox.width, maxW);
            maxH = Math.max(symbolBBox.y + symbolBBox.height, maxH);
            svg.appendChild(symbol);
        } else {
            // ハイフンのみは横線
            const found = /\s*(-+)\s*$/.exec(line);
            let x = 0;
            if (found) {
                const len = found[1].length
                console.log({ len, row, lineHeight, width, line });
                row--;
                for (let i = 0; i < line.length; i++) {
                    if (line[i] !== " ") {
                        break;
                    }
                    x += width;
                }
                const hr = create('line');
                hr.setAttributeNS(null, 'x1', x);
                hr.setAttributeNS(null, 'y1', row * lineHeight);
                hr.setAttributeNS(null, 'x2', x + width * len);
                hr.setAttributeNS(null, 'y2', row * lineHeight);
                hr.setAttributeNS(null, 'stroke', 'black');
                hr.setAttributeNS(null, 'stroke-width', 2);
                svg.appendChild(hr);
            } else {
                // 途中の値
                console.log({ row, lineHeight, width, line });
                lineText = createText(0, row, lineHeight, width, line);
                numbers.appendChild(lineText);
                const lineTextBBox = lineText.getBBox();
                maxW = Math.max(lineTextBBox.x + lineTextBBox.width, maxW);
                maxH = Math.max(lineTextBBox.y + lineTextBBox.height, maxH);

            }
        }
        svg.setAttributeNS(null, 'width', Math.floor(maxW * 1.1));
        svg.setAttributeNS(null, 'height', Math.floor(maxH * 1.1));
        row++;
    });
};
