def create_chunks(text, chunk_size=400, overlap=80):
    """
    Word-based chunking with overlap.
    """
    words = text.split()
    chunks = []

    start = 0
    total_words = len(words)

    while start < total_words:
        end = min(start + chunk_size, total_words)
        chunk_words = words[start:end]
        chunk_text = " ".join(chunk_words)
        chunks.append(chunk_text)

        start += chunk_size - overlap

    return chunks
