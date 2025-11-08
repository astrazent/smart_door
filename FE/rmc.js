// remove_comments.js
import fs from 'fs'
import path from 'path'

// Thư mục chứa code cần remove comment
const TARGET_DIR = './src' // thay đổi theo dự án của bạn

// Hàm đọc tất cả file trong thư mục (recursive)
function getAllFiles(dir, ext = ['.js', '.ts']) {
    let results = []
    const list = fs.readdirSync(dir)
    list.forEach((file) => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath, ext))
        } else if (ext.includes(path.extname(file))) {
            results.push(filePath)
        }
    })
    return results
}

// Hàm xóa comment trong 1 file
function removeCommentsFromFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8')

    // Xóa comment /* ... */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '')

    // Xóa comment // ...
    content = content.replace(/\/\/.*$/gm, '')

    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Removed comments: ${filePath}`)
}

// Chạy
const files = getAllFiles(TARGET_DIR)
files.forEach(removeCommentsFromFile)

console.log('Done removing comments!')