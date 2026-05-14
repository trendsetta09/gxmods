import chromadb
from chromadb.config import Settings
import hashlib

_client = None
_collection = None

COLLECTION_NAME = "omni_memory"


def _get_collection():
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(
            path="./chroma_db",
            settings=Settings(anonymized_telemetry=False),
        )
        _collection = _client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def store(text: str, metadata: dict | None = None) -> str:
    col = _get_collection()
    doc_id = hashlib.sha256(text.encode()).hexdigest()[:16]
    col.upsert(
        documents=[text],
        ids=[doc_id],
        metadatas=[metadata or {}],
    )
    return doc_id


def query(text: str, n_results: int = 5) -> list[str]:
    col = _get_collection()
    if col.count() == 0:
        return []
    results = col.query(query_texts=[text], n_results=min(n_results, col.count()))
    return results["documents"][0] if results["documents"] else []


def delete(doc_id: str) -> None:
    _get_collection().delete(ids=[doc_id])
