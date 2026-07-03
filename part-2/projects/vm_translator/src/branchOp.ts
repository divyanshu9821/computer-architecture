import { finalStackPush } from "./pushOp.js"
import { segments } from "./constants.js"

export function goto(name: string) {
    return ""
        + `@${name}\n`
        + "0;JMP\n"
}

export function ifGoto(name: string) {
    return ""
        + `${segments.sp}\n`
        + "AM=M-1\n"
        + "D=M\n"
        + `@${name}\n`
        + "D;JNE\n"
}

export function label(name: string) {
    return `(${name})\n`
}







let count = 0;
export function call(funcName: string, nArgs: number) {
    count++;
    const returnPlaceHolder = `${funcName}$ret.${count}`
    return ""

        // push return address
        + `@${returnPlaceHolder}\n`
        + "D=A\n"
        + finalStackPush()

        // push LCL
        + `${segments.local}\n`
        + "D=M\n"
        + finalStackPush()

        // push ARG
        + `${segments.argument}\n`
        + "D=M\n"
        + finalStackPush()

        // push THIS
        + `${segments.this}\n`
        + "D=M\n"
        + finalStackPush()

        // push THAT
        + `${segments.that}\n`
        + "D=M\n"
        + finalStackPush()

        // set ARG
        + `${segments.sp}\n`
        + "D=M\n"
        + `@${5 + nArgs}\n`
        + "D=D-A\n"
        + `${segments.argument}\n`
        + "M=D\n"

        // set LCL
        + `${segments.sp}\n`
        + "D=M\n"
        + `${segments.local}\n`
        + "M=D\n"

        // jump to function
        + `@${funcName}\n`
        + "0;JMP\n"
        
        + `(${returnPlaceHolder})\n`
}

export function _function(funcName: string, nVars: number) {
    let asm = ""
        + `(${funcName})\n`

    if (nVars != 0) {
        asm += ""
            + "@0\n"
            + "D=A\n"
            + finalStackPush().repeat(nVars)
    }

    return asm;
}

export function _return() {
    return ""
        // 1. FRAME = LCL (Store original LCL in temporary register R14)
        + `${segments.local}\n`
        + "D=M\n"
        + "@R14\n"
        + "M=D\n"

        // 2. RET = *(FRAME - 5) (Store target return address value in R15)
        + "@5\n"
        + "A=D-A\n" // A = FRAME - 5
        + "D=M\n"   // D = return address value
        + "@R15\n"
        + "M=D\n"

        // 3. *ARG = pop() (Reposition return value for the caller)
        + `${segments.sp}\n`
        + "AM=M-1\n"
        + "D=M\n"
        + `${segments.argument}\n`
        + "A=M\n"
        + "M=D\n"

        // 4. SP = ARG + 1 (Restore caller's Stack Pointer)
        + `${segments.argument}\n`
        + "D=M+1\n"
        + `${segments.sp}\n`
        + "M=D\n"

        // 5. Restore caller segments relative to our fixed R14 (FRAME)
        // THAT = *(FRAME - 1)
        + "@R14\n" 
        + "A=M-1\n" 
        + "D=M\n" 
        + `${segments.that}\n` 
        + "M=D\n"
        
        // THIS = *(FRAME - 2)
        + "@2\n" 
        + "D=A\n" 
        + "@R14\n" 
        + "A=M-D\n" 
        + "D=M\n" 
        + `${segments.this}\n` 
        + "M=D\n"
        
        // ARG = *(FRAME - 3)
        + "@3\n" 
        + "D=A\n" 
        + "@R14\n" 
        + "A=M-D\n" 
        + "D=M\n" 
        + `${segments.argument}\n` 
        + "M=D\n"
        
        // LCL = *(FRAME - 4)
        + "@4\n" 
        + "D=A\n" 
        + "@R14\n" 
        + "A=M-D\n" 
        + "D=M\n" 
        + `${segments.local}\n` 
        + "M=D\n"

        // 6. JUMP to the return address value stored in R15
        + "@R15\n"
        + "A=M\n"   // A now holds the exact code line address 
        + "0;JMP\n"
}

export function bootStrap() {
    return "// bootstrap\n"
        + "@256\n"
        + "D=A\n"
        + `${segments.sp}\n`
        + "M=D\n"
        + call("Sys.init", 0)
        + "\n"
}
