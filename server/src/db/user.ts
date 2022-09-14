const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const createUser = async (client, userId, address, count, role) => {
  const { rows: existingRows } = await client.query(
    `
          SELECT *
          FROM verify_user vu
          WHERE vu.user_id = $1
              AND vu.is_deleted= FALSE
          `,
    [userId],
  );

  if (existingRows.length === 0) {
    console.log('add new user');
    const { rows } = await client.query(
      `
      INSERT INTO verify_user
      (user_id, address, count, role)
      VALUES
      ($1, $2, $3, $4)
      RETURNING user_id, address, count, role
                `,
      [userId, address, count, role],
    );
    return convertSnakeToCamel.keysToCamel(rows);
  } else {
    console.log('updating user');
    const { rows } = await client.query(
      `
      UPDATE verify_user
      SET  address = $2, count = $3, role = $4
      WHERE user_id = $1
      RETURNING *
      `,
      [userId, address, count, role],
    );
    return convertSnakeToCamel.keysToCamel(rows);
  }
};

const getAllUser = async (client) => {
  const { rows } = await client.query(
    `
          SELECT *
          FROM verify_user vu
          WHERE vu.is_deleted= FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = {
  createUser,
  getAllUser,
};
