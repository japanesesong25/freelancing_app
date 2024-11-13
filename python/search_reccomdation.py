#open http server

from sentence_transformers import SentenceTransformer, util

# Load a pre-trained model for semantic similarity
model = SentenceTransformer('all-MiniLM-L6-v2')

def semantic_search(history, query, top_k=3):
    """
    Performs a semantic search on history entries.

    Parameters:
    history (list): List of history entries as strings.
    query (str): The search query string.
    top_k (int): Number of top results to return.

    Returns:
    list: Top history entries that are most semantically similar to the query.
    """
    # Encode history entries and the query
    history_embeddings = model.encode(history, convert_to_tensor=True)
    query_embedding = model.encode(query, convert_to_tensor=True)
    
    # Compute cosine similarities between the query and each history entry
    cos_scores = util.cos_sim(query_embedding, history_embeddings)[0]
    
    # Retrieve the top_k results
    top_results = torch.topk(cos_scores, k=top_k)
    
    # Return the top history entries
    return [history[i] for i in top_results.indices]

# Example usage:
history = [
    "Learned about project management techniques",
    "Explored Python programming basics",
    "Discussed machine learning applications",
    "Learned about Scrum and Agile methodologies"
]

# Perform a semantic search
query = "project management"
search_results = semantic_search(history, query)
print(search_results)
