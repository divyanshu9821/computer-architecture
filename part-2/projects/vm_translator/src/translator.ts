import { doubleOpcode, relOpcode, singleOpcode } from "./constants.js"
import { relationalOp, singleOperandALOp, twoOperandALOp } from "./ALROp.js"
import { push } from "./pushOp.js";
import { pop } from "./popOp.js";
import { goto, ifGoto, label, _function, _return, call } from "./branchOp.js";

const output = (tokens: string[], asm: string) => `// ${tokens.join(' ')} \n${asm} \n`

let counter = 0;

// Arithmetic Logical Relational Operation Translation
function ALROT(tokens: string[]): string {
    const opcode = tokens[0]
    if (!opcode) throw new Error()

    let asm = "";

    if (singleOpcode[opcode]) asm = singleOperandALOp(singleOpcode[opcode])
    else if (doubleOpcode[opcode]) asm = twoOperandALOp(doubleOpcode[opcode])
    else if (relOpcode[opcode]) asm = relationalOp(counter++, relOpcode[opcode])
    else throw new Error()

    return output(tokens, asm)
}

// stack operation Translation
function SOT(tokens: string[]): string {
    const opcode = tokens[0]
    const segment = tokens[1]
    const value = Number(tokens[2])

    if (
        opcode == undefined ||
        segment == undefined ||
        Number.isNaN(value)
    ) throw new Error()

    let asm = ""

    switch (opcode) {
        case 'pop': asm = pop(segment, value); break
        case 'push': asm = push(segment, value); break
        default: throw new Error()
    }

    return output(tokens, asm)
}

let currentFunctionName = ""
// branching command translation
function BCT(tokens: string[]): string {
    let asm = ""
    const name = currentFunctionName + '$' + String(tokens[1])

    switch (tokens[0]) {
        case 'label': asm = label(name); break
        case 'goto': asm = goto(name); break
        case 'if-goto': asm = ifGoto(name); break
        default: throw new Error()
    }

    return output(tokens, asm)
}

// function command translation
function FCT(tokens: string[]): string {
    const name = String(tokens[1]) ?? ""
    const nums = Number(tokens[2]) ?? 0
    let asm = ''
    switch (tokens[0]) {
        case 'function': currentFunctionName = name; asm = _function(name, nums); break
        case 'call': asm = call(name, nums); break
        case 'return': asm = _return(); break
        default: throw new Error()
    }
    return output(tokens, asm)
}

export function translate(tokens: string[]): string {

    if (tokens.length == 1) {

        if (tokens[0] == 'return')
            return FCT(tokens)
        else
            return ALROT(tokens)

    } else if (tokens.length == 2) {

        return BCT(tokens)

    } else if (tokens.length == 3) {

        if (tokens[0] == 'function' || tokens[0] == 'call')
            return FCT(tokens)
        else
            return SOT(tokens)

    } else {
        throw new Error()
    }
}