import mysql from 'mysql2/promise';
import { badgeDefinitions } from './seed-badges.mjs';

async function seedBadges() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log(`Inserting ${badgeDefinitions.length} badge definitions...`);
  
  for (const badge of badgeDefinitions) {
    try {
      await conn.execute(
        `INSERT INTO badge_definitions (slug, name, name_en, description, description_en, ellie_message, ellie_message_en, category, icon, color, requirement, influxcoins_reward, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), ellie_message=VALUES(ellie_message)`,
        [
          badge.slug, badge.name, badge.nameEn,
          badge.description, badge.descriptionEn,
          badge.ellieMessage, badge.ellieMessageEn,
          badge.category, badge.icon, badge.color,
          badge.requirement, badge.influxcoinsReward, badge.sortOrder
        ]
      );
      console.log(`  ✅ ${badge.icon} ${badge.name} (${badge.nameEn})`);
    } catch (err) {
      console.error(`  ❌ Failed: ${badge.slug}`, err.message);
    }
  }
  
  const [count] = await conn.execute('SELECT COUNT(*) as total FROM badge_definitions');
  console.log(`\nTotal badges in DB: ${count[0].total}`);
  
  await conn.end();
}

seedBadges().catch(console.error);
