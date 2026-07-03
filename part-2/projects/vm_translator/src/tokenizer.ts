function cleanLine(line: string) {
    [line = ""] = line.split('//')
    return line.trim()
}

function extractTokens(line: string): string[] {
    return line.split(/\s+/)
}


type tokRes = { status: boolean, tokens?: string[] }

export function tokenize(line: string): tokRes {
    line = cleanLine(line)

    if (line == "")
        return { status: false }

    const tokens = extractTokens(line)
    if (tokens.length <= 0)
        return { status: false }

    return { status: true, tokens }
}