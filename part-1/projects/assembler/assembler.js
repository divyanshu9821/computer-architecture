import { preDefinedSymbol, destination, jump, computation } from './maps.js'

function clean(rawAssemblyCode) {
    return rawAssemblyCode
        .split('\n')
        .map(code => (code.split('/')[0]).trim())
        .filter(code => code != '')
}


function processSymbol(cleanAssemblyCodeInArray) {

    let symbolTable = { ...preDefinedSymbol }
    let lineNumber = 0
    let symbol = ''


    const assemblyCode = cleanAssemblyCodeInArray.filter(code => {
        if (code[0] == '(') {
            symbol = code.match(/\(([^)]+)\)/)[1]
            symbolTable[String(symbol)] = lineNumber
            return false
        } else {
            lineNumber++
        }
        return true
    })

    return { assemblyCode, symbolTable }
}


function translation({ symbolTable, assemblyCode }) {
    let varValue = 16
    const machineCode = assemblyCode.map(code => {
        if(code[0] == '@'){
            let ins = code.slice(1)
            let num = Number(ins)
            if(isNaN(num)){
                num = symbolTable[ins]
                if(num == undefined){
                    num = varValue
                    symbolTable[ins] = varValue++
                }
            }
            return (num.toString(2)).padStart(16, '0')
        }else{
            let groups = code.match(/(?:([^=;]+)=)?([^;]+)(?:;(.+))?/)
            const dest = destination[groups[1] || "null"]
            const comp = computation[groups[2]]
            const jmp = jump[groups[3] || "null"]
            
            return  `111${comp}${dest}${jmp}`
        }
    })

    return machineCode
}


export function translate(rawAssemblyCode) {
    const cleanAssemblyCodeInArray = clean(rawAssemblyCode)
    const { symbolTable, assemblyCode } = processSymbol(cleanAssemblyCodeInArray)
    const machineCode = translation({ symbolTable, assemblyCode })

    return machineCode.join('<br>')
}
