import re
import numpy as np
import pandas as pd
import nltk
import json
import sys
import shutil
from json import JSONEncoder
from nltk import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import LancasterStemmer, WordNetLemmatizer, PorterStemmer
from textblob import TextBlob
nltk.download('stopwords')

class MF():

    def __init__(self, Q, K, learningRate):

 
        # X: user-item rating matrix
        # K: number of latent dimensions
        # learningRate: learning rate

        self.X = Q[1:, 1:]
        self.num_users, self.num_items = self.X.shape
        # print(self.X.shape )
        self.K = K
        self.learningRate = learningRate

    def train(self):
        # Initialize user and item latent feature matrice
        self.V = np.random.uniform(low=-1.0, high=1.0, size=(self.num_users, self.K))
        self.F = np.random.uniform(low=-1.0, high=1.0, size=(self.num_items, self.K))

        # take given reviews and shuffle them for more objective results
        self.givenReviews = [
            (i, j, self.X[i, j])
            for i in range(self.num_users)
            for j in range(self.num_items)
            if self.X[i, j] > 0.1
        ]

        # Perform stochastic gradient descent for number of iterations
        temp_mean_error = float('inf')
        while (True):
            self.gradient_descent()
            mean_error = self.mean_error()
            
            # print(mean_error)
            if (mean_error > temp_mean_error or mean_error < 1):
                break

            temp_mean_error = mean_error
            tempV = self.V
            tempF = self.F

        self.V = tempV 
        self.F = tempF 

        return self.full_matrix()

    def mean_error(self):
        # total mean square error

        xs, ys = self.X.nonzero()
        predicted = self.full_matrix()
        error = 0
        for x, y in zip(xs, ys):
            error += pow(self.X[x, y] - predicted[x, y], 2)
        return error

    def gradient_descent(self):
        for i, j, X in self.givenReviews:
            # Compute prediction and error
            prediction = self.get_rating(i, j)
            e = (X - prediction)

            # Update user and item latent feature matrices
            self.V[i, :] += self.learningRate * 2 * e * self.F[j, :]
            self.F[j, :] += self.learningRate * 2 * e * self.V[i, :]

    def get_rating(self, i, j):
        
        # predict rating for user i and accommodation j
        
        prediction = self.V[i, :].dot(self.F[j, :].T)
        return prediction

    def full_matrix(self):
        # full matrix from V & F
        scores = self.V.dot(self.F.T)
        return scores

#~~~~~~~~~~~~~~~~~preproccessing dataset ~~~~~~~~~~~~~~~~~~~~~~~~~
print('preproccessing dataset')
sys.stdout.flush()


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
reviews.drop(['comments'], 1, inplace=True)

#~~~~~~~~~~~~~~~~~~adding our db's data~~~~~~~~~~~~~~~~~~
print("adding our db's data")
sys.stdout.flush()


#read data from json files and prepair them
myusers = pd.read_json('bonus/users.json', orient='records')
myusers = myusers[['idUsers']]

myaccomodations = pd.read_json('bonus/accomodations.json', orient='records')
myaccomodations = myaccomodations[['idAccomodation']]

input_table = pd.MultiIndex.from_product([myusers['idUsers'], myaccomodations['idAccomodation']], names = ["myusers", "myaccomodations"])
input_table = input_table.to_frame(index=False, name=None)
input_table['score'] = 0

# print('_________index_________\n')
# print(input_table)

myreviews = pd.read_json('bonus/reviews.json', orient='records')
myreviews.drop(['Text'], 1, inplace=True)

mysearches = pd.read_json('bonus/searches.json', orient='records')
# mysearches = mysearches[['Users_idUsers','Accomodations_idAccomodation','rating']]

myreservations = pd.read_json('bonus/reservations.json', orient='records')
# myreservations = myreservations[['Users_idUsers','Accomodations_idAccomodation','rating']]

# reviews processing
myreviews = myreviews.rename(columns={"Users_idUsers": "myusers", "Accomodations_idAccomodation": "myaccomodations", "Rating": "score"})
input_table = pd.merge(input_table, myreviews, on=['myusers','myaccomodations'], how='left')
take_larger = lambda s1, s2: s2 if not np.isnan(s2) else s1
input_table['score'] = input_table['score_x'].combine(input_table['score_y'], take_larger)
input_table.drop(['score_x','score_y'], 1, inplace=True)

# reservations processing
myreservations.drop(['From','To', 'Persons', 'Price'], 1, inplace=True)
myreservations['score'] = 3
myreservations = myreservations.rename(columns={"Users_idUsers": "myusers", "Accomodations_idAccomodation": "myaccomodations"})
myreservations.drop_duplicates(subset=['myusers', 'myaccomodations'], inplace=True)


input_table = pd.merge(input_table, myreservations, on=['myusers','myaccomodations'], how='left')
take = lambda s1, s2: s2 if not np.isnan(s2) and s1 == 0 else s1
input_table['score'] = input_table['score_x'].combine(input_table['score_y'], take)
input_table.drop(['score_x','score_y'], 1, inplace=True)


# searches processing
mysearches = mysearches[['Users_idUsers', 'Accomodations_idAccomodation']]
mysearches['score'] = 2
mysearches = mysearches.rename(columns={"Users_idUsers": "myusers", "Accomodations_idAccomodation": "myaccomodations"})

input_table = pd.merge(input_table, mysearches, on=['myusers','myaccomodations'], how='left')
input_table['score'] = input_table['score_x'].combine(input_table['score_y'], take)
input_table.drop(['score_x','score_y'], 1, inplace=True)
# print(input_table)

input_table = input_table.rename(columns={"myusers": "reviewer_id", "myaccomodations": "listing_id"})
input_table = input_table[['listing_id', 'reviewer_id', 'score']]

allreviews = pd.concat([input_table, reviews], ignore_index=True)
allreviews['score'] = allreviews['score'].astype(int)
# print(allreviews)

#~~~~~~~~~~~~~~~~~~~~~~creation of final table~~~~~~~~~~~~~~~~~~~~~~~~~
print("creation of final table")
sys.stdout.flush()


allusers = allreviews['reviewer_id']
allusers.drop_duplicates(inplace=True, keep='first')
allusers.reset_index(drop=True, inplace=True)


allaccomodations = allreviews['listing_id']
allaccomodations.drop_duplicates(inplace=True, keep='first')
allaccomodations.reset_index(drop=True, inplace=True)

arrayshape = (len(allusers) + 1, len(allaccomodations) + 1)
test = np.empty(arrayshape, dtype=int)
# print(test.shape)

test[0][0] = -1
for user, i in zip(allusers, range(len(allusers))):
    test[i+1][0] = user

for acc, i in zip(allaccomodations, range(len(allaccomodations))):
    test[0][i+1] = acc

def insert_test(user, acc, value, array):
    users = array[: , 0]
    accs = array[0, :]

    index_user = np.where(users == user)
    index_acc = np.where(accs == acc)

    array[index_user[0], index_acc[0]] = value


for index, row in allreviews.iterrows():
#    print (row['listing_id'], row['reviewer_id'], row['score'])
    insert_test(row['reviewer_id'],row['listing_id'], row['score'], test)
# print(test)

# final = test[1:, 1:]
# print(final)

users = test[1:,0] #1d - array of user ids
accs = test[0, 1:] #1d - array of acc ids

#~~~~~~~~~~~~~~~~matrix factorization~~~~~~~~~~~~~~~~~~~~~
print("matrix factorization")
sys.stdout.flush()


mf = MF(test, K=10, learningRate=0.01)
allscores = mf.train()
allscores = np.round(allscores, decimals=2)

#~~~~~~~~~~~~~~~~file creation~~~~~~~~~~~~~~~~~~~~~
print("file creation")
sys.stdout.flush()


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)

numpyData = {"scores": allscores, "users": users, "accommodations": accs}
with open("./bonus/numpyData2.json", "w") as write_file:
    json.dump(numpyData, write_file, cls=NumpyArrayEncoder)
shutil.move('./bonus/numpyData2.json', './bonus/numpyData.json')


print("finished")
sys.stdout.flush()