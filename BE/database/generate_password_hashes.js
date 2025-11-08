import fs from 'fs'
import bcrypt from 'bcryptjs'

const DEFAULT_PASSWORD = '12345678'

const users = [
    { full_name: 'Nguyen Van A', username: 'nguyena', email: 'nguyena@example.com', phone: '0901000001', role: 'admin', password: DEFAULT_PASSWORD },
    { full_name: 'Tran Thi B', username: 'tranb', email: 'tranb@example.com', phone: '0901000002', role: 'member', password: DEFAULT_PASSWORD },
    { full_name: 'Le Van C', username: 'lec', email: 'lec@example.com', phone: '0901000003', role: 'member', password: DEFAULT_PASSWORD },
    { full_name: 'Pham Thi D', username: 'phamd', email: 'phamd@example.com', phone: '0901000004', role: 'member', password: DEFAULT_PASSWORD },
    { full_name: 'Do Van E', username: 'doe', email: 'doe@example.com', phone: '0901000005', role: 'member', password: DEFAULT_PASSWORD },
]

const SALT_ROUNDS = 10

async function generate() {
    try {
        const hashedUsers = []
        for (const u of users) {
            const pwd = u.password ?? DEFAULT_PASSWORD
            const hash = await bcrypt.hash(pwd, SALT_ROUNDS)
            hashedUsers.push({ ...u, password_hash: hash })
        }

        const valuesSql = hashedUsers
            .map(u => {
                const esc = s => (s === null || s === undefined ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`)
                return `(${esc(u.full_name)}, ${esc(u.username)}, ${esc(u.email)}, ${esc(u.phone)}, ${esc(u.role)}, ${esc(u.password_hash)})`
            })
            .join(',\n')

        const insertSql = `INSERT INTO users (full_name, username, email, phone, role, password_hash) VALUES\n${valuesSql};\n`

        console.log('--- Generated INSERT SQL ---\n')
        console.log(insertSql)

        fs.writeFileSync('insert_with_hashes.sql', insertSql, { encoding: 'utf8' })
        console.log('\nSaved SQL to insert_with_hashes.sql')
    } catch (err) {
        console.error('Error generating hashes:', err)
        process.exit(1)
    }
}

generate()