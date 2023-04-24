const convertSnakeToCamel = require('../utils/convertSnakeToCamel');

const createUser = async (
  client,
  userId,
  address,
  sportsNftCount,
  dumbellNftCount,
  sportsRole,
  dumbellRole,
) => {
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
      (user_id, address, sports_nft_count, sports_role, dumbell_nft_count, dumbell_role)
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, address, sports_nft_count, sports_role, dumbell_nft_count, dumbell_role
                `,
      [userId, address, sportsNftCount, sportsRole, dumbellNftCount, dumbellRole],
    );
    return convertSnakeToCamel.keysToCamel(rows);
  } else {
    console.log('updating user');
    const { rows } = await client.query(
      `
      UPDATE verify_user
      SET  address = $2, sports_nft_count = $3, sports_role = $4, dumbell_nft_count = $5, dumbell_role = $6
      WHERE user_id = $1
      RETURNING *
      `,
      [userId, address, sportsNftCount, sportsRole, dumbellNftCount, dumbellRole],
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
