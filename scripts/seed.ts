import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash passwords
    const password1 = await bcrypt.hash('greenEarth123', 10);
    const password2 = await bcrypt.hash('natureLove456', 10);

    // Create first user
    const user1 = await prisma.user.upsert({
      where: { email: 'naturelover1@example.com' },
      update: {},
      create: {
        email: 'naturelover1@example.com',
        password: password1,
        name: 'Lily Green',
      },
    });

    // Create second user
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

    // Nature-themed blog posts (Short Titles + Rich Content)
    const postData = [
      { 
        title: 'The Amazon Rainforest', 
        content: 'Covering 5.5 million square kilometers, the Amazon is the largest rainforest on Earth. It houses nearly 10% of the world’s species, making it one of the most biodiverse places. Deforestation threatens its delicate balance, but conservation efforts aim to protect this vital ecosystem for future generations.'
      },
      { 
        title: 'Majestic Waterfalls', 
        content: 'From the thunderous Niagara Falls to the breathtaking Iguazu Falls, waterfalls are nature’s way of showcasing raw power and beauty. These cascading waters provide not only a stunning view but also support wildlife and generate hydroelectric energy in many regions.'
      },
      { 
        title: 'How Trees Communicate', 
        content: 'Deep beneath the forest floor, trees exchange nutrients and send distress signals through mycorrhizal fungi, forming a "wood wide web." Scientists have discovered that trees cooperate rather than compete, ensuring the survival of the entire forest ecosystem.'
      },
      { 
        title: 'Best National Parks', 
        content: 'National parks preserve Earth’s natural wonders, offering sanctuaries for wildlife and breathtaking landscapes. Yellowstone’s geysers, Yosemite’s granite cliffs, and the Serengeti’s great migration are just a few marvels awaiting visitors seeking adventure and serenity in the wild.'
      },
      { 
        title: 'Sunrise and Sunset', 
        content: 'The golden hues of dawn and dusk result from light scattering in the atmosphere. Sunrises symbolize new beginnings, while sunsets offer a moment of reflection. Some of the world’s best sunset spots include Santorini, the Grand Canyon, and Bali’s Uluwatu Temple.'
      },
      { 
        title: 'The Ocean’s Depths', 
        content: 'Covering 70% of our planet, the ocean remains largely unexplored. The Mariana Trench, the deepest point on Earth, harbors creatures adapted to extreme conditions. Coral reefs, often called the "rainforests of the sea," support vast marine biodiversity but face threats from climate change.'
      },
      { 
        title: 'Wildlife Photography Tips', 
        content: 'Capturing wildlife requires patience, the right equipment, and a deep respect for nature. Golden hour lighting enhances shots, while silent observation allows photographers to document authentic animal behavior. Ethical photography prioritizes the well-being of creatures over the perfect shot.'
      },
      { 
        title: 'The Arctic’s Survival', 
        content: 'Despite extreme cold, Arctic wildlife thrives through remarkable adaptations. Polar bears rely on sea ice for hunting, while Arctic foxes change coat color with the seasons. Climate change is rapidly altering this fragile ecosystem, affecting both wildlife and indigenous communities.'
      },
      { 
        title: 'Fireflies at Night', 
        content: 'Fireflies glow through bioluminescence, a chemical reaction that produces cold light. These "living lanterns" use their flashes to attract mates and warn predators. However, habitat loss and light pollution are causing firefly populations to decline worldwide.'
      },
      { 
        title: 'Off-Grid Living', 
        content: 'Living off-grid means disconnecting from conventional utilities and relying on renewable resources. Solar panels, rainwater harvesting, and permaculture gardens allow people to live sustainably. This lifestyle fosters self-sufficiency, reduces carbon footprints, and deepens one’s connection to nature.'
      },
      { 
        title: 'The Serengeti Migration', 
        content: 'Each year, millions of wildebeest, zebras, and gazelles embark on an 800-km journey across the Serengeti. This great migration, driven by rainfall and the search for fresh grass, is one of nature’s most breathtaking spectacles, sustaining countless predators along the way.'
      },
      { 
        title: 'Healing Forest Walks', 
        content: 'Forest bathing, or "Shinrin-yoku," is a Japanese practice that reduces stress and improves well-being. Studies show that immersing oneself in nature lowers cortisol levels, boosts immune function, and enhances overall mental clarity. A simple walk among trees can work wonders for the soul.'
      },
      { 
        title: 'Mountain Ecosystems', 
        content: 'Mountains provide fresh water for over half of humanity and host unique biodiversity. Alpine plants and animals, such as snow leopards and ibex, have adapted to harsh conditions. However, rising temperatures threaten these fragile ecosystems, making conservation efforts more crucial than ever.'
      },
      { 
        title: 'Eco-Friendly Travel', 
        content: 'Sustainable tourism reduces environmental impact while supporting local communities. Choosing eco-lodges, minimizing plastic use, and respecting wildlife are key practices. Destinations like Costa Rica, Bhutan, and Norway lead in eco-conscious travel experiences.'
      },
      { 
        title: 'Secrets of Bioluminescence', 
        content: 'From glowing plankton in tropical waters to the eerie deep-sea anglerfish, bioluminescence is nature’s own light show. This phenomenon serves as camouflage, attraction, or defense in various creatures, illuminating the mysteries of the natural world.'
      }
    ];

    // Generate posts for each user
    for (const user of [user1, user2]) {
      const posts = postData.map((post, index) => ({
        title: post.title,
        content: post.content,
        imageUrl: `https://source.unsplash.com/600x400/?nature,forest,mountain,waterfall&random=${index + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: user.id,
      }));

      await prisma.post.createMany({ data: posts });

      console.log(`Created ${postData.length} posts for ${user.name}`);
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
