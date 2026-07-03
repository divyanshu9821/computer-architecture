import fs from 'fs'
import path from 'path'

const consoleParam = process.argv[2] ?? ""
if (!consoleParam) throw new Error('file or folder not provided in params')

let inputFile = ""

const parsePath = path.parse(consoleParam)

let outputFile: string;

let isDir = false

export function getFiles() {
    let fileNames: string[] = []
    try {
        fileNames = fs.readdirSync(consoleParam).filter(f => f.endsWith('.vm'))
        outputFile = path.join(parsePath.dir, parsePath.name, `${parsePath.name}.asm`);
        isDir = true;
    } catch (e) {
        fileNames.push(parsePath.base)
        outputFile = path.join(parsePath.dir, `${parsePath.name}.asm`);
    }
    return fileNames;
}

export function setFileName(fileName: string): void {
    if (!fileName) throw new Error('Input file is missing')
    if (isDir) {
        inputFile = path.join(consoleParam, fileName);
    } else {
        inputFile = consoleParam;
    }
}

export function fileNameWithoutExt() {
    return path.parse(inputFile).name
}

export function readInputFile(): string[] {
    const content = fs.readFileSync(inputFile, 'utf8')
    return content.split('\n')
}

export function initOutputFile(): void {
    fs.writeFileSync(outputFile, "")
}

export function appendOutputFile(string: string): void {
    fs.appendFileSync(outputFile, string)
}