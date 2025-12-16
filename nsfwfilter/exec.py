from nsfwfilter.builder import build_trie
import os
import nsfwfilter

# Path to wordlist.json inside data/
wordlist_path = os.path.join(os.path.dirname(nsfwfilter.__file__), "data", "wordlist.json")

# Output path for trie.json in nsfwfilter/
output_path = os.path.join(os.path.dirname(nsfwfilter.__file__), "trie.json")

build_trie(wordlist_path, output_path)
print("Trie built at:", output_path)