function str2num(s, radix) {
    const n = parseInt(s, radix);
    return n;
}

function unsignedLength(n, radix = 10) {
    return Math.abs(n).toString(radix).length;
}

function longDivision(divisor, dividend, radix = 10) {
    divisor = str2num(divisor, radix);
    dividend = str2num(dividend);

    const result = [];
    const quotient = Math.floor(dividend / divisor);

    const quotientStr = quotient.toString();
    const dividendStr = dividend.toString();
    const divisorStr = divisor.toString();

    divisor = Math.abs(divisor);
    dividend = Math.abs(dividend);

    // 商の行
    const quotientIndent = ' '.repeat(divisorStr.length + 2);
    result.push(quotientIndent + quotientStr);

    // 除数/被除数の行
    result.push(divisorStr + '/' + dividendStr);

    // 筆算の各ステップ
    let remaining = dividend;
    let indent = ' '.repeat(divisorStr.length + 1);

    // 商の各桁について処理
    const quotientDigits = quotientStr.split('');

    // 符号を除いた桁数
    let nDigit = unsignedLength(quotient);
    // 途中の減算の係数
    let c = radix ** (nDigit - 1);
    //   console.log({n:Math.abs(quotient),nDigit, c});

    for (let i = 0; i < quotientDigits.length; i++) {
        const digit = parseInt(quotientDigits[i]);
        // console.log({digit});
        if (isNaN(digit)) { continue; }
        const subtrahend = Math.abs(digit * divisor);

        // 引く数を表示
        const v = indent + subtrahend;
        result.push(v);
        // console.log({digit,subtrahend,v,remaining,c});

        // 残りを計算
        remaining = remaining - (subtrahend * c);

        // 線を出力
        const len = Math.max(unsignedLength(v) + (c >= radix ? 1:0),unsignedLength(remaining));
        result.push(indent + '-'.repeat(len));

        // 残りを出力
        result.push(indent + ' ' + remaining);

        // 次のステップのためのインデント調整
        if (i < quotientDigits.length - 1) {
            indent += ' ';
        }
        c /= radix;
    }

    return result.join("\n");
}

// 使用例
//console.log('ld',longDivision(4, 256));