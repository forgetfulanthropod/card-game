const fs = require('fs')
const path = require('path')

exports.copyFolderRecursiveSync = function copyFolderRecursiveSync(source, target, makeSubdir = true) {
    let files = []

    // Check if folder needs to be created or integrated
    const targetFolder = makeSubdir ? path.join(target, path.basename(source)) : target
    // const targetFolder = path.join(target, path.basename(source))
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder)
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source)
        files.forEach(function (file) {
            const curSource = path.join(source, file)
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder)
            } else {
                copyFileSync(curSource, targetFolder)
            }
        })
    }
}

function copyFileSync(source, target) {
    let targetFile = target

    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source))
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source))
}
