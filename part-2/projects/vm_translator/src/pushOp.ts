import { segments } from "./constants.js"
import { fileNameWithoutExt } from "./fileIO.js"

function forConstant(i: number): string {
    return ""
        + `@${i}\n`
        + "D=A\n"
}

function forReference(segment: string): string {
    return ""
        + `${segment}\n`
        + "A=D+M\n"
        + "D=M\n"
}

function forTemp(i: number): string {
    return ""
        + `@R${5 + i}\n`
        + "D=M\n"
}

function forPointer(i: number): string {
    let out = ""
    if (i == 0) {
        out = segments.this
    } else if (i == 1) {
        out = segments.that
    } else throw new Error()

    return ""
        + `${out}\n`
        + "D=M\n"
}

function forStatic(i: number): string {
    return ""
        + `@${fileNameWithoutExt()}.${i}\n`
        + "D=M\n"
}

export function finalStackPush(): string {
    return ""
        + `${segments.sp}\n`
        + "A=M\n"
        + "M=D\n"
        + `${segments.sp}\n`
        + "M=M+1\n"
}

export function push(segment: string, i: number): string {
    if (segment == 'constant')
        return ""
            + forConstant(i)
            + finalStackPush()
    else if (Object.keys(segments).includes(segment))
        return ""
            + forConstant(i)
            + forReference(segments[segment])
            + finalStackPush()
    else if (segment == 'temp')
        return ""
            + forTemp(i)
            + finalStackPush()

    else if (segment == 'pointer')
        return ""
            + forPointer(i)
            + finalStackPush()
    else if (segment == 'static')
        return ""
            + forStatic(i)
            + finalStackPush()
    else
        throw new Error()
}