import math


def inner_prod(X, Y):
   sum_prod = 0
   for x_i, y_i in zip(X, Y):
       sum_prod += x_i * y_i
   return sum_prod


def magnitude(X):
   sum_squares = 0
   for x_i in X:
       sum_squares += x_i ** 2
   return math.sqrt(sum_squares)


def cosine_similarity(X, Y):
   return inner_prod(X, Y) / (magnitude(X) * magnitude(Y))

def search_by_cosine(X, vector_db):
    results = []
    for Y_i in vector_db:
        similarity = cosine_similarity(X, Y_i)
        results.append((Y_i, similarity))
    
    # Sort by similarity in descending order
    results.sort(key=lambda x: x[1], reverse=True)
    
    return results