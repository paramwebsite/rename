// const express = require('express');
// const router = express.Router();

// const { getTrends } = require('../services/trendsService');
// const { getVariants } = require('../services/variantService');
// const { getFamousPerson } = require('../services/wikiService');

// router.get('/:name', async (req, res) => {
//   try {
//     const name = req.params.name;

//     // const trends = await getTrends(name);
//     // const variants = await getVariants(name);
//     const famous = await getFamousPerson(name);

//     res.json({
//     //   trends,
//     //   variants,
//       famous
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();

const { getTrends } = require('../services/trendsService');
const { getNameIntelligence } = require('../services/openaiService');
const { getWikiImage } = require('../services/wikiImageService');

router.get('/:name', async (req, res) => {
  try {
    const name = req.params.name;

    // Run trends + OpenAI in parallel
    const [trends, aiData] = await Promise.all([
      getTrends(name),
      getNameIntelligence(name)
    ]);

    // Get wiki image for selected famous person
    const wikiData = await getWikiImage(aiData.famousCandidate.name);

    res.json({
      trends,
      variants: aiData.variants,
      famousPerson: {
        ...aiData.famousCandidate,
        imageUrl: wikiData?.imageUrl || null
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
