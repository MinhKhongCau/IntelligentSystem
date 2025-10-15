import untils

collection, _ = untils.load_chroma_database()

# Get total of data
total_count = collection.count()
print(f"Total of data (embeddings) in Collection: {total_count}")

# Get detail 5 structure data in db
stored_data = collection.get(
    limit=5,
    include=['metadatas', 'documents', 'embeddings']
)

ids_list = stored_data["ids"]
metadatas_list = stored_data["metadatas"]
documents_list = stored_data["documents"]

if len(stored_data) > 0:
    for idx, (id_, metadata, doc) in enumerate(zip(
        ids_list, 
        metadatas_list, 
        documents_list
    )):
        print(f"Result #{idx+1}:")
        # Distance 0 or approximately 0 proof that found itself
        print(f"ID: {id_}") 
        print(f"Document: {doc}")
        print(f"Metadata: {metadata}")