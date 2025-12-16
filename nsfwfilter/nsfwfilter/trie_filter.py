# import json
# from .util import sha256

# class NSFWFilter:
#     def __init__(self, trie_path: str = "trie.json"):
#         with open(trie_path, "r", encoding="utf-8") as f:
#             self.data = json.load(f)
#         self.trie = self.data["trie"]
#         self.hashes = set(self.data.get("hashes", []))  # for fast lookup

#     def find_nsfw(self, text: str):
#         text = text.lower()
#         matches = []

#         for i in range(len(text)):
#             node = self.trie
#             j = i

#             while j < len(text):
#                 found = False
#                 for key, child in node.items():
#                     if text.startswith(key, j):
#                         j += len(key)
#                         if child["end"] and child["hash"] in self.hashes:
#                             matches.append(text[i:j])
#                         node = child["children"]
#                         found = True
#                         break
#                 if not found:
#                     break

#         return list(set(matches))

#     def is_nsfw(self, text: str) -> bool:
#         return bool(self.find_nsfw(text))
import json
from .util import sha256

class NSFWFilter:
    def __init__(self, trie_path: str = "trie.json"):
        with open(trie_path, "r") as f:
            data = json.load(f)

        self.trie = data["trie"]         # the compressed trie
        self.word_hashes = set(data["hashes"])  # hash list for verification

    def find_nsfw(self, text: str):
        text = text.lower()
        matches = []

        for i in range(len(text)):
            node = self.trie
            j = i

            while j < len(text):
                found = False

                # compressed key matching
                for key, child in node.items():
                    if text.startswith(key, j):
                        j += len(key)
                        possible = text[i:j]

                        # hash check
                        if child["end"]:
                            if sha256(possible) in self.word_hashes:
                                matches.append(possible)

                        node = child["children"]
                        found = True
                        break

                if not found:
                    break

        return list(set(matches))

    def is_nsfw(self, text: str) -> bool:
        return len(self.find_nsfw(text)) > 0
