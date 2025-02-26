class User {
    constructor(id, name, email, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role; // 'student' or 'faculty'
    }

    static async createUser(db, userData) {
        const { name, email, role } = userData;
        const query = 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [name, email, role]);
        return new User(result.insertId, name, email, role);
    }

    static async findById(db, id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows.length ? new User(rows[0].id, rows[0].name, rows[0].email, rows[0].role) : null;
    }

    static async findByEmail(db, email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows.length ? new User(rows[0].id, rows[0].name, rows[0].email, rows[0].role) : null;
    }

    static async updateUser(db, id, userData) {
        const { name, email, role } = userData;
        const query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
        await db.execute(query, [name, email, role, id]);
        return this.findById(db, id);
    }

    static async deleteUser(db, id) {
        const query = 'DELETE FROM users WHERE id = ?';
        await db.execute(query, [id]);
    }
}

export default User;