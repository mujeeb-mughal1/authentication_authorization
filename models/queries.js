const db = require('./pool')

async function createUser({ firstName, lastName, username, hashedPassword, isAdmin=false }) {
    const {rows} = await db.query(`INSERT INTO users(first_name, last_name, username, password, is_admin) 
        VALUES($1,$2,$3,$4,$5) RETURNING id, first_name, last_name, username, is_member, is_admin`,
    [firstName, lastName, username, hashedPassword, isAdmin]);

    return rows[0] || null;
}

async function findUserByUsername(username) {
    const {rows} = await db.query(`SELECT id, first_name, last_name, username, password, is_member, is_admin
        FROM users WHERE username = $1`, [username]);

    return rows[0] || null;   
    
}
async function findUserById(id) {
    const {rows} = await db.query(`SELECT id, first_name, last_name, username, is_member, is_admin
        FROM users WHERE id = $1`, [id]);

    return rows[0] || null;   
    
}

async function grantAdmin(userId) {
  const { rows } = await db.query(
    `UPDATE users SET is_admin = TRUE WHERE id = $1
     RETURNING id, username, is_member, is_admin`,
    [userId]
  );
  return rows[0] || null;
}

async function grantMembership(userId) {
  const { rows } = await db.query(
    `UPDATE users SET is_member = TRUE WHERE id = $1
     RETURNING id, username, is_member, is_admin`,
    [userId]
  );
  return rows[0] || null;
}

async function getAllMessages(){
    const {rows} = await db.query(`SELECT m.id, m.title, m.text, m.created_at, u.first_name, u.last_name, u.username
                             FROM messages AS m
                             JOIN users AS u ON u.id = m.user_id 
                             ORDER BY m.created_at DESC `);  
    return rows;
}

async function deleteMessageById(messageId){
    await db.query(`DELETE FROM messages WHERE id =$1`,[messageId]); 
}

async function createMessage({ title, text, userId }){
    await db.query(`INSERT INTO messages(title,text,user_id) 
        VALUES($1,$2,$3) RETURNING title, text, user_id`,
    [title, text, userId]);
}


module.exports ={
   createUser,
   findUserByUsername,
   findUserById,
   grantMembership,
   grantAdmin,
   getAllMessages,
   deleteMessageById,
   createMessage
}