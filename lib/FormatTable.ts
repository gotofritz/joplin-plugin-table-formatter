const MIN_COLUMN_WIDTH = 3;

function padCell(value: string, width: number, fillChar: string): string {
    if (width > value.length) {
        return (fillChar + value).padEnd(width, fillChar);
    } else {
        return value;
    }
}

export default function formatTable(startLine: number, numLines: number, getLine: (number) => string): string {
    const table = [];
    const columnWidths = [];

    for (let i = 0; i < numLines; i++) {
        const line: string = getLine(startLine + i).trim();
        let prev = 0;
        let cols = [];
        for (let j = 0; j < line.length; j++) {
            if (line.charAt(j) === '|' && (j == 0 || line.charAt(j - 1) !== '\\')) {
                cols.push(line.substring(prev, j));
                prev = j + 1;
            }
            if (j === line.length - 1) {
                cols.push(line.slice(prev, j));
            }
        }
        
        cols = cols.slice(1, cols.length - 1);
        table.push(cols.map(c => c.trim()));
        const extraPad = (i == 1) ? 0 : 2;
        for (let j = 0; j < cols.length; j++) {
            if (j >= columnWidths.length) {
                columnWidths.push(Math.max(MIN_COLUMN_WIDTH, extraPad + cols[j].trim().length));
            } else {
                columnWidths[j] = Math.max(MIN_COLUMN_WIDTH, columnWidths[j], extraPad + cols[j].trim().length);
            }
        }
    }

    for (let row = 0; row < table.length; row++) {
        for (let col = 0; col < columnWidths.length; col++) {
            const fillChar = row === 1 ? '-' : ' ';
            if (col >= table[row].length) {
                table[row].push(fillChar.repeat(columnWidths[col]))
            } else {
                table[row][col] = padCell(table[row][col], columnWidths[col], fillChar);
            }
        }
    }

    let lines = [];
    for (let i = 0; i < table.length; i++) {
        lines.push('|' + table[i].join('|') + '|');
    }

    return lines.join('\n');
}