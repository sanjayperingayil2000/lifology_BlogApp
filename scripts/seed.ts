import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // ✅ Hash passwords
    const password1 = await bcrypt.hash('greenEarth123', 10);
    const password2 = await bcrypt.hash('natureLove456', 10);

    // ✅ Create first user
    const user1 = await prisma.user.upsert({
      where: { email: 'naturelover1@example.com' },
      update: {},
      create: {
        email: 'naturelover1@example.com',
        password: password1,
        name: 'Lily Green',
      },
    });

    // ✅ Create second user
    const user2 = await prisma.user.upsert({
      where: { email: 'natureexplorer@example.com' },
      update: {},
      create: {
        email: 'natureexplorer@example.com',
        password: password2,
        name: 'Noah Evergreen',
      },
    });

    console.log('Users created:', user1, user2);

    // ✅ Nature-Themed Blog Posts
    const postData = [
      { 
        title: 'Amazon Rainforest Wonders', 
        content: 'The Amazon Rainforest, spanning over 5.5 million square kilometers, is home to nearly 10% of all species on Earth. Its dense vegetation and rich biodiversity make it one of the most important ecosystems on the planet. Conservation efforts are crucial to protect its wildlife and indigenous communities.'
      },
      { 
        title: 'Mystical Mountain Peaks', 
        content: 'Towering mountains have long fascinated adventurers and nature lovers alike. The Himalayas, the Alps, and the Andes are some of the most breathtaking mountain ranges, offering not just scenic beauty but also shelter to unique flora and fauna.'
      },
      { 
        title: 'Serenity of Ocean Waves', 
        content: 'The rhythmic crashing of ocean waves has a soothing effect on the human mind. From the Pacific to the Atlantic, our oceans cover 70% of the Earth and sustain millions of marine species. Coral reefs, often called the "rainforests of the sea," are particularly vulnerable to climate change.'
      },
      { 
        title: 'Secrets of Ancient Forests', 
        content: 'Forests have existed for millions of years, shaping the planet’s climate and biodiversity. The towering trees of the Redwoods, the mystical Black Forest in Germany, and the dense jungles of Borneo are a few examples of these timeless wonders.'
      },
      { 
        title: 'Golden Fields of Wheat', 
        content: 'Expansive wheat fields stretch across landscapes, swaying gently with the wind. These golden fields not only provide food for millions but also create stunning scenery, especially during sunrise and sunset, when the light enhances their golden hue.'
      },
      { 
        title: 'Wonders of the Arctic', 
        content: 'Despite its freezing temperatures, the Arctic is home to incredible wildlife like polar bears, arctic foxes, and seals. However, melting ice due to global warming threatens this delicate ecosystem, impacting both animals and indigenous communities.'
      },
      { 
        title: 'Enchanting Waterfalls', 
        content: 'The sheer power of waterfalls has inspired awe for centuries. From the mighty Niagara Falls to the ethereal Angel Falls, these natural spectacles serve as both a source of energy and a haven for biodiversity.'
      },
      { 
        title: 'Sunset Over Vast Deserts', 
        content: 'The Sahara, Gobi, and Atacama deserts may seem lifeless, but they are teeming with life adapted to extreme conditions. Sunsets over these vast landscapes paint the sky with breathtaking hues of orange, pink, and purple.'
      },
      { 
        title: 'The Night Sky’s Beauty', 
        content: 'Away from city lights, the night sky reveals a dazzling display of stars, planets, and even the Milky Way. Stargazing in remote locations like the Atacama Desert or the Himalayas offers an unforgettable experience.'
      },
      { 
        title: 'Life in a Hidden Valley', 
        content: 'Deep valleys, hidden between towering mountains, often contain untouched nature. These valleys are rich in biodiversity and provide a refuge for rare species, from snow leopards to exotic plant life found nowhere else.'
      },
      { 
        title: 'The Magic of Fireflies', 
        content: 'Fireflies, or lightning bugs, light up summer nights with their bioluminescent glow. This magical phenomenon is used for communication and mating. Unfortunately, habitat destruction and light pollution threaten these beautiful creatures.'
      },
      { 
        title: 'Healing Forest Therapy', 
        content: 'Forest therapy, known as "Shinrin-yoku" in Japan, has been scientifically proven to reduce stress and improve well-being. Walking among trees helps lower blood pressure, enhance mood, and boost the immune system.'
      },
      { 
        title: 'The Grand Canyon’s Majesty', 
        content: 'Carved by the Colorado River over millions of years, the Grand Canyon stands as a testament to nature’s artistic power. Its immense size and vibrant rock layers tell the story of Earth’s geological past.'
      },
      { 
        title: 'Secrets of Tropical Rainforests', 
        content: 'Tropical rainforests, like the Amazon and Congo Basin, play a critical role in regulating the Earth’s climate. They absorb carbon dioxide, produce oxygen, and provide shelter to countless species, many of which are yet to be discovered.'
      },
      { 
        title: 'Peaceful Life by the River', 
        content: 'Rivers have shaped civilizations for thousands of years. From the Nile to the Amazon, these water bodies support diverse ecosystems, nourish farmland, and offer breathtaking landscapes perfect for relaxation and reflection.'
      }
    ];

    // ✅ Generate Posts for Each User
    for (const user of [user1, user2]) {
      const posts = postData.map((post, index) => ({
        title: post.title,
        content: post.content,
        imageUrl: `https://picsum.photos/600/400?random=${index + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: user.id,
      }));

      await prisma.post.createMany({ data: posts });

      console.log(`Created ${postData.length} posts for ${user.name}`);
    }

    console.log('✅ Seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
