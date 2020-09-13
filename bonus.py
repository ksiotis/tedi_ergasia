import re
import numpy as np
import pandas as pd
import nltk
from nltk import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import LancasterStemmer, WordNetLemmatizer, PorterStemmer
from textblob import TextBlob
nltk.download('stopwords')

class MF():

    def __init__(self, X, K, learningRate):
        """
        Perform matrix factorization to predict empty
        entries in a matrix.

        Arguments
        - X (ndarray)   : user-item rating matrix
        - K (int)       : number of latent dimensions
        - learningRate (float) : learning rate
        - beta (float)  : regularization parameter
        """

        self.X = X
        self.num_users, self.num_items = X.shape
        self.K = K
        self.learningRate = learningRate

    def train(self):
        # Initialize user and item latent feature matrice
        self.V = np.random.rand(self.num_users, self.K)
        self.F = np.random.rand(self.num_items, self.K)

        # take given reviews and shuffle them for more objective results
        self.givenReviews = [
            (i, j, self.X[i, j])
            for i in range(self.num_users)
            for j in range(self.num_items)
            if self.X[i, j] > 0
        ]

        # Perform stochastic gradient descent for number of iterations
        temp_mse = 10000000000
        while (True):
            self.sgd()
            mse = self.mse()
            
            print(mse, temp_mse)
            if (mse > temp_mse):
                break

            temp_mse = mse
            tempV = self.V
            tempF = self.F

        self.V = tempV 
        self.F = tempF 

        return temp_mse

    def mse(self):
        """
        A function to compute the total mean square error
        """
        xs, ys = self.X.nonzero()
        predicted = self.full_matrix()
        error = 0
        for x, y in zip(xs, ys):
            error += pow(self.X[x, y] - predicted[x, y], 2)
        return np.sqrt(error)

    def sgd(self):
        """
        Perform stochastic graident descent
        """
        for i, j, X in self.givenReviews:
            # Compute prediction and error
            prediction = self.get_rating(i, j)
            e = (X - prediction)

            # Update user and item latent feature matrices
            self.V[i, :] += self.learningRate * 2 * e * self.F[j, :]
            self.F[j, :] += self.learningRate * 2 * e * self.V[i, :]

    def get_rating(self, i, j):
        """
        Get the predicted rating of user i and item j
        """
        prediction = self.V[i, :].dot(self.F[j, :].T)
        # self.b + self.b_u[i] + self.b_i[j] + 
        return prediction

    def full_matrix(self):
        """
        Computer the full matrix using the resultant biases, V and F
        """
        return self.V.dot(self.F.T)

# X = np.array([
#     [5, 3, 0, 1],
#     [4, 0, 0, 1],
#     [1, 1, 0, 5],
#     [1, 0, 0, 4],
#     [0, 1, 5, 4],
# ])

# for i in range(1,100):
#     print("\n\n\nFor i = ",i)
#     mf = MF(X, K=i, learningRate=0.01)
#     print(mf.train())

#read data and preproccess it
reviews = pd.read_csv('bonus dataset/reviews.csv')
reviews = reviews[['listing_id','reviewer_id','comments']]
reviews.drop_duplicates(subset=['listing_id', 'reviewer_id'], keep='first')
reviews['comments'] = reviews['comments'].astype(str) #make string

#get rid of punctuation and non english entries
reviews['comments'] = reviews['comments'].apply(lambda x: re.sub('[^A-Za-z0-9\s]','', x)) 
reviews['comments'] = reviews['comments'].apply(lambda x: re.sub('[\s]+$','', x)) 
reviews['comments'] = reviews['comments'].apply(lambda x: " ".join(x.lower() for x in x.split())) #make lowercase
reviews.replace('', np.nan, inplace=True)
reviews.dropna(subset=['comments'], inplace=True)
reviews.reset_index(drop=True, inplace=True)

#get rid of stopwords
stop = stopwords.words('english')
reviews['comments'] = reviews['comments'].apply(lambda x: " ".join(x for x in x.split() if x not in stop))

#calculate rating score from sentiment
def senti(x):
    return TextBlob(x).sentiment
reviews['score'] = reviews['comments'].apply(senti)
def roundme(x): #normalize scores to our rating scale
    x = x.polarity
    if x < -0.6:
        return 1
    elif x < -0.2:
        return 2
    elif x < 0.2:
        return 3
    elif x < 0.6:
        return 4
    else:
        return 5
reviews['score'] = reviews['score'].apply(roundme)



print(reviews)
