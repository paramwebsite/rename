import json
import os
from .util import sha256


class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


def insert_word(root, word):
    node = root
    for c in word:
        node = node.children.setdefault(c, TrieNode())
    node.is_end = True


def compress_trie(node):
    """
    Collapses single-child paths into a single compressed key.
    """
    for key, child in list(node.children.items()):
        current_key = key
        current_node = child

        # while child has only one child & is NOT end-of-word
        while not current_node.is_end and len(current_node.children) == 1:
            next_char, next_node = next(iter(current_node.children.items()))
            merged_key = current_key + next_char

            # replace old key with merged compressed key
            node.children.pop(current_key)
            node.children[merged_key] = next_node

            current_key = merged_key
            current_node = next_node

        # recursively compress subtree
        compress_trie(current_node)


def trie_to_dict(node):
    """
    Converts TrieNode → pure dictionary for JSON storage.
    """
    result = {}
    for key, child in node.children.items():
        result[key] = {
            "end": child.is_end,
            "children": trie_to_dict(child)
        }
    return result


def collect_hashes(trie_dict, path="", out=None):
    """
    Collects SHA-256 hashes of every terminal word.
    """
    if out is None:
        out = set()

    for key, node in trie_dict.items():
        new_path = path + key
        if node["end"]:
            out.add(sha256(new_path))
        collect_hashes(node["children"], new_path, out)

    return out


def build_trie(wordlist_path: str, output_path: str = None):
    """
    Builds:
        - compressed trie
        - word-hash list
        - outputs trie.json
    """

    if output_path is None:
        # store inside package directory
        base = os.path.dirname(__file__)
        output_path = os.path.join(base, "trie.json")

    # load json wordlist
    with open(wordlist_path, "r", encoding="utf-8") as f:
        words = json.load(f)

    root = TrieNode()

    # insert words in trie
    for lang, items in words.items():
        for w in items:
            insert_word(root, w.strip().lower())

    # compress
    compress_trie(root)

    # convert to dict
    trie_dict = trie_to_dict(root)

    # collect all end-word hashes
    all_hashes = list(collect_hashes(trie_dict))

    # final JSON output structure
    out = {
        "trie": trie_dict,
        "hashes": all_hashes
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)

    return output_path
