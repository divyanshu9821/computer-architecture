import { segments } from "./constants.js"
import { fileNameWithoutExt } from "./fileIO.js"

function forReference(i: number, segment: string): string {
    return ""
        + `@${i}\n`
        + "D=A\n"
        + `${segment}\n`
        + "D=D+M\n"
        + "@R13\n"
        + "M=D\n"
        + `${segments.sp}\n`
        + "AM=M-1\n"
        + "D=M\n"
        + "@R13\n"
        + "A=M\n"
        + "M=D\n"
}

function forTemp(i: number): string {
    return ""
        + `${segments.sp}\n`
        + "AM=M-1\n"
        + "D=M\n"
        + `@R${5 + i}\n`
        + "M=D\n"
}

function forStatic(i: number): string {
    return ""
        + `${segments.sp}\n`
        + "AM=M-1\n"
        + "D=M\n"
        + `@${fileNameWithoutExt()}.${i}\n`
        + "M=D\n"
}

function forPointer(i: number): string {
    let out = ""
    if (i == 0) {
        out = segments.this
    } else if (i == 1) {
        out = segments.that
    } else throw new Error()

    return ""
        + `${segments.sp}\n`
        + "AM=M-1\n"
        + "D=M\n"
        + `${out}\n`
        + "M=D\n"
}

export function pop(segment: string, i: number): string {
    if (Object.keys(segments).includes(segment)) {
        return forReference(i, segments[segment])
    } else if (segment == 'temp')
        return forTemp(i)
    else if (segment == 'pointer')
        return forPointer(i)
    else if (segment == 'static')
        return forStatic(i)
    else
        throw new Error()
}