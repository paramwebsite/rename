const axios = require("axios");

const wikiAxios = axios.create({
  headers: {
    "User-Agent": "RenameGalleryTrendApp/1.0 (digital@paraminnovation.org)"
  }
});

async function getWikiImage(personName) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(personName)}`;

    const response = await wikiAxios.get(url);

    return {
      imageUrl: response.data.thumbnail?.source || null,
      description: response.data.description || "",
      extract: response.data.extract || ""
    };

  } catch (err) {
    console.error("Wiki Image Error:", err.message);
    return null;
  }
}

module.exports = { getWikiImage };
